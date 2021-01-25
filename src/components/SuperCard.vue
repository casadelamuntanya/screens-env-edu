<template>
	<card
		:item="item"
		:class="['super-card', { 'expanded': expanded }]"
		size="full"
		attribution
		@click.native="toggleExpandedContent">
		<header class="super-card__header">
			<ul v-if="patheable" class="super-card__path">
				<li><button @click.stop="select()">{{ $t('card.path_index') }}</button></li>
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
						v-swipe:200.right.left="swipeMedia"
						:item="media"
						:class="{ 'active': activeMedia === media.id }"
						attribution
						@click.native.stop="showMedia(media)" />
					<div class="fade" @click.stop="showMedia()" />
				</scroller>
			</div>
			<div v-if="item.children && item.children.length" class="super-card__children">
				<scroller v-slot="{ item: child }" :items="item.children">
					<card :item="child" @click.native.stop="select(child)">
						<h3>{{ child.name }}</h3>
					</card>
				</scroller>
			</div>
			<div v-if="other && other.length" class="super-card__related">
				<h5>{{ $t('card.related') }}</h5>
				<scroller v-slot="{ item: related }" :items="other">
					<card
						:item="related"
						:class="related.type"
						@click.native.stop="select(related)">
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
import Swipe from '../utils/directive.swipe';

export default {
	name: 'SuperCard',
	directives: { Swipe },
	components: { Card, Scroller },
	props: {
		item: { type: Object, required: true },
		patheable: { type: Boolean, default: false },
		closeable: { type: Boolean, default: false },
	},
	data() {
		return {
			expanded: false,
			activeMedia: undefined,
		};
	},
	computed: {
		other() {
			return [
				...this.item.related.map(item => ({ ...item, type: 'related' })),
				...this.item.predators.map(item => ({ ...item, type: 'predator' })),
				...this.item.preys.map(item => ({ ...item, type: 'prey' })),
			];
		},
	},
	methods: {
		select(item) {
			this.$emit('select', item);
		},
		showMedia({ id } = {}) {
			this.activeMedia = id;
		},
		swipeMedia({ direction }) {
			const { item, activeMedia } = this;
			if (!activeMedia) return;
			const step = direction === 'right' ? -1 : 1;
			const i = item.media.findIndex(media => media.id === activeMedia) + step;
			if (i >= 0 && i < item.media.length) {
				this.activeMedia = item.media[i].id;
			}
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
