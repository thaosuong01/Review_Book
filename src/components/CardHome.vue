<script>
import { computed, defineComponent, onBeforeMount } from "@vue/runtime-core";
import { useStore } from "vuex";
import CardHomeItem from "./CardHomeItem.vue";
import OverlayCustom from "./OverlayCustom.vue";

export default defineComponent({
  components: {
    CardHomeItem,
    OverlayCustom,
  },
  setup() {
    const store = useStore();

    const posts = computed(() => store.state["post"].posts);
    const filters = computed(() => store.state["post"].filters);
    const pagination = computed(() => store.state["post"].pagination);
    const loading = computed(() => store.state["post"].isLoading);

    const fetchAllPost = ({ filters, page, totalRows }) => {
      if (page >= totalRows) return;

      store.dispatch("post/fetchAllPost", filters);
    };

    onBeforeMount(() => {
      fetchAllPost({
        filters: {
          ...filters.value,
          where: "",
          limit: 2,
          isHome: true,
        },
        page: filters.value.page,
        totalRows: pagination.value.totalRows,
      });
    });

    const visibilityChanged = (isVisibilityChanged) => {
      if (!isVisibilityChanged) return;

      let oldPage = filters.value.page;

      if (oldPage >= pagination.value.totalRows) return;

      store.dispatch("post/changeFilter", {
        page: ++oldPage,
      });

      store.dispatch("post/fetchAllPost", {
        ...filters.value,
        isHome: true,
      });
    };

    return {
      posts,
      loading,
      visibilityChanged,
    };
  },
});
</script>

<template>
  <v-card class="mx-auto">
    <v-card-title class="text-h4 font-weight-bold"
      >Danh sách bài viết</v-card-title
    >

    <overlay-custom :open="loading" />

    <v-container>
      <v-row dense>
        <card-home-item v-for="post in posts" :key="post._id" :item="post" />

        <div v-if="posts.length" v-observe-visibility="visibilityChanged"></div>
      </v-row>
    </v-container>
  </v-card>
</template>
