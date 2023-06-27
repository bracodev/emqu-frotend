/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
// Composables
import { createApp } from "vue";
import mixins from "./mixins";
import moment from "moment";
// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp({
  extends: App,
  mixins: [mixins],
});

app.config.globalProperties.$filters = {
  timeAgo(date) {
    return moment(date).fromNow();
  },
};

registerPlugins(app);

app.mount("#app");
