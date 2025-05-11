import CubicBezier from "@takumus/cubic-bezier";

const liner = (x: number) => x;

/**
 * 機械的なイージングファンクション
 * @see https://youtu.be/KPoeNZZ6H4s?t=126
 * @see https://easings.net/ja#easeOutElastic
 */
function easeOutElastic(x: number): number {
	const c4 = (2 * Math.PI) / 3;
	return x === 0
		? 0
		: x === 1
			? 1
			: // biome-ignore lint/style/useExponentiationOperator: <explanation>
				Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

/**
 * ref https://takumus.github.io/cubic-bezier/examples/animation/www/
 * 必要な場合適宜追加
 */
const easeInOutQuad = CubicBezier(0.455, 0.03, 0.515, 0.955);
const easeInOutQuart = CubicBezier(0.77, 0, 0.175, 1);

export const easing = {
	easeOutElastic,
	easeInOutQuad,
	liner,
	easeInOutQuart,
} as const;
