export async function fetchEqData(filters) {
    const res = await fetch("/api/deprem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    });
    const data = await res.json();
    return {
        type: "FeatureCollection",
        features: data.map(p => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [p.longitude, p.latitude]
            },
            properties: {
                country: p.country,
                location: p.location,
                province: p.province,
                district: p.district,
                magnitude: p.magnitude,
                depth: p.depth,
                date: p.date
            }
        }))
    }
}