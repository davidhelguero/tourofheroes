import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes : Hero[];

  //Los service se inyectan en el constructor
  constructor(private heroService:HeroService) { }

  /*En la función de ciclo de vida van aquellas acciones que se necesitan que se hagan al inicio
  como traer los datos de una base*/
  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void{
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
    //ESPERA a que se emita una serie de heroes. Podría ocurrir en el momento o unos instantes después
  }

  add(name: string): void {
    name = name.trim();                         //trim elimina los espacios en blanco en ambos extremos del string.
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)  //name as Hero crea un objeto similar a Hero con el nombre
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);    //desigualdad estricta
    this.heroService.deleteHero(hero).subscribe();
  }

}
