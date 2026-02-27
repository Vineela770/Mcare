const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/userController");

router.get("/", userController.getUsers);
router.get("/role/:role", userController.getUsersByRole);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;