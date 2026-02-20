const express = require("express");
const router = express.Router();
const employerController = require("../controllers/employerController");

router.get("/", employerController.getEmployers);
router.post("/", employerController.addEmployer);
router.put("/:id", employerController.updateEmployer);
router.delete("/:id", employerController.deleteEmployer);

module.exports = router;
