import instance from "./axios";

const nameModel = "/auth";

const authApi = {
  signUp: async (data) => {
    return await instance.post(nameModel + "/sign-up", data);
  },
  signIn: async (data) => {
    return await instance.post(nameModel + "/sign-in", data);
  },
  getCurrentUser: async (accessToken) => {
    return await instance.get(nameModel + "/sign-in", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  },
  signOut: async () => {
    return await instance.post(nameModel + "/sign-out");
  },
  forgotPassword: async (data) => {
    return await instance.post(nameModel + "/forgot-password", data);
  },
  changePassword: async ({ data, email, token }) => {
    const url = `${nameModel}/forgot-password/${email}?token=${token}`;
    return await instance.post(url, data);
  },
  refreshToken: async () => {
    return await instance.get(nameModel + "/refresh-token");
  },
  verifyAccount: async ({ email, token }) => {
    return await instance.get(nameModel + `/verify/${email}?token=${token}`);
  },
  resendEmail: async (data) => {
    return await instance.post(nameModel + `/resend-verify-account`, data);
  },
};

export default authApi;
