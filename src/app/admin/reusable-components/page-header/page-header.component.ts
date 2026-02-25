import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
    /** Main headline title */
    @Input() title: string = '';

    /** Eyebrow text above the title */
    @Input() eyebrow: string = '';

    /** Subtitle/description below the title */
    @Input() subtitle: string = '';

    /** Optional icon right beside the eyebrow */
    @Input() eyebrowIcon: string = '';
}
