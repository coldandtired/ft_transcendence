import { genSaltSync, hashSync } from 'bcrypt-ts';
import { createHmac } from 'crypto';

export function accessToken(id: number): string {
	const date = new Date();
	date.setMinutes(date.getMinutes() + 15);
	return createJWT(id, date);
}

export function refreshToken(id: number): string {
	const date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	return createJWT(id, date);
}

export function validJWT(jwt: string): boolean {
	if (!jwt)
		return false;
	const splitJWT = jwt.split(".");
	if (3 != splitJWT.length)
		return false;
	const header = splitJWT[0];
	const payload = splitJWT[1];
	const signature = splitJWT[2];
	let hash = createHMAC(header + "." + payload, process.env.JWT_SECRET);
	hash = replaceInvalidBase64Chars(hash);
	return hash == signature;
}

export function hashPassword(password: string): string {
	const salt = genSaltSync(13);
	return hashSync(password, salt);
}

function createJWT(id: number, date: Date): string {
	let header = JSON.stringify(
		{
			typ: "JWT",
			alg: "HS256"
		});

	let payload = JSON.stringify(
		{
			sub: id,
			exp: date
		});
	header = btoa(header);
	payload = btoa(payload);
	header = replaceInvalidBase64Chars(header);
	payload = replaceInvalidBase64Chars(payload);
	let hash = createHMAC(header + "." + payload, process.env.JWT_SECRET);
	hash = replaceInvalidBase64Chars(hash);
	return header + "." + payload + "." + hash;
}

function createHMAC(message: string, secret: string) {
	return createHmac('sha256', secret)
		.update(message)
		.digest("base64");
}

function replaceInvalidBase64Chars(input: string) {
	return input.replace(/[=+/]/g, charToBeReplaced => {
		switch (charToBeReplaced) {
			case '=':
				return '';
			case '+':
				return '-';
			case '/':
				return '_';
		}
	});
};
