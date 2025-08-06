import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class AdminLoaderComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() customMessage: string = ''; // Custom message for specific processes
  @Input() showInstructions: boolean = false; // Show instruction mode
  @Input() instructionTitle: string = ''; // Title for instructions
  @Input() instructionText: string = ''; // Instruction content
  @Input() continueButtonText: string = 'Continue'; // Continue button text
  @Output() continueClicked = new EventEmitter<void>(); // Continue button click event
  
  loadingText: string = '';

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.currentLang$.subscribe(() => {
      this.updateLoadingText();
    });
    this.updateLoadingText();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update loading text when customMessage changes
    if (changes['customMessage']) {
      this.updateLoadingText();
    }
  }

  private updateLoadingText() {
    // Use custom message if provided, otherwise use default loading text
    if (this.customMessage && this.customMessage.trim()) {
      this.loadingText = this.customMessage;
    } else {
      const currentLang = this.languageService.getCurrentLanguage();
      this.loadingText = currentLang === 'te' ? 'లోడ్ అవుతోంది...' : 'Loading...';
    }
  }

  /**
   * Handle continue button click
   */
  onContinueClick(): void {
    this.continueClicked.emit();
  }
}
