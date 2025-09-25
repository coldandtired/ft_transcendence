import { LocalGamer, LocalMatch, LocalTournament, User } from '../../common/interfaces.js';

export function localTournamentView(tournament: LocalTournament, user: User): string {
	return `
	<div class="w-full h-full m-auto text-center flex flex-col items-center gap-4">
	<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_LOCAL_TOURNAMENT%%</div>
		<div class="flex flex-row items-center">
			<div class="flex flex-col gap-20">
				<fieldset class="w-70 h-31 border border-fuchsia-800 bg-red-200/20 rounded-lg">
					<legend class="text-fuchsia-800 mx-auto">Semi-final</legend>
					<div class="flex flex-col gap-1 justify-center items-center">
						${matchHtml(tournament.matches[0])}
					</div>
				</fieldset>
			<fieldset class="w-70 h-32 border border-fuchsia-800 bg-red-200/20 rounded-lg">
					<legend class="text-fuchsia-800 mx-auto">Semi-final</legend>
					<div class="flex flex-col gap-1 justify-center items-center">
						${matchHtml(tournament.matches[1])}
					<div>
				</fieldset>
			</div>
			<div class="border border-fuchsia-800 border-l-0 w-30 h-60"></div>
			<hr class="w-30 h-px bg-fuchsia-800 border-0">
			<fieldset class="w-70 h-32 border border-fuchsia-800 bg-red-200/20 rounded-lg">
				<legend class="text-fuchsia-800 mx-auto">Final</legend>
				<div class="flex flex-col gap-1 justify-center items-center">
					${matchHtml(tournament.matches[2])}
				</div>
			</fieldset>
		</div>
			
		<div class="mt-8 border border-fuchsia-800 bg-red-200/20 rounded-lg py-2 px-8 mx-auto flex flex-row items-center justify-center">
			${nextMatchHtml(tournament)}
		</div>
		<div id="leaveTournamentButton" class="text-red-900 cursor-[url(/images/pointer.png),pointer]">%%BUTTON_LEAVE%%</div>
	</div>
	`;
}

function matchHtml(match: LocalMatch): string {
	let gamer1Colour: string;
	let gamer2Colour: string;

	if (0 == match.g1.score && 0 == match.g2.score) {
		gamer1Colour = "text-stone-700";
		gamer2Colour = "text-stone-700";
	}
	else if (match.g1.score > match.g2.score) {
		gamer1Colour = "text-green-900";
		gamer2Colour = "text-red-900";
	}
	else {
		gamer1Colour = "text-red-900";
		gamer2Colour = "text-green-900";
	}
	return `
		<div class="${gamer1Colour} text-lg">${match.g1.nick ?? "?"}</div>
		<span class="text-gray-300 text-lg">vs</span>
		<div class="${gamer2Colour} text-lg mb-1">${match.g2.nick ?? "?"}</div>	
	`;
}

function nextMatchHtml(tournament: LocalTournament) {
	const m1 = tournament.matches[0];
	const m2 = tournament.matches[1];
	const m3 = tournament.matches[2];
	let g1: LocalGamer;
	let g2: LocalGamer;
	let matchNumber = 0;

	if (m3.g1.score + m3.g2.score > 0) {
		const winner = m3.g1.score > m3.g2.score ? m3.g1.nick : m3.g2.nick;
		return `<div class="text-green-800 text-lg">%%TEXT_CONGRATULATIONS%% ${winner}!</div>`;
	}

	if (0 == m1.g1.score && 0 == m1.g2.score) {
		g1 = m1.g1;
		g2 = m1.g2;
		matchNumber = 1;
	}
	else if (0 == m2.g1.score && 0 == m2.g2.score) {
		g1 = m2.g1;
		g2 = m2.g2;
		matchNumber = 2;
	}
	else if (0 == m3.g1.score && 0 == m3.g2.score) {
		g1 = m3.g1;
		g2 = m3.g2;
		matchNumber = 3;
	}

	return `
	<div class="flex flex-row justify-center items-center gap-2">
		<div class="text-[#BE2AD1] text-lg">${g1.nick}</div>
		<span class="text-gray-300 text-lg"> vs </span>
		<div class="text-[#FFCD5A] text-lg">${g2.nick}</div>${nextMatchButtonHtml(g1, g2, matchNumber)}
	</div>
	`;

}

function nextMatchButtonHtml(g1: LocalGamer, g2: LocalGamer, matchNumber: number) {
	return `
	<button id="nextTournamentMatchButton" data-g1="${g1.nick}" data-g2="${g2.nick}" data-match="${matchNumber}" class="outline-hidden text-gray-300 ml-8 bg-gray-800 cursor-[url(/images/pointer.png),pointer] text-center px-3 py-1 rounded-lg hover:bg-gray-700 text-lg">%%TEXT_TOURNAMENT_PLAY%%!</button>
	`;
}
