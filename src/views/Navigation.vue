<template>
	<div class="navigation">
		<hgroup>
			<h1>{{ $t('env_edu') }}</h1>
			<h3 class="biosfera-ad">
				{{ $t('env_edu_sub') }}
				<img src="../assets/vectors/ordino_reserva_biosfera_logo.svg">
			</h3>
		</hgroup>
		<nav>
			<ul class="main-nav">
				<li v-for="view in views" :key="view.name">
					<router-link :to="`/${view.name}`">
						{{ $t(`views.${view.name}`) }}
					</router-link>
				</li>
			</ul>
		</nav>
		<i18n tag="p" path="credits" class="credits">
			<template #love><span class="heart" /></template>
		</i18n>
	</div>
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
