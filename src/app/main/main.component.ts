import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProductService } from '../product.service';
import { Product } from '../dto/Product';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [InputTextModule,TableModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  products!: Product[];

  constructor(private productService: ProductService) {}

  ngOnInit() {
      this.productService.getProducts().then((data) => {
          this.products = data;
      });
  }
}
