import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TablaComponent } from './componente/Tabla/tabla.component';
import { MapaComponent } from './componente/Mapa/Mapa.component';

@NgModule({
  declarations: [
    AppComponent,
    TablaComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
