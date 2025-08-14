import { Component } from '@angular/core';
import { AppRoutingModule } from "src/app/app-routing.module";
import { NavComponent } from "src/app/componet/nav/nav.component";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone:true,
  styleUrls: ['./homepage.component.css'],
  imports: [AppRoutingModule, NavComponent]
})
export class HomepageComponent {

}
