import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { compareSync } from "bcrypt-ts";
import { accessToken, hashPassword, refreshToken, validJWT } from "./jwt.js";
import { defaultAvatar } from "./defaultAvatar.js";
import { Result, User, UserType, Box, Gamer, TotpType, ShortUser } from "../common/interfaces.js";
import { updateGameId } from "./gameDb.js";
import { adjectives } from "./adjectives.js";
import { animals } from "./animals.js";
import { nickToNumbers, numbersToNick } from "../common/utils.js";

export function usersByGameId(db: DatabaseSync, gameId: string): Box<Gamer[]> {
	try {
		const select = db.prepare("SELECT user_id, nick, avatar from users WHERE game_id = ?");
		const gamers = select.all(gameId).map(gamer => sqlToGamer(gamer));;
		return {
			result: Result.SUCCESS,
			contents: gamers
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function usersInTournament(db: DatabaseSync, gameId: string): Box<Gamer[]> {
	try {
		const select = db.prepare("SELECT avatar, user_id, nick from users WHERE game_id = ?");
		const gamers = select.all(gameId).map(gamer => sqlToGamer(gamer));;
		return {
			result: Result.SUCCESS,
			contents: gamers
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function addUserToMatch(db: DatabaseSync, gameId: string, userId: number): Result {
	try {
		let select = db.prepare(`SELECT COUNT(game_id) AS count FROM users WHERE game_id = ?`);
		const game = select.get(gameId);

		if (2 == game.count)
			return Result.ERR_GAME_FULL;

		return updateGameId(db, gameId, userId);
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function removeUserFromMatch(db: DatabaseSync, userId: number): Result {
	try {
		let select = db.prepare(`UPDATE users SET game_id = NULL WHERE user_id = ?`);
		select.run(userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function removeUsersFromMatch(db: DatabaseSync, gameId: string): Result {
	try {
		let select = db.prepare(`UPDATE users SET game_id = NULL WHERE game_id = ?`);
		select.run(gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}


function sqlToGamer(gamer: Record<string, SQLOutputValue>): Gamer {
	return {
		avatar: gamer.avatar as string,
		nick: gamer.nick as string,
		userId: gamer.user_id as number
	}
}

/*
	Gets a user using the refresh token if it's still valid
*/
function getUserByRefreshToken(db: DatabaseSync, refreshToken: string): Box<User> {
	const valid = validJWT(refreshToken);
	if (valid) {
		let payload = refreshToken.split(".")[1];
		payload = atob(payload);
		const { exp } = JSON.parse(payload);
		const date = new Date(exp);
		if (date < new Date())
			return {
				result: Result.ERR_EXPIRED_TOKEN
			};

		const select = db.prepare("SELECT * FROM users WHERE refresh_token = ?");
		const user = select.get(refreshToken);
		if (!user) {
			return {
				result: Result.ERR_NO_USER
			}
		}
		return {
			result: Result.SUCCESS,
			contents: sqlToUser(user)
		};
	}
	return {
		result: Result.ERR_NO_USER
	}
}

/*
	Returns a complete user from the DB
*/
export function getUser(db: DatabaseSync, accessToken: string, refreshToken: string): Box<User> {
	try {
		const valid = validJWT(accessToken);
		if (valid) {
			let payload = accessToken.split(".")[1];
			payload = atob(payload);
			const { sub, exp } = JSON.parse(payload);
			const date = new Date(exp);
			if (date < new Date()) {
				return getUserByRefreshToken(db, refreshToken);
			}

			const select = db.prepare("SELECT * FROM users WHERE user_id = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					result: Result.ERR_NO_USER
				};
			}
			return {
				result: Result.SUCCESS,
				contents: sqlToUser(user)
			};
		}
		else
			return getUserByRefreshToken(db, refreshToken);
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		}
	}
}

/*
	Adds a user to the DB after a sign up with email/password
*/
export function addUser(db: DatabaseSync, { email, password }) {
	try {
		const stringBox = getNickname(db);
		if (Result.SUCCESS != stringBox.result)
			return {
				result: stringBox.result
			};

		const pw = hashPassword(password);
		const insert = db.prepare('INSERT INTO users (nick, email, password, avatar) VALUES (?, ?, ?, ?)');
		const statementSync = insert.run(stringBox.contents, email, pw, defaultAvatar);

		const userId: number = statementSync.lastInsertRowid as number;
		const token = refreshToken(userId);
		updateRefreshtoken(db, {
			userId, refreshToken: token
		});

		return {
			result: Result.SUCCESS,
			contents: {
				avatar: defaultAvatar,
				gameId: null,
				nick: numbersToNick(stringBox.contents),
				userId,
				userType: UserType.USER
			},
			accessToken: accessToken(userId),
			refreshToken: token
		};
	}
	catch (e) {
		if ("constraint failed" == e.errstr) {
			return {
				result: Result.ERR_EMAIL_IN_USE
			}
		}
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Adds a guest to the DB
*/
export function createGuest(db: DatabaseSync): Box<ShortUser> {
	try {
		const stringBox = getNickname(db);
		if (Result.SUCCESS != stringBox.result)
			return {
				result: stringBox.result
			}

		const insert = db.prepare('INSERT INTO users (nick, type, avatar) VALUES (?, ?, ?)');
		const statementSync = insert.run(stringBox.contents, UserType[UserType.GUEST], defaultAvatar);
		const id: number = statementSync.lastInsertRowid as number;
		removeUserFromMatch(db, id);
		return {
			result: Result.SUCCESS,
			contents: {
				avatar: defaultAvatar,
				gameId: null,
				nick: numbersToNick(stringBox.contents),
				userId: id,
				userType: UserType.GUEST
			}
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	After a successful Google Sign-in/up, gets the user from the DB or adds it
*/
export function addGoogleUser(db: DatabaseSync, { email, avatar }): Box<string[]> {
	try {
		let userBox = getUserByEmail(db, email);
		if (Result.ERR_DB == userBox.result)
			return {
				result: Result.ERR_DB
			};

		if (Result.SUCCESS == userBox.result) {
			const token = refreshToken(userBox.contents.userId);
			updateRefreshtoken(db, {
				userId: userBox.contents.userId,
				refreshToken: token
			});
			userBox.contents.refreshToken = token;
			return {
				result: Result.SUCCESS,
				contents: [
					accessToken(userBox.contents.userId),
					token
				]
			};
		}

		const stringBox = getNickname(db);
		if (Result.SUCCESS != stringBox.result)
			return {
				result: stringBox.result
			};

		const insert = db.prepare('INSERT INTO users (nick, email, avatar, type) VALUES (?, ?, ?, ?)');
		const statementSync = insert.run(stringBox.contents, email, avatar, UserType.GOOGLE);
		const userId: number = statementSync.lastInsertRowid as number;
		const token = refreshToken(userId);
		removeUserFromMatch(db, userId);
		updateRefreshtoken(db, {
			userId,
			refreshToken: token
		});
		return {
			result: Result.SUCCESS,
			contents: [
				accessToken(userId),
				token
			]
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Gets a user from the DB after an email/password login
*/
export function loginUserdb(db: DatabaseSync, { email, password }): Box<User> {
	try {
		const userBox = getUserByEmail(db, email);
		if (Result.SUCCESS != userBox.result)
			return userBox;

		const user = userBox.contents;

		if (compareSync(password, user.password)) {
			const token = refreshToken(user.userId);
			updateRefreshtoken(db, {
				userId: user.userId, refreshToken: token
			});
			user.accessToken = accessToken(user.userId);
			user.refreshToken = token;
			removeUserFromMatch(db, user.userId);
			return {
				result: Result.SUCCESS,
				contents: user
			}
		}
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Gets a user from the DB after an email/password login
*/
export function loginUserWithTOTP(db: DatabaseSync, { email, password, code }): Box<User> {
	try {
		const userBox = getUserByEmail(db, email);
		if (Result.SUCCESS != userBox.result) {
			return userBox;
		}

		const user = userBox.contents;

		// let totp = new OTPAuth.TOTP({
		// 			issuer: "Transcendence",
		// 			label: user.email,
		// 			algorithm: "SHA256",
		// 			digits: 6,
		// 			period: 30,
		// 			secret: user.totpSecret,
		// 		});

		// 		const params = JSON.parse(request.body as string);
		// 		if (null == totp.validate({ token: params.code, window: 1 })) {

		if (compareSync(password, user.password)) {
			const token = refreshToken(user.userId);
			updateRefreshtoken(db, {
				userId: user.userId, refreshToken: token
			});
			user.accessToken = accessToken(user.userId);
			user.refreshToken = token;
			return {
				result: Result.SUCCESS,
				contents: user
			}
		}
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

// Finds the user in the DB by email
export function getUserById(db: DatabaseSync, userId: number): Box<ShortUser> {
	try {
		const select = db.prepare("SELECT * FROM users WHERE user_id = ?");
		const user = select.get(userId);
		if (user) {
			return {
				result: Result.SUCCESS,
				contents: sqlToShortUser(user)
			}
		}
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

// Finds the user in the DB by email
export function getUserByEmail(db: DatabaseSync, email: string): Box<User> {
	try {
		const select = db.prepare("SELECT * FROM users WHERE email = ?");
		const user = select.get(email);
		if (user) {
			return {
				result: Result.SUCCESS,
				contents: sqlToUser(user)
			}
		}
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function updateRefreshtoken(db: DatabaseSync, { userId, refreshToken }): Result {
	try {
		const select = db.prepare("UPDATE users SET refresh_token = ? WHERE user_id = ?");
		select.run(refreshToken, userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function deleteToken(db: DatabaseSync, userId: number): Result {
	try {
		const select = db.prepare("UPDATE users SET refresh_token = NULL WHERE user_id = ?");
		select.run(userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Returns a list of all nicknames currently in the DB
*/
export function allNicknames(db: DatabaseSync): Box<string[]> {
	try {
		const select = db.prepare("SELECT nick FROM users");
		const list = select.all();

		let nicknames = [];
		list.forEach((user) => {
			nicknames.push(user.Nick);
		});

		return {
			result: Result.SUCCESS,
			contents: nicknames
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Returns a list of all nicknames currently in the DB
*/
export function allUsers(db: DatabaseSync): Box<ShortUser[]> {
	try {
		const select = db.prepare("SELECT user_id, nick FROM users");
		const users = select.all().map(user => sqlToShortUser(user));

		return {
			result: Result.SUCCESS,
			contents: users.sort((a, b) => a.nick.localeCompare(b.nick))
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function allOtherUsers(db: DatabaseSync, user: User): Box<ShortUser[]> {
	if (UserType.GUEST == user.userType) {
		return {
			result: Result.ERR_FORBIDDEN
		};
	}
	try {
		const select = db.prepare("SELECT * FROM users WHERE ? != user_id ORDER BY nick");
		const users = select.all(user.userId).map(user => sqlToShortUser(user));

		return {
			result: Result.SUCCESS,
			contents: users
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function allChattableUsers(db: DatabaseSync, user: User): Box<ShortUser[]> {
	if (UserType.GUEST == user.userType) {
		return {
			result: Result.ERR_FORBIDDEN
		};
	}
	try {
		const select = db.prepare("SELECT * FROM users WHERE ? != user_id AND type != 'GUEST'");
		const users = select.all(user.userId).map(user => sqlToShortUser(user));

		return {
			result: Result.SUCCESS,
			contents: users.sort((a, b) => a.nick.localeCompare(b.nick))
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function getNickname(db: DatabaseSync): Box<string> {
	const response = allNicknames(db);
	if (Result.SUCCESS != response.result)
		return {
			result: response.result
		};

	let nickname = generateNickname();
	while (response.contents.includes(nickname))
		nickname = generateNickname();

	return {
		result: Result.SUCCESS,
		contents: nickname
	};
}

export function generateNickname(): string {
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const animal = animals[Math.floor(Math.random() * animals.length)];

	return nickToNumbers(`${adjective} ${animal}`);
}

function sqlToUser(sqlUser: Record<string, SQLOutputValue>): User {
	return {
		avatar: sqlUser.avatar as string,
		email: sqlUser.email as string,
		gameId: sqlUser.game_id as string,
		nick: numbersToNick(sqlUser.nick as string),
		password: sqlUser.password as string,
		refreshToken: sqlUser.refresh_token as string,
		totpEmail: Boolean(sqlUser.totp_email as number),
		totpType: sqlUser.totp_type ? TotpType[sqlUser.totp_type as number] : TotpType.DISABLED,
		totpSecret: sqlUser.totp_secret as string,
		userType: UserType[sqlUser.type as string],
		userId: sqlUser.user_id as number
	};
}

function sqlToShortUser(sqlUser: Record<string, SQLOutputValue>): ShortUser {
	return {
		avatar: sqlUser.avatar as string,
		gameId: sqlUser.game_id as string,
		nick: numbersToNick(sqlUser.nick as string),
		userId: sqlUser.user_id as number,
		userType: UserType[sqlUser.type as string]
	};
}
