const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
    .connect(process.env.MONGO_URI)
    .then(_ => console.log('connect database '))
    .catch((error) => console.log("Error connect:::", error));

mongoose.set("debug", true);
mongoose.set("debug", { color: false });
mongoose.set("debug", { shell: true });

module.exports = mongoose;