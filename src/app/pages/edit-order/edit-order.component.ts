import { Component, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.scss'
})

export class EditOrderComponent {
  
  clients = signal<any>([])
  products = signal<any>([])
  productsCart = signal<any>([])
  selectedQuantity = signal<number>(1)

  order = signal<any>(null)

  form: FormGroup

  clientId = ''

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute
  ){

    this.form = formBuilder.group({
      reference: [null, Validators.required],
      createdAt: [null, Validators.required],
      refClient: [null, Validators.required],
      state: [null, Validators.required],
      product: [null, Validators.required],
      selectedProduct: [null, Validators.required],
      selectedQuantity: [this.selectedQuantity(), Validators.required]
    })
  }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.loadOrderByRef(param['ref']).subscribe((orderData: any) => {
        this.loadProducts()
        this.order.set(orderData);
        this.productsCart.set(orderData.products)
       
        if (this.order()) {
          this.form.get('createdAt')?.setValue(this.order().createdAt);
          this.form.get('reference')?.setValue(this.order().reference);
          this.form.get('state')?.setValue(this.order().state);
          this.form.get('refClient')?.setValue(this.order().client.reference);
          this.clientId = this.order().client.id;
          this.productsCart.set(this.order().products);
        }
        
        const dateControl = this.form.get('createdAt');
        const refControl = this.form.get('reference');
        const stateControl = this.form.get('state');
        const clientControl = this.form.get('refClient');

        if (dateControl && refControl && stateControl && clientControl) {
          dateControl.disable()
          refControl.disable()
          clientControl.disable()
          stateControl.disable()
        }
      });
    });
  }

  updateSelectedProduct(selectedProductReference: any) {
    this.form.get('selectedProduct')?.setValue(selectedProductReference);
  }

  updateQuantity(value: number) {
    this.selectedQuantity.set(value);
  }

  addProduct() {
    if (this.form.value.selectedProduct) {
      const value = this.form.value.selectedProduct.value

      this.apiService.getProductByRef(value).subscribe(data => {
        if (this.selectedQuantity() > data.stock) {
          this.messageService.add({ severity: 'error', summary: 'Attention', detail: `La quantité demandée est supérieure à la quantité en stock (restant : ${data.stock})` })
          return
        }
        const currentProductsCart = this.productsCart();
        const existingProduct = currentProductsCart.find((p: { product: { reference: any; }; }) => p.product.reference === data.reference);
        
        if (existingProduct) {
          existingProduct.quantity += this.selectedQuantity();
        } else {
          const productWithQuantity = { ...{product: data}, quantity: this.selectedQuantity() };
          this.productsCart.set([...currentProductsCart, productWithQuantity]);
          console.log("PRODUCT ADDED : ", this.productsCart())
        }
        
        const dataUpdateProduct = {
          quantity: this.selectedQuantity(),
          operation: 'subtract'
        }
        this.apiService.updateQuantityProduct(data.id, dataUpdateProduct).subscribe(data => {
          console.log("QUANTITY UPDATED : ", data)
        })
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Attention', detail: 'Veuillez sélectionner un produit' })
    }
    console.log("PRODUCT : ", this.productsCart())
      
      this.form.get('product')?.reset();
    }
    
    removeProduct(id: string) {
      const product = this.productsCart().find((item: { product: { id: string; }; }) => item.product.id === id);
      const dataUpdateProduct = {
        quantity: product.quantity,
        operation: 'add'
      }
      
      this.apiService.updateQuantityProduct(id, dataUpdateProduct).subscribe(data => {
        console.log("QUANTITY UPDATED : ", data)
      })
      this.productsCart.set(this.productsCart().filter((p: { product: { id: string; }; }) => p.product.id !== id));      
    }
    
    onValidate() {
      if (this.productsCart().length === 0) {
        this.messageService.add({ severity: 'error', summary: 'Attention', detail: 'Le panier est vide. Veuillez ajouter des produits avant de terminer la commande.'
      })
        return
      }
      const formValue = { ...this.form.getRawValue(), productsCart: this.productsCart() };
      let total = 0
      
      this.productsCart().forEach((p: { quantity: number; product: { price: number; }}) => {
        total += p.quantity * p.product.price
      });

      const orderProducts = this.productsCart().map((product: { product: { id: any; }; quantity: any; }) => ({
        productId: product.product.id,
        quantity: product.quantity
      }))

    const order = {
      clientId: this.clientId,
      reference: formValue.reference,
      state: formValue.state,
      createdAt: formValue.createdAt,
      orderProducts: orderProducts,
      total: total
    }

    this.apiService.editOrder(order.reference, order).subscribe({ next:  () => {
      this.messageService.add({ severity: 'success', summary: 'Commande Mise à jour avec succès !' })
    }, error: err => {
      this.messageService.add({ 
        severity: 'error', 
        summary: err.error.statusCode === 401 ? 'Interdit !!' : 'Une erreur est survenue. Impossible de modifier la commande'  
      })
    }})
  }

  orderCancel(ref: string) {
    this.loadOrderByRef(ref).subscribe((orderData: any) => {
      const orderProducts = orderData.products.map((product: { product: { id: any; }; quantity: any; }) => ({
        productId: product.product.id,
        quantity: product.quantity
      }))
      orderData.products.forEach((product: { product: { id: any; }; quantity: any; }) => {
        const dataUpdateProduct = {
          quantity: product.quantity,
          operation: 'add'
        }
        this.apiService.updateQuantityProduct(product.product.id, dataUpdateProduct).subscribe(data => {
          console.log("QUANTITY UPDATED : ", data)
        })
      });
      const order = {
        clientId: orderData.client.id,
        reference: orderData.reference,
        state: 'Annulée',
        createdAt: orderData.createdAt,
        orderProducts: orderProducts,
        total: orderData.total
      }
      this.apiService.editOrder(order.reference, order).subscribe({ next:  () => {
        this.messageService.add({ severity: 'success', summary: 'Commande Annulée avec succès !' })
        window.location.reload()
      }, error: err => {
        this.messageService.add({ 
          severity: 'error', 
          summary: err.error.statusCode === 401 ? 'Interdit !!' : 'Une erreur est survenue. Impossible d\'annuler la commande'  
        })
      }})
    
    })

  }

  orderPayed(ref: string) {
    this.loadOrderByRef(ref).subscribe((orderData: any) => {
      const orderProducts = orderData.products.map((product: { product: { id: any; }; quantity: any; }) => ({
        productId: product.product.id,
        quantity: product.quantity
      }))
      const order = {
        clientId: orderData.client.id,
        reference: orderData.reference,
        state: 'Payée',
        createdAt: orderData.createdAt,
        orderProducts: orderProducts,
        total: orderData.total
      }
      this.apiService.editOrder(order.reference, order).subscribe({ next:  () => {
        this.messageService.add({ severity: 'success', summary: 'Commande Payée avec succès !' })
        window.location.reload()
      }, error: err => {
        this.messageService.add({ 
          severity: 'error', 
          summary: err.error.statusCode === 401 ? 'Interdit !!' : 'Une erreur est survenue. Impossible de payer la commande'  
        })
      }})
    })
  
  }

  loadProducts() {
    this.apiService.getAllProducts().subscribe(data => {
      this.products.set(data)
    })
  }
  
  loadOrderByRef(ref: string) {
    return this.apiService.getOrderDetail(ref);
  }
}
