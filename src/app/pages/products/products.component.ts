import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  products = signal<any[]>([])

  constructor(
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.loadData()
  }

  loadData() {
    this.apiService.getAllProducts().subscribe(data => {
      this.products.set(data)
      console.log(data)
    })
  }

  deleteProduct(event: Event, id: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez-vous vraiment supprimer ce produit ?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
          this.apiService.deleteProduct(id).subscribe(() => {
            this.loadData()
          })
          this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Le produit à bien été supprimé', life: 3000 });
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Suppression annulée', life: 3000 });
      }
  });
  
  }
}
