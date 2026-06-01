const db = require("../config/db");

// GET ALL PATIENTS
exports.getPatients = (req, res) => {
  db.query("SELECT * FROM patients ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET PATIENT BY ID
exports.getPatientById = (req, res) => {
  db.query(
    "SELECT * FROM patients WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    },
  );
};

// ADD PATIENT
exports.addPatient = (req, res) => {
  const { name, disease, age, image } = req.body;

  const sql =
    "INSERT INTO patients (name, disease, age, image) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, disease, age, image], (err, result) => {
    if (err) {
      console.log("❌ DB ERROR:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "✅ Patient Added Successfully",
      id: result.insertId,
    });
  });
};

// DELETE PATIENT
exports.deletePatient = (req, res) => {
  db.query("DELETE FROM patients WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "🗑️ Patient Deleted" });
  });
};
