import { addChatPartnerView, chatMessageForm, chatPartner, chatString, partnerHtml, selectedPartnerHtml, userNotificationMessage, userNotificationsMessages } from "./../../common/dynamicElements.js";
import { Message, MessageType, Page, Result, ShortUser } from "./../../common/interfaces.js";
import { showPage } from "./index.js";
import { currentPage, sendMessageToServer } from "./sockets/clientSocket.js";
import { joiningMatch } from "./sockets/remoteMatchesMessages.js";
import { getUserGameId, getUserId, isUserLoggedIn, setUserGameId } from "./user.js";
import { profileFunctions } from "./users/profile.js";

export async function userSendNotification(message: Message) {
	const foeResponse = await fetch(`/foes/${message.fromId}`);
	const foesJson = await foeResponse.json();
	if (Result.SUCCESS != foesJson.result || foesJson.contents == true) {
		await fetch(`/chat/waiting/clear/0`);
		return;
	}

	const response = await fetch(`/profile/user/${message.fromId}`);
	const json = await response.json();
	if (Result.SUCCESS != json.result)
		return;

	const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
	if (chatPartnerContainer) {
		const partnerId = parseInt(chatPartnerContainer.dataset.id);
		if (partnerId === 0) {
			const response = await fetch(`/chat/waiting/clear/0`);
			if (Result.SUCCESS != await response.text())
				return;

			const notification = userNotificationMessage({
				fromId: json.contents.userId,
				fromNick: json.contents.nick,
				gameId: json.contents.gameId,
				sentAt: new Date(),
				type: message.type
			});
			const node = document.createElement("div");
			node.innerHTML = notification;
			const realNode = node.firstElementChild;
			realNode.addEventListener("click", async function () {
				setUserGameId(this.dataset.game);
				await joiningMatch(this.dataset.game);
				showPage(Page.GAME);
			});
			const container = document.querySelector("#userChatsContainer");
			container.insertBefore(realNode, container.firstChild);
		}

		else if (Page.CHAT == currentPage()) {
			const notificationsButton = document.querySelector("#notificationsButton");
			(notificationsButton.childNodes[3] as HTMLElement).classList.remove("collapse");

			const chatIndicator = document.querySelector("#chatIndicator");
			if (chatIndicator)
				chatIndicator.classList.remove("collapse");
		}
	}
	else {
		//other page
		const chatIndicator = document.querySelector("#chatIndicator");
		if (chatIndicator)
			chatIndicator.classList.remove("collapse");
	}
}

export async function userSendTournamentNotification(message: Message) {
	const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
	if (chatPartnerContainer) {
		const partnerId = parseInt(chatPartnerContainer.dataset.id);
		if (partnerId === 0) {
			const response = await fetch(`/chat/waiting/clear/0`);
			if (Result.SUCCESS != await response.text())
				return;

			const notification = userNotificationMessage({
				sentAt: new Date(),
				type: message.type
			});
			const node = document.createElement("div");
			node.innerHTML = notification;
			const realNode = node.firstElementChild;
			realNode.addEventListener("click", async function () {
				showPage(Page.GAME);
			});
			const container = document.querySelector("#userChatsContainer");
			container.insertBefore(realNode, container.firstChild);
		}

		else if (Page.CHAT == currentPage()) {
			const notificationsButton = document.querySelector("#notificationsButton");
			(notificationsButton.childNodes[3] as HTMLElement).classList.remove("collapse");

			const chatIndicator = document.querySelector("#chatIndicator");
			if (chatIndicator)
				chatIndicator.classList.remove("collapse");
		}
	}
	else {
		//other page
		const chatIndicator = document.querySelector("#chatIndicator");
		if (chatIndicator)
			chatIndicator.classList.remove("collapse");
	}
}

