export function nickToNumbers(nick: string): string {
	if (!nick || 0 == nick.length)
		return nick;

	const binString = String.fromCodePoint(...new TextEncoder().encode(nick));
	return btoa(binString).replaceAll("=", "");
}

export function numbersToNick(numbers: string): string {
	if (!numbers || 0 == numbers.length)
		return numbers;

	const binString = atob(numbers);
	return new TextDecoder().decode(Uint8Array.from(binString, (m) => m.codePointAt(0)));
}
