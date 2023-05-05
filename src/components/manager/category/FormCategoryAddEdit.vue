<template>
  <form @submit.prevent="handleSubmit">
    <v-alert class="mb-5" type="error" v-if="errorMessage">
      {{ errorMessage }}
    </v-alert>

    <v-text-field
      type="text"
      label="Tên danh mục"
      v-model="name"
      :counter="max"
      :rules="ruleName"
    />

    <v-text-field v-model="slug" type="text" label="Slug danh mục" disabled />

    <v-btn type="submit" :disabled="!name" color="success" class="mt-5 d-block">
      Lưu
    </v-btn>
  </form>
</template>

<script>
import slugify from "slugify";
import { defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import categoryApi from "../../../api/categoryApi";

export default defineComponent({
  props: {
    selected: {
      type: Object,
      default: {},
    },
    parent: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const ruleName = [
      (v) => !!v || "Tên danh mục là trường bắt buộc",
      (v) =>
        (v && v.length <= max) || `Tên danh mục không vượt quá ${max} kí tự`,
    ];
    const router = useRouter();
    const name = ref("");
    const slug = ref("");
    const max = 40;
    const errorMessage = ref("");
    let errors = {};
    const store = useStore();

    watch(name, (nameNew, nameOld) => {
      slug.value = slugify(nameNew, { locale: "vi" });
      nameNew.length >= max ? (errors["name"] = true) : (errors = {});
    });

    watch(
      () => props.selected,
      (selected) => {
        name.value = selected.name;
        slug.value = slugify(selected.name, { locale: "vi" });
      }
    );

    const handleSubmit = async () => {
      if (Object.keys(errors).length === 0) {
        let data = {
          name: name.value,
          slug: slug.value,
        };

        try {
          let response;
          const selectedEmpty = Object.keys(props.selected).length === 0;
          const parentEmpty = Object.keys(props.parent).length === 0;

          if (selectedEmpty) {
            if (!parentEmpty) {
              data = {
                ...data,
                level: +props.parent.level + 1,
                parentId: props.parent._id,
              };
            }
            response = await categoryApi.create(data);
          } else {
            response = await categoryApi.update({
              id: props.selected._id,
              data,
            });
          }

          if (response && response.elements) {
            const payload = {
              text: `${selectedEmpty ? "Thêm" : "Cập nhật"} danh mục ${
                !parentEmpty ? "con" : ""
              } thành công`,
              color: "success",
              open: true,
            };
            store.dispatch("toast/startToast", payload);
            router.push("/manager/category");
          }
        } catch (error) {
          if (error && error.response && error.response.data) {
            errorMessage.value = error.response.data.errors.message;
          }
        }
      }
    };

    return {
      handleSubmit,
      name,
      max,
      ruleName,
      slug,
      errorMessage,
    };
  },
});
</script>
