<template>
	<ul v-drag-scroll class="scroller">
		<li v-for="(item, i) in items" :key="i">
			<slot :item="item" />
		</li>
	</ul>
</template>

<script>
import DragScroll from '../utils/directive.dragscroll';

export default {
	name: 'Scroller',
	directives: { DragScroll },
	props: {
		items: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style lang="scss">
.scroller {
	display: flex;
	overflow-x: auto;
	margin: 1rem 0;

	// Hide scrollbar
	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar { display: none; }

	&::before,
	&::after {
		content: '';
		flex: 1 0 1rem;
	}

	li {
		margin: 1rem;
		flex: 0 0 content;
	}
}
</style>
