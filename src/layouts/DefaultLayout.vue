<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import authApi from "../api/authApi";
import { emptyObject } from "../utils/functions";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const drawer = ref(null);
    const theme = ref(localStorage.getItem("theme") || "light");

    const user = computed(() =>
      emptyObject(store.state.auth.user) ? null : store.state.auth.user
    );

    const accessToken = computed(() =>
      store.state.auth.accessToken ? true : false
    );

    const isHome = computed(() => (!route.meta?.auth ? true : false));

    const handleLogout = async () => {
      try {
        const response = await authApi.signOut();
        if (response) {
          store.dispatch("auth/remove");
          router.push("/login");
        }
      } catch (error) {
        console.log("error handleLogout:::", error);
        throw new Error(error.message);
      }
    };

    onMounted(() => {
      if (isHome.value) {
        store.dispatch("category/fetchAllWtihChildrenCategory");
      }
    });

    watch(isHome, (isHome) => {
      if (isHome) {
        store.dispatch("category/fetchAllWtihChildrenCategory");
        store.dispatch("auth/saveUser", {});
      }
    });

    function onClick() {
      theme.value = theme.value === "light" ? "dark" : "light";
      localStorage.setItem("theme", theme.value);
    }

    const categories = computed(() => store.state["category"].categories);

    return {
      onClick,
      handleLogout,
      accessToken,
      theme,
      drawer,
      user,
      isHome,
      categories,
    };
  },
});
</script>

<template>
  <v-app :theme="theme" id="inspire">
    <v-app-bar>
      <v-toolbar-title v-if="user"
        >Hello, {{ user && user.full_name }}</v-toolbar-title
      >
      <v-toolbar-title>
        <router-link to="/"
          ><img
            src="https://www.reader.com.vn/uploads/1342671436_readerreviewsachhaynendoc.png"
            width="150"
            alt=""
        /></router-link>
      </v-toolbar-title>

      <div v-if="isHome" class="flex">
        <v-menu
          open-on-hover
          transition="scale-transition"
          v-for="category in categories"
          :key="category._id"
          link
        >
          <template v-slot:activator="{ props }">
            <router-link
              v-bind="props"
              :to="`/category/${category.slug}`"
              class="d-block text-decoration-none"
            >
              <v-btn color="primary"> {{ category.name }} </v-btn>
            </router-link>
          </template>

          <div>
            <v-list
              v-if="category?.childrens && category?.childrens.length > 0"
            >
              <v-list-item
                v-for="subCat in category.childrens"
                :key="subCat._id"
                link
              >
                <router-link
                  :to="`/category/${subCat.slug}`"
                  class="d-block text-decoration-none"
                >
                  <v-list-item-title> {{ subCat.name }} </v-list-item-title>
                </router-link>
              </v-list-item>
            </v-list>
          </div>
        </v-menu>
      </div>

      <v-btn
        v-if="isHome && accessToken"
        to="/manager"
        variant="flat"
        class="hover:bg-[#e89126]"
      >
        Quản trị
      </v-btn>

      <div v-if="!accessToken">
        <v-btn to="/login" variant="flat">Đăng nhập</v-btn>
        <v-btn to="/register" variant="flat">Đăng kí</v-btn>
      </div>

      <v-btn v-if="user" variant="flat" @click="handleLogout">
        Đăng xuất
      </v-btn>
    </v-app-bar>

    <router-view name="sidebar" :drawer="drawer" />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
