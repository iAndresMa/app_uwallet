import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BicicleteroPageRoutingModule } from './bicicletero-routing.module';

import { BicicleteroPage } from './bicicletero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BicicleteroPageRoutingModule
  ],
  declarations: [BicicleteroPage]
})
export class BicicleteroPageModule {}
