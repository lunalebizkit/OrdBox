
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { TransferItem } from "ng-zorro-antd/transfer";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { PermissionRolService } from "../permission-rol.service";
import { AddOrUpdatePermission, PermissionRol } from "./model/permission-rol.model";

@Component({
    selector: 'app-permission-rol',
    templateUrl: './permission-rol.component.html',
    styleUrls: ['./permission-rol.component.css']
})

export class PermissionRolComponent extends BaseComponent implements OnInit {

    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    @ViewChild('popup') popupComponent!: PopupConfirmationComponent;

    isSaving!: boolean;
    isLoading = false;
    disabled = false;
    permissionRol = [];
    permissionRolList: PermissionRol[] = [];
    list: TransferItem[] = [];
    listComplete: TransferItem[] = [];
    /* Formulario  */
    form!: FormGroup;
    rolSelected: any;
    permissionIdList: number[] = [];

    constructor(
        private servicePermission: PermissionRolService,
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private fb: FormBuilder,
        private router: Router,
    ) {
        super(notificacionService, el, message);
        this.form = this.fb.group({
            roleId: ['', Validators.required],
            permissions: [[], Validators.required]
        });
    }

    ngOnInit(): void {
        this.getPermission();
        this.getPermissionRol();
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
        this.renderOwnPermissions();
    };

    renderOwnPermissions(): void {  
        this.permissionIdList= [];   
        let newListOfPermissions: TransferItem[] = [];
        let newListOfPermissionsRight: TransferItem[] = [];
        let permission = this.permissionRolList.filter((item: any) => item.id == this.rolSelected)[0];

        if (permission.permissions.length > 0){

            permission.permissions.forEach(element => {
                newListOfPermissionsRight.push({ key: element.id, title: element.name, direction: 'right', disabled: false })
            });
            
            this.list.forEach((item, index) => {  
                if (newListOfPermissionsRight.find( (element) => element.title == item.title && element.direction === 'right')){
                    let newEditPermission: TransferItem = newListOfPermissionsRight.filter(p => p.title == item.title && p.direction != item.direction)[0];
                    newEditPermission.direction= 'right';

                    this.permissionIdList.push(newEditPermission['key']);

                  newListOfPermissions.push(newEditPermission);
                }
                else{
                    newListOfPermissions.push(item);
                }               
                })                   
            ;
            this.listComplete = newListOfPermissions
        }  else{
            this.listComplete= this.list;
        };
        this.form.controls['permissions'].setValue(this.permissionIdList);          
    };

    /* close(id: number | void): void {
        this.drawerRef.close(id);
    }; */

    msjConfirmOk() {
        try {
         if (this.isValidForm(this.form)){
            this.save();        
         }
         } catch (error) {
           console.log(error);

         }
    };
    save() {        
        const model : AddOrUpdatePermission =
            {
                id: this.form.controls['roleId'].value,
                name: '',
                key: '',
                permissionIds : this.form.controls['permissions'].value,
            };
            this.servicePermission.addOrUpdatePermissions(model).subscribe({
                next: (r)=> {
                    this.showNotificationSuccess(
                        'Guardado correcto',
                        `Se guardo correctamente el Cambio`
                    );
                    this.isSaving= false;
                   /*  this.close(); */
                },
                error: ()=>{
                    this.isSaving = false;
                    this.showMessageError('No se pudo Guardar el Cambio');
                   /*  this.close(); */
                }
            })        
        
    }
    change(ret: any): void {
        ret.list.forEach((element: { key: any, title: string, direction: string }) => {
            if (element.direction === 'right') {
                this.permissionIdList.push(Number(element.key))
            };
            if (element.direction === 'left') {
                this.permissionIdList = this.permissionIdList.filter(number =>
                    number != Number(element.key))
            }
            this.form.controls['permissions'].setValue(this.permissionIdList);
        });
    }
    direction(){
        this.router.navigate(['/home/products/list']);
    }
}