import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  labels1: string[] = ['Pan', 'Refresco', 'Tacos'];
  public data1 = [
    [260, 149, 635],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
