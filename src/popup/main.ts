import { createApp } from "vue";
import Popup from "./Popup.vue";
import { pinia } from "./store";
import './utils/rxdb-plugins'

createApp(Popup)
  .use(pinia)
  .mount("#app");
