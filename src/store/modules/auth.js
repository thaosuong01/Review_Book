import authApi from "@/api/authApi";

const state = () => ({
  accessToken: localStorage.getItem("accessToken") || "",
  user: {},
});

const mutations = {
  setAccessToken: (state, accessToken) => {
    state.accessToken = accessToken;
  },
  setUser: (state, user) => {
    state.user = user;
  },
};

const actions = {
  saveAccessToken: ({ commit }, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    commit("setAccessToken", accessToken);
  },

  saveUser: ({ commit }, user) => {
    commit("setUser", user);
  },

  getCurrentUserLogin: ({ commit, state }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (state.accessToken) {
          const response = await authApi.getCurrentUser(state.accessToken);

          if (response.elements) {
            commit("setUser", response.elements);
            resolve();
          }
        }
      } catch (error) {
        console.log("error getCurrentUserLogin:::", error);
        reject(error);
      }
    });
  },

  remove: ({ commit }) => {
    localStorage.removeItem("accessToken");
    commit("setUser", {});
    commit("setAccessToken", "");
  },
};

const getters = {
  isLoggedIn: (state) => {
    return state.accessToken !== "" ? true : false;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
