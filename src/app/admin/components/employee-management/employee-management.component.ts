import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { MessageService } from '../../services/message.service';
import { LanguageService } from '../../../services/language.service';
import { CommonFunctionalityService } from '../../services/common-functionality.service';
import { NgForm } from '@angular/forms';

interface EmployeeData {
  name: string;
  email: string;
  role: string;
  phone: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit {
  @ViewChild('employeeForm') employeeForm!: NgForm;
  
  loggedUserDetails: any;
  employeeData: EmployeeData = {
    name: '',
    email: '',
    role: '',
    phone: '',
    status: 'active'
  };

  constructor(
    private storage: StorageService,
    private messageService: MessageService,
    public languageService: LanguageService,
    public commonFunctionality: CommonFunctionalityService
  ) {
    this.loggedUserDetails = this.storage.getStoredUser();
  }

  ngOnInit(): void {
    // Initialize component
  }

  createEmployee(): void {
    if (this.employeeForm.valid) {
      // Create employee logic will go here
      console.log('Employee data:', this.employeeData);
    }
  }

  updateEmployee(): void {
    if (this.employeeForm.valid) {
      // Update employee logic will go here
    }
  }

  deleteEmployee(): void {
    // Delete employee logic will go here
  }

  resetForm(): void {
    this.employeeData = {
      name: '',
      email: '',
      role: '',
      phone: '',
      status: 'active'
    };
    if (this.employeeForm) {
      this.employeeForm.resetForm(this.employeeData);
    }
  }
}
