import Vue from 'vue';
import App from './App.vue';

import makeStore from './store';

import { initApp } from './store/actions';
import { IState } from './store/state';

Vue.config.productionTip = false;

const createApp = (element: Element, data: IState) => {
	const store = makeStore(); // Make a new store for each instance.

	const instance = new Vue({
		store,
		created() {
			this.$store.dispatch(initApp(data));
		},
		render: h => h(App)
	}).$mount(element);

	return instance;
};

if (process.env.NODE_ENV === 'production') {
	(window as any).APP_NAME = (window as any).APP_NAME || createApp;
} else {
	const appElement = document.querySelector('#app');
	if(appElement) {
		const mock = require('./mock-state').default;
		createApp(appElement, mock);
	}
}