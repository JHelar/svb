import { IState } from "./state";
import { ActionTree, Store, ActionContext } from 'vuex';

type PayloadType = 'initApp' | 'setState'
export type ActionPayload<ActionData> = {
	type: PayloadType,
	payload: ActionData
}

type ActionHandler<ActionData> = (this: Store<IState>, injectee: ActionContext<IState, IState>, payload: ActionPayload<ActionData>) => any;
type ActionCreator<ActionData> = (data: ActionData) => ActionPayload<ActionData>;


// Action creators
export const initApp: ActionCreator<IState> = (state) => ({
	type: 'initApp',
	payload: state
})

// Action handlers
const initAppAction: ActionHandler<IState> = ({ commit }, { payload }) => {
	commit({
		type: 'setState',
		payload
	})
}

const actions: ActionTree<IState, IState> = {
	initApp: initAppAction,
}

export default actions;
