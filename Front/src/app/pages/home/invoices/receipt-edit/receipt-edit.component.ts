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
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { InvoiceType } from '../model/invoice-type.Enum';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';
import { ProductService } from '../../products/product.service';
import { InvoiceService } from '../invoices.service';
import { EntityService } from '../../customers/customer.service';
import { receiptDetails, receiptModel } from '../model/receipt.model';
import { CustomerAddModel } from '../../customers/model/customer.add.model';
import { ProductsModel } from '../../products/model/product.model';
import { InvoiceProductSearchComponent } from '../invoice-product-search/invoice-product-search.component';
import { ReceiptSupplierSearchComponent } from '../receipt-supplier-search/receipt-supplier-search.component';

@Component({
  selector: 'app-receipt-edit',
  templateUrl: './receipt-edit.component.html',
  styleUrls: ['./receipt-edit.component.css'],
})
export class ReceiptEditComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

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
  typeSelectedId: number = 1;
  invoiceA: boolean = true;
  cuit!: string;
  supplierId!: number;
  subtotal: number = 0;
  iva: number = 21;
  total: number = 0;
  ivaTotal: number = 0;
  totalItems: number = 0;

  today = new Date();

  formReceipt!: FormGroup;
  formProductSearch!: FormGroup;
  formProduct!: FormGroup;
  formSupplierSearch!: FormGroup;
  formReceiptModel!: FormGroup;

  receiptDetailsList: receiptDetails[] = [];
  /*
   **Variables de la tabla detalle
   */
  editId: number | null = null;
  editIdIva: number | null = null;

  userId: number = this.serviceUser.currentUser.id;

  constructor(
    private fb: FormBuilder,
    notificacionService: NzNotificationService,
    private serviceEntity: EntityService,
    private serviceProduct: ProductService,
    private serviceInvoice: InvoiceService,
    public serviceUser: AuthService,
    el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
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
      supplierCuit: ['', Validators.required],
      supplierName: ['', Validators.required],
      observation: [''],
    });
    this.formSupplierSearch = this.fb.group({});
    this.formProductSearch = this.fb.group({
      productSearchFilter: [''],
    });
  }

  ngOnInit(): void {}

  typeSelectedChange(id: any): void {
    this.typeSelectedId = id;
    if (id == 1) {
      this.invoiceA = true;
    } else {
      this.invoiceA = false;
    }
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

  stopEdit(): void {
    this.editId = null;
  }
  stopEditIva(): void {
    this.editIdIva = null;
  }

  changeQuantity(quantity: number): void {
    if (quantity == 0 || quantity == null) {
      quantity = 1;
    }
    let product = this.receiptDetailsList.filter(
      (detail) => detail.productCode == this.editId
    )[0];

    this.receiptDetailsList.filter(
      (detail) => detail.productCode == this.editId
    )[0].subTotal = quantity * product.price;

    this.totalCalculate();
    this.receiptDetailsList.filter(
      (detail) => detail.productId == this.editId
    )[0].quantity = quantity;
  }

  ivaCalculate(data: number, iva: number): number {
    return (data * iva) / 100;
  }

  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;
    this.ivaTotal = 0;
    try {
      this.receiptDetailsList.forEach((detail) => {
        this.subtotal +=
          detail.price * detail.quantity -
          this.ivaCalculate(detail.price * detail.quantity, detail.iva);
      });
      this.receiptDetailsList.forEach((dato) => {
        this.ivaTotal += this.ivaCalculate(
          dato.price * dato.quantity,
          dato.iva
        );
        this.total += dato.price * dato.quantity;
      });
    } catch (error) {
      console.log(error);
    }
  }

  save(): void {
    if (this.isValidForm(this.formReceipt)) {
      if (this.receiptDetailsList.length == 0) {
        this.showMessageError('No hay Productos Seleccionados');
      } else {
        const model: receiptModel = {
          id: 0,
          supplierId: this.supplierId,
          userId: this.userId,
          receiptNumber: this.totalItems,
          supplierName: this.formReceipt.controls['supplierName'].value,
          supplierCuit: this.formReceipt.controls['supplierCuit'].value,
          supplierAddress: this.formReceipt.controls['supplierAddress'].value,
          observation: this.formReceipt.controls['observation'].value,
          dateTime: this.formReceipt.controls['dateTime'].value,
          total: this.totalItems,
          ivaTotal: this.ivaTotal,
          type: this.formReceipt.controls['type'].value,
          receiptDetails: this.receiptDetailsList,
        };
        this.isSaving = true;
        this.serviceInvoice.saveReceipt(model).subscribe({
          next: () => {
            this.showNotificationSuccess(
              'Guardado correcto',
              `Comprobante creado correctamente`
            );
            this.isSaving = false;
            this.router.navigate(['/home/receipt']);
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
    // try {
    //   this.receiptListTest = this.receiptDetailsList.filter(
    //     (element) =>
    //       element.productCode != this.popupComponent.elementSelectedToDelete
    //   );
    //   this.invoiceDetails = this.invoiceDetails.filter(
    //     (element) =>
    //       element.productId != this.popupComponent.elementSelectedToDelete
    //   );
    //   this.popupComponent.isDeleteConfirmationVisible = false;
    //   if (this.invoiceListTest.length == 0) {
    //     this.receiptDetailsList = [];
    //   } else {
    //     this.receiptDetailsList = this.invoiceListTest;
    //   }
    //   this.totalCalculate();
    // } catch (error) {
    //   console.log(error);
    // }
  }

  msjConfirmOk() {
    try {
      this.receiptDetailsList = this.receiptDetailsList.filter(
        (element) => element.productCode != this.popupComponent.elementSelected
      );
      this.popupComponent.isConfirmationvisible = false;
      if (this.receiptDetailsList.length != 0) {
        this.save();
      } else {
        this.showMessageError('No ha seleccionado producto');
      }
    } catch (error) {
      console.log(error);
    }
  }

  openComponentProduct(): void {
    if (true) {
      const drawerRefProduct = this.drawerService.create<
        InvoiceProductSearchComponent,
        { filter: string },
        ProductsModel
      >({
        nzTitle: 'Productos',
        nzContent: InvoiceProductSearchComponent,
        nzSize: 'large',
        nzContentParams: {
          filter: this.formProductSearch.controls['productSearchFilter'].value,
        },
        nzClosable: false,
      });
      drawerRefProduct.afterClose.subscribe({
        next: (data: ProductsModel) => {
          if (data != undefined) {
            if (
              this.receiptDetailsList.find((item) => item.productId == data.id)
            ) {
              /*Actualizo la lista que envio al back */
              this.receiptDetailsList.filter(
                (item) => item.productId == data.id
              )[0].quantity += 1;
              /*Actualizo la lista de la tabla */
              let newListElement = this.receiptDetailsList.filter(
                (item) => item.productCode == data.id
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
              this.receiptDetailsList.push();
              /* Parseo dato a Dto Factura Detalle */
              this.receiptDetailsList.push();
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
          this.receiptDetailsList = [];
          this.formProductSearch.controls['productSearchFilter'].setValue('');
        },
      });
    } else {
      return;
    }
  }
}
