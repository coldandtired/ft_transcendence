export const g_gameScoreTotal: number = /* 10.0; */ 3.0;

export enum Page {
	ACCOUNT = "ACCOUNT",
	AUTH = "AUTH",
	CHAT = "CHAT",
	FOES = "FOES",
	FRIENDS = "FRIENDS",
	GAME = "GAME",
	HOME = "HOME",
	MATCH = "MATCH",
	TOURNAMENT = "TOURNAMENT",
	USERS = "USERS"
}

export enum Result {
	ERR_AVATAR_TOO_BIG = "ERR_AVATAR_TOO_BIG",
	ERR_BAD_PASSWORD = "ERR_BAD_PASSWORD",
	ERR_BAD_TOTP = "ERR_BAD_TOTP",
	ERR_BAD_TOURNAMENT = "ERR_BAD_TOURNAMENT",
	ERR_DB = "ERR_DB",
	ERR_EMAIL_IN_USE = "ERR_EMAIL_IN_USE",
	ERR_EXPIRED_TOKEN = "ERR_EXPIRED_TOKEN",
	ERR_FORBIDDEN = "ERR_FORBIDDEN",
	ERR_FORBIDDEN_NAME = "ERR_FORBIDDEN_NAME",
	ERR_GOOGLE = "ERR_GOOGLE",
	ERR_GOOGLE_EMAIL = "ERR_GOOGLE_EMAIL",
	ERR_GAME_FULL = "ERR_GAME_FULL",
	ERR_NO_NEW_PASSWORD = "ERR_NO_NEW_PASSWORD",
	ERR_NO_USER = "ERR_NO_USER",
	ERR_NOT_FOUND = "ERR_NOT_FOUND",
	ERR_PASSWORDS_DONT_MATCH = "ERR_PASSWORDS_DONT_MATCH",
	ERR_SAME_EMAIL = "ERR_SAME_EMAIL",
	ERR_UNIQUE = "ERR_UNIQUE",
	SUCCESS = "SUCCESS",
	SUCCESS_NICK = "SUCCESS_NICK",
	SUCCESS_PASSWORD = "SUCCESS_PASSWORD",
	SUCCESS_TOTP = "SUCCESS_TOTP"
}

export enum MessageType {
	GAME_READY = "GAME_READY",
	USER_CONNECT = "USER_CONNECT",
	USER_DISCONNECT = "USER_DISCONNECT",
	USER_INVITE = "USER_INVITE",
	USER_LOGOUT = "USER_LOGOUT",
	USER_READY = "USER_READY",
	USER_SEND_USER_CHAT = "USER_SEND_USER_CHAT",
	USER_UNREADY = "USER_UNREADY",

	GAME_LIST_CHANGED = "GAME_LIST_CHANGED",		// the list of current games needs to be updated

	NOTIFICATION_INVITE = "NOTIFICATION_INVITE",
	NOTIFICATION_TOURNAMENT = "NOTIFICATION_TOURNAMENT",

	// Match message types
	MATCH_JOIN = "MATCH_JOIN",
	MATCH_LEAVE = "MATCH_LEAVE",
	MATCH_LOBBY_CHANGED = "MATCH_LOBBY_CHANGED",	// a player has joined or left a lobby another player is in
	MATCH_OVER = "MATCH_OVER",
	MATCH_READY = "MATCH_READY",
	MATCH_START = "MATCH_START",
	MATCH_UPDATE = "MATCH_UPDATE",
	MATCH_GOAL = "MATCH_GOAL",
	MATCH_RESET = "MATCH_RESET",
	MATCH_END = "MATCH_END",
	MATCH_QUIT = "MATCH_QUIT",

