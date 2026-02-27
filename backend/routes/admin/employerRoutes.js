const express = require("express");
const router = express.Router();
const employerController = require("../../controllers/admin/employerController");

router.get("/", employerController.getEmployers);
router.get("/:id", employerController.getEmployerById);
router.post("/", employerController.addEmployer);
router.put("/:id", employerController.updateEmployer);
router.delete("/:id", employerController.deleteEmployer);

module.exports = router;