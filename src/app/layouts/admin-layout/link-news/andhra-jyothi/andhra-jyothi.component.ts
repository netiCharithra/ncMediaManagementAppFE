import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertService } from 'app/services/alert.service';

@Component({
  selector: 'andhra-jyothi',
  templateUrl: './andhra-jyothi.component.html',
  styleUrls: ['./andhra-jyothi.component.scss']
})
export class AndhraJyothiComponent implements OnInit {

  public autoFetchLink:any='';
  constructor(private alertService: AlertService, private sanitizer: DomSanitizer) { }
  url: string = ''; // Variable to store the URL entered by the user
  safeUrl: SafeResourceUrl; // Variable to store the safe URL for the iframe

  ngOnInit(): void {
  }

  loadUrl() {
    // Sanitize and set the URL for the iframe
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  fetchLink = () => {
    let valueDom: any = document.getElementById('autoFetchLinkInput');
    console.log(valueDom.value)
    if (this.isValidURL(valueDom.value)) {
      this.autoFetchLink = this.sanitizer.bypassSecurityTrustResourceUrl(valueDom.value);

      // this.autoFetchLink = valueDom.value;
    } else {
      this.alertService.open('warning', 'Invalid URL', "Please enter a valid URL.")
    }
  }

  isValidURL(url) {
    // Regular expression to validate URLs
    var urlPattern = /^(http(s)?:\/\/)?(www\.)?([a-zA-Z0-9\-]+\.){1,}[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/;

    // Test the input URL against the regular expression
    return urlPattern.test(url);
  }


  fetchNews(){

    // Get a reference to the iframe element by its ID
    var iframe :any= document.getElementById('myIframe');

    // Access the content document of the iframe
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    // Use standard DOM queries within the iframe's document
    var articleHDElement = iframeDocument.querySelector('.articleHD');

    if (articleHDElement) {
      // You found the element, you can work with it here
      console.log(articleHDElement.textContent);
    } else {
      // Element not found
      console.log('Element with class "articleHD" not found in the iframe.');
    }

  }
}
