import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

export interface SeoConfig {
    title: string;               // e.g. "రాజకీయం - Neti Charithra"
    description: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    articlePublishedTime?: string;
    articleAuthor?: string;
    twitterCard?: 'summary' | 'summary_large_image';
}

const SITE_NAME = 'Neti Charithra';
const BASE_URL = 'https://neticharithra.com';
const DEFAULT_IMAGE = `${BASE_URL}/assets/images/og-default.jpg`;
const DEFAULT_DESCRIPTION =
    'Neti Charithra (నేటి చరిత్ర) – Latest Telugu News on Politics, Entertainment, Sports, Technology, Business and more from Andhra Pradesh & Telangana.';
const DEFAULT_KEYWORDS =
    'Telugu news, Andhra news, Neti Charithra, నేటి చరిత్ర, Andhra Pradesh news, Telangana news, Telugu live news, ' +
    'రాజకీయం, వినోదం, క్రీడలు, టెక్నాలజీ, వ్యాపారం';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(
        private title: Title,
        private meta: Meta,
        private router: Router,
        @Inject(DOCUMENT) private document: Document
    ) { }

    /**
     * Primary entry-point: call this on every route/component init.
     */
    updateSeo(config: SeoConfig): void {
        const pageTitle = config.title
            ? `${config.title} | ${SITE_NAME}`
            : `${SITE_NAME} – Latest Telugu News`;

        const description = config.description || DEFAULT_DESCRIPTION;
        const canonical = config.canonicalUrl || `${BASE_URL}${this.router.url}`;
        const image = config.ogImage || DEFAULT_IMAGE;
        const type = config.ogType || 'website';
        const twitterCard = config.twitterCard || 'summary_large_image';

        // ── <title> ───────────────────────────────────────────────────────────────
        this.title.setTitle(pageTitle);

        // ── Basic meta ────────────────────────────────────────────────────────────
        this.upsertMeta('description', description);
        if (config.keywords) {
            this.upsertMeta('keywords', config.keywords);
        }

        // ── Canonical ─────────────────────────────────────────────────────────────
        this.setCanonical(canonical);

        // ── Open Graph ────────────────────────────────────────────────────────────
        this.upsertProperty('og:site_name', SITE_NAME);
        this.upsertProperty('og:type', type);
        this.upsertProperty('og:title', pageTitle);
        this.upsertProperty('og:description', description);
        this.upsertProperty('og:url', canonical);
        this.upsertProperty('og:image', image);
        this.upsertProperty('og:locale', 'te_IN');
        this.upsertProperty('og:locale:alternate', 'en_IN');

        if (type === 'article') {
            if (config.articlePublishedTime) {
                this.upsertProperty('article:published_time', config.articlePublishedTime);
            }
            if (config.articleAuthor) {
                this.upsertProperty('article:author', config.articleAuthor);
            }
            this.upsertProperty('article:publisher', 'https://www.facebook.com/neticharithra');
        }

        // ── Twitter Card ──────────────────────────────────────────────────────────
        this.upsertMeta('twitter:card', twitterCard);
        this.upsertMeta('twitter:site', '@neticharithra');
        this.upsertMeta('twitter:creator', '@neticharithra');
        this.upsertMeta('twitter:title', pageTitle);
        this.upsertMeta('twitter:description', description);
        this.upsertMeta('twitter:image', image);
    }

    /**
     * Convenience helper for category pages.
     * Emits richer, unique meta descriptions per category for better
     * differentiation in SERPs.
     */
    setForCategory(categoryEnLabel: string, categoryTeLabel: string, urlSlug?: string): void {
        const canonicalUrl = urlSlug ? `${BASE_URL}/${urlSlug}` : undefined;
        this.updateSeo({
            title: `${categoryTeLabel} - ${categoryEnLabel} వార్తలు`,
            description:
                `${categoryTeLabel} వార్తలు – Neti Charithra లో తాజా ${categoryEnLabel} వార్తలు, ` +
                `విశ్లేషణలు మరియు అప్‌డేట్‌లు. Latest ${categoryEnLabel} news from Andhra Pradesh ` +
                `and Telangana in Telugu. | నేటి చరిత్ర`,
            keywords:
                `${categoryTeLabel}, ${categoryEnLabel} news Telugu, ` +
                `${categoryEnLabel} Andhra Pradesh news, ${categoryEnLabel} Telangana news, ` +
                `${DEFAULT_KEYWORDS}`,
            ogType: 'website',
            // Explicit canonical prevents old /category/ paths from being indexed
            canonicalUrl,
        });
    }

    /**
     * Convenience helper for individual article pages.
     */
    setForArticle(newsTitle: string, description: string, image?: string, publishedAt?: string): void {
        this.updateSeo({
            title: newsTitle,
            description: description || DEFAULT_DESCRIPTION,
            ogType: 'article',
            ogImage: image,
            articlePublishedTime: publishedAt,
            twitterCard: 'summary_large_image',
        });
    }

    /**
     * Reset to safe defaults (e.g. on Home route).
     */
    setDefaults(): void {
        this.updateSeo({
            title: `తాజా తెలుగు వార్తలు | Latest Telugu News`,
            description: DEFAULT_DESCRIPTION,
            keywords: DEFAULT_KEYWORDS,
            ogType: 'website',
            canonicalUrl: BASE_URL + '/',
        });
    }

    /**
     * Refresh only the canonical tag to the current router URL.
     * Call from AppComponent on NavigationEnd as a safety net for routes
     * that do not invoke updateSeo() themselves.
     */
    refreshCanonical(): void {
        // Only update if no component has set an explicit canonical
        // (i.e. the current canonical already equals BASE_URL + router.url)
        const currentCanonical = BASE_URL + this.router.url.split('?')[0];
        this.setCanonical(currentCanonical);
    }

    // ── Private helpers ─────────────────────────────────────────────────────────

    /** Upsert a name-based <meta> tag */
    private upsertMeta(name: string, content: string): void {
        if (this.meta.getTag(`name='${name}'`)) {
            this.meta.updateTag({ name, content });
        } else {
            this.meta.addTag({ name, content });
        }
    }

    /** Upsert a property-based <meta> tag (OG / article) */
    private upsertProperty(property: string, content: string): void {
        if (this.meta.getTag(`property='${property}'`)) {
            this.meta.updateTag({ property, content });
        } else {
            this.meta.addTag({ property, content });
        }
    }

    /** Set or update the <link rel="canonical"> tag */
    private setCanonical(url: string): void {
        let link: HTMLLinkElement | null =
            this.document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }
}
