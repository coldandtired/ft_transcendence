import { GameChatMessage, Match, MatchGamer, ShortUser, Tournament, User } from "../../common/interfaces.js";
import { remoteTournamentMessagesHtml } from "./remoteTournamentLobbyView.js";

export function remoteTournamentView(tournament: Tournament, chats: GameChatMessage[], user: User): string {
	return `
	<div class="flex flex-col w-full items-center gap-4">
		<h1 id="gameTitle" class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1 mx-auto">%%TEXT_REMOTE_TOURNAMENT%%</h1>
		<div class="flex flex-row h-120 w-full gap-2">
			<div id="tournamentLobbyDetailsContainer">
				${remoteTournamentDetails(tournament, user)}
			</div>
			<fieldset class="grow border border-fuchsia-800 bg-red-200/20 rounded-lg p-3 ml-4">
				<legend class="text-fuchsia-800 text-center mx-auto">%%TEXT_CHAT%%</legend>					
				<div class="flex flex-col h-full">
					<div id="tournamentMessagesDiv" class="flex flex-col-reverse grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${remoteTournamentMessagesHtml(chats, user.userId)}
					</div>
					<div class="mt-2">
						<form id="sendTournamentMessageForm">
							<div class="flex flex-row gap-1">
								<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
								<input type="submit" hidden>
								<button type="submit" class="border border-gray-700 py-0.5 px-2 cursor-[url(/images/pointer.png),pointer] hover:bg-gray-700 rounded-lg bg-gray-800"><i class="text-gray-300 fa-solid fa-play"></i></button>
							</div>
						</form>
					</div>
				</div>
			</fieldset>
		</div>
	</div>
	`;
}

export function remoteTournamentDetails(tournament: Tournament, user: ShortUser): string {
	if (isFinalFinished(tournament.matches[2])) {
		const match = tournament.matches[2];
		const winner = match.g1.score > match.g2.score ? match.g1 : match.g2;
		return `
			<fieldset class="w-80 h-56 border border-fuchsia-800 rounded-lg bg-red-200/20 p-3">
			<legend id="tournamentPlayersLegend" class="text-fuchsia-800 text-center mx-auto">%%TEXT_TOURNAMENT_FINAL%%</legend>		
			<div class="flex flex-col gap-2 pt-8">
				<div class="text-green-800 text-center font-bold">%%TEXT_CONGRATULATIONS%%</div>
				<div class="w-75 py-2 px-4 text-green-800 text-center font-bold">${winner.nick}!</div>
			</div>
		</fieldset>
		`;
	}

	if (isFinalReady(tournament)) {
		return finalHtml(tournament.matches[2], user);
	}

	const match = whichMatchIsUserIn(tournament, user);
	const html = `
	<div class="flex flex-col gap-8">
		${userMatchHtml(match, user)}
		${secondaryMatchHtml(tournament.matches[0] == match ? tournament.matches[1] : tournament.matches[0])}
	</div>
	`;

	return html;
}

function userMatchHtml(match: Match, user: ShortUser): string {
	const matchText = match.matchNumber < 3 ? `%%TEXT_MATCH%% ${match.matchNumber}` : "%%TEXT_TOURNAMENT_FINAL%%";
	if (match.g1.score + match.g2.score > 0) {
		const g1Colour = match.g1.score > match.g2.score ? "text-green-800" : "text-red-800";
		const g2Colour = match.g1.score > match.g2.score ? "text-red-800" : "text-green-800";
		return `
		<fieldset class="w-80 h-56 border border-fuchsia-800 rounded-lg bg-red-200/20 p-3">
			<legend id="tournamentPlayersLegend" class="text-fuchsia-800 text-center mx-auto">${matchText}</legend>		
			<div class="flex flex-col gap-2 pt-5">
				<div class="w-75 py-2 px-4 rounded-lg bg-red-200/10 ${g1Colour} text-center">${match.g1.nick}</div>
				<div class="text-white text-center">vs</div>
				<div class="w-75 py-2 px-4 rounded-lg bg-red-200/10 ${g2Colour} text-center">${match.g2.nick}</div>
			</div>
		</fieldset>
		`;
	}

	return `
	<fieldset class="w-80 h-56 border border-fuchsia-800 rounded-lg bg-red-200/20 p-3">
		<legend id="tournamentPlayersLegend" class="text-fuchsia-800 text-center mx-auto">${matchText}</legend>		
		<div class="flex flex-col gap-2 pt-5">
			${gamerHtml(match.g1, user.userId, 1)}
			<div class="text-white text-center">vs</div>
			${gamerHtml(match.g2, user.userId, 2)}
		</div>
	</fieldset>
	`;
}

