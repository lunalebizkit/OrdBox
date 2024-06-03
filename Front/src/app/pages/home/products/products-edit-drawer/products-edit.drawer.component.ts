import { formatCurrency } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { BrandsService } from '../../brands/brands.services';
import { CategoriesService } from '../../categories/category.services';
import { EntityService } from '../../customers/customer.service';
import { ProductAddModel } from '../model/product.add.model';
import { ProductService } from '../product.service';
import { ProductCodeBarModal } from '../products-barcode-modal/products-barcode-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { isNil } from 'ng-zorro-antd/core/util';
import { isEmpty } from 'rxjs';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { PermissionService } from 'src/app/common/auth/permission/permission-manager.service';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';

@Component({
  selector: 'app-products-edit-drawer',
  templateUrl: './products-edit.drawer.component.html',
})
export class ProductsEditDrawerComponent extends BaseComponent implements OnInit {
  @Input() set filter(value: number) {
    this.id = value;
  };

  @Input() codeBar!: string;
  permissions = Permission;
  @ViewChild('popupDelete') popupDeleteComponent!: PopupConfirmationComponent;
  @ViewChild('popupActive') popupActiveComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F4') {
      this.createComponentModal();       
    }
  }
  /*
 ** Determina si esta en proceso de guardado
 */
  isSaving!: boolean;
  queryData = {
    filter: '',
    page: 0,
    pageSize: 100,
  };


  /*
   ** Determina si esta buscando el usuario
   */
  isLoading = false;
  isLoadingCategory = false;
  isLoadingBrand = false;
  isLoadingEntity = false;
  categorySelected: any = null;
  brandSelected: any = null;
  entitySelected: any = null;
  timeout!: any;
  /*
   ** id del usuario a editar, si es nuevo...
   */
  id!: number;
  isDeleted!: boolean;
  /*
** Formulario
*/
  form!: FormGroup;
  /**
 * Url del la imagen en preview
 */
  previewImage: string | undefined = '';

  /**
   * Determina si esta o no el preview activo
   */
  previewVisible = false;

  /**
   * Lista de imagenes
   */
  imagesList: NzUploadFile[] = [];

  allCategories: { value: string, label: string }[] = [];
  allBrands: { value: string, label: string }[] = [];
  allSuppliers: { value: string, label: string }[] = [];
  constructor(
    private service: ProductService,
    private serviceCategory: CategoriesService,
    private serviceBrand: BrandsService,
    private serviceEntity: EntityService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder,
    private drawerRef: NzDrawerRef<string>,
    @Inject(LOCALE_ID) public locale: string,
    private modalService: NzModalService,
    private permissionService: AuthService
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      description: ['', [Validators.required]],
      code: ['', [Validators.required]],
      categoryName: ['', [Validators.required]],
      brandName: ['', [Validators.required]],
      salePercentage: [50, [Validators.required]],
      cardSalePercentage: [60, [Validators.required]],
      cashSalePercentage: [40, [Validators.required]],
      salePrice: ['', [Validators.required]],
      purchasePrice: [0, [Validators.required]],
      cashSalePrice: [0, [Validators.required]],
      cardSalePrice: [0, [Validators.required]],
      supplierName: ['', [Validators.required]],
      quantity: [0, [Validators.required]],
      pointOrder: [0, [Validators.required]],
      observation: ['', []],
      barCode: ['', []]

    })
  }

  ngOnInit(): void {
     if (this.id != null || this.id != undefined || this.id != 0) {
      this.getProduct(this.id)
    }
  };
  /*
** Evento de busqueda datos en el server
*/
  onSearch(value: string): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {

      if (value.length > 2) {
        this.allSuppliers = [];
        this.queryData.filter = value;
        this.getAllSupplier();
      }
    }, 1000);
  };

  onSearchBrand(value: string): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {

      if (value.length > 2) {
        this.allBrands = [];
        this.queryData.filter = value;
        this.getAllBrands();
      }
    }, 1000);
  };

  onSearchCategory(value: string): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {

      if (value.length > 2) {
        this.allCategories = [];
        this.queryData.filter = value;
        this.getAllCategories();
      }
    }, 1000);
  };

  getProduct(id: number): void {
    if (id != 0)
      this.service.getById(id).subscribe({
        next: (r) => {         
          this.isDeleted = r.isDeleted;
          Object.keys(this.form.controls).forEach((key: string) => {
            const ctr = this.form.controls[key];
            const value = r[key]
            if (value !== undefined && value !== null) {
              switch (key) {
                case "categoryName":
                  this.categorySelectedChange(r.categoryName);
                  this.getAllCategories();
                  clearTimeout(this.timeout);
                  setTimeout(() => {
                    ctr.setValue
                      (this.allCategories
                        .filter((v: { value: any, label: string }) => v.label.toLocaleLowerCase() == value.toLocaleLowerCase())
                        .map((v: any) => v.value)[0]);
                    this.isLoadingCategory = false;
                  }, 800);
                  break;

                case "supplierName":
                  this.entitySelectedChange(r.supplierName);
                  this.getAllSupplier();
                  clearTimeout(this.timeout);
                  this.timeout = setTimeout(() => {
                    ctr.setValue
                      (this.allSuppliers
                        .filter((v: { value: any, label: string }) => v.label.toLocaleLowerCase() == value.toLocaleLowerCase())
                        .map((v: any) => v.value)[0]);
                    this.isLoadingEntity = false;
                  }, 1000); break;

                case "brandName":
                  this.brandSelectedChange(r.brandName);
                  this.getAllBrands();
                  setTimeout(() => {
                    ctr.setValue
                      (this.allBrands
                        .filter((v: { value: any, label: string }) => v.label.toLocaleLowerCase() == value.toLocaleLowerCase())
                        .map((v: any) => v.value)[0]);
                    this.isLoadingBrand = false;
                  }, 900);
                  break;
                default:
                  ctr.setValue(value)
              }


            }
          });

          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      })

  }

  entitySelectedChange(id: any): void {
    this.queryData.filter = id != undefined ? id : this.form.controls['supplierName'].value;

  }

  categorySelectedChange(id: any): void {
    this.queryData.filter = id != undefined ? id : this.form.controls['categoryName'].value;
  }
  brandSelectedChange(id: any): void {
    this.queryData.filter = id != undefined ? id : this.form.controls['brandName'].value;
  }
  save(): void {
    if (this.isValidForm(this.form)) {
      const model: ProductAddModel = {
        id: this.id !== undefined ? this.id : 0,
        description: this.form.controls['description'].value,
        code: this.form.controls['code'].value,
        categoryid: this.form.controls['categoryName'].value,
        brandid: this.form.controls['brandName'].value,
        cashSalePrice: this.form.controls['cashSalePrice'].value,
        cashSalePercentage: this.form.controls['cashSalePercentage'].value,
        quantity: this.form.controls['quantity'].value,
        purchasePrice: this.form.controls['purchasePrice'].value,
        salePrice: this.form.controls['salePrice'].value,
        salePercentage: this.form.controls['salePercentage'].value,
        cardSalePrice: this.form.controls['cardSalePrice'].value,
        cardSalePercentage: this.form.controls['cardSalePercentage'].value,
        pointOrder: this.form.controls['pointOrder'].value,
        observation: this.form.controls['observation'].value,
        supplierid: this.form.controls['supplierName'].value,
        barCode: this.form.controls['barCode'].value
      };
      this.isSaving = true;
      this.service.saveProduct(model).subscribe({
        next: (r) => {
          this.showNotificationSuccess(
            'Guardado correcto',
            `Se guardo correctamente el Producto ${model.description}`
          );
          this.isSaving = false;
          this.close(r.id);
        },
        error: () => {
          this.isSaving = false;
          this.showMessageError('No se pudo Guardar el Producto');
          this.close();
        }
      })
    }
  }

  getAllCategories(): void {
    this.isLoadingCategory = true;
    this.serviceCategory.getByFilter(this.queryData).subscribe({
      next: (r) => {
        this.isLoadingCategory = false;
        this.allCategories = r.data.map((category: { id: any, description: any }) => { return { value: category.id, label: category.description } });

      },
      error: () => {
        this.isLoadingCategory = false;
        this.allCategories = []
      }
    })
  }
  getAllBrands(): void {
    this.isLoadingBrand = true;
    this.serviceBrand.getByFilter(this.queryData).subscribe({
      next: (r) => {
        this.isLoadingBrand = false;
        this.allBrands = r.data.map((brand: { id: any, description: any }) => { return { value: brand.id, label: brand.description } });
      },
      error: () => {
        this.isLoadingBrand = false;
        this.allBrands = []
      }
    })
  }
  getAllSupplier(): void {
    this.isLoadingEntity = true;
    this.serviceEntity.getSuppliers(this.queryData).subscribe({
      next: (r) => {
        this.isLoadingEntity = false;
        this.allSuppliers = r.data.map((entity: { id: any, name: any }) => { return { value: entity.id, label: entity.name } });
      },
      error: () => {
        this.isLoadingEntity = false;
        this.allSuppliers = []
      }
    })
  }
  formatterPeso = (value: number): string => formatCurrency(value, this.locale, '$', 'ARS', '1.1-2');

  formatterPorcentaje = (value: number): string => `${value} %`;

  valuechange(newValue: any) {
    this.onPrecioCosto(this.form.controls['purchasePrice'].value)
  }

  onPrecioCosto(valor: any) {
    this.form.controls['salePrice'].setValue(valor + (valor * this.form.controls['salePercentage'].value / 100))
    this.form.controls['cashSalePrice'].setValue(valor + (valor * this.form.controls['cashSalePercentage'].value / 100))
    this.form.controls['cardSalePrice'].setValue(valor + (valor * this.form.controls['cardSalePercentage'].value / 100))
  };

  close(id: number | void): void {
    this.drawerRef.close(id);
  };

  msjConfirmOk() {
    try {
      if (this.isValidForm(this.form)) {
        this.popComponent.showConfirmation();
      } else {
        this.showMessageError('Formulario vacio')
      }
    } catch (error) {
      console.log(error);

    }
  }
  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
  }

  createComponentModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'Codigo de Barra',
      nzContent: ProductCodeBarModal  
    });    
  
    const instance = modal.getContentComponent();
    // Return a result when closed
    modal.afterClose.subscribe({
      next: (data: string) =>{
        if (!isNil(data) && (data))
        this.form.controls['barCode'].setValue(data);
      }, 
      error: e => {console.log(e);}      
    })    
  }

  handleOk() {
    this.service.delete(this.id).subscribe(
     {next: (r) => {
        this.popupDeleteComponent.isDeleteConfirmationVisible = false;
        this.showMessageSuccess("Producto eliminado");
        this.close(0);
      },
      error:(r) => { 
        this.showMessageError(r.error.descripcion);
        this.popupDeleteComponent.isDeleteConfirmationVisible = false;
      }
  });
  }
  
 
  handleActiveOk() {
    this.service.activate(this.id).subscribe(
     {next: (r) => {
        this.popupActiveComponent.isConfirmationvisible = false;
        this.showMessageSuccess("Producto activado");
        this.close(0);
      },
      error:(r) => { 
        this.showMessageError(r.error.descripcion);
        this.popupActiveComponent.isConfirmationvisible = false;
      }
  });
  }

  hasPermission(permissionId :Permission) : boolean{
   return this.permissionService.currentUser.permission.includes(permissionId);   
  }
}