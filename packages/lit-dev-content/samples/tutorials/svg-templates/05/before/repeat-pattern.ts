import type {SVGTemplateResult} from "lit";

import {LitElement, html, svg, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';


const themeCSS = css`
	.background {
		fill: var(--pattern-background-color, #ff8800);
	}

	text {
		fill: var(--pattern-text-color, #ffffff);
		font-size: var(--pattern-text-font-size, 28px);
		stroke-width: var(--pattern-text-stroke-width, 3);
		stroke: var(--pattern-text-stroke-color, #0000dd);
	}
`;

const svgCSS = css`
	svg {
		height: 100%;
		width: 100%;
	}

	text {
		fill: #ffffff;
		dominant-baseline: hanging;
		font-family: monospace;
		font-size: 24px;
	}
`;

const createChars = (chars: string): SVGTemplateResult => svg`
    <text id="chars">${chars}</text>
`;

const createPatternWithRotation = (
	numPrints: number,
	offset: number = 0,
): SVGTemplateResult => {
	const rotation = 360 / numPrints;

	const prints = [];
	let currRotation = offset;
	for (let index = 0; index < numPrints; index++) {
		currRotation += rotation;
		prints.push(svg`
			<use
				href="#chars"
				transform="rotate(${currRotation}, 0, 0)">
			</use>
    	`)
	}

	return svg
		`<g
			id="chars-rotated"
			transform="translate(50, 50)">
				${prints}
		</g>`;
}

const createClip = () => svg`
	<clipPath id="rect-clip">
		<rect width="200" height="200"></rect>
	</clipPath>
`;

const createTile = () => svg`
	<g clip-path="url(#rect-clip)" id="pattern-tile">
		<use transform="translate(0, 0)" href="#chars-rotated"></use>
		<use transform="translate(0, 100)" href="#chars-rotated"></use>
		<use transform="translate(100, -50)" href="#chars-rotated"></use>
		<use transform="translate(100, 50)" href="#chars-rotated"></use>
		<use transform="translate(100, 150)" href="#chars-rotated"></use>
	</g>
`;

const createRepeatPattern = () => svg`
	<pattern
		id="pattern-rounds"
		x="-10"
		y="-10"
		width="200"
		height="200"
		patternUnits="userSpaceOnUse">
			${createTile()}
	</pattern>
`;

@customElement('repeat-pattern')
export class RepeatPattern extends LitElement {
	static styles = [svgCSS, themeCSS];

	@property({type: String}) chars = "lit";
	@property({type: Number, attribute: "num-prints"}) numPrints = 7;
	@property({
		type: Number,
		attribute: "rotation-offset",
	}) rotationOffset = 0;

	render() {
		return html`
			<svg>
				<defs>
					${createClip()}
					${createChars(this.chars)}
					${createPatternWithRotation(
						this.numPrints,
						this.rotationOffset,
					)}
					${createRepeatPattern()}
				</defs>

				<rect
					class="background"
					x="0"
					y="0"
					width="100%"
					height="100%">
				</rect>
				<rect
					x="0"
					y="0"
					width="100%"
					height="100%"
					fill="url(#pattern-rounds)">
				</rect>
			</svg>
		`;
	}
}