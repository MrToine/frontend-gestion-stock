import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss'
})
export class AddOrderComponent {

  clients = signal<any>([])
  products = signal<any>([])
  productsCart = signal<any>([])
  selectedQuantity = signal<number>(1)

  form: FormGroup

  isValidClient = signal<number>(0)
  clientId = ''

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ){

    this.form = formBuilder.group({
      reference: [null, Validators.required],
      createdAt: [null, Validators.required],
      refClient: [null, Validators.required],
      state: [null, Validators.required],
      orderProducts: this.formBuilder.array([]),
      selectedProduct: [null, Validators.required],
      selectedQuantity: [this.selectedQuantity(), Validators.required]
    })
  }

  ngOnInit() {
    this.isValidClient.set(0)
    this.loadClients()
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const hours = new Date().getHours()
    const minutes = new Date().getMinutes()
    const seconds = new Date().getSeconds()

    this.form.get('createdAt')?.setValue(new Date())
    this.form.get('reference')?.setValue(`CMD-${year}${month}${day}${hours}${minutes}${seconds}`)
    this.form.get('state')?.setValue('En cours')
    this.form.get('orderProducts')?.setValue([])
    
    const dateControl = this.form.get('createdAt');
    const refControl = this.form.get('reference');
    const stateControl = this.form.get('state');
    const clientControl = this.form.get('refClient')

    if (dateControl && refControl && stateControl && clientControl) {
      dateControl.disable()
      refControl.disable()
      clientControl.disable()
      stateControl.disable()
    }
  }
  
  loadForm(value: any) {
    this.form.get('refClient')?.setValue(value.value)
    this.form.get('refClient')?.disable()
    this.apiService.getClientByRef(value.value).subscribe(data => {
      this.clientId = data.id
    })
    this.loadProducts()
    this.isValidClient.set(1)
  }

  updateSelectedProduct(selectedProductReference: any) {
    this.form.get('selectedProduct')?.setValue(selectedProductReference);
  }

  updateQuantity(value: number) {
    this.selectedQuantity.set(value);
  }

  addProduct() {
    const value = this.form.value.selectedProduct.value

    this.apiService.getProductByRef(value).subscribe(data => {
        if (this.selectedQuantity() > data.stock) {
          this.messageService.add({ severity: 'error', summary: 'Attention', detail: `La quantité demandée est supérieure à la quantité en stock (restant : ${data.stock})` })
          return
        }
        const currentProductsCart = this.productsCart();
        const existingProduct = currentProductsCart.find((p: { reference: any; }) => p.reference === data.reference);
  
        if (existingProduct) {
          existingProduct.quantity += this.selectedQuantity();
        } else {
          const productWithQuantity = { ...data, productId: data.id, quantity: this.selectedQuantity() };
          this.productsCart.set([...currentProductsCart, productWithQuantity]);
        }
        const dataUpdateProduct = {
          quantity: this.selectedQuantity(),
          operation: 'subtract'
        }
        this.apiService.updateQuantityProduct(data.id, dataUpdateProduct).subscribe(data => {
          this.messageService.add({ severity: 'info', summary: 'Modification stock', detail: `${dataUpdateProduct.quantity} ${data.name} retiré(s) du stock.` })
        })
      });


    this.form.get('product')?.reset();
  }

  onValidate() {
    const formValue = { ...this.form.getRawValue(), productsCart: this.productsCart() };
    let total = 0

    this.productsCart().forEach((product: { quantity: number; price: number; }) => {
      total += product.quantity * product.price
    });

    const order = {
      clientId: this.clientId,
      reference: formValue.reference,
      state: formValue.state,
      createdAt: formValue.createdAt,
      orderProducts: this.productsCart(),
      total: total
    }

    console.log("ORDER : ", order)
    this.apiService.addOrder(order).subscribe({ next:  () => {
      this.messageService.add({ severity: 'success', summary: 'Commande', detail: `Commande ${order.reference} créée avec succès !` })
    }, error: err => {
      this.messageService.add({ 
        severity: 'error', 
        summary: err.error.statusCode === 401 ? 'Interdit !!' : 'Une erreur est survenue. Impossible de créer la commande'  
      })
    }})
  }

  orderCancel() {
    this.productsCart.set([])
    this.form.get('orderProducts')?.reset()
  }

  loadProducts() {
    this.apiService.getAllProducts().subscribe(data => {
      this.products.set(data)
    })
  }
  
  loadClients() {
    this.apiService.getAllClients().subscribe(data => {
      this.clients.set(data)
    })
  }

}
