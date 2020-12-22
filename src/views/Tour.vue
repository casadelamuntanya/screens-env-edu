<template>
	<section class="tour">
		<div id="map" />
	</section>
</template>

<script>
import { Map } from 'mapbox-gl';
import config from '../config.yaml';

export default {
	name: 'Tour',
	data() {
		return { map: undefined };
	},
	mounted() {
		this.map = new Map({
			container: 'map',
			style: config.map.layer,
			accessToken: process.env.MAPBOX_ACCESS_TOKEN,
		});

		config.map.disable.forEach(interaction => this.map[interaction].disable());
	},
};
</script>
