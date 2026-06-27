import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { eRol, rolList } from "../model/rol.enum";
import { UserModel } from "../model/user.model";
import { UserService } from "../users.services";
import { TransferItem } from "ng-zorro-antd/transfer";
import { PermissionRol } from "../../permission-rol/permission/model/permission-rol.model";
import { PermissionRolService } from "../../permission-rol/permission-rol.service"
@Component({
    selector: 'app-users.edit-drawer',
    templateUrl: './users-edit.drawer.component.html',
})

export class UsersEditDrawerComponent extends BaseComponent implements OnInit {
    @Input() set filter(value: number) {
        this.id = value;
    };
    /*
** Header
*/
    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
    @ViewChild('pop') popComponent!: PopupConfirmationComponent;
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
    ** Determina si se estan cargando los roles
    */
   isLoadingRoles = true;


   /*
    ** Determina si se muestra la sección para cambio de password
    */
   showPasswordChange = true;
   /*
 ** Formulario
 */
   form!: FormGroup;

   /*
    ** Listado de todos los roles
    */
   allRols = rolList;
   rolSelected: any;
   permissionIdList: number[] = [];
   list: TransferItem[] = [];
   listComplete: TransferItem[] = [];
   permissionRol = [];
   permissionRolList: PermissionRol[] = [];

    constructor(
        private service: UserService,
        private servicePermission: PermissionRolService,
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private fb: FormBuilder,
        private drawerRef: NzDrawerRef<string>,
    ) {
        super(notificacionService, el, message);
        this.form = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            userName: ['', [Validators.required]],
            password: [''],
            checkpassword:[''],
            email: ['', [Validators.email]],
            roleId: ['', [Validators.required]],

        })
    }

    ngOnInit(): void {
        if (this.id != null || this.id != undefined || this.id != 0) {
            this.getUser(this.id)
        }
        this.getPermission();
        this.getPermissionRol();
    };
    getRolName(id: number) {
        return eRol[id];
    }
    getPermission(): void {
        this.servicePermission.permissionList().subscribe({
            next: (r) => {
                r.forEach((element: any) => {
                    this.list.push({
                        key: element.id, title: element.name, disabled: false
                        , direction: 'left'
                    })
                });
                this.listComplete = this.list;

            },
            error: () => { }
        })
    }
    getPermissionRol(): void {
        this.servicePermission.permissionRolList().subscribe({
            next: (r) => {
                this.permissionRol = r.map((rol: { id: number, rol: string }) => { return { value: rol.id, label: rol.rol } });
                this.permissionRolList = r;
            },
            error: () => {
                this.permissionRol = [];
            }
        })
    };
    rolSelectedChange(id: any): void {
        this.rolSelected = id;
    };


    getUser(id: number): void {
        if (id != 0)
        this.service.getById(id).subscribe({
            next: (r) => {
                this.form.controls['firstName'].setValue(r.firstName),
                    this.form.controls['lastName'].setValue(r.lastName),
                    this.form.controls['userName'].setValue(r.userName),
                    this.form.controls['password'].setValue(r.password)
                    this.form.controls['email'].setValue(r.email),
                    this.form.controls['roleId'].setValue(r.roleId),
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        })
    };

    save(): void {
    this.updateConfirmValidator(); 
       if (this.isValidForm(this.form)) {  
                const model: UserModel = {
                    id: this.id !== undefined ? this.id : 0,
                    firstName: this.form.controls['firstName'].value,
                    lastName: this.form.controls['lastName'].value,
                    userName: this.form.controls['userName'].value,
                    password:this.form.controls['password'].value,
                    email: this.form.controls['email'].value,
                    roleId: this.form.controls['roleId'].value,
                };
                this.isSaving = true;
                this.service.saveUser(model)
                .subscribe({
                    next: (r)=>{
                        this.showNotificationSuccess(
                            'Guardado correcto',
                            `Se edito correctamente el usuario ${model.userName}`
                        );
                        this.isSaving = false;
                       this.close(r.id);                                       
                    },
                    error: ()=>{
                        this.isSaving = false;
                        this.showMessageError('No se pudo editar el usuario');
                        this.close();                                           
                    }
                })
       }    
    };
    close(id: number | void): void {
        this.drawerRef.close(id);
    };

       /*
     ** Muestra los inputs para cambiar la constraseña y los hace obligatorios
     */
     showPasswordChangeBox(): void {
        this.showPasswordChange = false;
        this.form.controls['password'].setValidators([Validators.required]);
        this.form.get('password')!.updateValueAndValidity();
        this.form.controls['checkpassword'].setValidators([Validators.required, this.confirmationValidator]);
        this.form.get('checkpassword')!.updateValueAndValidity();
     
    }

    /*
     ** Comprueba que ambas contraseñas son iguales
     */
    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.form.controls['password'].updateValueAndValidity());
        Promise.resolve().then(() => this.form.controls["checkpassword"].updateValueAndValidity());
        
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.form.controls['password'].value) {
            return { confirm: true, error: true };
        }
        return {};
    }

    msjConfirmOk(){
        try {
         if (this.isValidForm(this.form)) {
          this.popComponent.showConfirmation();
         } else{
           this.showMessageError
         }
         } catch (error) {
           console.log(error);
           
         }
    }

}