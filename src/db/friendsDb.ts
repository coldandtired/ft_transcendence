import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Friend, Result } from "../common/interfaces.js";
import { numbersToNick } from "../common/utils.js";
import { onlineUsers } from "../backend/sockets/serverSocket.js";

/*
	Gets all the user's friends
*/
export function readFriends(db: DatabaseSync, userId: number): Box<Friend[]> {
	try {
		const select = db.prepare("SELECT *, nick, game_id FROM friends INNER JOIN users ON users.user_id = friends.friend_id WHERE friends.user_id = ? ORDER BY nick");
		const friends = select.all(userId).map(friend => sqlToFriend(friend));
		return {
			result: Result.SUCCESS,
			contents: friends
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Adds a friend to a user's list
*/
export function createFriend(db: DatabaseSync, userId: number, friendId: number): Result {
	try {
		const select = db.prepare("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)");
		select.run(userId, friendId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Removes a friend from a user's list
*/
export function deleteFriend(db: DatabaseSync, userId: number, friendId: number): Result {
	try {
		const select = db.prepare("DELETE FROM friends WHERE user_id = ? AND friend_id = ?");
		select.run(userId, friendId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToFriend(friend: Record<string, SQLOutputValue>): Friend {
	return {
		friendId: friend.friend_id as number,
		nick: numbersToNick(friend.nick as string),
		online: onlineUsers.has(friend.friend_id.toString()),
		userId: friend.user_id as number
	};
}
