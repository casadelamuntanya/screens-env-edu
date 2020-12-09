<template>
	<section class="concepts">
		<card
			v-if="selected"
			:item="selected"
			class="concept"
			attribution>
			<header class="concept__header">
				<ul class="concept__path">
					<li><button @click="select()">Conceptes</button></li>
					<li v-for="step in selected.path" :key="step.name">
						<button @click="select(step)">{{ step.name }}</button>
					</li>
				</ul>
				<h2 class="concept__name">{{ selected.name }}</h2>
				<p class="concept__description">{{ selected.description }}</p>
			</header>
			<footer>
				<div class="concept__media">
					<ul class="scrollable">
						<li v-for="item in selected.media" :key="item.id">
							<card :item="item" attribution />
						</li>
					</ul>
				</div>
				<div class="concept__children">
					<ul class="scrollable">
						<li v-for="concept in selected.children" :key="concept.name">
							<card :item="concept" @click.native="select(concept)">
								<h3>{{ concept.name }}</h3>
							</card>
						</li>
					</ul>
				</div>
				<div v-if="selected.related.length" class="concept__related">
					<h4>També et pot interessar...</h4>
					<ul class="scrollable">
						<li v-for="concept in selected.related" :key="concept.name">
							<card :item="concept" @click.native="select(concept)">
								<h3>{{ concept.name }}</h3>
							</card>
						</li>
					</ul>
				</div>
			</footer>
		</card>
		<ul v-else class="concepts__root">
			<li v-for="concept in root" :key="concept.name">
				<card :item="concept" @click.native="select(concept)">
					<h3>{{ concept.name }}</h3>
				</card>
			</li>
		</ul>
		<router-link to="/" class="close-btn">&times;</router-link>
	</section>
</template>

<script>
import Card from '../components/Card.vue';
import airtable from '../airtable';
import config from '../config.yaml';
import { normalize } from '../utils';

export default {
	name: 'Concepts',
	components: { Card },
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
