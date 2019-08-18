import { Getter } from "vuex";
import { IState } from './state';

const message: Getter<IState, IState> = (state) => `!!${state.message}!!`;

export default {
	message
}