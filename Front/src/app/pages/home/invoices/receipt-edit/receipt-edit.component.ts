import {
  OnInit,
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { InvoiceType } from '../model/invoice-type.Enum';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';
import { ProductService } from '../../products/product.service';
import { InvoiceService } from '../invoices.service';
import { EntityService } from '../../customers/customer.service';
import {
  receiptDetailParser,
  receiptDetails,
  receiptDetailsGrid,
  receiptGridParser,
  receiptModel,
} from '../model/receipt.model';
import { CustomerAddModel } from '../../customers/model/customer.add.model';
import { ProductsModel } from '../../products/model/product.model';
import { InvoiceProductSearchComponent } from '../invoice-product-search/invoice-product-search.component';
import { ReceiptSupplierSearchComponent } from '../receipt-supplier-search/receipt-supplier-search.component';
import { IvaType } from '../model/iva-type.Enum';

@Component({
  selector: 'app-receipt-edit',
  templateUrl: './receipt-edit.component.html',
  styleUrls: ['./receipt-edit.component.css'],
})
export class ReceiptEditComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string };
    drawerRef: NzDrawerRef<string>;
  }>;

  /*
   ** Indicador de carga de la grilla
   */
  loading = false;
  isSaving!: boolean;

  type = InvoiceType;
  ivaType = IvaType;
  typeSelectedId: number = 1;
  ivaSelectedId: number = 1;
  ivaSelected!: number;
  iva10: number = parseFloat('10.5');
  iva21: number = 21;
  iva27: number = 27;
  invoiceA: boolean = true;
  cuit!: string;
  supplierId!: number;
  subtotal: number = 0;
  iva: number = 21;
  total: number = 0;
  ivaTotal: number = 0;
  totalItems: number = 0;
  percIngBrutos: number = 0;
  percIva: number = 0;
  concNoGravado: number = 0;
  product!: string;

  today = new Date();

  formReceipt!: FormGroup;
  formProductSearch!: FormGroup;
  formProduct!: FormGroup;
  formSupplierSearch!: FormGroup;
  formReceiptModel!: FormGroup;

  receiptDetailsGrid: receiptDetailsGrid[] = [];
  receiptDetailsGridTest: receiptDetailsGrid[] = [];
  receiptDetails: receiptDetails[] = [];
  receiptDetailsTest: receiptDetails[] = [];
  /*
   **Variables de la tabla detalle
   */
  editId: number | null = null;
  editIdIva: number | null = null;
  value!: string;
  value1!: string;
  value2!: string;
  value3!: string;

  userId: number = this.serviceUser.currentUser.id;

  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  constructor(
    private fb: FormBuilder,
    notificacionService: NzNotificationService,
    private serviceEntity: EntityService,
    private serviceProduct: ProductService,
    private serviceInvoice: InvoiceService,
    public serviceUser: AuthService,
    el: ElementRef,
    private router: Router,
    message: NzMessageService,
    private drawerService: NzDrawerService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(notificacionService, el, message);
    this.formReceipt = this.fb.group({
      dateTime: ['', Validators.required],
      type: [1, Validators.required],
      receiptNumber: ['', Validators.required],
      supplierAddress: ['', Validators.required],
      supplierCuit: ['', [Validators.required, Validators.pattern('[0-9]{11}'),]],
      supplierName: ['', Validators.required],
      observation: [''],
    });
    this.formSupplierSearch = this.fb.group({});
    this.formProductSearch = this.fb.group({
      productSearchFilter: [''],
    });
  }

  formatter = (data: number = 0) =>
    formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');

  ngOnInit(): void {}

  typeSelectedChange(id: any): void {
    this.typeSelectedId = id;
    if (id == 1) {
      this.invoiceA = true;
    } else {
      this.invoiceA = false;
    }
  }

  startEdit(id: number): void {
    this.editId = id;
  }

  startEditIva(id: number): void {
    this.editIdIva = id;
  }
  stopEdit(): void {
    this.editId = null;
  }
  stopEditIva(): void {
    this.editIdIva = null;
  }
  changeIvaValue(iva: number, productId: number): void {
    let newIva= Number(iva);  
    try {
      this.receiptDetails.filter(
        (detail) => detail.productId == productId
      )[0].iva = newIva;

      this.receiptDetailsGrid.filter(
        (detail) => detail.productId == productId
      )[0].iva = newIva;
      this.totalCalculate();
      this.stopEditIva();
    } catch (error) {
      console.error(error);
    }
  }

  concNoGravadoChange(id: any): any {
    this.concNoGravado = id;
    this.totalCalculate();
  }

  percIvaChange(id: any): any {
    this.percIva = id;
    this.totalCalculate();
  }

  percIngBrutosChange(id: any): any {
    this.percIngBrutos = id;
    this.totalCalculate();
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) > 0;

  searchSupplier(): void {
    this.cuit = this.formReceipt.controls['supplierCuit'].value;
    if (this.cuit === '00') {
      this.formReceipt.controls['supplierAddress'].setValue('S/D');
      this.formReceipt.controls['supplierCuit'].setValue('00');
      this.formReceipt.controls['supplierName'].setValue('Admin');
      this.supplierId = 0;
      return;
    } else {
      if (this.cuit.length >= 6) {
        this.serviceEntity.getByCuit(this.cuit).subscribe({
          next: (data: any) => {
            this.formReceipt.controls['supplierAddress'].setValue(data.address);
            this.formReceipt.controls['supplierCuit'].setValue(data.cuit);
            this.formReceipt.controls['supplierName'].setValue(data.name);
          },
          error: () => {
            this.showMessageError('No se encontro Proveedor');
          },
        });
      }
    }
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
      nzWidth: 1050,
      nzClosable: false,
    });
    drawerRefSupplier.afterClose.subscribe({
      next: (data) => {
        if (data != undefined) {
          this.supplierId = data.id;
          this.formReceipt.controls['supplierAddress'].setValue(data.address);
          this.formReceipt.controls['supplierCuit'].setValue(data.cuit);
          this.formReceipt.controls['supplierName'].setValue(data.name);
        }
      },
      error: () => {},
    });
  }

  changeQuantity(quantity: number): void {
    if (quantity == 0 || quantity == null) {
      quantity = 1;
    }
    let product = this.receiptDetailsGrid.filter(
      (detail) => detail.productId == this.editId
    )[0];
    this.receiptDetails.filter(
      (detail) => detail.productId == this.editId
    )[0].quantity = quantity;

    this.receiptDetailsGrid.filter(
      (detail) => detail.productId == this.editId
    )[0].subTotal = quantity * product.price;

    this.totalCalculate();
   
  }

  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');
  }

  ivaCalculate(data: number, iva: number): number {
    let newIva =1 + (iva / 100) ;
    return (data / newIva); 
  }

  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;
    this.ivaTotal = 0;
    try {
      this.receiptDetailsGrid.forEach((detail) => {
        this.subtotal +=
           detail.quantity *
          this.ivaCalculate(detail.price, detail.iva);
      });
      this.receiptDetailsGrid.forEach((dato) => {
        this.ivaTotal += ( dato.price - this.ivaCalculate(dato.price, dato.iva)
        ) * dato.quantity;
        this.total += dato.price * dato.quantity;
      });
      this.total += this.concNoGravado + this.percIngBrutos + this.percIva;
    } catch (error) {}
  }

  save(): void {
    if (this.isValidForm(this.formReceipt)) {
      if (this.receiptDetailsGrid.length == 0) {
        this.showMessageError('No hay Productos Seleccionados');
      } else {
        const model: receiptModel = {
          id: 0,
          supplierId: this.supplierId,
          userId: this.userId,
          receiptNumber: this.formReceipt.controls['receiptNumber'].value,
          supplierName: this.formReceipt.controls['supplierName'].value,
          supplierCuit: this.formReceipt.controls['supplierCuit'].value,
          supplierAddress: this.formReceipt.controls['supplierAddress'].value,
          observation: this.formReceipt.controls['observation'].value,
          dateTime: this.formReceipt.controls['dateTime'].value,
          total: this.total,
          ivaTotal: this.ivaTotal,
          type: this.formReceipt.controls['type'].value,
          concNoGravado: this.concNoGravado,
          percIva: this.percIva,
          percIngBrutos: this.percIngBrutos,
          receiptDetails: this.receiptDetails,
        };
        this.isSaving = true;
        this.serviceInvoice.saveReceipt(model).subscribe({
          next: () => {
            this.showNotificationSuccess(
              'Guardado correcto',
              `Comprobante creado correctamente`
            );
            this.isSaving = false;
            this.router.navigate(['/home/invoices/receipt']);
          },
          error: () => {
            this.isSaving = false;
            this.showMessageError('No se pudo crear el Comprobante');
          },
        });
      }
    }
  }

  handleOk() {
    try {
      let newReceiptDetailsGrid = this.receiptDetailsGrid.filter(
        (element) =>
          element.productId != this.popupComponent.elementSelectedToDelete
      );
      this.receiptDetails = this.receiptDetails.filter(
        (element) =>
          element.productId != this.popupComponent.elementSelectedToDelete
      );      
        
      if (this.receiptDetailsGrid.length == 0) {
        this.receiptDetailsGrid = [];
        this.receiptDetailsGridTest= [];
      } else {
        this.receiptDetailsGrid = newReceiptDetailsGrid;
        this.receiptDetailsGridTest = newReceiptDetailsGrid;
      }
      this.totalCalculate();

      this.popupComponent.isDeleteConfirmationVisible = false;
    } catch (error) {
      console.log(error);
    }
  }

  msjConfirmOk() {
    try {
      this.receiptDetailsGrid = this.receiptDetailsGrid.filter(
        (element) => element.productId != this.popupComponent.elementSelected
      );
      this.popupComponent.isConfirmationvisible = false;
      if (this.isValidForm(this.formReceipt)&&(this.receiptDetailsGrid.length != 0)
      && this.isValidForm(this.formSupplierSearch) && this.isValidForm(this.formProductSearch)){
        this.popComponent.showConfirmation() 
      } else {
        this.showMessageError('No ha seleccionado producto');
      }
    } catch (error) {}
  }

  searchProduct(): void {
    this.product = this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter = this.product;
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => {
          this.loading = true;
          if (r.data.length == 1) {
            const model: ProductsModel = r.data[0];
            if (
              this.receiptDetailsGrid.find((item) => item.productId == model.id)
            ) {
              /*Actualizo la lista que envio al back */
              this.receiptDetailsGrid.filter(
                (item) => item.productId == model.id
              )[0].quantity += 1;

              /*Actualizo la lista de la tabla */
              this.receiptDetails.filter(
                (item) => item.productId == model.id
              )[0].quantity += 1;

              this.receiptDetailsGrid.filter(
                (item) => item.productId == model.id
              )[0].subTotal += model.purchasePrice * model.quantity;

              this.totalCalculate();

              this.loading = false;

              this.formProductSearch.controls['productSearchFilter'].setValue(
                ''
              );
            } else {

              const product: ProductsModel = r.data[0];
              /* Parseo el Producto a la grilla de Tabla */
              const model: receiptDetailsGrid = receiptGridParser(
                product,
                this.iva
              );
              this.receiptDetailsGridTest.push(model);
              this.receiptDetailsGrid = this.receiptDetailsGridTest;

              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: receiptDetails = receiptDetailParser(
                product,
                this.iva
              );
              this.receiptDetails.push(modelDetail);

              this.totalCalculate();
              this.loading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue(
                ''
              );
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

  openComponentProduct(): void {
 
      const drawerRefProduct = this.drawerService.create<
        InvoiceProductSearchComponent,
        { filter: string },
        ProductsModel
      >({
        nzTitle: 'Productos',
        nzContent: InvoiceProductSearchComponent,
        nzSize: 'large',
        nzWidth:1050,
        nzContentParams: {
          filter: this.formProductSearch.controls['productSearchFilter'].value,
        },
        nzClosable: false,
      });
      drawerRefProduct.afterClose.subscribe({

        next: (data: ProductsModel) => {
          if (data != undefined) {

            if (this.receiptDetails.find((item) => item.productId == data.id)) {

              /*Actualizo la lista que envio al back */
              this.receiptDetails.filter(
                (item) => item.productId == data.id
              )[0].quantity += 1;

              /*Actualizo la lista de la tabla */
              let newListElement = this.receiptDetailsGrid.filter(
                (item) => item.productId == data.id
              )[0];

              newListElement.quantity += 1;
              newListElement.subTotal +=
                data.purchasePrice * newListElement.quantity;

              this.totalCalculate();

              this.loading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue(
                ''
              );
            } else {
              /* Parseo dato a la grilla de Tabla */
              const model: receiptDetailsGrid = receiptGridParser(
                data,
                this.iva
              );
              this.receiptDetailsGridTest.push(model);
              this.receiptDetailsGrid = this.receiptDetailsGridTest;

              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: receiptDetails = receiptDetailParser(
                data,
                this.iva
              );
              this.receiptDetails.push(modelDetail);

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
          this.receiptDetailsGrid = [];
          this.formProductSearch.controls['productSearchFilter'].setValue('');
        },
      });
  
  }
}
