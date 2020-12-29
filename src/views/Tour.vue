<template>
	<section class="tour">
		<div id="map" />
		<div
			v-if="waypoint"
			v-swipe:200.left.right="move"
			class="tour__overlay">
			<header>
				<h3>{{ waypoint.estatges | serialize }}</h3>
				<h1>{{ waypoint.name }}</h1>
				<p>{{ waypoint.description }}</p>
			</header>
			<scroller v-slot="{ item }" :items="waypoint.items">
				<card :item="item" @click.native.stop="activate(item)">
					<h3>{{ item.name }}</h3>
				</card>
			</scroller>
		</div>
		<router-link v-if="!selected" to="/" class="close-btn">&times;</router-link>
		<super-card
			v-if="active"
			:item="active"
			closeable
			@close="activate" />
	</section>
</template>

<script>
import { Map } from 'mapbox-gl';
import airtable from '../airtable';
import Scroller from '../components/Scroller.vue';
import Card from '../components/Card.vue';
import SuperCard from '../components/SuperCard.vue';
import Swipe from '../utils/directive.swipe';
import config from '../config.yaml';

export default {
	name: 'Tour',
	directives: { Swipe },
	components: { Scroller, Card, SuperCard },
	filters: { serialize: array => array.join(',') },
	data() {
		return {
			map: undefined,
			waypoints: undefined,
			step: undefined,
			active: undefined,
		};
	},
	computed: {
		waypoint() {
			const { waypoints, step } = this;
			if (!waypoints) return undefined;
			return waypoints[step];
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
		this.map.on('load', () => { this.fetchWaypoints(); });
	},
	methods: {
		async fetchWaypoints() {
			const records = await airtable('tour').select(config.airtable.tour).all();
			const waypoints = records.map(record => record.fields);
			const relatedRecords = await this.fetchLinked(waypoints, ['related']);
			const otherRecords = await this.fetchLinked(Object.values(relatedRecords), ['_children', '_related', '_predator', '_prey']);
			this.waypoints = waypoints.map(waypoint => {
				const items = waypoint.related.map(field => {
					const {
						_children = [],
						_related = [],
						_predator = [],
						_prey = [],
						...rest
					} = relatedRecords[field];
					const children = _children.map(id => otherRecords[id]);
					const related = _related.map(id => otherRecords[id]);
					const predators = _predator.map(id => otherRecords[id]);
					const preys = _prey.map(id => otherRecords[id]);
					return { ...rest, children, related, predators, preys };
				});
				return { ...waypoint, items };
			});
			this.step = 0;
		},
		async fetchLinked(records, linkedFields) {
			const filterByFormula = `OR(${
				records
					.reduce((acc, record) => {
						const fields = linkedFields.map(field => record[field]).flat();
						return [...new Set([...acc, ...fields])];
					}, [])
					.map(id => `RECORD_ID()='${id}'`)
					.join(',')
			})`;
			const linkedRecords = {};
			await airtable('concepts')
				.select({ ...config.airtable.concepts, filterByFormula })
				.eachPage((results, nextPage) => {
					results.forEach(({ id, fields }) => { linkedRecords[id] = fields; });
					nextPage();
				});
			return linkedRecords;
		},
		activate(item) {
			this.active = item;
		},
		move({ direction }) {
			const index = this.step + (direction === 'left' ? 1 : -1);
			this.step = (this.waypoints.length + index) % this.waypoints.length;
		},
	},
};
</script>
