import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { EntityService } from "../../customers/customer.service";
import { ProductsModel } from "../../products/model/product.model";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { ActivatedRoute, Router } from "@angular/router";
import { formatCurrency, formatDate } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';
import { ProductService } from "../../products/product.service";
import { InvoiceProductSearchComponent } from "../../invoices/invoice-product-search/invoice-product-search.component";
import { DeliveryNotesDetails, DeliveryNotesModel, deliveryNotesDetailParser, deliveryNotesDetailsList, deliveryNotesGridFromParser, deliveryNotesGridParser } from "../model/deliveryNotes.model";
import { CustomerAddModel } from "../../customers/model/customer.add.model";
import { deliveryNotesService } from "../deliveryNotes.service";
import { pStatusType, statusType } from "../model/status.model";
import { isNil } from "ng-zorro-antd/core/util";
import { InvoiceCustomerSearchComponent } from "../../invoices/invoice-customer-search/invoice-customer-search.component";



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
  edit: boolean = false;
  tipo!: string;
  newStatusPaid!: number;
  paymentSelected: any;
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
  isLoading: boolean = false;
  id!: number;
  cuit!: string;
  supplierId!: number;
  product!: string;
  editId: number | null = null;
  isSaving!: boolean;
  pagado: boolean = true;
  typeSelectedId: number = 1;
  statusPaid!: string;
  totalItems: number = 0;
  total!: number;
  userId!: number;

  name!: string;
  address!: string;
  editIdrecievedQuantity: number | null = null;
  importTotal!: number;
  productId!: number;
  deliveryNotesNumber!: number;
  observation!: string;
  dateTime!: Date;
  paid!: boolean;
  statusId!: number;
  subTotal!: number;
  subtotal: number = 0;

  isDisabled = false;
  viewOrder: boolean = false;
  switchValue!: boolean;
  isDisabledPaid = false;
  isDisabledGrabar = false;

  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  idDeliveryNotes = this.route.snapshot.paramMap.get("id");


  constructor(notificacionService: NzNotificationService,
    private serviceEntity: EntityService,
    private serviceProduct: ProductService,
    private service: deliveryNotesService,
    private router: Router,
    private route: ActivatedRoute,
    el: ElementRef,
    message: NzMessageService,
    private drawerService: NzDrawerService,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string) {
    super(notificacionService, el, message)
    this.formDeliveryNotes = this.fb.group({
      dateTime: [new Date(this.startDate), Validators.required],
      statusId: [1, Validators.required],
      deliveryNotesNumber: ['', Validators.required],
      supplierAddress: ['', Validators.required],
      supplierCuit: ['', [Validators.required, Validators.pattern('[0-9]{11}'),]],
      supplierDni: ['',],
      paid: ['', Validators.required],
      supplierName: ['', Validators.required],
      observation: [''],
      importTotal: [0, Validators.required]
    });
    this.formSupplierSearch = this.fb.group({});
    this.formProductSearch = this.fb.group({
      productSearchFilter: [''],
    });
  }


  ngOnInit() {
    this.route.params.subscribe(params => { this.id = params['id']; })
    if (this.id != undefined) {
      this.getDeliveryNotes(this.id);
      this.isDisabled = true;
    }
  }


  getDeliveryNotes(id: number): void {
    if (this.id != 0 || this.id !== undefined)
      this.service.getDeliveryNotesById(this.id).subscribe({
        next: (r) => {
          this.edit = true
          this.id = this.id
          this.formDeliveryNotes.controls['deliveryNotesNumber'].setValue(r.deliveryNotes_number)
          this.formDeliveryNotes.controls['statusId'].setValue(r.statusId);

          this.formDeliveryNotes.controls['paid'].setValue(r.paid),
          this.formDeliveryNotes.controls['supplierAddress'].setValue(r.supplierAddress),
          this.formDeliveryNotes.controls['supplierCuit'].setValue(r.supplierCuit),
          this.formDeliveryNotes.controls['supplierName'].setValue(r.supplierName),
          this.dateTime = r.dateTime
          this.formDeliveryNotes.controls['observation'].setValue(r.observation),
           this.isLoading = false;

          this.subtotal = r.subtotal;

          this.deliveryNotesDetails = r.deliveryNotesDetails;

          this.formDeliveryNotes.controls['importTotal'].setValue(r.importTotal)

          /*Bindeo detalles*/
          r.deliveryNotesDetails.forEach((modelDetail: DeliveryNotesDetails) => {
            const model = deliveryNotesGridFromParser(modelDetail)
            this.deliveryNotesDetailsTest.push(model)
          });

          if (r.paid === true) {
            this.isDisabledPaid = true;
          }

          if (r.statusId === 1 || r.statusId === 2) {
            this.isDisabled = true;
            this.isDisabledGrabar = true;
            this.formDeliveryNotes.controls['supplierAddress'].disable();
            this.formDeliveryNotes.controls['supplierCuit'].disable();
            this.formDeliveryNotes.controls['supplierName'].disable();
            this.formDeliveryNotes.controls['observation'].disable();
            this.viewOrder = true;
          } else {
            this.viewOrder = false;
          }

          this.deliveryNotesDetailsList = this.deliveryNotesDetailsTest;

          if (this.isDisabled == true) {
            this.formProductSearch.controls['productSearchFilter'].disable();
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  getStatusName(id: number) {

    return pStatusType[id];

  }

  searchSupplier(): void {
    this.cuit = this.formDeliveryNotes.controls['supplierCuit'].value;
    if (this.cuit === '00') {
      this.formDeliveryNotes.controls['supplierAddress'].setValue('S/D');
      this.formDeliveryNotes.controls['supplierCuit'].setValue('99999999995');
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
    const drawerRefProduct = this.drawerService.create<InvoiceProductSearchComponent, { filter: string }, [ProductsModel]>({
      nzTitle: 'Productos',
      nzContent: InvoiceProductSearchComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzContentParams: {
        filter: this.formProductSearch.controls['productSearchFilter'].value
      },
      nzClosable: false
    });
    drawerRefProduct.afterClose.subscribe({

      next: (data: [ProductsModel]) => {

        if (data != undefined) {
          data.forEach((productItem) => {
            if (this.deliveryNotesDetails.find(item => item.productId == productItem.id)) {
              /*Actualizo la lista que envio al back */
              this.deliveryNotesDetails.filter(item => item.productId == productItem.id)[0]
                .quantity += 1;

              /*Actualizo la lista de la tabla */
              let newListElement = this.deliveryNotesDetailsList.filter(item => item.productId == productItem.id)[0];
              newListElement.quantity += 1;
              newListElement.subtotal += this.bindPrice(productItem) * newListElement.quantity;

              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            } else {

              /* Parseo dato a la grilla de Tabla */
              const model: deliveryNotesDetailsList = deliveryNotesGridParser(productItem, this.bindPrice(productItem));
              this.deliveryNotesDetailsTest.push(model)
              this.deliveryNotesDetailsList = this.deliveryNotesDetailsTest;
              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: DeliveryNotesDetails = deliveryNotesDetailParser(productItem, this.bindPrice(productItem));
              this.deliveryNotesDetails.push(modelDetail);
              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            }
          })
        }
      },
      error: () => {
        this.isLoading = false;
        this.deliveryNotesDetailsList = [];
        this.formProductSearch.controls['productSearchFilter'].setValue('');
      }

    })
    /* } else { return; } */
  };
  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;
    try {
      this.deliveryNotesDetailsTest.forEach(data => {
        /**Caluclo subtotal = precio y multiplico por cantidad*/
        this.subtotal += data.quantity * data.price;
      });
      this.deliveryNotesDetailsTest.forEach((dato) => {
        /**Calculo iva restandolo al precio y multiplico por cantidad*/
        this.total += dato.price * dato.quantity;
      });

    } catch (error) { }
  };

  searchProduct(): void {

    this.product = this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter = this.product;
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => {
          this.isLoading = true;
          if (r.data.length == 1) {
            const model: ProductsModel = r.data[0];
            if (this.deliveryNotesDetails.find(item => item.productId == model.id)) {
              /*Actualizo la lista que envio al back */
              this.deliveryNotesDetails.filter(item => item.productId == model.id)[0]
                .quantity += 1;

              /*Actualizo la lista de la tabla */
              this.deliveryNotesDetailsList.filter(item => item.ownCode == model.id)[0]
                .quantity += 1;

              this.deliveryNotesDetailsList.filter(item => item.ownCode == model.id)[0]
                .subtotal += this.bindPrice(model) * model.quantity;

              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            } else {
              const product: ProductsModel = r.data[0];
              // /* Parseo el Producto a la grilla de Tabla */
              const model: deliveryNotesDetailsList = deliveryNotesGridParser(product, this.bindPrice(product));
              this.deliveryNotesDetailsTest.push(model);

              this.deliveryNotesDetailsList = this.deliveryNotesDetailsTest;

              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: DeliveryNotesDetails = deliveryNotesDetailParser(product, this.bindPrice(product));
              this.deliveryNotesDetails.push(modelDetail);
              this.deliveryNotesDetailsList = this.deliveryNotesDetailsTest
              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            }

          } else {
            this.isLoading = false;
            this.openComponentProduct();
          }

        },
        error: () => {
          this.isLoading = false;
          this.formProductSearch.controls['productSearchFilter'].setValue('');
        }
      })
    } else {
      this.isLoading = false;
      this.queryParams.filter = '';
      this.openComponentProduct();
    };
  };

  bindPrice(data: ProductsModel): number {
    const typePayment = this.paymentSelected;
    var a = Object.keys(data).filter(type => (type == typePayment));
    switch (a[0]) {

      default:
        return data.purchasePrice;
    }
  };

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
      detail => detail.productId == this.editId)[0];


    this.deliveryNotesDetailsList.filter(
      detail => detail.productId == this.editId
    )[0].subtotal = quantity * product.price;

    this.totalCalculate();

    this.deliveryNotesDetails.filter(
      detail => detail.productId == this.editId
    )[0].quantity = quantity;


  }

  openComponentCustomer(): void {
    const drawerRefSupplier = this.drawerService.create<
    InvoiceCustomerSearchComponent,
      {},
      CustomerAddModel
    >({
      nzTitle: 'Cliente',
      nzContent: InvoiceCustomerSearchComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzClosable: false,
    });
    drawerRefSupplier.afterClose.subscribe({
      next: (data) => {
        if (data != undefined) {
          this.supplierId = data.id;
          this.formDeliveryNotes.controls['supplierAddress'].setValue(data.address);
          this.formDeliveryNotes.controls['supplierCuit'].setValue(!isNil(data.cuit) ? data.cuit.replace(/[^a-zA-Z0-9 ]/g, '') : null);
          this.formDeliveryNotes.controls['supplierName'].setValue(data.name);
          this.formDeliveryNotes.controls['supplierDni'].setValue(data.dni)
        }
      },
      error: () => { },
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
  
  direction() {
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
          deliveryNotes_number: this.id,
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
          deliveryNotes_number: this.id,
          supplierId: this.supplierId,
          cancelled: ""
        };


        this.isSaving = true;
        this.service.saveDeliveryNotes(model)
          .subscribe({
            next: (r) => {
              this.showNotificationSuccess(
                'Guardado correcto',
                `Remito creado correctamente`
              );
              this.isSaving = false;
              this.router.navigate(['/home/deliveryNotes']);
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
        this.deliveryNotesDetailsList = [];
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
        && this.isValidForm(this.formSupplierSearch) && this.isValidForm(this.formProductSearch)) {
        this.popComponent.showConfirmation()
      } else {
        this.showMessageError('No ha seleccionado producto');
      }
    } catch (error) { }
  }

  selectPaid(value: string) {

    this.statusPaid = value;
    this.statusId = this.newStatusPaid
    if (value == 'si') {
      this.formDeliveryNotes.controls['statusId'].value
    } if (value == 'no') {
      this.formDeliveryNotes.controls['statusId'].value
    }

  }
}
