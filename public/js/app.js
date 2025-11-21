import { getFilters } from "./filters.js";
import { fetchEqData } from "./api.js";
import { initMap,  updateMap, enableDrawRect } from "./map.js";
import { maxEqFunction } from "./statistic.js";

initMap();

document.getElementById("fetchBtn").addEventListener("click", async () => {
    const filters = getFilters();
    const data = await fetchEqData(filters);
    updateMap(data);
    maxEqFunction();
});

document.getElementById("drawBoxBtn").addEventListener("click", () => {
    enableDrawRect();
});