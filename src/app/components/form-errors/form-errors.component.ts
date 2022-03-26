import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.css']
})
export class FormErrorsComponent implements OnInit {

  @Input() control: any;
  constructor() { }

  ngOnInit(): void {
  }

}
