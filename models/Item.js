const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
    {
        itemName: { type: String },
        grossWeight: { type: Number },
        netGoldWeight: { type: Number },
        goldRate: { type: Number },
        roundDiamondWeight: { type: Number },
        roundDiamondRate: { type: Number },
        polkiDiamondWeight: { type: Number },
        polkiDiamondRate: { type: Number },
        stoneWeight: { type: Number },
        stoneType: { type: String },
        category: { type: String },
        stoneRate: { type: Number },
        laborCharge: { type: Number },
        totalRate: { type: Number },
        image: { type: String },
        video: { type: String },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Item", itemSchema)
