/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import Toast, { ToastOptions } from "./vue-toastification";

import VueSweetalert2 from "./vue-sweetalert2";
// Plugins
import { loadFonts } from "./webfontloader";
import pinia from "../store";
import router from "../router";
import vuetify from "./vuetify";

export function registerPlugins(app) {
  loadFonts();
  app
    .use(vuetify)
    .use(Toast, ToastOptions)
    .use(router)
    .use(pinia)
    .use(VueSweetalert2);
}
