import { getLanguage, showPage } from "../index.js";
import { g_game, GameMode } from '../class/game.js';
import { MessageType, Page, Result, UserType } from "../../../common/interfaces.js";
import { joiningTournament, tournamentGamerLeft } from "../sockets/remoteTournamentsMessages.js";
import { joiningMatch, matchGamerLeaving } from "../sockets/remoteMatchesMessages.js";
import { localTournamentHtml } from "../../../common/dynamicElements.js";
import { translate } from "../../../common/translations.js";
import { localTournamentListeners } from "./localTournament.js";
import { sendMessageToServer } from "../sockets/clientSocket.js";
import { createRemoteTournament, tournamentListeners } from "./remoteTournament.js";
import { numbersToNick } from "../../../common/utils.js";
import { getUserGameId, getUserType, isUserLoggedIn, removeUserGameId, setUserGameId } from "../user.js";

export function gameListeners() {
	const localMatchButton = document.querySelector("#localMatchButton");
	if (localMatchButton)
		localMatchButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			startLocalMatch();
		});

	const aiMatchButton = document.querySelector("#aiMatchButton");
	if (aiMatchButton)
		aiMatchButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			startAiMatch()
		});

	const localTournamentButton = document.querySelector("#localTournamentButton");
	if (localTournamentButton) {
		localTournamentButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			createLocalTournament();
		});
	}

	const remoteMatchButton = document.querySelector("#remoteMatchButton");
	if (remoteMatchButton) {
		remoteMatchButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const response = await fetch(`/match/create`);
			const json = await response.json();
			if (Result.SUCCESS == json.result) {
				setUserGameId(json.gameId);
				showPage(Page.GAME);
				sendMessageToServer({
					type: MessageType.GAME_LIST_CHANGED
				});
			}
		});
	}

	const remoteTournamentButton = document.querySelector("#remoteTournamentButton");
	if (remoteTournamentButton)
		remoteTournamentButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const json = await createRemoteTournament();
			if (Result.SUCCESS == json.result) {
				setUserGameId(json.gameId);
				showPage(Page.GAME);
				sendMessageToServer({
					type: MessageType.GAME_LIST_CHANGED
				});
			}
		});

	const joinMatchButtons = document.getElementsByClassName("joinMatchButton");
	for (var i = 0; i < joinMatchButtons.length; i++) {
		joinMatchButtons[i].addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			setUserGameId(this.dataset.id);
			await joiningMatch(this.dataset.id);
			showPage(Page.GAME);
		});
	}

	const leaveMatchButton = document.querySelector("#leaveMatchButton");
	if (leaveMatchButton) {
		leaveMatchButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			removeUserGameId();
			matchGamerLeaving();
			showPage(Page.GAME);
		});
	}

	const joinTournamentButtons = document.getElementsByClassName("joinTournamentButton");
	for (var i = 0; i < joinTournamentButtons.length; i++) {
		joinTournamentButtons[i].addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			setUserGameId(this.dataset.id);
			joiningTournament(this.dataset.id);
			showPage(Page.GAME);
		});
	}
}

async function startLocalMatch() {
	const nicksResponse = await fetch("/match/nicks");
	const nicksBox = await nicksResponse.json();
	if (Result.SUCCESS == nicksBox.result) {
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			dialog.addEventListener("keydown", (e: KeyboardEvent) => {
				if (e.key == "Escape")
					g_game.dispose();
			}, { once: true });
			if (UserType.GUEST != getUserType()) {
				dialog.addEventListener("matchOver", async (e: CustomEvent) => {
					const response = await fetch("/match-results/add", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({
							g2Nick: nicksBox.contents[1],
							g1Score: e.detail["g1Score"],
							g2Score: e.detail["g2Score"],
						})
					});
					await response.text();
				}, { once: true });
			}
			g_game.setupElements(GameMode.GAMEMODE_PVP, {
				nick: nicksBox.contents[0]
			}, {
				nick: numbersToNick(nicksBox.contents[1])
			});
		}
	}
}

async function startAiMatch() {
	const nicksResponse = await fetch("/match/nicks");
	const nicksBox = await nicksResponse.json();
	if (Result.SUCCESS == nicksBox.result) {
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			dialog.addEventListener("keydown", (e: KeyboardEvent) => {
				if (e.key == "Escape")
					g_game.dispose();
			}, { once: true });
			g_game.setupElements(GameMode.GAMEMODE_AI, {
				nick: nicksBox.contents[0]
			}, {
				nick: numbersToNick(nicksBox.contents[1])
			});
		}
	}
}

async function createLocalTournament() {
	const nicks = await fetch("/tournament/nicks");
	const nicksBox = await nicks.json();
	if (Result.SUCCESS == nicksBox.result) {
		let newNicks = [];
		nicksBox.contents.forEach(nick => newNicks.push(numbersToNick(nick)));
		document.querySelector("#content").innerHTML = translate(getLanguage(), localTournamentHtml(newNicks));
		localTournamentListeners();
	}
}
