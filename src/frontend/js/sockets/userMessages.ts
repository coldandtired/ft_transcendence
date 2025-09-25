import { currentPage, sendMessageToServer } from "./clientSocket.js";
import { getLanguage, showPage } from "../index.js";
import { Message, Page, Result, ShortUser, User } from "../../../common/interfaces.js";

export async function userInvite(message: Message) {
	const userBox = await fetch("/profile/user");
	const json = await userBox.json();
	if (Result.SUCCESS != json.result)
		return;

	const user = json.contents;
	if (user.userId == message.toId) {
		sendMessageToServer(message);
		showPage(Page.GAME);
	}
}
