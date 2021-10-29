import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueMobileDetection from "vue-mobile-detection";

Vue.config.productionTip = false

const store = {
	state: {
		upload: {
			img: null,
			name: null
		},
		preview: {
			image: {},
			coordinates: {},
			canvas: {}
		},
	}
}

Vue.use(VueMobileDetection);

new Vue({
	data: store,

	vuetify,
	render: h => h(App)
}).$mount('#app')
