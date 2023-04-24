import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { environment } from '../../../../../environments/environment';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { CustomerModel } from "../../customers/model/customer.model";
import { EntityService } from "../../customers/customer.service";
import { ProductsModel } from "../../products/model/product.model";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { ActivatedRoute, Router } from "@angular/router";
import { formatCurrency, formatDate } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';
import { ProductService } from "../../products/product.service";
import { InvoiceProductSearchComponent } from "../../invoices/invoice-product-search/invoice-product-search.component";
import { DeliveryNotesDetails, DeliveryNotesModel, deliveryNotesDetailParser, deliveryNotesDetailsList, deliveryNotesGridFromParser, deliveryNotesGridParser} from "../model/deliveryNotes.model";
import { ReceiptSupplierSearchComponent } from "../../invoices/receipt-supplier-search/receipt-supplier-search.component";
import { CustomerAddModel } from "../../customers/model/customer.add.model";
import { deliveryNotesService } from "../deliveryNotes.service";
import { pStatusType, statusType } from "../model/status.model";




@Component({
  selector: 'app-deliveryNotes-edit',
  templateUrl: './deliveryNotes-edit.component.html',
  styleUrls: ['./deliveryNotes-edit.component.css']
})
export class DeliveryNotesEditComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string },
    drawerRef: NzDrawerRef<string>;
  }>;
  edit: boolean= false;
  tipo!: string;
  newStatusPaid!: number;
  @Input() set filter(value: number) {
    this.id = value;
  }


  type = statusType;
  loading = false;
  startDate = this.formaterDate(Date.now());
  formDeliveryNotes!: FormGroup;
  formProductSearch!: FormGroup;
  formProduct!: FormGroup;
  formSupplierSearch!: FormGroup;
  formDeliveryNotesModel!: FormGroup;
  deliveryNotesDetails: DeliveryNotesDetails[] = [];
  deliveryNotesDetailsTest: deliveryNotesDetailsList[] = [];
  deliveryNotesDetailsList: deliveryNotesDetailsList[] = [];
  isLoading: boolean= false;
  id!: number;
  cuit!: string;
  supplierId!: number;
  product!: string;
  editId: number | null = null;
  isSaving!: boolean;
  pagado: boolean = true;
  typeSelectedId: number = 1;
  statusPaid!: string ;
  totalItems: number=0;
  total!: number;
  userId!: number;
  
  name!: string;
  address!:string;
   editIdrecievedQuantity: number | null = null;
  importTotal!: number;
  productId!: number;
  deliveryNotesNumber!:number;
  observation!: string;
  dateTime!: Date;
  paid!: string;
  statusId!:number;
  subTotal!: number;
  ivaTotal!: number;
  

  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10,
  };
  subtotal: number=0;
  idDeliveryNotes = this.route.snapshot.paramMap.get("id");


    constructor( notificacionService: NzNotificationService,
    private serviceEntity: EntityService,
    private serviceProduct: ProductService,
    private service: deliveryNotesService,
    private router: Router,
    private route: ActivatedRoute, 
     el: ElementRef,
     message: NzMessageService,
     private drawerService: NzDrawerService,
     private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string)
    {super(notificacionService, el, message)
      this.formDeliveryNotes = this.fb.group({
        dateTime: [new Date(this.startDate), Validators.required],
        statusId: [1, Validators.required],
        deliveryNotesNumber: ['', Validators.required],
        supplierAddress: ['', Validators.required],
        supplierCuit: ['', [Validators.required, Validators.pattern('[0-9]{11}'),]],
        supplierDni:['',],
        paid:['', Validators.required],
        supplierName: ['', Validators.required],
        observation: [''],
        importTotal:[0, Validators.required]
      });
      this.formSupplierSearch = this.fb.group({});
      this.formProductSearch = this.fb.group({
        productSearchFilter: [''],
      });}
    
    ngOnInit(){
      this.route.params.subscribe(params => {this.id = params['id'] })  
      if ( this.id != undefined){
      this.getDeliveryNotes(this.id) 
    }
    }
   

  getDeliveryNotes(id: number): void {   
    if (this.id != 0 || this.id !== undefined)
      this.service.getDeliveryNotesById(this.id).subscribe({
        next: (r: DeliveryNotesModel) => {
          this.edit= true
           this.id = this.id
           this.formDeliveryNotes.controls['deliveryNotesNumber'].setValue(r.deliveryNotes_number)
            this.statusId= r.statusId
            this.formDeliveryNotes.controls['paid'].setValue(r.paid,)
            this.supplierId= r.supplierId
            this.formDeliveryNotes.controls['supplierAddress'].setValue(r.supplierAddress),
            this.formDeliveryNotes.controls['supplierCuit'].setValue(r.supplierCuit),
            this.formDeliveryNotes.controls['supplierName'].setValue(r.supplierName),
            this.dateTime= r.dateTime
            this.formDeliveryNotes.controls['observation'].setValue(r.observation),
            this.isLoading = false;
            this.deliveryNotesDetails= r.deliveryNotesDetails;
            this.formDeliveryNotes.controls['importTotal'].setValue(r.importTotal) 
             /*Bindeo detalles*/
          r.deliveryNotesDetails.forEach((modelDetail: DeliveryNotesDetails) => {
            const model = deliveryNotesGridFromParser(modelDetail)

          this.deliveryNotesDetailsList.push(model)
          });
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

/*   getTipo(tipo : number):any {
    switch (tipo){
      case  pStatusType.Entregado:
        return this.tipo = 'Entregado'
      case  pStatusType.Rechazado :
       return this.tipo = 'Rechazado'
      case  pStatusType.Pendiente :
       return this.tipo = 'Pendiente'
    }
} */
getStatusName(id: number) {
  return pStatusType [id];
}



    searchSupplier(): void {
      this.cuit = this.formDeliveryNotes.controls['supplierCuit'].value;
      if (this.cuit === '00') {
        this.formDeliveryNotes.controls['supplierAddress'].setValue('S/D');
        this.formDeliveryNotes.controls['supplierCuit'].setValue('00');
        this.formDeliveryNotes.controls['supplierName'].setValue('Admin');
        this.supplierId = 0;
        return;
      } else {
        if (this.cuit.length >= 6) {
          this.serviceEntity.getByCuit(this.cuit).subscribe({
            next: (data: any) => {
              this.formDeliveryNotes.controls['supplierAddress'].setValue(data.address);
              this.formDeliveryNotes.controls['supplierCuit'].setValue(data.cuit);
              this.formDeliveryNotes.controls['supplierName'].setValue(data.name);
            },
            error: () => {
              this.showMessageError('No se encontro Proveedor');
            },
          });
        }
      }
    }

    openComponentProduct(): void {
      const drawerRefProduct = this.drawerService.create<
        InvoiceProductSearchComponent,
        { filter: string },
        ProductsModel
      >({
        nzTitle: 'Productos',
        nzContent: InvoiceProductSearchComponent,
        nzSize: 'large',
        nzWidth:'90%',
        nzContentParams: {
          filter: this.formProductSearch.controls['productSearchFilter'].value,
        },
        nzClosable: false,
      });
      drawerRefProduct.afterClose.subscribe({

        next: (data: ProductsModel) => {
          if (data != undefined) {

            if (this.deliveryNotesDetails.find((item) => item.productId == data.id)) {

              /*Actualizo la lista que envio al back */
              this.deliveryNotesDetailsList.filter(
                (item) => item.productId == data.id
              )[0].quantity += 1;

              /*Actualizo la lista de la tabla */
              let newListElement = this.deliveryNotesDetailsList.filter(
                (item) => item.productId == data.id
              )[0];

              newListElement.quantity += 1;
              /*  newListElement.subtotal +=
              data.purchasePrice * newListElement.quantity;  */

              this.totalCalculate();
              this.loading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue(
                ''
              );
            } else {
              /* Parseo dato a la grilla de Tabla */
              const model: deliveryNotesDetailsList = deliveryNotesGridParser(
                data, data.purchasePrice
              );
              this.subtotal= data.purchasePrice * data.quantity
              this.deliveryNotesDetailsList.push(model);
              this.deliveryNotesDetailsList = this.deliveryNotesDetailsTest;

              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: DeliveryNotesDetails = deliveryNotesDetailParser(
                data, data.purchasePrice
              );
              this.deliveryNotesDetails.push(modelDetail);
              this.totalCalculate();
              this.loading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue(
                ''
              );
            }
          }
        },
        error: () => {
          this.loading = false;
          this.deliveryNotesDetails = [];
          this.formProductSearch.controls['productSearchFilter'].setValue('');
        },
      });
  
  }
  totalCalculate(): void {  
    this.subtotal= 0  
    this.total = 0;
   try {  this.deliveryNotesDetailsList.forEach(data => { 
      /**Caluclo subtotal = precio y multiplico por cantidad*/
    this.subtotal += data.quantity *  data.price ;   
 }); 
      this.deliveryNotesDetailsList.forEach( (dato) => {
        /**Calculo iva restandolo al precio y multiplico por cantidad*/
       this.total +=  dato.price  * dato.quantity ;
       console.log(this.total);
            
      });
   
    } catch (error) {}   
  };

  searchProduct(): void {
    this.product = this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter = this.product;
    /* if (this.isValidForm(this.formDeliveryNotes)){ */
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => {
          this.loading = true;        
          if (r.data.length == 1) {
            const model: ProductsModel = r.data[0];        
            if (
              this.deliveryNotesDetails.find((item) => item.productId == model.id)
            ) {
              /*Actualizo la lista que envio al back */
              this.deliveryNotesDetails.filter(
                (item) => item.productId == model.id
              )[0].quantity += 1;

              /*Actualizo la lista de la tabla */
              this.deliveryNotesDetailsList.filter(
                (item) => item.productId == model.id
              )[0].quantity += 1;
           
              this.totalCalculate();
              this.loading = false;

              this.formProductSearch.controls['productSearchFilter'].setValue('');
            } else {

              const product: ProductsModel = r.data[0];
              /* Parseo el Producto a la grilla de Tabla */
              const model: deliveryNotesDetailsList= deliveryNotesGridParser(
                product, product.purchasePrice
              );
              this.deliveryNotesDetailsList.push(model);
              this.deliveryNotesDetailsList = this.deliveryNotesDetailsTest;

              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: DeliveryNotesDetails = deliveryNotesDetailParser(
                product, product.purchasePrice
              );
              this.deliveryNotesDetails.push(modelDetail);
              this.totalCalculate();
              this.loading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
              
            }
          } else {
            this.loading = false;
            this.openComponentProduct();
          }
        },
        error: () => {
          this.loading = false;
          this.formProductSearch.controls['productSearchFilter'].setValue('');
        },
      });
    } else {
      this.loading = false;
      this.queryParams.filter = '';
      this.openComponentProduct();
    }
  }
/*   } */
  startEdit(id: number): void {
    this.editId = id;
  }
  stopEdit(): void {
    this.editId = null;
  }
  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');
  }
  changeQuantity(quantity: number): void {
    if (quantity == 0 || quantity == null) {
      quantity = 1;
    }
    let product = this.deliveryNotesDetailsList.filter(
      (detail) => detail.productId == this.editId
    )[0];

    this.deliveryNotesDetailsList.filter(
      (detail) => detail.productId == this.editId
    )[0]

    this.deliveryNotesDetailsList.filter(
      detail => detail.productId == this.editId
      )[0].quantity = quantity;
   
  }

  openComponentSupplier(): void {
    const drawerRefSupplier = this.drawerService.create<
      ReceiptSupplierSearchComponent,
      {},
      CustomerAddModel
    >({
      nzTitle: 'Proveedor',
      nzContent: ReceiptSupplierSearchComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzClosable: false,
    });
    drawerRefSupplier.afterClose.subscribe({
      next: (data) => {
        if (data != undefined) {
          this.supplierId = data.id;
          this.formDeliveryNotes.controls['supplierAddress'].setValue(data.address);
          this.formDeliveryNotes.controls['supplierCuit'].setValue(data.cuit);
          this.formDeliveryNotes.controls['supplierName'].setValue(data.name);
          this.formDeliveryNotes.controls['supplierDni'].setValue(data.dni)
        }
      },
      error: () => {},
    });
  }

