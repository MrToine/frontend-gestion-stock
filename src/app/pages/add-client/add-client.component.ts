import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {
  form: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private productService: ApiService,
    private messageService: MessageService
  ) {
    this.form = this.formBuilder.group({
      lastname: [null, [Validators.required]],
      firstname: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      tel: [null, [Validators.required]]
    })
  }

  submit() {
    if(this.form.valid) {
      const datas = {
        ...this.form.value,
        createdAt: new Date(),
        reference: this.form.value.lastname.toUpperCase().slice(0, 2) + this.form.value.firstname.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 100)
      }
      console.log(datas)
      this.productService.addClient(datas).subscribe({ next:  () => {
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
