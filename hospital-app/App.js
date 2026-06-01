const BASE_URL = "http://192.168.1.5:5000/api/patients";

export const API = {
  getPatients: async () => {
    const res = await fetch(BASE_URL);
    return res.json();
  },

  createPatient: async (data) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deletePatient: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};

export default API;
