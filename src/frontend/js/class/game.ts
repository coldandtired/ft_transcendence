import * as BABYLON from '@babylonjs/core';

import { Player } from './player.js';
import { Ball } from './ball.js';
import { Ground } from './ground.js';
import { Gui } from './gui.js';
import { GamePlayer, MessageType, Message, g_gameScoreTotal } from '../../../common/interfaces.js';
import { sendMessageToServer } from '../sockets/clientSocket.js';
import { getUserId } from '../user.js';

/* SECTION:
 *  Classes
 * */

export enum GameMode {
	GAMEMODE_NONE = 0,
	GAMEMODE_PVP,
	GAMEMODE_AI,
	GAMEMODE_COUNT,
	GAMEMODE_REMOTE
}

export enum StateMachine {
	STATE_NONE = 0,
	STATE_START,        /* State when the game is being prepared */
	STATE_UPDATE,       /* State when the game is being updated */
	STATE_PAUSED,       /* State for when the game should be paused */
	STATE_RESTART,      /* State invoked most likely by someone scoring a point */
	STATE_GAMEOVER,     /* GameOver state; the game should be closed soon, there can be a game over window, etc. */
	STATE_COUNT
}

type NetKeyPayload = { kind: "KEY"; action: "UP" | "DOWN"; pressed: boolean; playerId: number };
type NetBallPayload = { kind: "BALL_UPDATE"; pos: { x: number; y: number }; vel: { x: number; y: number } };
type NetGameEndPayload = { kind: "GAME_END"; p0Score: number; p1Score: number };

function isNetKeyPayload(x: any): x is NetKeyPayload {
	return (
		x &&
		x.kind === "KEY" &&
		(x.action === "UP" || x.action === "DOWN") &&
		typeof x.pressed === "boolean" &&
		typeof x.playerId === "number"
	);
}

function isNetBallPayload(x: any): x is NetBallPayload {
	return (
		x &&
		x.kind === "BALL_UPDATE" &&
		x.pos &&
		typeof x.pos.x === "number" &&
		typeof x.pos.y === "number" &&
		x.vel &&
		typeof x.vel.x === "number" &&
		typeof x.vel.y === "number"
	);
}

function isNetGameEndPayload(x: any): x is NetGameEndPayload {
	return (
		x &&
		x.kind === "GAME_END" &&
		typeof x.p0Score === "number" &&
		typeof x.p1Score === "number"
	);
}

export class Game {
	/* HTML DOM Elements */
	private m_dialog: HTMLDialogElement;
	private m_canvas: HTMLCanvasElement;

	/* babylonjs elements */
	private m_engine: BABYLON.Engine;
	private m_scene: BABYLON.Scene;

	/* Game objects */
	private m_mode: GameMode;

	private m_player0: Player;
	private m_player1: Player;
	private m_ball: Ball;
	private m_ground: Ground;
	private m_gui: Gui;

	private m_canvasCreated: boolean = false;
	private m_engineCreated: boolean = false;
	private m_sceneCreated: boolean = false;

	/* TODO(joleksia):
	 *  This variable is here to tell every game object to no update anymore.
	 *  Basically, every method should now check if this flag is set to true or false.
	 *  If true: no update;
	 *  If false: update normally;
	 *  This also should be in sync between clients.
	 */
	private m_stateMachine: StateMachine;

	/* Match state */
	private m_gameOver: boolean = false;

	private m_networked: boolean = false;
	private m_localIndex: 0 | 1 = 0;
	private m_gameId?: string;
	private m_started: boolean = false;

	/* Store player data for scene creation */
	private m_player1Data?: GamePlayer;
	private m_player2Data?: GamePlayer;

	private receiverId: number;

	private onLocalKeyBound?: (e: KeyboardEvent) => void;

	public static keys: Record<string, boolean>;


	/* SECTION: Public Methods */

	get gameOver() { return (this.m_gameOver); }
	get deltaTime() { return (this.m_engine.getDeltaTime() * 0.001); }
	get ball() { return (this.m_ball); }
	get player0() { return (this.m_player0); }
	get player1() { return (this.m_player1); }

	// Add these getter methods to access private properties for ball synchronization
	get networked() { return this.m_networked; }
	get localIndex() { return this.m_localIndex; }
	get gameId() { return this.m_gameId; }

	public getPlayers(): GamePlayer[] {
		return [
			this.m_player1Data,
			this.m_player2Data
		];
	}

	public getReceiverId(): number {
		return this.receiverId;
	}

