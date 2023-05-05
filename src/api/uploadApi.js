import instance from "./axios";

const uploadApi = {
  image: async (files) => {
    console.log(files);
    const data = new FormData();
    data.append("files", files);
    return await instance.post("/upload/image", data);
  },
};

export default uploadApi;
