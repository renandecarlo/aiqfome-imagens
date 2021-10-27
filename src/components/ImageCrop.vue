<template>
	<v-container>
		<cropper
			ref="cropper"
			class="cropper"
			backgroundClass="background"
			foregroundClass="foreground"
			stencil-component="circle-stencil"
			:src="this.$root.state.upload.img"
			:default-size="defaultSize"
			:stencil-props="{
				aspectRatio: 1/1,
				movable: true,
				resizable: true
			}"
			v-on:change="onChange"
			:debounce="false"
		/>
		<!-- <preview
			:width="120"
			:height="120"
			:image="this.$root.state.preview.image"
			:coordinates="this.$root.state.preview.coordinates"
		/> -->
	</v-container>
</template>

<script>
	import { Cropper } from 'vue-advanced-cropper';
	import 'vue-advanced-cropper/dist/style.css';
	import 'vue-advanced-cropper/dist/theme.compact.css';

	export default {
		components: {
			Cropper
		},

		methods: {
			onChange({ coordinates, image, canvas  }) {
				this.$root.state.preview = {
					coordinates,
					image,
					canvas
				}
			},

			defaultSize({ imageSize, visibleArea }) {
				return {
					width: (visibleArea || imageSize).width,
					height: (visibleArea || imageSize).height,
				}
			}
		},
	}
</script>

<style scoped>
	.cropper {
		max-height: 326px;
		margin: 0 auto;
		background: white;
	}

	>>> .background {
		background: white;
	}

	>>> .foreground {
		background: #77777769;
	}

	.vue-preview {
		border-radius: 50%;
	}
</style>