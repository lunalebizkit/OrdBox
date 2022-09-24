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
  queryData = {
    filter: '',
    page: 0,
    pageSize: 20
  };
  totalItems = 0;
  isLoading = false;
  loading = false;
  customerId: any;
  
  constructor(
    private drawerRef: NzDrawerRef<string>,
    private serviceEntity: EntityService,
    private fb: FormBuilder) {
      this.formSearch = this.fb.group({          
        supplier: [[], ],            
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
  onSearch(value: string): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {

      if (value.length > 2) {
        this.allCustomer = [];
        this.queryData.filter = value;
        this.getAllCustomer();
      }
    }, 1000);
  }
 /*
  ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
  */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryData.page = params.pageIndex -1;
    this.queryData.pageSize = params.pageSize;
    this.getAllCustomer();
  }

  getAllCustomer(): void {
    this.serviceEntity.getEntities(this.queryData).subscribe({
      next: (r) => {
        this.allCustomer = r.data;
        this.totalItems= r.totalCount;
      },
      error: () => {
        this.allCustomer = []
      }
    })
  }


 selecccion(dato: any){  
 this.customerId= dato.path[1].id;
  this.customer=this.allCustomer.filter(id => id.id == dato.path[1].id)[0];  
  this.close();
 }
}