export async function userSendUserChat(message: Message) {
	const foeResponse = await fetch(`/foes/${message.fromId}`);
	const foesJson = await foeResponse.json();
	if (Result.SUCCESS != foesJson.result || foesJson.contents == true) {
		await fetch(`/chat/waiting/clear/${message.fromId}`);
		return;
	}

	const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
	if (chatPartnerContainer) {
		const partnerId = parseInt(chatPartnerContainer.dataset.id);
		if (partnerId === message.fromId || partnerId === message.toId) {
			// user is chatting with this partner
			const response = await fetch(`/chat/waiting/clear/${partnerId}`);
			if (Result.SUCCESS != await response.text())
				return;

			const node = document.createElement("span");
			node.innerHTML = chatString(message.chat, getUserId() == message.toId);
			const container = document.querySelector("#userChatsContainer");
			if (node.firstElementChild)
				container.insertBefore(node.firstElementChild, container.firstChild);
			else
				container.appendChild(node.firstElementChild);
		}
		else if (Page.CHAT == currentPage()) {
			// user is chatting with another partner
			const partnerId = message.fromId == getUserId() ? message.toId : message.fromId;
			const chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
			let selectedButton: HTMLElement;
			for (var i = 0; i < chatPartnerButtons.length; i++) {
				if (parseInt((chatPartnerButtons[i] as HTMLElement).dataset.id) == partnerId) {
					selectedButton = chatPartnerButtons[i] as HTMLElement;
					(selectedButton.childNodes[3] as HTMLElement).classList.remove("collapse");
				}
			}

			if (!selectedButton) {
				const response = await fetch(`/profile/user/${partnerId}`);
				const profileJson = await response.json();
				if (Result.SUCCESS == profileJson.result) {
					const partner = profileJson.contents as ShortUser;
					if (0 == chatPartnerButtons.length)
						insertChatPartner(partner, null, false);
					else {
						let nicks = [];
						for (var i = 0; i < chatPartnerButtons.length; i++)
							nicks.push((chatPartnerButtons[i] as HTMLElement).dataset.nick);

						nicks.push(partner.nick);
						nicks.sort((a, b) => a.localeCompare(b));
						const index = nicks.indexOf(partner.nick);
						insertChatPartner(partner, chatPartnerButtons[index] as HTMLElement, 0 == index);
					}
				}
			}

			const chatIndicator = document.querySelector("#chatIndicator");
			if (chatIndicator)
				chatIndicator.classList.remove("collapse");
		}
	}
	else {
		// user is on another page
		const partnerId = message.fromId == getUserId() ? message.toId : message.fromId;
		const chatIndicator = document.querySelector("#chatIndicator");
		if (chatIndicator)
			chatIndicator.classList.remove("collapse");
	}
}

