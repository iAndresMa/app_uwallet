import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DasnetPage } from './dasnet.page';

const routes: Routes = [
  {
    path: '',
    component: DasnetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DasnetPageRoutingModule {}
