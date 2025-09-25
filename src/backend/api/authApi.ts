import { FastifyRequest, FastifyReply } from 'fastify';
import { addGoogleUser, createGuest, addUser, getUserByEmail, removeUserFromMatch, updateRefreshtoken } from '../../db/userDB.js';
import { Result, TotpType, UserType } from '../../common/interfaces.js';
import { compareSync } from 'bcrypt-ts';
import { refreshToken, accessToken } from '../../db/jwt.js';
import { sendTotpEmail } from './totpApi.js';

export async function googleSignIn(request: FastifyRequest, reply: FastifyReply) {
	const code: string = request.query["code"];

	const redirectUrl = (`https://${request.host}:3000/auth/google`);

	const params = {
		client_id: process.env.GOOGLE_CLIENT,
		client_secret: process.env.GOOGLE_SECRET,
		code: code,
		grant_type: "authorization_code",
		redirect_uri: redirectUrl
	}

	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(params)
	});

	if (200 != response.status)
		return reply.header("Set-Cookie", `googleautherror=true; Path=/;`).redirect("/");

	const json = await response.json();
	const idToken: string = json.id_token;
	const googlePayload = idToken.split(".")[1];
	const decoded: string = atob(googlePayload);
	const user = JSON.parse(decoded);
	const avatar = await convertFile(user.picture);

	const userJSON = {
		email: user.email,
		avatar: avatar,
	}

	const googleBox = addGoogleUser(request.db, userJSON);
	if (Result.SUCCESS != googleBox.result)
		return reply.header("Set-Cookie", `googleautherror=true; Path=/;`).redirect("/");

	const accessTokenDate = new Date();
	accessTokenDate.setMinutes(accessTokenDate.getMinutes() + 15);
	const refreshTokenDate = new Date();
	refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
	return reply.header(
		"Set-Cookie", `accessToken=${googleBox.contents[0]}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=${googleBox.contents[1]}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).redirect("/");
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const email: string = (request.body as any).email;
	const password: string = (request.body as any).password;

	const userBox = getUserByEmail(db, email);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox);

	const user = userBox.contents;

	if (UserType.GOOGLE == user.userType)
		return reply.send({
			result: Result.ERR_GOOGLE_EMAIL
		});

	switch (user.totpType) {
		case TotpType.APP:
			return reply.send({
				result: Result.SUCCESS,
				totpType: TotpType.APP
			});
		case TotpType.DISABLED:
			if (compareSync(password, user.password)) {
				const token = refreshToken(user.userId);
				updateRefreshtoken(db, {
					userId: user.userId, refreshToken: token
				});
				user.accessToken = accessToken(user.userId);
				user.refreshToken = token;
				const accessTokenDate = new Date();
				accessTokenDate.setMinutes(accessTokenDate.getMinutes() + 15);
				const refreshTokenDate = new Date();
				refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);

				return reply.header(
					"Set-Cookie", `accessToken=${userBox.contents.accessToken}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
						"Set-Cookie", `refreshToken=${userBox.contents.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send({
							result: Result.SUCCESS,
							contents: user
						});
			}
			else
				return reply.send({ result: Result.ERR_BAD_PASSWORD });
		case TotpType.EMAIL:
			const result = await sendTotpEmail(db, user, request.language);
			if (Result.SUCCESS != result)
				return reply.send({ result });

			return reply.send({
				result,
				totpType: TotpType.EMAIL
			});
	}
}

export function logoutUser(request: FastifyRequest, reply: FastifyReply) {
	const date = "Thu, 01 Jan 1970 00:00:00 UTC";
	return reply.header(
		"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).send(Result.SUCCESS);
}

export function registerGuest(request: FastifyRequest, reply: FastifyReply) {
	const guestBox = createGuest(request.db);
	if (Result.SUCCESS != guestBox.result)
		return reply.send(guestBox);

	const token = refreshToken(guestBox.contents.userId);

	return reply.header(
		"Set-Cookie", `accessToken=${token}; Path=/; Secure; HttpOnly;`).send(guestBox);
}

export function registerUser(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const checkResponse = getUserByEmail(db, (request.body as any).email);

	if (UserType.GOOGLE == checkResponse.contents?.userType)
		return reply.send({
			result: Result.ERR_GOOGLE_EMAIL
		});

	if (Result.ERR_NO_USER != checkResponse.result)
		return reply.send({
			result: Result.ERR_EMAIL_IN_USE
		});

	const response = addUser(db, request.body as any);
	if (Result.SUCCESS != response.result)
		return reply.send(response);

	const accessTokenDate = new Date();
	accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
	const refreshTokenDate = new Date();
	refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
	return reply.header(
		"Set-Cookie", `accessToken=${response.accessToken}; expires=${accessTokenDate}; Path=/; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=${response.refreshToken}; expires=${refreshTokenDate}; Path=/; Secure; HttpOnly;`).send(response);
}

/* Converts the image blob into base64 */
async function convertFile(avatarURL: string): Promise<string> {
	const response = await fetch(avatarURL);
	const img = await response.blob();
	const buffer = Buffer.from(await img.arrayBuffer());
	const converted = "data:" + img.type + ';base64,' + buffer.toString('base64');
	return converted;
}
