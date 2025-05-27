import { createScrollEvent } from "./utils/createScrollEvent";
import { clamp } from "./utils/math";

const DEFAULT_WRAPPER_SELECTOR = ".rolling-scrollio";
const DEFAULT_WRAPPER_CSS_VARIABLE = "--rolling-scrollio-progress";

interface RollingScrollioCallback {
  callback?: (progress: number) => void;
}

interface RollingScrollioSelector {
  selector: string;
}

interface RollingScrollioElement {
  element: HTMLElement | HTMLElement[];
}
function createScrollioInstance(element: HTMLElement, options?: RollingScrollioCallback) {
  const scrollEvent = createScrollEvent(element);

  const destroy = scrollEvent((progress) => {
    if (options?.callback) {
      options.callback(clamp(progress, -2, 2));
    }
    element.style.setProperty(
      DEFAULT_WRAPPER_CSS_VARIABLE,
      clamp(progress, -2, 2).toString(),
    );
  });

  return {
    destroy,
  };
}
function getBySelector(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector)).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );
}

type RollingScrollioOptions = RollingScrollioCallback & (RollingScrollioSelector | RollingScrollioElement | {});

function createScrollioInstances(options: RollingScrollioOptions = {}) {
  const contents = (() => {
    if ("selector" in options) {
      return getBySelector(options.selector).map((element) => createScrollioInstance(element, {
        callback: options.callback
      }));
    }
    if ("element" in options) {
      return Array.isArray(options.element)
        ? options.element.map(element => createScrollioInstance(element, {
            callback: options.callback
          }))
        : [createScrollioInstance(options.element, {
            callback: options.callback
          })];
    }

    return getBySelector(DEFAULT_WRAPPER_SELECTOR).map((element) => createScrollioInstance(element, {
      callback: options.callback
    }));
  })();
  return {
    elements: contents,
    destroy: () => {
      contents.forEach((instance) => instance.destroy());
    },
  };
}
function RollingScrollio(options?: RollingScrollioOptions) {
  const wrapper = createScrollioInstances(options);
  return {
    destroy: () => {
      wrapper.destroy();
    },
  };
}

export default RollingScrollio;
export type { RollingScrollioOptions };
