import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StateService } from '../providers/state.service';

declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild('search_address') search_address: ElementRef;
  @ViewChild('map_canvas') mapElement: ElementRef;

  map: any;
  loading: any;
  apiKey = 'API_KEY';

  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  location: any;

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private zone: NgZone,
    private geolocation: Geolocation,
    private state: StateService) {
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  loadMap() {
    if (!this.state.selectedPlace) {
      var latLng = new google.maps.LatLng(43.6532, -79.3832);
    }
    else {
      var latLng = this.state.selectedPlace.latLng;
    }

    this.map = new google.maps.Map(
      document.getElementById('map_canvas'), { center: latLng, zoom: 15 });

    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.dropMarkers();
  }

  dropMarkers() {
    for (var i = 0; i < this.state.places.length; i++) {
      this.addMarker(this.state.places[i].latLng);
    }
  }

  addMarker(latLng) {
    new google.maps.Marker({
      position: latLng,
      map: this.map,
      animation: google.maps.Animation.DROP
    });
  }

  searchPlace() {
    if (this.query.length > 0 && !this.searchDisabled) {

      let config = {
        types: ['geocode'],
        input: this.query
      }

      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.places = [];
          predictions.forEach((prediction) => {
            this.places.push(prediction);
          });
        }
      });
    } else {
      this.places = [];
    }
  }

  selectPlace(place) {
    this.places = [];
    let location = {
      lat: null,
      lng: null,
      name: place.name
    };

    this.placesService.getDetails({ placeId: place.place_id }, (details) => {

      this.zone.run(() => {
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();
        this.map.setCenter({ lat: location.lat, lng: location.lng });
        place.latLng = { lat: location.lat, lng: location.lng };
        this.state.places.push(place);

        this.addMarker({ lat: location.lat, lng: location.lng });
      });
    });
  }
}
