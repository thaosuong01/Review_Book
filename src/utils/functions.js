import uploadApi from "@/api/uploadApi";

export function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function emptyObject(obj) {
  if (!obj || obj === undefined) return false;

  return Object.keys(obj).length === 0;
}

export function uploadImage(loader) {
  return {
    upload: () => {
      return new Promise(async (resolve, reject) => {
        loader.file.then(async (file) => {
          try {
            if (!file) return;

            // * Call API upload image to server.
            const response = await uploadApi.image(file);

            if (response) {
              const urlImage = `${process.env.VUE_APP_ENDPOINT_URL}/${response?.filename}`;

              // * result { default: urlImage }
              resolve({ default: urlImage });
            }
          } catch (error) {
            reject(error);
          }
        });
      });
    },
  };
}
