import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MessageService } from '../../services/message.service';
import { StorageService } from '../../services/storage.service';
import { LanguageService } from '../../../services/language.service';
declare var bootstrap: any;

@Component({
  selector: 'app-news-frame-management',

  templateUrl: './news-frame-management.component.html',
  styleUrl: './news-frame-management.component.scss'
})
export class NewsFrameManagementComponent {

  public loggedUserDetails: any = {}
  public configFrameValues: any = {};
  public previewChanges: boolean = false;

  constructor(
    public adminService: AdminService,
    private messageService: MessageService,
    private storage: StorageService,
    public languageService: LanguageService
  ) {
    this.loggedUserDetails = this.storage.getStoredUser();
  }



  ngOnInit(): void {

    // this.fetchEmployeeList();

    this.fetchNewsFrameList();
  }
  public frameStatus = ["Active", "Expired", "Upcoming"];
  public newsFrameData: any = {
    header: [],
    body: [],
    totalNumberOfRecords: null,
    count: 7,
    page: 1,
    tableLoaded: false,
    action: this.frameStatus[0]
  }
  public images: any;

  public disableFields: any = false;

  public newsFrameListData: any = {
    header: [
      { key: 'frameName', label: 'Frame Name' },
      { key: 'validFrom', label: 'Valid From', type: "dataTimePipe" },
      { key: 'validTo', label: 'Valid To', type: "dataTimePipe" },
      { key: 'frameLanguage', label: 'Frame Language' },
    ]
  }

  public newsFrameFormValues: any = {};
  public actionType: any = '';

  fetchNewsFrameList = () => {
    try {
      // this.pageData=null;
      let payload = {}
      // this.internalLoader = true;
      this.adminService.getNewsFrameList({ ...this.newsFrameData }).subscribe((response: any) => {
        console.log("response", response)
        if (response) {


          console.log(response)
          this.newsFrameListData.tableLoaded = true;
          // this.newsFrameListData.header = response?.header || []
          this.newsFrameListData.body = this.newsFrameData?.page === 1 ? response?.data || [] : [...this.newsFrameListData.body, ...response?.data || []]
          this.newsFrameListData.metaData = response?.metaData || []
          this.newsFrameListData.totalNumberOfRecords = response?.metadata?.totalRecords || []
          console.log(this.newsFrameListData)


        } else {
          this.messageService.showError(response.msg || "Failed !")
        }
      }, (error) => {
        console.error(error);
      })
    } catch (error) {
      console.error(error)
    }
  }

  onPageChange(page: number): void {
    console.log(page)
    // this.newsFrameData.page = page;
    // this.fetchNewsFrameList();
  }

  changeofNewFrame = () => {
    this.fetchNewsFrameList();
  }


  actionEmitter = (event: any) => {
    try {
      console.log(event)
      if (event.type === 'create') {
        this.newsFrameFormValues = {
          containerHeight: 535,
          frameHeight: 515,
          textPosition: {
            topPercent: 23, // 15% from the top
            leftPercent: 3, // 2% from the left
            frameReductionWidthPercent: 6, // 14% reduction in width
            contentHeight: 75 // in percentage
          }
        };
        this.actionType = event.type;
        this.formModalShowHide('show');
        // document.getElementById('addEmployeeBtn')?.click();
      } else if (event.type === 'view') {
        this.getImageTempUrl(event.rowData.frameData)
      } else if (event.type === 'edit') {
        this.getNewsFrameById(event.rowData.frameId);
      } else if (event.type === 'configure') {
        this.getFrameForConfiguration(event.rowData.frameId);
      }
    } catch (error) {
      console.error(error)
    }
  }
  public formModalShowHide(action: any) {
    if (action === 'show') {
      // this.newsFrameFormValues = {};
      this.images = [];

      // Ensure textPosition is initialized
      if (!this.newsFrameFormValues['textPosition']) {
        this.newsFrameFormValues['textPosition'] = {
          topPercent: 23,
          leftPercent: 3,
          frameReductionWidthPercent: 6,
          contentHeight: 75
        };
      }

      const modal = new bootstrap.Modal(document.getElementById('employeeFormModal'));
      modal.show();
    } else {
      const modal = bootstrap.Modal.getInstance(document.getElementById('employeeFormModal'));
      modal.hide();
    }
  }

