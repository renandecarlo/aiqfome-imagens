<template>
	<v-container>
		<vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" 
			v-on:vdropzone-file-added="fileAdded"
			v-on:vdropzone-max-files-exceeded="maxFilesExceeded"
		></vue-dropzone>
		<div class="preview"></div>
	</v-container>
</template>

<script>
	import vue2Dropzone from 'vue2-dropzone'
	import 'vue2-dropzone/dist/vue2Dropzone.min.css'

	export default {
		components: {
			vueDropzone: vue2Dropzone
		},

		methods: {
			fileAdded(file) {
				this.$root.state.upload.img = URL.createObjectURL(file)
				this.$root.state.upload.name = file.name
			},

			maxFilesExceeded(file) {
				this.$refs.myVueDropzone.removeAllFiles()
				this.$refs.myVueDropzone.addFile(file)
			}
		},

		data() {
			return {
				dropzoneOptions: {
					url: 'https://httpbin.org/post',
					thumbnailWidth: 200,
					thumbnailMethod: 'contain',
					// acceptedFiles: '.png,.jpg,.jpeg,.bmp,.tiff,.tif',
					acceptedFiles: 'image/*',
					maxFilesize: 30,
					uploadMultiple: false,
					maxFiles: 1,
					autoProcessQueue: false,
					duplicateCheck: false,
					addRemoveLinks: false,
					dictDefaultMessage: '<i class="v-icon notranslate mdi mdi-tray-arrow-up"></i>&nbsp; Arraste e solte a imagem, ou clique aqui',
					disablePreviews: true,
					previewsContainer: ".preview" /* disablePreviews is not working, so we use a dumb container and hide it */
					// previewTemplate: this.template()
				}
			}
		}
	}
</script>

<style>
.dropzone {
	font-family: Roboto, sans-serif;
	/* width: 60%; */
	margin: 0 auto;
	background-image: linear-gradient(45deg, #ffffff 25%, #fafafa 25%, #fafafa 50%, #ffffff 50%, #ffffff 75%, #fafafa 75%, #fafafa 100%);
	background-size: 42.43px 42.43px;
	border: 1px solid #e5e5e5;
}

.dropzone.dz-drag-hover {
	background-image: linear-gradient(45deg, #ffffff 25%, #ad19d20d 25%, #ad19d20d 50%, #ffffff 50%, #ffffff 75%, #ad19d20d 75%, #ad19d20d 100%);
}

.preview {
	display: none;
}


.dropzone .dz-preview .dz-image {
	z-index: initial;
}

.dropzone .dz-preview .dz-image img {
	margin: 0 auto;
}

.dropzone .dz-preview {
	/* display: block; */
	left: 50%;
	transform: translateX(-50%);
}

.dropzone .dz-message {
	margin: 130px 0;
}

.dropzone .dz-preview.dz-image-preview {
	background: none;
}

#dropzone .dz-preview .dz-details, 
#dropzone .dz-preview .dz-progress, 
#dropzone .dz-preview .dz-remove {
	border: solid 5px red;
	display: none;
}

</style>
