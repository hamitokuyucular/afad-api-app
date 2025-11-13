import { fetchEqData } from './index.js';
import { updateMap } from './map.js';
import { startDrawing } from './draw.js';

document.getElementById("drawBoxBtn").addEventListener("click", () => {
    startDrawing();
});

document.getElementById("fetchBtn").addEventListener("click", async () => {
    const filters = {
        minlat: document.getElementById("minlat").value || undefined,
        maxlat: document.getElementById("maxlat").value || undefined,
        minlon: document.getElementById("minlon").value || undefined,
        maxlon: document.getElementById("maxlon").value || undefined,
        mindepth: document.getElementById("mindepth").value || undefined,
        maxdepth: document.getElementById("maxdepth").value || undefined,
        start: document.getElementById("start").value || undefined,
        end: document.getElementById("end").value || undefined,
        minmag: document.getElementById("minmag").value || undefined,
        maxmag: document.getElementById("maxmag").value || undefined,
        limit: document.getElementById("limit").value || undefined,
    };

    document.getElementById("output").textContent = "Yükleniyor...";

    try {
        const geojson = await fetchEqData(filters);
        document.getElementById("output").textContent = `Veriler alındı.`;
        document.getElementById("eqCount").textContent = `${geojson.features.length}`;

        const maxEq = geojson.features.reduce((acc, curr) => {
            return curr.properties.magnitude > acc.properties.magnitude ? curr : acc;
        });
        const props = maxEq.properties;

        document.getElementById("maxEq").textContent = `${props.location}`;
        document.getElementById("maxEqDate").textContent = `${props.date}`;
        document.getElementById("maxEqMag").textContent = `${props.magnitude}`;
        document.getElementById("maxEqDep").textContent = `${props.depth}`;

        console.log(geojson.features)

        updateMap(geojson);
    } catch (err) {
        document.getElementById("output").textContent = "Veri alınamadı: " + err.message;
    }
});
