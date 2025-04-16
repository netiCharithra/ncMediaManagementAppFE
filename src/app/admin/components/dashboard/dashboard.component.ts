import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  selectedTimeframe: 'week' | 'month' | 'year' = 'week';
  
  stats = {
    articles: {
      total: 2547,
      change: 12.5,
      trend: 'up'
    },
    users: {
      total: 14289,
      change: 8.2,
      trend: 'up'
    },
    pageViews: {
      total: '892K',
      change: 23.1,
      trend: 'up'
    },
    comments: {
      total: 4651,
      change: -3.2,
      trend: 'down'
    }
  };

  categories = [
    { name: 'Politics', count: 452, percentage: 75 },
    { name: 'Technology', count: 385, percentage: 65 },
    { name: 'Business', count: 328, percentage: 55 },
    { name: 'Sports', count: 287, percentage: 45 }
  ];

  recentActivity = [
    {
      type: 'article',
      action: 'New article published',
      icon: 'plus-circle',
      time: '2 minutes ago'
    },
    {
      type: 'edit',
      action: 'Article updated',
      icon: 'edit',
      time: '15 minutes ago'
    },
    {
      type: 'user',
      action: 'New user registered',
      icon: 'user-plus',
      time: '1 hour ago'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const userData = this.authService.getCurrentUser();
    if (userData) {
      this.userName = userData.name;
    }
  }

  changeTimeframe(timeframe: 'week' | 'month' | 'year') {
    this.selectedTimeframe = timeframe;
    // Here you would typically fetch new data based on the timeframe
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getChangeClass(change: number): string {
    return change >= 0 ? 'positive' : 'negative';
  }
}
