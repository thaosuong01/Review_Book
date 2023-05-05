<template>
  <ckeditor
    :editor="editor"
    v-model="value"
    tag-name="textarea"
    :config="editorConfig"
  ></ckeditor>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { defineComponent, ref, watch } from "@vue/runtime-core";
import { uploadImage } from "../../../utils/functions";

export default defineComponent({
  props: {
    editorData: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const value = ref("");

    watch(
      () => props.editorData,
      (editorData) => {
        value.value = editorData;
      }
    );

    function uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return uploadImage(loader);
      };
    }

    watch(value, (value) => {
      if (value) {
        emit("update:modelValue", value);
      }
    });

    return {
      editor: ClassicEditor,
      value,
      editorConfig: {
        extraPlugins: [uploader],
      },
    };
  },
});
</script>
