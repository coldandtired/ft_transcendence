import * as BABYLON from '@babylonjs/core';

import { g_game, g_gamePlayableArea, g_boundCellSize } from './game.js';



/* SECTION:
 *  Classes
 * */

export class Shape {
	/* babylonjs elements
	 * */
	public	m_scene : BABYLON.Scene;
	public	m_box : BABYLON.Mesh;
	public	m_name : string;

	/* NOTE(joleksia):
	 *  We only want to move our object forward-backward and left-rigth.
	 *  The up-down movement is redundant.
	 *  Thus, velocity calculation are 2D based and then mapped to 3D vector.
	 * */
	public	m_pos : BABYLON.Vector2;
	public	m_dir : BABYLON.Vector2;
	public	m_siz : BABYLON.Vector3;
	public	m_col : BABYLON.Color3;

	/* SECTION: Constructor
	 * */
	public	constructor(scene : BABYLON.Scene, pos : BABYLON.Vector2, siz : BABYLON.Vector3, col : BABYLON.Color3) {
		this.m_scene = scene;
		this.m_pos = pos;
		this.m_siz = siz;
		this.m_col = col;

		this.m_dir = BABYLON.Vector2.Zero();
	}

	/* SECTION: Methods
	 * */
	public get	pos() { return (this.m_pos); }
	public set	pos(vector : BABYLON.Vector2) { this.m_pos = vector; }
	public get	dir() { return (this.m_dir); }
	public set	dir(vector : BABYLON.Vector2) { this.m_dir = vector; }
	public get	siz() { return (this.m_siz); }
	public set	siz(vector : BABYLON.Vector3) { this.m_siz = vector; }

	public	update(speed : number) {
		this.m_pos.x += speed * this.m_dir.x * g_game.deltaTime * 4.0;
		this.m_pos.y += speed * this.m_dir.y * g_game.deltaTime * 4.0;
		
		/* NOTE(joleksia):
		 *  This chunk of code is responsible for keeping all the meshes in the playable area.
		 *  It includes the origin point at the center of the mesh (not top-left which is IMPORTANT!!!).
		 * */
		if (/* Bounce: LEFT */ (this.m_pos.x - this.m_siz.x / 2.0) < (-g_gamePlayableArea.x + g_boundCellSize / 2.0)) {
			this.m_pos.x = (-g_gamePlayableArea.x + g_boundCellSize / 2.0) + (this.m_siz.x / 2.0);
		}
		else if (/* Bounce: RIGHT */ (this.m_pos.x + this.m_siz.x / 2.0) > (g_gamePlayableArea.x - g_boundCellSize / 2.0)) {
			this.m_pos.x = (g_gamePlayableArea.x - g_boundCellSize / 2.0) - (this.m_siz.x / 2.0);
		}
		
		if ( /* Bounce: TOP */ (this.m_pos.y - this.m_siz.z / 2.0) < (-g_gamePlayableArea.y + g_boundCellSize / 2.0)) {
			this.m_pos.y = (-g_gamePlayableArea.y + g_boundCellSize / 2.0) + (this.m_siz.z / 2.0);
		}
		else if ( /* Bounce: BOTTOM */ (this.m_pos.y + this.m_siz.z / 2.0) > (g_gamePlayableArea.y - g_boundCellSize / 2.0)) {
			this.m_pos.y = (g_gamePlayableArea.y - g_boundCellSize / 2.0) - (this.m_siz.z / 2.0);
		}

		/* NOTE(joleksia):
		 *  Mapping 2D Position Vector -> 3D Box Position Vector.
		 *  As we don't want to move up-down, we don't update the 'y' coordinates of the Box.
		 * */
		this.m_box.position.x = this.m_pos.x;
		this.m_box.position.z = this.m_pos.y;
	}


	public	createMesh() {
		let light0 = new BABYLON.PointLight(this.m_name+'light0', new BABYLON.Vector3(0, this.m_siz.y, 0), this.m_scene)
		light0.diffuse = this.m_col;
		light0.specular = new BABYLON.Color3(0, 0, 0);
		light0.intensity = 0.2;

	    let glow = new BABYLON.GlowLayer(this.m_name+'glow0', this.m_scene);
		glow.intensity = 0.8;

		let mat0 = new BABYLON.StandardMaterial(this.m_name+'-mat0', this.m_scene);
		mat0.emissiveColor = this.m_col;
		mat0.disableLighting = true;

		this.m_box = BABYLON.MeshBuilder.CreateBox(this.m_name, { }, this.m_scene);
		this.m_box.material = mat0;
		this.m_box.position = new BABYLON.Vector3(this.m_pos.x, this.m_siz.y, this.m_pos.y);
		this.m_box.scaling = this.m_siz;
		light0.parent = this.m_box;
	}
}
