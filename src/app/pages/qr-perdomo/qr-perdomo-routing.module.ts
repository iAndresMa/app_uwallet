import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrPerdomoPage } from './qr-perdomo.page';

const routes: Routes = [
  {
    path: '',
    component: QrPerdomoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrPerdomoPageRoutingModule {}
