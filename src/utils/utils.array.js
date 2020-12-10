/* eslint-disable import/prefer-default-export */

export const shuffle = items => items.map(i => [Math.random(), i])
	.sort((a, b) => a[0] - b[0])
	.map(a => a[1]);
