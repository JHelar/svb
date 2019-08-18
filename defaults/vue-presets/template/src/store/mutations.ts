import { MutationTree, Mutation } from 'vuex';
import { IState } from './state';
import { ActionPayload } from './actions';

type MutationHandler<PayloadType> = (state: IState, payload: ActionPayload<PayloadType>) => any;

const setStateMutation: MutationHandler<IState> = (state, { payload }) => {
	Object.assign(state, payload);
}

const mutations: MutationTree<IState> = {
	setState: setStateMutation,
}

export default mutations