	public setupElements(
		mode: GameMode,
		player1: GamePlayer,
		player2?: GamePlayer,
		opts?: { networked?: boolean; gameId?: string; localIndex?: 0 | 1, receiverId?: number }
	) {
		this.m_gameOver = false;

		this.receiverId = opts?.receiverId;

		// store player data
		this.m_player1Data = player1;
		this.m_player2Data = player2;

		// store networking options
		this.m_networked = !!opts?.networked;
		this.m_gameId = opts?.gameId;
		this.m_localIndex = opts?.localIndex ?? 0;

		// dialog/canvas/engine/scene creation
		this.m_dialog = document.getElementById('gameDialog') as HTMLDialogElement;

		if (!this.m_canvasCreated) {
			this.m_canvas = document.createElement('canvas');
			this.m_canvasCreated = true;
		}
		this.m_dialog.appendChild(this.m_canvas);

		Game.keys = {}; // dictionary for string keys

		if (!this.m_networked) {
			// Non-networked games: set up all keys directly
			window.addEventListener("keydown", function (e) {
				Game.keys[e.key] = true;
			});
			window.addEventListener("keyup", function (e) {
				Game.keys[e.key] = false;
			});
		} else {
			// Networked games: each player only handles their own keys
			window.addEventListener("keydown", (e) => {
				if (this.m_localIndex === 0) {
					// Player 0 uses arrow keys but maps to w/s internally
					if (e.key === "ArrowUp") {
						Game.keys["w"] = true;
					} else if (e.key === "ArrowDown") {
						Game.keys["s"] = true;
					}
				} else {
					// Player 1 uses arrow keys directly
					if (e.key === "ArrowUp") {
						Game.keys["ArrowUp"] = true;
					} else if (e.key === "ArrowDown") {
						Game.keys["ArrowDown"] = true;
					}
				}
			});
			window.addEventListener("keyup", (e) => {
				if (this.m_localIndex === 0) {
					// Player 0 uses arrow keys but maps to w/s internally
					if (e.key === "ArrowUp") {
						Game.keys["w"] = false;
					} else if (e.key === "ArrowDown") {
						Game.keys["s"] = false;
					}
				} else {
					// Player 1 uses arrow keys directly
					if (e.key === "ArrowUp") {
						Game.keys["ArrowUp"] = false;
					} else if (e.key === "ArrowDown") {
						Game.keys["ArrowDown"] = false;
					}
				}
			});

			// wire local key events -> network (only for networked games)
			if (!this.onLocalKeyBound) {
				this.onLocalKeyBound = (e: KeyboardEvent) => {
					if (this.m_gameOver || !this.m_networked || !this.m_gameId) return;

					// Only handle arrow keys for networked games (both players use arrows)
					const isUp = e.key === "ArrowUp";
					const isDown = e.key === "ArrowDown";
					const pressed = e.type === "keydown";

					if (!isUp && !isDown) return;

					const payload: NetKeyPayload = {
						kind: "KEY",
						action: isUp ? "UP" : "DOWN",
						pressed,
						playerId: this.m_localIndex  // 0 = purple paddle, 1 = yellow paddle
					};

					// Send the key press to the server
					sendMessageToServer({
						type: MessageType.MATCH_UPDATE,
						toId: this.receiverId,
						matchContent: payload,
					});
				};

				window.addEventListener("keydown", this.onLocalKeyBound, true);
				window.addEventListener("keyup", this.onLocalKeyBound, true);
			}
		}

		if (!this.m_engineCreated) {
			this.m_engine = new BABYLON.Engine(this.m_canvas, true, { preserveDrawingBuffer: true, stencil: true });
			this.m_engineCreated = true;
		}

		if (!this.m_sceneCreated) {
			this.m_mode = mode;
			this.m_scene = this.createScene();
			this.m_sceneCreated = true;
		}

		this.m_dialog.showModal();

		this.m_canvas.width = this.m_dialog.clientWidth;
		this.m_canvas.height = this.m_dialog.clientHeight;

		if (!this.m_engine.activeRenderLoops.length) {
			this.m_engine.runRenderLoop(() => this.updateRenderLoop());
		}

		this.m_gui.showPlayerScore(this.m_scene, this.m_player0, this.m_player1);

		this.m_stateMachine = StateMachine.STATE_START;
	}

	public actuallyStart() {
		setTimeout(() => {
			if (this.m_gameOver || this.m_started) return;

			this.m_ball.start();
			this.m_started = true;
		}, 1000);
	}

