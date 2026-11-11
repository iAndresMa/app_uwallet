import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrAccesoPageRoutingModule } from './qr-acceso-routing.module';

import { QrAccesoPage } from './qr-acceso.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrAccesoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [QrAccesoPage]
})
export class QrAccesoPageModule {}
