/* JS files and framework components are HMR-ed */

import { createApp } from "vue";
import Popup from "./Popup.vue";
import { pinia } from "./store";

console.log("Loaded popup/main.ts");

createApp(Popup)
  .use(pinia)
  .mount("#app");
