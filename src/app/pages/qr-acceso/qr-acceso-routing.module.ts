import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrAccesoPage } from './qr-acceso.page';

const routes: Routes = [
  {
    path: '',
    component: QrAccesoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrAccesoPageRoutingModule {}
