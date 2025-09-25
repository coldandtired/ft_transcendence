export function translate(language: string, text: string): string {
	const items = [
		"BUTTON_ACCOUNT",
		"BUTTON_AI_MATCH",
		"BUTTON_ADD_FOE",
		"BUTTON_ADD_FRIEND",
		"BUTTON_APP_TOTP",
		"BUTTON_CHAT",
		"BUTTON_DISABLE_TOTP",
		"BUTTON_EMAIL_TOTP",
		"BUTTON_FOES",
		"BUTTON_FRIENDS",
		"BUTTON_GAME",
		"BUTTON_GOOGLE",
		"BUTTON_GUEST",
		"BUTTON_INVALIDATE_TOKEN",
		"BUTTON_INVITE",
		"BUTTON_LEAVE",
		"BUTTON_LOGIN",
		"BUTTON_LOGOUT",
		"BUTTON_MATCH",
		"BUTTON_NOTIFICATIONS",
		"BUTTON_READY",
		"BUTTON_REGISTER",
		"BUTTON_REMOVE_FOE",
		"BUTTON_REMOVE_FRIEND",
		"BUTTON_TOURNAMENT",
		"BUTTON_UPDATE",
		"BUTTON_USERS",
		"ERR_AVATAR_TOO_BIG",
		"ERR_BAD_PASSWORD",
		"ERR_BAD_TOTP",
		"ERR_DB",
		"ERR_EMAIL_IN_USE",
		"ERR_FORBIDDEN",
		"ERR_FULL",
		"ERR_GOOGLE",
		"ERR_GOOGLE_EMAIL",
		"ERR_NO_NEW_PASSWORD",
		"ERR_NO_USER",
		"ERR_NOT_FOUND",
		"ERR_PASSWORDS_DONT_MATCH",
		"ERR_SAME_EMAIL",
		"ERR_TOTP_CODE",
		"ERR_UNIQUE",
		"ERR_USER_OFFLINE",
		"MESSAGE_INVITATION",
		"MESSAGE_TOTP",
		"SUCCESS_NICK",
		"SUCCESS_PASSWORD",
		"SUCCESS_TOTP",
		"TEXT_ACCOUNT_TITLE",
		"TEXT_CHANGE_AVATAR",
		"TEXT_CHANGE_NICK",
		"TEXT_CHANGE_PASSWORD",
		"TEXT_CHAT",
		"TEXT_CHAT_TITLE",
		"TEXT_CONGRATULATIONS",
		"TEXT_CREATE_LOCAL",
		"TEXT_CREATE_REMOTE",
		"TEXT_CURRENT_PASSWORD",
		"TEXT_EMAIL",
		"TEXT_FOES_TITLE",
		"TEXT_FRIENDS_TITLE",
		"TEXT_GAME_TITLE",
		"TEXT_GUEST",
		"TEXT_INVITATION",
		"TEXT_JOIN",
		"TEXT_LOCAL_MATCH",
		"TEXT_LOCAL_TOURNAMENT",
		"TEXT_LOG_IN_OR_REGISTER",
		"TEXT_MATCH",
		"TEXT_MATCH_PLURAL",
		"TEXT_MATCH_QUIT",
		"TEXT_MATCH_SINGULAR",
		"TEXT_MATCH_WIN",
		"TEXT_MESSAGES",
		"TEXT_NEW_NICK",
		"TEXT_NEW_PASSWORD",
		"TEXT_NEXT_MATCH",
		"TEXT_NO_FOES",
		"TEXT_NO_FRIENDS",
		"TEXT_NO_MATCHES",
		"TEXT_NO_USERS",
		"TEXT_PASSWORD",
		"TEXT_PLAYER",
		"TEXT_PLAYERS",
		"TEXT_REMOTE_MATCH",
		"TEXT_REMOTE_TOURNAMENT",
		"TEXT_REMOVE_FOE",
		"TEXT_REMOVE_FRIEND",
		"TEXT_REPEAT_PASSWORD",
		"TEXT_START",
		"TEXT_TEAM",
		"TEXT_TECH",
		"TEXT_TOTP_CODE",
		"TEXT_TOTP_CODE_TITLE",
		"TEXT_TOTP_INPUT",
		"TEXT_TOTP_SCAN",
		"TEXT_TOTP_SUCCESS",
		"TEXT_TOTP_TITLE",
		"TEXT_TOURNAMENT",
		"TEXT_TOURNAMENT_FINAL",
		"TEXT_TOURNAMENT_PLAY",
		"TEXT_TOURNAMENT_PLURAL",
		"TEXT_TOURNAMENT_SEMI_FINALS",
		"TEXT_TOURNAMENT_SINGULAR",
		"TEXT_USER_DECISION",
		"TEXT_USERS",
		"TEXT_USERS_TITLE",
		"TEXT_WELCOME",
		"TEXT_WON"
	];


	switch (language) {
		case "australian":
			items.forEach(item => text = text.replaceAll(`%%${item}%%`, translateAustralian(item)));
			break;
		case "dutch":
			items.forEach(item => text = text.replaceAll(`%%${item}%%`, translateDutch(item)));
			break;
		case "english":
			items.forEach(item => text = text.replaceAll(`%%${item}%%`, translateEnglish(item)));
			break;
		case "esperanto":
			items.forEach(item => text = text.replaceAll(`%%${item}%%`, translateEsperanto(item)));
			break;
		case "polish":
			items.forEach(item => text = text.replaceAll(`%%${item}%%`, translatePolish(item)));
			break;
	}

	return text;
}

