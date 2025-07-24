import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrPerdomoPageRoutingModule } from './qr-perdomo-routing.module';

import { QrPerdomoPage } from './qr-perdomo.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrPerdomoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [QrPerdomoPage]
})
export class QrPerdomoPageModule {}
