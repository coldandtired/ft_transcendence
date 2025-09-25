import { Page, Result } from "../../../common/interfaces.js";
import { showPage } from "../index.js";
import { profileFunctions } from "./profile.js";

export function usersFunctions() {
	const allButton = document.querySelector("#allButton");
	if (allButton)
		allButton.addEventListener("click", async () => showPage(Page.USERS));

	const friendsButton = document.querySelector("#friendsButton");
	if (friendsButton)
		friendsButton.addEventListener("click", async () => showPage(Page.FRIENDS));

	const foesButton = document.querySelector("#foesButton");
	if (foesButton)
		foesButton.addEventListener("click", async () => showPage(Page.FOES));

	const userButtons = document.getElementsByClassName("userButton");
	for (var i = 0; i < userButtons.length; i++) {
		userButtons[i].addEventListener("click", async function () {
			const profileBox = await fetch(`/profile/${this.dataset.id}`);

			const json = await profileBox.json();
			if (Result.SUCCESS != json.result)
				return;

			const dialog = <HTMLDialogElement>document.querySelector("#profileDialog");
			dialog.innerHTML = json.value;
			profileFunctions();
			dialog.showModal();
		});
	}
}
