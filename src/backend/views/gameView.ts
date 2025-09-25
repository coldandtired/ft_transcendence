import { Game, GameType } from "../../common/interfaces.js";
import { numbersToNick } from "../../common/utils.js";

export function gameView(games: Game[]): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_GAME_TITLE%%</div>
		<div class="flex flex-row justify-center gap-2">
			<fieldset class="w-100 h-107 flex flex-col gap-8 border border-fuchsia-800 bg-red-200/20 rounded-lg p-3 pb-5">
				<legend class="text-purple-800 text-center mx-auto">%%TEXT_JOIN%%</legend>
				<div class="flex flex-col  grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
					${gamesHtml(games)}
				</div>
			</fieldset>
			<div class="flex flex-col gap-4">
				<fieldset class="w-85 flex flex-col items-center border border-fuchsia-800 bg-red-200/20 rounded-lg p-3 pb-5 gap-8">
					<legend class="text-purple-800 text-center mx-auto">%%TEXT_CREATE_LOCAL%%</legend>
					<button id="localMatchButton" class="outline-hidden w-50 text-stone-700 bg-red-300/50 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-red-300">%%BUTTON_MATCH%%</button>
					<button id="aiMatchButton" class="outline-hidden w-50 text-stone-700 bg-red-300/50 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-red-300">%%BUTTON_AI_MATCH%%</button>			
					<button id="localTournamentButton" class="outline-hidden w-50 text-stone-700 bg-red-300/50 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-red-300">%%BUTTON_TOURNAMENT%%</button>				
				</fieldset>
				<fieldset class="w-85 flex flex-col grow items-center border border-fuchsia-800 bg-red-200/20 rounded-lg p-3 pb-5 gap-8">
					<legend class="text-purple-800 text-center mx-auto">%%TEXT_CREATE_REMOTE%%</legend>
					<button id="remoteMatchButton" class="outline-hidden w-50 text-stone-700 bg-red-300/50 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-red-300">%%BUTTON_MATCH%%</button>
					<button id="remoteTournamentButton" class="outline-hidden w-50 text-stone-700 bg-red-300/50 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-red-300">%%BUTTON_TOURNAMENT%%</button>
				</fieldset>
			</div>
		</div>
	</div>
	`;
}

function gamesHtml(games: Game[]): string {
	let gameStrings: string = "";

	games.forEach(game => {
		gameStrings += gameButtonHtml(game);
	});

	return gameStrings;
}

function gameButtonHtml(game: Game): string {
	const gameID: string = game.gameId;
	const gamers: string[] = game.nicks.split(",");
	if ((GameType.TOURNAMENT == game.type && 4 == gamers.length) || (GameType.MATCH == game.type && 2 == gamers.length))
		return "";

	let gamersString = "";
	gamers.forEach((name) => {
		gamersString += nameHtml(name);
	});

	return GameType.TOURNAMENT == game.type ? `
	<button class="joinTournamentButton w-full text-stone-700 bg-red-300/50 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-red-300" data-id="${gameID}"><span class="text-green-800">%%TEXT_TOURNAMENT%%</span>${gamersString}</button>
	`
		:
		`
	<button class="joinMatchButton w-full text-stone-700 bg-red-300/50 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-red-300" data-id="${gameID}"><span class="text-green-800">%%TEXT_MATCH%%</span>${gamersString}</button>
	`;
}

function nameHtml(gamer: string) {
	return `
	<div class="">${numbersToNick(gamer)}</div>
	`;
}
