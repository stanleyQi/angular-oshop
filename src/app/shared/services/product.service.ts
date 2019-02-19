import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // create a variable with type of Observable because snapshotChanges returns a observable type.
  products$: Observable<any>;

  constructor(private db: AngularFireDatabase) {
    // get all the list of data from Firebase
    this.products$ = this.db.list('/products')
      .snapshotChanges();
  }

  create(product) {
    return this.db.list('/products').push(product);
  }

  // now map your category key with data here
  getAll(): Observable<Product[]> {
    return this.products$.pipe(
      map(changes => {
        return changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() }));
      }));
  }

  get(productId) {
    return this.db.object('/products/' + productId).valueChanges();
  }

  update(productId, product) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId) {
    return this.db.object('/products/' + productId).remove();
  }
}
