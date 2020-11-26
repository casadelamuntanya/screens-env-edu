<template>
	<section class="concepts">
		<div v-if="selected" class="concept">
			<figure class="cover">
				<component
					:is="mimeType(selected.bg[0])"
					:src="selected.bg[0].url"
					autoplay
					loop />
				<figcaption>{{ selected.bg[0].filename }}</figcaption>
			</figure>
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
			<ul class="concept__children">
				<li v-for="concept in selected.children" :key="concept.name">
					<button @click="select(concept)">
						{{ concept.name }}
					</button>
				</li>
			</ul>
			<ul class="concept__related">
				<li v-for="concept in selected.related" :key="concept.name">
					<button @click="select(concept)">
						{{ concept.name }}
					</button>
				</li>
			</ul>
		</div>
		<ul v-else class="concepts__root">
			<li v-for="concept in root" :key="concept.name">
				<button @click="select(concept)">{{ concept.name }}</button>
			</li>
		</ul>
		<router-link to="/" class="close-btn">&times;</router-link>
	</section>
</template>

<script>
import airtable from '../airtable';
import config from '../config.yaml';
import { normalize } from '../utils';

export default {
	name: 'Concepts',
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
		mimeType(source) {
			return source[0].type.match(/video\//g) ? 'video' : 'img';
		},
	},
};
</script>