function translateAustralian(text: string): string {
	switch (text) {
		case "BUTTON_ACCOUNT": return "Account";
		case "BUTTON_ADD_FOE": return "Add foe";
		case "BUTTON_ADD_FRIEND": return "Add friend";
		case "BUTTON_AI_MATCH": return "AI match";
		case "BUTTON_APP_TOTP": return "App";
		case "BUTTON_CHAT": return "Chat";
		case "BUTTON_DISABLE_TOTP": return "Disabled";
		case "BUTTON_EMAIL_TOTP": return "Email";
		case "BUTTON_FOES": return "Foes";
		case "BUTTON_FRIENDS": return "Friends";
		case "BUTTON_GAME": return "Game";
		case "BUTTON_INVALIDATE_TOKEN": return "Invalidate token";
		case "BUTTON_INVITE": return "Invite";
		case "BUTTON_LEAVE": return "Leave";
		case "BUTTON_LOGIN": return "Log in";
		case "BUTTON_LOGOUT": return "Log out";
		case "BUTTON_GOOGLE": return "Continue with Google";
		case "BUTTON_GUEST": return "Continue as a guest";
		case "BUTTON_MATCH": return "Match";
		case "BUTTON_NOTIFICATIONS": return "Notifications";
		case "BUTTON_READY": return "Ready up";
		case "BUTTON_REGISTER": return "Register";
		case "BUTTON_REMOVE_FOE": return "Remove foe";
		case "BUTTON_REMOVE_FRIEND": return "Remove friend";
		case "BUTTON_TOURNAMENT": return "Tournament";
		case "BUTTON_UPDATE": return "Update";
		case "BUTTON_USERS": return "Users";

		case "ERR_AVATAR_TOO_BIG": return "Strewth - the selected image is too big - 25KiB max, mate!";
		case "ERR_BAD_PASSWORD": return "Incorrect password, mate!";
		case "ERR_BAD_TOTP": return "Incorrect code, mate!";
		case "ERR_DB": return "Database error, mate!";
		case "ERR_EMAIL_IN_USE": return "Email already registered, mate!";
		case "ERR_FORBIDDEN": return "Forbidden, mate!";
		case "ERR_FULL": return "Room full, mate!";
		case "ERR_GOOGLE": return "Couldn't sign in/up with Google, mate!";
		case "ERR_GOOGLE_EMAIL": return "Please log in with Google, mate!";
		case "ERR_NO_NEW_PASSWORD": return "New password can't be the same as old password, mate!";
		case "ERR_NO_USER": return "User not found, mate!";
		case "ERR_NOT_FOUND": return "Not found, mate!";
		case "ERR_PASSWORDS_DONT_MATCH": return "Please repeat the password, mate!";
		case "ERR_SAME_EMAIL": return "You can't add yourself, mate!";
		case "ERR_TOTP_CODE": return "Incorrect code, mate!";
		case "ERR_UNIQUE": return "Names must be unique, mate!";
		case "ERR_USER_OFFLINE": return "User offline, mate!";

		case "MESSAGE_INVITATION": return "Join my tournament!";
		case "MESSAGE_TOTP": return "Your 2FA code";

		case "PROMPT_TOTP_CODE": return "2FA code";

		case "SUCCESS_DISABLED_TOTP": return "Disabled 2FA, mate!";
		case "SUCCESS_INVALIDATED_TOKEN": return "Token invalidated, mate!";
		case "SUCCESS_NICK": return "Nickname changed, mate!";
		case "SUCCESS_PASSWORD": return "Password changed, mate!";
		case "SUCCESS_TOTP": return "Success - please log in again, mate!";

		case "TEXT_ACCOUNT_TITLE": return "Account details";
		case "TEXT_CHANGE_AVATAR": return "Change avatar";
		case "TEXT_CHANGE_NICK": return "Change nickname";
		case "TEXT_CHANGE_PASSWORD": return "Change password";
		case "TEXT_CHAT": return "Chat";
		case "TEXT_CHAT_TITLE": return "Direct messages";
		case "TEXT_CONGRATULATIONS": return "Congratulations";
		case "TEXT_CREATE_LOCAL": return "New local";
		case "TEXT_CREATE_REMOTE": return "New remote";
		case "TEXT_CURRENT_PASSWORD": return "Current password";
		case "TEXT_EMAIL": return "Email";
		case "TEXT_FOES_TITLE": return "Foes";
		case "TEXT_FRIENDS_TITLE": return "Friends";
		case "TEXT_GAME_TITLE": return "Games";
		case "TEXT_GUEST": return "Guest";
		case "TEXT_INVITATION": return "has invited you to play!";
		case "TEXT_JOIN": return "In-progress";
		case "TEXT_LOCAL_MATCH": return "Local match";
		case "TEXT_LOCAL_TOURNAMENT": return "Local tournament";
		case "TEXT_LOG_IN_OR_REGISTER": return "User";
		case "TEXT_MATCH": return "Match";
		case "TEXT_MATCH_SINGULAR": return "match";
		case "TEXT_MATCH_PLURAL": return "matches";
		case "TEXT_MATCH_QUIT": return "Quit!";
		case "TEXT_MATCH_WIN": return "has won!";
		case "TEXT_MESSAGES": return "Messages";
		case "TEXT_NEW_NICK": return "New nickname";
		case "TEXT_NEW_PASSWORD": return "New password";
		case "TEXT_NEXT_MATCH": return "Your match is ready!";
		case "TEXT_NO_FOES": return "No foes!";
		case "TEXT_NO_FRIENDS": return "No friends!";
		case "TEXT_NO_MATCHES": return "No matches yet!";
		case "TEXT_NO_USERS": return "No other users!";
		case "TEXT_PASSWORD": return "Password";
		case "TEXT_PLAYER": return "Player";
		case "TEXT_PLAYERS": return "players";
		case "TEXT_REMOTE_MATCH": return "Remote match";
		case "TEXT_REMOTE_TOURNAMENT": return "Remote tournament";
		case "TEXT_REMOVE_FOE": return "Remove from foes";
		case "TEXT_REMOVE_FRIEND": return "Remove from friends";
		case "TEXT_REPEAT_PASSWORD": return "Repeat password";
		case "TEXT_START": return "Start";
		case "TEXT_SUCCESS": return "Start";
		case "TEXT_TEAM": return "The Team";
		case "TEXT_TECH": return "Tech stack";
		case "TEXT_TOTP_CODE": return "Code";
		case "TEXT_TOTP_CODE_TITLE": return "Enter code";
		case "TEXT_TOTP_INPUT": return "And input the code below";
		case "TEXT_TOTP_SCAN": return "Scan the QR code or enter this key into your authenticator app";
		case "TEXT_TOTP_TITLE": return "2FA";
		case "TEXT_TOURNAMENT": return "Tournament";
		case "TEXT_TOURNAMENT_FINAL": return "Final";
		case "TEXT_TOURNAMENT_PLAY": return "Play";
		case "TEXT_TOURNAMENT_PLURAL": return "tournaments";
		case "TEXT_TOURNAMENT_SEMI_FINALS": return "Semi-finals";
		case "TEXT_TOURNAMENT_SINGULAR": return "tournament";
		case "TEXT_USER_DECISION": return "Please choose an option to continue, mate";
		case "TEXT_USERS": return "Users";
		case "TEXT_USERS_TITLE": return "Users";
		case "TEXT_WELCOME": return "Welcome to Transcendence, mate!";
		case "TEXT_WON": return "Won";
		
		default: return text;
	}
}

