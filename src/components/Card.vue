<template>
	<article class="card" tabindex="1">
		<figure class="cover">
			<component
				:is="mimeType"
				:src="thumbnail"
				autoplay
				loop
				draggable="false" />
			<figcaption v-if="attribution">
				{{ image.filename }}
			</figcaption>
		</figure>
		<slot />
	</article>
</template>

<script>
export default {
	name: 'Card',
	props: {
		item: { type: Object, required: true },
		attribution: { type: Boolean, default: false },
	},
	computed: {
		image() { return this.item.bg ? this.item.bg[0] : this.item; },
		mimeType() { return this.image.type.match(/video\//g) ? 'video' : 'img'; },
		thumbnail() {
			const { thumbnails } = this.image;
			return thumbnails ? thumbnails.large.url : this.image.url;
		},
	},
};
</script>
