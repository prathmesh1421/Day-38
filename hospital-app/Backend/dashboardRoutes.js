const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/db");

router.get("/stats", async (req, res) => {
  try {
    const Patient = sequelize.models.Patient;
    const Doctor = sequelize.models.Doctor;
    const Appointment = sequelize.models.Appointment;

    const totalPatients = await Patient.count({ where: { status: "active" } });
    const totalDoctors = await Doctor.count({ where: { status: "active" } });
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = await Appointment.count({
      where: { appointmentDate: today },
    });

    res.json({ totalPatients, totalDoctors, todayAppointments });
  } catch (err) {
    console.log(err);
    res.json({ totalPatients: 0, totalDoctors: 0, todayAppointments: 0 });
  }
});

module.exports = router;
