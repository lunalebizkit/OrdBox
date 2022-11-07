import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { BrandsService } from "../brands.services";
import { BrandsModel } from "../model/brands.model";

@Component({
    selector: 'app-brands-edit-drawer',
    templateUrl: './brands-edit.drawer.component.html',
})

export class BrandsEditDrawerComponent extends BaseComponent implements OnInit {
    @Input() set filter(value: number) {
        this.id = value;
    };

    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    isLoading!: boolean;
    isSaving!: boolean;
    form!: FormGroup;
    id!: number;

    constructor(
        private service: BrandsService,
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private drawerRef: NzDrawerRef<string>
    ) {
        super(notificacionService, el, message);
        this.form = this.fb.group({
            description: ['', Validators.required],
        })
    }

    ngOnInit(): void {
        if (this.id != null || this.id != undefined || this.id != 0) {
            this.getBrand(this.id)
        }
    };

    getBrand(id: number): void {
        if (id != 0) {
            this.service.getById(id).subscribe({
                next: (r) => {
                    this.form.controls['description'].setValue(r.description);
                    this.isLoading = false
                },
                error: () => { this.isLoading = false; }
            })
        }

    };

    save(): void {
        if (this.isValidForm(this.form)) {
            const model: BrandsModel = {
                id: this.id !== undefined ? this.id : 0,
                description: this.form.controls['description'].value,
            };
            this.isSaving = true;
            this.service.saveBrand(model)
                .subscribe({
                    next: (r) => {
                        this.showNotificationSuccess(
                            'Guardado correcto',
                            `Se guardo correctamente la Marca ${model.description}`
                        );
                       
                        this.isSaving = false;
                        this.close(r.id);
                    },
                    error: () => {
                        this.isSaving = false;
                        this.showMessageError('No se pudo Guardar la Marca')
                        this.close();
                    }
                })
        }
    };
    close(id: number | void): void {
        this.drawerRef.close(id);
    }

}