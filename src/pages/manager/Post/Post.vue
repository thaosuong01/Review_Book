<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import { emptyObject } from "../../../utils/functions";

export default defineComponent({
  setup() {
    const store = useStore();

    const dialog = ref(false);
    const selected = ref();

    const posts = computed(() => store.getters["post/getPost"]);
    const filters = computed(() => store.state["post"].filters);
    const pagination = computed(() => store.state["post"].pagination);
    const isLoading = computed(() => store.state["post"].isLoading);
    const URL = computed(() => process.env.VUE_APP_ENDPOINT_URL);
    const user = computed(
      () => !emptyObject(store.state["auth"].user) && store.state["auth"].user
    );

    const fetchAllPost = (filters) => {
      if (user.value?.role.toLowerCase() !== "admin")
        filters = {
          ...filters,
          where: "user_id," + user.value._id,
        };

      store.dispatch("post/fetchAllPost", filters);
    };

    onBeforeUnmount(() => {
      store.dispatch("post/reset");
    });

    onBeforeMount(() => {
      fetchAllPost({
        ...filters.value,
        page: 1,
        limit: 10,
      });
    });

    const onChangePage = (value) => {
      fetchAllPost({
        ...filters.value,
        page: value,
      });
    };

    const handleDelete = (post) => {
      store.dispatch("post/fetchDeletePost", {
        id: post._id,
        isDelete: false,
      });
      dialog.value = false;
    };

    const onOpenDialogDelete = (post) => {
      dialog.value = true;
      selected.value = post;
    };

    return {
      onChangePage,
      handleDelete,
      onOpenDialogDelete,
      posts,
      URL,
      isLoading,
      pagination,
      dialog,
      selected,
    };
  },
});
</script>

<template>
  <v-row>
    <v-col>
      <div class="d-flex justify-space-between">
        <h1 class="mb-5 text-2xl font-bold">Danh sách bài viết</h1>

        <router-link class="text-decoration-none" to="/manager/post/add">
          <v-btn>Thêm bài viết</v-btn>
        </router-link>
      </div>

      <div class="position-relative">
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="green"
          class="position-absolute"
          style="top: -5px"
        />

        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Tiêu đề</th>
              <th class="text-left">Nội dung</th>
              <th class="text-left">Tác giả</th>
              <th class="text-left">Danh mục</th>
              <th class="text-left">Thời gian tạo</th>
              <th class="text-left">Hành động</th>
            </tr>
          </thead>
          <tbody v-if="posts.length">
            <tr v-for="post in posts" :key="post._id">
              <td>
                <v-row no-gutters>
                  <v-col cols="3">
                    <v-sheet
                      class="rounded"
                      max-width="100"
                      elevation="8"
                      height="100%"
                      width="100%"
                    >
                      <v-img :src="`${URL}/${post.image_title}`" />
                    </v-sheet>
                  </v-col>

                  <v-col cols="9" align-self="center">
                    <p class="text-truncate">
                      {{ post.title }}
                    </p>
                  </v-col>
                </v-row>
              </td>

              <td>
                <p class="text-truncate">
                  {{ post.detail_html }}
                </p>
              </td>

              <td>
                <p class="text-truncate">
                  {{ post.user_id?.email }}
                </p>
              </td>

              <td>
                <p class="text-truncate">
                  {{ post.category_id?.name }}
                </p>
              </td>

              <td>
                <p class="text-truncate">
                  {{ post.createdAt }}
                </p>
              </td>

              <td>
                <router-link
                  :to="`/manager/post/update/${post._id}`"
                  class="text-decoration-none"
                >
                  <v-btn class="mr-1">Sửa</v-btn>
                </router-link>
                <v-btn color="error" @click="onOpenDialogDelete(post)"
                  >Xoá</v-btn
                >
              </td>
            </tr>
          </tbody>

          <p v-else>Bạn chưa có bài viết nào</p>
        </v-table>
      </div>

      <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
          <v-card-title class="text-h5"> Xác nhận trước khi xoá </v-card-title>
          <v-card-text
            >Bạn có muốn xoá bài viết
            <strong>`{{ selected.title }}`</strong></v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="dialog = false">
              Huỷ
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="handleDelete(selected)"
            >
              Xoá
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="text-center">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalRows"
          @update:modelValue="onChangePage"
        ></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>

<style>
.v-table > .v-table__wrapper > table {
  table-layout: fixed;
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 8px 16px;
}
</style>
