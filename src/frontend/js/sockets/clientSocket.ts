import { Message, MessageType, Page } from "../../../common/interfaces.js";
import { userSendNotification, userSendTournamentNotification, userSendUserChat } from "../chat.js";
import { showPage } from "../index.js";
import { userLoggedOut, getUserId,  getUserGameId } from "../user.js";
import { matchFinishing, startingMatch, updateMatchDetails, updateMatchList, updateMatchLobby } from "./remoteMatchesMessages.js";
import { tournamentChat, tournamentMatchStart, tournamentOver, updateTournamentDetails, updateTournamentLobby } from "./remoteTournamentsMessages.js";
import { userInvite } from "./userMessages.js";

let socket: WebSocket;

export async function connectToWS() {
	if (!isConnected()) {
		try {
			await initClientSocket();
		} catch (err) {
		}
	}
}

export async function closeClientSocket() {
	socket.close();
	socket = null;
	await fetch("/auth/logout", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({})
	});
	userLoggedOut();
	showPage(Page.AUTH);
}

/**
 * Initialize WebSocket connection.
 */
function initClientSocket(): Promise<void> {
	const socketUrl = `wss://${window.location.host}/ws`;
	if (!socket)
		socket = new WebSocket(socketUrl);

	return new Promise(async (resolve, reject) => {
		socket!.onopen = () => resolve();

		socket!.onmessage = async (event) => handleServerMessage(JSON.parse(event.data));		

		socket!.onerror = (err) => {
			reject(err);
		};
	});
}

/*
	Checkes whether it's safe to use the socket
*/
export function isConnected(): boolean {
	return socket && 1 == socket.readyState;
}

/*
	Sends a message from a client to the server
*/
export async function sendMessageToServer(message: Message) {
	if (1 == socket?.OPEN) {		
		message.fromId = getUserId();
		message.gameId = getUserGameId();
		socket.send(JSON.stringify(message));
	}
}

/*
	Grabs the current page (ACCOUNT, AUTH, CHAT, FOES, FRIENDS, GAME, USERS) from the HTML
*/
export function currentPage(): Page {
	const navBar = <HTMLElement>document.querySelector("#navBar");
	return Page[navBar.dataset.page];
}

/*
	Deals with a socket message from the server
*/
function handleServerMessage(message: Message) {
	switch (message.type) {
		case MessageType.USER_INVITE:
			userInvite(message);
			break;
		case MessageType.NOTIFICATION_INVITE:
			userSendNotification(message);
			break;
		case MessageType.NOTIFICATION_TOURNAMENT:
			userSendTournamentNotification(message);
			break;
		case MessageType.USER_SEND_USER_CHAT:
			userSendUserChat(message);
			break;

		case MessageType.GAME_LIST_CHANGED:
			updateMatchList();
			break;

		case MessageType.MATCH_LOBBY_CHANGED:
			updateMatchLobby(message);
			break;
		case MessageType.MATCH_OVER:
			matchFinishing();
			break;
		case MessageType.MATCH_READY:
			startingMatch(message);
			break;
		case MessageType.MATCH_UPDATE:
		case MessageType.MATCH_GOAL:
		case MessageType.MATCH_RESET:
		case MessageType.MATCH_END:
			updateMatchDetails(message);
			break;

		// Tournament messages
		case MessageType.TOURNAMENT_LOBBY_CHANGED:
			updateTournamentLobby(message);
			break;
		case MessageType.TOURNAMENT_CHAT:
			tournamentChat(message);
			break;
		case MessageType.TOURNAMENT_MATCH_START:
			tournamentMatchStart(message);
			break;
		case MessageType.TOURNAMENT_OVER:
			tournamentOver(message);
			break;
		case MessageType.TOURNAMENT_UPDATE:
			updateTournamentDetails(message);
			break;
	}
}
