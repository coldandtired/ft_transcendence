import { nickToNumbers } from "../../common/utils.js";
import { Page, Result } from "./../../common/interfaces.js";
import { showAlert, showPage } from "./index.js";
import { closeClientSocket } from "./sockets/clientSocket.js";
import { isUserLoggedIn } from "./user.js";

/*
	The buttons and events create by the /profile page
*/
export function accountListeners() {
	/*
		Shows the dialog to choose a file
	*/
	const avatarUploadButton = <HTMLInputElement>document.querySelector("#avatarFilename");
	const avatarImage = document.querySelector("#avatarImage");
	if (avatarImage)
		avatarImage.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			avatarUploadButton.click()
		});

	/*
		Updates the user's avatar
	*/
	if (avatarUploadButton) {
		avatarUploadButton.addEventListener("change", () => {
			const files = avatarUploadButton.files;
			if (1 == files.length) {
				if (files[0].size > 25 * 1024) {
					showAlert(Result.ERR_AVATAR_TOO_BIG);
					return;
				}

				const reader = new FileReader();
				reader.readAsDataURL(files[0]);
				reader.onloadend = async () => {
					let avatar = reader.result as string;
					avatar = window.btoa(avatar).replaceAll("=", "");
					const response = await fetch("/account/avatar", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({
							avatar
						})
					});

					const result = await response.text();
					if (Result.SUCCESS == result)
						showPage(Page.ACCOUNT);
					else
						showAlert(result);
				}
			}
		});
	}

	/*
		Updates the user's nickname
	*/
	const changeNickForm = <HTMLFormElement>document.querySelector("#changeNickForm");
	if (changeNickForm) {
		changeNickForm.newNick.addEventListener("keydown", (e: any) => {
			if (!("Backspace" == e.key || " " == e.key || "Delete" == e.key || "Space" == e.key || "ArrowLeft" == e.key || "ArrowRight" == e.key ||
				(e.key.charCodeAt(0) >= 65 && e.key.charCodeAt(0) <= 90 || e.key.charCodeAt(0) >= 97 && e.key.charCodeAt(0) <= 122)
			))
				e.preventDefault();
		});

		changeNickForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			let newNick = changeNickForm.newNick.value;
			newNick = nickToNumbers(newNick);

			const response = await fetch("/account/nick", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					newNick
				})
			});

			const result = await response.text();
			if (Result.SUCCESS != result) {
				showAlert(result);
				return;
			}

			const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
			alertDialog.addEventListener("close", () => showPage(Page.ACCOUNT));
			showAlert(Result.SUCCESS_NICK);
		});
	}

	/*
		Updates a user's password
	*/
	const changePasswordForm = <HTMLFormElement>document.querySelector("#changePasswordForm");
	if (changePasswordForm) {
		changePasswordForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const checkPassword = changePasswordForm.currentPassword.value;
			const newPassword = changePasswordForm.newPassword.value;
			const repeatPassword = changePasswordForm.repeatPassword.value;
			if (newPassword != repeatPassword) {
				showAlert(Result.ERR_PASSWORDS_DONT_MATCH);
				return;
			}

			if (newPassword == checkPassword) {
				showAlert(Result.ERR_NO_NEW_PASSWORD);
				return;
			}

			const response = await fetch("/account/password", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					checkPassword,
					newPassword
				})
			});

			const result = await response.text();
			switch (result) {
				case Result.SUCCESS:
					const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
					alertDialog.addEventListener("close", () => showPage(Page.ACCOUNT));
					showAlert(Result.SUCCESS_PASSWORD);
					break;
				case Result.ERR_FORBIDDEN:
					showAlert(Result.ERR_BAD_PASSWORD);
					break;
				case Result.ERR_DB:
					showAlert(result);
					break;
			}
		});
	}

	const totpAppButton = document.querySelector("#totpAppButton");
	if (totpAppButton) {
		totpAppButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const appTotpResponse = await fetch("/totp/app", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({})
			});

			const appTotpJson = await appTotpResponse.json();
			if (Result.SUCCESS == appTotpJson.result) {
				const qrCode = document.querySelector("#totpQRCode");
				qrCode.innerHTML = appTotpJson.contents.qrcode;

				const totpSecret = document.querySelector("#totpSecret");
				totpSecret.innerHTML = appTotpJson.contents.secret;

				const totpAppDialog = <HTMLDialogElement>document.querySelector("#totpAppDialog");
				totpAppDialog.showModal();
			}
		});
	}

	const totpEmailButton = document.querySelector("#totpEmailButton");
	if (totpEmailButton) {
		totpEmailButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const emailTotpResponse = await fetch("/totp/email", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({})
			});

			const result = await emailTotpResponse.text();
			if (Result.SUCCESS != result) {
				showAlert(result);
				return;
			}

			const totpEnterCodeDialog = <HTMLDialogElement>document.querySelector("#totpEnterCodeDialog");
			totpEnterCodeForm.code.value = "";
			totpEnterCodeDialog.showModal();
		});
	}

	const totpDisableButton = document.querySelector("#totpDisableButton");
	if (totpDisableButton) {
		totpDisableButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const disableToptResponse = await fetch("/totp/disable", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({})
			});

			if (Result.SUCCESS == await disableToptResponse.text()) {
				const alertDialog = document.querySelector("#alertDialog");
				alertDialog.addEventListener("close", async () => {
					const response = await fetch("/auth/logout", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({})
					});
					const result = await response.text();
					if (Result.SUCCESS == result)
						showPage(Page.HOME);
				});
				showAlert(Result.SUCCESS_TOTP);
			}
		});
	}

	/*
		Checks the entered TOTP code from an email
	*/
	const totpAppForm = <HTMLFormElement>document.querySelector("#totpAppForm");
	if (totpAppForm) {
		totpAppForm.code.addEventListener("keydown", (e: any) => {
			if ("v" == e.key && e.ctrlKey)
				return;

			if (!("Escape" == e.key || "Enter" == e.key || "Backspace" == e.key || "Delete" == e.key || "ArrowLeft" == e.key || "ArrowRight" == e.key) && isNaN(e.key))
				e.preventDefault();
		});

		totpAppForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
			const code = totpAppForm.code.value;

			const response = await fetch("/totp/app/verify", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					code
				})
			});

			const result = await response.text();
			if (Result.SUCCESS == result) {
				alertDialog.addEventListener("close", async () => {
					const response = await fetch("/auth/logout", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({})
					});
					const result = await response.text();
					if (Result.SUCCESS == result)
						showPage(Page.HOME);
				});
				showAlert(Result.SUCCESS_TOTP);
				return;
			}

			alertDialog.addEventListener("close", () => {
				totpAppForm.code.value = "";
				totpAppForm.code.focus();
			});
			showAlert(Result.ERR_BAD_TOTP);
		});
	}

	/*
		Checks the entered TOTP code from an email
	*/
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
			const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
			const code = totpEnterCodeForm.code.value;

			const response = await fetch("/totp/email/verify", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					code
				})
			});

			const result = await response.text();
			if (Result.SUCCESS == result) {
				alertDialog.addEventListener("close", async () => {
					const response = await fetch("/auth/logout", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({})
					});
					const result = await response.text();
					if (Result.SUCCESS == result)
						showPage(Page.HOME);
				});
				showAlert(Result.SUCCESS_TOTP);
				return;
			}

			alertDialog.addEventListener("close", () => {
				totpEnterCodeForm.code.value = "";
				totpEnterCodeForm.code.focus();
			});
			showAlert(Result.ERR_BAD_TOTP);
		});
	}

	/*
		Logs out the user and returns to the home page
	*/
	const logoutButton = document.querySelector("#logoutButton");
	if (logoutButton) {
		logoutButton.addEventListener("click", async () => closeClientSocket());
	}

	/*
		Invalidates the user's refresh token, forcing a new log in even if someone has the token
	*/
	const invalidateTokenButton = document.querySelector("#invalidateTokenButton");
	if (invalidateTokenButton) {
		invalidateTokenButton.addEventListener("click", async () => {
			const response = await fetch("/account/token", {
				method: "POST"
			});

			const result = await response.text();
			if (Result.SUCCESS != result) {
				showAlert(result);
				return;
			}

			const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
			alertDialog.addEventListener("close", () => closeClientSocket());
			showAlert(Result.SUCCESS_TOTP);
		});
	}
}
