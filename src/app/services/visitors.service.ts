import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VisitorsService {
  private readonly visitorIdKey = 'visitorId';
  private readonly visitEndpoint = '/api/visit';

  constructor(private http: HttpClient) {}


  getOrCreateVisitorId(): string {
    let id = localStorage.getItem(this.visitorIdKey);
    if (!id) {
      id = this.generateVisitorIdWithTimestamp();
      localStorage.setItem(this.visitorIdKey, id);
    }
    return id;
  }

  private generateVisitorIdWithTimestamp(): string {
    const epoch = Date.now(); // milliseconds since Jan 1, 1970
    const random = Math.random().toString(36).substring(2, 12);
    return `visitor-${epoch}-${random}`;
  }
}
