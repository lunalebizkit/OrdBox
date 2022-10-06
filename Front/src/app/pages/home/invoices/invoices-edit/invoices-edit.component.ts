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
import { ProductService } from "../../products/product.service";
@Component({
  selector: 'app-invoices-edit',
  templateUrl: './invoices-edit.component.html',
  styleUrls: ['./invoices-edit.component.css']
})
export class InvoicesEditComponent extends BaseComponent implements OnInit {

  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string },
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
  customer: CustomerModel[] = [];
  invoiceDetailsList: InvoiceDetailList[] = [];
  invoiceDetails: InvoiceDetails[] = [];

  /*
  **Variables de la tabla detalle
  */
  editId: number | null = null;
  editIdIva: number | null = null;
  /*
** Parametros de busqueda
*/
 
  paymentSelected: any;
  cuit!: string;
  product!: string;
  customerId!: number;
  typeSelectedId!: number;
  ivaTotal: number=0;
  invoiceA: boolean= true;

    /*
  ** Parametros de busqueda
  */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10
  };


  constructor(
    private fb: FormBuilder,
    notificacionService: NzNotificationService,
    private serviceEntity: EntityService,
    private serviceProduct: ProductService,
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
      type: [1, Validators.required],
      payment: ['', Validators.required],
      address: ['', Validators.required],
      customerCuit: ['', Validators.required],
      customerName: ['', Validators.required],

    });
   
    this.formCustomerSearch = this.fb.group({})
    this.formProductSearch = this.fb.group({
      productSearchFilter: ['']
    })
  }

  ngOnInit(): void {
    
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
      const drawerRefProduct = this.drawerService.create<InvoiceProductSearchComponent, { filter: string }, ProductsModel>({
        nzTitle: 'Productos',
        nzContent: InvoiceProductSearchComponent,
        nzSize: 'large',
        nzContentParams: {
          filter: this.formProductSearch.controls['productSearchFilter'].value
        },
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

  searchProduct():void {
    this.product= this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter= this.product;
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => {          
          if (r.data.length == 1) {
            const model : ProductsModel= r.data[0];            
            if (this.invoiceDetails.find(item => item.productId == model.id)) {
              /*Actualizo la lista que envio al back */
                 this.invoiceDetails.filter(item => item.productId == model.id)[0]
                .quantity += 1;                        

                 /*Actualizo la lista de la tabla */
                this.invoiceDetailsList.filter(item => item.ownCode == model.id)[0]
                .quantity += 1;

                this.invoiceDetailsList.filter(item => item.ownCode == model.id)[0]
                .subTotal +=  this.bindPrice(model) * model.quantity ;
                this.totalCalculate();

              }else {
             const product: ProductsModel= r.data[0];
             product.quantity= 1; 
            const model: InvoiceDetails = {
              id: 0,
              invoiceId: 0,
              productId: product.id,
              productName: product.description,
              productCode: product.code,
              quantity: product.quantity,
              price: this.bindPrice(product),
              iva: this.iva                        
            };
            
            this.invoiceDetailListMapper(product);
            this.invoiceDetails.push(model);              
          
          this.totalCalculate();
              }
            
          }else{
            this.openComponentProduct();
          }
          
        },
        error: () => { }
      })
    }
  };

  totalCalculate(): void {    
    this.subtotal = 0;
    this.total = 0;
    this.ivaTotal = 0;
    try {
      this.invoiceDetailsList.forEach(detail => {
        this.subtotal +=  ( detail.price * detail.quantity - this.ivaCalculate(detail.price * detail.quantity, detail.iva) ) ;         
      });
      this.invoiceDetailsList.forEach( dato => {
        this.ivaTotal +=  this.ivaCalculate(dato.price  * dato.quantity, dato.iva);
       this.total +=   dato.price  * dato.quantity ;     
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

  ivaCalculate(data: number, iva:number): number {         
    return (data * iva / 100); 
  }

  handleOk() {
    try {
      this.invoiceListTest = this.invoiceDetailsList.
      filter(element => element.ownCode != this.popupComponent.elementSelectedToDelete);
      this.invoiceDetails= this.invoiceDetails.
      filter(element => element.productId != this.popupComponent.elementSelectedToDelete);
    this.popupComponent.isDeleteConfirmationVisible = false;
    if (this.invoiceListTest.length == 0){
      this.invoiceDetailsList= []
    } else{
      this.invoiceDetailsList = this.invoiceListTest;
    }
   
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
          customerName: this.formInvoice.controls['customerName'].value,          
          customerCuit: this.formInvoice.controls['customerCuit'].value,  
          customerAddress: this.formInvoice.controls['address'].value,          
          observation: '',
          dateTime: this.formInvoice.controls['dateTime'].value,
          total: this.totalItems,
          ivaTotal: this.ivaTotal,
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

  startEdit(id: number): void {
    this.editId = id;
  };
  startEditIva(id: number): void {
    this.editIdIva = id;
  }

  stopEdit(): void {
    this.editId = null;
  };
  stopEditIva(): void {
    this.editIdIva = null;
  }
  changeQuantity(quantity: number):void{
    if (quantity == 0 || quantity == null){
      quantity= 1;
    }
    let product= this.invoiceDetailsList.filter(detail => detail.ownCode == this.editId)[0];

    this.invoiceDetailsList.filter(detail => detail.ownCode == this.editId)[0].subTotal= quantity * product.price;

    this.totalCalculate();
    this.invoiceDetails.filter(detail => detail.productId == this.editId)[0].quantity= quantity;
      
  };
  changeIvaValue(iva: number):void{    
    if (iva == 0 || iva == null){
      iva = 1;
    }
    try {
      this.invoiceDetailsList.filter(detail => detail.ownCode == this.editIdIva)[0].iva= iva;     
    
      this.invoiceDetails.filter(detail => detail.productId == this.editIdIva)[0].iva= iva;
      this.totalCalculate();
    } catch (error) {
      console.error(error);
      
    };    
  };
}





