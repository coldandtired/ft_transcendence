import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../../db/userChatsDb.js';
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';
import { sendMessageToGameIdUsers } from "./serverSocket.js";
import { notificationInviteReceived } from "./notificationMessages.js";

export function userLoginReceived(db: DatabaseSync, user: ShortUser) {

}

export function userSendUserChatReceived(db: DatabaseSync, message: Message) {
	if (message.chat == "!!") {
		if (message.gameId != null && (message.gameId.startsWith("l") || message.gameId.startsWith("m")))
			notificationInviteReceived(db, message);
		return;
	}
	if (Result.SUCCESS == addUserChat(db, message)) {
		sendMessageToGameIdUsers({
			type: MessageType.USER_SEND_USER_CHAT,
			fromId: message.fromId,
			toId: message.toId,
			chat: message.chat
		}, [message.fromId, message.toId]);
	}
}
