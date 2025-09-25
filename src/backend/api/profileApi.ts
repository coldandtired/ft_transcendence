import { FastifyRequest, FastifyReply } from 'fastify';
import { Result } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';
import { getUser, getUserById } from '../../db/userDB.js';
import { readMatchResults } from '../../db/matchResultsDb.js';
import { readFriends } from '../../db/friendsDb.js';
import { profileView } from '../../common/dynamicElements.js';
import { readFoes } from '../../db/foesDb.js';
import { accessToken } from '../../db/jwt.js';
import { isUserAlreadyConnected, onlineUsers } from '../sockets/serverSocket.js';

export function getProfile(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const { userId } = request.params as any;
	const userBox = getUserById(db, userId);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox);

	const user = userBox.contents;

	const matchResultsBox = readMatchResults(db, user.userId);

	if (Result.SUCCESS != matchResultsBox.result)
		return reply.send(matchResultsBox);

	const friendsBox = readFriends(db, request.user.userId);
	if (Result.SUCCESS != friendsBox.result)
		return reply.send(friendsBox);

	const foesBox = readFoes(db, request.user.userId);
	if (Result.SUCCESS != foesBox.result)
		return reply.send(foesBox);

	const isFriend = null != friendsBox.contents.find(friend => friend.userId == user.userId);
	const isFoe = null != foesBox.contents.find(foe => foe.userId == user.userId);

	let text = profileView(matchResultsBox.contents, isFriend, isFoe, user, request.user);
	return reply.send({
		result: Result.SUCCESS,
		value: translate(request.language, text)
	});
}

export function getSpecificUser(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const userId = (request.params as any).id;

	return reply.send(getUserById(db, userId));
}

export function getShortUser(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;

	const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox);

	const user = userBox.contents;
	const shortUser = {
		avatar: user.avatar,
		gameId: user.gameId,
		nick: user.nick,
		userId: user.userId,
		userType: user.userType
	}

	const accessTokenDate = new Date();
	accessTokenDate.setMinutes(accessTokenDate.getMinutes() + 15);
	const refreshTokenDate = new Date();
	refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);

	return reply.header(
		"Set-Cookie", `accessToken=${accessToken(user.userId)}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=${user.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send({
				result: Result.SUCCESS,
				contents: shortUser
			});
}

export function isConnected(request: FastifyRequest, reply: FastifyReply) {
	const result = isUserAlreadyConnected((request.params as any).id);
	const date = "Thu, 01 Jan 1970 00:00:00 UTC";
	return result ? reply.header(
		"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).send(Result.ERR_EMAIL_IN_USE)
		: reply.send(Result.SUCCESS);
}

export function isOnline(request: FastifyRequest, reply: FastifyReply) {
	const { id } = request.params as any;
	reply.send(onlineUsers.has(id.toString()) ? Result.SUCCESS : Result.ERR_NO_USER);
}