function translateDutch(text: string): string {
	switch (text) {
		case "BUTTON_ACCOUNT": return "Conto";
		case "BUTTON_ADD_FOE": return "Vijand toevoegen";
		case "BUTTON_ADD_FRIEND": return "Vriend toevoegen";
		case "BUTTON_AI_MATCH": return "AI-wedstrijd";
		case "BUTTON_APP_TOTP": return "App";
		case "BUTTON_CHAT": return "Chat";
		case "BUTTON_DISABLE_TOTP": return "Uitgeschakeld";
		case "BUTTON_EMAIL_TOTP": return "E-mail";
		case "BUTTON_FOES": return "Vijanden";
		case "BUTTON_FRIENDS": return "Vrienden";
		case "BUTTON_GAME": return "Spel";
		case "BUTTON_INVALIDATE_TOKEN": return "Token ongeldig maken";
		case "BUTTON_INVITE": return "Uitnodigen";
		case "BUTTON_GOOGLE": return "Doorgaan met Google";
		case "BUTTON_GUEST": return "Doorgaan als gast";
		case "BUTTON_LEAVE": return "Verlaten";
		case "BUTTON_LOGIN": return "Inloggen";
		case "BUTTON_LOGOUT": return "Uitloggen";
		case "BUTTON_MATCH": return "Wedstrijd";
		case "BUTTON_NOTIFICATIONS": return "Meldingen";
		case "BUTTON_READY": return "Klaarmaken";
		case "BUTTON_REGISTER": return "Registreren";
		case "BUTTON_REMOVE_FOE": return "Vijand verwijderen";
		case "BUTTON_REMOVE_FRIEND": return "Vriend verwijderen";
		case "BUTTON_TOURNAMENT": return "Toernooi";
		case "BUTTON_UPDATE": return "Bijwerken";
		case "BUTTON_USERS": return "Gebruikers";

		case "ERR_AVATAR_TOO_BIG": return "De geselecteerde afbeelding is te groot - maximaal 25 KiB!";
		case "ERR_BAD_PASSWORD": return "Onjuist wachtwoord!";
		case "ERR_BAD_TOTP": return "Onjuiste code!";
		case "ERR_DB": return "Databasefout!";
		case "ERR_EMAIL_IN_USE": return "E-mailadres al geregistreerd!";
		case "ERR_FORBIDDEN": return "Verboden!";
		case "ERR_FULL": return "Kamer vol!";
		case "ERR_GOOGLE": return "Kan niet inloggen/registreren met Google!";
		case "ERR_GOOGLE_EMAIL": return "Log in met Google!";
		case "ERR_NO_NEW_PASSWORD": return "Het nieuwe wachtwoord mag niet hetzelfde zijn als het oude wachtwoord!";
		case "ERR_NO_USER": return "Gebruiker niet gevonden!";
		case "ERR_NOT_FOUND": return "Niet gevonden!";
		case "ERR_PASSWORDS_DONT_MATCH": return "Herhaal het wachtwoord!";
		case "ERR_SAME_EMAIL": return "Je kunt jezelf niet toevoegen!";
		case "ERR_TOTP_CODE": return "Onjuiste code!";
		case "ERR_UNIQUE": return "Namen moeten uniek zijn!";
		case "ERR_USER_OFFLINE": return "Gebruiker offline!";

		case "MESSAGE_INVITATION": return "Doe mee aan mijn toernooi!";
		case "MESSAGE_TOTP": return "Je 2FA-code";

		case "PROMPT_TOTP_CODE": return "2FA-code";

		case "SUCCESS_DISABLED_TOTP": return "2FA uitgeschakeld!";
		case "SUCCESS_INVALIDATED_TOKEN": return "Token ongeldig gemaakt!";
		case "SUCCESS_NICK": return "Bijnaam gewijzigd!";
		case "SUCCESS_PASSWORD": return "Wachtwoord gewijzigd!";
		case "SUCCESS_TOTP": return "Gelukt - log opnieuw in!";

		case "TEXT_ACCOUNT_TITLE": return "Accountgegevens";
		case "TEXT_CHANGE_AVATAR": return "Avatar wijzigen";
		case "TEXT_CHANGE_NICK": return "Bijnaam wijzigen";
		case "TEXT_CHANGE_PASSWORD": return "Wachtwoord wijzigen";
		case "TEXT_CHAT": return "Chat";
		case "TEXT_CHAT_TITLE": return "Directe berichten";
		case "TEXT_CONGRATULATIONS": return "Gefeliciteerd";
		case "TEXT_CREATE_LOCAL": return "Nieuw lokaal";
		case "TEXT_CREATE_REMOTE": return "Nieuw extern";
		case "TEXT_CURRENT_PASSWORD": return "Huidig ​​wachtwoord";
		case "TEXT_EMAIL": return "E-mail";
		case "TEXT_FOES_TITLE": return "Vijanden";
		case "TEXT_FRIENDS_TITLE": return "Vrienden";
		case "TEXT_GAME_TITLE": return "Spelen";
		case "TEXT_GUEST": return "Gast";
		case "TEXT_INVITATION": return "heeft je uitgenodigd om te spelen!";
		case "TEXT_JOIN": return "Lopende";
		case "TEXT_LOCAL_MATCH": return "Lokale wedstrijd";
		case "TEXT_LOCAL_TOURNAMENT": return "Lokaal toernooi";
		case "TEXT_LOG_IN_OR_REGISTER": return "Gebruiker";
		case "TEXT_MATCH": return "Wedstrijd";
		case "TEXT_MATCH_SINGULAR": return "wedstrijd";
		case "TEXT_MATCH_PLURAL": return "wedstrijden";
		case "TEXT_MATCH_QUIT": return "Stop!";
		case "TEXT_MATCH_WIN": return "heeft gewonnen!";
		case "TEXT_MESSAGES": return "Berichten";
		case "TEXT_NEW_NICK": return "Nieuwe bijnaam";
		case "TEXT_NEW_PASSWORD": return "Nieuw wachtwoord";
		case "TEXT_NEXT_MATCH": return "Je wedstrijd is klaar!";
		case "TEXT_NO_FOES": return "Geen vijanden!";
		case "TEXT_NO_FRIENDS": return "Geen vrienden!";
		case "TEXT_NO_MATCHES": return "Nog geen wedstrijden!";
		case "TEXT_NO_USERS": return "Geen andere gebruikers!";
		case "TEXT_PASSWORD": return "Wachtwoord";
		case "TEXT_PLAYER": return "Speler";
		case "TEXT_PLAYERS": return "spelers";
		case "TEXT_REMOTE_MATCH": return "Wedstrijd op afstand";
		case "TEXT_REMOTE_TOURNAMENT": return "Toernooi op afstand";
		case "TEXT_REMOVE_FOE": return "Verwijderen van vijanden";
		case "TEXT_REMOVE_FRIEND": return "Verwijderen van vrienden";
		case "TEXT_REPEAT_PASSWORD": return "Wachtwoord herhalen";
		case "TEXT_START": return "Start";
		case "TEXT_SUCCESS": return "Start";
		case "TEXT_TEAM": return "Het Team";
		case "TEXT_TECH": return "Technologie";
		case "TEXT_TOTP_CODE": return "Code";
		case "TEXT_TOTP_CODE_TITLE": return "Code invoeren";
		case "TEXT_TOTP_INPUT": return "En voer de onderstaande code in";
		case "TEXT_TOTP_SCAN": return "Scan de QR-code of voer deze sleutel in je authenticatie-app in";
		case "TEXT_TOTP_TITLE": return "2FA";
		case "TEXT_TOURNAMENT": return "Toernooi";
		case "TEXT_TOURNAMENT_FINAL": return "Finale";
		case "TEXT_TOURNAMENT_PLAY": return "Spelen";
		case "TEXT_TOURNAMENT_PLURAL": return "toernooien";
		case "TEXT_TOURNAMENT_SEMI_FINALS": return "Halve finales";
		case "TEXT_TOURNAMENT_SINGULAR": return "toernooi";
		case "TEXT_USER_DECISION": return "Kies een optie om door te gaan";
		case "TEXT_USERS": return "Gebruikers";
		case "TEXT_USERS_TITLE": return "Gebruikers";
		case "TEXT_WELCOME": return "Welkom bij Transcendence!";
		case "TEXT_WON": return "Gewonnen";
		
		default: return text;
	}
}

