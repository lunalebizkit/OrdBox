import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { environment } from '../../../../../environments/environment';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { InvoiceCustomerSearchComponent } from "../invoice-customer-search/invoice-customer-search.component";
import { CustomerModel } from "../../customers/model/customer.model";
import { EntityService } from "../../customers/customer.service";
import { ProductsModel } from "../../products/model/product.model";
import { InvoiceProductSearchComponent } from "../invoice-product-search/invoice-product-search.component";
import { InvoiceDetails } from "../model/invoice.model";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";

@Component({
  selector: 'app-invoices-edit',
  templateUrl: './invoices-edit.component.html',
  styleUrls: ['./invoices-edit.component.css']
})
export class InvoicesEditComponent extends BaseComponent implements OnInit {

  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
   @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<string>;
  }>;

   /*
  ** Catidad total de productos
  */
  totalItems = 0;
  isLoading!: boolean;
  loading!: boolean;
  isSaving!: boolean;
  form!: FormGroup;
  formProductSearch!: FormGroup;
  id!: number;
  name = environment.name;
  date = Date.now();
  startDate = Date.now();
  type = [{ value: 1, label: 'A' },
  { value: 2, label: 'B' },
  { value: 3, label: 'C' }];
  payment = [{ value: 1, label: 'Contado' },
  { value: 2, label: 'Cuenta Corrriente' },
  { value: 3, label: 'Tarjeta' }];
   /*
  ** Lista de Productos
  */
  productList : ProductsModel[] = [];
  customer: CustomerModel[]=[];
  invoiceDetailsList: InvoiceDetails[]= [];
  /*
** Parametros de busqueda
*/
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10
  };
  paymentSelected: any;

  constructor(
    private fb: FormBuilder,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private drawerService: NzDrawerService
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      dateTime: [new Date(this.startDate), Validators.required],
      type: ['', Validators.required],
      payment: ['', Validators.required],
      address: ['', Validators.required],
      customerCuit: ['', Validators.required],
      customerName: ['', Validators.required],
    })
    this.formProductSearch= this.fb.group({
      code: [''],
      description: ['']
    })
  }
  ngOnInit(): void {

  }
  search(): void {
    this.queryParams.page = 0;
    this.getData(this.queryParams);
  }

  getData(params: any): void {

  }
  typeSelectedChange(id: any): void { }

  paymentSelectedChange(id: any): void { 
    this.paymentSelected = id;
  }

  openComponentCustomer(): void {
    const drawerRefCustomer = this.drawerService.create<InvoiceCustomerSearchComponent, {}, CustomerModel>({
      nzTitle: 'Cliente',
      nzContent: InvoiceCustomerSearchComponent,
      nzSize: 'large'
    });
    drawerRefCustomer.afterClose.subscribe(data =>{     
       this.form.controls['address'].setValue(data.address);
       this.form.controls['customerCuit'].setValue(data.cuit);
       this.form.controls['customerName'].setValue(data.name);  
    }
  )}

    openComponentProduct(): void {
      const drawerRefProduct = this.drawerService.create<InvoiceProductSearchComponent, {}, InvoiceDetails>({
        nzTitle: 'Productos',
        nzContent: InvoiceProductSearchComponent,
        nzSize: 'large'
      });
  
      drawerRefProduct.afterClose.subscribe(data =>{ 
        if (this.invoiceDetailsList.find( item => item.productId == data.productId)) {
          this.invoiceDetailsList.filter(item => item.productId == data.productId)[0].quantity += data.quantity;
        }else {
          this.invoiceDetailsList.push(data);
        }
      } 
       ) 
      }
   
      
    

    handleOk() {
      this.invoiceDetailsList = this.invoiceDetailsList.
      filter( element => element.productId != this.popupComponent.elementSelectedToDelete);
      this.popupComponent.isDeleteConfirmationVisible = false;
   
    }
}





