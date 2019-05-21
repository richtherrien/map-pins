import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // contains the location latLng and description of saved markers
  places = [];

  selectedPlace;
}
