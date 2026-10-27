import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LectorEventoPageRoutingModule } from './lector-evento-routing.module';

import { LectorEventoPage } from './lector-evento.page';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LectorEventoPageRoutingModule,
    ZXingScannerModule
  ],
  declarations: [LectorEventoPage]
})
export class LectorEventoPageModule {}
