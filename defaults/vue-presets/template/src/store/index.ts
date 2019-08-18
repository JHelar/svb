import Vue from 'vue';
import Vuex from 'vuex';
import cloneDeep from 'clone-deep';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

export default () =>
	new Vuex.Store(
		cloneDeep({
			state,
			mutations,
			actions,
			getters
		})
	);

