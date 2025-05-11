function getScrollProgress(element?: HTMLElement) {
  if (!element) return 0;
  const offset = element.offsetTop + window.innerHeight;
  const max = element.scrollHeight - window.innerHeight;
  const progress = (window.scrollY + window.innerHeight - offset) / max;
  return progress;
}

export interface CreateScrollEventOptions {
  threshold?: number;
  rootMargin?: string;
}

export const createScrollEvent = (wrap: HTMLElement, options?: CreateScrollEventOptions) => {
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
      rootMargin: options?.rootMargin ?? "70vh 0%",
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

    return () => window.removeEventListener('scroll', scrollEffect);
  };
};
