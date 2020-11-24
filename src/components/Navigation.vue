<template>
	<nav class="nav">
		<ul class="selector">
			<li v-for="view in views" :key="view.name">
				<router-link :to="`/${view.name}`">
					{{ $t(`views.${view.name}`) }}
				</router-link>
			</li>
		</ul>
	</nav>
</template>

<script>
const hasName = ({ name }) => name;

export default {
	name: 'Navigation',
	data() {
		return { views: this.$router.options.routes.filter(hasName) };
	},
};
</script>
