import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'covid-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  constructor() { }

  title = 'covid dashboard';

  ngOnInit(): void {
  }

}
