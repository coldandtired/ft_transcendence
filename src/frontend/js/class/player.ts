import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import { Shape } from './shape.js';
import { Game, GameMode, g_game, g_boundCellSize } from './game.js';
import { g_gamePlayableArea } from './game.js';
import { GamePlayer } from './../../../common/interfaces.js';


/* SECTION:
 *  Classes
 * */

export enum PlayerMode {
	PLAYERMODE_NONE = 0.0,
	PLAYERMODE_HUMAN = 1.0,
	PLAYERMODE_AI = 2.0,
	PLAYERMODE_COUNT,
}

export class Player extends Shape {
	/* HTML DOM Elements
	 * */
	private	m_canvas : HTMLCanvasElement;

	/* Game objects
	 * */
	private	m_mode : PlayerMode;
	private	m_keyUp : string;
	private	m_keyDown : string;

	private	m_interface : GamePlayer;
	private	m_score : number;


	/* AI Section
	 * */
	private	m_aiPrediction : BABYLON.Vector2;
	private	m_aiTimerElapsed : number;

	/* SECTION:
	 *  Constructor
	 * */

	public constructor(canvas : HTMLCanvasElement, scene : BABYLON.Scene, int : GamePlayer, side : number, mode : number) {
		/* Base constructor
		 * */
		super(scene, new BABYLON.Vector2(g_playerCenterOffset, 0.0), new BABYLON.Vector3(0.2, 0.2, 1.0), BABYLON.Color3.White());

		/* Assign the references
		 * */
		this.m_canvas = canvas;

		/* Decide if player is HUMAN (PLAYERMODE_HUMAN / 1.0) or AI (PLAYERMODE_AI / 2.0)
		 * */
		this.m_mode = (mode != 2.0 ? (mode != 1.0 ? PlayerMode.PLAYERMODE_NONE : PlayerMode.PLAYERMODE_HUMAN) : PlayerMode.PLAYERMODE_AI);

		/* Decide if player is on the left or right of the map
		 * */
		switch (side) {
			case (0): {
				/* Move the player to the left
				 * */
				this.m_col = new BABYLON.Color3(0.74, 0.17, 0.83);
				this.m_name = 'player0';
				this.m_keyUp = 'w';
				this.m_keyDown = 's';
				this.m_pos.x = -g_playerCenterOffset;
			} break;
			case (1): {
				this.m_col = new BABYLON.Color3(0.98, 0.8, 0.36);
				this.m_name = 'player1';
				this.m_keyUp = 'ArrowUp';
				this.m_keyDown = 'ArrowDown';
			} break;
			default: { } break;
		}

		/* Finalize the player creation
		 * */
		this.createMesh();

		/* Set the player score and interface
		 * */
		this.m_score = 0.0;
		this.m_interface = int;

		/* Set the AI data
		 * */
		this.m_aiTimerElapsed = 0.0;
		this.m_aiPrediction = BABYLON.Vector2.Zero();
	}	

	/* SECTION:
	 *  Public Methods
	 * */

	get	score() { return (this.m_score); }
	set score(val : number) { this.m_score = val; }

	get	nick() { return (this.m_interface.nick); }
	get	userID() { return (this.m_interface.userId); }
	get	gameID() { return (this.m_interface.gameId); }
	get	online() { return (this.m_interface.online); }

	public reset() {
		this.pos.y = 0.0;
		this.dir.x = this.dir.y = 0.0;
		this.m_aiPrediction.x = this.m_aiPrediction.y = 0.0;
		this.m_aiTimerElapsed = 0.0;

		super.update(1.0);
	}

	public update() {
		switch (this.m_mode) {
			case (PlayerMode.PLAYERMODE_HUMAN): {
				if (Game.keys[this.m_keyUp] && !Game.keys[this.m_keyDown]) {
					this.m_dir.y = 1.0;
				}
				else if (!Game.keys[this.m_keyUp] && Game.keys[this.m_keyDown]) {
					this.m_dir.y = -1.0;
				}
				else {
					this.m_dir.y = 0.0;
				}
			} break;
			case (PlayerMode.PLAYERMODE_AI): {
				this.aiBehaviour();
				if (Math.round(this.m_pos.y * 10.0) < Math.round(this.m_aiPrediction.y * 10.0)) {
					this.m_dir.y = 1.0;
				}
				else if (Math.round(this.m_pos.y * 10.0) > Math.round(this.m_aiPrediction.y * 10.0)) {
					this.m_dir.y = -1.0;
				}
				else {
					this.m_dir.y = 0.0;
				}
			} break;
		}

		/* Update the base 'Shape' class
		 * */
		super.update(1.0);
	}

	/* SECTION:
	 *  Private Methods
	 * */
	
	private aiBehaviour() {
		/* Simple workflow:
		 * - if m_aiTimerElapsed < 1.0: just increase the value by the deltaTime;
		 * - if m_aiTimerElasped >= 1.0: get the potential ball position and return it
		 * */
		if (this.m_aiTimerElapsed >= 1.0) {
			this.m_aiTimerElapsed = 0.0;

			this.m_aiPrediction = g_game.ball.nextBouncePrediction;
		}
		else if (this.m_aiTimerElapsed < 1.0) {
			this.m_aiTimerElapsed += g_game.deltaTime;
		}
	}
}



/* SECTION:
 *  Global game object
 * */
export var	g_playerCenterOffset : number = 6.5;
