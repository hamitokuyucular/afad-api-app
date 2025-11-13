export async function fetchEqData(filters) {

    const res = await fetch("/api/deprem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
    });
    const data = await res.json();

    return {
        type: "FeatureCollection",
        features: data.map(event => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [event.longitude, event.latitude]
            },
            properties: {
                country: event.country,
                location: event.location,
                province: event.province,
                district: event.district,
                magnitude: event.magnitude,
                depth: event.depth,
                date: event.date
            }
        }))
    };
}
