import type {SVGTemplateResult} from "lit";

import {LitElement, html, svg, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';


const themeCSS = css`
	.background {
		fill: var(--background-color, #ff8800);
	}

	text {
		fill: var(--font-color, #ffffff);
		font-size: var(--font-size, 28px);
		stroke-width: var(--stroke-width, 3);
		stroke: var(--stroke-color, #0000dd);
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

	rect {
		x: 0;
		y: 0;
		width: 100%;
		height: 100%;
	}

	pattern {
		x: -10;
		y: -10;
		width: 200;
		height: 200;
		patternUnits: userSpaceOnUse;
	}
`;

const createAtom = (chars: string): SVGTemplateResult => svg`
    <text id="chars">${chars}</text>
`;

const createElement = (
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
};

const createClipPath = () => svg`
	<clipPath id="rect-clip">
		<rect width="200" height="200"></rect>
	</clipPath>
`;

const createPattern = () => svg`
	<g clip-path="url(#rect-clip)" id="pattern-tile">
		<use transform="translate(0, 0)" href="#chars-rotated"></use>
		<use transform="translate(0, 100)" href="#chars-rotated"></use>
		<use transform="translate(100, -50)" href="#chars-rotated"></use>
		<use transform="translate(100, 50)" href="#chars-rotated"></use>
		<use transform="translate(100, 150)" href="#chars-rotated"></use>
	</g>
`;

const createRepeatPattern = () => svg`
	<pattern id="pattern-rounds">
		${createPattern()}
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
					${createClipPath()}
					${createAtom(this.chars)}
					${createElement(
						this.numPrints,
						this.rotationOffset,
					)}
					${createRepeatPattern()}
				</defs>

				<rect class="background"></rect>
				<rect fill="url(#pattern-rounds)"></rect>
			</svg>
		`;
	}
}