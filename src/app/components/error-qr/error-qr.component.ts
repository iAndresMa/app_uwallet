import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-qr',
  templateUrl: './error-qr.component.html',
  styleUrls: ['./error-qr.component.scss'],
})
export class ErrorQrComponent implements OnInit {
  @Input() reloadFunction!: () => void;

  constructor() {}

  ngOnInit() {}
}
