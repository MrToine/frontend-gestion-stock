import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { scales } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  productsGraph: any
  productsPerOrdersGraph: any
  nbOrders: any
  ordersPerStateGraph: any
  nbOrdersPerDateGraph: any

  lineOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    scales: {
      y: {
        stepSize: 1,
        beginAtZero: true,
      }
    }
  }

  colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#FFCD56']

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadProductsStock()
    this.loadProductsPerOrders()
    this.loadOrders()
    this.loadOrdersPerStatus()
    this.loadOrdersPerDate()
  }
  
  loadProductsStock() {
    this.apiService.getAllProducts().subscribe((data: any) => {
      const backgroundColors = data.map((_: any, index: any) => this.colors[index % this.colors.length])
      this.productsGraph = {
        labels: data.map((p: { name: any; }) => p.name),
        datasets: [{
          label: 'Stock',
          data: data.map((p: { stock: any; }) => p.stock), 
          borderWidth: 1,
          backgroundColor: backgroundColors
        }]
      };
    })
  }

  loadProductsPerOrders() {
    this.apiService.getAllOrders().subscribe((data: any) => {
      const backgroundColors = data.data.map((_: any, index: any) => this.colors[index % this.colors.length])
      const nbOrders = data.total
      const products = data.data.map((o: { products: any; }) => o.products).flat()

      const groupByRef: any = {}

      products.forEach((item: {
        product: {
          reference: string
        },
        quantity: number
      }) => {
        const {reference} = item.product
        if(!groupByRef[reference]) {
          groupByRef[reference] = 0
        } 
        groupByRef[reference] += item.quantity
      })

      this.productsPerOrdersGraph = {
        labels: Object.keys(groupByRef),
        datasets: [{
          label: `Nombre de fois que le produit a été commandé sur ${nbOrders} commandes`,
          data: Object.values(groupByRef),
          borderWidth: 1,
          backgroundColor: backgroundColors
        }]
      }
    })
  }

  loadOrders() {
    this.apiService.getAllOrders().subscribe((data: any) => {
      this.nbOrders = data.total
    })
  }

  loadOrdersPerStatus() {
    this.apiService.getAllOrders().subscribe((data: any) => {
      const groupByStatus: any = {}

      data.data.forEach((order: { state: string; }) => {
        const {state} = order
        if(!groupByStatus[state]) {
          groupByStatus[state] = 0
        }
        groupByStatus[state]++
      })

      this.ordersPerStateGraph = {
        labels: Object.keys(groupByStatus),
        datasets: [{
          label: 'Nombre de commandes',
          data: Object.values(groupByStatus),
          borderWidth: 1
        }]
      }
    })
  }

  loadOrdersPerDate() {
    this.apiService.getAllOrders().subscribe((data: any) => {
      const groupByDate: any = {}

      data.data.forEach((order: { createdAt: string; }) => {
        const {createdAt} = order
        const date = new Date(createdAt).toLocaleDateString()
        if(!groupByDate[date]) {
          groupByDate[date] = 0
        }
        groupByDate[date]++
      })

      this.nbOrdersPerDateGraph = {
        labels: Object.keys(groupByDate),
        datasets: [{
          label: 'Nombre de commandes',
          data: Object.values(groupByDate),
          borderWidth: 1,
          fill: true,
          tension: 0.4
        }]
      }
    })
  }
}
