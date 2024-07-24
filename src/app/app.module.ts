import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { MenuComponent } from './partials/menu/menu.component';
import { HomeComponent } from './pages/home/home.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProductsComponent } from './pages/products/products.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { AddClientComponent } from './pages/add-client/add-client.component';
import { AddOrderComponent } from './pages/add-order/add-order.component';
import { DropdownModule } from 'primeng/dropdown';
import { EditOrderComponent } from './pages/edit-order/edit-order.component';
import { ChartModule } from 'primeng/chart';
import { PaginatorComponent } from './components/paginator/paginator.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    HomeComponent,
    ClientsComponent,
    OrdersComponent,
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    AddClientComponent,
    AddOrderComponent,
    EditOrderComponent,
    PaginatorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    InputTextModule,
    InputTextareaModule,
    FieldsetModule,
    FloatLabelModule,
    DropdownModule,
    ChartModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    provideHttpClient(withInterceptors([]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
