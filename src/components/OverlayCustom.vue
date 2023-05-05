<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<template>
  <v-overlay :model-value="open" persistent class="align-center justify-center">
    <v-progress-circular color="primary" indeterminate size="64" />
  </v-overlay>
</template>
