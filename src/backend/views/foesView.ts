import { Foe, User } from "../../common/interfaces.js";

export function foesView(foes: Foe[]): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_USERS_TITLE%%</div>
		<fieldset class="border border-fuchsia-800 w-90 rounded-lg bg-red-200/20 p-2">
			<legend class="text-center mx-auto">${switcherHtml()}</legend>
			<div class="h-100 p-2 w-full text-center mx-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">	
				${foesHtml(foes)}
			</div>
		</fieldset>			
	</div>
	`;
}

export function foesHtml(foes: Foe[]) {
	if (0 == foes.length)
		return `<div class="text-stone-700 pt-8 text-center">%%TEXT_NO_FOES%%</div>`;

	let userList = "";
	for (var key in foes) {
		userList += foeHtml(foes[key]);
	}

	return userList;
}

function switcherHtml(): string {
	return `
	<div class="flex flex-row justify-center items-center mb-2 gap-2">
		<div id="allButton" class="cursor-[url(/images/pointer.png),pointer] px-2 pt-1 pb-0 rounded-lg text-fuchsia-800 hover:bg-text-stone-700">All</div>
		<div id="friendsButton" class="cursor-[url(/images/pointer.png),pointer] px-2 pt-1 pb-0 rounded-lg text-fuchsia-800 hover:bg-text-stone-700">Friends</div>
		<div class="disabled rounded-lg text-gray-300 bg-fuchsia-800 px-2 pt-1 pb-0">Foes</div>
	</div>
	`;
}

function foeHtml(foe: Foe): string {
	return `
	<div class="userButton foeButton w-80 cursor-[url(/images/pointer.png),pointer] rounded-lg bg-red-300/50 hover:bg-red-300 text-center text-stone-700 mx-auto p-2" data-id="${foe.userId}">${foe.nick}</div>
	`;
}
