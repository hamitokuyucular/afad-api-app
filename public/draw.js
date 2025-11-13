import { map } from './map.js';

let draw;
let drawSource = new ol.source.Vector();
let drawLayer = new ol.layer.Vector({
    source: drawSource,
});

map.addLayer(drawLayer);

export function startDrawing() {
    // Eski çizim varsa kaldır
    drawSource.clear();
    if (draw) map.removeInteraction(draw);

    // Harita sürükleme (pan) etkileşimini devre dışı bırak
    const dragPan = map.getInteractions().getArray().find(i => i instanceof ol.interaction.DragPan);
    if (dragPan) dragPan.setActive(false);

    // Interaction oluştur
    draw = new ol.interaction.Draw({
        source: drawSource,
        type: 'Circle', // Rectangle için "Circle" + geometryFunction kullanılır
        geometryFunction: ol.interaction.Draw.createBox()
    });

    map.addInteraction(draw);

    draw.on('drawend', function (event) {
        // Yeni dikdörtgen geometrisi
        const geom = event.feature.getGeometry();
        const extent = geom.getExtent(); // [minX, minY, maxX, maxY]
        const [minX, minY, maxX, maxY] = extent;

        // EPSG:3857 -> EPSG:4326 dönüşümü
        const min = ol.proj.toLonLat([minX, minY]);
        const max = ol.proj.toLonLat([maxX, maxY]);

        const [minlon, minlat] = min;
        const [maxlon, maxlat] = max;

        // Input alanlarını doldur
        document.getElementById('minlat').value = minlat.toFixed(3);
        document.getElementById('maxlat').value = maxlat.toFixed(3);
        document.getElementById('minlon').value = minlon.toFixed(3);
        document.getElementById('maxlon').value = maxlon.toFixed(3);

        // Çizim tamamlandıktan sonra etkileşimi kaldır
        map.removeInteraction(draw);

        // Harita pan etkileşimini geri aç
        if (dragPan) dragPan.setActive(true);
    });
}
