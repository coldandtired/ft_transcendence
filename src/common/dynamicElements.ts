import { getLanguage } from "../frontend/js/index.js";
import { ChatMessage, ChatPartner, MatchResult, MessageType, ShortUser, User, UserChatMessage, UserNotification, UserType } from "./interfaces.js";
import { translate } from "./translations.js";

/*
	The add/remove friend/foe buttons in the profile dialog
*/
export function profileActionbuttons(isfriend: boolean, isFoe: boolean, isInMatch: boolean, profileUserId: number) {
	const inviteButton = isInMatch ? `<div id="inviteButton" data-id="${profileUserId}" class="cursor-[url(/images/pointer.png),pointer] text-red-300/50 hover:text-green-300">%%BUTTON_INVITE%%</div>` : "";
	if (!(isfriend || isFoe))
		return `
		<div id="addFriendButton" data-id="${profileUserId}" class="cursor-[url(/images/pointer.png),pointer] text-red-300/50 hover:text-green-300">%%BUTTON_ADD_FRIEND%%</div>
		<div id="addFoeButton" data-id="${profileUserId}" class="cursor-[url(/images/pointer.png),pointer] text-red-300/50 hover:text-red-300">%%BUTTON_ADD_FOE%%</div>
		${inviteButton}
		`;

	if (isfriend)
		return `
		<div id="removeFriendButton" data-id="${profileUserId}" class="cursor-[url(/images/pointer.png),pointer] text-red-300/50 hover:text-red-300">%%BUTTON_REMOVE_FRIEND%%</div>
		${inviteButton}
		`;

	if (isFoe)
		return `
		<div id="removeFoeButton" data-id="${profileUserId}" class="cursor-[url(/images/pointer.png),pointer] text-red-300/50 hover:text-red-300">%%BUTTON_REMOVE_FOE%%</div>
		`;

	return "";
}

export function partnersHtml(partners: ChatPartner[]): string {
	let partnersString = "";
	partners.forEach(partner => {
		partnersString += partnerHtml(partner);
	});

	return partnersString;
}

export function partnerHtml(partner: ChatPartner): string {
	const showChatsIndicator = partner.hasUnseen ? "" : "collapse";

	return `
	<div class="chatPartnerButton w-full relative inline-flex rounded-lg bg-red-300/50 hover:bg-red-400" data-id="${partner.userId}" data-nick="${partner.nick}">
		<button class="inline-flex w-full flex-row gap-2 cursor-[url(/images/pointer.png),pointer] justify-end items-center text-right text-stone-700 p-2 rounded-lg">
			<div>${partner.nick}</div>
			<img class="w-10 h-10 rounded-lg" src="${partner.avatar}"></img>
		</button>
		<span class="chatPartnerButtonIndicator ${showChatsIndicator} absolute top-1 right-1 flex size-3" data-id="${partner.userId}">
			<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-700 opacity-75"></span>
			<span class="relative inline-flex size-3 rounded-full bg-fuchsia-800"></span>
		</span>
	</div>
	`;
}

export function selectedPartnerHtml(partner: ChatPartner): string {
	return `
	<div class="chatPartnerButton w-full relative inline-flex  rounded-lg bg-red-300" data-id="${partner.userId}" data-nick="${partner.nick}">
		<button class="inline-flex w-full flex-row gap-2 justify-end items-center text-right text-stone-700 p-2 rounded-lg">
			<div>${partner.nick}</div>
			<img class="w-10 h-10 rounded-lg" src="${partner.avatar}"></img>
		</button>
		<span class="chatPartnerButtonIndicator collapse absolute top-1 right-1 flex size-3" data-id="${partner.userId}">
			<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-700 opacity-75"></span>
			<span class="relative inline-flex size-3 rounded-full bg-fuchsia-800"></span>
		</span>
	</div>
	`;
}

/*
	The list of all the chats between the user and partner
*/
export function userChatsMessages(chats: UserChatMessage[], partnerId: number): string {
	let chatHtml = "";
	chats.forEach(chat => chatHtml += chatString(chat.message, partnerId == chat.fromId));
	return chatHtml;
}

