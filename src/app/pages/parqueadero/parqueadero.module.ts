import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParqueaderoPageRoutingModule } from './parqueadero-routing.module';

import { ParqueaderoPage } from './parqueadero.page';
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParqueaderoPageRoutingModule,
    ComponentsModule
],
  declarations: [ParqueaderoPage],
})
export class ParqueaderoPageModule {}
