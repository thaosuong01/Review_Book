import postApi from "@/api/postApi";
import moment from "moment/moment";

const state = () => ({
  posts: [],
  isLoading: false,
  error: "",
  filters: {
    page: 1,
    limit: 5,
    where: "",
  },
  pagination: {
    page: 1,
    limit: 5,
    totalRows: 5,
  },
});

const mutations = {
  FETCH_START: (state) => {
    state.isLoading = true;
  },
  FETCH_CREATE_OR_EDIT_SUCCESS: (state) => {
    state.isLoading = false;
  },
  FETCH_FAIL: (state, payload) => {
    state.isLoading = false;
    state.error = payload;
  },
  FETCH_ALL_SUCCESS: (state, payload) => {
    state.isLoading = false;
    state.posts = payload.elements;
    state.pagination = payload.meta.pagination;
    state.filters = {
      ...state.filters,
      limit: payload.meta.pagination.limit || 5,
    };
  },
  FETCH_ALL_HOME_SUCCESS: (state, payload) => {
    state.isLoading = false;
    const elements = payload.elements;
    state.posts.push(...elements);
    state.pagination = payload.meta.pagination;
    state.filters = {
      ...state.filters,
      limit: payload.meta.pagination.limit || 5,
    };
  },
  SET_FILTER: (state, payload) => {
    state.filters = {
      ...state.filters,
      ...payload,
    };
  },
  RESET_VALUE: (state) => {
    state.filters = {
      page: 1,
      limit: 5,
      where: "",
    };
    state.pagination = {
      page: 1,
      limit: 5,
      totalRows: 5,
    };
    state.posts = [];
  },
};

const actions = {
  fetchCreatePost: ({ commit, dispatch }, payload) => {
    return new Promise(async (resovle, reject) => {
      try {
        commit("FETCH_START");
        const response = await postApi.create(payload);

        if (response && response.elements) {
          const payload = {
            text: "Thêm bài viết thành công",
            color: "success",
            open: true,
            timeout: 2000,
          };
          dispatch("toast/startToast", payload, { root: true });
          commit("FETCH_CREATE_OR_EDIT_SUCCESS");
          resovle(true);
        }
      } catch (error) {
        let payload = {
          text: error.message,
          color: "error",
          open: true,
          timeout: 2000,
        };

        if (error.response) {
          payload = {
            ...payload,
            text: error.response.data.errors.message,
          };
          commit("FETCH_FAIL", error.response.data.errors.message);
        } else {
          commit("FETCH_FAIL", error.message);
        }

        dispatch("toast/startToast", payload, { root: true });

        reject(error);
      }
    });
  },
  fetchAllPost: async ({ commit, dispatch }, payload) => {
    try {
      commit("FETCH_START");
      commit("SET_FILTER", {
        page: payload.page,
        limit: payload.limit,
        where: payload.where,
      });

      const response = await postApi.getAll(payload);

      if (response && response.elements) {
        if (payload?.isHome) {
          commit("FETCH_ALL_HOME_SUCCESS", response);
        } else {
          commit("FETCH_ALL_SUCCESS", response);
        }
      }
    } catch (error) {
      if (!error.response) {
        const payload = {
          text: error.message,
          color: "error",
          open: true,
        };
        dispatch("toast/startToast", payload, { root: true });
        commit("FETCH_FAIL", error.message);
      }
    }
  },
  fetchDeletePost: async ({ commit, dispatch, state }, payload) => {
    try {
      commit("FETCH_START");

      const response = await postApi.delete(payload);

      if (response) {
        const payload = {
          text: "Xoá bài viết thành công",
          color: "success",
          open: true,
        };
        dispatch("toast/startToast", payload, { root: true });
        dispatch("fetchAllPost", { ...state.filters });
      }
    } catch (error) {
      if (!error.response) {
        const payload = {
          text: error.message,
          color: "error",
          open: true,
        };
        dispatch("toast/startToast", payload, { root: true });
        commit("FETCH_FAIL", error.message);
      }
    }
  },
  fetchUpdatePost: ({ commit, dispatch }, payload) => {
    return new Promise(async (resovle, reject) => {
      try {
        commit("FETCH_START");
        const response = await postApi.update(payload);

        if (response && response.elements) {
          const payload = {
            text: "Cập nhật bài viết thành công",
            color: "success",
            open: true,
            timeout: 2000,
          };
          dispatch("toast/startToast", payload, { root: true });
          commit("FETCH_CREATE_OR_EDIT_SUCCESS");
          resovle(true);
        }
      } catch (error) {
        let payload = {
          text: error.message,
          color: "error",
          open: true,
          timeout: 2000,
        };

        if (error.response) {
          payload = {
            ...payload,
            text: error.response.data.errors.message,
          };
          commit("FETCH_FAIL", error.response.data.errors.message);
        } else {
          commit("FETCH_FAIL", error.message);
        }

        dispatch("toast/startToast", payload, { root: true });

        reject(error);
      }
    });
  },
  changeFilter: ({ commit }, payload) => {
    commit("SET_FILTER", payload);
  },
  reset({ commit }) {
    commit("RESET_VALUE");
  },
};

const getters = {
  getPost: (state) => {
    if (state.posts.length > 0) {
      return state.posts.map((post) => ({
        ...post,
        createdAt: moment(post.createdAt).format("YYYY-MM-DD h:mm A"),
      }));
    }
    return [];
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
