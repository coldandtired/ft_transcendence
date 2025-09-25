import type { WebSocket } from "@fastify/websocket"; import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { addTotpApp, addTotpEmail, disableTotp, loginWithAppTotp, loginWithEmailTotp, verifyEmailTotp, verifyTotpApp } from "./api/totpApi.js";
import { changeAvatar, changeNick, changePassword, invalidateToken } from "./api/accountApi.js";
import { connectToServerSocket } from "./sockets/serverSocket.js";
import { googleSignIn, loginUser, logoutUser, registerGuest, registerUser } from "./api/authApi.js";
import { addFoe, foesList, isFoe, removeFoe } from "./api/foesApi.js";
import { addFriend, findFriend, friendsList, removeFriend } from "./api/friendsApi.js";
import { addMatchResult } from "./api/matchResultsApi.js";
import { getProfile, getShortUser, getSpecificUser, isConnected, isOnline } from "./api/profileApi.js";
import { addLocalTournament, addRemoteTournament, createMatchLobby, createTournamentLobby, getTournament, getTournamentLobby, leaveRemoteTournament, matchGamers, matchNicks, tournamentChats, tournamentNicks, updateLocalTournment } from "./api/tournamentApi.js";
import { chatsList, getChatPartners, getChats, getWaitingChats, clearWaiting, notificationsList, userChats } from "./api/chatApi.js";
import { listNicknames, listUsers } from "./api/userApi.js";
import { getUsersPage } from "./pages/usersPage.js";
import { getAccountPage } from "./pages/accountPage.js";
import { getGamePage } from "./pages/gamePage.js";
import { getHomePage } from "./pages/homePage.js";
import { getChatPage } from "./pages/userChatsPage.js";
import { getFriendsPage } from "./pages/friendsPage.js";
import { getFoesPage } from "./pages/foesPage.js";
import { getAuthPage } from "./api/authPage.js";

