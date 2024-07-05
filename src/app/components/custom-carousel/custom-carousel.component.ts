import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonFunctionalityService } from '../../services/common-functionality.service';

@Component({
  selector: 'nc-web-custom-carousel',
  templateUrl: './custom-carousel.component.html',
  styleUrl: './custom-carousel.component.scss'
})
export class CustomCarouselComponent implements AfterViewInit, OnInit {

  @Input() carouselData:any=[];
  constructor (private cdr: ChangeDetectorRef, public commonFunctions: CommonFunctionalityService){

  }


  ngOnInit(): void {
    console.log(this.carouselData)
    if(this.carouselData?.length>0){

      setTimeout(() => {
        document.getElementById('nextBUtton')?.click()
      }, 2000);
    }
  }
  ngAfterViewInit() {
    // Call change detection after view initialization

   
    // this.triggerChangeDetection();
  }

  // Method to manually trigger change detection
  // triggerChangeDetection() {
  //   this.cdr.detectChanges();
  // }
  public slides:any[] = [
    { img: "https://via.placeholder.com/600x300" },
    { img: "https://via.placeholder.com/600x300" },
    { img: "https://via.placeholder.com/600x300" }
  ];
}
