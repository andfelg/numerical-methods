import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-back-button',
  imports: [],
  templateUrl: './back-button.html',
})
export class BackButton {
  constructor(
    private _location: Location,
  ){}

  getBack(){
    this._location.back();
  }
}
