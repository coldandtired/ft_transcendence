import { DatabaseSync } from "node:sqlite";
import { compareSync } from "bcrypt-ts";
import { hashPassword } from "./jwt.js";
import { Result, User } from "../common/interfaces.js";

/*
	Replaces a user's avatar with a new one
*/
export function updateAvatar(db: DatabaseSync, avatar: string, id: number): Result {
	try {
		const temp = Buffer.from(avatar, "base64");
		avatar = temp.toString("utf8");
		const select = db.prepare("UPDATE users SET avatar = ? WHERE user_id = ?");
		select.run(avatar, id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Replaces the user's nickname with a new one - must be unique!
*/
export function updateNick(db: DatabaseSync, newNick: string, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET nick = ? WHERE user_id = ?");
		select.run(newNick, id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Replace a user's password with a new one
*/
export function updatePassword(db: DatabaseSync, checkPassword: string,  newPassword: string, user: User): Result {
	if (compareSync(checkPassword, user.password)) {
		const hashedPassword = hashPassword(newPassword);
		try {
			const select = db.prepare("UPDATE users SET password = ? WHERE user_id = ?");
			select.run(hashedPassword, user.userId);
			return Result.SUCCESS;
		}
		catch (e) {
			return Result.ERR_DB;;
		}
	}
	else
		return Result.ERR_FORBIDDEN;
}
