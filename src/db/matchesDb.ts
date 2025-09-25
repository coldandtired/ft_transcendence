import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, MatchGamer, Result, User, Match } from "../common/interfaces.js";
import { numbersToNick } from "../common/utils.js";

export function getMatch(db: DatabaseSync, gameId: string): Box<Match> {
	try {
		const select = db.prepare("SELECT * FROM matches WHERE game_id = ?");
		const match = sqlToMatch(select.get(gameId));
		return {
			result: Result.SUCCESS,
			contents: match
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function markMatchGamerReady(db: DatabaseSync, user: User): Result {
	try {
		const select = db.prepare(`UPDATE matches SET g1_ready = 1 WHERE game_id = ?;`);
		select.run(user.gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToMatch(match: Record<string, SQLOutputValue>): Match {
	return null == match.g2_nick as string ? {
		g1: sqlToMatchGamer(match, 1),
		g2: null
	}
		: {
			g1: sqlToMatchGamer(match, 1),
			g2: sqlToMatchGamer(match, 2)
		}
}

function sqlToMatchGamer(match: Record<string, SQLOutputValue>, gamerNumber: number): MatchGamer {
	return {
		nick: numbersToNick(match[`g${gamerNumber}_nick`] as string),
		ready: Boolean(match[`g${gamerNumber}_ready`] as number),
		score: match[`g${gamerNumber}_score`] as number,
		userId: match[`g${gamerNumber}_user_id`] as number
	}
}
