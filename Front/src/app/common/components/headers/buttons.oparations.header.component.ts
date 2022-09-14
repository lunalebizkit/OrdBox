import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-header-op-buttons',
  templateUrl: './buttons.oparations.header.component.html',
  styleUrls:['button.operations.header.css']
})
export class HeaderOperationsButtonsComponent implements OnInit {

  @Input('btnSaveText') btnSaveText: string = 'Guardar';
  @Input('btnCancelText') btnCancelText: string = 'Volver';
  @Input('btnDeleteText') btnDeleteText: string = 'Eliminar';
  @Input('title') title!: string;
  @Input('iconSave') iconSave!: string
  @Input('iconDelete') iconDelete!: string
  @Input('iconTitle') iconTitle!: string
  @Input('iconBack') iconBack!: string
  @Input('showSpinner') showSpinner!: boolean;
  @Input('hideBack') hideBack: boolean = false;
  @Input('hideDelete') hideDelete: boolean = true;
  @Output('onSaveClick') onSaveClick: EventEmitter<any> = new EventEmitter<any>();
  @Output('onCancelClick') onCancelClick: EventEmitter<any> = new EventEmitter<any>();
  @Output('onDeleteClick') onDeleteClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
  }

  goBack() {
    if (this.onCancelClick.length>0) {
      this.onCancelClick.emit();
    }
    else {
      this.route.params.subscribe(p => {
        if (this.router.routerState.snapshot.url.split('home/', 2)[1].split('/')[0] == 'products'){
          this.router.navigate(['/home/products/list'])     
        }
        else{
          if (p['id']) {
            this.router.navigate(['../../'], { relativeTo: this.route });
          }
          else {
            this.router.navigate(['../'], { relativeTo: this.route });
          }
        }
       
      } );
    }
   }

}
