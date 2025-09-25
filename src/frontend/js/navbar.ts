import { Page, Result } from "../../common/interfaces.js";
import { showPage } from "./index.js";
import { currentPage } from "./sockets/clientSocket.js";
import { profileFunctions } from "./users/profile.js";

/*
	The functions that change the page from the navbar
*/
export function navbarFunctions() {
	const languageSelect = <HTMLSelectElement>document.getElementById("languageSelect");
	if (languageSelect) {
		languageSelect.addEventListener("change", function (event) {
			const date = new Date();
			date.setFullYear(date.getFullYear() + 1);
			document.cookie = `language=${languageSelect.value}; expires=${date}`;
			showPage(currentPage());
		})
	}

	const homeButton = document.querySelector("#homeButton");
	if (homeButton) {
		homeButton.addEventListener("click", async function() {
			const profileBox = await fetch(`/profile/${this.dataset.id}`);

			const json = await profileBox.json();
			if (Result.SUCCESS != json.result)
				return;

			const dialog = <HTMLDialogElement>document.querySelector("#profileDialog");
			dialog.innerHTML = json.value;
			profileFunctions();
			if (document.activeElement instanceof HTMLElement)
				document.activeElement.blur();
			dialog.showModal();
		});
	}

	const accountButton = document.querySelector("#accountButton");
	if (accountButton) {
		accountButton.addEventListener("click", async () => {
			showPage(Page.ACCOUNT);
		}, { once: true });
	}

	const gameButton = document.querySelector("#gameButton");
	if (gameButton) {
		gameButton.addEventListener("click", async () => {
			showPage(Page.GAME);
		}, { once: true });
	}

	const usersButton = document.querySelector("#usersButton");
	if (usersButton) {
		usersButton.addEventListener("click", async () => {
			showPage(Page.USERS);
		}, { once: true });
	}

	const chatButton = document.querySelector("#chatButton");
	if (chatButton) {
		chatButton.addEventListener("click", async () => {
			showPage(Page.CHAT);
		}, { once: true });
	}
}
