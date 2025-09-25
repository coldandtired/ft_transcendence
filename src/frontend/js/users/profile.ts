import { profileActionbuttons } from "../../../common/dynamicElements.js";
import { MessageType, Page, Result } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { getLanguage, showPage } from "../index.js";
import { sendMessageToServer } from "../sockets/clientSocket.js";
import { getUserGameId, getUserNick, isUserLoggedIn } from "../user.js";

export function profileFunctions() {
	const closeProfileButton = document.querySelector("#closeProfileButton");
	if (closeProfileButton) {
		closeProfileButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const profileDialog = <HTMLDialogElement>document.querySelector("#profileDialog");
			if (profileDialog)
				profileDialog.close();
		});
	}

	const addFriendButton = document.querySelector("#addFriendButton");
	if (addFriendButton) {
		addFriendButton.addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const response = await fetch("/friends/add", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendId: parseInt(this.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text()) {
				const actionButtons = profileActionbuttons(true, false, getUserGameId() != null, parseInt(this.dataset.id));
				const language = getLanguage();
				document.querySelector("#actionButtonsContainer").innerHTML = translate(language, actionButtons);
				profileFunctions();
			}
		});
	}

	const removeFriendButton = document.querySelector("#removeFriendButton");
	if (removeFriendButton) {
		removeFriendButton.addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const response = await fetch("/friends/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendId: parseInt(this.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text()) {
				const actionButtons = profileActionbuttons(false, false, getUserGameId() != null, parseInt(this.dataset.id));
				const language = getLanguage();
				document.querySelector("#actionButtonsContainer").innerHTML = translate(language, actionButtons);
				profileFunctions();
				const buttons = document.getElementsByClassName("friendButton");
				for (var j = 0; j < buttons.length; j++) {
					if ((buttons[j] as HTMLElement).dataset.id == this.dataset.id)
						(buttons[j] as HTMLElement).style = "display: none;";
				}
			}
		});
	}

	const addFoeButton = document.querySelector("#addFoeButton");
	if (addFoeButton) {
		addFoeButton.addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const response = await fetch("/foes/add", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					foeId: parseInt(this.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text()) {
				const actionButtons = profileActionbuttons(false, true, getUserGameId() != null, parseInt(this.dataset.id));
				const language = getLanguage();
				document.querySelector("#actionButtonsContainer").innerHTML = translate(language, actionButtons);
				profileFunctions();
			}
		});
	}

	const removeFoeButton = document.querySelector("#removeFoeButton");
	if (removeFoeButton) {
		removeFoeButton.addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const response = await fetch("/foes/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					foeId: parseInt(this.dataset.id),
				})
			});

			if (Result.SUCCESS == await response.text()) {
				const actionButtons = profileActionbuttons(false, false, getUserGameId() != null, parseInt(this.dataset.id));
				const language = getLanguage();
				document.querySelector("#actionButtonsContainer").innerHTML = translate(language, actionButtons);
				profileFunctions();
				const buttons = document.getElementsByClassName("foeButton");
				for (var j = 0; j < buttons.length; j++) {
					if ((buttons[j] as HTMLElement).dataset.id == this.dataset.id)
						(buttons[j] as HTMLElement).style = "display: none;";
				}
			}
		});
	}

	const inviteButton = document.querySelector("#inviteButton");
	if (inviteButton) {
		inviteButton.addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			sendMessageToServer({
				type: MessageType.NOTIFICATION_INVITE,
				toId: parseInt(this.dataset.id)
			});
			showPage(Page.GAME);
		});
	}
}
