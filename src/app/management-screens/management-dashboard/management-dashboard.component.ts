import { Component, OnInit } from '@angular/core';
import { color, EChartsOption } from 'echarts';
import { CommonFunctionalityService } from '../../services/common-functionality.service';
import { AppServiceService } from '../../services/app-service.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'nc-web-management-dashboard',
  templateUrl: './management-dashboard.component.html',
  styleUrl: './management-dashboard.component.scss'
})
export class ManagementDashboardComponent implements OnInit {
  public newsCountChart: any = {};
  public activeEmployeeChart: any = {}

  public loggedUserInfo: any = {}
  public dashboardMetaOptions: any = {

    chartBottomFilters: [
      "Yearly", "Monthly", "Recent"
    ],
    reportCardList: [
      {
        label: "Published",
        iconColor: "#00C45E",
        iconBackground: "#DFFFF3",
        keyTobeBinded: "approved",
        fields: "recent news",
        icon: "newspaper"

      },
      {
        label: "Pending",
        iconColor: "#FF9100",
        iconBackground: "#FFF6EA",
        keyTobeBinded: "pending",
        fields: "news",
        icon: "send-exclamation-fill"

      },
      {
        label: "Rejected",
        iconColor: "#EB4646",
        iconBackground: "#FAE1E1",
        keyTobeBinded: "rejected",
        fields: "news",
        icon: "send-x-fill"

      }
    ]
  }

  public dashboardMetaValues: any = {
    reportType: "Recent",
    year: new Date().getFullYear(),
    overallNewsReport: {}
  }
  constructor(public commonFunctions: CommonFunctionalityService, private appService: AppServiceService, private alertService: AlertService, private storage: StorageService) {

    this.dashboardMetaOptions['years'] = this.commonFunctions.getYearRangeReverse(2023);
    this.loggedUserInfo = this.storage.api.session.get('userData') || {};

    console.log(this.loggedUserInfo)
  }


  ngOnInit(): void {
    this.getNewsReportChart();
    this.getOverallNewsReport();
    this.getEmployeesActiveCount();
  }

  calculateApprovedPercentage(data: any) {
    if (!data) {
      return
    }
    const { approved, total } = data;
    if (total === 0) return 0; // To handle division by zero
    return ((approved / total) * 100) + '% ';
  }

  onYearChange = (event: any) => {
    this.dashboardMetaValues.year = parseInt(event.target.value);
    this.getNewsReportChart();
    // console.log()
  }

  getNewsReportChart = () => {
    try {
      this.appService.loaderService = true;

      this.appService.getNewsReportChart({ data: this.dashboardMetaValues }).subscribe((response) => {
        if (response.status === 'success') {

          console.log(response)
          if (response?.reports) {
            this.formChartReportV2(response?.reports)
          }
          this.alertService.open("success", "Success", response.msg || " ");
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error)
      this.appService.loaderService = false;
    }

  }
  getOverallNewsReport = () => {
    try {
      this.appService.loaderService = true;

      this.appService.getOverallNewsReport({}).subscribe((response) => {
        if (response.status === 'success') {

          if (response?.result) {
            this.dashboardMetaValues.overallNewsReport = response?.result || {}
          }
          this.alertService.open("success", "Success", response.msg || " ");
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error)
      this.appService.loaderService = false;
    }

  }
  getEmployeesActiveCount = () => {
    try {
      this.appService.loaderService = true;

      this.appService.getEmployeesActiveCount({}).subscribe((response) => {
        if (response.status === 'success') {

          if (response?.data) {
            // this.dashboardMetaValues['activeEmployeesCount'] = response?.data || {};
            this.formActiveEmployeeChart(response?.data || {})
          }
          this.alertService.open("success", "Success", response.msg || " ");
        } else {
          this.alertService.open('error', response.status.charAt(0).toUpperCase() + response.status.slice(1), response.msg || "Failed !")
        }
        this.appService.loaderService = false;
      }, (error) => {
        console.error(error);
        this.appService.loaderService = false;
      })
    } catch (error) {
      console.error(error)
      this.appService.loaderService = false;
    }

  }

  formChartReportV2 = (chartValues: any) => {

    this.newsCountChart = {

      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Pending', 'Approved', 'Rejected']
      },
      xAxis: {
        type: 'category',
        data: chartValues.xLabel || [],
        axisLabel: {
          interval: 0,
          rotate: this.commonFunctions.isMobile() ? 45 : 15
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Pending',
          type: 'line',
          data: chartValues.pending || [],
          smooth: true,
          lineStyle: {
            color: '#8B8000'
          },
          itemStyle: {
            color: '#8B8000'
          }
        },
        {
          name: 'Approved',
          type: 'line',
          data: chartValues.approved || [],
          smooth: true,
          lineStyle: {
            color: 'green'
          },
          itemStyle: {
            color: 'green'
          }
        },
        {
          name: 'Rejected',
          type: 'line',
          data: chartValues.rejected || [],
          smooth: true,
          lineStyle: {
            color: 'red'
          },
          itemStyle: {
            color: 'red'
          }
        }
      ],
      grid: {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30,
        containLabel: true
      }
      // grid: {
      //   bottom: 100
      // }
    }

  }


  formActiveEmployeeChart = (chartValues: any) => {
    this.activeEmployeeChart =

    {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: "Employee's Report",
          type: 'pie',
          radius: ['55%', '70%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center',
            formatter: function(params:any) {
              console.log(params)
              // Calculate the total value
              // const total = params.seriesData.reduce((sum:any, data:any) => sum + data.value, 0);
              return 'Total\n' + (chartValues.activeCount+chartValues.inactiveCount);
            },
            fontSize: 20,
            fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: true,
              formatter: '{b}\n{c}',
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: chartValues.activeCount, name: 'Active' ,         itemStyle: { color: 'green' }  // Set color for Active segment
          },
            { value: chartValues.inactiveCount, name: 'Inactive',           itemStyle: { color: '#c10a31' }  // Set color for Active segment
          }
          ]
        }
      ]
    }
    
  }


}
