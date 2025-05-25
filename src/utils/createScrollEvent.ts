function getScrollProgress(element?: HTMLElement) {
	if (!element) return 0;
  // TODO: elementのoriginを設定したい。
  // 現状開始地点はDOMの上部と下部だけ
  // originTop = 0;
  // originMiddle = element.scrollHeight / 2;
  // originBottom = element.scrollHeight;
  //
  // elementOffsetHeight = element.offsetTop
  //
  // 開始地点：DOMの始点が画面上部に来た時
	// const offset = element.offsetTop + window.innerHeight;

  // 開始地点：DOMの始点が画面中央部に来た時
	// const offset = element.offsetTop + window.innerHeight / 2;

  // 開始地点：DOMの始点が画面下部に来た時
	const offset = element.offsetTop;

  // 終了地点：DOMの終端が画面下部に来た時
	const max = element.scrollHeight - window.innerHeight;

  // 終了地点：DOMの終端が画面中央に来た時
	// const max = element.scrollHeight - window.innerHeight / 2;

  // 終了地点：DOMの終端が画面上部に来た時
	// const max = element.scrollHeight;

	const progress = (window.scrollY + window.innerHeight - offset) / max;
	return progress;
}

export interface CreateScrollEventOptions {
	threshold?: number;
	rootMargin?: string;
}

export const createScrollEvent = (
	wrap: HTMLElement,
	options?: CreateScrollEventOptions,
) => {
	let isReady = false;
	const obeserver = new IntersectionObserver(
		(e) => {
			if (e[0].isIntersecting) {
				isReady = true;
			} else {
				isReady = false;
			}
		},
		{
			rootMargin: options?.rootMargin ?? "70% 0%",
			threshold: options?.threshold ?? 0.1,
		},
	);
	obeserver.observe(wrap);
	return (cb?: (progress: number) => void) => {
		const scrollEffect = () => {
			if (!isReady) return;
			const progress = getScrollProgress(wrap);
			if (cb == null) return;
			cb(progress);
		};
		window.addEventListener("scroll", scrollEffect, {
			passive: true,
		});
		const progress = getScrollProgress(wrap);
		if (cb != null) cb(progress);

		return () => window.removeEventListener("scroll", scrollEffect);
	};
};
