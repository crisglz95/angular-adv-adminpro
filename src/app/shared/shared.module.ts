import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreadcrumsComponent } from './breadcrums/breadcrums.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    BreadcrumsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    BreadcrumsComponent,
  ]
})
export class SharedModule { }
