<template>
	<v-container
		class="grey lighten-5 pa-8 pt-4"
		fluid
	>
		<v-snackbar
			v-model="error.state"
			timeout="5000"
			color="red darken-2 white--text"
		>
			{{ error.msg }}

			<template v-slot:action="{ attrs }">
				<v-btn
					color="white"
					text
					v-bind="attrs"
					@click="snackbar = false"				
				>
					Fechar
				</v-btn>
			</template>
		</v-snackbar>

		<h2 class="grey--text light pa-4 pl-0 mb-0">2. Selecione as imagens que deseja</h2>
		<v-row
			no-gutters
		>
			<v-col md="3" sm="12" cols="12">
				<v-btn
					elevation="1"
					class="pa-0 ma-0 mb-2"
				>
					<v-checkbox
						v-model="selectAll"
						label="Selecionar tudo"
						color="blue"
						class="select-all"
						hide-details
						v-on:change="toggleSelectAll"
					></v-checkbox>
				</v-btn>
			</v-col>
			<v-col md="9" sm="12" cols="12">
				<v-btn 
					elevation="1"
					class="mb-2 text-md-subtitle-1 font-weight-medium generate darken-1"
					color="success"
					block
					v-on:click="generateImages"
					:loading="loading"
					:disabled="loading"
				>
					<template v-slot:loading>
						<span>Aguarde...</span>
					</template>
					3. Gerar Imagens
				</v-btn>
			</v-col>
		</v-row>
		<v-row
			align="start"
			no-gutters
			dense
		>
			<v-col md="4" sm="6" cols="6"
				v-for="(image, i) in images"
				:key="i"
			>
				<v-hover>
					<template v-slot="{ hover }">
						<v-card
							v-on:click="toggleImage(i)"
							class="pa-3"
							outlined
							tile
						>
							<v-img
								ref="images"
								:src="require(`../assets/resources/original/${image.file}`)"
								:lazy-src="require(`../assets/resources/original/${image.file}`)"
								contain
								aspect-ratio="1"
								class="img grey lighten-3"
							>
								<preview
									ref="preview"
									:style="{
										'width': image.maskW / (image.height / (refs.images && refs.images[i] && refs.images[i].$el.clientHeight)) + 'px',
										'height': image.maskH / (image.height / (refs.images && refs.images[i] && refs.images[i].$el.clientHeight)) + 'px',
										'left': image.maskX / (image.height / (refs.images && refs.images[i] && refs.images[i].$el.clientHeight)) + 'px',
										'top': image.maskY / (image.height / (refs.images && refs.images[i] && refs.images[i].$el.clientHeight)) + 'px',
										'margin-left': ((refs.images && refs.images[i] && refs.images[i].$el.clientWidth) - image.width / (image.height / (refs.images && refs.images[i] && refs.images[i].$el.clientHeight))) / 2 + 'px', /* Compensate for image margin */
									}"
									:class="`mask ${image.circle && 'circle'}`"
									:image="root.state.preview.image"
									:coordinates="root.state.preview.coordinates"
								/>
								<template v-slot:placeholder> 
									<v-row
										class="fill-height ma-0"
										align="center"
										justify="center"
									>
										<v-progress-circular
											indeterminate
											color="grey lighten-5"
										></v-progress-circular>
									</v-row>
								</template>
							</v-img>
							

							<v-fade-transition>
								<!-- :value="images[i].selected" -->
								<v-overlay									
									v-if="hover || images[i].selected"
									value="1"
									absolute
									color="#222"
								>
									<v-btn
										class="toggle"
										elevation="4"
										color="purple"
										icon
										circle
										raised
										rounded
										x-large
									>
										<v-icon>{{ images[i].selected ? 'mdi-check-circle' : 'mdi-check-circle-outline' }}</v-icon>
									</v-btn>
								</v-overlay>
							</v-fade-transition>
						</v-card>
					</template>
				</v-hover>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import { Preview } from 'vue-advanced-cropper'
	// import FileSaver from 'file-saver'
	import streamSaver from 'streamsaver'
	import Jimp from 'jimp/es'
	import JSZip from 'jszip'

	import { data as maskData } from '../assets/resources/maskData.js' /* Load mask data */

	export default {
		components: {
			Preview
		},

		data() {
			/* Get images on compilation */
			// const getImages = () => {
				// const readImages = require.context('@/assets/resources/original/', false, /^.*$/).keys()

				// const images = [];
				// Object.entries(readImages).forEach(([, image]) => {
				// 	images.push({ file: image.split('/').pop(), selected: false })
				// })

				// return images
			// }

			/* Add default selected prop image data */
			for(const i in maskData)
				maskData[i].selected = maskData[i].selected || false

			return {
				images: maskData,
				root: this.$root,
				refs: this.$refs,
				selectAll: false,
				error: {
					state: false,
					msg: null
				},
				loading: false
			}
		},

		methods: {
			toggleSelectAll(selected) {
				for(const i in this.images)
					this.images[i].selected = selected
			},

			toggleImage(i) {
				this.images[i].selected = !this.images[i].selected
				
				/* Untoggle select all if unchecking image */
				if(!this.images[i].selected)
					this.selectAll = false
			},

			async generateImages() {
				try {
					/* Check if has any uploaded img */
					if(!this.$root.state.upload.img) {
						this.error.state = true
						this.error.msg = 'Envie uma logo antes de gerar as imagens'
	
						return false
					}
	
					/* Check for selected images */
					const images = this.getSelectedImages();
	
					if(!images.length) {
						this.error.state = true
						this.error.msg = 'Selecione pelo menos uma imagem'
	
						return false
					}

	

					/* Generate images */
					const data = []
					this.loading = true	
	
					for(const i in images)
						data.push(await this.generateImage(images[i], this.$root.state.preview.canvas.toDataURL()))
	
					this.loading = false
					
					/* Just open in a tab if single image */
					if(images.length == 1)
						return this.openImage(data[0].url, images[0].file)
	

					/* Zip and download files */
					const zip = await this.zipFiles(data, images)
					const zipName = this.$root.state.upload.name.split('.')[0]
	
					return await this.downloadFile(zip, zipName);
					
				} catch(error) {
					console.log(`Error generating images -> ${error}`)
				}
			},

			async zipFiles(data, images) {
				try {
					const zip = new JSZip()
	
					for(const i in data)
						zip.file(images[i].file, data[i].buffer)
	
					const content = await zip.generateAsync({ type: "uint8array" })
	
					return content

				} catch(error) {
					console.log(`Error zipping files -> ${error}`)
				}
			},

			async downloadFile(file, name) {
				try {
					console.log(file)
					// FileSaver.saveAs(file, `${name}.zip`)
	
					const fileStream = streamSaver.createWriteStream(`${name}.zip`, {
						size: file.size
					})
	
					await new Response(file).body.pipeTo(fileStream)
				} catch(error) {
					console.log(`Error downloading file -> ${error}`)
				}
			},

			async generateImage(mask, logoImg) {
				try {
					/* Load image */
					const image = await Jimp.read(require(`@/assets/resources/masks/${mask.file}`))

					if(mask.mask) {
						/* Remove mask pixels */
						const maskColor = Jimp.rgbaToInt(96, 252, 28, 255);

						image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y) {
							if(image.getPixelColor(x, y) == maskColor)
								image.setPixelColor(0xFFFFFFFF, x, y)
						});
							
						/* Load cropped logo */
						const logo = await Jimp.read(logoImg)

						/* Set logo correct dimension */
						logo.cover(mask.maskW, mask.maskH)

						if(mask.circle)
							logo.circle()

						/* Merge image and logo at mask position */
						image.composite(logo, mask.maskX, mask.maskY)
					}

					const buffer = await image.getBufferAsync(Jimp.MIME_PNG)

					const blob = new Blob([buffer])
					const url = URL.createObjectURL(blob, {type: Jimp.MIME_PNG})

					return {
						url, buffer
					}

				} catch(error) {
					console.log(`Error loading image -> ${error}`)
				}
			},

			async openImage(url, name) {
				const newTab = window.open();

				newTab.document.open()
				newTab.document.write(`
					<html style="height: 100%; margin: 0px; background: #0e0e0e;">
						<head>
							<meta name="viewport" content="width=device-width, minimum-scale=0.1">
							<title>${name}</title>
						</head>

						<body style="display: flex">
							<a href="${url}" download="${name}" style="display: flex; flex: 1"><img style="-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%); max-height: 80%; max-width: 80%;" src="${url}"></a>
						</body>
					</html>
				`)
				newTab.document.close()
			},

			getSelectedImages() {
				const images = [];

				for(const i in this.images)
					if(this.images[i].selected)
						images.push(this.images[i])

				return images
			}
		},
	}
</script>

<style>
	.toggle {
		background-color: white;
	}

	.mask {
		position: absolute;
		z-index: 1;
		display: block;
	}

	.mask.circle {
		border-radius: 50%;
	}

	.select-all {
		margin: 0 !important;
		padding-top: 3px !important;
	}

	.select-all > div > div {
		margin: 0;
		padding: 10px;
	}

	.select-all label {
		color: #838383 !important;
	}

	.generate {
		/* font-size: 16px; */
	}
</style>
