import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  form: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private productService: ApiService,
    private messageService: MessageService
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.min(0), Validators.required]],
      stock: [null, [Validators.min(0), Validators.required]],
      description: [null, [Validators.required]]
    })
  }

  submit() {
    console.log(this.form.value)
    if(this.form.valid) {
      const datas = {
        ...this.form.value,
        modificationStock: 0,
        createdAt: new Date(),
        reference: this.form.value.name.toUpperCase().slice(0, 3) + Math.floor(Math.random() * 1000)
      }
      console.log(datas)
      this.productService.addProduct(datas).subscribe({ next:  () => {
        this.messageService.add({ severity: 'success', summary: 'Produit ajouté avec succès !' })
      }, error: err => {
        this.messageService.add({ 
          severity: 'error', 
          summary: err.error.statusCode === 401 ? 'Interdit !!' : 'Une erreur est survenue. Impossible d\'ajouter le produit'  
        })
      }})
    }
    this.form.reset()
  }
}
