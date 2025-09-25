import { FastifyRequest, FastifyReply } from 'fastify';
import { accountView } from '../views/accountView.js';
import { frameView } from '../views/frameView.js';
import { Page, Result } from '../../common/interfaces.js';
import { hasWaitingChats } from '../../db/userChatsDb.js';

export function getAccountPage(request: FastifyRequest, reply: FastifyReply) {
	const user = request.user;
	const language = request.language;

	const booleanBox = hasWaitingChats(request.db, user.userId);
	const chatsWaiting = Result.SUCCESS == booleanBox.result ? booleanBox.contents as boolean : false;
	return reply.type("text/html").send(frameView({ user, language, page: Page.ACCOUNT }, chatsWaiting, accountView(user)));
}
