<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import categoryApi from "../../../api/categoryApi";
import FormCategoryAddEdit from "../../../components/manager/category/FormCategoryAddEdit.vue";

const route = useRoute();
const params = route.params;
const categorySelected = ref();
const parentSelected = ref();

const isModeUpdate = computed(() => (params?.categoryId ? true : false));
const isModeAddChildren = computed(() => (params?.parentId ? true : false));

const getCategoryById = async (id) => {
  try {
    const response = await categoryApi.getById(id);
    if (response && response.elements) {
      return response.elements;
    }
  } catch (error) {
    console.log("error getCategoryById:::", error);
  }
};

onMounted(async () => {
  if (params?.categoryId) {
    categorySelected.value = await getCategoryById(params.categoryId);
  }

  if (params?.parentId) {
    parentSelected.value = await getCategoryById(params.parentId);
  }
});
</script>

<template>
  <v-row>
    <v-col>
      <h1 class="text-center text-2xl font-bold my-10">
        {{ isModeUpdate ? "Cập nhật" : "Thêm" }} danh mục
        {{ isModeAddChildren ? " con" : "" }}
      </h1>

      <form-category-add-edit
        v-if="isModeUpdate"
        :selected="categorySelected ? categorySelected : {}"
      />
      <form-category-add-edit
        v-else-if="parentSelected"
        :parent="parentSelected"
      />
      <form-category-add-edit v-else />
    </v-col>
  </v-row>
</template>
