import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from 'app/services/app-service.service';
import { CommonFunctionalityService } from 'app/services/common-functionality.service';

@Component({
  selector: 'help-screen',
  templateUrl: './help-screen.component.html',
  styleUrls: ['./help-screen.component.scss']
})

export class HelpScreenComponent implements OnInit {
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