function secondaryMatchHtml(match: Match): string {
	const matchText = match.matchNumber < 3 ? `%%TEXT_MATCH%% ${match.matchNumber}` : "%%TEXT_TOURNAMENT_FINAL%%";
	if (match.g1.score + match.g2.score > 0) {
		const g1Colour = match.g1.score > match.g2.score ? "text-green-800" : "text-red-800";
		const g2Colour = match.g1.score > match.g2.score ? "text-red-800" : "text-green-800";
		return `
		<fieldset class="w-80 h-56 border border-fuchsia-800 rounded-lg bg-red-200/20 p-3">
			<legend id="tournamentPlayersLegend" class="text-fuchsia-800 text-center mx-auto">${matchText}</legend>		
			<div class="flex flex-col gap-2 pt-5">
				<div class="w-75 py-2 px-4 rounded-lg bg-red-200/10 ${g1Colour} text-center">${match.g1.nick}</div>
				<div class="text-white text-center">vs</div>
				<div class="w-75 py-2 px-4 rounded-lg bg-red-200/10 ${g2Colour} text-center">${match.g2.nick}</div>
			</div>
		</fieldset>`;
	}

	return `
	<fieldset class="w-80 h-56 border border-fuchsia-800 bg-red-200/20 rounded-lg p-3">
		<legend id="tournamentPlayersLegend" class="text-fuchsia-800 text-center mx-auto">${matchText}</legend>		
		<div class="flex flex-col gap-2 pt-5">
			<div class="w-75 text-stone-700 text-center bg-red-200/10 rounded-lg py-2 px-4">${match.g1.nick}</div>
			<div class="text-white text-center">vs</div>
			<div class="w-75 text-stone-700 text-center bg-red-200/10 rounded-lg py-2 px-4">${match.g2.nick}</div>
		</div>
	</fieldset>
	`;
}

function whichMatchIsUserIn(tournament: Tournament, user: ShortUser): Match {
	return tournament.matches.find(match => match.g1.userId == user.userId || match.g2.userId == user.userId);
}

function isFinalReady(tournament: Tournament): boolean {
	const match1Count = tournament.matches[0].g1.score + tournament.matches[0].g2.score;
	const match2Count = tournament.matches[1].g1.score + tournament.matches[1].g2.score;
	return match1Count > 0 && match2Count > 0;
}

function isFinalFinished(match: Match): boolean {
	return match.g1.score + match.g2.score > 0;
}

function finalHtml(match: Match, user: ShortUser): string {
	if (match.g1.userId == user.userId || match.g2.userId == user.userId)
		return userMatchHtml(match, user);
	else
		return secondaryMatchHtml(match);
}

function gamerHtml(gamer: MatchGamer, userId: number, position: number) {
	if (gamer.userId == userId && !gamer.ready)
		return readyButtonHtml(gamer, position);

	if (gamer.ready) {
		const buttonColour = 1 == position ? "bg-[#BE2AD1]" : "bg-[#FFCD5A]";
		return `
		<div class="w-75 py-2 px-4 rounded-lg text-stone-700 ${buttonColour} text-center">${gamer.nick}</div>
		`;
	}

	return `
	<div class="w-75 py-2 px-4 rounded-lg bg-red-200/10 text-stone-700 text-center">${gamer.nick}</div>
	`;
}

function readyButtonHtml(gamer: MatchGamer, position: number) {
	if (gamer.ready) {
		return 1 == position ? `
		<div disabled class="w-75 text-stone-700 bg-[#BE2AD1] py-2 px-4 rounded-lg">${gamer.nick}</div>
		`
			:
			`
		<div disabled class="w-75 text-stone-700 bg-[#FFCD5A] py-2 px-4 rounded-lg">${gamer.nick}</div>
		`;
	}
	return `<div id="tournamentGamerReadyButton" class="outline-hidden w-75 border border-red-300 text-stone-700 text-center bg-red-300/50 cursor-[url(/images/pointer.png),pointer] py-2 px-4 rounded-lg hover:bg-red-300">%%BUTTON_READY%%</div>`;
}
