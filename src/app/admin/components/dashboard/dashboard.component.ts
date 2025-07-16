import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { AdminService } from '../../services/admin.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  selectedTimeframe: any = 'total';




  public dashboardStats: any = {};

  // Define timeframe type
  public timeframes: any[] = ['day', 'week', 'month', 'year', 'total'];

  // Chart options
  // Default chart options
  private getBaseChartOptions(title: string): EChartsOption {
    return {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: title,
          type: 'line',
          data: []
        }
      ]
    };
  }

  // Chart options for Visitors
  public chartOptionVisitors: EChartsOption = this.getBaseChartOptions('Visitors');
  
  // Chart options for Visits
  public chartOptionVisits: EChartsOption = this.getBaseChartOptions('Visits Traffic');



  constructor(private authService: AuthService, private storageService: StorageService, private adminService: AdminService, private storage: StorageService) { }

  ngOnInit() {
    this.loadUserData();
    this.getPageViewsCount();
    this.getDashboardArticlesStatsInfo();
    this.getArticlesByCategory();
    this.getActiveEmployeeStats();
    this.getChartData(this.selectedTimeframe);
    this.getVisitorLocations();
  }

  getChartData = (timeFrame: any) => {
    this.getVisitorTimeSeries(timeFrame)
    this.getVisitsTimeSeries(timeFrame)
  }
  private loadUserData() {
    const userData = this.storageService.getStoredUser();
    if (userData) {
      this.userName = userData?.name;
    }
  }

  onTimeframeChange(timeframe: any): void {
    // this.selectedTimeframe = timeframe;
    // this.updateChartData(timeframe);
    this.getChartData(timeframe)
  }

  private updateChartData(timeframe: any): void {
    this.selectedTimeframe = timeframe;


    // Update chart options
    this.chartOptionVisitors = {
      ...this.chartOptionVisitors,
      xAxis: {
        ...(this.chartOptionVisitors.xAxis as any),
        data: this.dashboardStats['visitorTimeSeries']['periods'] || []
      },
      series: [
        {
          ...(this.chartOptionVisitors.series as any[])[0],
          data: this.dashboardStats['visitorTimeSeries']['counts'] || []
        }
      ]
    };

    // Update chart options
    this.chartOptionVisits = {
      ...this.chartOptionVisits,
      xAxis: {
        ...(this.chartOptionVisits.xAxis as any),
        data: this.dashboardStats['visitsTimeSeries']['periods'] || []
      },
      series: [
        {
          ...(this.chartOptionVisits.series as any[])[0],
          data: this.dashboardStats['visitsTimeSeries']['counts'] || []
        }
      ]
    };
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


  getPageViewsCount = () => {
    try {
      this.adminService.loaderService = true;
      this.adminService.getDashboardVisitorStatsInfo({}).subscribe((response: any) => {
        if (response) {
          this.dashboardStats['pageVisistCounts'] = response || {}
        }
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }
  getDashboardArticlesStatsInfo = () => {
    try {
      this.adminService.loaderService = true;
      this.adminService.getDashboardArticlesStatsInfo({}).subscribe((response: any) => {
        if (response) {
          this.dashboardStats['pageArticlesCount'] = response || {}
        }
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }

  getArticlesByCategory = () => {
    try {
      this.adminService.loaderService = true;
      this.adminService.getArticlesByCategory({}).subscribe((response: any) => {
        if (response) {
          this.dashboardStats['articlesByCategory'] = response || {}
        }
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }
  getActiveEmployeeStats = () => {
    try {
      this.adminService.loaderService = true;
      this.adminService.getActiveEmployeeStats({}).subscribe((response: any) => {
        if (response) {
          this.dashboardStats['activeEmployeeStats'] = response || {}
        }
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }
  getVisitorTimeSeries = (timeframe: any) => {
    try {
      this.adminService.loaderService = true;
      this.adminService.getVisitorTimeSeries({ ...{ period: timeframe } }).subscribe((response: any) => {
        if (response) {
          console.log("respo chart", response)
          this.dashboardStats['visitorTimeSeries'] = response || {}
          this.updateChartData(timeframe)
        }
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }
  getVisitsTimeSeries = (timeframe: any) => {
    try {
      this.adminService.loaderService = true;
      this.adminService.getVisitsTimeSeries({ ...{ period: timeframe } }).subscribe((response: any) => {
        if (response) {
          this.dashboardStats['visitsTimeSeries'] = response || {}
          this.updateChartData(timeframe)
        }
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }
  getVisitorLocations = () => {
    try {
      this.adminService.loaderService = true;
      this.adminService.getVisitorLocations({}).subscribe((response: any) => {
        if (response) {
          console.log("respo chart", response)
          this.dashboardStats['visitorLocations'] = response || {}
        }
        this.adminService.loaderService = false;
      })
    } catch (error) {
      this.adminService.loaderService = false;
      console.error(error)
    }
  }
}
