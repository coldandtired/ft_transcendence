import { TotpType, User, UserType } from "../../common/interfaces.js";
import { totpAppDialogHtml, totpEnterCodeDialogHtml } from "./dialogsView.js";

export function accountView(user: User): string {
	return `
	<div class="w-150 flex flex-col justify-center mx-auto items-center gap-2">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_ACCOUNT_TITLE%%</div>		
		<div class="flex flex-row w-full gap-2 mt-8">
			<fieldset class="p-2 border border-fuchsia-800 bg-red-200/20 rounded-lg">
				<legend class="text-fuchsia-800 text-center mx-auto">%%TEXT_CHANGE_AVATAR%%</legend>
				<div>
					<img class="w-20 h-20 mx-auto cursor-[url(/images/pointer.png),pointer] rounded-lg" src="${user.avatar}" id="avatarImage" />
					<input type="file" id="avatarFilename" accept=".png, .jpg, .jpeg, .svg" class="hidden">
				</div>
			</fieldset>
			<fieldset class="grow p-3 border border-fuchsia-800 bg-red-200/20 rounded-lg">
				<legend class="text-fuchsia-800 text-center mx-auto">%%TEXT_CHANGE_NICK%%</legend>
				<form id="changeNickForm" class="flex flex-col">
					<input type="text" maxlength="25" minlength="5" id="newNick" placeholder="%%TEXT_NEW_NICK%%" required="true"
						class="outline-hidden rounded-lg w-full p-2.5 bg-red-300/50 placeholder-stone-400 text-stone-700">
					<button type="submit" formmethod="post"
						class="ml-auto cursor-[url(/images/pointer.png),pointer] mt-2 hover:text-stone-700 text-fuchsia-800">%%BUTTON_UPDATE%%</button>
				</form>
			</fieldset>
		</div>
		${securityHtml(user)}		
		<div class="w-full flex flex-row justify-center border pt-1 border-fuchsia-800 bg-red-200/20 rounded-lg px-2 gap-4">
			<button id="logoutButton" class="cursor-[url(/images/pointer.png),pointer] text-red-900 font-bold hover:text-stone-700">%%BUTTON_LOGOUT%%</button>
			<button id="invalidateTokenButton" class="cursor-[url(/images/pointer.png),pointer] text-red-900 font-bold hover:text-stone-700">%%BUTTON_INVALIDATE_TOKEN%%</button>
		</div>
	</div>
	${totpAppDialogHtml()}
	${totpEnterCodeDialogHtml()}
	`;
}

function securityHtml(user: User): string {
	return UserType.GOOGLE == user.userType ? "" :
		`
	<div class="flex flex-row w-full gap-2">
		<fieldset class="border border-fuchsia-800 bg-red-200/20 rounded-lg p-3 grow">
			<legend class="text-fuchsia-800 text-center mx-auto">%%TEXT_CHANGE_PASSWORD%%</legend>
			<form id="changePasswordForm" class="flex flex-col gap-2">
				<input type="password" id="currentPassword" maxlength="32" placeholder="%%TEXT_CURRENT_PASSWORD%%" required="true"
					class="outline-hidden rounded-lg w-full p-2.5 bg-red-300/50 placeholder-stone-400 text-stone-700">
				<input type="password" id="newPassword" maxlength="32" placeholder="%%TEXT_NEW_PASSWORD%%" minlength="8" required="true"
					class="outline-hidden rounded-lg w-full p-2.5 bg-red-300/50 placeholder-stone-400 text-stone-7000">
				<input type="password" id="repeatPassword" maxlength="32" placeholder="%%TEXT_REPEAT_PASSWORD%%" minlength="8" required="true"
					class="outline-hidden rounded-lg w-full p-2.5 bg-red-300/50 placeholder-stone-400 text-stone-700">
				<button type="submit" formmethod="post"
					class="ml-auto cursor-[url(/images/pointer.png),pointer] hover:text-stone-700 text-fuchsia-800">%%BUTTON_UPDATE%%</button>
			</form>
		</fieldset>
		<fieldset class="border border-fuchsia-800 rounded-lg bg-red-200/20 flex flex-col p-3 gap-6 pt-5">
			<legend class="text-fuchsia-800 text-center mx-auto">%%TEXT_TOTP_TITLE%%</legend>
			${totpHtml(user)}
		</fieldset>
	</div>
	`;
}

function totpHtml(user: User): string {
	switch (user.totpType) {
		case TotpType.APP:
			return `
			<div class="flex flex-col gap-2">
				<div class="text-green-900 mb-3 text-center mx-auto">%%BUTTON_APP_TOTP%%</div>
				<button id="totpEmailButton" class="outline-hidden rounded-lg bg-red-300/50 text-stone-700 px-1 py-2 hover:bg-red-300 cursor-[url(/images/pointer.png),pointer]">%%BUTTON_EMAIL_TOTP%%</button>
				<button id="totpDisableButton" class="outline-hidden rounded-lg bg-red-300/50 text-stone-700 mt-2 px-1 py-2 hover:bg-red-300 cursor-[url(/images/pointer.png),pointer]">%%BUTTON_DISABLE_TOTP%%</button>
			</div>
			`;
		case TotpType.DISABLED:
			return `
			<div class="flex flex-col gap-2">
				<div class="text-red-900 mb-3 text-center mx-auto">%%BUTTON_DISABLE_TOTP%%</div>
				<button id="totpAppButton" class="outline-hidden rounded-lg bg-red-300/50 text-stone-700 px-1 py-2 hover:bg-red-300 cursor-[url(/images/pointer.png),pointer]">%%BUTTON_APP_TOTP%%</button>
				<button id="totpEmailButton" class="outline-hidden rounded-lg bg-red-300/50 text-stone-700 mt-2 px-1 py-2 hover:bg-red-300 cursor-[url(/images/pointer.png),pointer]">%%BUTTON_EMAIL_TOTP%%</button>
			</div>
			`;
		case TotpType.EMAIL:
			return `
			<div class="flex flex-col gap-2">
				<div class="text-green-900 mb-3 text-center mx-auto">%%BUTTON_EMAIL_TOTP%%</div>
				<button id="totpAppButton" class="outline-hidden rounded-lg bg-red-300/50 text-stone-700 px-1 py-2 hover:bg-red-300 cursor-[url(/images/pointer.png),pointer]">%%BUTTON_APP_TOTP%%</button>
				<button id="totpDisableButton" class="outline-hidden rounded-lg bg-red-300/50 text-stone-700 mt-2 px-1 py-2 hover:bg-red-300 cursor-[url(/images/pointer.png),pointer]">%%BUTTON_DISABLE_TOTP%%</button>
			</div>
			`;
	}
}
