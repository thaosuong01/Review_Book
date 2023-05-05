<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    :location="location"
    :timeout="timeout"
    multi-line
  >
    {{ text }}

    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { computed, defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  props: {
    text: {
      type: String,
      default: "Không có thông báo",
    },
    color: {
      type: String,
      default: "success",
    },
    open: {
      type: Boolean,
      default: false,
    },
    timeout: {
      type: Number,
      default: 1500,
    },
    location: {
      type: String,
      default: "top right",
    },
  },
  setup(props) {
    const snackbar = ref(props.open);

    return {
      snackbar,
    };
  },
});
</script>