export function userChatListeners() {
	let chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
	for (var i = 0; i < chatPartnerButtons.length; i++)
		chatPartnerButtons[i].addEventListener("click", function () { chatPartnerClicked(this) });

	const chatPartnerContainer = document.querySelector("#chatPartnerContainer");
	if (chatPartnerContainer) {
		chatPartnerContainer.addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const profileBox = await fetch(`/profile/${this.dataset.id}`);

			const json = await profileBox.json();
			if (Result.SUCCESS != json.result)
				return;

			const dialog = <HTMLDialogElement>document.querySelector("#profileDialog");
			dialog.innerHTML = json.value;
			profileFunctions();
			if (document.activeElement instanceof HTMLElement)
				document.activeElement.blur();
			dialog.showModal();
		});
	}

	const addUserChatButton = document.querySelector("#addUserChatButton");
	if (addUserChatButton) {
		addUserChatButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const response = await (fetch("/chat/users"));
			const json = await response.json();
			const chatUsersDialog = <HTMLDialogElement>document.querySelector("#chatUsersDialog");
			if (chatUsersDialog) {
				chatUsersDialog.innerHTML = addChatPartnerView(json.contents);
				const closeAddChatPartnerButton = document.querySelector("#closeAddChatPartnerButton");
				if (closeAddChatPartnerButton)
					closeAddChatPartnerButton.addEventListener("click", () => chatUsersDialog.close());
				const addChatPartnerButtons = document.getElementsByClassName("addChatPartnerButton");
				for (var i = 0; i < addChatPartnerButtons.length; i++) {
					addChatPartnerButtons[i].addEventListener("click", function () {
						const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
						chatPartnerContainer.innerHTML = `<div class="bg-red-300/50 rounded text-center p-2 text-stone-700">${this.dataset.nick}</div>`;
						chatPartnerContainer.dataset.id = this.dataset.id;
						chatPartnerContainer.dataset.new = "true";
						resetChatPartnerButtons();
						document.querySelector("#userChatsContainer").innerHTML = "";
						document.querySelector("#sendUserChatForm").innerHTML = chatMessageForm();
						chatUsersDialog.close();
					});
				}
				chatUsersDialog.showModal();
			}
		});
	}

	const notificationsButton = document.querySelector("#notificationsButton");
	if (notificationsButton) {
		notificationsButton.addEventListener("click", async () => {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const chatsBox = await fetch("/chat/notifications");
			const notifications = await chatsBox.json();
			if (Result.SUCCESS == notifications.result) {
				const userChatsContainer = document.querySelector("#userChatsContainer");
				if (userChatsContainer) {
					resetChatPartnerButtons();
					const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
					chatPartnerContainer.innerHTML = "";
					chatPartnerContainer.dataset.id = "0";
					notificationsButton.classList.add("bg-red-400");
					notificationsButton.classList.remove("bg-red-300/50");
					notificationsButton.classList.remove("cursor-[url(/images/pointer.png),pointer]");
					notificationsButton.classList.remove("hover:bg-red-300");
					const messages = notifications.contents;
					userChatsContainer.innerHTML = userNotificationsMessages(messages);
					document.querySelector("#sendUserChatForm").innerHTML = "";
				}
			}

			(notificationsButton.childNodes[3] as HTMLElement).classList.add("collapse");
			const unseenBox = await fetch("/chat/waiting");
			const unseenJson = await unseenBox.json();
			if (Result.SUCCESS == unseenJson.result && unseenJson.contents == false) {
				const chatIndicator = document.querySelector("#chatIndicator");
				if (chatIndicator)
					chatIndicator.classList.add("collapse");
			}
			let inviteNotificationButtons = document.getElementsByClassName("inviteNotificationButton");
			for (var i = 0; i < inviteNotificationButtons.length; i++) {
				inviteNotificationButtons[i].addEventListener("click", async function () {
					setUserGameId(this.dataset.game);
					await joiningMatch(this.dataset.game);
					showPage(Page.GAME);
				});
			}

			let nextMatchNotificationButtons = document.getElementsByClassName("nextMatchNotificationButton");
			for (var i = 0; i < nextMatchNotificationButtons.length; i++) {
				nextMatchNotificationButtons[i].addEventListener("click", async function () {
					showPage(Page.GAME);
				});
			}
		});
	}

	const sendUserChatForm = <HTMLFormElement>document.querySelector("#sendUserChatForm");
	if (sendUserChatForm) {
		sendUserChatForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
			const messageText: string = sendUserChatForm.message.value;
			if (messageText.length > 0) {
				sendMessageToServer({
					type: MessageType.USER_SEND_USER_CHAT,
					gameId: getUserGameId(),
					chat: messageText,
					toId: parseInt(chatPartnerContainer.dataset.id)
				});
				if ("true" === chatPartnerContainer.dataset.new && messageText != "!!") {
					chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
					const profileResponse = await fetch(`/profile/user/${chatPartnerContainer.dataset.id}`);
					const profileJson = await profileResponse.json();
					if (Result.SUCCESS == profileJson.result) {
						const partner = profileJson.contents as ShortUser;
						if (0 == chatPartnerButtons.length)
							insertNewChatPartner(partner, null, false);
						else {
							let nicks = [];
							for (var i = 0; i < chatPartnerButtons.length; i++)
								nicks.push((chatPartnerButtons[i] as HTMLElement).dataset.nick);

							nicks.push(partner.nick);
							nicks.sort((a, b) => a.localeCompare(b));
							const index = nicks.indexOf(partner.nick);
							insertNewChatPartner(partner, chatPartnerButtons[index] as HTMLElement, 0 == index);
						}
					}
					chatPartnerContainer.dataset.new = "false";
				}
			}
			sendUserChatForm.message.value = "";
		});
	}
}

