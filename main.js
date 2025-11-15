console.log("main.js caricato – build 1.2v_Geo");

// ========================
// MAPPA BASE OSM
// ========================
const map = L.map("map").setView([42.5, 12.5], 6);

const baseOSM = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }
);

// attivo di default
baseOSM.addTo(map);

// ========================
// OVERLAY: NATURA 2000 – ITALIA (PCN)
// ========================

const layerNatura2000 = L.tileLayer.wms(
  "https://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_vn2000.map",
  {
    layers: "reti_natura2000",
    format: "image/png",
    transparent: true,
    opacity: 0.7
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
// OVERLAY: IBA – Important Bird Areas (PCN)
// ========================

const layerIBA = L.tileLayer.wms(
  "https://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/IBA.map",
  {
    layers: "IBA",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    opacity: 0.7
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

console.log("configurazione layer completata – 1.2v_Geo");
