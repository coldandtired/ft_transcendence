import { Page, Result } from "../../../common/interfaces.js";
import { showPage } from "../index.js";
import { sendTournamentMessage, tournamentGamerIsReady, tournamentGamerLeft } from "../sockets/remoteTournamentsMessages.js";
import { getUserGameId, isUserLoggedIn, removeUserGameId } from "../user.js";

export async function createRemoteTournament() {
	const response = await fetch(`/tournament/remote/add`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({})
	});

	return await response.json();
}

export function tournamentListeners() {
	const tournamentGamerReadyButton = document.querySelector("#tournamentGamerReadyButton");
	if (tournamentGamerReadyButton)
		tournamentGamerReadyButton.addEventListener("click", () => tournamentGamerIsReady());

	const leaveTournamentButton = document.querySelector("#leaveTournamentButton");
	if (leaveTournamentButton) {
		leaveTournamentButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const gameId = getUserGameId();

			const response = await fetch("/tournament/remote/leave");
			const result = await response.text();
			if (Result.SUCCESS == result) {
				tournamentGamerLeft();
				removeUserGameId();
				showPage(Page.GAME);
			}
		});
	}

	const sendTournamentMessageForm = <HTMLFormElement>document.querySelector("#sendTournamentMessageForm");
	if (sendTournamentMessageForm) {
		sendTournamentMessageForm.addEventListener("submit", async function (e) {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			e.preventDefault();
			if (sendTournamentMessageForm.message.value.length > 0) {
				sendTournamentMessage(sendTournamentMessageForm.message.value);
				sendTournamentMessageForm.message.value = "";
			}
		});
	}
}
