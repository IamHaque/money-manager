import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-item',
  templateUrl: './footer-item.component.html',
  styleUrls: ['./footer-item.component.scss'],
})
export class FooterItemComponent implements OnInit {
  @Input() icon = '';
  @Input() title = '';
  @Input() active = '';
  @Input() link = '';

  constructor() {}

  ngOnInit(): void {}
}
