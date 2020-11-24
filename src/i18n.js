import Vue from 'vue';
import Vuei18n from 'vue-i18n';
import messages from './locales/*.yaml'; // eslint-disable-line import/no-unresolved

Vue.use(Vuei18n);

export default new Vuei18n({
	locale: 'ca',
	fallbackLocale: 'ca',
	messages,
});
