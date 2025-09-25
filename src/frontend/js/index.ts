import { navbarFunctions } from "./navbar.js";
import { accountListeners } from "./account.js";
import { gameListeners } from "./game/gamePage.js";
import { authFunctions } from "./auth.js";
import { usersFunctions } from "./users/users.js";
import { localTournamentListeners } from "./game/localTournament.js";
import { translate } from "../../common/translations.js";
import { userChatListeners } from "./chat.js";
import { tournamentListeners } from "./game/remoteTournament.js";
import { Page, Result } from "../../common/interfaces.js";
import { connectToWS, currentPage } from "./sockets/clientSocket.js";
import { isUserLoggedIn, userLoggedIn } from "./user.js";

/*
	Simulates moving to a new page
*/
export async function showPage(page: Page, add: boolean = true) {
	if (Page.AUTH != page && !isUserLoggedIn())
		page = Page.AUTH;

	if (add)
		history.pushState(page, null);

	// if (Page.USERS == page)
	// 	window.removeEventListener("popstate", changePage);

	const endpoint = !page || Page.HOME == page ? "/" : `/${page.toLowerCase()}`;

	const response = await fetch(endpoint);
	const body = await response.text();
	const start = body.indexOf("<body>");
	const end = body.indexOf("</body>") + 7;

	document.querySelector('body').innerHTML = body.substring(start, end);
	setupPage(page);
}

/*
	Shows the (improved?) alert dialog
*/
export function showAlert(text: string, shouldTranslate: boolean = true) {
	const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
	if (alertDialog) {
		const closeAlertButton = document.querySelector("#closeAlertButton");
		closeAlertButton.addEventListener("click", () => {
			alertDialog.close();
		});

		const content = shouldTranslate ? translate(getLanguage(), `%%${text}%%`) : text;
		document.querySelector("#alertContent").textContent = content;
		alertDialog.showModal();
	}
}

/*
	Gets the currently selected language
*/
export function getLanguage(): string {
	let language = document?.cookie
		.split("; ")
		.find((row) => row.startsWith("language="))
		?.split("=")[1];
	if (!language)
		language = "english";
	return language;
}

/*
	Connects to the websocket and adds the button handlers
*/
function setupPage(page: Page) {
	if (Page.AUTH != page)
		connectToWS();

	accountListeners();
	authFunctions();
	gameListeners();
	navbarFunctions();
	localTournamentListeners();
	tournamentListeners();
	userChatListeners();
	usersFunctions();
}

function changePage() {
	if (history.state)
		showPage(Page[history.state], false);
}

/*
	Hooks up the window events
*/
if (typeof window !== "undefined") {
	/* 
		Changes page on back/forward buttons
	*/
	window.addEventListener('popstate', changePage);

	// window.addEventListener
	// ('beforeunload', (event) => {
	// 	event.preventDefault();
	// 	alert("woohoo");
	// });

	/*
		Shows an error if Google sign-in/up was unsuccessful
	*/
	window.addEventListener("load", async () => {
		if (-1 != document.cookie.indexOf("googleautherror=true")) {
			showAlert(Result.ERR_GOOGLE);
			document.cookie = `googleautherror=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/;`;
		}

		const userBox = await fetch("/profile/user");
		const userJson = await userBox.json();
		if (Result.SUCCESS == userJson.result) {
			const alreadyBox = await fetch(`/profile/logged-in/${userJson.contents.userId}`);
			const alreadyText = await alreadyBox.text();
			if (Result.SUCCESS != alreadyText) {
				showPage(Page.AUTH);
				return;
			}

			userLoggedIn(userJson.contents);
		}

		setupPage(currentPage());
	});
}
