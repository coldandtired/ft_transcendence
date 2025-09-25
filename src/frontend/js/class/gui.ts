import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

import { Player } from './player.js';
import { g_game } from './game.js';
import { translate } from '../../../common/translations.js';
import { getLanguage } from '../index.js';

/* SECTION:
 *  Classes
 * */

export class Gui {
    /* HTML DOM Elements */
    private m_canvas: HTMLCanvasElement;
	
	/* SECTION: Public Methods */

	public constructor(canvas : HTMLCanvasElement) {
		this.m_canvas = canvas;
	}

	public showPlayerScore(scene : BABYLON.Scene, p0 : Player, p1 : Player) {
		let	advanceTexture0 = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui-full0');

		let	text0 = new GUI.TextBlock('ui-text0');
		text0.text = p0.nick + ': ' + p0.score;
		text0.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		text0.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
		text0.top = 16;
		text0.left = 16;
		text0.color = '#be2ad1ff';
		text0.shadowColor = 'black';
		text0.shadowBlur = 10;
		text0.shadowOffsetY = 10;
		text0.fontSize = 32;
		text0.fontWeight = 'bolder';
		advanceTexture0.addControl(text0);
		
		let	text1 = new GUI.TextBlock('ui-text1');
		text1.text = p1.score + ' :' + p1.nick;
		text1.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		text1.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		text1.top = -16;
		text1.left = -16;
		text1.color = '#ffcd5aff';
		text1.shadowColor = 'black';
		text1.shadowBlur = 10;
		text1.shadowOffsetY = 10;
		text1.fontSize = 32;
		text1.fontWeight = 'bolder';
		advanceTexture0.addControl(text1);
	}

	public showMatchOver(scene : BABYLON.Scene, p_won : Player) {
		let	advanceTexture1 = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui-full1');
		advanceTexture1.background = '#0000008f';

		let	text3 = new GUI.TextBlock('ui-text3');
		text3.text = p_won.nick + translate(getLanguage(), ' %%TEXT_MATCH_WIN%%');
		text3.top = "-10%";
		text3.color = 'white';
		text3.shadowColor = 'black';
		text3.shadowBlur = 10;
		text3.shadowOffsetY = 10;
		text3.fontSize = "6%";
		text3.fontWeight = 'bolder';
		advanceTexture1.addControl(text3);

		let button0 = GUI.Button.CreateSimpleButton('ui-btn0', translate(getLanguage(), '%%TEXT_MATCH_QUIT%%'));
		
		button0.top = "20%";
		button0.width = "10%";
		button0.height = "10%";
		button0.color = 'black';
		button0.background = 'white';
		button0.cornerRadius = 16;
		button0.shadowColor = 'black';
		button0.shadowBlur = 10;
		button0.shadowOffsetY = 10;
		button0.fontSize = "4%";
		button0.fontWeight = 'bolder';
		button0.hoverCursor = "pointer";

		advanceTexture1.addControl(button0);

		button0.onPointerUpObservable.add(
			function() {
				g_game.dispose();
			}
		);
	}

	public clearUI(scene : BABYLON.Scene) {
		scene.getTextureByName('ui-full0')?.dispose();
	}
}
