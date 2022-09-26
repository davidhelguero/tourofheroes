import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

//Inyección de dependencia
/*
Un proveedor es algo que puede crear o prestar un servicio; en este caso, crea una instancia de la clase HeroService
para proporcionar el servicio.
Cuando proporciona el servicio en el nivel raíz, Angular crea una única instancia compartida de HeroService e inyecta
en cualquier clase que lo solicite.
*/
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService : MessageService) { }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    //return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl)
           .pipe(
              tap(_ => this.log('fetched heroes')),
              catchError(this.handleError<Hero[]>('getHeroes', []))
    );
    /*
      http.get tambien devuelve un Observable
      http.get devuelve un JSON. Con el especificador <Hero[]> se agregan capacidades de TypeScript,
      que reducen los errores durante el tiempo de compilación.

      Pipe te permite aplicar varios operadores sobre el flujo de datos de forma secuencial.

      El operador catchError() intercepta un Observable que falló. Pasa el error a un controlador de errores
      que puede hacer lo que quiera con el error.

      handleError() informa el error y luego devuelve un resultado inocuo para que la aplicación siga funcionando.

      tap: No es tanto un efecto pensado para alterar el flujo de datos, sino para facilitar efectos colaterales.
      Por ejemplo, si se quiere guardar cada evento en localstorage.
    */
  }

  getHero(id: number): Observable<Hero> {
      this.messageService.add(`HeroService: fetched hero id=${id}`);
      return of(HEROES.find(hero => hero.id === id));
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
    /*
      La API web de héroes espera un encabezado especial en las solicitudes de guardado HTTP.
      Ese encabezado está en la constante httpOptions definida a continuación.
    */
  }

  deleteHero(hero: Hero | number): Observable<Hero> {       //Puede recibir un Hero o un numero
    const id = typeof hero === 'number' ? hero : hero.id;   //Si es el id, lo asigna, sino, es el heroe, accede al id y lo asigna
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /*
     parametro operacion : nombre de la operación que falló
     parametro result : valor opcional para devolver como resultado observable
  */
  private handleError<T>(operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {
        console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };

  }


}
