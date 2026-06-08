import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-layout',
  imports: [MenuComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
