import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StringKey } from '../types/language.types';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<'en' | 'te'>('te');
  currentLang$ = this.currentLang.asObservable();

  private translations: Record<'en' | 'te', Record<StringKey, string>> = {
    en: {
      home: 'Home',
      regional: 'Regional',
      international: 'International',
      latestNews: 'Latest News',
      topNews: 'Top News',
      readMore: 'Read More',
      viewAll: 'View All',
      footerText: 'Designed and Maintained by NC Digital Media Groups',
      copyright: 'All rights reserved',
      navigation: 'Navigation',
      contact: 'Contact'
    },
    te: {
      home: 'హోమ్',
      regional: 'ప్రాంతీయ',
      international: 'అంతర్జాతీయ',
      latestNews: 'తాజా వార్తలు',
      topNews: 'టాప్ వార్తలు',
      readMore: 'మరింత చదవండి',
      viewAll: 'అన్నీ చూడండి',
      footerText: 'రూపకల్పన మరియు నిర్వహణ NC డిజిటల్ మీడియా గ్రూప్స్',
      copyright: 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి',
      navigation: 'నావిగేషన్',
      contact: 'సంప్రదించండి'
    }
  };

  getString(key: StringKey): string {
    return this.translations[this.currentLang.value][key];
  }

  getCurrentLanguage(){
    return this.currentLang.value;
  }

  setLanguage(lang: 'en' | 'te'): void {
    this.currentLang.next(lang);
  }
}
