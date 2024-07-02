import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { AppServiceService } from 'app/services/app-service.service';
import { CommonFunctionalityService } from 'app/services/common-functionality.service';
import { MetaShareService } from 'app/services/meta-share.service';

@Component({
  selector: 'view-news-v2',
  templateUrl: './view-news-v2.component.html',
  styleUrls: ['./view-news-v2.component.scss']
})

export class ViewNewsV2Component implements OnInit, AfterViewInit {

  public paramNewsId: any;
  public paramNewsLang: any;
  public paramData: any;
  mainArticle = {
    title: 'Main News Article Title',
    content: 'This is the content of the main news article.',
    images: [
      'https://via.placeholder.com/600x400',
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200'
    ],
    date: new Date() // Use an actual date here
  };

  latestArticles = [
    { title: 'Latest News 1', date: new Date(), imageUrl: 'https://via.placeholder.com/60' },
    { title: 'Latest News 2', date: new Date(), imageUrl: 'https://via.placeholder.com/60' },
    { title: 'Latest News 3', date: new Date(), imageUrl: 'https://via.placeholder.com/60' },
    { title: 'Latest News 4', date: new Date(), imageUrl: 'https://via.placeholder.com/60' },
    { title: 'Latest News 5', date: new Date(), imageUrl: 'https://via.placeholder.com/60' },
  ];

  constructor(private elRef: ElementRef, private renderer: Renderer2, private appService: AppServiceService, public metaShareService: MetaShareService, private alertService: AlertService, private route: ActivatedRoute,
    public commonfunctionality: CommonFunctionalityService, private meta: Meta, private titleService: Title
  ) {


    this.route.paramMap.subscribe((params: ParamMap) => {
      // this.metaInformation = JSON.parse(this.commonFunctionality.decodingURI(params.get('id'))) || {}
      // Retrieve the parameter you're interested in

      this.paramNewsId = params.get('id');
      this.paramNewsLang = params.get('lang');
      if (params.get('data')) {
        console.log("data Here")
        let data = JSON.parse(commonfunctionality.decodingURI(params.get('data')))

        console.log(data)
        this.paramData = data;
        this.setTitle(data)
      }

      this.getNewsInfo();





      // console.log("RPO", params.get('id'))
      // this.handleParamChange();
    });




  }


  setTitle = (data: any) => {

    this.titleService.setTitle(data.title);
    this.meta.updateTag({ name: 'title', content: data.title });
    this.meta.updateTag({ name: 'description', content: data.sub_title });
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:image', content: data?.['images']?.[0]?.['tempURL'] || data?.['images']?.[0]?.['externalURL'] });
    this.meta.updateTag({ property: 'og:url', content: `https://neticharithra-ncmedia.web.app/#/view-news/${data.language}/${data.newsId}` });
    this.meta.updateTag({ property: 'og:description', content: data.sub_title });
    this.meta.updateTag({ property: 'twitter:image', content: data?.['images']?.[0]?.['tempURL'] || data?.['images']?.[0]?.['externalURL'] });
    this.meta.updateTag({ property: 'twitter:title', content: data.title });
    this.meta.updateTag({ property: 'twitter:description', content: data.sub_title });
    this.meta.updateTag({ property: 'twitter:url', content: `https://neticharithra-ncmedia.web.app/#/view-news/${data.language}/${data.newsId}` });
  }
  ngOnInit(): void {

    console.log("new v2, title set below")



  }

  ngAfterViewInit(): void {
    this.adjustImageHeights();
  }

  public pageData: any = {};
  public specificRecord: any = {};
  public recentRecords: any = {};
  getNewsInfo = () => {
    try {
      // this.pageData=null;
      let payload = {}
      this.appService.loaderService = true;
      this.appService.getPublicNewsInfo({ newsId: this.paramNewsId, language: this.paramNewsLang }).subscribe((response) => {
        if (response.status === 'success') {
          if (response.data) {
            this.pageData = response.data || {};
            console.log(this.pageData)
            this.specificRecord = response?.data?.specificRecord?.[0] || {};
            if (!this.paramData) {

              this.setTitle(this.specificRecord)

            }
            this.recentRecords = response?.data?.recentRecords
            // this.metaShareService.setPageMetadata(
            //   this.pageData.specificRecord[0].title + '| Neti Charithra',
            //   this.metaShareService.getFirst12Words(this.pageData.specificRecord[0].description || '') + '...',
            //   this.pageData.specificRecord[0]?.images?.[0]?.['tempURL']
            // )
            // this.titleService.setTitle(this.pageData.specificRecord[0].title  + '| Neti Charithra')
          }
          // console.log(response)
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      this.appService.loaderService = false;
      console.error(error)
    }
  }

  adjustImageHeights(): void {
    if (this.specificRecord?.images && this.specificRecord?.images?.length === 3) {
      const leftImage = this.elRef.nativeElement.querySelector('.main-img-left');
      const rightTopImage = this.elRef.nativeElement.querySelector('.half-height-image:nth-child(1)');
      const rightBottomImage = this.elRef.nativeElement.querySelector('.half-height-image:nth-child(2)');

      if (leftImage && rightTopImage && rightBottomImage) {
        const leftImageHeight = leftImage.clientHeight;
        this.renderer.setStyle(rightTopImage, 'height', `${leftImageHeight / 2}px`);
        this.renderer.setStyle(rightBottomImage, 'height', `${leftImageHeight / 2}px`);
      }
    }
  }

}
