import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LectorEventoPage } from './lector-evento.page';

const routes: Routes = [
  {
    path: '',
    component: LectorEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LectorEventoPageRoutingModule {}
