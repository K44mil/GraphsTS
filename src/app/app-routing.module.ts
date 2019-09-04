import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphsBoardComponent } from './_components/graphs-board/graphs-board.component';


const routes: Routes = [
  { path: '', component: GraphsBoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
