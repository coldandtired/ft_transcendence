import { FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { getGames, gamePlayers } from '../../db/gameDb.js';
import { remoteMatchLobbyView } from '../views/remoteMatchLobbyView.js';
import { gameView } from '../views/gameView.js';
import { FrameParams, LocalTournament, Page, Result, Tournament } from '../../common/interfaces.js';
import { readTournamentChats } from '../../db/TournamentChatsDb.js';
import { readRemoteTournament } from '../../db/remoteTournamentsDb.js';
import { remoteTournamentView } from '../views/remoteTournamentView.js';
import { remoteTournamentLobbyView } from '../views/remoteTournamentLobbyView.js';
import { localTournamentView } from '../views/localTournamentView.js';
import { readLocalTournament } from '../../db/localTournamentsDb.js';
import { removeUserFromMatch } from '../../db/userDB.js';
import { hasWaitingChats } from '../../db/userChatsDb.js';

export function getGamePage(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const booleanBox = hasWaitingChats(request.db, user.userId);
	const chatsWaiting = Result.SUCCESS == booleanBox.result ? booleanBox.contents as boolean : false;

	// user is already in a game
	if (user.gameId) {
		const gameId = user.gameId;

		if (gameId.startsWith("t")) {
			const localTournamentBox = readLocalTournament(db, gameId);
			if (Result.SUCCESS == localTournamentBox.result)
				return localTournament(localTournamentBox.contents, chatsWaiting, request, reply);
		}
		else if (gameId.startsWith("r")) {
			const tournamentBox = readRemoteTournament(db, gameId);
			if (Result.SUCCESS == tournamentBox.result)
				return (remoteTournament(tournamentBox.contents, chatsWaiting, request, reply));
		}

		return lobby(chatsWaiting, request, reply);
	}

	return gameList(chatsWaiting, request, reply);
}

function localTournament(tournament: LocalTournament, chatsWaiting: boolean, request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const params: FrameParams = {
		page: Page.GAME,
		language,
		user
	};

	if (tournament.finished) {
		const result = removeUserFromMatch(db, user.userId);
		if (Result.SUCCESS != result)
			return reply.type("text/html").send(frameView(params, chatsWaiting));
	}

	return reply.type("text/html").send(frameView(params, chatsWaiting, localTournamentView(tournament, user)));
}

function lobby(chatsWaiting: boolean, request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const params: FrameParams = {
		page: Page.GAME,
		language,
		user
	};

	const gamersBox = gamePlayers(db, user.gameId);
	if (Result.SUCCESS != gamersBox.result) {
		params.result = gamersBox.result;
		return reply.type("text/html").send(frameView(params, chatsWaiting));
	}

	if (user.gameId.startsWith("m"))
		return reply.type("text/html").send(frameView(params, chatsWaiting, remoteMatchLobbyView(gamersBox.contents)));

	const chatsBox = readTournamentChats(db, user.gameId);
	if (Result.SUCCESS != chatsBox.result) {
		params.result = chatsBox.result;
		return reply.type("text/html").send(frameView(params, chatsWaiting));
	}

	return reply.type("text/html").send(frameView(params, chatsWaiting, remoteTournamentLobbyView(gamersBox.contents, chatsBox.contents, user.userId)));
}

function remoteTournament(tournament: Tournament, chatsWaiting: boolean, request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const params: FrameParams = {
		page: Page.TOURNAMENT,
		language,
		user
	};

	if (tournament.finished) {
		const result = removeUserFromMatch(db, user.userId);
		if (Result.SUCCESS != result)
			return reply.type("text/html").send(frameView(params, chatsWaiting));
	}

	const chatsBox = readTournamentChats(db, user.gameId);
	if (Result.SUCCESS != chatsBox.result) {
		params.result = chatsBox.result;
		return reply.type("text/html").send(frameView(params, chatsWaiting));
	}
	const frame = frameView(params, chatsWaiting, remoteTournamentView(tournament, chatsBox.contents, user));
	return reply.type("text/html").send(frame);

}

function gameList(chatsWaiting: boolean, request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;
	const gamesBox = getGames(db);

	const params: FrameParams = {
		page: Page.GAME,
		language,
		user
	};

	if (Result.SUCCESS != gamesBox.result) {
		params.result = gamesBox.result;
		return reply.type("text/html").send(frameView(params, chatsWaiting));
	}

	const frame = frameView(params, chatsWaiting, gameView(gamesBox.contents));
	return reply.type("text/html").send(frame);
}
