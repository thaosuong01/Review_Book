import instance from "./axios";

const nameModel = "/post";

const postApi = {
  create: async (data) => {
    return await instance.post(nameModel, data);
  },
  getAll: async (filters = {}) => {
    return await instance.get(nameModel, {
      params: filters,
    });
  },
  getById: async (id) => {
    return await instance.get(`${nameModel}/${id}`);
  },
  getBySlug: async (slug) => {
    return await instance.get(`${nameModel}/slug/${slug}`);
  },
  getByUserId: async (userId) => {
    return await instance.get(`${nameModel}/user/${userId}`);
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

export default postApi;
