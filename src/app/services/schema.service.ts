import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// ── Shared category data ─────────────────────────────────────────────────────
// Single source of truth used by SchemaService, FooterComponent, and NavbarComponent.

export interface NavCategory {
    label: string;   // English label  (used in routerLink path)
    te: string;      // Telugu label
    icon: string;    // Font Awesome icon name (without "fa-")
}

export const NAV_CATEGORIES: NavCategory[] = [
    { label: 'General', te: 'జనరల్', icon: 'newspaper' },
    { label: 'Political', te: 'రాజకీయం', icon: 'users' },
    { label: 'Entertainment', te: 'వినోదం', icon: 'film' },
    { label: 'Sports', te: 'క్రీడలు', icon: 'basketball-ball' },
    { label: 'Technology', te: 'టెక్నాలజీ', icon: 'globe' },
    { label: 'Business', te: 'వ్యాపారం', icon: 'industry' },
];

// ── Service ──────────────────────────────────────────────────────────────────

const BASE_URL = 'https://neticharithra.com';

@Injectable({
    providedIn: 'root'
})
export class SchemaService {

    private scriptId = 'ld-json-schema';

    constructor(@Inject(DOCUMENT) private document: Document) { }

    /**
     * Injects (or replaces) the combined JSON-LD schema block.
     * Call this once from AppComponent.ngOnInit() – it never changes.
     */
    injectSiteSchema(): void {
        const schemas = [
            this.buildWebSiteSchema(),
            this.buildSiteNavigationSchema(),
        ];
        this.upsertScript(JSON.stringify(schemas));
    }

    /**
     * Inject article-specific schema (call from NewsExpandedComponent).
     */
    injectArticleSchema(article: {
        headline: string;
        description: string;
        image?: string;
        datePublished?: string;
        dateModified?: string;
        authorName?: string;
        url?: string;
    }): void {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.headline,
            description: article.description,
            image: article.image ? [article.image] : [`${BASE_URL}/assets/images/og-default.jpg`],
            datePublished: article.datePublished || new Date().toISOString(),
            dateModified: article.dateModified || article.datePublished || new Date().toISOString(),
            author: {
                '@type': 'Organization',
                name: article.authorName || 'Neti Charithra',
                url: BASE_URL
            },
            publisher: {
                '@type': 'Organization',
                name: 'Neti Charithra',
                logo: {
                    '@type': 'ImageObject',
                    url: `${BASE_URL}/assets/images/logo.png`
                }
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': article.url || BASE_URL
            }
        };
        this.upsertScript(JSON.stringify(schema), 'ld-json-article');
    }

    // ── Private builders ──────────────────────────────────────────────────────

    private buildWebSiteSchema(): object {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Neti Charithra',
            alternateName: 'నేటి చరిత్ర',
            url: BASE_URL,
            description:
                'Latest Telugu News – Politics, Entertainment, Sports, Technology & Business from Andhra Pradesh and Telangana.',
            inLanguage: ['te', 'en'],
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${BASE_URL}/search?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
            }
        };
    }

    private buildSiteNavigationSchema(): object {
        const navElements = NAV_CATEGORIES.map((cat, index) => ({
            '@type': 'SiteNavigationElement',
            position: index + 1,
            name: `${cat.te} (${cat.label})`,
            description: `${cat.te} తాజా వార్తలు – Latest ${cat.label} News Telugu`,
            url: `${BASE_URL}/category/${cat.label.toLowerCase()}`
        }));

        // Add Grievance as a special link
        navElements.push({
            '@type': 'SiteNavigationElement',
            position: NAV_CATEGORIES.length + 1,
            name: 'ఫిర్యాదు (Grievance)',
            description: 'Submit your grievance – ఫిర్యాదు నమోదు చేయండి',
            url: `${BASE_URL}/grievance`
        });

        return {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Neti Charithra Site Navigation',
            itemListElement: navElements
        };
    }

    /** Create or replace a <script type="application/ld+json"> block */
    private upsertScript(json: string, id: string = this.scriptId): void {
        let script = this.document.getElementById(id) as HTMLScriptElement | null;
        if (!script) {
            script = this.document.createElement('script');
            script.id = id;
            script.type = 'application/ld+json';
            this.document.head.appendChild(script);
        }
        script.textContent = json;
    }
}
