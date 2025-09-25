import { DatabaseSync } from "node:sqlite";
import { addUserToMatch, removeUserFromMatch, usersByGameId } from '../../db/userDB.js';
import { Message, MessageType, Result } from '../../common/interfaces.js';
import { gamersHtml } from '../views/remoteMatchLobbyView.js';
import { sendMessageToGameIdUsers, sendMessageToOtherUsers, sendMessageToUser } from "./serverSocket.js";

export function matchJoinReceived(db: DatabaseSync, message: Message) {
	const { gameId, fromId } = message;
	if (Result.SUCCESS == addUserToMatch(db, gameId, fromId)) {
		const gamers = usersByGameId(db, gameId);
		if (Result.SUCCESS == gamers.result) {
			if (2 == gamers.contents.length) {
				const userIds = gamers.contents.map((gamer) => gamer.userId);
				sendMessageToGameIdUsers({
					type: MessageType.MATCH_READY,
					gameId,
					match: {
						g1: {
							nick: gamers.contents[0].nick,
							userId: gamers.contents[0].userId,
						},
						g2: {
							nick: gamers.contents[1].nick,
							userId: gamers.contents[1].userId,
						}
					}
				}, userIds);
			}

			const userIds = gamers.contents.map((gamer) => gamer.userId).filter((userId) => userId != fromId);
			sendMessageToGameIdUsers({
				type: MessageType.MATCH_LOBBY_CHANGED,
				content: gamersHtml(gamers.contents)
			}, userIds);

		}

		sendMessageToOtherUsers({
			type: MessageType.GAME_LIST_CHANGED
		}, fromId);
	}
}

export function matchLeaveReceived(db: DatabaseSync, gameId: string, fromId: number) {
	if (Result.SUCCESS == removeUserFromMatch(db, fromId)) {
		// const gamers = usersByGameId(db, gameId);
		// if (Result.SUCCESS == gamers.result) {
		// 	const userIds = gamers.contents.map((gamer) => gamer.userId).filter((userId) => userId != fromId);
		// 	sendMessageToGameIdUsers({
		// 		type: MessageType.MATCH_LOBBY_CHANGED,
		// 		gameId,
		// 		content: gamersHtml(gamers.contents)
		// 	}, userIds);
		// }

		sendMessageToOtherUsers({
			type: MessageType.GAME_LIST_CHANGED
		}, fromId);
	}
}

/* Forward game updates - handles ball sync, paddle movements, etc. */
export function matchUpdateReceived(db: DatabaseSync, message: Message) {
	sendMessageToUser({
		type: MessageType.MATCH_UPDATE,
		gameId: message.gameId,
		fromId: message.fromId,
		matchContent: message.matchContent
	}, message.toId);
}
