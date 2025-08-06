import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { StorageService } from '../../services/storage.service';
import { MessageService } from '../../services/message.service';
import { interval, Subscription } from 'rxjs';

interface WhatsAppBotStatus {
  isRunning: boolean;
  isAuthenticated: boolean;
  hasQRCode: boolean;
  state: string;
  lastQRTimestamp: string | null;
}

interface WhatsAppApiResponse {
  qrCode: string | null;
  qrCodeBase64: string | null;
  timestamp: string | null;
  botStatus: WhatsAppBotStatus;
  isAuthenticated: boolean;
  botState: string;
}

@Component({
  selector: 'app-whatsapp-bot-linking',
  templateUrl: './whatsapp-bot-linking.component.html',
  styleUrls: ['./whatsapp-bot-linking.component.scss']
})
export class WhatsappBotLinkingComponent implements OnInit, OnDestroy {

  // WhatsApp Bot Status and QR Code Data
  public whatsappData: WhatsAppApiResponse | null = null;
  public qrCodeImage: string | null = null;
  public isLoading = false;
  public isRefreshing = false;
  public autoRefreshEnabled = true;
  public errorMessage = '';
  
  // Subscriptions
  private refreshSubscription: Subscription | null = null;
  private statusCheckInterval = 30000; // 5 seconds

  public loggedUserDetails: any = {};

  constructor(
    private adminService: AdminService,
    private storageService: StorageService,
    private messageService: MessageService
  ) {
    this.loggedUserDetails = this.storageService.getStoredUser();
  }

  ngOnInit(): void {
    this.loadWhatsAppStatus();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  // Load WhatsApp bot status and QR code from API
  async loadWhatsAppStatus(): Promise<void> {
    this.isLoading = true;
    try {
      // Call your API endpoint: whatsapp/qr-code
      const response = await this.adminService.getWhatsAppQRCode().toPromise();
      this.whatsappData = response;
      
      // Set QR code image if available
      if (response.qrCodeBase64) {
        this.qrCodeImage = `data:image/png;base64,${response.qrCodeBase64}`;
      } else {
        this.qrCodeImage = null;
      }
      
      console.log('WhatsApp Status:', this.whatsappData);
    } catch (error) {
      console.error('Error loading WhatsApp status:', error);
      this.messageService.showError('Failed to load WhatsApp bot status');
    } finally {
      this.isLoading = false;
    }
  }

  // Refresh WhatsApp status manually
  async refreshStatus(): Promise<void> {
    this.isRefreshing = true;
    await this.loadWhatsAppStatus();
    this.isRefreshing = false;
    this.messageService.showInfo('WhatsApp status refreshed');
  }

  // Stop WhatsApp Bot with confirmation
  stopBot(): void {
    const confirmed = confirm('Are you sure you want to stop the WhatsApp bot? This will disconnect the bot and stop all WhatsApp services.');
    
    if (confirmed) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.adminService.stopWhatsAppBot().subscribe({
        next: (response) => {
          this.messageService.showInfo('WhatsApp bot stopped successfully');
          // Refresh status after stopping
          this.refreshStatus();
        },
        error: (error) => {
          console.error('Error stopping WhatsApp bot:', error);
          this.errorMessage = 'Failed to stop WhatsApp bot. Please try again.';
          this.isLoading = false;
          this.messageService.showInfo('Failed to stop WhatsApp bot');
        }
      });
    }
  }

  // Start auto-refresh interval
  startAutoRefresh(): void {
    if (this.autoRefreshEnabled) {
      this.refreshSubscription = interval(this.statusCheckInterval).subscribe(() => {
        if (!this.isLoading && !this.isRefreshing) {
          this.loadWhatsAppStatus();
        }
      });
    }
  }

  // Stop auto-refresh interval
  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  // Toggle auto-refresh
  toggleAutoRefresh(): void {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    if (this.autoRefreshEnabled) {
      this.startAutoRefresh();
      this.messageService.showInfo('Auto-refresh enabled');
    } else {
      this.stopAutoRefresh();
      this.messageService.showInfo('Auto-refresh disabled');
    }
  }

  // Get QR code image
  getQRCodeImage(): string {
    if (this.whatsappData) {
      // First check for qrCodeBase64
      if (this.whatsappData.qrCodeBase64) {
        if (this.whatsappData.qrCodeBase64.startsWith('data:image')) {
          return this.whatsappData.qrCodeBase64;
        }
        return `data:image/png;base64,${this.whatsappData.qrCodeBase64}`;
      }
      // Fallback to qrCode if qrCodeBase64 is not available
      if (this.whatsappData.qrCode) {
        if (this.whatsappData.qrCode.startsWith('data:image')) {
          return this.whatsappData.qrCode;
        }
        return `data:image/png;base64,${this.whatsappData.qrCode}`;
      }
    }
    return '';
  }

  // Get status badge class for styling
  getStatusBadgeClass(): string {
    if (!this.whatsappData) return 'badge-secondary';
    
    if (this.whatsappData.isAuthenticated) {
      return 'badge-success';
    } else if (this.whatsappData.botStatus.hasQRCode) {
      return 'badge-warning';
    } else {
      return 'badge-danger';
    }
  }

  // Get status text
  getStatusText(): string {
    if (!this.whatsappData) return 'Unknown';
    
    if (this.whatsappData.isAuthenticated) {
      return 'Connected & Authenticated';
    } else if (this.whatsappData.botStatus.hasQRCode) {
      return 'Waiting for QR Scan';
    } else {
      return 'Disconnected';
    }
  }

  // Get formatted timestamp
  getFormattedTimestamp(): string {
    if (!this.whatsappData?.timestamp) return 'N/A';
    return new Date(this.whatsappData.timestamp).toLocaleString();
  }

  // Get last QR timestamp
  getLastQRTimestamp(): string {
    if (!this.whatsappData?.botStatus.lastQRTimestamp) return 'N/A';
    return new Date(this.whatsappData.botStatus.lastQRTimestamp).toLocaleString();
  }
}
