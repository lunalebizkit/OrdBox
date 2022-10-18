import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-select-products-modal',
  templateUrl: './select-products-modal.component.html',
  styleUrls: ['./select-products-modal.component.css'],
})
export class SelectProductsModalComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;

  constructor(private modalService: NzModalService) {}

  ngOnInit(): void {}

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
