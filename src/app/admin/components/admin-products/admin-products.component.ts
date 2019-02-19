import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Product } from 'shared/models/product';
import { ProductService } from 'shared/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  expandedElement: Product;
  dataSource: MatTableDataSource<Product>;

  columnsToDisplay: string[] = ['title', 'price'];
  columnsToDisplayWithEdit: string[] = this.columnsToDisplay.concat(['edit']);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private productService: ProductService) {
    this.subscription = this.productService.getAll()
      .subscribe(products => {
        this.initializeTable(products);
      });
  }

  private initializeTable(products: Product[]) {
    this.dataSource = new MatTableDataSource(products);

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.title.toLowerCase().includes(filter) || data.price.toString() === filter;
    };

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    if (filterValue)
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
