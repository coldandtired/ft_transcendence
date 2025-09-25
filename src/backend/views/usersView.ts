import { ShortUser } from "../../common/interfaces.js";
import { profileDialogHtml } from "./dialogsView.js";

/*
	The list of user buttons
*/
export function usersHtml(users: ShortUser[]) {
	let userList = "";
	for (var key in users) {
		userList += userHtml(users[key]);
	}

	return userList;
}


export function usersView(users: ShortUser[]): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_USERS_TITLE%%</div>
		<fieldset class="border border-fuchsia-800 w-90 rounded-lg bg-red-200/20 p-2">
			<legend class="text-center mx-auto">${switcherHtml()}</legend>
			<div class="h-100 w-full text-center mx-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">	
				${usersHtml(users)}
			</div>
		</fieldset>
	</div>
	${profileDialogHtml()}
	`;
}

function switcherHtml(): string {
	return `
	<div class="flex flex-row justify-center items-center mb-2 gap-2">
		<div class="disabled rounded-lg bg-fuchsia-800 text-gray-300 px-2 pt-1 pb-0">All</div>
		<div id="friendsButton" class="cursor-[url(/images/pointer.png),pointer] px-2 pt-1 pb-0 rounded-lg text-fuchsia-800 hover:text-stone-700">Friends</div>
		<div id="foesButton" class="cursor-[url(/images/pointer.png),pointer] px-2 pt-1 pb-0 rounded-lg text-fuchsia-800 hover:text-stone-700">Foes</div>
	</div>
	`;
}

function userHtml(user: ShortUser) {
	return`
	<div class="userButton w-80 cursor-[url(/images/pointer.png),pointer] rounded-lg bg-red-300/50 hover:bg-red-300 text-center text-stone-700 mx-auto p-2" data-id="${user.userId}">${user.nick}</div>
	`;
}
