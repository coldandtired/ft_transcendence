import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";

export function handleProfileMessage(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	switch (message.type) {
		case "profile-online-changed":
			profileOnlineChanged(fastify, db, user, message);
			break;
	}
}

function profileOnlineChanged(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {

}
