import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { HomeComponent } from './pages/home/home.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { AddClientComponent } from './pages/add-client/add-client.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AddOrderComponent } from './pages/add-order/add-order.component';
import { EditOrderComponent } from './pages/edit-order/edit-order.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'products/add', component: AddProductComponent},
  {path: 'products/edit/:id', component: EditProductComponent},
  {path: 'clients', component: ClientsComponent},
  {path: 'clients/add', component: AddClientComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'orders/add', component: AddOrderComponent},
  {path: 'orders/edit/:ref', component: EditOrderComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
