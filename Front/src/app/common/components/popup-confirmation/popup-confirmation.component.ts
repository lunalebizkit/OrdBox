import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.component.html'
})
export class PopupConfirmationComponent implements OnInit {

  /*
   ** Indica si se muestra la confirmacion de eliminación y de que elemento
   */
   isDeleteConfirmationVisible = false;
   elementSelectedToDelete!: number;

   @Input('title') title!: string;
   @Input('header') header!: string;
   @Input('message') message!: string;
   @Output('handleOk') handleOk: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  handleCancel() {
    this.isDeleteConfirmationVisible = false;
    this.elementSelectedToDelete = 0;
  }

  showDeleteConfirmation(id: number) {
    this.isDeleteConfirmationVisible = true;
    this.elementSelectedToDelete = id;
  }

}
