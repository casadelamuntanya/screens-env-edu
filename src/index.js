import Vue from 'vue';
import App from './App.vue';
import i18n from './i18n';

import 'reset-css';
import './styles/index.scss';

/* eslint-disable no-new */
new Vue({
	el: '#app',
	i18n,
	render: h => h(App),
});
