import Vue from 'vue';
import Router from 'vue-router';
import Navigation from './components/Navigation.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{ path: '/', component: Navigation },
		{ path: '/tour', name: 'tour', component: () => import('./views/Tour.vue') },
		{
			path: '/concepts/:concept?',
			name: 'concepts',
			component: () => import('./views/Concepts.vue'),
		},
		{ path: '/quiz', name: 'quiz', component: () => import('./views/Quiz.vue') },
	],
});