async function chatPartnerClicked(button: HTMLElement) {
	if (!isUserLoggedIn())
		return showPage(Page.AUTH);

	const chatsBox = await fetch(`/chat/partners/${button.dataset.id}`);

	const json = await chatsBox.json();
	if (Result.SUCCESS == json.result) {
		resetChatPartnerButtons();
		button.classList.add("bg-red-400");
		button.classList.remove("bg-red-300/50");
		button.classList.remove("cursor-[url(/images/pointer.png),pointer]");
		button.classList.remove("hover:bg-red-300");

		const userChatsContainer = document.querySelector("#userChatsContainer");
		if (userChatsContainer) {
			const messages = json.contents.messages;
			const partner = json.contents.partner;
			const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
			chatPartnerContainer.innerHTML = chatPartner(partner);
			chatPartnerContainer.dataset.id = partner.userId;
			userChatsContainer.innerHTML = messages;
			document.querySelector("#sendUserChatForm").innerHTML = chatMessageForm();
		}

		(button.childNodes[3] as HTMLElement).classList.add("collapse");
		const unseenBox = await fetch(`/chat/waiting`);

		const unseenJson = await unseenBox.json();
		if (Result.SUCCESS == unseenJson.result && unseenJson.contents == false) {
			const chatIndicator = document.querySelector("#chatIndicator");
			if (chatIndicator)
				chatIndicator.classList.add("collapse");
		}
	}
}

function resetChatPartnerButtons() {
	const chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
	for (var i = 0; i < chatPartnerButtons.length; i++) {
		chatPartnerButtons[i].classList.remove("bg-red-400");
		chatPartnerButtons[i].classList.add("bg-red-300/50");
		chatPartnerButtons[i].classList.add("cursor-[url(/images/pointer.png),pointer]");
		chatPartnerButtons[i].classList.add("hover:bg-red-300");
	}

	const notificationsButton = document.querySelector("#notificationsButton");
	if (notificationsButton) {
		notificationsButton.classList.remove("bg-red-400");
		notificationsButton.classList.add("bg-red-300/50");
		notificationsButton.classList.add("cursor-[url(/images/pointer.png),pointer]");
		notificationsButton.classList.add("hover:bg-red-300");
	}
}

function insertChatPartner(partner: ShortUser, insertAfter: HTMLElement, first: boolean) {
	const node = document.createElement("div");

	node.innerHTML = partnerHtml({
		avatar: partner.avatar,
		gameId: partner.gameId,
		hasUnseen: true,
		nick: partner.nick,
		userId: partner.userId,
		userType: partner.userType
	});

	const realNode = node.firstElementChild;
	const usersDiv = document.querySelector("#usersDiv");
	if (first)
		usersDiv.insertBefore(realNode, usersDiv.firstChild);
	else if (!insertAfter)
		usersDiv.appendChild(realNode);
	else
		usersDiv.insertBefore(realNode, insertAfter);

	realNode.addEventListener("click", function () { chatPartnerClicked(realNode as HTMLElement) });
}

function insertNewChatPartner(partner: ShortUser, insertAfter: HTMLElement, first: boolean) {
	const node = document.createElement("div");

	node.innerHTML = selectedPartnerHtml({
		avatar: partner.avatar,
		gameId: partner.gameId,
		hasUnseen: false,
		nick: partner.nick,
		userId: partner.userId,
		userType: partner.userType
	});

	const realNode = node.firstElementChild;
	const usersDiv = document.querySelector("#usersDiv");
	resetChatPartnerButtons();
	if (first)
		usersDiv.insertBefore(realNode, usersDiv.firstChild);
	else if (!insertAfter)
		usersDiv.appendChild(realNode);
	else
		usersDiv.insertBefore(realNode, insertAfter);

	realNode.addEventListener("click", function () { chatPartnerClicked(realNode as HTMLElement) });
}