  /**
   * Get image temp url
   */
  getImageTempUrl = (payload: any) => {


    this.adminService.getImageTempUrl({ ...payload, bucketName: 'news-frames' }).subscribe((response: any) => {
      if (response) {
        if (!this.newsFrameFormValues['frameData']) {
          this.newsFrameFormValues['frameData'] = {};
        }
        this.newsFrameFormValues['frameData']['tempURL'] = response?.downloadUrl;
        this.openImagePreview();
      }
      else {
        this.messageService.showError('Failed to get image temp url');
      }
    });
  }

  /**
   * Opens the image preview modal
   */
  public openImagePreview() {
    const previewUrl = this.newsFrameFormValues?.['frameData']?.['tempURL'];
    if (previewUrl) {
      const modalElement = document.getElementById('imagePreviewModal');
      // Close existing modal instance if any
      const existingModal = bootstrap.Modal.getInstance(modalElement);
      if (existingModal) {
        existingModal.dispose();
      }
      // Create and show new modal
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      this.messageService.showError('No image available for preview');
    }
  }

  /**
   * Downloads the image from the provided URL
   * @param imageUrl URL of the image to download
   */
  public downloadImage(imageUrl: string) {
    if (!imageUrl) {
      this.messageService.showError('No image available to download');
      return;
    }

    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${this.newsFrameFormValues['frameName'] || 'frame'}-${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Show success message
      this.messageService.showError('Image download started');
    } catch (error) {
      console.error('Error downloading image:', error);
      this.messageService.showError('Failed to download image');
    }
  }


  public fromErrors: any = {};


