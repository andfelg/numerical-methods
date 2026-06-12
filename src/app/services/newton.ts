import { Injectable } from '@angular/core';
import { compile, derivative } from 'mathjs';


/**
 * xn+1 = xn - f(xn) / f'(xn)
 * Si f'(xn) es cercano a 0, el método puede divergir o no converger.
 */

@Injectable({
  providedIn: 'root'
})
export class NewtonService {

  ejecutar(funcionTexto: string, x0: number, tolerancia: number, maxIteraciones: number) {

    const expr = compile(funcionTexto);

    const derivadaExpr = derivative(funcionTexto, 'x');

    const derivada = compile(derivadaExpr.toString());

    // funcion normal
    const f = (x: number) =>
      expr.evaluate({ x });

    // funcion derivada
    const df = (x: number) =>
      derivada.evaluate({ x });

    const iteraciones = [];

    let xn = x0;

    for (let i = 1; i <= maxIteraciones; i++) {

      const fxn = f(xn);

      const dfxn = df(xn);

      if (Math.abs(dfxn) < 1e-12) {
        throw new Error(
          'La derivada es cero.'
        );
      }

      const xn1 = xn - fxn / dfxn;

      const error = Math.abs(xn1 - xn);

      iteraciones.push({
        iteracion: i,
        xn,
        fxn,
        dfxn,
        xn1,
        error
      });

      if (error < tolerancia) {
        return {
          raiz: xn1,
          iteraciones
        };
      }

      xn = xn1;
      
    }

    return {
      raiz: xn,
      iteraciones
    };
  }
}