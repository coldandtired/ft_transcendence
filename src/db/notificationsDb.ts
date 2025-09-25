import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Message, MessageType, Result, UserNotification } from "../common/interfaces.js";
import { numbersToNick } from "../common/utils.js";
import { updateWaiting } from "./userChatsDb.js";

export function readNotifications(db: DatabaseSync, userId: number): Box<UserNotification[]> {
	try {
		const select = db.prepare(`SELECT sent_at, user_id, game_id, notification_type, nick FROM notifications INNER JOIN users ON users.user_id = from_id WHERE to_id = ? ORDER BY sent_at DESC`);
		const notifications = select.all(userId).map(chat => sqlToNotification(chat));

		updateWaiting(db, userId, 0, 0);

		return {
			result: Result.SUCCESS,
			contents: notifications
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

export function createInviteNotification(db: DatabaseSync, message: Message): Result {
	try {
		const select = db.prepare("INSERT INTO notifications (from_id, to_id, notification_type, sent_at) VALUES (?, ?, ?, ?)");
		select.run(message.fromId, message.toId, MessageType.NOTIFICATION_INVITE, new Date().toISOString());
		return updateWaiting(db, message.toId, 0, 1);
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function createTournamentNotification(db: DatabaseSync, message: Message): Result {
	try {
		const select = db.prepare("INSERT INTO notifications (from_id, to_id, notification_type, sent_at) VALUES (?, ?, ?, ?)");
		select.run(message.toId, message.toId, MessageType.NOTIFICATION_TOURNAMENT, new Date().toISOString());
		return updateWaiting(db, message.toId, 0, 1);
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateNotificationSeen(db: DatabaseSync, userId: number) {
	try {
		let select = db.prepare("UPDATE notifications SET seen = 0 WHERE user_id = ?");
		const result = select.run(userId);
		if (0 == result.changes) {
			select = db.prepare("INSERT INTO notifications (user_id, seen) VALUES (?, ?)");
			select.run(userId, 0);
		}
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToNotification(userChatMessage: Record<string, SQLOutputValue>): UserNotification {
	return {
		fromId: userChatMessage.user_id as number,
		fromNick: numbersToNick(userChatMessage.nick as string),
		gameId: userChatMessage.game_id as string,
		sentAt: new Date(userChatMessage.sent_at as string),
		type: MessageType[userChatMessage.notification_type as string]
	};
}
