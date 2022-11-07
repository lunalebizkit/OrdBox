import { ElementRef, Input, OnInit, ViewChild, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { CategoriesService } from "../category.services";
import { CategoryModel } from "../model/category.model";


@Component({
    selector: 'app-categories-edit.drawer',
    templateUrl: './categories-edit.drawer.component.html',
})

export class CategoryEditDrawerComponent extends BaseComponent implements OnInit {
    @Input() set filter(value: number) {
        this.id = value;
    };
      /*
  ** Header
  */
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    /*
   ** Determina si esta en proceso de guardado
   */
   isSaving!: boolean;

   /*
    ** Determina si esta buscando el usuario
    */
   isLoading = false;

   /*
    ** id del usuario a editar, si es nuevo...
    */
   id!: number;
      /*
  ** Formulario
  */
  form!: FormGroup;

  constructor(
    private service: CategoriesService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder,
    private drawerRef: NzDrawerRef<string>
  ) { 
    super(notificacionService, el, message);
    this.form = this.fb.group({
      description: ['', [Validators.required]],
  })}

  ngOnInit(): void {
    if (this.id != null || this.id != undefined || this.id != 0) {
        this.getCategory(this.id)
    }
  }

  getCategory(id: number): void {
    if (id != 0)    
    this.service.getCategoryById(id).subscribe({
      next: (r)=>{
        this.form.controls['description'].setValue(r.description);
        this.isLoading= false
      },
      error: ()=>{  this.isLoading = false;}
    })

  }
  save(): void {
    if (this.isValidForm(this.form)) {
        const model: CategoryModel = {
            id: this.id !== undefined ? this.id : 0,
            description: this.form.controls['description'].value,
        };
        this.isSaving = true;
        this.service.saveCategory(model)
        .subscribe({
            next: (r)=>{
                this.showNotificationSuccess(
                    'Guardado correcto',
                    `Se guardo correctamente la Categoria ${model.description}`
                );
                this.isSaving = false;
                this.close(r.id);
            },
            error: ()=>{
                this.isSaving = false;
                this.showMessageError('No se pudo Guardar la Categoria');
                this.close();
            }
        })}       
}
    close(id: number | void): void {
        this.drawerRef.close(id);
    }

}