<script>
import { defineComponent, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import authApi from "../api/authApi";
import { emptyObject } from "../utils/functions";

export default defineComponent({
  setup() {
    const email = ref("");
    const emailRules = [(v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ"];
    const messageAlert = ref("");
    const loading = ref(false);
    let errors = {};
    const store = useStore();

    watch(email, (email) => {
      if (!/.+@.+\..+/.test(email)) {
        errors["email"] = true;
      } else {
        errors = {};
      }
    });

    const handleSubmit = async () => {
      try {
        if (emptyObject(errors)) {
          loading.value = true;
          const response = await authApi.forgotPassword({ email: email.value });
          console.log(response);

          if (response) {
            email.value = "";
            loading.value = false;
            messageAlert.value = "Hãy kiểm tra email để có thể đổi mật khẩu";
          }
        }
      } catch (error) {
        loading.value = false;

        if (error.response) {
          const payload = {
            tinmeout: 3000,
            open: true,
            color: "error",
            text: error.response.data.errors.message,
          };
          store.dispatch("toast/startToast", payload);
        }
      }
    };

    return {
      handleSubmit,
      email,
      emailRules,
      messageAlert,
      loading,
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
            <h1 class="mb-5 text-2xl font-bold">Quên mật khẩu</h1>

            <v-alert v-if="messageAlert" type="success" class="mb-5">{{
              messageAlert
            }}</v-alert>

            <v-text-field v-model="email" label="E-mail" :rules="emailRules" />

            <router-link to="/login">Đăng nhập</router-link>

            <v-btn
              color="#e89216"
              type="submit"
              class="d-block my-4 text-white"
              :loading="loading"
              :disabled="!email || loading"
            >
              Gửi
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
