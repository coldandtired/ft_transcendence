import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import cookie from '@fastify/cookie'
import fastifyWebsocket from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { getUser } from "./db/userDB.js";
import { authView } from "./backend/views/authView.js";
import { Page, Result, User, UserType } from "./common/interfaces.js";
import { frameView } from "./backend/views/frameView.js";
import { registerEndpoints } from "./backend/endpoints.js";
import { initDbTables } from "./db/initDbTables.js";
import { dbErrorView } from "./backend/views/dbErrorView.js";
import { hasWaitingChats } from "./db/userChatsDb.js";

const __dirname = import.meta.dirname;

const fastify = Fastify({
	routerOptions: {
		ignoreTrailingSlash: true
	},
	trustProxy: true
});

/*
	Allows the request to access the browser cookies
*/
await fastify.register(cookie);

/*
	Allows websocket connections (chat, remote gamers)
*/
await fastify.register(fastifyWebsocket);

/*
	Allows all the static files (css, js, etc.) to be served automatically
*/
await fastify.register(fastifyStatic, {
	root: __dirname + "/frontend",
	prefix: "/",
	index: false,
});

/*
	Makes user and language visible on every request
*/
declare module 'fastify' {
	interface FastifyRequest {
		db: DatabaseSync
		user: User,
		language: string
	}
}

/*
	Checks for a logged in user before every request, adding it if found
*/
fastify.addHook('preHandler', (request: FastifyRequest, reply: FastifyReply, done) => {
	const language = request.cookies.language ?? "english";
	request.db = db;
	request.language = language;

	const publicApiEndpoints = [
		"/auth",
		"/auth/google",
		"/auth/guest",
		"/auth/login",
		"/auth/register",
		"/totp/app/login",
		"/totp/email/login"
	];

	if (request.url.includes(".") || publicApiEndpoints.includes(request.url))
		return done();

	const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

	if (Result.ERR_DB == userBox.result) {
		return "/" == request.url ? reply.type("text/html").send(frameView({ user: null, language, page: Page.AUTH }, false, dbErrorView()))
			: reply.send({ result: userBox.result });
	}

	if (Result.ERR_NO_USER == userBox.result)
		return "/" == request.url ? reply.type("text/html").send(frameView({ user: null, language, page: Page.AUTH }, false, authView()))
			: reply.send({ result: Result.ERR_NO_USER });

	request.user = userBox.contents;
	done();
});

/*
	Handles all incorrect URLs
*/
fastify.setNotFoundHandler(async (request: FastifyRequest, reply: FastifyReply) => {
	const booleanBox = hasWaitingChats(request.db, request.user.userId);
	const chatsWaiting = Result.SUCCESS == booleanBox.result ? booleanBox.contents as boolean : false;

	const params = {
		user: request.user,
		result: Result.ERR_NOT_FOUND,
		language: request.cookies.language ?? "english"
	};

	const frame = frameView(params, chatsWaiting);
	return reply.type("text/html").send(frame);
});

const db = new DatabaseSync("../data/transcendence.db");

try {
	initDbTables(db);
	registerEndpoints(fastify);

	fastify.listen({
		host: "0.0.0.0",
		port: 3000
	}, (err, address) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		console.log(`Listening!`);
	});
}
catch (e) {
	console.log("Fatal error - exiting!");
}
