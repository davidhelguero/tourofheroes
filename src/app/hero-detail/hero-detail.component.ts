import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  //@Input() hero : Hero;
  hero : Hero;
  constructor(private route : ActivatedRoute,
              private location : Location,
              private heroService : HeroService) { }
  /*
    El ActivatedRoute contiene información sobre la ruta a esta instancia del HeroDetailComponent.

    La ubicación es un servicio Angular para interactuar con el navegador.
    Se usará para volver a la vista que navegó anteriormente.
  */
  ngOnInit(): void {
    this.getHero();
  }

  getHero() : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }
  /*
  Route.snapshot es una imagen estática de la información de la ruta poco después de que se creó el componente.
  El paramMap es un diccionario de valores de parámetros de ruta extraídos de la URL.
  Los parámetros de ruta son siempre cadenas. El operador JavaScript (+) convierte la cadena en un número.
  */

  goBack() : void {
    this.location.back();
  }

  save() : void {
    this.heroService.updateHero(this.hero)
    .subscribe(() => this.goBack());

  }
}
