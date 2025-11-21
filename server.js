import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import config from "config";
import { fileURLToPath, URLSearchParams } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post("/api/deprem", async (req, res) => {
    try {
        const baseURL = config.get('afad.baseURL');
        const params = new URLSearchParams(req.body).toString()
        const response = await axios.get(`${baseURL}?${params}&format=json`)
        res.json(response.data)
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({error: "AFAD verisi alinmadi!"})
    }
})

const PORT = config.get('server.port')
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor..`)
});
