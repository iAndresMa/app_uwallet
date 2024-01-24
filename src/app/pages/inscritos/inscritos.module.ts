import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InscritosPageRoutingModule } from './inscritos-routing.module';

import { InscritosPage } from './inscritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InscritosPageRoutingModule
  ],
  declarations: [InscritosPage]
})
export class InscritosPageModule {}
