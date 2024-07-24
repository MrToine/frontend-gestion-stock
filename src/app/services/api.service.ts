import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly URL = 'http://localhost:3000/';

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllProducts() {
    return this.httpClient.get<any[]>(`${this.URL}products`);
  }

  getProductDetail(id: string) {
    return this.httpClient.get<any>(`${this.URL}products/${id}`);
  }

  getProductByRef(ref: string) {
    return this.httpClient.get<any>(`${this.URL}products/${ref}`);
  }

  addProduct(value: any) {
    return this.httpClient.post<any>(`${this.URL}products`, value);
  }

  editProduct(id: string, value: any) {
    return this.httpClient.put<any>(`${this.URL}products/${id}`, value);
  }

  updateQuantityProduct(id: string, value: any) {
    return this.httpClient.patch<any>(`${this.URL}products/${id}/${value.quantity}`, value);
  }

  deleteProduct(id: string) {
    return this.httpClient.delete<any>(`${this.URL}products/${id}`);
  }

  getAllClients() {
    return this.httpClient.get<any[]>(`${this.URL}clients`);
  }

  getClientByRef(ref: string) {
    return this.httpClient.get<any>(`${this.URL}clients/${ref}`);
  }

  addClient(value: any) {
    return this.httpClient.post<any>(`${this.URL}clients`, value);
  }


  getAllOrders(page: number = 1) {
    
    return this.httpClient.get<any[]>(`${this.URL}orders?page=${page}&limit=10`);
  }

  getOrderDetail(ref: string) {
    return this.httpClient.get<any>(`${this.URL}orders/${ref}`);
  }

  addOrder(value: any) {
    return this.httpClient.post<any>(`${this.URL}orders`, value);
  }

  editOrder(ref: string, value: any) {
    return this.httpClient.put<any>(`${this.URL}orders/${ref}`, value);
  }
}
