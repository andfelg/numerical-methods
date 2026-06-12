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

/**
 * constante = (a + b) / 2
 * Si f(constante) es cercano a 0 o el error es menor que la tolerancia, se detiene.
 * Si f(a) * f(constante) < 0, entonces la raíz está en el intervalo [a, constante], por lo que se asigna b = constante.
 * Si f(b) * f(constante) < 0, entonces la raíz está en el intervalo [constante, b], por lo que se asigna a = constante.
 */

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

    for (let i = 1; i <= maxIteraciones; i++) {

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