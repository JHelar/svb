<template>
	<h1>{{ message }}</h1>
</template>
<script lang="ts">
import Vue from 'vue'

interface WellcomeMessageProps {
	message: string
}

export default Vue.extend<{}, {}, {}, WellcomeMessageProps>({
	name: 'WellcomeMessage',
	props: {
		message: String
	}
})
</script>
