module.exports.OPTION_CORS = {
  origin: process.env.URL_CLIENT,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
};

module.exports.optionsCompression = (compression) => {
  return {
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }

      return compression.filter(req, res);
    },
  };
};