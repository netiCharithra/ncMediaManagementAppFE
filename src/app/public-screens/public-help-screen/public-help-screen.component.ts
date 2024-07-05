import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFunctionalityService } from '../../services/common-functionality.service';
import { AppServiceService } from '../../services/app-service.service';

@Component({
  selector: 'nc-web-public-help-screen',
  templateUrl: './public-help-screen.component.html',
  styleUrl: './public-help-screen.component.scss'
})
export class PublicHelpScreenComponent implements OnInit {
  teamInfo: any[] = [];

  public userLanguage: any = 'te'

  constructor(private http: HttpClient, private router: Router, public commonFunctions: CommonFunctionalityService, private appService: AppServiceService) {
    this.userLanguage = this.commonFunctions.getCurrentLanguage()
  }

  ngOnInit(): void {
    this.getTeamInfo();
  }

  getTeamInfo(): void {
    this.appService.getHelpTeam({}).subscribe(
      (response: any) => {
        if (response?.status === 'success') {
          this.teamInfo = response?.data || [];
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  handleWhatsAppMessage(): void {
    window.open('https://wa.me/+916362923654', '_blank');
  }

  handleEmail(): void {
    window.location.href = 'mailto:netichatithra@gmail.com';
  }

  handleWebsite(): void {
    window.location.href = 'https://neticharithra-ncmedia.web.app/';
  }

  goBack(): void {
    this.router.navigate(['previous_route']); // Adjust to your previous route
  }
}