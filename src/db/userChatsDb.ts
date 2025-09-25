import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, ChatMessage, ChatPartner, Message, Result, ShortUser, UserChatMessage, UserType } from "../common/interfaces.js";
import { numbersToNick } from "../common/utils.js";

export function hasWaitingChats(db: DatabaseSync, userId: number): Box<boolean> {
	try {
		const select = db.prepare(`SELECT COALESCE(sum(waiting), 0) AS count FROM chats_waiting WHERE user_id = ?`);
		const seenCount = select.get(userId);
		return {
			result: Result.SUCCESS,
			contents: (seenCount.count as number) != 0
		}
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

export function hasWaitingChatsByPartner(db: DatabaseSync, userId: number, partnerId: number): Box<boolean> {
	try {
		const select = db.prepare(`SELECT COALESCE(sum(waiting), 0) AS count FROM chats_waiting WHERE user_id = ? AND partner_id = ?`);
		const seenCount = select.get(userId, partnerId);
		return {
			result: Result.SUCCESS,
			contents: (seenCount.count as number) != 0
		}
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

export function updateWaiting(db: DatabaseSync, userId: number, partnerId: number, waiting: number) {
	try {
		let select = db.prepare("UPDATE chats_waiting SET waiting = ? WHERE user_id = ? AND partner_id = ?");
		const result = select.run(waiting, userId, partnerId);
		if (0 == result.changes) {
			select = db.prepare("INSERT INTO chats_waiting (waiting, user_id, partner_id) VALUES (?, ?, ?)");
			select.run(waiting, userId, partnerId);
		}
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}


/*
	Gets a list of ids that are in a private chat with the user
*/
export function outgoingChatsList(db: DatabaseSync, userId: number): Box<ChatPartner[]> {
	try {
		const select = db.prepare(`SELECT to_id AS partner_id, sent_at, message, avatar, type, nick FROM user_chats INNER JOIN users ON users.user_id = user_chats.to_id WHERE from_id = ?`);
		const partners = select.all(userId).map(chat => sqlToUserChatPartner(chat));
		const partnerIds = new Set();
		return {
			result: Result.SUCCESS,
			contents: partners.filter(({ userId }) => !partnerIds.has(userId) && partnerIds.add(userId))
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

/*
	Gets a list of ids that are in a private chat with the user
*/
export function incomingChatsList(db: DatabaseSync, userId: number): Box<ChatPartner[]> {
	try {
		const select = db.prepare(`SELECT from_id AS partner_id, sent_at, message, avatar, type, nick FROM user_chats INNER JOIN users ON users.user_id = user_chats.from_id WHERE to_id = ?`);
		const partners = select.all(userId).map(chat => sqlToUserChatPartner(chat));
		const partnerIds = new Set();
		return {
			result: Result.SUCCESS,
			contents: partners.filter(({ userId }) => !partnerIds.has(userId) && partnerIds.add(userId))
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

/*
	Gets all the user's messages
*/
export function partnerChats(db: DatabaseSync, userId: number, partnerId: number): Box<UserChatMessage[]> {
	try {
		let select = db.prepare("SELECT * FROM user_chats WHERE (to_id = ? AND from_id = ?) OR (from_id = ? AND to_id = ?) ORDER BY sent_at DESC");
		const messages = select.all(userId, partnerId, userId, partnerId).map(userChatMessage => sqlToUserChatMessage(userChatMessage));

		updateWaiting(db, userId, partnerId, 0);

		// select = db.prepare("UPDATE chats_waiting SET waiting = 0 WHERE user_id = ? AND partner_id = ?");
		// const result = select.run(userId, partnerId);
		// if (0 == result.changes) {
		// 	select = db.prepare("INSERT INTO chats_waiting (user_id, partner_id, waiting) VALUES (?, ?, ?)");
		// 	select.run(userId, partnerId, 0);
		// }
		return {
			result: Result.SUCCESS,
			contents: messages
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

/*
	Adds a private message (DM)
*/
export function addUserChat(db: DatabaseSync, message: Message): Result {
	try {
		let select = db.prepare("INSERT INTO user_chats (to_id, from_id, message, sent_at) VALUES (?, ?, ?, ?)");
		select.run(message.toId, message.fromId, message.chat, new Date().toISOString());

		return updateWaiting(db, message.toId, message.fromId, 1);
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToUserChatPartner(userChatPartner: Record<string, SQLOutputValue>): ChatPartner {
	return {
		avatar: userChatPartner.avatar as string,
		gameId: userChatPartner.game_id as string,
		nick: numbersToNick(userChatPartner.nick as string),
		hasUnseen: Boolean(userChatPartner.seen as number),
		userId: userChatPartner.partner_id as number,
		userType: UserType[userChatPartner.type as string]
	};
}

function sqlToUserChatMessage(userChatMessage: Record<string, SQLOutputValue>): UserChatMessage {
	return {
		fromId: userChatMessage.from_id as number,
		message: userChatMessage.message as string,
		seen: Boolean(userChatMessage.seen as number),
		sentAt: new Date(userChatMessage.sent_at as string)
	};
}
