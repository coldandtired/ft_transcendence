import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import * as SIMPLEX from 'simplex-noise';

import { g_game, g_gameTime, g_gamePlayableArea, g_boundCellSize } from './game.js';



/* SECTION:
 *  Classes
 * */

export class Ground {
	/* babylonjs elements
	 * */
	private	m_scene : BABYLON.Scene;
	
	/* Game objects
	 * */
	private	m_mesh_arr : BABYLON.Mesh[];
	private	m_perlin : SIMPLEX.NoiseFunction2D;
	
	/* SECTION:
	 *  Constructor
	 * */

	public constructor(scene : BABYLON.Scene, size : BABYLON.Vector2) {
		this.m_scene = scene;
		this.m_mesh_arr = [ ];
		this.m_perlin = SIMPLEX.createNoise2D();
		
		let	ground = BABYLON.MeshBuilder.CreateGround('ground0', { width: size.x, height: size.y }, scene);
	
		for (let x = size.x / -2.0; x < size.x / 2.0; x += g_boundCellSize) {
            for (let y = size.y / -2.0; y < size.y / 2.0; y+= g_boundCellSize) {
				/* Don't create any boxes in the gameplay area
				 * */
                if (x > -g_gamePlayableArea.x && x < g_gamePlayableArea.x &&
                    y > -g_gamePlayableArea.y && y < g_gamePlayableArea.y
                ) {
                    continue;
                }

                let box = BABYLON.MeshBuilder.CreateBox('cell0', { }, scene);
				box.scaling = new BABYLON.Vector3(g_boundCellSize - 0.05, g_boundCellSize, g_boundCellSize - 0.05);
				box.position = new BABYLON.Vector3(x, 0.0, y);

				this.m_mesh_arr.push(box);
            }
        }
	}

	/* SECTION:
	 *  Public Methods
	 * */

	public update() {
		const	_position_scale : number = 0.2;
		const	_time_scale : number = 0.1;
		const	_value_offset : number = 0.2;

		/* NOTE(joleksia):
		 *  We can mess around with those values to get even better noise effects
		 * */
		for (let i = 0; i < this.m_mesh_arr.length; i++) {
			let mesh = this.m_mesh_arr[i];
			let	x : number = (mesh.position.x * _position_scale) + g_gameTime * _time_scale;
			let	y : number = (mesh.position.z * _position_scale) + g_gameTime * _time_scale;
			let	val : number = this.m_perlin(x, y);

			mesh.position.y = _value_offset + val / 3.0;
		}
	}
}
