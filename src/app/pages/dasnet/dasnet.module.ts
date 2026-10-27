import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DasnetPageRoutingModule } from './dasnet-routing.module';

import { DasnetPage } from './dasnet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DasnetPageRoutingModule
  ],
  declarations: [DasnetPage]
})
export class DasnetPageModule {}
