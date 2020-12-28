<template>
	<section class="tour">
		<div id="map" />
		<div v-if="waypoint">
			<h1>{{ waypoint.name }}</h1>
			<p>{{ waypoint.description }}</p>
			<scroller v-slot="{ item }" :items="waypoint.related">
				<card :item="item" attribution @click.native.stop>
					<h3>{{ item.name }}</h3>
				</card>
			</scroller>
		</div>
	</section>
</template>

<script>
import { Map } from 'mapbox-gl';
import airtable from '../airtable';
import Scroller from '../components/Scroller.vue';
import Card from '../components/Card.vue';
import config from '../config.yaml';

export default {
	name: 'Tour',
	components: { Scroller, Card },
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
		this.map.on('load', () => { this.fetchWaypoints(); });
	},
	methods: {
		async fetchWaypoints() {
			const records = await airtable('tour').select(config.airtable.tour).all();
			const linked = await this.fetchLinked(records, 'related');
			this.waypoints = records.map(({ fields }) => {
				const related = fields.related.map(field => linked[field]);
				return { ...fields, related };
			});
			this.step = 0;
		},
		async fetchLinked(records, field) {
			const filterByFormula = `OR(${
				records
					.reduce((acc, record) => [...new Set([...acc, ...record.fields[field]])], [])
					.map(id => `RECORD_ID()='${id}'`)
					.join(',')
			})`;
			const linked = {};
			await airtable('concepts')
				.select({ ...config.airtable.concepts, filterByFormula })
				.eachPage((results, nextPage) => {
					results.forEach(({ id, fields }) => { linked[id] = fields; });
					nextPage();
				});
			return linked;
		},
	},
};
</script>
