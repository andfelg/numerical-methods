import { Component } from '@angular/core';
import { BackButton } from '../../components/back-button/back-button';
import { FormsModule } from '@angular/forms';
import { Loadindicator } from '../../components/loadindicator/loadindicator';

interface FormValues{
  func: string | null,
  interA: number | null,
  interB: number | null,
  maxIterations: number | null,
  tolerance: number | null
}

@Component({
  selector: 'app-biseccion-page',
  imports: [BackButton, FormsModule, Loadindicator],
  templateUrl: './biseccion-page.html',
})
export class BiseccionPage {

  isWaiting: boolean = true;

  formValues: FormValues = {
    func: '',
    interA: null,
    interB: null,
    maxIterations: null,
    tolerance: null
  };
  
  iniciarMetodo() {
    console.log('Valores del formulario:', this.formValues);
    console.log('Función:', this.formValues.func);
    console.log('Intervalo a:', this.formValues.interA);
    console.log('Intervalo b:', this.formValues.interB);
    console.log('Máx iteraciones:', this.formValues.maxIterations);
    console.log('Tolerancia:', this.formValues.tolerance);
    this.isWaiting = false;
    
  }
  
  limpiarFormulario() {
    this.formValues = {
      func: '',
      interA: null,
      interB: null,
      maxIterations: null,
      tolerance: null
    };

    this.isWaiting = true;
  }

}
