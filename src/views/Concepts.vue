<template>
	<section class="concepts">
		<super-card
			v-if="selected"
			:item="selected"
			patheable
			@select="select" />
		<ul v-else class="concepts__root">
			<li v-for="concept in root" :key="concept.name">
				<card :item="concept" @click.native.stop="select(concept)">
					<h1>{{ concept.name }}</h1>
				</card>
			</li>
		</ul>
		<router-link v-if="!selected" to="/" class="close-btn">&times;</router-link>
	</section>
</template>

<script>
import Card from '../components/Card.vue';
import SuperCard from '../components/SuperCard.vue';
import airtable from '../airtable';
import config from '../config.yaml';
import { normalize } from '../utils/utils.string';

export default {
	name: 'Concepts',
	components: { Card, SuperCard },
	data() {
		return {
			concepts: {},
			history: [],
		};
	},
	computed: {
		root() {
			return Object.values(this.concepts).filter(concept => !concept._parent);
		},
		selected() {
			if (!this.history.length) return undefined;
			const [{ _parent, _children = [], _related = [], ...rest }] = this.history.slice(-1);
			const children = _children.map(item => this.concepts[item]);
			const related = _related.map(item => this.concepts[item]);
			const path = this.getPath(_parent);
			return { ...rest, path, children, related };
		},
	},
	async beforeMount() {
		await airtable('concepts')
			.select(config.airtable.concepts)
			.eachPage((records, nextPage) => {
				const concepts = records.reduce((acc, { id, fields }) => {
					acc[id] = fields;
					return acc;
				}, this.concepts);
				this.concepts = { ...concepts };
				nextPage();
			});
		// Load concept if queried in url route
		const { concept } = this.$route.params;
		const concepts = Object.values(this.concepts);
		if (concept) this.select(concepts.find(({ name }) => normalize(name) === concept));
	},
	methods: {
		select(item) {
			this.history = item ? [...this.history, item] : [];
		},
		getPath([id] = []) {
			return id ? [...this.getPath(this.concepts[id]._parent), this.concepts[id]] : [];
		},
	},
};
</script>
