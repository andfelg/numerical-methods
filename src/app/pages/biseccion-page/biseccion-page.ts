import { Component } from '@angular/core';
import { BackButton } from '../../components/back-button/back-button';
import { FormsModule } from '@angular/forms';
import { Loadindicator } from '../../components/loadindicator/loadindicator';
import { BiseccionService } from '../../services/biseccion';
import * as Plotly from 'plotly.js-dist-min';
import { compile } from 'mathjs';

export interface FormValues {
  func: string;
  interA: number | null;
  interB: number | null;
  maxIterations: number | null;
  tolerance: number | null;
}

export interface BiseccionIteracion {
  iteracion: number;
  a: number; // intervalo a
  b: number; // intervalo b
  xm: number; // punto medio
  fa: number; // f(a)
  fb: number; // f(b)
  fxm: number; // f(c)
  error: number;
}

export interface BiseccionResultado {
  raiz: number;
  iteraciones: BiseccionIteracion[];
}

@Component({
  selector: 'app-biseccion-page',
  imports: [BackButton, FormsModule, Loadindicator],
  templateUrl: './biseccion-page.html',
})
export class BiseccionPage {

  isWaiting: boolean = true;
  private funcionCompilada: any;

  formValues: FormValues = {
    func: '',
    interA: null,
    interB: null,
    maxIterations: null,
    tolerance: null
  };
  

  resultado: BiseccionResultado | null = null;

  iteracionActual = 0;

  constructor(
    private biseccionService: BiseccionService
  ) {}

  iniciarMetodo() {
    this.funcionCompilada = compile(
      this.formValues.func
    );

    if (
      !this.formValues.func ||
      this.formValues.interA === null ||
      this.formValues.interB === null ||
      this.formValues.maxIterations === null ||
      this.formValues.tolerance === null
    ) {
      alert('Complete todos los campos');
      return;
    }

    try {

      this.resultado =
        this.biseccionService.ejecutar(
          this.formValues.func,
          this.formValues.interA,
          this.formValues.interB,
          this.formValues.tolerance,
          this.formValues.maxIterations
        );

      this.iteracionActual = 0;
      this.isWaiting = false
      setTimeout(() => {
        this.graficarIteracion();
      });

      console.log(this.resultado);

    } catch (error: any) {
      alert(error.message);
    }
  }

  // obtener la iteracion actual
  get iteracion() {

    if (!this.resultado) {
      return null;
    }

    return this.resultado.iteraciones[
      this.iteracionActual
    ];
  }

  anterior() {

    if (this.iteracionActual > 0) {
      this.iteracionActual--;
      this.graficarIteracion();
    }

  }

  siguiente() {

    if (!this.resultado) return;

    if (
      this.iteracionActual <
      this.resultado.iteraciones.length - 1
    ) {
      this.iteracionActual++;
      this.graficarIteracion();
    }

  }

  private evaluarFuncion(x: number): number {
    return this.funcionCompilada.evaluate({ x });
  }

  graficarIteracion(): void {

    if (!this.iteracion) return;

    const { a, b, xm } = this.iteracion;

    const margen = (b - a) * 0.5;

    const xMin = a - margen;
    const xMax = b + margen;

    const puntosX: number[] = [];
    const puntosY: number[] = [];

    for (let x = xMin; x <= xMax; x += (xMax - xMin) / 300) {

      puntosX.push(x);

      puntosY.push(
        this.evaluarFuncion(x)
      );
    }

    const curva = {
      x: puntosX,
      y: puntosY,
      mode: 'lines',
      name: 'f(x)'
    };

    Plotly.newPlot(
      'graficaBiseccion',
      [curva],
      {
        // estilos
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: {
          l: 40,
          r: 20,
          t: 20,
          b: 40
        },

        showlegend: false,

        shapes: [

          // Línea a
          {
            type: 'line',
            x0: a,
            x1: a,
            y0: Math.min(...puntosY),
            y1: Math.max(...puntosY),
            line: {
              width: 2,
              dash: 'dot'
            }
          },

          // Línea b
          {
            type: 'line',
            x0: b,
            x1: b,
            y0: Math.min(...puntosY),
            y1: Math.max(...puntosY),
            line: {
              width: 2,
              dash: 'dot'
            }
          },

          // Punto medio
          {
            type: 'line',
            x0: xm,
            x1: xm,
            y0: Math.min(...puntosY),
            y1: Math.max(...puntosY),
            line: {
              width: 3
            }
          }
        ],

        annotations: [
          {
            x: a,
            y: 0,
            text: 'a',
            showarrow: false
          },
          {
            x: b,
            y: 0,
            text: 'b',
            showarrow: false
          },
          {
            x: xm,
            y: 0,
            text: 'xm',
            showarrow: false
          }
        ]
      },
      {
        responsive: true
      }
    );
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
