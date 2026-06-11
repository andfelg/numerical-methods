import { Injectable } from '@angular/core';
import { compile } from 'mathjs';

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

@Injectable({
  providedIn: 'root'
})
export class BiseccionService {

  ejecutar(funcionTexto: string, a: number, b: number, tolerancia: number, maxIteraciones: number): BiseccionResultado {
    const expr = compile(funcionTexto);

    const f = (x: number): number => {
      return expr.evaluate({ x });
    };

    let fa = f(a);
    let fb = f(b);

    if (fa * fb > 0) {
      throw new Error(
        'El intervalo no contiene una raíz.'
      );
    }

    const iteraciones: BiseccionIteracion[] = [];

    let xm = 0;
    let error = Infinity;

    for (
      let i = 1;
      i <= maxIteraciones;
      i++
    ) {

      xm = (a + b) / 2;

      const fxm = f(xm);

      if (i > 1) {
        error = Math.abs(b - a) / 2;
      }

      iteraciones.push({
        iteracion: i,
        a,
        b,
        xm,
        fa,
        fb,
        fxm,
        error
      });

      // condicion de parada
      if (
        Math.abs(fxm) < tolerancia ||
        error < tolerancia
      ) {
        break;
      }

      if (fa * fxm < 0) {
        b = xm;
        fb = fxm;
      } else {
        a = xm;
        fa = fxm;
      }
    }

    return {
      raiz: xm,
      iteraciones
    };
  }
}