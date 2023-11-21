
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import recursivelyStripNullValues from './recursivelyStripNullValues';
 
@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(value => recursivelyStripNullValues(value)));
  }
}



/*  
Contexte d’exécution: il fournit des informations sur le contexte actuel,

Gestionnaire d’appels: Il contient l’attribut manche qui invoque le gestionnaire de route et retourne un objet RxJS Observable

L'intercepteur encapsule le flux de requête/réponse, et nous pouvons ajouter une logique avant et après l’exécution 
du gestionnaire de route. Dans le code ci-dessus, nous invoquons le descripteur de route et modifions la réponse.*/