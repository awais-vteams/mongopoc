import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {FormGroup, FormBuilder, FormArray} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private _dataService: DataService, private fb: FormBuilder) {
    this.getCounts(null);

    this._dataService.getStates()
      .subscribe(res => this.states = res);
  }

  form: FormGroup;
  states: any;
  count: any = {count: '', time: ''};
  foundate: Array<number> = [];

  ngOnInit() {
    this.createForm();

    this.form.valueChanges.subscribe(
      (form) => {
        this.getCounts(form);
      }
    );

    for (let i = 1900; i < 2018; i++) {
      this.foundate.push(i);
    }
  }

  createForm() {
    this.form = this.fb.group({
      sic: this.fb.array([
        this.initSic(),
      ]),
      countries: this.fb.array([
        this.initCountry(),
      ]),
      state: this.fb.array([
        this.initState(),
      ]),
      employeeFrom: '',
      employeeTo: '',
      turnoverFrom: '',
      turnoverTo: '',
      foudateFrom: '',
      foudateTo: '',
    });
  }

  initCountry() {
    return this.fb.group({
      country: ''
    });
  }

  initState() {
    return this.fb.group({
      state: ''
    });
  }

  initSic() {
    return this.fb.group({
      sic: ''
    });
  }

  addCountry() {
    const control = < FormArray > this.form.controls['countries'];
    control.push(this.initCountry());
  }

  removeCountry(i: number) {
    const control = < FormArray > this.form.controls['countries'];
    control.removeAt(i);
  }

  addSic() {
    const control = < FormArray > this.form.controls['sic'];
    control.push(this.initSic());
  }

  removeSic(i: number) {
    const control = < FormArray > this.form.controls['sic'];
    control.removeAt(i);
  }

  removeState(i: number) {
    const control = < FormArray > this.form.controls['state'];
    control.removeAt(i);
  }

  addState() {
    const control = < FormArray > this.form.controls['state'];
    control.push(this.initState());
  }

  getCounts(data) {
    this._dataService.getCount(data)
      .subscribe(res => this.count = res);
  }

}
