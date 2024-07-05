import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetaServiceService  {

  constructor() { }

  private pageTitle = '';
  private pageDescription = '';
  private pageImageUrl = '';

  setPageMetadata(title: string, description: string, imageUrl: string) {
    this.pageTitle = title;
    this.pageDescription = description;
    this.pageImageUrl = imageUrl;
  }

  getPageTitle(): string {
    return this.pageTitle;
  }

  getPageDescription(): string {
    return this.pageDescription;
  }

  getPageImageUrl(): string {
    return this.pageImageUrl;
  }
  
  getFirst12Words(sentence: string): string {
  // Split the sentence into words using whitespace as the delimiter
  const words = sentence.split(/\s+/);

  // Take the first 12 words and join them back into a string
  const first12Words = words.slice(0, 12).join(' ');

  return first12Words;
}

}