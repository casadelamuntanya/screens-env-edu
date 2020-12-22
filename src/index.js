import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

import 'reset-css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/index.scss';

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	i18n,
	render: h => h(App),
});
