import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  orders = signal<any[]>([])
  nbOrders: number = 0
  page: number = 1

  constructor(
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.loadData()
  }

  changePage() {
    this.loadData()
  }

  loadData() {
    this.apiService.getAllOrders(this.page).subscribe((response: any) => {
      const orders = response.data
      this.orders.set(orders)
      this.nbOrders = response.total
    })
  }
}
