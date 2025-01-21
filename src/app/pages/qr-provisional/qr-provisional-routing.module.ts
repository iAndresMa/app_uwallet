import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrProvisionalPage } from './qr-provisional.page';

const routes: Routes = [
  {
    path: '',
    component: QrProvisionalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrProvisionalPageRoutingModule {}
