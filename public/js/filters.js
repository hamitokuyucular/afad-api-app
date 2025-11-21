export function getFilters() {
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
    return filters;
}