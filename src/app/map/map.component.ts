import { Component, OnInit, ChangeDetectorRef , Input ,SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/milan008/ck6nmqjl627vc1it4g23duzzq';
  lat = 37.75;
  lng = -122.41;

  constructor() { }
  ngOnInit() {
    
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoibWlsYW4wMDgiLCJhIjoiY2s2bmxvMTJwMGJpdDNtcWJnczNjZHB5NCJ9.6aCPEDk3WL9UkbWaNe6J7w'
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 1.5
        // center: [this.lng, this.lat]
    });
  }

  childFun(locations){
    let bounds = new mapboxgl.LngLatBounds();
    console.log(locations)
    locations.forEach(loc => {
      // Create marker
      const el = document.createElement('div');
      el.className = 'marker';
  
      // Add marker
      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(loc.coordinates)
        .addTo(this.map);
  
      // Add popup
      new mapboxgl.Popup({
        offset: 30
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(this.map);
  
      // Extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });
    this.map.fitBounds(bounds);
  }
  
}