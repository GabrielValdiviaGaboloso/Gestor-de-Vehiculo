import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-Mapa',
  templateUrl: './Mapa.component.html',
  styleUrls: ['./Mapa.component.css']
})
export class MapaComponent implements OnInit {
  map!: Map;

  constructor() { }

  ngOnInit(): void {
    // Crear la capa base
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // Crear una capa de vectores para el punto
    const vectorLayer = new VectorLayer({
      source: new VectorSource()
    });

    // Crear un punto en la ubicación de Santiago, Chile, y añadirlo a la capa de vectores
    const pointFeature = new Feature({
      geometry: new Point(fromLonLat([-70.6483, -33.4569])) // Longitud, Latitud en formato [lon, lat]
    });

    // Estilo para el punto
    pointFeature.setStyle(new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/5817/5817087.png', // URL del icono
        scale: 0.1, // Escala del icono (ajustar según sea necesario)
        anchor: [0.5, 1] // Ancla del icono (opcional, centra el icono en la posición del punto)
      })
    }));

    // Asegurarse de que la capa de vectores tenga una fuente y añadir el punto
    const vectorSource = vectorLayer.getSource();
    if (vectorSource) {
      vectorSource.addFeature(pointFeature);
    }

    // Inicializar el mapa
    this.map = new Map({
      target: 'map',
      layers: [baseLayer, vectorLayer],
      view: new View({
        center: fromLonLat([-70.6483, -33.4569]), // Centrar en Santiago, Chile
        zoom: 12 // Ajustar el zoom para que la vista sea adecuada para Santiago
      })
    });
  }
}
