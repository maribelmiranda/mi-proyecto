import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import escuelas from "./escuelas.js";

const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {  
      // capa base OpenStreetMap
      'osm': {
        type: 'raster',
        tiles: [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        ],
        tileSize: 256,   
      }     
    },         
    layers: [ 
      // Agrega el mapa base
      {
        id: 'osm-base',
        type: 'raster',
        source: 'osm'
      }
    ]
  },
  center: [-99.1332, 19.4326],   // Ciudad de México
  zoom: 9,
  // quita la configuración de atribución por default
  attributionControl: false
});

// Añade control de navegación
map.addControl(new maplibregl.NavigationControl(), 'top-left');

// Crea marcadores
map.on("load", () => {
 
  map.addSource("escuelasunam", {
    type: "geojson",
    data: escuelas
  });

  map.addLayer({
    id: "escuelasunam-layer",
    type: "circle",
    source: "escuelasunam",
    paint: {
      "circle-radius": 7, 
      "circle-color": "#8856a7", 
      "circle-stroke-color": "#efedf5", 
      "circle-stroke-width": 2
    }
  });
});

// Añade popup
map.on("click", "escuelasunam-layer", (e) => {
  const feature = e.features[0];
  const {Nombre, Nivel, Poblacion} = feature.properties;

  new maplibregl.Popup()
    .setLngLat(feature.geometry.coordinates)
    .setHTML(`
      <strong>${Nombre}</strong><br>
      Nivel: ${Nivel}<br>
      Estudiantes: ${Poblacion}
      `).addTo(map);
});

map.on("mouseenter", "escuelasunam-layer", () => { 
  map.getCanvas().style.cursor = "pointer"; 
}); 

map.on("mouseleave", "escuelasunam-layer", () => {
  map.getCanvas().style.cursor = "";
});


// agrega el control de pantalla completa
map.addControl(
  new maplibregl.FullscreenControl(), 
  'top-left'
);

// agrega una escala al mapa
map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 100,
    unit: 'metric'   // imperial o nautical
  }), 'bottom-left'
);

// agrega control de geolocalización
map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true
  }),
  'top-left'
);

// configuración del control de atribución
map.addControl(
  new maplibregl.AttributionControl({
    compact: true,
    customAttribution: [
      '© Mi ejemplo MME',
    ]
  })
);



