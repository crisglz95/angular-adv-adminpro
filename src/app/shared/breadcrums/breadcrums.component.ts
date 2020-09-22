import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrums',
  templateUrl: './breadcrums.component.html',
  styles: [
  ]
})
export class BreadcrumsComponent implements OnInit, OnDestroy {

  public titulo: string = '';
  public tituloSub$: Subscription;

  constructor(private router: Router) { 
    this.tituloSub$ = this.getArgumentosRuta()
                      .subscribe(({ titulo }) => {
                        this.titulo = titulo;
                        document.title = `AdminPro - ${titulo}`;
                      });
  }
  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
  }

  ngOnInit(): void {
  }

  getArgumentosRuta(){
    return this.router.events
    .pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    )
    
  }

}
