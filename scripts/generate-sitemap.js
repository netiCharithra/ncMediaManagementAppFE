#!/usr/bin/env node
/**
 * generate-sitemap.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Neti Charithra – Dynamic Sitemap Generator
 * Run: node scripts/generate-sitemap.js
 *       (or add as a post-build step in package.json)
 *
 * Outputs: src/sitemap.xml  (merged static + dynamic entries)
 *
 * Environment:
 *   SITEMAP_API_URL  – Base URL of the API that returns article IDs.
 *                      Expected shape: { records: [{ _id, language, updatedAt }] }
 *   OUT_DIR          – (optional) output directory; defaults to src/
 *
 * Usage in package.json:
 *   "scripts": {
 *     "build:sitemap": "node scripts/generate-sitemap.js",
 *     "build": "ng build && npm run build:sitemap"
 *   }
 */

'use strict';

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = 'https://neticharithra.com';
const API_URL = process.env.SITEMAP_API_URL || null; // Must be set in CI/CD
const OUT_DIR = process.env.OUT_DIR || path.join(__dirname, '..', 'src');
const OUT_FILE = path.join(OUT_DIR, 'sitemap.xml');
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// ── Static URL definitions ────────────────────────────────────────────────────
const STATIC_URLS = [
    {
        loc: '/', lastmod: TODAY, changefreq: 'always', priority: '1.0',
        hreflang: [{ lang: 'te', href: '/' }, { lang: 'en', href: '/' }]
    },
    { loc: '/latest-news', lastmod: TODAY, changefreq: 'always', priority: '0.9' },
    { loc: '/top-news', lastmod: TODAY, changefreq: 'hourly', priority: '0.9' },
    { loc: '/regional', lastmod: TODAY, changefreq: 'hourly', priority: '0.85' },
    { loc: '/international', lastmod: TODAY, changefreq: 'hourly', priority: '0.85' },

    // Category pages (flat SEO URLs)
    { loc: '/general', lastmod: TODAY, changefreq: 'hourly', priority: '0.8' },
    { loc: '/politics', lastmod: TODAY, changefreq: 'hourly', priority: '0.8' },
    { loc: '/entertainment', lastmod: TODAY, changefreq: 'hourly', priority: '0.8' },
    { loc: '/sports', lastmod: TODAY, changefreq: 'hourly', priority: '0.8' },
    { loc: '/technology', lastmod: TODAY, changefreq: 'daily', priority: '0.75' },
    { loc: '/business', lastmod: TODAY, changefreq: 'daily', priority: '0.75' },

    // Utility pages
    { loc: '/grievance', lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
    { loc: '/grievance/track', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
    { loc: '/grievance/compliance-reports', lastmod: TODAY, changefreq: 'weekly', priority: '0.5' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function buildUrlEntry(entry) {
    const fullLoc = escapeXml(BASE_URL + entry.loc);
    let hreflangLines = '';
    if (entry.hreflang) {
        hreflangLines = entry.hreflang
            .map(h => `    <xhtml:link rel="alternate" hreflang="${h.lang}" href="${escapeXml(BASE_URL + h.href)}"/>`)
            .join('\n');
    }
    return [
        '  <url>',
        `    <loc>${fullLoc}</loc>`,
        `    <lastmod>${entry.lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        hreflangLines,
        '  </url>',
    ].filter(Boolean).join('\n');
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        lib.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`JSON parse failed for ${url}: ${e.message}`)); }
            });
        }).on('error', reject);
    });
}

async function fetchArticleUrls() {
    if (!API_URL) {
        console.warn('[sitemap] SITEMAP_API_URL not set — skipping dynamic article URLs.');
        return [];
    }
    try {
        // Paginate through API if needed — adjust params per your API contract
        const params = new URL(API_URL);
        params.searchParams.set('page', '1');
        params.searchParams.set('count', '1000'); // Adjust per API limit
        const data = await fetchJson(params.toString());
        const records = data?.records || data?.data || [];
        return records.map(r => ({
            loc: `/news/${r.language || 'te'}/${r._id || r.newsId}`,
            lastmod: r.updatedAt
                ? new Date(r.updatedAt).toISOString().slice(0, 10)
                : TODAY,
            changefreq: 'weekly',
            priority: '0.6',
        }));
    } catch (err) {
        console.error('[sitemap] Failed to fetch dynamic articles:', err.message);
        return [];
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log('[sitemap] Generating sitemap...');

    const dynamicUrls = await fetchArticleUrls();
    const allUrls = [...STATIC_URLS, ...dynamicUrls];

    const urlEntries = allUrls.map(buildUrlEntry).join('\n\n');
    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        '',
        `  <!-- Neti Charithra Sitemap – Generated: ${new Date().toISOString()} -->`,
        `  <!-- Static URLs: ${STATIC_URLS.length} | Dynamic article URLs: ${dynamicUrls.length} -->`,
        '',
        urlEntries,
        '',
        '</urlset>',
    ].join('\n');

    fs.writeFileSync(OUT_FILE, xml, 'utf8');
    console.log(`[sitemap] ✅ Written ${allUrls.length} URLs → ${OUT_FILE}`);
}

main().catch(err => {
    console.error('[sitemap] ❌ Fatal error:', err);
    process.exit(1);
});
