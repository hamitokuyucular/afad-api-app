import { fetchEqData } from "./api.js";
import { getFilters } from "./filters.js";

export async function maxEqFunction() {
    const filters = getFilters();
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
}