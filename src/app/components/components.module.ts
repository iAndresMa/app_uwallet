import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { CardComponent } from './card/card.component';
import { DatosComponent } from './datos/datos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorQrComponent } from './error-qr/error-qr.component';

@NgModule({
  declarations: [
    FooterComponent,
    PoliticasComponent,
    CardComponent,
    DatosComponent,
    ErrorQrComponent,
  ],
  exports: [
    FooterComponent,
    PoliticasComponent,
    CardComponent,
    DatosComponent,
    ErrorQrComponent,
  ],
  imports: [CommonModule, IonicModule, RouterModule, ReactiveFormsModule],
})
export class ComponentsModule {}
