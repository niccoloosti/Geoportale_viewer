// ========================
// MAPPA BASE
// ========================
const map = L.map("map").setView([42.0, 12.5], 6);

const base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
});
base.addTo(map);

// ========================
// DEMO USA (poligoni vector)
// ========================
const usaGeojsonUrl =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

let layerUSA = null;

fetch(usaGeojsonUrl)
  .then((r) => r.json())
  .then((geojson) => {
    layerUSA = L.geoJSON(geojson, {
      style: { color: "red", weight: 1, fillOpacity: 0.1 }
    });
  });

document
  .getElementById("toggleUSA")
  .addEventListener("change", function (e) {
    if (e.target.checked) {
      if (layerUSA) map.addLayer(layerUSA);
    } else {
      if (layerUSA) map.removeLayer(layerUSA);
    }
  });

// ========================
// DEMO RASTER
// ========================
const layerRaster = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  { maxZoom: 17 }
);

document
  .getElementById("toggleRaster")
  .addEventListener("change", function (e) {
    if (e.target.checked) {
      map.addLayer(layerRaster);
    } else {
      map.removeLayer(layerRaster);
    }
  });

// ========================
// NATURA 2000 WMS (place-holder)
// ========================
const layerNatura2000 = L.tileLayer.wms(
  "https://demo.boundlessgeo.com/geoserver/ows?",
  {
    layers: "ne:ne",
    format: "image/png",
    transparent: true
  }
);

document
  .getElementById("toggleNatura2000")
  .addEventListener("change", function (e) {
    if (e.target.checked) {
      map.addLayer(layerNatura2000);
    } else {
      map.removeLayer(layerNatura2000);
    }
  });

// ========================
// IBA – Important Bird Areas
// ========================
const layerIBA = L.tileLayer.wms(
  "http://wms.pcn.minambiente.it/ogc?",
  {
    layers: "IBA",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    crs: L.CRS.EPSG3857
  }
);

document
  .getElementById("toggleIBA")
  .addEventListener("change", function (e) {
    if (e.target.checked) {
      map.addLayer(layerIBA);
    } else {
      map.removeLayer(layerIBA);
    }
  });