function translateEnglish(text: string): string {
	switch (text) {
		case "BUTTON_ACCOUNT": return "Account";
		case "BUTTON_ADD_FOE": return "Add foe";
		case "BUTTON_ADD_FRIEND": return "Add friend";
		case "BUTTON_AI_MATCH": return "AI match";
		case "BUTTON_APP_TOTP": return "App";
		case "BUTTON_CHAT": return "Chat";
		case "BUTTON_DISABLE_TOTP": return "Disabled";
		case "BUTTON_EMAIL_TOTP": return "Email";
		case "BUTTON_FOES": return "Foes";
		case "BUTTON_FRIENDS": return "Friends";
		case "BUTTON_GAME": return "Game";
		case "BUTTON_INVALIDATE_TOKEN": return "Invalidate token";
		case "BUTTON_INVITE": return "Invite";
		case "BUTTON_LEAVE": return "Leave";
		case "BUTTON_LOGIN": return "Log in";
		case "BUTTON_LOGOUT": return "Log out";
		case "BUTTON_GOOGLE": return "Continue with Google";
		case "BUTTON_GUEST": return "Continue as a guest";
		case "BUTTON_MATCH": return "Match";
		case "BUTTON_NOTIFICATIONS": return "Notifications";
		case "BUTTON_READY": return "Ready up";
		case "BUTTON_REGISTER": return "Register";
		case "BUTTON_REMOVE_FOE": return "Remove foe";
		case "BUTTON_REMOVE_FRIEND": return "Remove friend";
		case "BUTTON_TOURNAMENT": return "Tournament";
		case "BUTTON_UPDATE": return "Update";
		case "BUTTON_USERS": return "Users";

		case "ERR_AVATAR_TOO_BIG": return "The selected image is too big - 25KiB max!";
		case "ERR_BAD_PASSWORD": return "Incorrect password!";
		case "ERR_BAD_TOTP": return "Incorrect code!";
		case "ERR_DB": return "Database error!";
		case "ERR_EMAIL_IN_USE": return "Email already registered!";
		case "ERR_FORBIDDEN": return "Forbidden!";
		case "ERR_FULL": return "Room full!";
		case "ERR_GOOGLE": return "Couldn't sign in/up with Google!";
		case "ERR_GOOGLE_EMAIL": return "Please log in with Google!";
		case "ERR_NO_NEW_PASSWORD": return "New password can't be the same as old password!";
		case "ERR_NO_USER": return "User not found!";
		case "ERR_NOT_FOUND": return "Not found!";
		case "ERR_PASSWORDS_DONT_MATCH": return "Please repeat the password!";
		case "ERR_SAME_EMAIL": return "You can't add yourself!";
		case "ERR_TOTP_CODE": return "Incorrect code!";
		case "ERR_UNIQUE": return "Names must be unique!";
		case "ERR_USER_OFFLINE": return "User offline!";

		case "MESSAGE_INVITATION": return "Join my tournament!";
		case "MESSAGE_TOTP": return "Your 2FA code";

		case "PROMPT_TOTP_CODE": return "2FA code";

		case "SUCCESS_DISABLED_TOTP": return "Disabled 2FA!";
		case "SUCCESS_INVALIDATED_TOKEN": return "Token invalidated!";
		case "SUCCESS_NICK": return "Nickname changed!";
		case "SUCCESS_PASSWORD": return "Password changed!";
		case "SUCCESS_TOTP": return "Success - please log in again!";

		case "TEXT_ACCOUNT_TITLE": return "Account details";
		case "TEXT_CHANGE_AVATAR": return "Change avatar";
		case "TEXT_CHANGE_NICK": return "Change nickname";
		case "TEXT_CHANGE_PASSWORD": return "Change password";
		case "TEXT_CHAT": return "Chat";
		case "TEXT_CHAT_TITLE": return "Direct messages";
		case "TEXT_CONGRATULATIONS": return "Congratulations";
		case "TEXT_CREATE_LOCAL": return "New local";
		case "TEXT_CREATE_REMOTE": return "New remote";
		case "TEXT_CURRENT_PASSWORD": return "Current password";
		case "TEXT_EMAIL": return "Email";
		case "TEXT_FOES_TITLE": return "Foes";
		case "TEXT_FRIENDS_TITLE": return "Friends";
		case "TEXT_GAME_TITLE": return "Games";
		case "TEXT_GUEST": return "Guest";
		case "TEXT_INVITATION": return "has invited you to play!";
		case "TEXT_JOIN": return "In-progress";
		case "TEXT_LOCAL_MATCH": return "Local match";
		case "TEXT_LOCAL_TOURNAMENT": return "Local tournament";
		case "TEXT_LOG_IN_OR_REGISTER": return "User";
		case "TEXT_MATCH": return "Match";
		case "TEXT_MATCH_SINGULAR": return "match";
		case "TEXT_MATCH_PLURAL": return "matches";
		case "TEXT_MATCH_QUIT": return "Quit!";
		case "TEXT_MATCH_WIN": return "has won!";
		case "TEXT_MESSAGES": return "Messages";
		case "TEXT_NEW_NICK": return "New nickname";
		case "TEXT_NEW_PASSWORD": return "New password";
		case "TEXT_NEXT_MATCH": return "Your match is ready!";
		case "TEXT_NO_FOES": return "No foes!";
		case "TEXT_NO_FRIENDS": return "No friends!";
		case "TEXT_NO_MATCHES": return "No matches yet!";
		case "TEXT_NO_USERS": return "No other users!";
		case "TEXT_PASSWORD": return "Password";
		case "TEXT_PLAYER": return "Player";
		case "TEXT_PLAYERS": return "players";
		case "TEXT_REMOTE_MATCH": return "Remote match";
		case "TEXT_REMOTE_TOURNAMENT": return "Remote tournament";
		case "TEXT_REMOVE_FOE": return "Remove from foes";
		case "TEXT_REMOVE_FRIEND": return "Remove from friends";
		case "TEXT_REPEAT_PASSWORD": return "Repeat password";
		case "TEXT_START": return "Start";
		case "TEXT_SUCCESS": return "Start";
		case "TEXT_TEAM": return "The Team";
		case "TEXT_TECH": return "Tech stack";
		case "TEXT_TOTP_CODE": return "Code";
		case "TEXT_TOTP_CODE_TITLE": return "Enter code";
		case "TEXT_TOTP_INPUT": return "And input the code below";
		case "TEXT_TOTP_SCAN": return "Scan the QR code or enter this key into your authenticator app";
		case "TEXT_TOTP_TITLE": return "2FA";
		case "TEXT_TOURNAMENT": return "Tournament";
		case "TEXT_TOURNAMENT_FINAL": return "Final";
		case "TEXT_TOURNAMENT_PLAY": return "Play";
		case "TEXT_TOURNAMENT_PLURAL": return "tournaments";
		case "TEXT_TOURNAMENT_SEMI_FINALS": return "Semi-finals";
		case "TEXT_TOURNAMENT_SINGULAR": return "tournament";
		case "TEXT_USER_DECISION": return "Please choose an option to continue";
		case "TEXT_USERS": return "Users";
		case "TEXT_USERS_TITLE": return "Users";
		case "TEXT_WELCOME": return "Welcome to Transcendence!";
		case "TEXT_WON": return "Won";
		
		default: return text;
	}
}

