import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // create a variable with type of Observable because snapshotChanges returns a observable type.
  categories$: Observable<any>;

  // inject angular firedata base object  for communicating with firebase db “private db: AngularFireDatabase”
  constructor(private db: AngularFireDatabase) {
    // get all the list of data from Firebase
    this.categories$ = this.db.list('/categories',
      ref => ref.orderByChild('name'))
      .snapshotChanges();

  }

  // now map your category key with data here
  getAll() {
    return this.categories$.pipe(
      map(changes => {
        return changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() }));
      }));
  }
}
