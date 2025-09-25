import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Result, LocalMatch, LocalGamer, LocalTournament } from "../common/interfaces.js";
import { numbersToNick } from "../common/utils.js";

export function readLocalTournament(db: DatabaseSync, gameId: string): Box<LocalTournament> {
	try {
		const select = db.prepare("SELECT * FROM local_tournaments WHERE game_id = ?");
		const tournament = sqlToLocalTournament(select.get(gameId));
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

export function createLocalTournament(db: DatabaseSync, gameId: string, gamers: string[]): Result {
	try {
		const select = db.prepare("INSERT INTO local_tournaments (game_id, m1_g1_nick, m1_g2_nick, m2_g1_nick, m2_g2_nick) VALUES (?, ?, ?, ?, ?)");
		select.run(gameId, gamers[0], gamers[1], gamers[2], gamers[3]);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateLocalTournament(db: DatabaseSync, gameId: string, match: LocalMatch): Result {
	try {
		let select = db.prepare(`UPDATE local_tournaments SET m${match.matchNumber}_g1_score = ?, m${match.matchNumber}_g2_score = ? WHERE game_id = ?;`);
		select.run(match.g1.score, match.g2.score, gameId);
		if (match.matchNumber < 3) {
			const nick = match.g1.score > match.g2.score ? match.g1.nick : match.g2.nick;
			let select = db.prepare(`UPDATE local_tournaments SET m3_g${match.matchNumber}_nick = ? WHERE game_id = ?;`);
			select.run(nick, gameId);
		}
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToLocalTournament(tournament: Record<string, SQLOutputValue>): LocalTournament {

	return {
		finished: Boolean(tournament.m3_g1_score && tournament.m3_g2_score),
		matches: [
			sqlToLocalMatch(tournament, 1),
			sqlToLocalMatch(tournament, 2),
			sqlToLocalMatch(tournament, 3)
		]
	}
}

function sqlToLocalMatch(tournament: Record<string, SQLOutputValue>, matchNumber: number): LocalMatch {
	return {
		g1: sqlToLocalGamer(tournament, matchNumber, 1),
		g2: sqlToLocalGamer(tournament, matchNumber, 2),
		matchNumber
	}
}

function sqlToLocalGamer(tournament: Record<string, SQLOutputValue>, matchNumber: number, gamerNumber: number): LocalGamer {
	return {
		nick: numbersToNick(tournament[`m${matchNumber}_g${gamerNumber}_nick`] as string),
		score: tournament[`m${matchNumber}_g${gamerNumber}_score`] as number,
		userId: tournament[`m${matchNumber}_g${gamerNumber}_user_id`] as number
	}
}
