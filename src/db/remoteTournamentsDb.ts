import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Match, MatchGamer, Result, Tournament, Gamer } from "../common/interfaces.js";
import { updateGameId } from "./gameDb.js";
import { nickToNumbers, numbersToNick } from "../common/utils.js";

export function readRemoteTournament(db: DatabaseSync, gameId: string): Box<Tournament> {
	try {
		const select = db.prepare("SELECT * FROM tournaments WHERE game_id = ?");
		const tournament = sqlToTournament(select.get(gameId));
		return {
			result: Result.SUCCESS,
			contents: tournament
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function createRemoteTournament(db: DatabaseSync, gameId: string, gamers: Gamer[]): Result {
	try {
		gamers.forEach(gamer => {
			updateGameId(db, gameId, gamer.userId);
		});

		const select = db.prepare("INSERT INTO tournaments (game_id, m1_g1_user_id, m1_g2_user_id, m2_g1_user_id, m2_g2_user_id, m1_g1_nick, m1_g2_nick, m2_g1_nick, m2_g2_nick) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
		select.run(gameId, gamers[0].userId, gamers[1].userId, gamers[2].userId, gamers[3].userId, gamers[0].nick, gamers[1].nick, gamers[2].nick, gamers[3].nick);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function joinTournament(db: DatabaseSync, gameId: string, userId: number): Result {
	try {
		const select = db.prepare(`SELECT COUNT(game_id) AS count FROM users WHERE game_id = ?`);
		const game = select.get(gameId);
		if (4 == game.count)
			return Result.ERR_GAME_FULL;

		return updateGameId(db, gameId, userId);
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function markTournamentGamerReady(db: DatabaseSync, tournament: Tournament, gameId: string, userId: number): Result {
	const match = whichMatchIsUserIn(tournament, userId);
	const player = match.g1.userId == userId ? 1 : 2;
	try {
		const select = db.prepare(`UPDATE tournaments SET m${match.matchNumber}_g${player}_ready = 1 WHERE game_id = ?;`);
		select.run(gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateTournamentMatchResult(db: DatabaseSync, gameId: string, match: Match): Result {
	try {
		const select = db.prepare(`UPDATE tournaments SET m${match.matchNumber}_g1_score = ?, m${match.matchNumber}_g2_score = ? WHERE game_id = ?;`);
		select.run(match.g1.score, match.g2.score, gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateTournamentFinal(db: DatabaseSync, gameId: string, matches: Match[]): Result {
	try {
		if ((matches[0].g1.score + matches[0].g2.score > 0) && (matches[0].g1.score + matches[0].g2.score > 0)) {
			const g1 = matches[0].g1.score > matches[0].g2.score ? matches[0].g1 : matches[0].g2;
			const g2 = matches[1].g1.score > matches[1].g2.score ? matches[1].g1 : matches[1].g2;
			const select = db.prepare(`UPDATE tournaments SET m1_g1_nick = NULL, m1_g2_nick = NULL,
				m2_g1_nick = NULL, m2_g2_nick = NULL, m1_g1_user_id = NULL, m1_g2_user_id = NULL,
				m2_g1_user_id = NULL, m2_g2_user_id = NULL,
				m3_g1_nick = ?, m3_g2_nick = ?, m3_g1_user_id = ?, m3_g2_user_id = ? WHERE game_id = ?`);
			select.run(nickToNumbers(g1.nick), nickToNumbers(g2.nick), g1.userId, g2.userId, gameId);
			return Result.SUCCESS;
		}
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateTournamentAfterFinal(db: DatabaseSync, gameId: string, match: Match): Result {
	try {
		const select = db.prepare(`UPDATE tournaments SET m3_g1_score = ?, m3_g2_score = ? WHERE game_id = ?`);
		select.run(match.g1.score, match.g2.score, gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function whichMatchIsUserIn(tournament: Tournament, userId: number): Match {
	return tournament.matches.find(match => match.g1.userId == userId || match.g2.userId == userId);
}

function sqlToTournament(tournament: Record<string, SQLOutputValue>): Tournament {
	return {
		finished: Boolean((tournament.m3_g1_score as number) + (tournament.m3_g2_score as number) > 0),
		matches: [
			sqlToMatch(tournament, 1),
			sqlToMatch(tournament, 2),
			sqlToMatch(tournament, 3)
		]
	}
}

function sqlToMatch(tournament: Record<string, SQLOutputValue>, matchNumber: number): Match {
	return {
		g1: sqlToMatchGamer(tournament, matchNumber, 1),
		g2: sqlToMatchGamer(tournament, matchNumber, 2),
		matchNumber
	}
}

function sqlToMatchGamer(tournament: Record<string, SQLOutputValue>, matchNumber: number, gamerNumber: number): MatchGamer {
	return {
		nick: numbersToNick(tournament[`m${matchNumber}_g${gamerNumber}_nick`] as string),
		ready: Boolean(tournament[`m${matchNumber}_g${gamerNumber}_ready`] as number),
		score: tournament[`m${matchNumber}_g${gamerNumber}_score`] as number,
		userId: tournament[`m${matchNumber}_g${gamerNumber}_user_id`] as number
	}
}
