import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarnetPageRoutingModule } from './carnet-routing.module';

import { CarnetPage } from './carnet.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarnetPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [CarnetPage]
})
export class CarnetPageModule {}
