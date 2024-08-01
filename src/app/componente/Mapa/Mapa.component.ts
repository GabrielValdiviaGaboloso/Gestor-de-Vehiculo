import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-Mapa',
  templateUrl: './Mapa.component.html',
  styleUrls: ['./Mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit, OnDestroy {
  private map?: Map;
  private modalOpenSubscription?: Subscription;

  constructor() { }

  ngOnInit(): void {
    // Inicialización que no depende del DOM
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('exampleModal');

    if (modalElement) {
      this.modalOpenSubscription = fromEvent(modalElement, 'shown.bs.modal')
        .subscribe(() => this.refreshMap());
    } else {
      console.warn('Element with id "exampleModal" not found.');
    }
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción cuando el componente se destruya
    if (this.modalOpenSubscription) {
      this.modalOpenSubscription.unsubscribe();
    }
    // Limpiar el mapa si existe
    this.cleanupMap();
  }

  // Método para refrescar el mapa
  private refreshMap(): void {
    
    // Limpiar el mapa si existe
    this.cleanupMap();

    // Crear la capa base
    const baseLayer = new TileLayer({
      source: new OSM()
    });
    
    // Crear una capa de vectores para el punto
    const vectorLayer = new VectorLayer({
      source: new VectorSource()
    });

    // Generar coordenadas aleatorias alrededor de Santiago
    const [randomLon, randomLat] = this.generateRandomCoordinates(-70.6483, -33.4569, 0.1); // Ajusta el rango según tus necesidades

    // Crear un punto con coordenadas aleatorias
    const pointFeature = new Feature({
      geometry: new Point(fromLonLat([randomLon, randomLat])) // Longitud, Latitud en formato [lon, lat]
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
      target: 'map', // El contenedor del mapa
      layers: [baseLayer, vectorLayer],
      view: new View({
        center: fromLonLat([randomLon, randomLat]), // Centrar en la ubicación aleatoria
        zoom: 12 // Ajustar el zoom para que la vista sea adecuada
      })
    });
  }

  // Función para limpiar el mapa y su contenedor
  private cleanupMap(): void {
    if (this.map) {
      // Eliminar el mapa del DOM
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.innerHTML = ''; // Limpiar el contenedor del mapa
      }
      this.map = undefined; // Eliminar la instancia del mapa
    }
  }

  // Función para generar coordenadas aleatorias alrededor de una ubicación central
  generateRandomCoordinates(centerLon: number, centerLat: number, range: number): [number, number] {
    const randomLon = centerLon + (Math.random() - 0.5) * range * 2;
    const randomLat = centerLat + (Math.random() - 0.5) * range * 2;
    return [randomLon, randomLat];
  }
}
