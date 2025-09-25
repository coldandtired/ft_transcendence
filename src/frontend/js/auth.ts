import { Page, Result, TotpType } from "../../common/interfaces.js";
import { showAlert, showPage } from "./index.js";
import { userLoggedIn } from "./user.js";

export function authFunctions() {
	const googleButton = <HTMLElement>document.querySelector("#googleButton");
	if (googleButton)
		googleButton.addEventListener("click", async => googleLogin(googleButton.dataset.client));

	const guestButton = document.querySelector("#guestButton");
	if (guestButton)
		guestButton.addEventListener("click", async () => guestLogin());

	const userForm = <HTMLFormElement>document.getElementById("userForm");
	if (userForm) {
		userForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const email = userForm.email.value;
			const password = userForm.password.value;

			if ("loginButton" == e.submitter.id)
				login(email, password);
			else
				register(email, password);
		});
	}
}

async function login(email: string, password: string) {
	const response = await fetch("/auth/login", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			email, password
		})
	});

	const json = await response.json();
	if (Result.SUCCESS != json.result) {
		showAlert(json.result);
		return;
	}

	if (TotpType.APP == json.totpType || TotpType.EMAIL == json.totpType) {
		const totpEnterCodeForm = <HTMLFormElement>document.querySelector("#totpEnterCodeForm");
		if (totpEnterCodeForm) {
			totpEnterCodeForm.code.addEventListener("keydown", (e: any) => {
				if ("v" == e.key && e.ctrlKey)
					return;

				if (!("Escape" == e.key || "Enter" == e.key || "Backspace" == e.key || "Delete" == e.key || "ArrowLeft" == e.key || "ArrowRight" == e.key) && isNaN(e.key))
					e.preventDefault();
			});

			totpEnterCodeForm.addEventListener("submit", async (e) => {
				e.preventDefault();
				const code = totpEnterCodeForm.code.value;

				const loginMethod = TotpType.APP == json.totpType ? "app" : "email";
				const response =  await fetch(`/totp/${loginMethod}/login`, {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						code,
						email
					})
				});

				const userJson = await response.json();
				if (Result.SUCCESS == userJson.result) {
					userLoggedIn(userJson.contents);
					showPage(Page.HOME);
					return;
				}

				const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
				alertDialog.addEventListener("close", () => {
					totpEnterCodeForm.code.value = "";
					totpEnterCodeForm.code.focus();
				});
				showAlert(Result.ERR_BAD_TOTP);
			});


			const totpEnterCodeDialog = <HTMLDialogElement>document.querySelector("#totpEnterCodeDialog");
			if (totpEnterCodeDialog)
				totpEnterCodeDialog.showModal();
		}
	}
	else {
		userLoggedIn(json.contents);
		showPage(Page.HOME);
	}
}

async function register(email: string, password: string) {
	const response = await fetch("/auth/register", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			email,
			password
		})
	});

	const json = await response.json();

	if (Result.SUCCESS != json.result) {
		showAlert(json.result);
		return;
	}
	const date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	userLoggedIn(json.contents);
	showPage(Page.HOME);
}

function googleLogin(clientId: string) {
	const query = {
		client_id: clientId,
		redirect_uri: `${window.location.href}auth/google`,
		response_type: "code",
		scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
	};

	const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
	url.search = new URLSearchParams(query).toString();
	window.location.href = url.toString();
}

async function guestLogin() {
	const response = await fetch("/auth/guest", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({})
	});

	const json = await response.json();
	if (Result.SUCCESS != json.result) {
		showAlert(json.result);
		return;
	}

	userLoggedIn(json.contents);
	showPage(Page.HOME);
}
