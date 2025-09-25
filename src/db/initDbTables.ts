import { DatabaseSync } from "node:sqlite";

export function initDbTables(db: DatabaseSync) {
	initChatsWaitingTable(db);
	initFoesTable(db);
	initFriendsTable(db);
	initLocalTournamentsTable(db);
	initMatchesTable(db);
	initMatchResultsTable(db);
	initNotificationsTable(db);
	initTournamentsTable(db);
	initTournamentChatsTable(db);
	initUsersTable(db);
	initUserChatsTable(db);
}

function initFoesTable(db: DatabaseSync) {
	db.exec("DROP TABLE IF EXISTS foes");
	
	db.exec(`
		CREATE TABLE IF NOT EXISTS foes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		foe_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL
		);`);
}

function initFriendsTable(db: DatabaseSync) {
	db.exec("DROP TABLE IF EXISTS friends");

	db.exec(`
		CREATE TABLE IF NOT EXISTS friends (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		friend_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL
		);`);
}

function initChatsWaitingTable(db: DatabaseSync): void {
	db.exec("DROP TABLE IF EXISTS chats_waiting");

	db.exec(`
		CREATE TABLE IF NOT EXISTS chats_waiting (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		partner_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL,
		waiting INTEGER NOT NULL DEFAULT 1
		);`);
}

function initLocalTournamentsTable(db: DatabaseSync) {
	db.exec("DROP TABLE IF EXISTS local_tournaments");

	db.exec(`
		CREATE TABLE IF NOT EXISTS local_tournaments (
		game_id TEXT PRIMARY KEY UNIQUE,
		m1_g1_nick TEXT,
		m1_g2_nick TEXT,
		m2_g1_nick TEXT,
		m2_g2_nick TEXT,
		m3_g1_nick TEXT,
		m3_g2_nick TEXT,
		m1_g1_score INTEGER DEFAULT 0,
		m1_g2_score INTEGER DEFAULT 0,
		m2_g1_score INTEGER DEFAULT 0,
		m2_g2_score INTEGER DEFAULT 0,
		m3_g1_score INTEGER DEFAULT 0,
		m3_g2_score INTEGER DEFAULT 0
		);`);
}

function initMatchesTable(db: DatabaseSync) {
	db.exec("DROP TABLE IF EXISTS matches");

	db.exec(`
		CREATE TABLE IF NOT EXISTS matches (
		game_id TEXT PRIMARY KEY UNIQUE,
		g1_nick TEXT,
		g2_nick TEXT,
		g1_ready INTEGER DEFAULT 0,
		g2_ready INTEGER DEFAULT 0,
		g1_score INTEGER DEFAULT 0,
		g2_score INTEGER DEFAULT 0,
		g1_user_id INTEGER,
		g2_user_id INTEGER,
		tournament_final INTEGER DEFAULT 0
		);`);
}

function initMatchResultsTable(db: DatabaseSync): void {
	db.exec("DROP TABLE IF EXISTS match_results");

	db.exec(`
		CREATE TABLE IF NOT EXISTS match_results (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		opponent TEXT NOT NULL,
		opponent_score INTEGER NOT NULL,
		played_at TEXT NOT NULL,
		score INTEGER NOT NULL,
		tournament_win INTEGER NOT NULL,
		user_id INTEGER NOT NULL
		);`);
}

function initNotificationsTable(db: DatabaseSync): void {
	db.exec("DROP TABLE IF EXISTS notifications");

	db.exec(`
		CREATE TABLE IF NOT EXISTS notifications (
		from_id INTEGER NOT NULL,
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		notification_type TEXT NOT NULL,
		sent_at TEXT NOT NULL,
		to_id INTEGER NOT NULL
		);`);
}

function initTournamentsTable(db: DatabaseSync) {
	db.exec("DROP TABLE IF EXISTS tournaments");

	db.exec(`
		CREATE TABLE IF NOT EXISTS tournaments (
		game_id TEXT PRIMARY KEY UNIQUE,
		m1_g1_nick TEXT,
		m1_g2_nick TEXT,
		m2_g1_nick TEXT,
		m2_g2_nick TEXT,
		m3_g1_nick TEXT,
		m3_g2_nick TEXT,
		m1_g1_ready INTEGER DEFAULT 0,
		m1_g2_ready INTEGER DEFAULT 0,
		m2_g1_ready INTEGER DEFAULT 0,
		m2_g2_ready INTEGER DEFAULT 0,
		m3_g1_ready INTEGER DEFAULT 0,
		m3_g2_ready INTEGER DEFAULT 0,
		m1_g1_score INTEGER DEFAULT 0,
		m1_g2_score INTEGER DEFAULT 0,
		m2_g1_score INTEGER DEFAULT 0,
		m2_g2_score INTEGER DEFAULT 0,
		m3_g1_score INTEGER DEFAULT 0,
		m3_g2_score INTEGER DEFAULT 0,
		m1_g1_user_id INTEGER,
		m1_g2_user_id INTEGER,
		m2_g1_user_id INTEGER,
		m2_g2_user_id INTEGER,
		m3_g1_user_id INTEGER,
		m3_g2_user_id INTEGER
		);`);
}

function initTournamentChatsTable(db: DatabaseSync) {
	db.exec("DROP TABLE IF EXISTS tournament_chats");

	db.exec(`
		CREATE TABLE IF NOT EXISTS tournament_chats (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		chat TEXT NOT NULL,
		from_id INTEGER NOT NULL,
		game_id TEXT NOT NULL,
		sent_at TEXT NOT NULL
		);`);
}

function initUsersTable(db: DatabaseSync) {
	db.exec("DROP TABLE IF EXISTS users");

	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
		avatar TEXT,
		email TEXT,
		game_id TEXT,
		nick TEXT UNIQUE NOT NULL,
		password TEXT,
		refresh_token TEXT UNIQUE,
		totp_type TEXT,
		totp_secret TEXT,
		type TEXT DEFAULT USER,
		user_id INTEGER PRIMARY KEY AUTOINCREMENT
		);`);
}

function initUserChatsTable(db: DatabaseSync): void {
	db.exec("DROP TABLE IF EXISTS user_chats");

	db.exec(`
		CREATE TABLE IF NOT EXISTS user_chats (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		from_id INTEGER NOT NULL,
		message TEXT NOT NULL,
		sent_at TEXT NOT NULL,
		to_id INTEGER NOT NULL
		);`);
}
