import { FastifyRequest, FastifyReply } from 'fastify';
import { createMatchResult } from '../../db/matchResultsDb.js';
import { numbersToNick } from '../../common/utils.js';

export function addMatchResult(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const { g1Score, g2Nick, g2Score } = request.body as any;
	const user = request.user;

	return reply.send(createMatchResult(db, user.userId, numbersToNick(g2Nick), g1Score, g2Score, false));
}