export function userNotificationsMessages(notifications: UserNotification[]): string {
	let notificationsHtml = "";
	notifications.forEach(notification => notificationsHtml += userNotificationMessage(notification));
	return notificationsHtml;
}

export function userNotificationMessage(notification: UserNotification): string {
	switch (notification.type) {
		case MessageType.NOTIFICATION_INVITE:
			const string = `${notification.fromNick} ${translate(getLanguage(), "%%TEXT_INVITATION%%")}`;
			return `<div class="inviteNotificationButton w-full text-gray-300 text-center bg-red-300/50 mx-auto px-4 py-2 rounded-lg cursor-[url(/images/pointer.png),pointer]" data-game="${notification.gameId}">${string}</div>`;
		case MessageType.NOTIFICATION_TOURNAMENT:
			const string2 = `${translate(getLanguage(), "%%TEXT_NEXT_MATCH%%")}`;
			return `<div class="nextMatchNotificationButton w-full text-gray-300 text-center bg-red-300/50 mx-auto px-4 py-2 rounded-lg cursor-[url(/images/pointer.png),pointer]">${string2}</div>`;
	}
}

export function chatPartner(partner: ShortUser): string {
	return `
	<div class="bg-red-300/50 rounded text-center p-2 text-stone-700">${partner.nick}</div>
	`;
}

/*
	The chat message itself, blue for incoming, green for outgoing
*/
export function chatString(message: string, isPartner: boolean): string {

	if ("%%MESSAGE_INVITATION%%" == message) {
		return isPartner ? `<div class="text-gray-300 bg-blue-800 mr-auto px-4 py-2 rounded-lg cursor-[url(/images/pointer.png),pointer]">${translate(getLanguage(), message)}</div>`
			: "";
	}

	return isPartner ?
		`
	<div class="text-gray-300 bg-blue-800 mr-auto px-4 py-2 rounded-lg">${message}</div>
	` :
		`
	<div class="text-gray-300 bg-green-800 ml-auto px-4 py-2 rounded-lg">${message}</div>
	`;
}

export function chatMessageForm(): string {
	return `
	<div class="flex flex-row gap-1 mt-2">
		<input type="text" name="message" class="outline-hidden px-2 py-1 text-stone-700 grow bg-red-300/50 rounded-lg">
		<input type="submit" hidden>
		<button type="submit" class="outline-hidden px-2 pt-1 text-center items-center content-center cursor-[url(/images/pointer.png),pointer] hover:bg-red-300 rounded-lg bg-red-300/50"><i class="text-fuchsia-800 m-auto fa-solid fa-play"></i></button>
	</div>
	`;
}

export function localTournamentHtml(nicks: string[]): string {
	return `
	<form id="localTournamentForm">
		<div class="flex flex-col items-center gap-4">
			<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_LOCAL_TOURNAMENT%%</div>
			<div class="text-stone-700 text-lg mt-8">${nicks[0]}</div>
			<div class="flex flex-row gap-2 justify center">
				<input type="text" name="g2Nick" value="${nicks[1]}" minlength="5" maxlength="25" required="true" placeholder="%%TEXT_PLAYER%% 2" class="w-80 outline-hidden rounded-lg p-2.5 bg-red-300/50 text-center placeholder-stone-400 text-stone-700">
				<input type="text" name="g3Nick" value="${nicks[2]}" minlength="5" maxlength="25" required="true" placeholder="%%TEXT_PLAYER%% 3" class="w-80 outline-hidden rounded-lg p-2.5 bg-red-300/50 text-center placeholder-stone-400 text-stone-700">
			</div>
			<input type="text" name="g4Nick" value="${nicks[3]}" minlength="5" maxlength="25" required="true" placeholder="%%TEXT_PLAYER%% 4" class="w-80 outline-hidden rounded-lg mx-auto p-2.5 bg-red-300/50 text-center placeholder-stone-400 text-stone-700">
			<button type="submit" class="outline-hidden text-stone-700 mt-8 bg-red-300/50 mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-red-300">%%TEXT_START%%</button>
		</div>
	</form>
	`;
}

