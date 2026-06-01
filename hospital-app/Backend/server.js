const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection - CHANGE "password" TO YOUR MYSQL PASSWORD
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // <--- CHANGE THIS
  database: "hospital",
});

// Test Connection
db.connect((err) => {
  if (err) console.log("MySQL Error: " + err.message);
  else console.log("Connected to MySQL!");
});

// GET Patients
app.get("/api/patients", (req, res) => {
  const q = "SELECT * FROM patients";
  db.query(q, (err, data) => {
    if (err) {
      console.log("GET Error: " + err.message);
      return res.status(500).json(err);
    }
    res.json(data);
  });
});

// POST (Add) Patient
app.post("/api/patients", (req, res) => {
  console.log("Received:", req.body);

  const q = "INSERT INTO patients (name, age, disease) VALUES (?, ?, ?)";
  const values = [req.body.name, req.body.age, req.body.disease];

  db.query(q, values, (err, data) => {
    if (err) {
      console.log("POST Error: " + err.message);
      return res.status(500).json(err);
    }
    console.log("✅ Patient added!");
    res.json(data);
  });
});

// DELETE Patient
app.delete("/api/patients/:id", (req, res) => {
  const q = "DELETE FROM patients WHERE id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
