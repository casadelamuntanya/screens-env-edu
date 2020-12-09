/* eslint-disable import/prefer-default-export */

export const normalize = str => str
	.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
	.replace(/([,·/|().]|d'|l')/g, '') // remove characters
	.replace(/( i | de |\s+)/g, '-') // conjuntcions & spaces
	.toLowerCase();
