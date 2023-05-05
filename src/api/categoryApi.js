import instance from "./axios";

const nameModel = "/category";

const categoryApi = {
  create: async (data) => {
    return await instance.post(nameModel, data);
  },
  getAll: async (filters = {}) => {
    return await instance.get(nameModel, {
      params: filters,
    });
  },
  getAllWithChildren: async () => {
    return await instance.get(nameModel + "/children");
  },
  getChildrenByParentId: async (parentId) => {
    return await instance.get(`${nameModel}/parent/${parentId}`);
  },
  getById: async (id) => {
    return await instance.get(`${nameModel}/${id}`);
  },
  getBySlug: async (slug) => {
    return await instance.get(`${nameModel}/slug/${slug}`);
  },
  update: async ({ id, data }) => {
    return await instance.patch(`${nameModel}/${id}`, data);
  },
  delete: async ({ id, isDelete = false }) => {
    return await instance.delete(`${nameModel}/${id}?is_delete=${isDelete}`);
  },
  deleteForce: async (id) => {
    return await instance.delete(`${nameModel}/force/${id}`);
  },
};

export default categoryApi;
