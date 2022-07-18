import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { MapComponent } from './map/map.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'history', component: HistoryComponent },
  {path: '', redirectTo: 'map', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
