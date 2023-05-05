<script setup>
import { toRef, defineProps } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  value: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  successMessage: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  others: {
    type: Object,
    default: {},
  },
});

const name = toRef(props, "name");

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name, undefined, {
  initialValue: props.value,
});
</script>

<template>
  <v-input
    :error="!!errorMessage"
    :error-messages="errorMessage && errorMessage"
  >
    <v-text-field
      :name="name"
      :label="label"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      @input="handleChange"
      @blur="handleBlur"
      filled
      v-bind="others"
    />
  </v-input>
</template>
