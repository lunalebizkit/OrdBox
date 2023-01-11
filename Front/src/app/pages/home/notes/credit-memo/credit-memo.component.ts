import { formatCurrency, formatDate } from '@angular/common';
import { Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { EntityService } from '../../customers/customer.service';
import { CustomerModel } from '../../customers/model/customer.model';
import { InvoiceCustomerSearchComponent } from '../../invoices/invoice-customer-search/invoice-customer-search.component';
import { InvoiceProductSearchComponent } from '../../invoices/invoice-product-search/invoice-product-search.component';
import { InvoiceService } from '../../invoices/invoices.service';
import { ePayment } from '../../invoices/model/invoice-payment.Enum';
import { eInvoiceType, InvoiceType } from '../../invoices/model/invoice-type.Enum';
import {InvoiceDetails, InvoiceModel } from '../../invoices/model/invoice.model';
import { IvaType } from '../../invoices/model/iva-type.Enum';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';
import { creditMemoDetailFromInvoiceParser, CreditMemoDetailList, creditMemoDetailParser, CreditMemoDetails, creditMemoGridFromInvoiceParser, creditMemoGridParser, CreditMemoModel } from '../model/creditMemo.model';
import { NoteService } from '../notes.service';


@Component({
  selector: 'app-credit-memo',
  templateUrl: './credit-memo.component.html',
  styleUrls: ['./credit-memo.component.css'],
})
export class CreditMemoComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;

  cuit!: string;
  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean;
  startDate = this.formaterDate(Date.now());
  ivaTotal: number =0;
  total: number =0;
   editId: number | null = null;
  editIdIva: number | null = null;
  stock!: number;
  productId!:number;
  ownCode! : number;
  code! : number;
  productName!: string;
  quantity!: number;
  price!: number;
  subTotal: number =0;


  iva: number =21 ;
  creditId!:number;
  
  dateTime!: Date;
  invoiceList: InvoiceDetails[]=[]
  creditMemo: CreditMemoModel[]=[];
  creditMemoDetails:CreditMemoDetails[]=[]
  creditMemoListTest: CreditMemoDetailList[] = [];
  creditMemoList: CreditMemoDetailList[] = [];
  formCreditMemo: FormGroup;
  formCustomerSearch!: FormGroup;
  formProductSearch: FormGroup;
  product: any;
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10
  };
  paymentSelected: any;
  payment: { value: string; label: string }[] = Object.entries(ePayment).map(([value, label]) => ({ value, label }))
  id:number= this.route.snapshot.queryParams['id']
  invoiceA: boolean= true;
   type = InvoiceType; 
  type1!:number 
  ivaType = IvaType;
  typeSelectedId: number = 1;
  ivaSelectedId: number = 1;
  ivaSelected!: number;
  totalItems: any;


  edit:boolean=false
  customerId!: number;
 

  
