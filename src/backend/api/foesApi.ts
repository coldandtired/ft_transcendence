import { FastifyRequest, FastifyReply } from 'fastify';
import { createFoe, readFoes, deleteFoe, readFoe } from '../../db/foesDb.js';
import { Result } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';
import { foesView } from '../views/foesView.js';

export function foesList(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const foesBox = readFoes(db, user.userId);
	if (Result.SUCCESS != foesBox.result)
		return reply.send(foesBox);

	return reply.send(JSON.stringify({
		result: Result.SUCCESS,
		value: translate(language, foesView(foesBox.contents))
	}));
}

export function isFoe(request: FastifyRequest, reply: FastifyReply) {	
	const db = request.db;
	const user = request.user;
	const foeId = (request.params as any).foeId;
	return reply.send(readFoe(db, user.userId, foeId));
}

export function addFoe(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const { foeId } = request.body as any;
	return reply.send(createFoe(db, user.userId, foeId));
}

export function removeFoe(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const { foeId } = request.body as any;
	return reply.send(deleteFoe(db, user.userId, foeId));
}
