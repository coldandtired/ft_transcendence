export function alertDialogHtml(): string {
	return `	
	<dialog id="alertDialog" class="backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 rounded-lg shadow border w-120 bg-stone-700 border-red-300/50 p-2">
		<div>
			<h1 class="text-xl font-bold text-white text-center">
				Transcendence
			</h1>
			<p id="alertContent" class="text-gray-400 text-center text-wrap"></p>
			<button id="closeAlertButton"
				class="float-right cursor-[url(/images/pointer.png),pointer] outline-hidden bg-red-300/50 text-gray-300 hover:bg-red-300 font-medium rounded-lg px-4 py-0">OK</button>
		</div>
	</dialog>
	`;
}

export function chatUsersHtml(): string {
	return `<dialog id="chatUsersDialog" class="outline-hidden mx-auto mt-80 text-center content-center rounded-lg border bg-stone-700 border-red-300/50"></dialog>`;
}

export function profileDialogHtml(): string {
	return `<dialog id="profileDialog" class="outline-hidden mx-auto mt-40 text-center content-center rounded-lg border bg-stone-700 border-red-300/50"></dialog>`;
}

export function totpAppDialogHtml(): string {
	return `
	<dialog id="totpAppDialog" class="backdrop:bg-black backdrop:opacity-70 m-auto w-100 content-center rounded-lg border bg-stone-700 border-red-300/50">
		<div class="p-3">
			<h1 class="text-xl font-bold text-gray-300 mb-2 text-center">
				%%TEXT_TOTP_TITLE%%
			</h1>
			<div id="totpQRCode" class="bg-gray-300 h-86 w-86 mx-auto rounded-lg"></div>
			<div class="text-gray-300 text-wrap text-center my-2">%%TEXT_TOTP_SCAN%%</div>
			<div id="totpSecret" class="text-white text-center"></div>
			<div class="text-gray-300 text-wrap text-center my-2">%%TEXT_TOTP_INPUT%%</div>
			<form id="totpAppForm" class="mt-2 mx-auto text-center">
				<input type="submit" class="hidden" />				
				<input type="text" name="code" placeholder="%%TEXT_TOTP_CODE%%" minlength="6" maxlength="6"
						class="outline-hidden mx-auto text-center rounded-lg w-30 h-7 p-1.5 bg-red-300/50 placeholder-stone-400 text-stone-700"
						required="true">	
			</form>
		</div>
	</dialog>
	`;
}

export function totpEnterCodeDialogHtml(): string {
	return `
	<dialog id="totpEnterCodeDialog" class="px-4 py-2 backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 content-center rounded-lg border w-80 bg-stone-700 border-red-300/50 text-center items-center">
		<div>
			<h1 class="text-xl font-bold text-gray-300">
				%%TEXT_TOTP_CODE_TITLE%%
			</h1>
			<form id="totpEnterCodeForm">
				<div>
					<input type="text" placeholder="%%TEXT_TOTP_CODE%%" name="code" minlength="6" maxlength="6"
						class="outline-hidden w-40 h-7 text-center rounded-lg mx-auto my-2 p-1.5 bg-red-300/50 placeholder-stone-400 text-stone-700"
						required="true">
				</div>
				<input type="submit" class="hidden"/>
			</form>
		</div>
	</dialog>
	`;
}

/*
	This is the HTML that hosts the game. You can add ids and adjust anything at run time if needed
*/
export function gameDialogHtml(): string {
	return `
	<dialog id="gameDialog" class="outline-hidden w-[75vw] h-[40vw] m-auto text-center content-center rounded-lg border bg-stone-700 border-red-300/50"></dialog>
	`;
}
