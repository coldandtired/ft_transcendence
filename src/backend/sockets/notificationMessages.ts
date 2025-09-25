import { DatabaseSync } from "node:sqlite";
import { Message, MessageType, Result } from '../../common/interfaces.js';
import { createInviteNotification } from '../../db/notificationsDb.js';
import { sendMessageToUser } from './serverSocket.js';

export function notificationInviteReceived(db: DatabaseSync, message: Message) {
	const result = createInviteNotification(db, message);

	if (Result.SUCCESS != result)
		return;

	sendMessageToUser({
		type: MessageType.NOTIFICATION_INVITE,
		fromId: message.fromId,
		content: message.content
	}, message.toId);
}
