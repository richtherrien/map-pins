import { Component, OnInit } from '@angular/core';
import { StateService } from '../providers/state.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage {

  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(private navCtrl: NavController, private state: StateService) {
  }

  openMap(place) {
    this.state.selectedPlace = place;
    this.navCtrl.navigateRoot('/home');
  }

  deletePlace(place) {
    this.state.places.forEach((item, index) => {
      if (item === place) this.state.places.splice(index, 1);
    });
  }
}