formaterDate(date: string | number | Date): string {
  return formatDate(date, 'MM/dd/YYYY', this.locale);
}
typeSelectedChange(id: any): void {
  this.typeSelectedId = id;
  if (id == 1) {
    this.pagado = true;
  } else {
    this.pagado = false;
  }
}
direction(){
  this.router.navigate(['/home/deliveryNotes']);
}

save(): void {
  {
    //EDITAR
    if (this.id > 0) {
      const model: DeliveryNotesModel = {
        id: this.id > 0 ? this.id : 0,
        supplierName: this.formDeliveryNotes.controls['supplierName'].value,
        supplierCuit: this.formDeliveryNotes.controls['supplierCuit'].value,
        supplierAddress: this.formDeliveryNotes.controls['supplierAddress'].value,
        observation: this.formDeliveryNotes.controls['observation'].value,
        paid: this.formDeliveryNotes.controls['paid'].value,
        statusId: this.formDeliveryNotes.controls['statusId'].value,
        importTotal: this.totalItems,
        dateTime: this.formDeliveryNotes.controls['dateTime'].value,
        deliveryNotesDetails: this.deliveryNotesDetails,
        deliveryNotes_number:this.id,
        supplierId: this.supplierId,
        cancelled: ""
      };

      this.isSaving = true;
      this.service.editDeliveryNotes(model)
        .subscribe({
          next: (r) => {
            this.showNotificationSuccess(
              'Guardado correcto',
              `Remito editado correctamente`
            );
            this.isSaving = false;
            this.router.navigate(['/home/deliveryNotes']);
          },
          error: (r) => {
            this.isSaving = false;
            this.showMessageError(r.error)
          }
        });

      //GUARDAR
    } else {
      const model: DeliveryNotesModel = {
        id: 0,
        supplierName: this.formDeliveryNotes.controls['supplierName'].value,
        supplierCuit: this.formDeliveryNotes.controls['supplierCuit'].value,
        supplierAddress: this.formDeliveryNotes.controls['supplierAddress'].value,
        observation: this.formDeliveryNotes.controls['observation'].value,
        paid: this.formDeliveryNotes.controls['paid'].value,
        statusId: this.formDeliveryNotes.controls['statusId'].value,
        importTotal: this.totalItems,
        dateTime: this.formDeliveryNotes.controls['dateTime'].value,
        deliveryNotesDetails: this.deliveryNotesDetails,
        deliveryNotes_number:this.id,
        supplierId: this.supplierId,
        cancelled: ""
      };


      this.isSaving = true;
      this.service.saveDeliveryNotes(model)
        .subscribe({
          next: (r) => {
            this.showNotificationSuccess(
              'Guardado correcto',
              `emito creado correctamente`
            );
            this.isSaving = false;
            this.router.navigate(['/home/budgets']);
          },
          error: (r) => {
            this.isSaving = false;
            this.showMessageError(r.error)
          }
        });
    }
  }

};


