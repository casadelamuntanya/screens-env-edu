<template>
	<section class="tour">
		<div id="map" />
	</section>
</template>

<script>
import { Map } from 'mapbox-gl';
import airtable from '../airtable';
import config from '../config.yaml';

export default {
	name: 'Tour',
	data() {
		return {
			map: undefined,
			waypoints: undefined,
			step: undefined,
		};
	},
	computed: {
		waypoint() {
			const { waypoints, step } = this;
			if (!waypoints) return undefined;
			const waypoint = waypoints[step];
			return waypoint;
		},
	},
	watch: {
		waypoint: {
			deep: true,
			handler({ lat, lon, zoom, bearing }) {
				const { duration } = config.map;
				const center = [lon, lat];
				this.map.flyTo({ center, zoom, bearing, duration });
			},
		},
	},
	mounted() {
		this.map = new Map({
			container: 'map',
			style: config.map.layer,
			accessToken: process.env.MAPBOX_ACCESS_TOKEN,
		});

		config.map.disable.forEach(interaction => this.map[interaction].disable());
		this.map.on('click', () => { this.step = (this.step + 1) % this.waypoints.length; });

		this.map.on('load', () => {
			airtable('tour')
				.select(config.airtable.tour)
				.firstPage()
				.then(records => {
					this.waypoints = records.map(({ fields }) => fields);
					this.step = 0;
				});
		});
	},
};
</script>
