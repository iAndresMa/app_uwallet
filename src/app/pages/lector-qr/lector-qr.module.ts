import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LectorQrPageRoutingModule } from './lector-qr-routing.module';

import { LectorQrPage } from './lector-qr.page';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LectorQrPageRoutingModule,
    ZXingScannerModule
  ],
  declarations: [LectorQrPage]
})
export class LectorQrPageModule {}
