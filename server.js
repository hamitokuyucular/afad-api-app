const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Kullanıcıdan gelen filtreleri AFAD API'ye ileten endpoint
app.post("/api/deprem", async (req, res) => {
  try {
    const filters = req.body;

    // Temel AFAD endpoint
    const baseURL = "https://deprem.afad.gov.tr/apiv2/event/filter";

    // Filtreleri query string haline getir
    const params = new URLSearchParams(filters).toString();

    // İstek at
    const response = await axios.get(`${baseURL}?${params}&format=json`);

    res.json(response.data);
  } catch (error) {
    console.error("AFAD API hatası:", error.message);
    res.status(500).json({ error: "AFAD verisi alınamadı" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server ${PORT} portunda çalışıyor.`)
);
