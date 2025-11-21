// --- CLUSTER LAYER EKLE ---
function getMagColor(mag) {
    return mag >= 8 ? '#7B1FA2' :
        mag >= 7 ? '#D32F2F' :
            mag >= 6 ? '#FF5722' :
                mag >= 5 ? '#FF9800' :
                    mag >= 4 ? '#FFEB3B' :
                        mag >= 3 ? '#8BC34A' :
                            '#4CAF50';
}
let clusterSource;
let clusterLayer;
function clusterStyle(feature) {
    const features = feature.get('features');
    const size = features.length;
    // Cluster içindeki maksimum magnitüdü bul
    let maxMag = 0;
    features.forEach(f => {
        const mag = f.get('magnitude');
        if (mag > maxMag) maxMag = mag;
    });
    // Aynı renk skalası
    const color = getMagColor(maxMag);
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 12 + (size * 0.6), // cluster büyüklüğü
            fill: new ol.style.Fill({ color }),
            stroke: new ol.style.Stroke({
                color: '#333',
                width: 1
            })
        }),
        text: new ol.style.Text({
            text: size.toString(),  // kaç deprem var
            fill: new ol.style.Fill({ color: '#fff' }),
            stroke: new ol.style.Stroke({
                color: '#000',
                width: 3
            })
        })
    });
}
function createClusterLayer(src) {
    clusterSource = new ol.source.Cluster({
        distance: 100,
        source: src
    });
    clusterLayer = new ol.layer.Vector({
        title: "Deprem Cluster",
        visible: false,
        source: clusterSource,
        style: clusterStyle
    });
    map.addLayer(clusterLayer);
}
createClusterLayer(source);