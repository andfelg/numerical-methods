import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { compile } from 'mathjs';
import * as Plotly from 'plotly.js-dist-min';

import { BackButton } from '../../components/back-button/back-button';
import { Loadindicator } from '../../components/loadindicator/loadindicator';
import { NewtonService } from '../../services/newton';


export interface FormValues {
  func: string;
  x0: number | null;
  maxIterations: number | null;
  tolerance: number | null;
}

@Component({
  selector: 'app-newton-page',
  imports: [
    BackButton,
    Loadindicator,
    FormsModule
  ],
  templateUrl: './newton-page.html',
})
export class NewtonPage {

  constructor(
    private cdr: ChangeDetectorRef,
    private newtonService: NewtonService
  ){}

  isWaiting: boolean = true;
  isPlaying: boolean = false;
  resultado: any = null;

  iteracionActual = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  formValues: FormValues = {
    func: '',
    x0: null,
    maxIterations: 30,
    tolerance: 0.0001
  };

  private funcionCompilada: any;

  get iteracion() {

    if (!this.resultado) {
      return null;
    }

    return this.resultado.iteraciones[
      this.iteracionActual
    ];
  }

  iniciarMetodo() {

    if (
      !this.formValues.func ||
      this.formValues.x0 === null ||
      this.formValues.maxIterations === null ||
      this.formValues.tolerance === null
    ) {
      alert('Complete todos los campos');
      return;
    }

    try {

      this.funcionCompilada = compile(
        this.formValues.func
      );

      this.resultado = this.newtonService.ejecutar(
        this.formValues.func,
        this.formValues.x0,
        this.formValues.tolerance,
        this.formValues.maxIterations
      );

      this.iteracionActual = 0;

      this.isWaiting = false;

      setTimeout(() => {
        this.graficarIteracion();
      });

    } catch (error: any) {

      console.error(error);

      alert(
        error.message ??
        'Error al ejecutar Newton-Raphson'
      );
    }
  }

  siguiente() {
    if (!this.resultado) {
      return;
    }

    if (this.iteracionActual < this.resultado.iteraciones.length - 1) {
      this.iteracionActual++;
      this.graficarIteracion();
    }
  }

  anterior() {

    if (this.iteracionActual > 0) {
      this.iteracionActual--;
      this.graficarIteracion();
    }
  }

  restart() {
    this.iteracionActual = 0;
    this.isPlaying = false;
    this.graficarIteracion();

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  play() {

    if (!this.resultado) return;

    if (this.isPlaying) {

      this.isPlaying = false;

      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      return;
    }

    // Iniciar reproducción
    this.isPlaying = true;

    this.intervalId = setInterval(() => {

      if (
        this.iteracionActual >=
        this.resultado!.iteraciones.length - 1
      ) {

        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
          this.cdr.detectChanges();
        }

        this.isPlaying = false;
        this.cdr.detectChanges();

        return;
      }

      this.iteracionActual++;

      this.graficarIteracion();

      this.cdr.detectChanges();

    }, 1000);
  }

  limpiarFormulario() {

    this.formValues = {
      func: '',
      x0: null,
      maxIterations: null,
      tolerance: null
    };

    this.resultado = null;

    this.iteracionActual = 0;

    this.isWaiting = true;

    const grafica =
      document.getElementById(
        'graficaNewton'
      );

    if (grafica) {
      Plotly.purge(grafica);
    }
  }

  evaluarFuncion(x: number): number {
    return this.funcionCompilada
      .evaluate({ x });
  }

  graficarIteracion() {

    if (!this.iteracion) {
      return;
    }

    const xn = this.iteracion.xn;

    const fxn = this.iteracion.fxn;

    const pendiente = this.iteracion.dfxn;

    const xn1 = this.iteracion.xn1;

    const puntosX: number[] = [];
    const puntosY: number[] = [];

    const inicio = Math.min(xn, xn1) - 3;

    const fin = Math.max(xn, xn1) + 3;

    for (let x = inicio; x <= fin; x += 0.05) {

      puntosX.push(x);

      puntosY.push(
        this.evaluarFuncion(x)
      );
    }

    const minY = Math.min(...puntosY);

    const maxY = Math.max(...puntosY);

    const tangentX: number[] = [];
    const tangentY: number[] = [];

    for (let x = inicio; x <= fin; x += 0.05) {

      tangentX.push(x);

      tangentY.push(
        fxn +
        pendiente *
        (x - xn)
      );
    }

    const funcion = {
      x: puntosX,
      y: puntosY,
      mode: 'lines',
      name: 'f(x)'
    };

    const tangente = {
      x: tangentX,
      y: tangentY,
      mode: 'lines',
      name: 'Tangente'
    };

    const puntoActual = {
      x: [xn],
      y: [fxn],
      mode: 'markers',
      name: 'xn'
    };

    const puntoSiguiente = {
      x: [xn1],
      y: [0],
      mode: 'markers',
      name: 'xn+1'
    };

    Plotly.newPlot(
      'graficaNewton',
      [
        funcion,
        tangente,
        puntoActual,
        puntoSiguiente
      ],
      {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: {
          l: 40,
          r: 20,
          t: 20,
          b: 40
        },

        shapes: [

          {
            type: 'line',

            x0: xn,
            x1: xn,

            y0: minY,
            y1: maxY,

            line: {
              width: 2,
              dash: 'dot'
            }
          },

          {
            type: 'line',

            x0: xn1,
            x1: xn1,

            y0: minY,
            y1: maxY,

            line: {
              width: 2,
              dash: 'dot'
            }
          }

        ]
      },
      {
        responsive: true
      }
    );
  }
}