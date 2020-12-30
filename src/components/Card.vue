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
				{{ file.filename }}
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
		size: { type: String, default: 'large' },
		attribution: { type: Boolean, default: false },
	},
	computed: {
		file() { return this.item.bg ? this.item.bg[0] : this.item; },
		mimeType() { return this.file.type.match(/video\//g) ? 'video' : 'img'; },
		thumbnail() {
			const { thumbnails } = this.file;
			return thumbnails ? thumbnails[this.size]?.url || this.file.url : this.file.url;
		},
	},
};
</script>
