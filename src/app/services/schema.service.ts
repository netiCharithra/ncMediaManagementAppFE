import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// ── Shared category data ─────────────────────────────────────────────────────
// Single source of truth used by SchemaService, FooterComponent, and NavbarComponent.

export interface NavCategory {
    label: string;    // Backend category value  (e.g. 'Political')
    te: string;       // Telugu display label
    icon: string;     // Font Awesome icon name (without "fa-")
    urlSlug: string;  // SEO URL path segment  (e.g. 'politics')
}

/**
 * Single source of truth for all public categories.
 * urlSlug drives routerLinks, canonical URLs, sitemap, and structured data.
 */
export const NAV_CATEGORIES: NavCategory[] = [
    { label: 'General', te: 'జనరల్', icon: 'newspaper', urlSlug: 'general' },
    { label: 'Political', te: 'రాజకీయం', icon: 'users', urlSlug: 'politics' },
    { label: 'Entertainment', te: 'వినోదం', icon: 'film', urlSlug: 'entertainment' },
    { label: 'Sports', te: 'క్రీడలు', icon: 'basketball-ball', urlSlug: 'sports' },
    { label: 'Technology', te: 'టెక్నాలజీ', icon: 'globe', urlSlug: 'technology' },
    { label: 'Business', te: 'వ్యాపారం', icon: 'industry', urlSlug: 'business' },
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

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 6 — Article Schema with BreadcrumbList
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Inject article-specific schema + BreadcrumbList.
     * Call from NewsExpandedComponent after article data loads.
     *
     * @param article.categoryLabel  Backend category label (e.g. 'Political') – used for breadcrumb
     * @param article.categorySlug   SEO slug (e.g. 'politics') – used for breadcrumb item URL
     */
    injectArticleSchema(article: {
        headline: string;
        description: string;
        image?: string;
        datePublished?: string;
        dateModified?: string;
        authorName?: string;
        url?: string;
        categoryLabel?: string;
        categorySlug?: string;
    }): void {
        const articleUrl = article.url || BASE_URL;
        const catSlug = article.categorySlug || '';
        const catLabel = article.categoryLabel || '';

        // Build BreadcrumbList: Home → Category → Article
        const breadcrumbItems: object[] = [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }
        ];
        if (catSlug && catLabel) {
            breadcrumbItems.push({
                '@type': 'ListItem',
                position: 2,
                name: catLabel,
                item: BASE_URL + '/' + catSlug
            });
        }
        breadcrumbItems.push({
            '@type': 'ListItem',
            position: breadcrumbItems.length + 1,
            name: article.headline,
            item: articleUrl
        });

        const schemas = [
            {
                '@context': 'https://schema.org',
                '@type': 'NewsArticle',
                headline: article.headline,
                description: article.description,
                image: article.image
                    ? [article.image]
                    : [BASE_URL + '/assets/images/og-default.jpg'],
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
                        url: BASE_URL + '/assets/images/logos/logo-512x512.png'
                    }
                },
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': articleUrl
                }
            },
            {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbItems
            }
        ];
        this.upsertScript(JSON.stringify(schemas), 'ld-json-article');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 6 — Category Schema: BreadcrumbList + ItemList
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Inject structured data for category listing pages.
     * Call from CategoryComponent after initCategory().
     *
     * @param catLabel   Backend label, e.g. 'Political'
     * @param catTe      Telugu label, e.g. 'రాజకీయం'
     * @param urlSlug    SEO slug, e.g. 'politics'
     * @param newsItems  First N articles from the category (for ItemList)
     */
    injectCategorySchema(
        catLabel: string,
        catTe: string,
        urlSlug: string,
        newsItems: Array<{ title: string; newsId: string; language?: string }> = []
    ): void {
        const catUrl = BASE_URL + '/' + urlSlug;

        const breadcrumb = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
                { '@type': 'ListItem', position: 2, name: catLabel, item: catUrl }
            ]
        };

        const itemList = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: catTe + ' (' + catLabel + ') వార్తలు',
            url: catUrl,
            itemListElement: newsItems.map((item, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: BASE_URL + '/news/' + (item.language || 'te') + '/' + item.newsId,
                name: item.title
            }))
        };

        this.upsertScript(JSON.stringify([breadcrumb, itemList]), 'ld-json-category');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP 6 — Homepage Schema: WebSite + BreadcrumbList + CategoryItemList
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Inject homepage schemas: WebSite + BreadcrumbList + category ItemList.
     * Call from HomeComponent.ngOnInit().
     */
    injectHomepageSchema(): void {
        const breadcrumb = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }
            ]
        };

        const categoryList = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Neti Charithra – News Categories',
            url: BASE_URL,
            itemListElement: NAV_CATEGORIES.map((cat, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: BASE_URL + '/' + cat.urlSlug,
                name: cat.te + ' (' + cat.label + ')'
            }))
        };

        this.upsertScript(JSON.stringify([breadcrumb, categoryList]), 'ld-json-homepage');
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
                    urlTemplate: BASE_URL + '/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
            }
        };
    }

    private buildSiteNavigationSchema(): object {
        const navElements = NAV_CATEGORIES.map((cat, index) => ({
            '@type': 'SiteNavigationElement',
            position: index + 1,
            name: cat.te + ' (' + cat.label + ')',
            description: cat.te + ' తాజా వార్తలు – Latest ' + cat.label + ' News Telugu',
            url: BASE_URL + '/' + cat.urlSlug   // ← new SEO-friendly flat URL
        }));

        // Add Grievance as a special link
        navElements.push({
            '@type': 'SiteNavigationElement',
            position: NAV_CATEGORIES.length + 1,
            name: 'ఫిర్యాదు (Grievance)',
            description: 'Submit your grievance – ఫిర్యాదు నమోదు చేయండి',
            url: BASE_URL + '/grievance'
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
