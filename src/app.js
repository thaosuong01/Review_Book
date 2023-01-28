const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const errorHandleMiddleware = require("./v1/middlewares/error_handle_middleware");
const initialRouter = require("./v1/routes");
const cookieParser = require("cookie-parser");
const { OPTION_CORS } = require("./v1/utils/option_cors");

// init db mongo
require("./v1/databases/init.mongodb");

app.use(helmet());
app.use(morgan("combined"));
app.use(cors(OPTION_CORS));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// * router
initialRouter(app);

// * error
errorHandleMiddleware(app);

module.exports = app;
