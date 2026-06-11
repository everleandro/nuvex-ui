import { createApp } from "vue";
import { NuvexUI } from "../../src";
import Layout from "./Layout.vue";
import router from "./router";
import "../../public/styles/main.scss";
import "../../src/style/main.scss";

const app = createApp(Layout);
app.use(NuvexUI, {
	theme: {
		storage: {
			key: "playground-theme",
		},
	},
});
app.use(router);
app.mount("#app");
