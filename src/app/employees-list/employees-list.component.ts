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
      this.appService.getAllEmployees({}).subscribe((response) => {
        // this.toaster.toast('error', 'Error', response.msg || "MESSS", true);
        console.log(response)
        if (response.status === 'success') {
          console.log(response['data']);
          this.employeeTables = this.employeeTablesCopy = response['data'] || []
          // this.alertService.open("success", "Success", response.msg || " ");
          // this.router.navigate(['/login']);
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
      })
    } catch (error) {
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
