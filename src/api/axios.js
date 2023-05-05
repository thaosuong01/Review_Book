import axios from "axios";
import authApi from "./authApi";

const instance = axios.create({
  baseURL: process.env.VUE_APP_ENDPOINT_URL + "/api/v1/",
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    /**
     * * Sau khi gọi refresh token thì lần sau gọi lại get user
     * * thì nó sẽ set lại header request lên server
     */
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    const config = error.config;
    const response = error?.response;

    /**
     * * Kiểm tra nếu nó bằng đường dẫn "/auth/refresh-token" thì sẽ return error
     * * Nếu không sẽ bị lập vô tận
     */
    if (
      response &&
      response.status === 401 &&
      config.url === "/auth/refresh-token"
    ) {
      return Promise.reject(error);
    }

    // * Kiểm tra accessToken hết hạn thì sẽ gọi "/auth/refresh-token" để cung cấp lại accessToken
    if (
      response &&
      response.status === 401 &&
      response.data.errors &&
      response.data.errors.message === "jwt expired"
    ) {
      const res = await authApi.refreshToken();

      if (res.elements) {
        /**
         * * Sau khi gọi refresh token thì chúng ta sẽ có accessToken mới
         * * và set vào localStorage sau đó set lại headers cho axios
         */
        localStorage.setItem("accessToken", res.elements.accessToken);

        instance.defaults.headers.common["Authorization"] =
          "Bearer " + res.elements.accessToken;

        return instance(config);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
