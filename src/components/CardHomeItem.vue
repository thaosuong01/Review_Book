<script>
import { computed, defineComponent } from "@vue/runtime-core";
import moment from "moment";
import "moment/locale/vi";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup({ item }) {
    const URL_IMG = computed(
      () => process.env.VUE_APP_ENDPOINT_URL + "/" + item.image_title
    );

    const timeStamp = computed(() => moment(item.createdAt).fromNow());

    return {
      URL_IMG,
      timeStamp,
    };
  },
});
</script>

<template>
  <v-col cols="12">
    <v-card>
      <v-img :src="URL_IMG" height="400px" cover></v-img>

      <v-card-title class="text-h5 font-weight-bold">
        {{ item.title }}
      </v-card-title>

      <v-card-title>
        <span>
          Tác giả:
          {{
            item.user_id && !item.user_id.full_name
              ? "Ẩn danh"
              : item.user_id.full_name
          }}
          -
        </span>
        <span class="text-caption">{{ timeStamp }}</span>
      </v-card-title>

      <v-card-subtitle>
        {{ item.detail_text }}
      </v-card-subtitle>

      <v-card-actions>
        <v-chip class="ma-2" color="green" text-color="white">
          {{ item.category_id.name }}
        </v-chip>

        <v-spacer></v-spacer>

        <v-btn
          :to="`/post/${item.slug}`"
          append-icon="mdi-arrow-right-box"
          variant="outlined"
          color="error"
        >
          Đọc thêm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
