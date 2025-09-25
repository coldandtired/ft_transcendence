import { FastifyRequest, FastifyReply } from 'fastify';
import { createFriend, readFriends, deleteFriend } from '../../db/friendsDb.js';
import { getUserByEmail } from '../../db/userDB.js';
import { Result } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';
import { friendsView } from '../views/friendsView.js';
import { isUserAlreadyConnected } from '../sockets/serverSocket.js';

export function friendsList(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const friendsBox = readFriends(db, user.userId);
	if (Result.SUCCESS != friendsBox.result)
		return reply.send(friendsBox);

	friendsBox.contents.forEach(friend => {
		if (isUserAlreadyConnected(friend.friendId))
			friend.online = true;
	});

	return reply.send(JSON.stringify({
		result: Result.SUCCESS,
		value: translate(language, friendsView(friendsBox.contents))
	}));
}

export function addFriend(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const { friendId } = request.body as any;
	return reply.send(createFriend(db, user.userId, friendId));
}

export function removeFriend(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const { friendId } = request.body as any;
	return reply.send(deleteFriend(db, user.userId, friendId));
}

export function findFriend(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const json = request.body as any;
	if (user.email == json.email) {
		return reply.send({
			result: Result.ERR_SAME_EMAIL
		});
	}

	const userBox = getUserByEmail(db, json.email);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox);

	createFriend(db, user.userId, userBox.contents.userId);
	return reply.send(userBox);
}
