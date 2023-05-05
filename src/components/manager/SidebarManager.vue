<script>
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { emptyObject } from "../../utils/functions";

export default defineComponent({
  props: {
    drawer: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const store = useStore();
    const role = computed(
      () =>
        !emptyObject(store.state["auth"].user) && store.state["auth"].user.role
    );

    const linkPrivate = [
      ["mdi-view-dashboard-edit", "Dashboard", "/manager/dashboard"],
      ["mdi mdi-shape", "Quản lý danh mục", "/manager/category"],
      ["mdi mdi-book-edit", "Quản lý bài viết", "/manager/post"],
    ];

    const linkPublic = [["mdi mdi-book-edit", "Quản lý bài viết", "/manager/post"]];

    const links = computed(() =>
      role.value && role.value.toLowerCase() !== "admin"
        ? linkPublic
        : linkPrivate
    );

    const open = ref(true);

    return { links, open };
  },
});
</script>

<template>
  <v-navigation-drawer v-model="open">
    <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="[icon, text, to] in links" :key="icon" link :to="to">
        <template v-slot:prepend>
          <v-icon>{{ icon }}</v-icon>
        </template>

        <v-list-item-title> {{ text }} </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

