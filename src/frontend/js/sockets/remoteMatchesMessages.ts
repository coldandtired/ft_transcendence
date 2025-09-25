import { Message, MessageType, Page, Result } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { nickToNumbers, numbersToNick } from "../../../common/utils.js";
import { g_game, GameMode } from "../class/game.js";
import { gameListeners } from "../game/gamePage.js";
import { getLanguage, showPage } from "../index.js";
import { getUserGameId, getUserId, removeUserGameId, setUserGameId } from "../user.js";
import { currentPage, sendMessageToServer } from "./clientSocket.js";

export function createRemoteMatch() {
	const gameId = `m${Date.now().toString(36).substring(5)}`;
	joiningMatch(gameId);
}

export async function joiningMatch(gameId: string): Promise<void> {
	sendMessageToServer({
		type: MessageType.MATCH_JOIN,
		gameId
	});
}

export function matchFinishing() {
	removeUserGameId();
}

export function matchGamerLeaving() {
	sendMessageToServer({
		type: MessageType.MATCH_LEAVE
	});
}

export async function updateMatchList() {
	if (Page.GAME == currentPage() && !getUserGameId()) {
		showPage(Page.GAME);
	}
}

export async function updateMatchDetails(message: Message) {
	// Handle game events (keys, goals, resets, etc.)
	if (message.matchContent && message.matchContent.kind) {
		g_game.netOnMessage(message);
	}
}

export async function updateMatchLobby(message: Message) {
	const matchLobbyDetailsContainer = document.querySelector("#matchLobbyDetailsContainer");
	if (matchLobbyDetailsContainer)
		matchLobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
	gameListeners();
}

// There are 2 players in the lobby
export async function startingMatch(message: Message) {

	setTimeout(async () => {
		const match = message.match;
		const localIndex = match.g1.userId === getUserId() ? 0 : 1;

		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			dialog.addEventListener("matchOver", async (e: CustomEvent) => {
				await fetch("/match-results/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						g2Nick: nickToNumbers(match.g2.userId == getUserId() ? match.g1.nick : match.g2.nick),
						g1Score: match.g1.userId == getUserId() ? e.detail["g1Score"] : e.detail["g2Score"],
						g2Score: match.g1.userId == getUserId() ? e.detail["g2Score"] : e.detail["g1Score"]
					})

				});
				sendMessageToServer({
					type: MessageType.MATCH_LEAVE
				});
				dialog.addEventListener("close", () => {
					removeUserGameId();
					showPage(Page.GAME)
				});
			});
		}

		const receiverId = match.g1.userId == getUserId() ? match.g2.userId : match.g1.userId;
		match.g1.nick = numbersToNick(match.g1.nick);
		match.g2.nick = numbersToNick(match.g2.nick);
		dialog.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key == "Escape")
				e.preventDefault();
		});
		g_game.setupElements(GameMode.GAMEMODE_PVP, match.g1, match.g2, {
			networked: true,
			gameId: message.gameId,
			localIndex: localIndex as 0 | 1,
			receiverId
		});
		g_game.actuallyStart();
	}, 1000);
}
