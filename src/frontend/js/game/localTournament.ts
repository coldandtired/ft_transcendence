import { Page, Result } from "../../../common/interfaces.js";
import { nickToNumbers } from "../../../common/utils.js";
import { g_game, GameMode } from "../class/game.js";
import { isUserLoggedIn, setUserGameId } from "../user.js";
import { showAlert, showPage } from "./../index.js";

export function localTournamentListeners() {
	const nextTournamentMatchButton = <HTMLButtonElement>document.querySelector("#nextTournamentMatchButton");
	if (nextTournamentMatchButton) {
		nextTournamentMatchButton.addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const dialog = document.querySelector("#gameDialog");
			if (dialog) {
				dialog.addEventListener("keydown", (e: KeyboardEvent) => {
					if ("Escape" == e.key)
						e.preventDefault();
				});

				dialog.addEventListener("matchOver", async (e: CustomEvent) => {
					const response = await fetch("/tournament/local/update", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({
							g1Nick: nickToNumbers(this.dataset.g1),
							g2Nick: nickToNumbers(this.dataset.g2),
							g1Score: e.detail["g1Score"],
							g2Score: e.detail["g2Score"],
							matchNumber: this.dataset.match
						})
					});
					if (Result.SUCCESS == await response.text()) {
						dialog.addEventListener("close", () => {
							g_game.dispose();
							showPage(Page.GAME);
						});
					}
				});
			}
			setTimeout(async () => {
				g_game.setupElements(GameMode.GAMEMODE_PVP, {
					nick: this.dataset.g1
				}, {
					nick: this.dataset.g2
				});
			}, 500);
		});
	}

	const newTournamentForm = <HTMLFormElement>document.querySelector("#localTournamentForm");
	if (newTournamentForm) {
		newTournamentForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const userBoxResponse = await fetch("/profile/user");
			const userBox = await userBoxResponse.json();
			if (Result.SUCCESS == userBox.result) {
				const names = [
					userBox.contents.nick,
					newTournamentForm.g2Nick.value,
					newTournamentForm.g3Nick.value,
					newTournamentForm.g4Nick.value
				];

				if (4 != names.filter((n, i) => names.indexOf(n) === i).length) {
					showAlert(Result.ERR_UNIQUE);
					return;
				}

				const gameId = `t${Date.now().toString(36).substring(5)}`;
				const result = await generateTournament(gameId, names);

				if (Result.SUCCESS != result) {
					showAlert(result);
					return;
				}

				setUserGameId(gameId);
				showPage(Page.GAME);
			}
		});
	}
}

async function generateTournament(gameId: string, names: string[]) {
	let newNames = [];
	names.forEach((name) => {
		newNames.push(nickToNumbers(name))
	});
	const shuffled = newNames.sort(() => Math.random() - 0.5);

	const response = await fetch("/tournament/local/add", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			gameId,
			gamers: newNames
		})
	});

	return await response.text();
}
