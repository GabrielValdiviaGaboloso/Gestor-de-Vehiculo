// comunicacion.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  private funcionSubject = new Subject<void>();

  // Observable para que los componentes se suscriban
  funcion$ = this.funcionSubject.asObservable();

  // Método para emitir eventos
  emitirFuncion() {
    this.funcionSubject.next();
  }
}
