import { createScrollEvent } from "./utils/createScrollEvent";
import { clamp } from "./utils/math";

const DEFUALT_WARPPER_SELECTOR = ".lorring-scriollio";
const DEFAULT_WAPPER_CSS_VARIABLE = "--lorring-scriollio-progress";

interface LorringScriollioOptionAsSelector {
	selector: string;
}
interface LorringScriollioOptionAsElement {
	element: HTMLElement | HTMLElement[];
}

function lorringScrollioCore(element: HTMLElement) {
	const scrollEvent = createScrollEvent(element);
	const destory = scrollEvent((progress) => {
		element.style.setProperty(
			DEFAULT_WAPPER_CSS_VARIABLE,
			clamp(progress, -2, 2).toString(),
		);
	});

	return {
		destory,
	};
}
function getBySelector(selector: string) {
	return Array.from(document.querySelectorAll(selector)).filter(
		(val): val is HTMLElement => val instanceof HTMLElement,
	);
}

type WrapperRegistOptions =
	| LorringScriollioOptionAsElement
	| LorringScriollioOptionAsSelector;
function wrapperRegist(options?: WrapperRegistOptions) {
	const contents = (() => {
		if (options == null) {
			return getBySelector(DEFUALT_WARPPER_SELECTOR).map(lorringScrollioCore);
		}
		if ("selector" in options) {
			return getBySelector(options.selector).map(lorringScrollioCore);
		}
		if ("element" in options) {
			return Array.isArray(options.element)
				? options.element.map(lorringScrollioCore)
				: [lorringScrollioCore(options.element)];
		}
		return [];
	})();
	return {
		elements: contents,
		progress: () => {},
		destroy: () => {
			return contents.map((val) => val.destory());
		},
	};
}

/**
 * name
 *   fade up left right bottom max2
 *   flip up left right bottom
 *   zoom in out | up left right bottom
 * start
 *   number 0-1
 * end
 *   number 0-1
 * easing-function
 *   string
 * animation-multiplier
 *   number
 **/
function LorringScriollio(options?: WrapperRegistOptions) {
	const wrapper = wrapperRegist(options);
	return {
		progress: () => {},
		destroy: () => {
			wrapper.destroy();
		},
	};
}

export default LorringScriollio;
