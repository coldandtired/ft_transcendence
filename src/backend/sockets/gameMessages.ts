import { DatabaseSync } from "node:sqlite";
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';
import { removeUserFromMatch, usersInTournament } from '../../db/userDB.js';
import { onlineUsers, sendMessageToGameIdUsers, sendMessageToUsers } from "./serverSocket.js";
import { createTournamentChat, readTournamentChats } from "../../db/TournamentChatsDb.js";
import { tournamentChats } from "../api/tournamentApi.js";
import { remoteTournamentMessagesHtml } from "../views/remoteTournamentLobbyView.js";

export function userLogoutReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	message.gameId = user.gameId;
	const response = removeUserFromMatch(db, user.userId);

	if (Result.SUCCESS == response) {
		onlineUsers.delete(user.userId.toString());
		sendMessageToUsers({
			type: MessageType.GAME_LIST_CHANGED
		});
	}
}

export function tournamentChatReceived(db: DatabaseSync, message: Message) {
	const gamers = usersInTournament(db, message.gameId);
	if (Result.SUCCESS == createTournamentChat(db, message)) {
		const userIds = gamers.contents.map((gamer) => gamer.userId);
		sendMessageToGameIdUsers({
			type: MessageType.TOURNAMENT_CHAT
		}, userIds);
	}
}
