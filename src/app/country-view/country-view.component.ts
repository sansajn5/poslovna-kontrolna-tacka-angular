import { Component , OnInit} from '@angular/core';
import { ApiService } from '../services/apiService';
import { LocalDataSource } from 'ng2-smart-table';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-country-view',
    templateUrl: './country-view.component.html'
})
export class CountryViewComponent implements OnInit {

    @ViewChild('table') table;

    public source: LocalDataSource;
    public data;
    public rowSelected;
    public zoom;

    constructor(private apiService: ApiService, private router: Router) {}

    ngOnInit() {
      this.apiService.getCountries().toPromise().then( data => {
        this.data = data;
        this.source = new LocalDataSource(this.data);
        if(localStorage.getItem('zoom') == '1') {
          this.zoom = true;
        } else {
          this.zoom = false;
        }
      })
      .catch(err => {
        console.log(err.eror)
      })
    }

    settings = {
      mode: 'inline',
      add: {
        confirmCreate: true
      },
      edit: {
        confirmSave: true
      },
      delete: {
        confirmDelete: true
      },
      columns: {
        mark: {
          title: 'Mark'
        },
        name: {
          title: 'Name'
        }
      }
    };

    setNextCountry() {
      let selected = -1;
      for(let i= 0; i< this.table.grid.dataSet.rows.length; i++) {
        if(this.table.grid.dataSet.rows[i].isSelected) {
          selected = this.table.grid.dataSet.rows[i].index;
          this.table.grid.dataSet.rows[i].isSelected = false;
        }
        if(selected !== -1 ) {
          if(selected === this.table.grid.dataSet.rows.length -1) {
            this.table.grid.dataSet.rows[0].isSelected = true;
            this.rowSelected = this.table.grid.dataSet.rows[0].data.mark;
            break;
          } else {
            this.table.grid.dataSet.rows[selected+1].isSelected = true;
            this.rowSelected = this.table.grid.dataSet.rows[selected+1].data.mark;
            break;
          }
        }
      }
    }

    setPrevCountry() {
      let selected = -1;
      for(let i= 0; i< this.table.grid.dataSet.rows.length; i++) {
        if(this.table.grid.dataSet.rows[i].isSelected) {
          selected = this.table.grid.dataSet.rows[i].index;
          this.table.grid.dataSet.rows[i].isSelected = false;
        }
        if(selected !== -1 ) {
          if(selected === 0) {
            this.table.grid.dataSet.rows[this.table.grid.dataSet.rows.length-1].isSelected = true;
            this.rowSelected = this.table.grid.dataSet.rows[this.table.grid.dataSet.rows.length-1].data.mark;
            break;
          } else {
            this.table.grid.dataSet.rows[selected-1].isSelected = true;
            this.rowSelected = this.table.grid.dataSet.rows[selected-1].data.mark;
            break;
          }
        }
      }
    }

    onCreateConfirm(event) {
      if (window.confirm('Are you sure you want to create?')) {
        this.apiService.createCountry(event.newData).toPromise().then(data => {
          event.confirm.resolve(event.newData);
        })
      } else {
        event.confirm.reject();
      }
    }

  onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.apiService.deleteCountry(event.data._id).toPromise().then(data => {
        event.confirm.resolve();
      })
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event) {
    if (window.confirm('Are you sure you want to save?')) {
      this.apiService.updateCountry(event.newData).toPromise().then(data => {
        event.confirm.resolve(event.newData);
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
    this.rowSelected = event.data.mark
  }

  setZoom() {
    localStorage.setItem('mark', this.rowSelected);
    this.router.navigateByUrl('/country/0');
  }

}