function translateEsperanto(text: string): string {
	switch (text) {
		case "BUTTON_ACCOUNT": return "Konto";
		case "BUTTON_ADD_FOE": return "Aldoni Malamikon";
		case "BUTTON_ADD_FRIEND": return "Aldoni Amikon";
		case "BUTTON_AI_MATCH": return "AI-Matĉo";
		case "BUTTON_APP_TOTP": return "Aplikaĵo";
		case "BUTTON_CHAT": return "Babilejo";
		case "BUTTON_DISABLE_TOTP": return "Malebligita";
		case "BUTTON_EMAIL_TOTP": return "Retpoŝto";
		case "BUTTON_FOES": return "Malamikoj";
		case "BUTTON_FRIENDS": return "Amikoj";
		case "BUTTON_GAME": return "Ludo";
		case "BUTTON_INVALIDATE_TOKEN": return "Malvalidigi Ĵetonon";
		case "BUTTON_INVITE": return "Inviti";
		case "BUTTON_LEAVE": return "Foriru";
		case "BUTTON_LOGIN": return "Ensaluti";
		case "BUTTON_LOGOUT": return "Elsaluti";
		case "BUTTON_GOOGLE": return "Daŭrigi kun Google";
		case "BUTTON_GUEST": return "Daŭrigi kiel Gasto";
		case "BUTTON_MATCH": return "Matĉo";
		case "BUTTON_NOTIFICATIONS": return "Sciigoj";
		case "BUTTON_READY": return "Pretiĝu";
		case "BUTTON_REGISTER": return "Registriĝi";
		case "BUTTON_REMOVE_FOE": return "Forigi Malamikon";
		case "BUTTON_REMOVE_FRIEND": return "Forigi Amikon";
		case "BUTTON_TOURNAMENT": return "Turniro";
		case "BUTTON_UPDATE": return "Ĝisdatigi";
		case "BUTTON_USERS": return "Uzantoj";

		case "ERR_AVATAR_TOO_BIG": return "La elektita bildo estas tro granda - maksimume 25 KiB!";
		case "ERR_BAD_PASSWORD": return "Malĝusta pasvorto!";
		case "ERR_BAD_TOTP": return "Malĝusta kodo!";
		case "ERR_DB": return "Datumbazeraro!";
		case "ERR_EMAIL_IN_USE": return "Retpoŝtadreso jam registrita!";
		case "ERR_FORBIDDEN": return "Malpermesita!";
		case "ERR_FULL": return "Ĉambro plena!";
		case "ERR_GOOGLE": return "Ne eblas ensaluti/registriĝi kun Google!";
		case "ERR_GOOGLE_EMAIL": return "Ensaluti kun Google!";
		case "ERR_NO_NEW_PASSWORD": return "Nova pasvorto ne povas esti la sama kiel malnova pasvorto!";
		case "ERR_NO_USER": return "Uzanto ne trovita!";
		case "ERR_NOT_FOUND": return "Ne trovita!";
		case "ERR_PASSWORDS_DONT_MATCH": return "Bonvolu ripeti la pasvorton!";
		case "ERR_SAME_EMAIL": return "Vi ne povas aldoni vin mem!";
		case "ERR_SAME_NAME": return "Nomoj devas esti unikaj!";
		case "ERR_TOTP_CODE": return "Malĝusta kodo!";
		case "ERR_UNIQUE": return "Nomoj devas esti unikaj!";
		case "ERR_USER_OFFLINE": return "Uzanto eksterrete!";

		case "MESSAGE_INVITATION": return "Aliĝu al mia turniro!";
		case "MESSAGE_TOTP": return "Via 2FA-kodo";

		case "PROMPT_TOTP_CODE": return "Via 2FA-kodo";

		case "SUCCESS_DISABLED_TOTP": return "Forigis 2FA!";
		case "SUCCESS_INVALIDATED_TOKEN": return "Ŝanĝi avataron!";
		case "SUCCESS_NICK": return "Kromnomo ŝanĝita!";
		case "SUCCESS_PASSWORD": return "Pasvorto ŝanĝita!";
		case "SUCCESS_TOTP": return "Sukceso - ensalutu denove!";

		case "TEXT_ACCOUNT_TITLE": return "Konto-informoj";
		case "TEXT_CHANGE_AVATAR": return "Ŝanĝi avataron";
		case "TEXT_CHANGE_NICK": return "Ŝanĝi kromnomon";
		case "TEXT_CHANGE_PASSWORD": return "Ŝanĝi pasvorto";
		case "TEXT_CHAT": return "Babilejo";
		case "TEXT_CHAT_TITLE": return "Rektaj Mesaĝoj";
		case "TEXT_CONGRATULATIONS": return "Gratuloj";
		case "TEXT_CREATE_LOCAL": return "Nova loka";
		case "TEXT_CREATE_REMOTE": return "Nova ekstera";
		case "TEXT_CURRENT_PASSWORD": return "Aktuala pasvorto";
		case "TEXT_EMAIL": return "Retpoŝto";
		case "TEXT_FOES_TITLE": return "Malamikoj";
		case "TEXT_FRIENDS_TITLE": return "Amikoj";
		case "TEXT_GAME_TITLE": return "Ludoj";
		case "TEXT_GUEST": return "Gasto";
		case "TEXT_INVITATION": return "invitis vin ludi!";
		case "TEXT_JOIN": return "Daŭranta";
		case "TEXT_LOCAL_MATCH": return "Loka matĉo";
		case "TEXT_LOCAL_TOURNAMENT": return "Loka Tturniro";
		case "TEXT_LOG_IN_OR_REGISTER": return "Uzanto";
		case "TEXT_MATCH": return "Matĉo";
		case "TEXT_MATCH_PLURAL": return "matĉoj";
		case "TEXT_MATCH_SINGULAR": return "matĉo";
		case "TEXT_MATCH_QUIT": return "Halti!";
		case "TEXT_MATCH_WIN": return "venki!";
		case "TEXT_MESSAGES": return "Mesaĝoj";
		case "TEXT_NEW_NICK": return "Nova kromnomo";
		case "TEXT_NEW_PASSWORD": return "Nova pasvorto";
		case "TEXT_NEXT_MATCH": return "Via matĉo estas preta!";
		case "TEXT_NO_FOES": return "Neniuj malamikoj!";
		case "TEXT_NO_FRIENDS": return "Neniuj amikoj!";
		case "TEXT_NO_MATCHES": return "Ankoraŭ neniuj matĉoj!";
		case "TEXT_NO_USERS": return "Neniuj aliaj uzantoj!";
		case "TEXT_PASSWORD": return "Pasvorto";
		case "TEXT_PLAYER": return "Ludanto";
		case "TEXT_PLAYERS": return "Ludantoj";
		case "TEXT_REMOTE_MATCH": return "Malproksima matĉo";
		case "TEXT_REMOTE_TOURNAMENT": return "Malproksima turniro";
		case "TEXT_REMOVE_FOE": return "Forigi malamikojn";
		case "TEXT_REMOVE_FRIEND": return "Forigi amikojn";
		case "TEXT_REPEAT_PASSWORD": return "Ripeti pasvorton";
		case "TEXT_START": return "Komenci";
		case "TEXT_SUCCESS": return "Komenci";
		case "TEXT_TEAM": return "La Teamo";
		case "TEXT_TECH": return "Teknologio";
		case "TEXT_TOTP_CODE": return "Kodo";
		case "TEXT_TOTP_CODE_TITLE": return "Enigu kodon";
		case "TEXT_TOTP_INPUT": return "Kaj enigu la kodon sube";
		case "TEXT_TOTP_SCAN": return "Skanu la QR-kodon aŭ enigu ĉi tiun ŝlosilon en vian aŭtentikigan aplikaĵon";
		case "TEXT_TOTP_TITLE": return "2FA";
		case "TEXT_TOURNAMENT": return "Turniro";
		case "TEXT_TOURNAMENT_FINAL": return "Finaloj";
		case "TEXT_TOURNAMENT_PLAY": return "Ludi";
		case "TEXT_TOURNAMENT_PLURAL": return "turniroj";
		case "TEXT_TOURNAMENT_SEMI_FINALS": return "Duonfinaloj";
		case "TEXT_TOURNAMENT_SINGULAR": return "turniro";
		case "TEXT_USER_DECISION": return "Elektu opcion por daŭrigi";
		case "TEXT_USERS": return "Uzantoj";
		case "TEXT_USERS_TITLE": return "Uzantoj";
		case "TEXT_WELCOME": return "Bonvenon al Transcendence!";
		case "TEXT_WON": return "Venki";
		
		default: return text;
	}
}

