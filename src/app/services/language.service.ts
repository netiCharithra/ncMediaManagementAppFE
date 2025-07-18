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
      contact: 'Contact',
      followUs: 'Follow Us',
      by: 'By',
      views: 'Views',
      likes: 'Likes',
      // Admin translations
      newsManagement: 'News Management',
      pendingNews: 'Pending News',
      approvedNews: 'Approved News',
      rejectedNews: 'Rejected News',
      reportNews: 'Report a News',
      addNews: 'Add News',
      editNews: 'Edit News',
      title: 'Title',
      subTitle: 'Sub Title',
      newsType: 'News Type',
      category: 'Category',
      description: 'Description',
      sourceLink: 'Source Link',
      photos: 'Photo(s)',
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update',
      approve: 'Approve',
      reject: 'Reject',
      loading: 'Loading...',
      uploadImages: 'Upload Images',
      enterUrl: 'Enter URL',
      get: 'GET',
      clickToUpload: 'Click or touch here to upload images/photos',
      source: 'Source',
      selectReporter: 'Select reporter',
      orUploadLocal: 'Or Upload from Local',
      uploadFromUrl: 'Upload from URL',
      state: 'State',
      district: 'District',
      mandal: 'Mandal',
      selectState: 'Select State',
      selectDistrict: 'Select District',
      selectMandal: 'Select Mandal',
      fieldRequired: 'This field is required',
      newsCreatedSuccess: 'News created successfully',
      newsUpdatedSuccess: 'News updated successfully',
      newsApprovedSuccess: 'News approved successfully',
      newsRejectedSuccess: 'News rejected successfully',
      // Navigation translations
      dashboard: 'Dashboard',
      userInfo: 'User Info',
      logout: 'Logout',
      // Employee management strings
      employeeManagement: 'Employee Management',
      employeeTracing: 'Employee Tracing',
      addEmployee: 'Add Employee',
      name: 'Name',
      email: 'Email',
      mobile: 'Mobile',
      role: 'Role',
      phone: 'Phone',
      status: 'Status',
      actions: 'Actions',
      selectRole: 'Select Role',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      reportedBy: 'Reported By'
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
      contact: 'సంప్రదించండి',
      followUs: 'మమ్మల్ని అనుసరించండి',
      by: 'ద్వారా',
      views: 'వీక్షణలు',
      likes: 'ఇష్టాలు',
      // Admin translations
      newsManagement: 'వార్తల నిర్వహణ',
      pendingNews: 'పెండింగ్ వార్తలు',
      approvedNews: 'ఆమోదించబడిన వార్తలు',
      rejectedNews: 'తిరస్కరించబడిన వార్తలు',
      reportNews: 'వార్త నివేదించండి',
      addNews: 'వార్త జోడించండి',
      editNews: 'వార్త సవరించండి',
      title: 'శీర్షిక (టైటిల్)',
      subTitle: 'ఉప శీర్షిక (సబ్ టైటిల్)',
      newsType: 'వార్త రకం (న్యూస్ టైపు)',
      category: 'వర్గం',
      description: 'వివరణ',
      sourceLink: 'మూల లింక్',
      photos: 'ఫోటో(లు)',
      cancel: 'రద్దు చేయండి',
      create: 'సృష్టించండి',
      update: 'నవీకరించండి',
      approve: 'ఆమోదించండి',
      reject: 'తిరస్కరించండి',
      loading: 'లోడ్ అవుతోంది...',
      uploadImages: 'చిత్రాలను అప్‌లోడ్ చేయండి',
      enterUrl: 'URL ను నమోదు చేయండి',
      get: 'పొందండి',
      clickToUpload: 'చిత్రాలను అప్‌లోడ్ చేయడానికి ఇక్కడ క్లిక్ చేయండి లేదా టచ్ చేయండి',
      source: 'మూలం',
      selectReporter: 'నివేదికను ఎంచుకోండి',
      orUploadLocal: 'లేదా స్థానిక నుండి అప్లోడ్ చేయండి',
      uploadFromUrl: 'URL నుండి అప్లోడ్ చేయండి',
      state: 'రాష్ట్రం',
      district: 'జిల్లా',
      mandal: 'మండలం',
      selectState: 'రాష్ట్రాన్ని ఎంచుకోండి',
      selectDistrict: 'జిల్లాను ఎంచుకోండి',
      selectMandal: 'మండలాన్ని ఎంచుకోండి',
      fieldRequired: 'ఈ ఫీల్డ్ అవసరం',
      newsCreatedSuccess: 'వార్త విజయవంతంగా సృష్టించబడింది',
      newsUpdatedSuccess: 'వార్త విజయవంతంగా నవీకరించబడింది',
      newsApprovedSuccess: 'వార్త విజయవంతంగా ఆమోదించబడింది',
      newsRejectedSuccess: 'వార్త విజయవంతంగా తిరస్కరించబడింది',
      // Navigation translations
      dashboard: 'డాష్‌బోర్డ్',
      userInfo: 'వినియోగదారు సమాచారం',
      logout: 'లాగ్అవుట్',
      // Employee management strings
      employeeManagement: 'ఉద్యోగుల నిర్వహణ',
      employeeTracing: 'ఉద్యోగుల ట్రేసింగ్',
      addEmployee: 'ఉద్యోగిని జోడించండి',
      name: 'పేరు',
      email: 'ఇమెయిల్',
      mobile: 'మొబైల్',
      role: 'పాత్ర',
      phone: 'ఫోన్',
      status: 'స్థితి',
      actions: 'చర్యలు',
      selectRole: 'పాత్రను ఎంచుకోండి',
      active: 'యాక్టివ్',
      inactive: 'ఇన్యాక్టివ్',
      save: 'సేవ్ చేయండి',
      reportedBy: 'ప్రమాణం'
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
