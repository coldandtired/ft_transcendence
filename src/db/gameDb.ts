import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Game, GameType, MatchGamer, Result } from "../common/interfaces.js";
import { numbersToNick } from "../common/utils.js";

export function getGames(db: DatabaseSync): Box<Game[]> {
	try {
		const select = db.prepare("SELECT game_id, GROUP_CONCAT(nick) AS nicks FROM users WHERE NOT game_id IS NULL GROUP BY game_id");
		const games: Game[] = select.all().map(game => sqlToGame(game)).filter((game) => !game.gameId.startsWith("r"));
		return {
			result: Result.SUCCESS,
			contents: games
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function gamePlayers(db: DatabaseSync, gameId: string): Box<MatchGamer[]> {
	try {
		const select = db.prepare("SELECT avatar, game_id, user_id, nick FROM users WHERE game_id IS ?");
		const gamers = select.all(gameId).map(gamer => sqlToGamer(gamer));
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

export function updateGameId(db: DatabaseSync, gameId: string, userId: number): Result {
	try {
		const select = db.prepare(`UPDATE users SET game_id = ? WHERE user_id = ?`);
		select.run(gameId, userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToGame(game: Record<string, SQLOutputValue>): Game {
	const gameId = game.game_id as string;
	return {
		gameId: gameId as string,
		nicks: game.nicks as string,
		type: gameId.startsWith("m") ? GameType.MATCH : GameType.TOURNAMENT
	};
}

function sqlToGamer(gamer: Record<string, SQLOutputValue>): MatchGamer {
	return {
		avatar: gamer.avatar as string,
		nick: numbersToNick(gamer.nick as string),
		userId: gamer.user_id as number
	};
}
