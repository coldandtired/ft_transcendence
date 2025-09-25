import { FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { tournamentChatReceived } from './gameMessages.js';
import { userSendUserChatReceived } from './userMessages.js';
import { getUser, usersByGameId } from '../../db/userDB.js';
import { g_gameScoreTotal, MatchGamer, Message, MessageType, Result } from '../../common/interfaces.js';
import { tournamentJoinReceived, tournamentGamerReadyReceived, tournamentMatchEndReceived, tournamentOverReceived, tournamentLeaveReceived } from './tournamentMessages.js';
import { matchJoinReceived, matchLeaveReceived, matchUpdateReceived } from './matchMessages.js';
import { notificationInviteReceived } from './notificationMessages.js';
import { createMatchResult } from '../../db/matchResultsDb.js';
import { numbersToNick } from '../../common/utils.js';
import { readRemoteTournament } from '../../db/remoteTournamentsDb.js';

export const onlineUsers = new Map<string, WebSocket>();

let db: DatabaseSync;

export function connectToServerSocket(socket: WebSocket, request: FastifyRequest) {
	db = request.db;

	const user = request.user;
	onlineUsers.set(user.userId.toString(), socket);

	socket?.on("message", (data: string) => {
		const message = JSON.parse(data as string);
		handleClientMessage(db, message);
	});

	socket?.on("close", async () => {
		onlineUsers.delete(user.userId.toString());
		const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (Result.SUCCESS == userBox.result) {
			const leavingUser = userBox.contents;
			if (null == leavingUser.gameId)
				return;

			const gameId = leavingUser.gameId;

			if (gameId.startsWith("m")) {
				const gamersBox = usersByGameId(db, gameId);
				if (Result.SUCCESS == gamersBox.result) {
					const gamers = gamersBox.contents;
					sendMessageToGameIdUsers({
						type: MessageType.MATCH_END,
						gameId,
						matchContent: {
							kind: "GAME_QUIT"
						}
					}, [gamers[0]?.userId, gamers[1]?.userId]);
					if (gamers.length > 1) {
						const opponent = gamers[0].userId == leavingUser.userId ? gamers[1] : gamers[0];
						createMatchResult(db, leavingUser.userId, numbersToNick(opponent.nick), 0, g_gameScoreTotal, false);
					}
				}
				matchLeaveReceived(db, gameId, leavingUser.userId);
			}
			else if (gameId.startsWith("r")) {
				matchLeaveReceived(db, gameId, leavingUser.userId);
				const tournamentBox = readRemoteTournament(db, gameId);
				if (Result.SUCCESS == tournamentBox.result) {
					const m1 = tournamentBox.contents.matches[0];
					const m2 = tournamentBox.contents.matches[1];
					const m3 = tournamentBox.contents.matches[2];
					if (m3.g1.userId == leavingUser.userId)
						quitMatch(gameId, leavingUser.userId, m3.g2);
					else if (m3.g2.userId == leavingUser.userId)
						quitMatch(gameId, leavingUser.userId, m3.g1);
					else if (m2.g1.userId == leavingUser.userId)
						quitMatch(gameId, leavingUser.userId, m2.g2);
					else if (m2.g2.userId == leavingUser.userId)
						quitMatch(gameId, leavingUser.userId, m2.g1);
					else if (m1.g1.userId == leavingUser.userId)
						quitMatch(gameId, leavingUser.userId, m1.g2);
					else if (m1.g2.userId == leavingUser.userId)
						quitMatch(gameId, leavingUser.userId, m1.g1);					
				}
			}
		}
	});
}

export function isUserAlreadyConnected(userId: number): boolean {
	return onlineUsers.has(userId.toString());
}

/*
	Sends the message to all connected users
*/
export function sendMessageToUsers(message: Message) {
	onlineUsers.forEach((socket, userId) => sendMessage(socket, message));
}

/*
	Sends the message to all connected users except the originator
*/
export function sendMessageToOtherUsers(message: Message, senderId: number) {
	onlineUsers.forEach((socket, userId) => {
		if (userId != senderId.toString()) {
			sendMessage(socket, message)
		}
	});
}

/*
	Sends the message to all users in the same match/lobby
*/
export function sendMessageToGameIdUsers(message: Message, gamerIds: number[]) {
	onlineUsers.forEach((socket, userId) => {
		if (-1 != gamerIds.indexOf(parseInt(userId))) {
			sendMessage(socket, message);
		}
	});
}

/*
	Sends the message to a specific user
*/
export function sendMessageToUser(message: Message, userId: number) {
	if (onlineUsers.has(userId.toString())) {
		sendMessage(onlineUsers.get(userId.toString()), message);
	}
}

/*
	Deals with a socket message from a client
*/
export function handleClientMessage(db: DatabaseSync, message: Message) {
	switch (message.type) {
		case MessageType.USER_SEND_USER_CHAT:
			userSendUserChatReceived(db, message);
			break;

		case MessageType.NOTIFICATION_INVITE:
			notificationInviteReceived(db, message);
			break;

		case MessageType.USER_READY:
			break;

		// Match messages
		case MessageType.MATCH_JOIN:
			matchJoinReceived(db, message);
			break;
		case MessageType.MATCH_LEAVE:
			matchLeaveReceived(db, message.gameId, message.fromId);
			break;

		case MessageType.MATCH_QUIT:
			const gamersBox = usersByGameId(db, message.gameId);
			if (Result.SUCCESS == gamersBox.result) {
				const gamers = gamersBox.contents;
				sendMessageToGameIdUsers({
					type: MessageType.MATCH_END,
					gameId: message.gameId,
					matchContent: {
						kind: "GAME_QUIT"
					}
				}, [gamers[0]?.userId, gamers[1]?.userId]);
				matchLeaveReceived(db, message.gameId, message.fromId);
			}
			break;
		case MessageType.MATCH_UPDATE:
		case MessageType.MATCH_GOAL:
		case MessageType.MATCH_RESET:
		case MessageType.MATCH_END:
			matchUpdateReceived(db, message);
			break;

		case MessageType.GAME_LIST_CHANGED:
			sendMessageToUsers(message);
			break;

		// Tournament messages
		case MessageType.TOURNAMENT_CHAT:
			tournamentChatReceived(db, message);
			break;
		case MessageType.TOURNAMENT_JOIN:
			tournamentJoinReceived(db, message);
			break;
		case MessageType.TOURNAMENT_LEAVE:
			tournamentLeaveReceived(db, message);
			break;
		case MessageType.TOURNAMENT_GAMER_READY:
			tournamentGamerReadyReceived(db, message);
			break;
		case MessageType.TOURNAMENT_MATCH_END:
			tournamentMatchEndReceived(db, message);
			break;
		case MessageType.TOURNAMENT_OVER:
			tournamentOverReceived(db, message);
			break;
	}
}

function sendMessage(socket: WebSocket, message: Message) {
	if (1 === socket.readyState)
		socket.send(JSON.stringify(message));
}

function quitMatch(gameId: string, leavingUserId: number, opponent: MatchGamer) {
	sendMessageToGameIdUsers({
		type: MessageType.MATCH_END,
		gameId,
		matchContent: {
			kind: "GAME_QUIT"
		}
	}, [opponent.userId]);
	//createMatchResult(db, leavingUserId, opponent.nick, 0, g_gameScoreTotal, false);
}
