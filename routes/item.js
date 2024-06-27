const express = require("express")
const router = express.Router()

const {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem
} = require("../controllers/Item")

router.post("/items", createItem)
router.get("/items", getItems)
router.get("/items/:id", getItemById)
router.patch("/items/:id", updateItem)
router.delete("/items/:id", deleteItem)

module.exports = router