export function registerEndpoints(fastify: FastifyInstance): void {
	fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => getHomePage(request, reply));
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => connectToServerSocket(socket, request));

	fastify.get("/account", async (request: FastifyRequest, reply: FastifyReply) => getAccountPage(request, reply));
	fastify.post("/account/avatar", (request: FastifyRequest, reply: FastifyReply) => changeAvatar(request, reply));
	fastify.post("/account/nick", (request: FastifyRequest, reply: FastifyReply) => changeNick(request, reply));
	fastify.post("/account/password", (request: FastifyRequest, reply: FastifyReply) => changePassword(request, reply));
	fastify.post("/account/token", (request: FastifyRequest, reply: FastifyReply) => invalidateToken(request, reply));

	fastify.get("/auth", (request: FastifyRequest, reply: FastifyReply) => getAuthPage(request, reply));
	fastify.get("/auth/google", (request: FastifyRequest, reply: FastifyReply) => googleSignIn(request, reply));
	fastify.post("/auth/guest", (request: FastifyRequest, reply: FastifyReply) => registerGuest(request, reply));
	fastify.post("/auth/login", (request: FastifyRequest, reply: FastifyReply) => loginUser(request, reply));
	fastify.post("/auth/logout", (request: FastifyRequest, reply: FastifyReply) => logoutUser(request, reply));
	fastify.post("/auth/register", (request: FastifyRequest, reply: FastifyReply) => registerUser(request, reply));

	fastify.get("/chat", async (request: FastifyRequest, reply: FastifyReply) => getChatPage(request, reply));
	fastify.get("/chat/notifications", (request: FastifyRequest, reply: FastifyReply) => notificationsList(request, reply));
	fastify.get("/chat/partners", (request: FastifyRequest, reply: FastifyReply) => getChatPartners(request, reply));
	fastify.get("/chat/partners/:partnerId", (request: FastifyRequest, reply: FastifyReply) => getChats(request, reply));
	fastify.get("/chat/users", (request: FastifyRequest, reply: FastifyReply) => chatsList(request, reply));

	fastify.get("/chat/waiting", (request: FastifyRequest, reply: FastifyReply) => getWaitingChats(request, reply));
	fastify.get("/chat/waiting/clear/:partnerId", (request: FastifyRequest, reply: FastifyReply) => clearWaiting(request, reply));

	fastify.get("/game", async (request: FastifyRequest, reply: FastifyReply) => getGamePage(request, reply));

	fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => getUsersPage(request, reply));
	fastify.get("/users/list", (request: FastifyRequest, reply: FastifyReply) => listUsers(request, reply));

	fastify.post("/totp/app", (request: FastifyRequest, reply: FastifyReply) => addTotpApp(request, reply));
	fastify.post("/totp/app/verify", (request: FastifyRequest, reply: FastifyReply) => verifyTotpApp(request, reply));
	fastify.post("/totp/app/login", (request: FastifyRequest, reply: FastifyReply) => loginWithAppTotp(request, reply));
	fastify.post("/totp/email", (request: FastifyRequest, reply: FastifyReply) => addTotpEmail(request, reply));
	fastify.post("/totp/email/verify", (request: FastifyRequest, reply: FastifyReply) => verifyEmailTotp(request, reply));
	fastify.post("/totp/email/login", (request: FastifyRequest, reply: FastifyReply) => loginWithEmailTotp(request, reply));
	fastify.post("/totp/disable", (request: FastifyRequest, reply: FastifyReply) => disableTotp(request, reply));

	fastify.get("/account/nicknames", (request: FastifyRequest, reply: FastifyReply) => listNicknames(request, reply));
	fastify.get("/user-chats/:otherUserId", (request: FastifyRequest, reply: FastifyReply) => userChats(request, reply));

	fastify.get("/foes", async (request: FastifyRequest, reply: FastifyReply) => getFoesPage(request, reply));
	fastify.post("/foes/add", (request: FastifyRequest, reply: FastifyReply) => addFoe(request, reply));
	fastify.get("/foes/list", (request: FastifyRequest, reply: FastifyReply) => foesList(request, reply));
	fastify.get("/foes/:foeId", (request: FastifyRequest, reply: FastifyReply) => isFoe(request, reply));
	fastify.post("/foes/remove", (request: FastifyRequest, reply: FastifyReply) => removeFoe(request, reply));

	fastify.get("/friends", async (request: FastifyRequest, reply: FastifyReply) => getFriendsPage(request, reply));
	fastify.get("/friends/list", (request: FastifyRequest, reply: FastifyReply) => friendsList(request, reply));
	fastify.post("/friends/add", (request: FastifyRequest, reply: FastifyReply) => addFriend(request, reply));
	fastify.post("/friends/remove", (request: FastifyRequest, reply: FastifyReply) => removeFriend(request, reply));
	fastify.post("/friends/find", (request: FastifyRequest, reply: FastifyReply) => findFriend(request, reply));

	fastify.post("/match-results/add", (request: FastifyRequest, reply: FastifyReply) => addMatchResult(request, reply));

	fastify.get("/profile/:userId", (request: FastifyRequest, reply: FastifyReply) => getProfile(request, reply));
	fastify.get("/profile/user", (request: FastifyRequest, reply: FastifyReply) => getShortUser(request, reply));
	fastify.get("/profile/user/:id", (request: FastifyRequest, reply: FastifyReply) => getSpecificUser(request, reply));
	fastify.get("/profile/online/:id", (request: FastifyRequest, reply: FastifyReply) => isOnline(request, reply));
	fastify.get("/profile/logged-in/:id", (request: FastifyRequest, reply: FastifyReply) => isConnected(request, reply));

	fastify.get("/tournament", (request: FastifyRequest, reply: FastifyReply) => getTournament(request, reply));
	fastify.get("/tournament/:gameId", (request: FastifyRequest, reply: FastifyReply) => getTournamentLobby(request, reply));
	fastify.get("/tournament/create", (request: FastifyRequest, reply: FastifyReply) => createTournamentLobby(request, reply));
	fastify.get("/match/create", (request: FastifyRequest, reply: FastifyReply) => createMatchLobby(request, reply));

	fastify.get("/match/nicks", (request: FastifyRequest, reply: FastifyReply) => matchNicks(request, reply));
	fastify.get("/tournament/nicks", (request: FastifyRequest, reply: FastifyReply) => tournamentNicks(request, reply));
	fastify.get("/match/gamers", (request: FastifyRequest, reply: FastifyReply) => matchGamers(request, reply));
	fastify.post("/tournament/local/add", (request: FastifyRequest, reply: FastifyReply) => addLocalTournament(request, reply));
	fastify.post("/tournament/remote/add", (request: FastifyRequest, reply: FastifyReply) => addRemoteTournament(request, reply));
	fastify.get("/tournament/remote/chat", (request: FastifyRequest, reply: FastifyReply) => tournamentChats(request, reply));
	fastify.get("/tournament/remote/leave", (request: FastifyRequest, reply: FastifyReply) => leaveRemoteTournament(request, reply));
	fastify.post("/tournament/local/update", (request: FastifyRequest, reply: FastifyReply) => updateLocalTournment(request, reply));
}

