import { totpEnterCodeDialogHtml } from "./dialogsView.js";

export function authView(): string {
	return `
	<div class="flex flex-col items-center gap-2">
		<h1 class="text-gray-300 my-6 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1 mx-auto">%%TEXT_USER_DECISION%%</h1>
		${loginOrRegisterHtml()}
		${googleHtml()}
		${guestHtml()}
	</div>
	${totpEnterCodeDialogHtml()}
	`;
}

function loginOrRegisterHtml(): string {
	return `	
	<fieldset class="rounded-lg border bg-red-200/20 border-fuchsia-800 p-3 w-90">
		<legend class="text-fuchsia-800 text-center mx-auto">%%TEXT_LOG_IN_OR_REGISTER%%</legend>			
		<form id="userForm" class="flex flex-col gap-2">
			<div>
				<input type="email" name="email" placeholder="%%TEXT_EMAIL%%" autocomplete="email"
					class="rounded-lg block w-full p-2.5 bg-red-300/50 placeholder-stone-400 text-stone-700 outline-hidden"
					required="true">
			</div>
			<div>
				<input type="password" name="password" minlength="8" placeholder="%%TEXT_PASSWORD%%" autocomplete="current-password"
					class="rounded-lg block w-full p-2.5 bg-red-300/50 placeholder-stone-400 text-stone-700 outline-hidden"
					required="true">
			</div>
			<div class="flex flex-row justify-end gap-4">
				<button id="loginButton" type="submit" class="cursor-[url(/images/pointer.png),pointer] hover:text-gray-900 text-fuchsia-800">%%BUTTON_LOGIN%%</button>
				<button id="registerButton" type="submit" class="cursor-[url(/images/pointer.png),pointer] hover:text-gray-900 text-fuchsia-800">%%BUTTON_REGISTER%%</button>
			</div>
			</form>
	</fieldset>
	`;
}

function googleHtml(): string {
	return `	
	<fieldset class="rounded-lg border border-fuchsia-800 bg-red-200/20 p-3 w-90">
		<legend class="text-fuchsia-800 text-center mx-auto">Google</legend>
		<button id="googleButton" class="w-full cursor-[url(/images/pointer.png),pointer] bg-red-300/50 text-stone-700 hover:bg-red-300 font-medium rounded-lg py-2 px-4" data-client="${process.env.GOOGLE_CLIENT}">%%BUTTON_GOOGLE%% <img src="images/google.png" class="inline-block w-5 h-5" /></button>
	</fieldset>
	`;
}

function guestHtml(): string {
	return `	
	<fieldset class="rounded-lg border border-fuchsia-800 bg-red-200/20 p-3 w-90">
		<legend class="text-fuchsia-800 text-center mx-auto">%%TEXT_GUEST%%</legend>
		<button id="guestButton" class="w-full cursor-[url(/images/pointer.png),pointer] bg-red-300/50 text-stone-700 hover:bg-red-300 font-medium rounded-lg py-2 px-4">%%BUTTON_GUEST%%</button>
	</div>
	`;
}
