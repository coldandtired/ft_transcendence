import { FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { authView } from '../views/authView.js';
import { Page } from '../../common/interfaces.js';

export function getAuthPage(request: FastifyRequest, reply: FastifyReply) {
	const language = request.language;
	return reply.type("text/html").send(frameView({ user: null, language, page: Page.AUTH }, false, authView()));
}