	public netOnMessage(message: Message) {
		if (!this.m_networked || !this.m_gameId || message.gameId !== this.m_gameId)
			return;
		if (!message.matchContent) return;

		try {
			const payload = message.matchContent;

			if (payload.kind === "KEY" && typeof payload.pressed === "boolean") {
				if (payload.playerId === this.m_localIndex) return;

				// Map remote player's actions to their specific paddle keys
				let remoteKey: string;
				if (payload.playerId === 0) {
					// Remote Player 0 (purple paddle) uses w/s keys internally
					remoteKey = payload.action === "UP" ? "w" : "s";
				} else {
					// Remote Player 1 (yellow paddle) uses arrow keys internally
					remoteKey = payload.action === "UP" ? "ArrowUp" : "ArrowDown";
				}

				Game.keys[remoteKey] = payload.pressed;

			} else if (payload.kind === "BALL_UPDATE") {
				// Only non-master clients should sync ball position from network
				if (this.m_localIndex !== 0) {
					this.m_ball.syncFromNetwork(payload.pos, payload.dir);
				}

			} else if (payload.kind === "GOAL") {
				this.m_player0.score = payload.p0Score;
				this.m_player1.score = payload.p1Score;

				if (payload.p0Score < g_gameScoreTotal && payload.p1Score < g_gameScoreTotal) {
					this.m_stateMachine = StateMachine.STATE_RESTART;
				}
				this.m_gui.clearUI(this.m_scene);
				this.m_gui.showPlayerScore(this.m_scene, this.m_player0, this.m_player1);

			} else if (payload.kind === "GAME_END") {
				this.m_player0.score = payload.p0Score;
				this.m_player1.score = payload.p1Score;

				this.m_stateMachine = StateMachine.STATE_GAMEOVER;

			} else if (payload.kind === "GAME_QUIT") {
				if (this.m_player0.userID == getUserId()) {
					this.m_player0.score = g_gameScoreTotal;
					this.m_player1.score = 0;
				}
				else {
					this.m_player0.score = 0;
					this.m_player1.score = g_gameScoreTotal;
				}

				this.m_stateMachine = StateMachine.STATE_GAMEOVER;
			} else if (payload.kind === "RESET") {
				this.m_stateMachine = StateMachine.STATE_RESTART;
			}
		} catch (e) {
		}
	}

	public dispose() {
		if (this.m_gameOver) return; // idempotent

		this.m_scene.dispose();
		this.m_sceneCreated = false;

		this.m_engine.stopRenderLoop();
		this.m_engine.dispose();
		this.m_engineCreated = false;

		this.m_dialog.removeChild(this.m_canvas);
		this.m_canvasCreated = false;

		this.m_dialog.close();

		// rm local key listeners if any
		if (this.onLocalKeyBound) {
			window.removeEventListener("keydown", this.onLocalKeyBound, true);
			window.removeEventListener("keyup", this.onLocalKeyBound, true);
			this.onLocalKeyBound = undefined;
		}
		this.m_networked = false;
		this.m_started = false;

		this.m_gameOver = true;
	}

	public score(p0: boolean, p1: boolean) {
		/* Increment the player score. */
		if (p0) { this.m_player0.score++ };
		if (p1) { this.m_player1.score++ };

		// Send goal event to sync both clients (only Player 0 sends to avoid duplicates)
		if (this.m_networked && this.m_gameId && this.m_localIndex === 0) {
			const goalPayload = {
				kind: "GOAL",
				p0Score: this.m_player0.score,
				p1Score: this.m_player1.score,
				p0Scored: p0,
				p1Scored: p1
			};

			sendMessageToServer({
				type: MessageType.MATCH_GOAL,
				toId: this.receiverId,
				matchContent: goalPayload,
			});
		}

		/* Check if someone passed the score threshold to end the game if so */
		if (this.m_player0.score >= g_gameScoreTotal ||
			this.m_player1.score >= g_gameScoreTotal
		) {
			if (this.m_networked && this.m_gameId && this.m_localIndex === 0) {
				const endPayload = {
					kind: "GAME_END",
					p0Score: this.m_player0.score,
					p1Score: this.m_player1.score
				};

				sendMessageToServer({
					type: MessageType.MATCH_END,
					toId: this.receiverId,
					matchContent: endPayload,
				});
			}

			this.matchOver();
			this.m_stateMachine = StateMachine.STATE_GAMEOVER;
		}
		else {
			this.m_stateMachine = StateMachine.STATE_RESTART;

			this.m_gui.clearUI(this.m_scene);
			this.m_gui.showPlayerScore(this.m_scene, this.m_player0, this.m_player1);
			this.m_ball.reset();
		}
	}

