<template>
	<wellcome-message :message="message"/>
</template>

<script lang="ts">
import Vue from 'vue'
import WellcomeMessage from './components/WellcomeMessage.vue';

// Interfaces for component typechecking!
interface AppData {

}

interface AppMethods {

}

interface AppComputed {
	message: string
}

interface AppProps {

}

export default Vue.extend<AppData, AppMethods, AppComputed, AppProps>({
	name: 'app',
	computed: {
		message(){
			return this.$store.getters.message;
		}
	},
	components: {
		WellcomeMessage
	}
})
</script>
