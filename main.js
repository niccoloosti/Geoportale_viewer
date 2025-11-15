console.log('main.js caricato');

// 1. Crea la mappa base centrata sull'Italia
const map = L.map('map').setView([42.5, 12.5], 6);

// 2. Basi cartografiche (tile server affidabili, NON WMS)

// OSM standard
const baseOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
});

// OpenTopoMap
const baseTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: '&copy; OpenTopoMap (CC-BY-SA)'
});

// Configurazione basi
const baseLayersConfig = [
  { id: 'osm',  name: 'Mappa base OSM', layer: baseOSM, default: true },
  { id: 'topo', name: 'OpenTopoMap',    layer: baseTopo, default: false }
];

// 3. Overlay / WMS (struttura pronta, alcuni demo funzionano solo da web, non da file://)

const overlayLayersConfig = [
  {
    id: 'natura2000_italia',
    name: 'Rete Natura 2000 – Italia (WMS ISPRA, può non rendere da file://)',
    type: 'wms',
    url: 'https://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_vn2000.map',
    layerName: 'reti_natura2000',
    opacity: 0.7
  },
  {
    id: 'demo_states',
    name: 'Demo Stati USA (topp:states – GeoServer demo)',
    type: 'wms',
    url: 'https://demo.geo-solutions.it/geoserver/wms',
    layerName: 'topp:states',
    opacity: 0.7
  }
];

// 4. Inizializza basi sulla mappa e pannello

const baseContainer = document.getElementById('base-layers');
const overlayContainer = document.getElementById('overlay-layers');

// solo una base attiva alla volta
let currentBaseId = null;

baseLayersConfig.forEach(cfg => {
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = 'base-layer';
  radio.value = cfg.id;

  if (cfg.default || currentBaseId === null) {
    radio.checked = true;
    cfg.layer.addTo(map);
    currentBaseId = cfg.id;
  }

  radio.onchange = () => {
    if (radio.checked && cfg.id !== currentBaseId) {
      // rimuovi base attuale
      const current = baseLayersConfig.find(b => b.id === currentBaseId);
      if (current) {
        map.removeLayer(current.layer);
      }
      // aggiungi nuova base
      cfg.layer.addTo(map);
      currentBaseId = cfg.id;
      console.log('Base layer attivo:', cfg.id);
    }
  };

  const label = document.createElement('label');
  label.appendChild(radio);
  label.appendChild(document.createTextNode(' ' + cfg.name));
  baseContainer.appendChild(label);
  baseContainer.appendChild(document.createElement('br'));
});

// 5. Inizializza overlay (WMS come tileLayer.wms)

const overlayLayers = {};

overlayLayersConfig.forEach(cfg => {
  let layerObj = null;

  if (cfg.type === 'wms') {
    layerObj = L.tileLayer.wms(cfg.url, {
      layers: cfg.layerName,
      format: 'image/png',
      transparent: true,
      opacity: cfg.opacity ?? 0.7
    });

    layerObj.on('tileerror', function (e) {
      console.error('Errore WMS per layer', cfg.id, e);
    });
  }

  if (!layerObj) return;
  overlayLayers[cfg.id] = layerObj;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  checkbox.onchange = () => {
    const checked = checkbox.checked;
    console.log('Toggle overlay', cfg.id, 'checked=', checked);

    if (checked) {
      layerObj.addTo(map);

      if (cfg.id === 'demo_states') {
        // il demo USA è dall'altra parte del mondo
        map.setView([40, -100], 4);
      }
    } else {
      map.removeLayer(layerObj);
      if (cfg.id === 'demo_states') {
        map.setView([42.5, 12.5], 6);
      }
    }
  };

  const label = document.createElement('label');
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(' ' + cfg.name));
  overlayContainer.appendChild(label);
  overlayContainer.appendChild(document.createElement('br'));
});

console.log('configurazione completata');
