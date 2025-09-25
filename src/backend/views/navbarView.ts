import { FrameParams, Page, Result, User, UserType } from "../../common/interfaces.js";
import { alertDialogHtml, gameDialogHtml, profileDialogHtml } from "./dialogsView.js";

export function navbarView(params: FrameParams, chatsWaiting: boolean): string {
	let languageSelect = englishHtml();

	switch (params.language) {
		case "australian":
			languageSelect = australianHtml();
			break;
		case "dutch":
			languageSelect = dutchHtml();
			break;
		case "esperanto":
			languageSelect = esperantoHtml();
			break;
		case "polish":
			languageSelect = polishHtml();
			break;
	}

	let html: string = alertDialogHtml();

	const user = params.user;
	if (!user)
		html += loggedOutHtml(languageSelect, params.page);
	else
		html += UserType.GUEST == user.userType ? guestHtml(user, languageSelect) : loggedInHtml(user, chatsWaiting, languageSelect, params.page);

	return html;
}

function loggedOutHtml(languageSelect: string, page: Page): string {
	return `
	<div id="navBar" class="h-32 font-mono bg-stone-700" data-page="${page}">
		<div class="h-full w-200 mx-auto flex flex-row items-center justify-between">
			<div class="mr-auto flex flex-row gap-4 items-center">
				<img class="h-20 w-20" src="/images/icon.png"/>
				<div class="text-5xl text-gray-300">Transcendence</div>
			</div>
			<select id="languageSelect" class="cursor-[url(/images/pointer.png),pointer] text-gray-300" data-page="${page}">
				${languageSelect}
			</select>
		</div>
	</div>
	`;
}

function loggedInHtml(user: User, chatsWaiting: boolean, languageSelect: string, page: Page): string {	
	return `
	<div id="navBar" class="h-32 font-mono bg-stone-700" data-page="${page}">
		<div class="h-full w-200 mx-auto flex flex-row items-center justify-between">
			<img id="homeButton" data-id="${user.userId}" class="cursor-[url(/images/pointer.png),pointer] h-20 w-20" src="/images/icon.png"/>

			<div class="flex flex-col items-center gap-2">
				<div class="text-gray-300">${user.nick}</div>
				<div class="flex flex-row gap-4">
					${accountButtonHtml(page)}
					${gameButtonHtml(page)}
					${usersButtonHtml(page)}
					${chatButtonHtml(page, chatsWaiting)}
				</div>
			</div>
			<select id="languageSelect" class="cursor-[url(/images/pointer.png),pointer] text-gray-300">
				${languageSelect}
			</select>
		</div>
	</div>
	${profileDialogHtml()}
	${gameDialogHtml()}
	`;
}

// TODO remove delete cookies button
function guestHtml(user: User, languageSelect: string): string {
	return `
	<div id="navBar" class="h-32 font-mono bg-stone-700" data-page="GAME">
		<div class="h-full w-200 mx-auto flex flex-row items-center justify-between">
			<img class="h-20 w-20" src="/images/icon.png"/>
			<div class="text-gray-300">${user.nick}</div>				
			<select id="languageSelect" class="outline-hidden cursor-[url(/images/pointer.png),pointer] text-gray-300">
				${languageSelect}
			</select>
		</div>
	</div>
	${profileDialogHtml()}
	${gameDialogHtml()}
	`;
}

function accountButtonHtml(page: Page) {
	const bgColour = Page.ACCOUNT == page ? "bg-stone-800" : "";

	return `
	<button id="accountButton"
		class="cursor-[url(/images/pointer.png),pointer] text-left ${bgColour} text-gray-300 px-2 py-1 rounded-lg hover:bg-stone-800">
		%%BUTTON_ACCOUNT%%
	</button>
	`;
}

function gameButtonHtml(page: Page) {
	const bgColour = Page.GAME == page ? "bg-stone-800" : "";

	return `
	<button id="gameButton"
		class="cursor-[url(/images/pointer.png),pointer] text-left ${bgColour} text-gray-300 px-2 py-1 rounded-lg hover:bg-stone-800">
		%%BUTTON_GAME%%
	</button>
	`;
}

function usersButtonHtml(page: Page) {
	const bgColour = (Page.USERS == page || Page.FOES == page || Page.FRIENDS == page) ? "bg-stone-800" : "";

	return `
	<button id="usersButton"
		class="cursor-[url(/images/pointer.png),pointer] text-left ${bgColour} text-gray-300 px-2 py-1 rounded-lg hover:bg-stone-800">
		%%BUTTON_USERS%%
	</button>
	`;
}

function chatButtonHtml(page: Page, chatsWaiting: boolean) {
	const bgColour = Page.CHAT == page ? "bg-stone-800" : "";
	const showChatsIndicator = chatsWaiting ? "" : "collapse";

	return `
	<span id="chatButton" class="relative inline-flex cursor-[url(/images/pointer.png),pointer] rounded-lg hover:bg-stone-800">
		<button class="inline-flex cursor-[url(/images/pointer.png),pointer] text-left ${bgColour} text-gray-300 px-2 py-1 rounded-lg hover:bg-stone-800">%%BUTTON_CHAT%%</button>
		<span id="chatIndicator" class="${showChatsIndicator} absolute top-0.25 right-0.25 flex size-3">
			<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-700 opacity-75"></span>
			<span class="relative inline-flex size-3 rounded-full bg-fuchsia-800"></span>
		</span>
	</span>
	`;
}

function australianHtml(): string {
	return `
	<option class="bg-stone-700" value="australian" selected>Australian</option>
	<option class="bg-stone-700" value="english">English</option>
	<option class="bg-stone-700" value="esperanto">Esperanto</option>
	<option class="bg-stone-700" value="dutch">Nederlands</option>
	<option class="bg-stone-700" value="polish">Polski</option>
	`;
}

function englishHtml(): string {
	return `
	<option class="bg-stone-700" value="australian">Australian</option>
	<option class="bg-stone-700" value="english" selected>English</option>
	<option class="bg-stone-700" value="esperanto">Esperanto</option>
	<option class="bg-stone-700" value="dutch">Nederlands</option>
	<option class="bg-stone-700" value="polish">Polski</option>
	`;
}

function dutchHtml(): string {
	return `
	<option class="bg-stone-700" value="australian">Australian</option>
	<option class="bg-stone-700" value="english">English</option>
	<option class="bg-stone-700" value="esperanto">Esperanto</option>
	<option class="bg-stone-700" value="dutch" selected>Nederlands</option>
	<option class="bg-stone-700" value="polish">Polski</option>
	`;
}

function esperantoHtml(): string {
	return `
	<option class="bg-stone-700" value="australian">Australian</option>
	<option class="bg-stone-700" value="english">English</option>
	<option class="bg-stone-700" value="esperanto" selected>Esperanto</option>
	<option class="bg-stone-700" value="dutch">Nederlands</option>
	<option class="bg-stone-700" value="polish">Polski</option>
	`;
}

function polishHtml(): string {
	return `
	<option class="bg-stone-700" value="australian">Australian</option>
	<option class="bg-stone-700" value="english">English</option>
	<option class="bg-stone-700" value="esperanto">Esperanto</option>
	<option class="bg-stone-700" value="dutch">Nederlands</option>
	<option class="bg-stone-700" value="polish" selected>Polski</option>
	`;
}
