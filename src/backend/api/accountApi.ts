import { FastifyRequest, FastifyReply } from 'fastify';
import { updateAvatar, updateNick, updatePassword } from '../../db/accountDb.js';
import { deleteToken, removeUserFromMatch } from '../../db/userDB.js';
import { Result } from '../../common/interfaces.js';

export function changeAvatar(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const { avatar } = request.body as any;
	return reply.send(updateAvatar(db, avatar, user.userId));
}

export function changeNick(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const { newNick } = request.body as any;
	return (reply.send(updateNick(db, newNick, user.userId)));
}

export function changePassword(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const { checkPassword, newPassword } = request.body as any;
	return reply.send(updatePassword(db, checkPassword, newPassword, user));
}

export function invalidateToken(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	let result = deleteToken(db, user.userId);
	if (Result.SUCCESS != result)
		return reply.send(result);

	// result = removeUserFromMatch(db, user.userId);
	// if (Result.SUCCESS != result)
	// 	return reply.send(result);

	const date = "Thu, 01 Jan 1970 00:00:00 UTC";
	return reply.header(
		"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).send(Result.SUCCESS);
}
