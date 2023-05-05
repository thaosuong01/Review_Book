<script>
import { computed, defineComponent, onMounted, ref } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import postApi from "../../../api/postApi";
import PostAddEditForm from "../../../components/manager/post/PostAddEditForm.vue";

export default defineComponent({
  components: {
    PostAddEditForm,
  },
  setup(props) {
    const route = useRoute();

    const postSelected = ref({});

    const isAddMode = computed(() => (!route.params?.id ? true : false));

    const getPostById = async (postId) => {
      try {
        const response = await postApi.getById(postId);
        if (response && response.elements) {
          return response.elements;
        }
      } catch (error) {
        console.log("getPostById error:::", error);
      }
    };

    onMounted(async () => {
      if (!route.params?.id) return;
      postSelected.value = await getPostById(route.params?.id);
    });

    return {
      isAddMode,
      postSelected,
    };
  },
});
</script>

<template>
  <v-row>
    <v-col>
      <h1 class="text-center text-2xl font-bold mb-10">
        {{ isAddMode ? "Thêm" : "Cập nhật" }} bài viết
      </h1>

      <post-add-edit-form v-if="isAddMode" :isAddMode="isAddMode" />

      <post-add-edit-form
        v-else
        :isAddMode="isAddMode"
        :postSelected="postSelected"
      />
    </v-col>
  </v-row>
</template>
