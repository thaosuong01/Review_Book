<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6">
      <v-sheet rounded="lg">
        <card-home />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import CardHome from "../components/CardHome.vue";

export default defineComponent({
  components: {
    CardHome,
  },
});
</script>
