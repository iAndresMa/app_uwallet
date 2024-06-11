import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrPerdomoPageRoutingModule } from './qr-perdomo-routing.module';

import { QrPerdomoPage } from './qr-perdomo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrPerdomoPageRoutingModule
  ],
  declarations: [QrPerdomoPage]
})
export class QrPerdomoPageModule {}
