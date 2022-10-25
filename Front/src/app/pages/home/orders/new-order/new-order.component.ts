import { formatCurrency } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { CustomerModel } from '../../customers/model/customer.model';
import { InvoiceProductSearchComponent } from '../../invoices/invoice-product-search/invoice-product-search.component';
import {
  InvoiceDetailList,
  InvoiceDetails,
  invoiceGridParser,
  invoiceDetailParser,
} from '../../invoices/model/invoice.model';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';
import { NewOrder, OrderDetailList, OrderDetails } from '../models/order.model';
import { OrdersService } from '../orders.service';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
})
export class NewOrderComponent extends BaseComponent implements OnInit {
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string };
    drawerRef: NzDrawerRef<string>;
  }>;

  constructor(
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private drawerService: NzDrawerService,
    private serviceProduct: ProductService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      supplier: ['', [Validators.required]],
      date: ['', [Validators.required]],
      isPaid: ['', [Validators.required]],
      email: ['', [Validators.required]],
      send: ['', [Validators.required]],
      email2: ['', [Validators.required]],
      send2: ['', [Validators.required]],
      emailEntity: new FormArray([]),
    });
    this.formProductSearch = this.fb.group({
      productSearchFilter: [''],
    });
  }

  ngOnInit(): void {}

  form!: FormGroup;
  formProductSearch!: FormGroup;
  isSaving!: boolean;
  isVisible = false;
  switchValue = false;
  date = null;
  fecha = 'Elige una fecha';
  isConfirmLoading = false;
  id!: number;
  product!: string;
  dateFormat = 'dd/MM/yyyy';
  today = new Date();
  orderListTest: OrderDetailList[] = [];
  invoiceDetailsList: InvoiceDetailList[] = [];
  invoiceDetails: InvoiceDetails[] = [];

  paymentSelected: any;
  /*
   ** Lista de Productos
   */
  customer: CustomerModel[] = [];
  orderDetailList: OrderDetailList[] = [];
  orderDetails: OrderDetails[] = [];
  invoiceListTest: InvoiceDetailList[] = [];

  /*
   ** Catidad total de productos
   */
  totalItems: number = 0;
  subtotal: number = 0;
  iva: number = 21;
  total: number = 0;
  ivaTotal: number = 0;

  /*
   **Variables de la tabla detalle
   */
  editId: number | null = null;

  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  save(): void {
    if (this.isValidForm(this.form)) {
      const model: NewOrder = {
        id: this.id !== undefined ? this.id : 0,
        supplier: this.form.controls['supplier'].value,
        date: this.form.controls['date'].value,
        isPaid: this.form.controls['isPaid'].value,
        email: this.form.controls['email'].value,
        emailSecondary: this.form.controls['emailSecondary'].value,
        isSend: this.form.controls['isSend'].value,
        isSendSecondary: this.form.controls['isSendSecondary'].value,
        product: this.form.controls['product'].value,
      };
      this.isSaving = true;
      this.ordersService.saveOrder(model).subscribe({
        next: (r) => {
          this.showNotificationSuccess(
            'Guardado correcto',
            `Se guardo correctamente el pedido`
          );
          this.isSaving = false;
          this.headerComponent.goBack();
        },
        error: () => {
          this.isSaving = false;
          this.showMessageError('No se pudo Guardar el pedido');
        },
      });
    }
  }
  queryData = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  get emailsArray() {
    return this.form.controls['emailEntity'] as FormArray;
  }

  get emailsControls() {
    return this.emailsArray.controls as FormControl[];
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) < 0;

  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;
    this.ivaTotal = 0;
    try {
      this.invoiceDetailsList.forEach((detail) => {
        this.subtotal +=
          detail.price * detail.quantity -
          this.ivaCalculate(detail.price * detail.quantity, detail.iva);
      });
      this.invoiceDetailsList.forEach((dato) => {
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

  bindPrice(data: ProductsModel): number {
    const typePayment = this.paymentSelected;
    var a = Object.keys(data).filter((type) => type == typePayment);
    switch (a[0]) {
      case 'cardSalePrice':
        return data.cardSalePrice;

      case 'salePrice':
        return data.salePrice;

      default:
        return data.cashSalePrice;
    }
  }

  ivaCalculate(data: number, iva: number): number {
    return (data * iva) / 100;
  }

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  changeQuantity(quantity: number): void {
    if (quantity == 0 || quantity == null) {
      quantity = 1;
    }
    let product = this.invoiceDetailsList.filter(
      (detail) => detail.ownCode == this.editId
    )[0];

    this.invoiceDetailsList.filter(
      (detail) => detail.ownCode == this.editId
    )[0].subTotal = quantity * product.price;

    this.totalCalculate();
    this.invoiceDetails.filter(
      (detail) => detail.productId == this.editId
    )[0].quantity = quantity;
  }

  searchProduct(): void {
    this.product = this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter = this.product;
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => {
          if (r.data.length == 1) {
            const model: ProductsModel = r.data[0];
            if (
              this.invoiceDetails.find((item) => item.productId == model.id)
            ) {
              /*Actualizo la lista que envio al back */
              this.invoiceDetails.filter(
                (item) => item.productId == model.id
              )[0].quantity += 1;

              /*Actualizo la lista de la tabla */
              this.invoiceDetailsList.filter(
                (item) => item.ownCode == model.id
              )[0].quantity += 1;

              this.invoiceDetailsList.filter(
                (item) => item.ownCode == model.id
              )[0].subTotal += this.bindPrice(model) * model.quantity;
              this.totalCalculate();
            } else {
              const product: ProductsModel = r.data[0];
              const model: InvoiceDetails = {
                id: 0,
                invoiceId: 0,
                productId: product.id,
                productName: product.description,
                productCode: product.code,
                quantity: 1,
                price: this.bindPrice(product),
                iva: this.iva,
              };
              this.invoiceDetails.push(model);
              this.totalCalculate();
            }
          } else {
            this.openComponentProduct();
          }
        },
        error: () => {},
      });
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
            if (this.orderDetails.find((item) => item.productId == data.id)) {
              /*Actualizo la lista que envio al back */
              this.orderDetails.filter(
                (item) => item.productId == data.id
              )[0].quantity += 1;

              /*Actualizo la lista de la tabla */
              let newListElement = this.orderDetailList.filter(
                (item) => item.ownCode == data.id
              )[0];

              newListElement.quantity += 1;
              newListElement.subTotal +=
                this.bindPrice(data) * newListElement.quantity;

              this.totalCalculate();
            } else {
              /* Parseo dato a la grilla de Tabla */
              const model: InvoiceDetailList = invoiceGridParser(
                data,
                this.iva,
                this.bindPrice(data)
              );
              this.invoiceListTest.push(model);
              this.invoiceDetailsList = this.invoiceListTest;
              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: InvoiceDetails = invoiceDetailParser(
                data,
                this.iva,
                this.bindPrice(data)
              );
              this.invoiceDetails.push(modelDetail);
              this.totalCalculate();
            }
          }
        },
        error: () => {
          this.orderDetailList = [];
        },
      });
    } else {
      return;
    }
  }

  handleOk() {
    try {
      this.invoiceListTest = this.invoiceDetailsList.filter(
        (element) =>
          element.ownCode != this.popupComponent.elementSelectedToDelete
      );
      this.invoiceDetails = this.invoiceDetails.filter(
        (element) =>
          element.productId != this.popupComponent.elementSelectedToDelete
      );
      this.popupComponent.isDeleteConfirmationVisible = false;
      if (this.invoiceListTest.length == 0) {
        this.invoiceDetailsList = [];
      } else {
        this.invoiceDetailsList = this.invoiceListTest;
      }

      this.totalCalculate();
    } catch (error) {
      console.log(error);
    }
  }

  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');
  }

  addEmailField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    let emailForm = this.form.controls['emailEntity'] as FormArray;
    emailForm.push(new FormControl(''));
  }

  removeEmailField(e: MouseEvent, index: number): void {
    e.preventDefault();
    this.emailsArray.removeAt(index);
  }
}
