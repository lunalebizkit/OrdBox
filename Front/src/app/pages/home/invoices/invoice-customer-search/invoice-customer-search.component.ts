import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EntityService } from '../../customers/customer.service';
import { CustomerModel } from '../../customers/model/customer.model';

@Component({
  selector: 'app-invoice-customer-search',
  templateUrl: './invoice-customer-search.component.html',
  styleUrls: ['./invoice-customer-search.component.css']
})
export class InvoiceCustomerSearchComponent implements OnInit {

  timeout!: any;
  allCustomer : CustomerModel[] = [];
  customer! : CustomerModel;
  
  formSearch!: FormGroup;
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 20
  };
  totalItems = 0;
  isLoading = false;
  loading = false;
  customerId!: number;
  
  constructor(
    private drawerRef: NzDrawerRef<string>,
    private serviceEntity: EntityService,
    private fb: FormBuilder) {
      this.formSearch = this.fb.group({          
                    
      })
    } 

  ngOnInit(): void {
    this.getAllCustomer();
   }

  close(): void {
    this.drawerRef.close(this.customer);  
  }
  /*
** Evento de busqueda datos en el server
*/
  onSearch(): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {

      if (this.queryParams.filter.length > 2) {
        this.allCustomer = [];
        this.getAllCustomer();
      }      
      
    }, 1000);
  }
 /*
  ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
  */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.page = params.pageIndex -1;
    this.queryParams.pageSize = params.pageSize;
    this.getAllCustomer();
  }

  getAllCustomer(): void {
    this.loading = true;
    this.serviceEntity.getCustomers(this.queryParams).subscribe({
      next: (r) => {
        this.allCustomer = r.data;
        this.totalItems= r.totalCount;
        this.loading = false;
      },
      error: () => {
        this.allCustomer = [];
        this.loading = false;
      }
    })
  }


 selecccion(dato: any){  
 this.customerId= dato.composedPath()[1].id;
  this.customer=this.allCustomer.filter(id => id.id == this.customerId)[0];  
  this.close();
 }
}
