import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private db: AngularFireDatabase,
    private shoppingCartService: ShoppingCartService
  ) { }

  async placeOrder(order) {
    // transaction here needed
    // ensure that during placing an order,
    // an order object is stored
    // AND the corresponding shopping cart is cleared.
    // Either both these operations succeed together
    // or they both will fail.
    const result = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart();
    return result;
  }

  getOrders() {
    return this.db.list('/orders').valueChanges();
  }

  getAll() {
    // return this.db.list('orders'); // ** outdated
    return this.db.list<any>('/orders', ref => ref.orderByChild('datePlaced')).snapshotChanges();
  }

  getOrdersByUser(userId: string) {
    // https://stackoverflow.com/questions/47129039/query-does-not-exist-in-type-queryfn-angularfire2
    return this.db.list<any>('/orders', ref =>
      ref.orderByChild('userId')
        .equalTo(userId))
      .valueChanges();
  }
}
