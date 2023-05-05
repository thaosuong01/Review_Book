<script>
import { defineComponent, onMounted, ref } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import authApi from "../api/authApi";
import OverlayCustomComponent from "../components/OverlayCustom.vue";

export default defineComponent({
  components: {
    OverlayCustomComponent,
  },
  setup() {
    const route = useRoute();
    const loading = ref(false);
    const { email } = route.params;
    const { token } = route.query;
    const message = ref("");
    const open = ref(false);

    const verifyAccount = async ({ email, token }) => {
      try {
        loading.value = true;
        await authApi.verifyAccount({ email, token });
        loading.value = false;
      } catch (error) {
        loading.value = false;
        if (error.response) {
          message.value = error.response.data.errors.message;
        }
      }
    };

    const handleResendEmail = async () => {
      try {
        if (email) {
          loading.value = true;
          const response = await authApi.resendEmail({ email });
          if (response) {
            loading.value = false;
            open.value = true;
          }
        }
      } catch (error) {
        loading.value = false;
        console.log("resendEmail error :::", error);
        if (error.response) {
          message.value = error.response.data.errors.message;
        }
      }
    };

    onMounted(async () => {
      if (email && token) {
        verifyAccount({ email, token });
      }
    });

    return {
      loading,
      message,
      open,
      handleResendEmail,
    };
  },
});
</script>

<template>
  <v-row justify="center" align="center" style="min-height: 80vh">
    <v-col cols="6" align-self="center">
      <v-sheet class="pa-2 ma-2">
        <v-alert
          v-if="open"
          class="mb-5"
          type="success"
          title="Gửi mail"
          text="Gửi lại email thành công vui lòng kiểm tra và xác nhận."
        />

        <div v-if="!message">
          <v-alert type="success" variant="outlined">
            <template v-slot:title> Xác thực tài khoản thành công. </template>
          </v-alert>

          <v-btn to="/login" class="mt-5">Đăng nhập</v-btn>
        </div>

        <div v-else>
          <v-alert variant="outlined" type="warning" prominent border="top">
            <template v-slot:title>
              Xác thực tài khoản không thành công.
            </template>

            {{ message }}
          </v-alert>

          <v-btn class="mt-5" @click="handleResendEmail">Gửi lại</v-btn>
        </div>

        <overlay-custom-component :open="loading" />
      </v-sheet>
    </v-col>
  </v-row>
</template>