constructor(@Inject(LOCALE_ID) public locale: string,
  private serviceInvoice: InvoiceService,
  private serviceProduct: ProductService,
  public service: NoteService,
  private serviceEntity: EntityService,
  public serviceUser: AuthService,
  private fb: FormBuilder,
  private router: Router,
  private route: ActivatedRoute,
  private drawerService: NzDrawerService,
  notificacionService: NzNotificationService,
  el: ElementRef,
  message: NzMessageService,

 
  ){super(notificacionService, el, message);
    this.formCreditMemo = this.fb.group({
    dateTime: [new Date(this.startDate), Validators.required],
    address: ['', Validators.required],
    customerCuit: ['', Validators.required],
    customerName: ['', Validators.required],    
    observation: ['']
  }); 
  this.formCustomerSearch = this.fb.group({})
  this.formProductSearch = this.fb.group({
    productSearchFilter: ['']
  })}

  userId:number= this.serviceUser.currentUser.id

  ngOnInit(): void {
    if (this.id != null || this.id != undefined || this.id != 0) {
       this.getInvoice(this.id)
       }
    }

    getInvoice(id: number): void {
      if (id != 0)
      this.serviceInvoice.getInvoiceById(id).subscribe({
          next: (r: InvoiceModel) => {
            this.type1 = r.type, 
            this.customerId= r.customerId
            this.formCreditMemo.controls['address'].setValue(r.customerAddress),
            this.formCreditMemo.controls['customerCuit'].setValue(r.customerCuit),
            this.formCreditMemo.controls['customerName'].setValue(r.customerName),
            this.ivaTotal= r.ivaTotal,
            this.total= r.total,
            this.userId = r.userId,
            this.subTotal= r.total - r.ivaTotal;          
            this.isLoading = false;
            /**parse a Grilla */
             r.invoiceDetails.forEach(modelDetail=>{
            const model = creditMemoGridFromInvoiceParser(modelDetail)
            this.creditMemoListTest.push(model) 
            })  
            this.creditMemoList = this.creditMemoListTest;
            /**Parseo al back */
            r.invoiceDetails.forEach(model=>{
              const modelDetail = creditMemoDetailFromInvoiceParser(model);
            this.creditMemoDetails.push(modelDetail);  
            })
            
          this.totalCalculate()
        },


          error: () => { this.isLoading = false;
          this.creditMemoDetails=[];
        this.creditMemoList= [];
      this.creditMemoListTest=[] }
      })
    }
    save(): void {
      if (this.isValidForm(this.formCreditMemo)) {
        if (this.creditMemoDetails.length == 0) {
          this.showMessageError('No hay Productos Seleccionados');
  
        } else {
          const model: CreditMemoModel = {  
            id: 0,
            customerId: this.customerId,
            userId: this.userId,
            customerName: this.formCreditMemo.controls['customerName'].value,
            customerCuit: this.formCreditMemo.controls['customerCuit'].value,
            customerAddress: this.formCreditMemo.controls['address'].value,
            observation: this.formCreditMemo.controls['observation'].value,
            dateTime: this.formCreditMemo.controls['dateTime'].value,
            total: this.total,
            ivaTotal: this.ivaTotal ,
            creditMemoNumb: 0,
            creditMemoDetail: this.creditMemoDetails
          };
          this.isSaving = true;
          this.service.saveCreditMemo(model)
            .subscribe({
              next: (r) => {              
                this.showNotificationSuccess(
                  'Guardado correcto',
                  `Nota de Crédito creada correctamente`
                  
                );
                this.isSaving = false;
                console.log(this.total);
                
                this.router.navigate(['/notes/creditList']);
              },
              error: () => {
                this.isSaving = false;
                this.showMessageError('No se pudo crear la Nota de Crédito')
              }
            });
        }
      }
    };
 

      formaterDate(date: string | number | Date): string {
        return formatDate(date, 'MM/dd/YYYY', this.locale);
      }
     
      totalCalculate(): void {    
        this.subTotal = 0;
        this.total = 0;
        this.ivaTotal = 0;
        try {
          this.creditMemoList.forEach(detail => {
            this.subTotal +=  detail.price * detail.quantity -
            this.ivaCalculate(detail.price * detail.quantity, detail.iva);         
          });
          this.creditMemoList.forEach( (dato) => {
            this.ivaTotal += this.ivaTotal + this.ivaCalculate(
              dato.price  * dato.quantity,
               dato.iva
            );
           this.total += dato.price  * dato.quantity ;     
          });
        } catch (error) {}   
      };
      ivaCalculate(data: number, iva:number): number {         
        return (data * iva / 100); 
      }
      currencyFormat(data: any):string  {    
        return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
      } 
     
      
      typeSelectedChange(id: any): void {
        this.typeSelectedId = this.id;    
        if (id == 1) {      
          this.invoiceA = true;
        }else{
          this.invoiceA= false;
        }  
        console.log(this.type1);
          
      }
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
     
  changeIvaValue(iva: number, id: number):void{  
    let newIva= Number(iva);
    try {
      this.creditMemoDetails.filter(
        (detail) => detail.productId == id
      )[0].iva = newIva;

      this.creditMemoList.filter(
        (detail) => detail.productId == id
      )[0].iva = newIva;
       this.totalCalculate();
     this.stopEditIva();
    } catch (error) {
      console.error(error);
    }
  };
   invoiceType(id: any):string{
    return eInvoiceType[id]
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
          this.formCreditMemo.controls['address'].setValue(data.address);
          this.formCreditMemo.controls['customerCuit'].setValue(data.cuit);
          this.formCreditMemo.controls['customerName'].setValue(data.name);
        }
      },
      error: () => {

      }

    })
  };

  openComponentProduct(): void {
    if (this.isValidForm(this.formCreditMemo)) {
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

        next: (data: ProductsModel) => {
          
          if (data != undefined) {
            if (this.creditMemoDetails.find(item => item.productId == data.id)) {
                /*Actualizo la lista que envio al back */
                   this.creditMemoDetails.filter(item => item.productId == data.id)[0]
                  .quantity += 1;                        

                   /*Actualizo la lista de la tabla */
                  let newListElement = this.creditMemoList.filter(item => item.ownCode == data.id)[0];
               
                  newListElement.quantity += 1;
                  newListElement.subTotal += data.salePrice * newListElement.quantity;
                
                  this.totalCalculate();
                  this.isLoading= false;
                  this.formProductSearch.controls['productSearchFilter'].setValue('');
                }else {

                  /* Parseo dato a la grilla de Tabla */
              const model: CreditMemoDetailList = creditMemoGridParser(data, this.iva);
             this.creditMemoListTest.push(model)
                      
             this.creditMemoList = this.creditMemoListTest;
             /* Parseo dato a Dto Factura Detalle */
             const modelDetail : CreditMemoDetails = creditMemoDetailParser(data, this.iva);
             this.creditMemoDetails.push(modelDetail);  
                           
            this.totalCalculate();
            this.isLoading= false;
            this.formProductSearch.controls['productSearchFilter'].setValue('');
             }
          }},
          error: () => {
            this.isLoading= false;
            this.creditMemoList = [];
            this.formProductSearch.controls['productSearchFilter'].setValue('');
          }

        })
    } else { return; }
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
            if (this.creditMemoDetails.find(item => item.productId == model.id)) {
              /*Actualizo la lista que envio al back */
                 this.creditMemoDetails.filter(item => item.productId == model.id)[0]
                .quantity += 1;                        

                 /*Actualizo la lista de la tabla */
                this.creditMemoList.filter(item => item.ownCode == model.id)[0]
                .quantity += 1;

                 this.creditMemoList.filter(item => item.ownCode == model.id)[0]
                .subTotal +=  model.salePrice * model.quantity ;
                this.totalCalculate(); 
                this.isLoading= false;
                this.formProductSearch.controls['productSearchFilter'].setValue('');
              }else {
             const product: ProductsModel= r.data[0];  
                  /* Parseo el Producto a la grilla de Tabla */
                  const model: CreditMemoDetailList = creditMemoGridParser(product, this.iva);
                  this.creditMemoListTest.push(model)
                  this.creditMemoList = this.creditMemoListTest;
                    /* Parseo dato a Dto Factura Detalle */
             const modelDetail : CreditMemoDetails = creditMemoDetailParser(product, this.iva);
             this.creditMemoDetails.push(modelDetail);           
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
  searchCustomer(): void {
    this.cuit =
      this.formCreditMemo.controls['customerCuit'].value;
    if (this.cuit !== ' '){
      this.formCreditMemo.controls['address'].setValue('customerAddress');
      this.formCreditMemo.controls['customerCuit'].setValue('customerCuit');
      this.formCreditMemo.controls['customerName'].setValue('customerName');
      this.customerId= 0;
      return;
    }else{
    if (this.cuit.length >= 6) {
      this.serviceEntity.getByCuit(this.cuit).subscribe({
        next: (data) => {
          this.formCreditMemo.controls['address'].setValue(data.address);
          this.formCreditMemo.controls['customerCuit'].setValue(data.cuit);
          this.formCreditMemo.controls['customerName'].setValue(data.name);
        },
        error: () => {this.showMessageError('No se encontro Cliente'); }
      });
    }}
  };

  changeQuantity(quantity: number):void{
    if (quantity == 0 || quantity == null){
      quantity= 1;
    }
    let product= this.creditMemoList.filter(
      detail => detail.ownCode == this.editId)[0];

    this.creditMemoList.filter(
      detail => detail.ownCode == this.editId
      )[0].subTotal= quantity * product.price;

    this.totalCalculate();
    this.creditMemoDetails.filter(
      detail => detail.productId == this.editId
      )[0].quantity= quantity;
      
  };

  handleOk() {
    try {
      this.creditMemoListTest = this.creditMemoList.
      filter(element => element.ownCode != this.popupComponent.elementSelectedToDelete);
      this.creditMemoDetails= this.creditMemoDetails.
      filter(element => element.productId != this.popupComponent.elementSelectedToDelete);
    this.popupComponent.isDeleteConfirmationVisible = false;
    if (this.creditMemoListTest.length == 0){
      this.creditMemoList= []
    } else{
      this.creditMemoList = this.creditMemoListTest;
    }
   
    this.totalCalculate();
    } catch (error) {
      console.log(error);
      
    }
  };
  msjConfirmOk(){
    try {
      this.creditMemoList = this.creditMemoList.
       filter(element => element.ownCode != this.popupComponent.elementSelected);
     this.popupComponent.isConfirmationvisible = false; 
     if (this.creditMemoList.length != 0 ){
       this.save();
     } else{
       this.showMessageError('No ha seleccionado producto')
     }
     } catch (error) {
       console.log(error);
       
     }
  }

  
  
}