handleOk() {
  try {
    let newReceiptDetailsGrid = this.deliveryNotesDetailsList.filter(
      (element) =>
        element.productId != this.popupComponent.elementSelectedToDelete
    );
    this.deliveryNotesDetails = this.deliveryNotesDetails.filter(
      (element) =>
        element.productId != this.popupComponent.elementSelectedToDelete
    );      
      
    if (this.deliveryNotesDetailsList.length == 0) {
      this.deliveryNotesDetailsList = [];
      this.deliveryNotesDetailsList= [];
    } else {
      this.deliveryNotesDetailsList = newReceiptDetailsGrid;
      this.deliveryNotesDetailsList = newReceiptDetailsGrid;
    }

    this.popupComponent.isDeleteConfirmationVisible = false;
  } catch (error) {
    console.log(error);
  }
}  

msjConfirmOk() {
  try {
    this.deliveryNotesDetailsList = this.deliveryNotesDetailsList.filter(
      (element) => element.productId != this.popupComponent.elementSelected
    );
    this.popupComponent.isConfirmationvisible = false;
    if ((this.deliveryNotesDetailsList.length != 0)
    && this.isValidForm(this.formSupplierSearch) && this.isValidForm(this.formProductSearch)){
      this.popComponent.showConfirmation() 
    } else {
      this.showMessageError('No ha seleccionado producto');
    }
  } catch (error) {}
}

selectPaid(value:string){

  this.statusPaid = value;
  this.statusId= this.newStatusPaid
  if(value == 'si'){
    this.formDeliveryNotes.controls['statusId'].value
  }if(value== 'no'){
    this.formDeliveryNotes.controls['statusId'].value
  }

}
}