function translatePolish(text: string): string {
    switch (text) {
        case "BUTTON_ACCOUNT": return "Konto";
        case "BUTTON_ADD_FOE": return "Dodaj przeciwnika";
        case "BUTTON_ADD_FRIEND": return "Zaproś znajomego";
        case "BUTTON_AI_MATCH": return "Mecz z AI";
        case "BUTTON_APP_TOTP": return "Aplikacja";
        case "BUTTON_CHAT": return "Czat";
        case "BUTTON_DISABLE_TOTP": return "Zdezaktywuj";
        case "BUTTON_EMAIL_TOTP": return "Email";
        case "BUTTON_FOES": return "Przeciwnicy";
        case "BUTTON_FRIENDS": return "Znajomi";
        case "BUTTON_GAME": return "Gra";
        case "BUTTON_INVALIDATE_TOKEN": return "Unieważnij token";
        case "BUTTON_INVITE": return "Zaproś";
        case "BUTTON_LEAVE": return "Opuść";
        case "BUTTON_LOGIN": return "Zaloguj się";
        case "BUTTON_LOGOUT": return "Wyloguj się";
        case "BUTTON_GOOGLE": return "Kontynuuj z Google";
        case "BUTTON_GUEST": return "Kontynuuj jako gość";
        case "BUTTON_MATCH": return "1v1";
        case "BUTTON_NOTIFICATIONS": return "Powiadomienia";
        case "BUTTON_READY": return "Gotowość";
        case "BUTTON_REGISTER": return "Zarejestruj się";
        case "BUTTON_REMOVE_FOE": return "Usuń przeciwinika";
        case "BUTTON_REMOVE_FRIEND": return "Usuń znajomego";
        case "BUTTON_TOURNAMENT": return "Turniej";
        case "BUTTON_UPDATE": return "Zaktualizuj";
        case "BUTTON_USERS": return "Użytkownicy";

        case "ERR_AVATAR_TOO_BIG": return "Wybrany obrazek jest za duży - 25KiB max!";
        case "ERR_BAD_PASSWORD": return "Niepoprawne hasło!";
        case "ERR_BAD_TOTP": return "Niepoprawny kod!";
        case "ERR_DB": return "Błąd bazy danych!";
        case "ERR_EMAIL_IN_USE": return "Email jest w użyciu!";
        case "ERR_FORBIDDEN": return "Zabronione!";
        case "ERR_FORBIDDEN_NAME": return "Nazwa jest zabroniona.";
        case "ERR_FULL": return "Pokój pełny!";
        case "ERR_GOOGLE": return "Nie można zalogować się przez Google";
        case "ERR_GOOGLE_EMAIL": return "Zaloguj się przez Google!";
        case "ERR_NO_NEW_PASSWORD": return "Nowe hasło musi się różnić od poprzedniego!";
        case "ERR_NO_USER": return "Użytkownik nie został znaleziony!";
        case "ERR_NOT_FOUND": return "Nie znaleziono!";
        case "ERR_PASSWORDS_DONT_MATCH": return "Proszę, powtórz hasło.";
        case "ERR_SAME_EMAIL": return "Nie możesz dodać sam siebie!";
        case "ERR_TOTP_CODE": return "Niepoprawny kod!";
        case "ERR_UNIQUE": return "Nazwy muszą być unikatowe!";
        case "ERR_USER_OFFLINE": return "Użytkownik jest offline!";

        case "MESSAGE_INVITATION": return "Dołącz do mojego turnieju!";
        case "MESSAGE_TOTP": return "Twój kod 2FA";

        case "PROMPT_TOTP_CODE": return "Kod 2FA";

        case "SUCCESS_DISABLED_TOTP": return "Wyłączono 2FA!";
        case "SUCCESS_INVALIDATED_TOKEN": return "Token unieważniony!";
        case "SUCCESS_NICK": return "Nick zmieniony!";
        case "SUCCESS_PASSWORD": return "Hasło zmienione!";
        case "SUCCESS_TOTP": return "Sukces - zaloguj się ponownie";

        case "TEXT_ACCOUNT_TITLE": return "Szczegóły konta";
        case "TEXT_CHANGE_AVATAR": return "Zmień awatar";
        case "TEXT_CHANGE_NICK": return "Zmień nick";
        case "TEXT_CHANGE_PASSWORD": return "Zmień hasło";
        case "TEXT_CHAT": return "Czat";
        case "TEXT_CHAT_TITLE": return "Wiadomości bezpośrednie";
        case "TEXT_CONGRATULATIONS": return "Gratulacje";
        case "TEXT_CREATE_LOCAL": return "Nowy mecz lokalny";
        case "TEXT_CREATE_REMOTE": return "Nowy mecz zdalny";
        case "TEXT_CURRENT_PASSWORD": return "Obecne hasło";
        case "TEXT_EMAIL": return "Email";
        case "TEXT_FOES_TITLE": return "Przeciwnicy";
        case "TEXT_FRIENDS_TITLE": return "Znajomi";
        case "TEXT_GAME_TITLE": return "Mecze";
        case "TEXT_GUEST": return "Gość";
		case "TEXT_INVITATION": return "zaprosił(a) cię do gry!";
        case "TEXT_JOIN": return "W trakcie";
        case "TEXT_LOCAL_MATCH": return "Mecz lokalny";
        case "TEXT_LOCAL_TOURNAMENT": return "Turniej lokalny";
        case "TEXT_LOG_IN_OR_REGISTER": return "Uzytkownik";
        case "TEXT_MATCH": return "Mecz";
        case "TEXT_MATCH_PLURAL": return "mecze";
        case "TEXT_MATCH_SINGULAR": return "mecz";
		case "TEXT_MATCH_QUIT": return "Quit!";
		case "TEXT_MATCH_WIN": return "has won!";
        case "TEXT_MESSAGES": return "Wiadomości";
        case "TEXT_NEW_NICK": return "Nowy nick";
        case "TEXT_NEW_PASSWORD": return "Nowe hasło";
		case "TEXT_NEXT_MATCH": return "Twój mecz jest gotowy!";
        case "TEXT_NO_FOES": return "Brak przeciwników!";
        case "TEXT_NO_FRIENDS": return "Brak znajomych!";
		case "TEXT_NO_MATCHES": return "Brak meczów!";
        case "TEXT_NO_USERS": return "Brak innych użytkowników!";
        case "TEXT_PASSWORD": return "Hasło";
        case "TEXT_PLAYER": return "Gracz";
        case "TEXT_PLAYERS": return "gracze";
        case "TEXT_REMOTE_MATCH": return "Mecz zdalny";
        case "TEXT_REMOTE_TOURNAMENT": return "Turniej zdalny";
        case "TEXT_REMOVE_FOE": return "Usuń z przeciwników";
        case "TEXT_REMOVE_FRIEND": return "Usuń ze znajomych";
        case "TEXT_REPEAT_PASSWORD": return "Powtórz hasło";
        case "TEXT_START": return "Start";
        case "TEXT_SUCCESS": return "Start";
        case "TEXT_TEAM": return "Ekipa";
        case "TEXT_TECH": return "Tech stack";
        case "TEXT_TOTP_CODE": return "Kod";
        case "TEXT_TOTP_CODE_TITLE": return "Podaj kod";
        case "TEXT_TOTP_INPUT": return "wstaw kod poniżej";
        case "TEXT_TOTP_SCAN": return "Zeskanuj kod QR albo wstaw ten klucz do aplikacji uwierzytelniającej";
        case "TEXT_TOTP_TITLE": return "2FA";
        case "TEXT_TOURNAMENT": return "Turniej";
        case "TEXT_TOURNAMENT_FINAL": return "Finał";
        case "TEXT_TOURNAMENT_PLAY": return "Graj";
        case "TEXT_TOURNAMENT_PLURAL": return "turnieje";
        case "TEXT_TOURNAMENT_SEMI_FINALS": return "Półfinały";
        case "TEXT_TOURNAMENT_SINGULAR": return "turniej";
        case "TEXT_USER_DECISION": return "Wybierz opcję aby kontynuować";
        case "TEXT_USERS": return "Uzytkownicy";
        case "TEXT_USERS_TITLE": return "Użytkownicy";
        case "TEXT_WELCOME": return "Witamy w Transcendence!";
        case "TEXT_WON": return "Wygrana";

        default: return text;
    }
}
