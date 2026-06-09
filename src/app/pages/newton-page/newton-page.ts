import { Component } from '@angular/core';
import { BackButton } from '../../components/back-button/back-button';
import { Loadindicator } from '../../components/loadindicator/loadindicator';
import { FormsModule } from '@angular/forms';

export interface FormValues {
  func: string;
  interA: number | null;
  interB: number | null;
  maxIterations: number | null;
  tolerance: number | null;
}

@Component({
  selector: 'app-newton-page',
  imports: [BackButton, Loadindicator, FormsModule],
  templateUrl: './newton-page.html',
})
export class NewtonPage {
  isWaiting: boolean = true;

  formValues: FormValues = {
      func: '',
      interA: null,
      interB: null,
      maxIterations: null,
      tolerance: null
    };

  iniciarMetodo(){

  }

  siguiente(){

  }

  anterior(){

  }

  limpiarFormulario(){}
}
