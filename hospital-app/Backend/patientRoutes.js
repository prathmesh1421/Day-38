const express = require("express");
const router = express.Router();

const {
  getPatients,
  getPatientById,
  addPatient,
  deletePatient,
} = require("../controller/patientController");

router.get("/patients", getPatients);
router.get("/patients/:id", getPatientById);
router.post("/patients", addPatient);
router.delete("/patients/:id", deletePatient);

module.exports = router;
