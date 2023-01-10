import { formatCurrency, formatDate } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { InvoiceService } from '../../invoices/invoices.service';
import { ePayment } from '../../invoices/model/invoice-payment.Enum';
import { eInvoiceType, InvoiceType } from '../../invoices/model/invoice-type.Enum';
import { InvoiceDetailList, invoiceDetailParser, InvoiceDetails, invoiceGridParser, InvoiceModel } from '../../invoices/model/invoice.model';
import { IvaType } from '../../invoices/model/iva-type.Enum';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';
/* import { CreditMemoDetails, CreditMemoModel } from '../model/creditMemo.model'; */

@Component({
  selector: 'app-credit-memo',
  templateUrl: './credit-memo.component.html',
  styleUrls: ['./credit-memo.component.css'],
})
export class CreditMemoComponent implements OnInit {

  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean;


  startDate = this.formaterDate(Date.now());
  customerAddress!: string;
  customerCuit!: string;
  customerName!: string;
  observation!: string;
  invoiceNumber!: number;
  ivaTotal!: number;
  total!: number;
  editId: number | null = null;
  editIdIva: number | null = null;
  stock!: number;
  productId!:number;
  ownCode! : number;
  code! : number;
  productName!: string;
  quantity!: number;
  price!: number;
  subTotal!: number;
  iva!: number ;
  
  dateTime!: Date;
  invoiceDetails: InvoiceDetails[] = []
  invoiceDetailsList: InvoiceDetailList[] = []; 
  formCreditMemo: FormGroup;
  payment: { value: string; label: string }[] = Object.entries(ePayment).map(([value, label]) => ({ value, label }))
  formProductSearch: FormGroup;
  product: any;
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10
  };
  paymentSelected: any;
  id:number= this.route.snapshot.queryParams['id']
  invoiceA: boolean= true;
   type = InvoiceType; 
  type1!:number 
  ivaType = IvaType;
  typeSelectedId: number = 1;
  ivaSelectedId: number = 1;
  ivaSelected!: number;

  
  constructor(@Inject(LOCALE_ID) public locale: string,
  private serviceInvoice: InvoiceService,
  private serviceProduct: ProductService,
  public serviceUser: AuthService,
  private fb: FormBuilder,
  private route: ActivatedRoute,

 
  ){ this.formCreditMemo = this.fb.group({
    dateTime: [new Date(this.startDate), Validators.required],
    type: [1, Validators.required],
    payment: ['', Validators.required],
    address: [this.customerAddress, Validators.required],
    customerCuit: [this.customerCuit, Validators.required],
    customerName: [this.customerName, Validators.required],    
    observation: ['']
  }); 
  this.formProductSearch = this.fb.group({
    productSearchFilter: ['']
  })}

  userId:number= this.serviceUser.currentUser.id
  ngOnInit(): void {
       this.getInvoice(this.id)
       console.log(this.id)
       console.log(this.type)
    }
   
    getInvoice(id: number): void {
      if (id != 0)
      this.serviceInvoice.getInvoiceById(id).subscribe({
          next: (r: InvoiceModel) => {
            this.type1 = r.type, 
            this.customerAddress = r.customerAddress,
            this.customerCuit = r.customerCuit,
            this.customerName = r.customerName,
            this.observation = r.observation,
            this.invoiceNumber= r.invoiceNumber,
            this.ivaTotal= r.ivaTotal,
            this.total = r.total,
            this.userId = r.userId,
            this.dateTime = r.dateTime,
            this.invoiceDetails = r.invoiceDetails
            this.subTotal= r.total - r.ivaTotal;          
            this.isLoading = false;
            console.log(r);
            
          },
          error: () => { this.isLoading = false; }
      })
    }
   


      formaterDate(date: string | number | Date): string {
        return formatDate(date, 'MM/dd/YYYY', this.locale);
      }
     
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
      totalCalculate(): void {    
        this.subTotal = 0;
        this.total = 0;
        this.ivaTotal = 0;
        try {
          this.invoiceDetailsList.forEach(detail => {
            this.subTotal +=detail.price * detail.quantity -
            this.ivaCalculate(detail.price * detail.quantity, detail.iva);         
          });
          this.invoiceDetailsList.forEach( (dato) => {
            this.ivaTotal += this.ivaCalculate(
              dato.price  * dato.quantity,
               dato.iva
            );
           this.total +=  dato.price  * dato.quantity ;     
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
   invoiceType(id: any):string{
    return eInvoiceType[id]
  }
}