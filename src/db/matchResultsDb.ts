import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, MatchResult, Result } from "../common/interfaces.js";
import { nickToNumbers, numbersToNick } from "../common/utils.js";

/*
	Gets all the user's matches
*/
export function readMatchResults(db: DatabaseSync, userId: number): Box<MatchResult[]> {
	try {
		const select = db.prepare("SELECT * FROM match_results WHERE user_id = ? ORDER BY played_at DESC");
		const matchResults = select.all(userId).map(mathResult => sqlToMatchResult(mathResult));
		return {
			result: Result.SUCCESS,
			contents: matchResults
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function createMatchResult(db: DatabaseSync, userId: number, opponent: string, score: number, opponentScore: number, tournamentWin: boolean, date: Date = new Date()): Result {
	try {
		const select = db.prepare("INSERT INTO match_results (user_id, opponent, score, opponent_score, tournament_win, played_at) VALUES (?, ?, ?, ?, ?, ?)");
		select.run(userId, nickToNumbers(opponent), score, opponentScore, Number(tournamentWin), date.toISOString());
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToMatchResult(matchResult: Record<string, SQLOutputValue>): MatchResult {
	return {
		opponent: numbersToNick(matchResult.opponent as string),
		opponentScore: matchResult.opponent_score as number,
		playedAt: new Date(matchResult.played_at as string),
		score: matchResult.score as number,
		tournamentWin: Boolean(matchResult.tournament_win as number),
		userId: matchResult.user_id as number
	};
}
