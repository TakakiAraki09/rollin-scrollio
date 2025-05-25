import { createScrollEvent } from "./utils/createScrollEvent";
import { clamp } from "./utils/math";

const DEFUALT_WARPPER_SELECTOR = ".lorring-scriollio";
const DEFAULT_WAPPER_CSS_VARIABLE = "--lorring-scriollio-progress";

/**
 * 普通にwrapよりもその前になんかしたい感じある。
 * 画面一番下にトップが入って画面一番上にボトムが入れば良い
 *
 * name
 *   fade up left right down max2
 *   flip up left right down
 *   zoom in out | up left right down
 * start
 *   number 0-1 defualt: 0
 * end
 *   number 0-1 default: 1
 * easing-function
 *   string
 *   defaul: fade up
 * animation-multiplier
 *   number
 *   dfault: 1
 *
 * data-lorring-scriollio-name
 * data-lorring-scriollio-start
 * data-lorring-scriollio-end
 * data-lorring-scriollio-easing-function
 * data-lorring-scriollio-animation-multiplier
 **/
//
// const applyElement = (element: HTMLElement) => {
//   const {
//     lorringScriollioName: name,
//     lorringScriollioStart: start,
//     lorringScriollioEnd: end,
//     lorringScriollioEasingFunction: easingFunction,
//     lorringScriollioAnimationMultiplier: animationMultiplier,
//   } = element.dataset;
//   console.log({
//     name,
//     start,
//     end,
//     easingFunction,
//     animationMultiplier,
//   });
//
//   const transform = ``;
//   element.style.transform = transform;
//
// }
interface LorringScriollioBase {
  callback?: (progress: number) => void;
}

interface LorringScriollioOptionAsSelector {
  selector: string;
}
interface LorringScriollioOptionAsElement {
  element: HTMLElement | HTMLElement[];
}

interface LorringScrollio {
  callback?: (delta: number) => void;
}
function lorringScrollioCore(element: HTMLElement, options?: LorringScrollio) {
  const scrollEvent = createScrollEvent(element);

  const destory = scrollEvent((progress) => {
    if (options?.callback) {
      options.callback(clamp(progress, -2, 2));
    }
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

type WrapperRegistOptions = LorringScriollioBase | (LorringScriollioBase & LorringScriollioOptionAsElement) | (LorringScriollioBase & LorringScriollioOptionAsSelector);

function wrapperRegist(options: WrapperRegistOptions = {}) {
  const contents = (() => {
    if ("selector" in options) {
      return getBySelector(options.selector).map((val) => lorringScrollioCore(val));
    }
    if ("element" in options) {
      return Array.isArray(options.element)
        ? options.element.map(val => lorringScrollioCore(val))
        : [lorringScrollioCore(options.element)];
    }

    return getBySelector(DEFUALT_WARPPER_SELECTOR).map((val) => lorringScrollioCore(val, {
      callback: options.callback
    }));
  })();
  return {
    elements: contents,
    progress: () => { },
    destroy: () => {
      return contents.map((val) => val.destory());
    },
  };
}
function LorringScriollio(options?: WrapperRegistOptions) {
  const wrapper = wrapperRegist(options);
  return {
    progress: () => { },
    destroy: () => {
      wrapper.destroy();
    },
  };
}

export default LorringScriollio;
