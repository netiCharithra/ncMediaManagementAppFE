import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';

@Component({
  selector: 'employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {

  public employeeTables: any = [];
  public employeeTablesCopy: any = [];
  public searchValue: any = '';
  constructor(private appService: AppServiceService, private alertService: AlertService) { }


  ngOnInit(): void {
    this.getAllEmployees();
  }
  getAllEmployees = () => {
    try {
      this.appService.loaderService = true;
      this.appService.getAllEmployees({}).subscribe((response) => {
        if (response.status === 'success') {
          this.employeeTables = this.employeeTablesCopy = response['data'] || [];
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }

  changeOfSearchValue = () => {
    this.employeeTables = this.findObjectsWithSearchValue(this.employeeTablesCopy, this.searchValue)
  }

  findObjectsWithSearchValue(objects, searchValue: string) {
    const matchingObjects = [];

    for (const obj of objects) {
      for (const value of Object.values(obj)) {
        if (typeof value === 'string' && value.toLowerCase().includes(searchValue.toLowerCase())) {
          matchingObjects.push(obj);
          break;
        }
      }
    }

    return matchingObjects;

  }
}
