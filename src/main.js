import CKEditor from "@ckeditor/ckeditor5-vue";
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import { ObserveVisibility } from "vue-observe-visibility";

const app = createApp(App);

app.directive("observe-visibility", {
  beforeMount: (el, binding, vnode) => {
    vnode.context = binding.instance;
    ObserveVisibility.bind(el, binding, vnode);
  },
  update: ObserveVisibility.update,
  unmounted: ObserveVisibility.unbind,
});

app.use(store);
app.use(router);
app.use(vuetify);
app.use(CKEditor);

app.mount("#app");
