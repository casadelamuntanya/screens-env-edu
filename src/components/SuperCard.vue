<template>
	<card
		:item="item"
		:class="['super-card', { 'expanded': expanded }]"
		attribution
		@click.native="toggleExpandedContent">
		<header class="super-card__header">
			<ul v-if="patheable" class="super-card__path">
				<li><button @click.stop="select()">Conceptes</button></li>
				<li v-for="step in item.path" :key="step.name">
					<button @click.stop="select(step)">{{ step.name }}</button>
				</li>
			</ul>
			<h2 class="super-card__name">{{ item.name }}</h2>
			<p class="super-card__description expandable">{{ item.description }}</p>
		</header>
		<footer>
			<div v-if="item.media && item.media.length" class="super-card__media expandable">
				<scroller v-slot="{ item: media }" :items="item.media">
					<card
						:item="media"
						:class="{ 'active': active === media.id }"
						attribution
						@click.native.stop="activate(media)" />
					<div class="fade" @click.stop="activate()" />
				</scroller>
			</div>
			<div v-if="item.children && item.children.length" class="super-card__children">
				<scroller v-slot="{ item: child }" :items="item.children">
					<card :item="child" @click.native.stop="select(child)">
						<h3>{{ child.name }}</h3>
					</card>
				</scroller>
			</div>
			<div v-if="item.related && item.related.length" class="super-card__related">
				<h5>També et pot interessar...</h5>
				<scroller v-slot="{ item: related }" :items="item.related">
					<card :item="related" @click.native.stop="select(related)">
						<h4>{{ related.name }}</h4>
					</card>
				</scroller>
			</div>
		</footer>
		<a
			v-if="closeable"
			href="#"
			class="close-btn"
			@click.prevent="close">&times;</a>
	</card>
</template>

<script>
import Card from './Card.vue';
import Scroller from './Scroller.vue';

export default {
	name: 'SuperCard',
	components: { Card, Scroller },
	props: {
		item: { type: Object, required: true },
		patheable: { type: Boolean, default: false },
		closeable: { type: Boolean, default: false },
	},
	data() {
		return {
			expanded: false,
			active: undefined,
		};
	},
	methods: {
		select(item) {
			this.$emit('select', item);
		},
		activate({ id } = {}) {
			this.active = id;
		},
		toggleExpandedContent() {
			this.expanded = !this.expanded;
		},
		close() {
			this.$emit('close');
		},
	},
};
</script>