  saveNewsFrame = () => {
    try {
      if (!this.newsFrameFormValues?.['frameData']?.['fileName']) {
        this.messageService.showError("Please upload frame image!");
        return
      }
      else {
        console.log("proceed to save", this.newsFrameFormValues)


        const payload = { ...this.newsFrameFormValues };
        // Start of the day (00:00:00)
        payload['validFrom'] = new Date(payload['validFrom']);
        payload['validFrom'].setHours(0, 0, 0, 0);
        payload['validFrom'] = payload['validFrom'].getTime();

        // End of the day (23:59:59.999)
        payload['validTo'] = new Date(payload['validTo']);
        payload['validTo'].setHours(23, 59, 59, 999);
        payload['validTo'] = payload['validTo'].getTime();


        this.adminService?.[this.actionType === 'create' ? 'saveNewsFrame' : 'updateNewsFrame']({ ...this.loggedUserDetails, data: { ...payload } }).subscribe(
          (response: any) => {
            if (Object.keys(response).length > 0) {
              console.log("adding", response)
              this.formModalShowHide('hide');
              this.fetchNewsFrameList();
            }
          },
          (error: any) => {
            this.messageService.showError(error.msg || "Failed !");
          }
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  openUploadImageLocal = () => {
    document.getElementById('uploadFrameBtn')?.click();
  }

  upload(event: any) {
    const files = event.target.files;

    if (!this.newsFrameFormValues['frameName']) {
      this.messageService.showError("Please enter frame name! to upload new Frame");
      return;
    }
    if (this.newsFrameFormValues?.['frameData']?.['fileName']) {
      this.messageService.showError("Maximum 1 file can be uploaded!");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    formData.append('fileName', this.newsFrameFormValues['frameName']);
    formData.append('bucketType', "news-frames");

    this.adminService.uploadNewsImages(formData).subscribe(
      (response: any) => {
        console.log("responseresponse2", response)
        if (response?.length > 0) {
          this.newsFrameFormValues['frameData'] = {
            fileName: response[0]?.fileName,
            tempURL: response[0]?.tempURL
          };
        }
      },
      (error: any) => {
        this.messageService.showError('Failed to upload image. Please try again.');
        console.error('Upload error:', error);
      });
  }

  /**
   * Removes the uploaded image
   */
  removeUploadedImage() {
    if (!this.newsFrameFormValues?.['frameData']?.['fileName']) {
      this.messageService.showError('No image to remove');
      return;
    }


    const payload: any = {
      bucketType: "news-frames",
      fileName: this.newsFrameFormValues['frameData']['fileName']
    }

    this.adminService.removeNewsImage(payload).subscribe(
      (response: any) => {
        this.newsFrameFormValues['frameData'] = {};
        this.messageService.showError('Image removed successfully');
      },
      (error: any) => {
        this.messageService.showError('Failed to remove image. Please try again.');
        console.error('Remove error:', error);
      }
    );
  }


  /**
   * Get news frame by id
   */
  getNewsFrameById(id: any) {
    this.adminService.getNewsFrameById({ frameId: id }).subscribe((response: any) => {
      if (response) {
        this.newsFrameFormValues = { ...response };
        // Format dates for input fields (YYYY-MM-DD)
        const validFromDate = new Date(this.newsFrameFormValues['validFrom']);
        const validToDate = new Date(this.newsFrameFormValues['validTo']);

        this.newsFrameFormValues['validFrom'] = validFromDate.toISOString().split('T')[0];
        this.newsFrameFormValues['validTo'] = validToDate.toISOString().split('T')[0];

        // Initialize default values for new fields if they don't exist
        if (!this.newsFrameFormValues['containerHeight']) {
          this.newsFrameFormValues['containerHeight'] = 535;
        }

        if (!this.newsFrameFormValues['frameHeight']) {
          this.newsFrameFormValues['frameHeight'] = 515;
        }

        if (!this.newsFrameFormValues['textPosition']) {
          this.newsFrameFormValues['textPosition'] = {
            topPercent: 23,
            leftPercent: 3,
            frameReductionWidthPercent: 6,
            contentHeight: 75
          };
        }

        this.actionType = 'edit';
        this.formModalShowHide('show');
      }
    });
  }

  /**
   * Get frame data for configuration
   */
  getFrameForConfiguration(id: any) {
    this.adminService.getNewsFrameById({ frameId: id }).subscribe((response: any) => {
      if (response) {
        this.configFrameValues = { ...response };

        // Initialize default values for fields if they don't exist
        if (!this.configFrameValues['containerHeight']) {
          this.configFrameValues['containerHeight'] = 535;
        }

        if (!this.configFrameValues['frameHeight']) {
          this.configFrameValues['frameHeight'] = 515;
        }

        if (!this.configFrameValues['textPosition']) {
          this.configFrameValues['textPosition'] = {
            topPercent: 23,
            leftPercent: 3,
            frameReductionWidthPercent: 6,
            contentHeight: 75
          };
        }

        // Get image URL for preview
        if (this.configFrameValues?.['frameData']) {
          this.getConfigImageTempUrl(this.configFrameValues['frameData']);
        } else {
          this.showConfigureModal();
        }
      }
    });
  }

  /**
   * Get image temp URL for configuration modal
   */
  getConfigImageTempUrl = (payload: any) => {
    this.adminService.getImageTempUrl({ ...payload, bucketName: 'news-frames' }).subscribe((response: any) => {
      if (response) {
        if (!this.configFrameValues['frameData']) {
          this.configFrameValues['frameData'] = {};
        }
        this.configFrameValues['frameData']['tempURL'] = response?.downloadUrl;
        this.showConfigureModal();
      }
      else {
        this.messageService.showError('Failed to get image temp url');
        this.showConfigureModal();
      }
    });
  }

  /**
   * Shows the configure modal
   */
  showConfigureModal() {
    const modalElement = document.getElementById('configureFrameModal');
    // Close existing modal instance if any
    const existingModal = bootstrap.Modal.getInstance(modalElement);
    if (existingModal) {
      existingModal.dispose();
    }
    // Create and show new modal
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  /**
   * Save frame configuration
   */
  saveFrameConfiguration = () => {
    try {
      if (!this.configFrameValues?.['frameData']?.['fileName']) {
        this.messageService.showError("Frame image is required!");
        return;
      }
      else {
        console.log("proceed to save configuration", this.configFrameValues);

        // Create a complete payload with all necessary fields
        const payload = { ...this.configFrameValues };

        // If validFrom and validTo exist, format them properly
        if (payload['validFrom']) {
          // Start of the day (00:00:00)
          payload['validFrom'] = new Date(payload['validFrom']);
          payload['validFrom'].setHours(0, 0, 0, 0);
          payload['validFrom'] = payload['validFrom'].getTime();
        }

        if (payload['validTo']) {
          // End of the day (23:59:59.999)
          payload['validTo'] = new Date(payload['validTo']);
          payload['validTo'].setHours(23, 59, 59, 999);
          payload['validTo'] = payload['validTo'].getTime();
        }

        // Use updateNewsFrame API directly
        this.adminService.updateNewsFrame({ ...this.loggedUserDetails, data: { ...payload } }).subscribe(
          (response: any) => {
            if (Object.keys(response).length > 0) {
              console.log("configuration updated", response);
              // Close modal
              const modal = bootstrap.Modal.getInstance(document.getElementById('configureFrameModal'));
              modal.hide();
              // Refresh list
              this.fetchNewsFrameList();
            }
          },
          (error: any) => {
            this.messageService.showError(error.msg || "Failed to update frame configuration!");
          }
        );
      }
    } catch (error) {
      console.error(error);
      this.messageService.showError('An error occurred while saving frame configuration');
    }
  }
}
