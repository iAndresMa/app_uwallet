import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrProvisionalPageRoutingModule } from './qr-provisional-routing.module';

import { QrProvisionalPage } from './qr-provisional.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrProvisionalPageRoutingModule
  ],
  declarations: [QrProvisionalPage]
})
export class QrProvisionalPageModule {}
