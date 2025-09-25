import { DatabaseSync } from "node:sqlite";
import { Result } from "../common/interfaces.js";

/*
	Marks the previously-added secret as verified
*/
export function updateAppTotp(db: DatabaseSync, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET totp_type = 'APP' WHERE user_id = ?");
		select.run(id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Marks the previously-added secret as verified
*/
export function updateEmailTotp(db: DatabaseSync, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET totp_type = 'EMAIL' WHERE user_id = ?");
		select.run(id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Removes the TOTP secret and sets the verified column to 0
*/
export function updateTotp(db: DatabaseSync, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET totp_secret = NULL, totp_type = 'DISABLED' WHERE user_id = ?");
		select.run(id);
		return Result.SUCCESS;;
	}
	catch (e) {
		return Result.ERR_DB;;
	}
}

/*
	Adds a new TOTP secret to the DB. At this point it's unverified
*/
export function updateTotpSecret(db: DatabaseSync, secret: string, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET totp_secret = ? WHERE user_id = ?");
		select.run(secret, id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}
