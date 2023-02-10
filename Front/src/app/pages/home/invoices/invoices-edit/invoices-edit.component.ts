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
import { InvoiceDetailList, InvoiceDetails, InvoiceModel, invoiceGridParser, invoiceDetailParser } from "../model/invoice.model";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { InvoiceService } from "../invoices.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ePayment } from "../model/invoice-payment.Enum";
import { InvoiceType } from "../model/invoice-type.Enum";
import { formatCurrency, formatDate } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';
import { ProductService } from "../../products/product.service";
import { AuthService } from "src/app/common/auth/interceptors/auth.service";
import { PeriodsService } from "../../periods/periods.service";
import { IvaType } from "../model/iva-type.Enum";



@Component({
  selector: 'app-invoices-edit',
  templateUrl: './invoices-edit.component.html',
  styleUrls: ['./invoices-edit.component.css']
})
export class InvoicesEditComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string },
    drawerRef: NzDrawerRef<string>;
  }>;

  /*
 ** Cantidad total de productos
 */
  type = InvoiceType;
  ivaType = IvaType;
  typeSelectedId: number = 1;
  ivaSelectedId: number = 1;
  ivaSelected!: number;
  iva10: number = parseFloat('10.5');
  iva21: number = 21;
  iva27: number = 27;
  totalItems: number=0;
  subtotal: number=0;
  iva: number=21;
  total: number=0;
  invoiceListTest: InvoiceDetailList[] = [];
  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean;
  formInvoice!: FormGroup;
  formProductSearch!: FormGroup;
  formProduct!: FormGroup;
  formCustomerSearch!: FormGroup;
  formInvoiceModel!: FormGroup;


  name: string = environment.name;
  date = Date.now();
  startDate = this.formaterDate(Date.now());
  
  payment: { value: string; label: string }[] = Object.entries(ePayment).map(([value, label]) => ({ value, label }))
  
  /*
 ** Lista de Productos
 */  
  customer: CustomerModel[] = [];
  invoiceDetailsList: InvoiceDetailList[] = [];
  invoiceDetails: InvoiceDetails[] = []

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
  ivaTotal: number=0;
  invoiceA: boolean= true;
  value!: string;
  value1!: string;
  value2!: string;
  value3!: string;


    /*
  ** Parametros de busqueda
  */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10
  };

  selectedDni: boolean = false;
  dni!: number ;
   
  constructor(
    private fb: FormBuilder,
    notificacionService: NzNotificationService,
    private serviceEntity: EntityService,
    private serviceProduct: ProductService,
    private serviceInvoice: InvoiceService,
    public serviceUser: AuthService,
    public servicePeriod: PeriodsService,
    el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
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
      customerDni:['', Validators.maxLength],
      customerName: ['', Validators.required],    
      observation: ['']
    });   
    this.formCustomerSearch = this.fb.group({})
    this.formProductSearch = this.fb.group({
      productSearchFilter: ['']
    })
  }
  userId:number= this.serviceUser.currentUser.id

  ngOnInit(): void {   
  this.servicePeriod.periodActive(this.startDate).subscribe({
    next: () => {
      this.showNotificationSuccess(
        'verificación correcta',
        `Su fecha se encuentra en un período activo`
      );
      this.isSaving = false;
    },
    error: () => {
      this.isSaving = false;
      this.showMessageError('No se encontro período activo');
    }

  })
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
      nzWidth: 1050,
      nzClosable: false
    });
    drawerRefCustomer.afterClose.subscribe({
      next: (data) => {
        if (data != undefined) {
          this.customerId = data.id;
          this.formInvoice.controls['address'].setValue(data.address);
          this.formInvoice.controls['customerCuit'].setValue(data.cuit);
          this.formInvoice.controls['customerName'].setValue(data.name);
          this.formInvoice.controls['customerDni'].setValue(data.dni)
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
        nzWidth: 1050,
        nzContentParams: {
          filter: this.formProductSearch.controls['productSearchFilter'].value
        },
        nzClosable: false
      });      
      drawerRefProduct.afterClose.subscribe({

        next: (data: ProductsModel) => {
          
          if (data != undefined) {
            if (this.invoiceDetails.find(item => item.productId == data.id)) {
                /*Actualizo la lista que envio al back */
                   this.invoiceDetails.filter(item => item.productId == data.id)[0]
                  .quantity += 1;                        

                   /*Actualizo la lista de la tabla */
                  let newListElement = this.invoiceDetailsList.filter(item => item.ownCode == data.id)[0];
               
                  newListElement.quantity += 1;
                  newListElement.subTotal += this.bindPrice(data) * newListElement.quantity;
                
                  this.totalCalculate();
                  this.isLoading= false;
                  this.formProductSearch.controls['productSearchFilter'].setValue('');
                }else {

                  /* Parseo dato a la grilla de Tabla */
              const model: InvoiceDetailList = invoiceGridParser(data, this.iva, this.bindPrice(data));
             this.invoiceListTest.push(model)
             this.invoiceDetailsList = this.invoiceListTest;
             /* Parseo dato a Dto Factura Detalle */
             const modelDetail : InvoiceDetails = invoiceDetailParser(data, this.iva, this.bindPrice(data));
             this.invoiceDetails.push(modelDetail);                
            this.totalCalculate();
            this.isLoading= false;
            this.formProductSearch.controls['productSearchFilter'].setValue('');
             }
          }},
          error: () => {
            this.isLoading= false;
            this.invoiceDetailsList = [];
            this.formProductSearch.controls['productSearchFilter'].setValue('');
          }

        })
    } else { return; }
  };
 
  searchCustomer(): void {
    this.cuit =
      this.formInvoice.controls['customerCuit'].value;
    if (this.cuit === '00'){
      this.formInvoice.controls['address'].setValue('S/D');
      this.formInvoice.controls['customerCuit'].setValue('00');
      this.formInvoice.controls['customerName'].setValue('Admin');
      this.customerId= 0;
      return;
    }else{
    if (this.cuit.length >= 6) {
      this.serviceEntity.getByCuit(this.cuit).subscribe({
        next: (data) => {
          this.formInvoice.controls['address'].setValue(data.address);
          this.formInvoice.controls['customerCuit'].setValue(data.cuit);
          this.formInvoice.controls['customerName'].setValue(data.name);
          this.formInvoice.controls['customerDni'].setValue(data.dni)
        },
        error: () => {this.showMessageError('No se encontro Cliente'); }
      });
    }}
  };

  searchProduct():void {
    this.product= this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter= this.product;   
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => { 
          this.isLoading= true;      
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
                this.isLoading= false;
                this.formProductSearch.controls['productSearchFilter'].setValue('');
              }else {
             const product: ProductsModel= r.data[0];  
                  /* Parseo el Producto a la grilla de Tabla */
                  const model: InvoiceDetailList = invoiceGridParser(product, this.iva, this.bindPrice(product));
                  this.invoiceListTest.push(model)
                  this.invoiceDetailsList = this.invoiceListTest;
                    /* Parseo dato a Dto Factura Detalle */
             const modelDetail : InvoiceDetails = invoiceDetailParser(product, this.iva, this.bindPrice(product));
             this.invoiceDetails.push(modelDetail);           
          this.totalCalculate();
          this.isLoading= false;
          this.formProductSearch.controls['productSearchFilter'].setValue('');
          }
            
          }else{
            this.isLoading= false;
            this.openComponentProduct();
          }
          
        },
        error: () => {
          this.isLoading= false;
          this.formProductSearch.controls['productSearchFilter'].setValue(''); }
      })
    }else{
      this.isLoading= false;
      this.queryParams.filter= '';
      this.openComponentProduct();
    }
  };

  formatter = (data: number = 0) =>
  formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');

  totalCalculate(): void {    
    this.subtotal = 0;
    this.total = 0;
    this.ivaTotal = 0;
    try {
      this.invoiceDetailsList.forEach(detail => {
            /**Caluclo subtotal = precio y multiplico por cantidad*/
        this.subtotal += detail.quantity *
        this.ivaCalculate(detail.price, detail.iva);         
      });
      this.invoiceDetailsList.forEach( (dato) => {
        /**Calculo iva restandolo al precio y multiplico por cantidad*/
        this.ivaTotal += (dato.price - this.ivaCalculate(dato.price, dato.iva) ) * dato.quantity;
       this.total +=  dato.price  * dato.quantity ;     
      });
   
    } catch (error) {}   
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
    let newIva =1 + (iva / 100) ;
    return (data / newIva); 
  };


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

  msjConfirmOk(){
    try {
      this.invoiceDetailsList = this.invoiceDetailsList.
       filter(element => element.ownCode != this.popupComponent.elementSelected);
     this.popupComponent.isConfirmationvisible = false; 
     if (this.isValidForm(this.formInvoice) && (this.invoiceDetailsList.length != 0 ) && 
     this.isValidForm(this.formCustomerSearch) && this.isValidForm(this.formProductSearch)){
      this.popComponent.showConfirmation() 
     } else{
       this.showMessageError('No ha seleccionado producto')
     }
     } catch (error) {
       console.log(error);
     }
  }
  
  save(): void {
    if (this.isValidForm(this.formInvoice)) {
      if (this.invoiceDetails.length == 0) {
        this.showMessageError('No hay Productos Seleccionados');

      } else {
        const model: InvoiceModel = {
          id: 0,
          customerId: this.customerId,
          userId:this.userId,
          invoiceNumber: this.totalItems,
          customerName: this.formInvoice.controls['customerName'].value,         
          customerCuit: this.selectedDni? this.dni : this.formInvoice.controls['customerCuit'].value,  
          customerAddress: this.formInvoice.controls['address'].value,          
          observation: this.formInvoice.controls['observation'].value,
          dateTime: this.formInvoice.controls['dateTime'].value,
          total: this.totalItems,
          ivaTotal: this.ivaTotal,
          type: this.formInvoice.controls['type'].value,
          invoiceDetails: this.invoiceDetails,
        };
        this.isSaving = true;
        this.serviceInvoice.saveInvoice(model)
          .subscribe({
            next: (r) => {            
              this.showNotificationSuccess(
                'Guardado correcto',
                `Comprobante creado correctamente`
              );
              this.isSaving = false;
              this.router.navigate(['/home/invoices/invoices-sale']);
            },
            error: (r) => {
              this.isSaving = false;
              this.showMessageError(r.error.descripcion)
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
    let product= this.invoiceDetailsList.filter(
      detail => detail.ownCode == this.editId)[0];

    this.invoiceDetailsList.filter(
      detail => detail.ownCode == this.editId
      )[0].subTotal= quantity * product.price;

    this.totalCalculate();
    this.invoiceDetails.filter(
      detail => detail.productId == this.editId
      )[0].quantity= quantity;
      
  };

  changeIvaValue(iva: number, id: number):void{  
    let newIva= Number(iva);
    try {
      this.invoiceDetails.filter(
        (detail) => detail.productId == id
      )[0].iva = newIva;

      this.invoiceDetailsList.filter(
        (detail) => detail.productId == id
      )[0].iva = newIva;
      this.totalCalculate();

     this.stopEditIva();

    } catch (error) {
      console.error(error);
    }
  };

  back(){    
    this.router.navigate(['../'], { relativeTo: this.route });
  };

  currencyFormat(data: any):string  {    
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
  }

  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'MM/dd/YYYY', this.locale);
  }

  select(dni: any) {
    this.selectedDni = !this.selectedDni;
    if(this.selectedDni){
      this.dni = (this.formInvoice.controls['customerDni'].value).toString()
      if(dni.length < 8){  
      return this.showMessageError('DNI invalido')
      }  
    } 
  }

}