export function addChatPartnerView(users: ShortUser[]): string {
	let userList = "";
	for (var key in users)
		userList += chatUserHtml(users[key]);

	return `
	<div class="w-80 h-80 flex flex-col p-2 gap-2">
		<div id="closeAddChatPartnerButton" class="mx-auto cursor-[url(/images/pointer.png),pointer]"><i class="text-red-300/50 hover:text-red-300 fa fa-xmark"></i></div>
		<div class="flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">${userList}</div>
	</div>
	`;
}

export function profileView(matchResults: MatchResult[], isfriend: boolean, isFoe: boolean, profileUser: ShortUser, user: User): string {
	const actionButtons = (profileUser.userId == user.userId || UserType.GUEST == profileUser.userType) ? "" : profileActionbuttons(isfriend, isFoe, user.gameId != null, profileUser.userId);
	return `
	<div class="w-120 h-120 flex flex-col p-2">
		<div id="closeProfileButton" class="mx-auto cursor-[url(/images/pointer.png),pointer]"><i class="text-red-300/50 hover:text-red-300 fa fa-xmark"></i></div>
		<div class="text-gray-300 mb-2 text-lg">${profileUser.nick}</div>
		<div id="actionButtonsContainer" class="flex flex-row mx-auto gap-4">
			${actionButtons}
		</div>
		<div class="my-2 grow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
			${matchResultsString(matchResults)}
		</div>
		<div class="text-gray-300">
			${stats(matchResults)}
		</div>
	</div>
	`;
}

function chatUserHtml(user: ShortUser): string {
	return `
	<div class="addChatPartnerButton flex flex-row gap-2 p-1 items-center rounded-lg bg-red-300/50 cursor-[url(/images/pointer.png),pointer]" data-id="${user.userId}" data-nick="${user.nick}">
		<img class="w-10 h-10 rounded-lg" src="${user.avatar}"/>
		<div class="text-stone-700">${user.nick}</div>
	</div>
	`;
}

function matchResultsString(matchResults: MatchResult[]): string {
	let matchList = "";
	for (var key in matchResults) {
		matchList += matchResultString(matchResults[key]);
	}

	if (0 == matchList.length)
		return `<div class="text-gray-300 pt-8 text-center">%%TEXT_NO_MATCHES%%</div>`

	return matchList;
}

function matchResultString(matchResult: MatchResult): string {
	let colour: string;
	if (matchResult.opponentScore > matchResult.score)
		colour = "red";
	else
		colour = matchResult.tournamentWin ? "fuchsia" : "green";

	const date: Date = new Date(matchResult.playedAt);

	return `
	<div class="p-2.5 rounded-lg m-3 bg-red-300/50 text-stone-700">
		<div class="flex flex-row gap-4">
			<div>${date.toLocaleDateString("pl-PL")}</div>
			<div class="grow text-${colour}-800">${matchResult.score} : ${matchResult.opponentScore} vs ${matchResult.opponent}</div>
		</div>
	</div>
	`;
}

function stats(matchResults: MatchResult[]): string {
	let won: number = 0;
	let tournamentsWon: number = 0;
	for (var key in matchResults) {
		var match = matchResults[key];
		if (match.score > match.opponentScore)
			won++;
		if (match.tournamentWin)
			tournamentsWon++
	}

	const matchesReplacement = 1 == matchResults.length ? "%%TEXT_MATCH_SINGULAR%%" : "%%TEXT_MATCH_PLURAL%%";
	const tournamentsReplacement = 1 == tournamentsWon ? "%%TEXT_TOURNAMENT_SINGULAR%%" : "%%TEXT_TOURNAMENT_PLURAL%%";

	return `%%TEXT_WON%% ${won}/${matchResults.length} ${matchesReplacement} and ${tournamentsWon} ${tournamentsReplacement}!`;
}
