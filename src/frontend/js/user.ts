import { ShortUser, UserType } from "../../common/interfaces.js";

// global frontend access to the logged in user. Should save DB lookups
var loggedInUser: ShortUser = null;

export function getUserAvatar(): string {
	return loggedInUser?.avatar;
}

export function getUserGameId(): string {
	return loggedInUser?.gameId;
}

export function getUserId(): number {
	return loggedInUser?.userId;
}

export function getUserNick(): string {
	return loggedInUser?.nick;
}

export function getUserType(): UserType {
	return loggedInUser?.userType;
}

export function isUserLoggedIn(): boolean {
	return loggedInUser != null;
}

export function removeUserGameId() {
	loggedInUser.gameId = null;
}

export function setUserGameId(gameId: string) {
	loggedInUser.gameId = gameId;
}

export function userLoggedIn(json: any) {
	loggedInUser = json;
}

export function userLoggedOut() {
	loggedInUser = null;
}
