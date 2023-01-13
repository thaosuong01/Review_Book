const { Schema, model, Types: { ObjectId } } = require("mongoose");
const bcrypt = require("bcrypt");

const TokenSchema = new Schema(
    {
        user_id: {
            type: ObjectId,
            required: true,
            refs: "users",
        },
        token: {
            type: String,
            required: true,
        },
        expireAt: {
            type: Date,
            default: Date.now,
            index: { expires: 180000 },
        },
    },
    {
        collection: "tokens",
    }

);

TokenSchema.statics.hashToken = async (token) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(token, salt);
}

TokenSchema.statics.compareToken = async (tokendInput, hashToken) => {
    return await bcrypt.compare(tokendInput, hashToken);
}

module.exports._Token = model("tokens", TokenSchema);
