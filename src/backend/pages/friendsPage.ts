import { FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { translate } from '../../common/translations.js';
import { Page, Result } from '../../common/interfaces.js';
import { readFriends } from '../../db/friendsDb.js';
import { friendsView } from '../views/friendsView.js';
import { hasWaitingChats } from '../../db/userChatsDb.js';

export function getFriendsPage(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const booleanBox = hasWaitingChats(request.db, user.userId);
	const chatsWaiting = Result.SUCCESS == booleanBox.result ? booleanBox.contents as boolean : false;

	const usersBox = readFriends(db, user.userId);
	if (Result.SUCCESS != usersBox.result)
		return reply.type("text/html").send(frameView({
			language,
			result: usersBox.result,
			user
		}, chatsWaiting));

	let text = friendsView(usersBox.contents);
	text = translate(language, text);

	return reply.type("text/html").send(frameView({ user, language, page: Page.FRIENDS }, chatsWaiting, text));
}