	/* SECTION: Private Methods */

	private updateRenderLoop() {
		/* StateMachine - dependent code */
		switch (this.m_stateMachine) {
			case (StateMachine.STATE_START): {
				/* NOTE(joleksia):
				 *  I've removed the setTimeout added by @lwillis
				 *  It had some issues with the current state machine
				 *  The state machine, even tho it was updated, still called the content of setTimeout
				 */
				if (this.m_networked) {
					// Networked games wait for actuallyStart() to be called
					if (this.m_started) {
						this.m_stateMachine = StateMachine.STATE_UPDATE;
					}
				} else {
					setTimeout(() => {
					this.m_ball.start();
					}, 1000);
					this.m_stateMachine = StateMachine.STATE_UPDATE;
				}
			} break;

			case (StateMachine.STATE_UPDATE): {
				this.m_player0.update();
				this.m_player1.update();
				this.m_ball.update();
			} break;

			case (StateMachine.STATE_PAUSED): {
				/* NOTE(joleksia):
				 *  For now you shouldn't be able to enter this state
				 */
			} break;

			case (StateMachine.STATE_RESTART): {
				/* TODO(joleksia):
				 *  The ball, in the 'reset()' function, should also set some sort of delay
				 *  to wait before the actual match starts. It also must be in sync with other clients!
				 *  @agarbacz
				 */
				this.m_player0.reset();
				this.m_player1.reset();
				this.m_ball.reset();

				this.m_stateMachine = StateMachine.STATE_START;
			} break;

			case (StateMachine.STATE_GAMEOVER): {
				this.m_engine.stopRenderLoop();
				this.matchOver();
			} break;

			default: { } break;
		}

		/* StateMachine - independent code */
		g_gameTime += this.deltaTime;
		this.m_ground.update();

		/* Resize the canvas to the size of the dialog */
		this.m_canvas.width = this.m_dialog.clientWidth;
		this.m_canvas.height = this.m_dialog.clientHeight;

		/* Render the scene... */
		this.m_scene.render()
	}

	// send the match info back to the frontend
	private matchOver() {
		let p_win: Player;

		this.m_engine.stopRenderLoop();

		this.m_ball.reset();
		this.m_dialog.dispatchEvent(new CustomEvent("matchOver", {
			detail: {
				g1Score: this.m_player0.score,
				g2Score: this.m_player1.score
			}
		}));

		// show "winner message" or something
		p_win = this.m_player0.score > this.m_player1.score ? this.m_player0 : this.m_player1;
		this.m_gui.clearUI(this.m_scene);
		this.m_gui.showMatchOver(this.m_scene, p_win);
	}

	private createScene() {
		let scene = new BABYLON.Scene(this.m_engine);

		/* SECTION: Camera Setup */
		let camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 16, 12, new BABYLON.Vector3(0, 0, 0));

		const light = new BABYLON.PointLight("light0", new BABYLON.Vector3(0, 5, 0), scene);
		light.intensity = 2.0;
		light.diffuse = new BABYLON.Color3(0.15, 0, 0.4);
		light.specular = new BABYLON.Color3(0, 0, 0);
		light.intensity = 1;

		/* Set up the game based on the gamemode */
		this.m_ground = new Ground(scene, new BABYLON.Vector2(32.0, 24.0));
		this.m_ball = new Ball(this.m_canvas, scene);

		// Use the stored player data or defaults
		const player1Data = this.m_player1Data || { nick: "Player 1", userId: 1 };
		const player2Data = this.m_player2Data || { nick: "Player 2", userId: 2 };

		this.m_player0 = new Player(this.m_canvas, scene, player1Data, 0.0, 1.0);

		switch (this.m_mode) {
			case (GameMode.GAMEMODE_PVP): {
				this.m_player1 = new Player(this.m_canvas, scene, player2Data, 1.0, 1.0);
			} break;
			case (GameMode.GAMEMODE_AI): {
				this.m_player1 = new Player(this.m_canvas, scene, player2Data, 1.0, 2.0);
			} break;
		}

		this.m_gui = new Gui(this.m_canvas);
		return (scene);
	}
}

/* SECTION: Global game object */
export var g_gamePlayableArea: BABYLON.Vector2 = new BABYLON.Vector2(7.0, 3.0);
export var g_gameTime: number = 0.0;
export const g_boundCellSize: number = 1.0;

export var g_game: Game = new Game();
