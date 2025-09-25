import { FastifyRequest, FastifyReply } from 'fastify';
import { addUser, allNicknames, getUserByEmail, loginUserdb, updateRefreshtoken } from '../../db/userDB.js';
import { Result, TotpType } from '../../common/interfaces.js';
import { compareSync } from 'bcrypt-ts';
import { accessToken, refreshToken } from '../../db/jwt.js';
import { addTotpEmail, sendTotpEmail } from './totpApi.js';

export function listUsers(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	// Don't send all details to the frontend
	return reply.send({
		result: Result.SUCCESS,
		contents: {
			userId: user.userId,
			nick: user.nick,
			gameId: user.gameId,
			totpType: user.totpType,
			userType: user.userType,
		}
	});
}

export function listNicknames(request: FastifyRequest, reply: FastifyReply) {
	const users = allNicknames(request.db);
	return reply.send(users);
}
