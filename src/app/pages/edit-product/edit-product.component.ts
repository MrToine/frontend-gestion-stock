import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {

  form: FormGroup
  productId: any

  constructor(
    private formBuilder: FormBuilder,
    private productService: ApiService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      reference: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.min(0), Validators.required]],
      stock: [null, [Validators.min(0), Validators.required]],
      description: [null, [Validators.required]]
    })
  }
  
  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductDetail();
    }
    const stockControl = this.form.get('stock');
    const refControl = this.form.get('reference');
    if (stockControl && refControl) {
      stockControl.disable()
      refControl.disable()
    }
  }

  loadProductDetail() {
    this.route.params.subscribe(params => {
      this.productService.getProductDetail(params['id']).subscribe(data => {
        this.form.patchValue(data)
      })
    })
  }

  submit(id: any){
    if(this.form.valid) {
      this.productService.editProduct(id, this.form.value).subscribe({ next:  () => {
        this.messageService.add({ severity: 'success', summary: 'Produit modifié avec succès !' })
      }, error: err => {
        this.messageService.add({ 
          severity: 'error', 
          summary: err.error.statusCode === 401 ? 'Interdit !!' : 'Une erreur est survenue. Impossible de modifier le produit'  
        })
      }})
    }
  }
}