	// Tournament message types
	TOURNAMENT_CHAT = "TOURNAMENT_CHAT",
	TOURNAMENT_GAMER_READY = "TOURNAMENT_GAMER_READY",
	TOURNAMENT_JOIN = "TOURNAMENT_JOIN",
	TOURNAMENT_LEAVE = "TOURNAMENT_LEAVE",
	TOURNAMENT_LOBBY_CHANGED = "TOURNAMENT_LOBBY_CHANGED",
	TOURNAMENT_MATCH_END = "TOURNAMENT_MATCH_END",
	TOURNAMENT_MATCH_START = "TOURNAMENT_MATCH_START",
	TOURNAMENT_OVER = "TOURNAMENT_OVER",
	TOURNAMENT_UPDATE = "TOURNAMENT_UPDATE"
}

export interface Message {
	chat?: string,
	content?: string,
	matchContent?: any,
	fromId?: number,
	gameId?: string,
	match?: Match,
	toId?: number,
	type: MessageType
}

export interface FrameParams {
	language: string,
	page?: Page,
	result?: Result,
	user: User
}

export enum UserType {
	GOOGLE = "GOOGLE",
	GUEST = "GUEST",
	USER = "USER"
}

export enum GameType {
	MATCH = "MATCH",
	TOURNAMENT = "TOURNAMENT"
}

export enum TotpType {
	APP = "APP",
	DISABLED = "DISABLED",
	EMAIL = "EMAIL"
}

export interface User {
	accessToken?: string,
	avatar: string,
	email: string,
	gameId: string,
	nick: string
	password: string,
	refreshToken: string,
	totpEmail: boolean,
	totpType: TotpType,
	totpSecret: string,
	userId: number,
	userType: UserType
}

export interface ShortUser {
	avatar: string,
	gameId: string,
	nick: string,
	userType: UserType,
	userId: number
}

export interface ChatMessage {
	avatar: string,
	gameId: string,
	nick: string,
	seen: boolean,
	userType: UserType,
	userId: number
}

export interface ChatPartner {
	avatar: string,
	gameId: string,
	nick: string,
	hasUnseen: boolean,
	userType: UserType,
	userId: number
}

export interface Game {
	gameId: string,
	nicks: string,
	type: GameType
}

export interface GamePlayer {
	nick: string,
	gameId?: string
	online?: boolean,
	userId?: number
}

export interface MatchResult {
	g1Id?: number,
	g2Id?: number,
	g1Nick?: string,
	g2Nick?: string,
	g1Score?: number,
	g2Score?: number,

	opponent?: string,
	opponentScore?: number,
	playedAt?: Date,
	score?: number,
	tournamentWin?: boolean,
	userId?: number
}

export interface UserChatMessage {
	fromId: number,
	message: string,
	seen: boolean,
	sentAt: Date
}

export interface UserNotification {
	fromId?: number,
	fromNick?: string,
	gameId?: string,
	sentAt: Date,
	type: MessageType
}

export interface Friend {
	friendId: number,
	nick: string,
	online: boolean,
	userId: number
}

export interface Foe {
	foeId: number,
	nick: string,
	userId: number
}

export interface GameChat {
	chat: string,
	fromId: number,
	gameId: string,
	sentAt: Date
}

export interface GameChatMessage {
	chat: string,
	fromId: number,
	nick: string
}

export enum MatchStatus {
	FINISHED = 1,
	NOT_STARTED = 0,
	PLAYING = 2
}

export interface TournamentGamer {
	index: number,
	nick: string,
	opponentId: number,
	opponentIndex: number,
	opponentNick: string,
	opponentReady: boolean,
	opponentScore: number,
	ready: boolean,
	score: number,
	userId: number
}

export interface LocalGamer {
	nick: string,
	score: number,
	userId?: number
}

export interface LocalMatch {
	g1: LocalGamer,
	g2?: LocalGamer,
	matchNumber: number
}

export interface LocalTournament {
	finished: boolean,
	matches: LocalMatch[]
}

export interface Gamer {
	avatar?: string,
	nick: string,
	userId: number
}

export interface MatchGamer {
	avatar?: string,
	userId: number,
	nick: string,
	ready?: boolean,
	score?: number
}

export interface Match {
	g1: MatchGamer,
	g2?: MatchGamer,
	matchNumber?: number
}

export interface Tournament {
	finished: boolean,
	matches: Match[]
}

export interface Box<T> {
	result: Result,
	contents?: T
}
