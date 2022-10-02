import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
import { InvoiceDetailList, InvoiceDetails, InvoiceModel } from "../model/invoice.model";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { InvoiceService } from "../invoices.service";
import { Router } from "@angular/router";
import { ePayment } from "../model/invoice-payment.Enum";
import { InvoiceType } from "../model/invoice-type.Enum";
import { formatCurrency } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';
@Component({
  selector: 'app-invoices-edit',
  templateUrl: './invoices-edit.component.html',
  styleUrls: ['./invoices-edit.component.css']
})
export class InvoicesEditComponent extends BaseComponent implements OnInit {

  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    drawerRef: NzDrawerRef<string>;
  }>;

  /*
 ** Catidad total de productos
 */
  totalItems: number=0;
  subtotal: number=0;
  iva: number=21;
  total: number=0;
  userId = 5;
  invoiceListTest: InvoiceDetailList[] = [];

  isLoading!: boolean;
  loading!: boolean;
  isSaving!: boolean;

  formInvoice!: FormGroup;
  formProductSearch!: FormGroup;
  formProduct!: FormGroup;
  formCustomerSearch!: FormGroup;
  formInvoiceModel!: FormGroup;


  name: string = environment.name;
  date = Date.now();
  startDate = Date.now();
  type = InvoiceType;
  payment: { value: string; label: string }[] = Object.entries(ePayment).map(([value, label]) => ({ value, label }))
  /*
 ** Lista de Productos
 */
  productList: ProductsModel[] = [];
  customer: CustomerModel[] = [];
  invoiceDetailsList: InvoiceDetailList[] = [];
  invoiceDetails: InvoiceDetails[] = [];
  /*
** Parametros de busqueda
*/
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10
  };
  paymentSelected: any;
  cuit!: string;
  customerId!: number;
  typeSelectedId!: number;
  ivaTotal: number=0;
  invoiceA: boolean= false;

  constructor(
    private fb: FormBuilder,
    notificacionService: NzNotificationService,
    private serviceEntity: EntityService,
    private serviceInvoice: InvoiceService,
    el: ElementRef,
    private router: Router,
    message: NzMessageService,
    private drawerService: NzDrawerService,
    @Inject(LOCALE_ID) public locale: string
     ) {
    super(notificacionService, el, message);
    this.formInvoice = this.fb.group({
      dateTime: [new Date(this.startDate), Validators.required],
      type: ['', Validators.required],
      payment: ['', Validators.required],
      address: ['', Validators.required],
      customerCuit: ['', Validators.required],
      customerName: ['', Validators.required],

    });
   
    this.formCustomerSearch = this.fb.group({})
    this.formProductSearch = this.fb.group({})
  }

  ngOnInit(): void {
    this.invoiceDetailsList = [];
  }

  typeSelectedChange(id: any): void {
    this.typeSelectedId = id;    
    if (id == 1) {      
      this.invoiceA = true;
    }else{
      this.invoiceA= false;
    }
  }

  paymentSelectedChange(id: any): void {
    this.paymentSelected = id;
  }

  openComponentCustomer(): void {
    const drawerRefCustomer = this.drawerService.create<InvoiceCustomerSearchComponent, {}, CustomerModel>({
      nzTitle: 'Cliente',
      nzContent: InvoiceCustomerSearchComponent,
      nzSize: 'large',
      nzClosable: false
    });
    drawerRefCustomer.afterClose.subscribe({
      next: (data) => {
        if (data != undefined) {
          this.customerId = data.id;
          this.formInvoice.controls['address'].setValue(data.address);
          this.formInvoice.controls['customerCuit'].setValue(data.cuit);
          this.formInvoice.controls['customerName'].setValue(data.name);
        }
      },
      error: () => {

      }

    })
  };

  openComponentProduct(): void {
    if (this.isValidForm(this.formInvoice)) {
      const drawerRefProduct = this.drawerService.create<InvoiceProductSearchComponent, {}, ProductsModel>({
        nzTitle: 'Productos',
        nzContent: InvoiceProductSearchComponent,
        nzSize: 'large',
        nzClosable: false
      });

      drawerRefProduct.afterClose.subscribe({

        next: (data) => {
          if (data != undefined) {
            if (this.invoiceDetails.find(item => item.productId == data.id)) {
                /*Actualizo la lista que envio al back */
                   this.invoiceDetails.filter(item => item.productId == data.id)[0]
                  .quantity += data.quantity;                        

                   /*Actualizo la lista de la tabla */
                  this.invoiceDetailsList.filter(item => item.ownCode == data.id)[0]
                  .quantity += data.quantity;

                  this.invoiceDetailsList.filter(item => item.ownCode == data.id)[0]
                  .subTotal +=  this.bindPrice(data) * data.quantity ;
                  this.totalCalculate();

                }else {
              const model: InvoiceDetails = {
                id: 0,
                invoiceId: 0,
                productId: data.id,
                productName: data.description,
                productCode: data.code,
                quantity: data.quantity,
                price: this.bindPrice(data),
                iva: this.iva                        
              };
              
              this.invoiceDetailListMapper(data);
              this.invoiceDetails.push(model);              
            
            this.totalCalculate();
                }
          }},
          error: () => {
            this.invoiceDetailsList = [];
          }

        })
    } else { return; }
  };
 
  searchCustomer(): void {
    this.cuit =
      this.formInvoice.controls['customerCuit'].value;
    if (this.cuit.length >= 6) {
      this.serviceEntity.getByCuit(this.cuit).subscribe({
        next: (data) => {
          this.formInvoice.controls['address'].setValue(data.address);
          this.formInvoice.controls['customerCuit'].setValue(data.cuit);
          this.formInvoice.controls['customerName'].setValue(data.name);
        },
        error: () => {this.showMessageError('No se encontro Cliente'); }
      });
    }

  };

  totalCalculate(): void {    
    this.subtotal = 0;
    this.total = 0;
    this.ivaTotal = 0;
    try {
      this.invoiceDetailsList.forEach(detail => {
        this.subtotal +=  detail.price * detail.quantity;                
      });
      this.invoiceDetailsList.forEach( dato => {
        this.ivaTotal +=  this.ivaCalculate(dato.price)  * dato.quantity ;
       this.total +=   (dato.price + this.ivaCalculate(dato.price))  * dato.quantity ;     
      })
    } catch (error) {
      console.log(error)
    }   
  };

  currencyFormat(data: any):string  { return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')}

  invoiceDetailListMapper(product: ProductsModel) {
    const model: InvoiceDetailList = {
      ownCode: product.id,
      code: product.code,
      productName: product.description,
      quantity: product.quantity,
      price: this.bindPrice(product),
      subTotal: this.bindPrice(product) * product.quantity,
      iva: this.iva,
    };
    this.invoiceListTest.push(model);
    this.invoiceDetailsList = this.invoiceListTest;
  };

  bindPrice(data: ProductsModel): number {
    const typePayment = this.paymentSelected;
    var a = Object.keys(data).filter(type => (type == typePayment));
    switch (a[0]) {
      case 'cardSalePrice':
        return data.cardSalePrice;

      case 'salePrice':
        return data.salePrice;

      default:
        return data.cashSalePrice;
    }
  };

  ivaCalculate(data: number): number {
    const iva:number = this.iva;      
    return (data * iva / 100); 
  }

  handleOk() {
    try {
      this.invoiceListTest = this.invoiceDetailsList.
      filter(element => element.ownCode != this.popupComponent.elementSelectedToDelete);
      this.invoiceDetails= this.invoiceDetails.
      filter(element => element.productId != this.popupComponent.elementSelectedToDelete);
    this.popupComponent.isDeleteConfirmationVisible = false;
    this.invoiceDetailsList = this.invoiceListTest;
    this.totalCalculate();
    } catch (error) {
      console.log(error);
      
    }
  };
  save(): void {
    if (this.isValidForm(this.formInvoice)) {
      if (this.invoiceDetails.length == 0) {
        this.showMessageError('No hay Productos Seleccionados');

      } else {
        const model: InvoiceModel = {
          id: 0,
          customerId: this.customerId,
          userId: this.userId,
          invoiceNumber: this.totalItems,
          total: this.totalItems,
          ivaTotal: this.ivaTotal,
          customerAddress: this.formInvoice.controls['address'].value,
          customerCuit: this.formInvoice.controls['customerCuit'].value,
          customerName: this.formInvoice.controls['customerName'].value,
          observation: '',
          dateTime: this.formInvoice.controls['dateTime'].value,
          type: this.typeSelectedId,
          invoiceDetails: this.invoiceDetails
        };
        this.isSaving = true;
        this.serviceInvoice.saveInvoice(model)
          .subscribe({
            next: () => {
              this.showNotificationSuccess(
                'Guardado correcto',
                `Comprobante creado correctamente`
              );
              this.isSaving = false;
              this.router.navigate(['/home/products/list']);

            },
            error: () => {
              this.isSaving = false;
              this.showMessageError('No se pudo crear el Comprobante')
            }
          });
      }
    }
  };
}





