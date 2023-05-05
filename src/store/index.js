import { createStore } from "vuex";
import auth from "./modules/auth";
import category from "./modules/category";
import toast from "./modules/toast";
import post from "./modules/post";

export default createStore({
  modules: {
    auth,
    category,
    toast,
    post,
  },
  devtools: process.env.NODE_ENV !== "production",
});
