/**
 * ContentProcessor.js
 * 
 * This utility applies concepts from the WhitePaperContinuationEngine to web development,
 * implementing chunked processing, progress reporting, content sanitization, and
 * structured analysis for the Justice Ben website.
 */

import { writable } from 'svelte/store';

/**
 * Progress reporting store for tracking long-running operations
 */
export const progressStore = writable({
    total: 0,
    current: 0,
    description: '',
    percentage: 0,
    isComplete: false,
    message: ''
});

/**
 * ProgressReporter class for tracking and reporting progress of operations
 */
export class ProgressReporter {
    /**
     * Initialize the progress reporter
     * @param {number} total - Total number of items to process
     * @param {string} description - Description of the operation
     */
    constructor(total, description = "Processing") {
        this.total = total;
        this.description = description;
        this.current = 0;
        
        // Initialize the progress store
        progressStore.set({
            total,
            current: 0,
            description,
            percentage: 0,
            isComplete: false,
            message: ''
        });
    }
    
    /**
     * Update the progress
     * @param {number|null} current - Current progress value (if null, increment by increment)
     * @param {number} increment - Amount to increment by if current is null
     */
    update(current = null, increment = 1) {
        if (current !== null) {
            this.current = current;
        } else {
            this.current += increment;
        }
        
        const percentage = Math.min(100, Math.round((this.current / this.total) * 100));
        
        progressStore.set({
            total: this.total,
            current: this.current,
            description: this.description,
            percentage,
            isComplete: this.current >= this.total,
            message: ''
        });
    }
    
    /**
     * Mark the progress as complete
     * @param {string} message - Message to display when complete
     */
    complete(message = "Complete") {
        this.update(this.total);
        
        progressStore.update(state => ({
            ...state,
            isComplete: true,
            message
        }));
    }
}

/**
 * ContentSanitizer class for sanitizing HTML content
 */
export class ContentSanitizer {
    /**
     * Sanitize HTML content
     * @param {string} content - HTML content to sanitize
     * @returns {string} - Sanitized HTML content
     */
    static sanitizeHtml(content) {
        if (!content) return '';
        
        // Replace NULL bytes which can cause issues
        content = content.replace(/\0/g, '');
        
        // Remove potentially dangerous tags and attributes
        content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        content = content.replace(/javascript:/gi, 'removed:');
        content = content.replace(/on\w+=/gi, 'data-removed=');
        
        return content;
    }
    
    /**
     * Sanitize text content
     * @param {string} text - Text content to sanitize
     * @returns {string} - Sanitized text content
     */
    static sanitizeText(text) {
        if (!text) return '';
        
        // Replace NULL bytes
        text = text.replace(/\0/g, '');
        
        // Encode HTML entities
        text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
            
        return text;
    }
}

/**
 * ChunkedContentLoader for loading large content in manageable chunks
 */
export class ChunkedContentLoader {
    /**
     * Initialize the chunked content loader
     * @param {Array} items - Array of items to process
     * @param {number} chunkSize - Size of each chunk
     * @param {function} processFunction - Function to process each chunk
     */
    constructor(items, chunkSize = 5, processFunction = null) {
        this.items = items;
        this.chunkSize = chunkSize;
        this.processFunction = processFunction || (chunk => chunk);
        this.currentChunk = 0;
        this.processedItems = [];
        this.isComplete = false;
        
        // Create a progress reporter
        this.progress = new ProgressReporter(
            Math.ceil(items.length / chunkSize),
            "Loading content"
        );
    }
    
    /**
     * Process the next chunk of items
     * @returns {Array} - The processed items so far
     */
    processNextChunk() {
        if (this.isComplete) return this.processedItems;
        
        const startIndex = this.currentChunk * this.chunkSize;
        const endIndex = Math.min(startIndex + this.chunkSize, this.items.length);
        
        if (startIndex >= this.items.length) {
            this.isComplete = true;
            this.progress.complete("Content loading complete");
            return this.processedItems;
        }
        
        const chunk = this.items.slice(startIndex, endIndex);
        const processedChunk = this.processFunction(chunk);
        
        this.processedItems = [...this.processedItems, ...processedChunk];
        this.currentChunk++;
        
        this.progress.update(this.currentChunk);
        
        if (endIndex >= this.items.length) {
            this.isComplete = true;
            this.progress.complete("Content loading complete");
        }
        
        return this.processedItems;
    }
    
