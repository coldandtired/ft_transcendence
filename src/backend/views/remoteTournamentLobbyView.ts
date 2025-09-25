import { GameChatMessage, Gamer, User } from "../../common/interfaces.js";
import { numbersToNick } from "../../common/utils.js";

export function remoteTournamentLobbyView(gamers: Gamer[], chats: GameChatMessage[], userId: number): string {
	return `	
	<div class="flex flex-col w-full items-center gap-4">
		<h1 id="tournamentTitle" class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1 mx-auto">%%TEXT_REMOTE_TOURNAMENT%%</h1>
		<div class="flex flex-row h-120 w-full gap-2">
			<div id="tournamentLobbyDetailsContainer">
				${remoteTournamentLobbyPlayersView(gamers, false)}
			</div>
			<fieldset class="grow border border-fuchsia-800 bg-red-200/20 rounded-lg p-3 ml-4">
				<legend class="text-fuchsia-800 text-center mx-auto">%%TEXT_CHAT%%</legend>			
				<div class="flex flex-col h-full">
					<div id="tournamentMessagesDiv" class="flex flex-col-reverse grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${remoteTournamentMessagesHtml(chats, userId)}
					</div>
					<div class="mt-2">
						<form id="sendTournamentMessageForm">
							<div class="flex flex-row gap-1 mt-2">
								<input type="text" name="message" class="outline-hidden px-2 py-1 text-stone-700 grow bg-red-300/50 rounded-lg">
								<input type="submit" hidden>
								<button type="submit" class="outline-hidden px-2 pt-1 text-center items-center content-center cursor-[url(/images/pointer.png),pointer] hover:bg-red-300 rounded-lg bg-red-300/50"><i class="text-fuchsia-800 m-auto fa-solid fa-play"></i></button>
							</div>
						</form>
					</div>
				</div>
			</fieldset>
		</div>
	</div>
	`;
}

export function remoteTournamentLobbyPlayersView(gamers: Gamer[], convert: boolean = true) {
	return `
	<fieldset class="w-80 flex flex-col gap-2 items-center h-full border border-fuchsia-800 bg-red-200/20 rounded-lg p-3 pb-5">
		<legend id="tournamentPlayersLegend" class="text-fuchsia-800 text-center mx-auto">${gamers.length} / 4 %%TEXT_PLAYERS%%</legend>		
		<div id="tournamentDetailsContainer" class="flex flex-col w-75">
			${remoteTournamentGamersHtml(gamers, convert)}
		</div>
		<div id="leaveTournamentButton" class="text-red-900 cursor-[url(/images/pointer.png),pointer] hover:text-fuchsia-800">%%BUTTON_LEAVE%%</div>
	</fieldset>	
	`;
}

function remoteTournamentGamersHtml(gamers: Gamer[], convert: boolean = true): string {
	let gamersString = "";
	gamers.forEach(gamer => {
		gamersString += tournamentGamerHtml(gamer, convert);
	});

	return `
	<div class="flex flex-col gap-8">
		${gamersString}
	</div>
	`;
}

export function remoteTournamentMessagesHtml(chats: GameChatMessage[], userId: number): string {
	let messageList = "";
	for (var key in chats) {
		messageList += tournamentMessageHtml(userId, chats[key]);
	}

	return messageList;
}

function tournamentGamerHtml(gamer: Gamer, convert: boolean = true) {
	return `
	<div class="w-full bg-red-300/50 flex flex-row gap-2 justify-end items-center text-right text-stone-700 p-2 rounded-lg">		
		<div>${convert ? numbersToNick(gamer.nick): gamer.nick}</div>
		<img class="w-10 h-10 rounded-lg" src="${gamer.avatar}"></img>
	</div>
	`;
}

function tournamentMessageHtml(userId: number, chat: GameChatMessage) {
	return userId == chat.fromId ?
		`
	<div class="bg-green-700 ml-auto px-4 py-2 rounded-lg">
		<div class="text-gray-300">${chat.chat}</div>
	</div>	
	`
	:
	`
	<div class="bg-blue-700 mr-auto px-4 py-2 rounded-lg">
		<div class="text-white font-bold">${chat.nick}</div>
		<div class="text-gray-300">${chat.chat}</div>
	</div>
	`;
}
