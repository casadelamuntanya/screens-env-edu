<template>
	<div id="app" :class="env">
		<router-view />
	</div>
</template>

<script>
const env = process.env.NODE_ENV;

export default {
	name: 'App',
	data() {
		return { env };
	},
};
</script>
