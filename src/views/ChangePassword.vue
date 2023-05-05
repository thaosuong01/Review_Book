<script>
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import authApi from "../api/authApi";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const params = route.params;
    const query = route.query;
    const loading = ref(false);
    const password = ref("");
    const store = useStore();

    const email = computed(() => params?.email);
    const token = computed(() => query?.token);

    const handleSubmit = async () => {
      if (!password.value) return;

      try {
        const response = await authApi.changePassword({
          data: { password: password.value },
          email: email.value,
          token: token.value,
        });

        if (response) {
          store.dispatch("toast/startToast", {
            text: "Thay đổi mật khẩu thành công",
            color: "success",
            timeout: 2500,
            open: true,
          });
          router.push("/login");
        }
      } catch (error) {
        if (error.response) {
          store.dispatch("toast/startToast", {
            text: error.response.data.errors.message,
            color: "error",
            timeout: 5000,
            open: true,
          });
        }
      }
    };

    return {
      handleSubmit,
      loading,
      password,
    };
  },
});
</script>

<template>
  <v-container>
    <v-row justify="center" align="center" style="min-height: 80vh">
      <v-col cols="6" align-self="center">
        <v-sheet class="pa-2 ma-2">
          <v-form @submit.prevent="handleSubmit">
            <h1 class="mb-5 text-2xl font-bold">Thay đổi mật khẩu</h1>

            <v-text-field v-model="password" label="Mật khẩu mới" />

            <router-link to="/login">Đăng nhập</router-link>

            <v-btn
              color="#e89216"
              type="submit"
              class="d-block text-white my-4"
              :loading="loading"
              :disabled="!password || loading"
            >
              Thay đổi
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
