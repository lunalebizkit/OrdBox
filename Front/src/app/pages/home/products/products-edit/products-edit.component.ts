import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { BrandsService } from '../../brands/brands.services';
import { CategoriesService } from '../../categories/category.services';
import { EntityService } from '../../customers/customer.service';
import { ProductAddModel } from '../model/product.add.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.css']
})
export class ProductsEditComponent extends BaseComponent implements OnInit {


  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  /*
 ** Determina si esta en proceso de guardado
 */
  isSaving!: boolean;

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

  /*
   ** id del usuario a editar, si es nuevo...
   */
  id!: number;
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

  allCategories/*: {value: number, label: string}[] */ =[];
  allBrands = [];
  allSuppliers = [];
  constructor(
    private service: ProductService,
    private serviceCategory: CategoriesService,
    private serviceBrand: BrandsService,
    private serviceEntity: EntityService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      description: ['', [Validators.required]],
      code: [0, [Validators.required]],
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
      observation: ['', []]
      
    })
  }

  ngOnInit(): void {    
    this.getAllCategories();
    this.getAllBrands();
    this.getAllSupplier();
    this.route.params.subscribe({
      next: (p) => {
        if (p['id']) {
          this.isLoading = true;
          this.getProduct(p['id']);
          this.id = p['id'];
        }
      },
      error: () => { }
    })
  }

  getProduct(id: number): void {
    this.service.getById(id).subscribe({
      next: (r ) => {
        Object.keys(this.form.controls).forEach((key: string)=>{
          const ctr= this.form.controls[key];
          const value= r[key]
          if (value !== undefined && value !== null){
            switch (key) {
              case "categoryName":                
                ctr.setValue
              (this.allCategories
                .filter((v: { value: any, label: string}) =>  v.label.toLocaleLowerCase() == value.toLocaleLowerCase())
                .map((v: any) => v.value)[0] ); break;
              
              case "supplierName":
                ctr.setValue
                (this.allSuppliers
                  .filter((v: { value: any, label: string}) =>  v.label.toLocaleLowerCase() == value.toLocaleLowerCase())
                  .map((v: any) => v.value)[0] ); break;  
              
                case "brandName":
                  ctr.setValue
                  (this.allBrands
                    .filter((v: { value: any, label: string}) =>  v.label.toLocaleLowerCase() == value.toLocaleLowerCase())
                    .map((v: any) => v.value)[0] ); break;
              default:
                ctr.setValue(value)
            }  
           
           
          }         
        })
        

        this.isLoading = false
      },
      error: () => { this.isLoading = false; }
    })

  }

  entitySelectedChange(id: any): void {
    this.entitySelected = id;
  }

  categorySelectedChange(id: any): void {
    this.categorySelected = id;
  }
  brandSelectedChange(id: any): void {
    this.brandSelected = id;
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
        supplierid: this.form.controls['supplierName'].value
      };
      this.isSaving = true;
      this.service.saveProduct(model).subscribe({
        next: (r) => {
          this.showNotificationSuccess(
            'Guardado correcto',
            `Se guardo correctamente el Producto ${model.description}`
          );
          this.isSaving = false;
          this.headerComponent.goBack();
        },
        error: () => {
          this.isSaving = false;
          this.showMessageError('No se pudo Guardar el Producto')
        }
      })
    }
  }
  queryData = {
    filter: '',
    page: 0,
    pageSize: 100,
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
  formatterPeso = (value: number): string => `$ ${value}`;
  formatterPorcentaje = (value: number): string => `${value} %`;
  
  valuechange(newValue: any) {    
    this.onPrecioCosto(this.form.controls['purchasePrice'].value)
  }
 
  onPrecioCosto(valor: any) {
      this.form.controls['salePrice'].setValue(valor + (valor * this.form.controls['salePercentage'].value / 100))
      this.form.controls['cashSalePrice'].setValue(valor + (valor * this.form.controls['cashSalePercentage'].value / 100))
      this.form.controls['cardSalePrice'].setValue(valor + (valor * this.form.controls['cardSalePercentage'].value / 100))
   }
}


