import { Component , OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/apiService';
import { LocalDataSource } from 'ng2-smart-table';
import { AbstractControl } from '@angular/forms/src/model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-city',
    templateUrl: './city-view.component.html',
    styles: ['.op { opacity: 0; }']
})
export class CityViewComponent implements OnInit {
  
    @ViewChild('table') table;

    public source: LocalDataSource;
    public data;
    public rowSelected = -1;
    public mark: string;
    public text: string;
    public countries;
    public show = false;
    public form: FormGroup;
    public name: AbstractControl;
    public postalCode: AbstractControl;
    public country: AbstractControl;
    public comboItems = [];
    public edit = false;

    constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private fb: FormBuilder,) {
      this.form = this.fb.group({
        'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        'postalCode': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        'country': ['']
      });

      route.params.subscribe(param => {
        this.mark = param.mark;
        this.setTable();
    });
  
      this.name = this.form.controls['name'];
      this.postalCode = this.form.controls['postalCode'];
      this.country = this.form.controls['country'];
     }

    ngOnInit() {
      this.setTable();
      if(localStorage.getItem('mark')){
        this.show = true;
        this.name.setValue(localStorage.getItem('name'))
        this.postalCode.setValue(localStorage.getItem('postalCode'))
        this.country.setValue(localStorage.getItem('mark'))
        this.setValueInCombo(localStorage.getItem('mark'));
        localStorage.clear();
      }
    }

    settings = {
      mode: 'inline',
      actions: {
        add: false,
        edit: false
      },
      delete: {
        confirmDelete: true
      },
        columns: {
          name: {
            title: 'Name'
          },
          postalCode: {
            title: 'Postal Code'
          },
          countryName: {
            title: 'Country'
          }
        }
    };

    setNextCity() {
      let selected = -1;
      for(let i= 0; i< this.table.grid.dataSet.rows.length; i++) {
        if(this.table.grid.dataSet.rows[i].isSelected) {
          selected = this.table.grid.dataSet.rows[i].index;
          this.table.grid.dataSet.rows[i].isSelected = false;
        }
        if(selected !== -1 ) {
          if(selected === this.table.grid.dataSet.rows.length -1) {
            this.table.grid.dataSet.rows[0].isSelected = true;
            this.rowSelected = this.table.grid.dataSet.rows[0].data.name;
            break;
          } else {
            this.table.grid.dataSet.rows[selected+1].isSelected = true;
            this.rowSelected = this.table.grid.dataSet.rows[selected+1].data.name;
            break;
          }
        }
      }
    }

    setPrevCity() {
      let selected = -1;
      for(let i= 0; i< this.table.grid.dataSet.rows.length; i++) {
        if(this.table.grid.dataSet.rows[i].isSelected) {
          selected = this.table.grid.dataSet.rows[i].index;
          this.table.grid.dataSet.rows[i].isSelected = false;
        }
        if(selected !== -1 ) {
          if(selected === 0) {
            this.table.grid.dataSet.rows[this.table.grid.dataSet.rows.length-1].isSelected = true;
            break;
          } else {
            this.table.grid.dataSet.rows[selected-1].isSelected = true;
            break;
          }
        }
      }
    }

    prepareForTable(cities, countries) {
      cities.map(city => {
        const country = countries.filter( el => el._id === city.country)[0].name;
        city.countryName  = country;
      })
    }

  onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.apiService.deleteCity(this.mark, event.data._id).toPromise().then(data => {
        event.confirm.resolve();
      })
    } else {
      event.confirm.reject();
    }
  }

  getCities() {
    if(this.rowSelected) {
      this.router.navigateByUrl(`/country/${this.rowSelected}`);
    }else {
      this.router.navigateByUrl(`/country/0`);
    }
  }

  rowSelectedOnClick(event) {
    this.rowSelected = event.data.name
  }

  addCity() {
    this.show = true;
    this.setValueInCombo(this.mark);
  }

  confirmCity() {
    const country = this.comboItems.filter(el => el.mark === this.country.value)[0];
    const obj = { name: this.name.value, postalCode: this.postalCode.value, country: country._id}
    this.apiService.addCity(this.mark, country._id, obj).toPromise().then(data => {
      this.form.reset();
      this.setTable();
    })
    this.show = false;
  }

  cancelCity() {
    this.show = false;
    this.form.reset();
  }

  cancelEditCity() {
    this.show = false;
    this.form.reset();
  }

  setValueInCombo(mark) {
    this.country.setValue(mark)
  }

  setTable() {
    this.apiService.getCountries().toPromise().then( data => {
      this.countries = data;
      this.comboItems = data;
      // this.mark = this.route.snapshot.params.mark;
      if( this.mark == '0') {
        this.apiService.getCities('0').toPromise().then(data1 => {
          this.data = data1;
          this.prepareForTable(this.data, this.countries)
          this.source = new LocalDataSource(this.data);
          this.text = ""
          this.source.setPaging(10,20,false);
          if(localStorage.getItem('mark'))
            this.setValueInCombo(localStorage.getItem('mark'));
        })
        .catch(err => {
          console.log(err.eror)
        })
      }else {
        this.apiService.getCities(this.mark).toPromise().then(data1 => {
          this.data = data1;
          this.prepareForTable(this.data, this.countries)
          this.source = new LocalDataSource(this.data);
          this.text = ` of ${data1[0].countryName}`; 
          this.source.setPaging(10,20,false);
          this.setValueInCombo(this.mark);
          if(localStorage.getItem('mark'))
            this.setValueInCombo(localStorage.getItem('mark'));
        })
        .catch(err => {
          console.log(err.eror)
        })
      }
    })
    .catch(err => {
      console.log(err.eror)
    })
  }

  editCity() {
    this.show = true;
    this.edit = true;
    const city = this.data.filter(el => el.name == this.rowSelected)[0]
    this.name.setValue(city.name);
    this.postalCode.setValue(city.postalCode)
    this.setValueInCombo(this.mark);
  }

  editConfirum() {
    const country = this.comboItems.filter(el => el.mark === this.country.value)[0];
    const city = this.data.filter(el => el.name == this.rowSelected)[0]
    const data =  {name: this.name.value, postalCode: this.postalCode.value, country: country._id, _id: city._id}
    this.apiService.updateCity(this.mark, data).toPromise().then(response => {
      this.setTable();
    })
  }

  zoom() {
    localStorage.setItem('zoom', '1');
    localStorage.setItem('name', this.name.value)
    localStorage.setItem('postalCode', this.postalCode.value)
    this.router.navigateByUrl('/countries');
  }
}