<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import userApi from "../../api/userApi";

const store = useStore();
const dispatch = store.dispatch;

const users = ref([]);
const currentUser = computed(() => store.state.auth.user);
const pagination = ref({
  page: 1,
  limit: 5,
  totalRows: 5,
});
const filters = ref({
  page: 1,
  limit: 5,
});

async function getAllUser(filters) {
  try {
    const response = await userApi.getAll(filters);
    if (response) {
      users.value = response.elements;
      pagination.value = response.meta.pagination;
    }
    console.log(response.elements);
  } catch (error) {
    console.log("error getALlUser: ", error);
  }
}

onMounted(() => {
  getAllUser(filters.value);
});

function onClickSelected(user) {}

function onChangePage() {}
</script>

<template>
  <v-row>
    <v-col>
      <div class="d-flex justify-space-between">
        <h1 class="mb-5 text-2xl font-bold">Danh sách người dùng</h1>
      </div>

      <div class="position-relative">
        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Họ và tên</th>
              <th class="text-left">Ảnh đại diện</th>
              <th class="text-left">Email</th>
              <th class="text-left">Quyền</th>
            </tr>
          </thead>
          <tbody v-if="users.length">
            <tr v-for="user in users" :key="user._id">
              <td>
                <p class="text-truncate">
                  {{ user.full_name || "Ẩn danh" }}
                </p>
              </td>
              <td>
                <img
                  class="rounded-full"
                  :src="user.image ? user.image : 'https://lnsel.com/wp-content/uploads/2018/12/anon-avatar.png'"
                  alt=""
                />
              </td>
              <td>
                <p class="text-truncate">
                  {{ user.email || "" }}
                </p>
              </td>
              <td>
                <p class="text-truncate">
                  {{ user.role || "" }}
                </p>
              </td>
            </tr>
          </tbody>

          <p v-else>Không có người dùng nào</p>
        </v-table>
      </div>

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
.v-table > .v-table__wrapper > table > tbody > tr > td > img {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
</style>