    /**
     * Process all chunks at once
     * @returns {Array} - All processed items
     */
    processAll() {
        while (!this.isComplete) {
            this.processNextChunk();
        }
        
        return this.processedItems;
    }
}

/**
 * ContentAnalyzer for analyzing content structure
 */
export class ContentAnalyzer {
    /**
     * Analyze SVG content to extract key information
     * @param {string} svgContent - SVG content to analyze
     * @returns {Object} - Analysis results
     */
    static analyzeSvg(svgContent) {
        if (!svgContent) return { valid: false };
        
        // Check if it's a valid SVG
        const isSvg = svgContent.includes('<svg') && svgContent.includes('</svg>');
        if (!isSvg) return { valid: false };
        
        // Extract viewBox if present
        const viewBoxMatch = svgContent.match(/viewBox=["']([^"']*)["']/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : null;
        
        // Count elements
        const elementCounts = {
            paths: (svgContent.match(/<path/g) || []).length,
            circles: (svgContent.match(/<circle/g) || []).length,
            rects: (svgContent.match(/<rect/g) || []).length,
            texts: (svgContent.match(/<text/g) || []).length,
            groups: (svgContent.match(/<g/g) || []).length,
        };
        
        // Extract title if present
        const titleMatch = svgContent.match(/<title[^>]*>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : null;
        
        return {
            valid: true,
            viewBox,
            elementCounts,
            title,
            complexity: Object.values(elementCounts).reduce((sum, count) => sum + count, 0)
        };
    }
    
    /**
     * Analyze HTML content structure
     * @param {string} htmlContent - HTML content to analyze
     * @returns {Object} - Analysis results
     */
    static analyzeHtml(htmlContent) {
        if (!htmlContent) return { valid: false };
        
        // Extract headings
        const headings = [];
        const h1Matches = htmlContent.matchAll(/<h1[^>]*>(.*?)<\/h1>/g);
        const h2Matches = htmlContent.matchAll(/<h2[^>]*>(.*?)<\/h2>/g);
        const h3Matches = htmlContent.matchAll(/<h3[^>]*>(.*?)<\/h3>/g);
        
        for (const match of h1Matches) {
            headings.push({ level: 1, text: match[1] });
        }
        
        for (const match of h2Matches) {
            headings.push({ level: 2, text: match[1] });
        }
        
        for (const match of h3Matches) {
            headings.push({ level: 3, text: match[1] });
        }
        
        // Count paragraphs
        const paragraphCount = (htmlContent.match(/<p/g) || []).length;
        
        // Check for images
        const imageCount = (htmlContent.match(/<img/g) || []).length;
        
        return {
            valid: true,
            headings,
            paragraphCount,
            imageCount,
            hasStructure: headings.length > 0 || paragraphCount > 0
        };
    }
}

/**
 * Enhanced content loading with progress tracking
 * @param {Array} items - Array of items to load
 * @param {number} chunkSize - Size of each chunk
 * @param {function} processFunction - Function to process each item
 * @param {function} onProgress - Callback for progress updates
 * @param {function} onComplete - Callback for completion
 */
export function loadContentWithProgress(items, chunkSize, processFunction, onProgress, onComplete) {
    const loader = new ChunkedContentLoader(items, chunkSize, processFunction);
    
    function processChunks() {
        if (loader.isComplete) {
            if (onComplete) onComplete(loader.processedItems);
            return;
        }
        
        const processedItems = loader.processNextChunk();
        
        if (onProgress) {
            onProgress({
                items: processedItems,
                progress: {
                    current: loader.currentChunk,
                    total: Math.ceil(items.length / chunkSize),
                    percentage: Math.min(100, Math.round((loader.currentChunk / Math.ceil(items.length / chunkSize)) * 100))
                }
            });
        }
        
        // Use setTimeout to avoid blocking the UI
        setTimeout(processChunks, 0);
    }
    
    // Start processing
    processChunks();
}
