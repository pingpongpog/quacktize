/**
 * Configuration options for Quacktize
 */
export interface QuacktizeOptions {
    /**
     * Enable lazy loading of images
     * @default true
     */
    lazyLoad?: boolean;
    
    /**
     * Distance in pixels before the viewport where images start loading
     * @default 200
     */
    lazyLoadThreshold?: number;
    
    /**
     * Enable prefetching of links
     * @default true
     */
    prefetch?: boolean;
    
    /**
     * Distance in pixels before the viewport where links get prefetched
     * @default 800
     */
    prefetchDistance?: number;
    
    /**
     * Enable smooth scrolling for anchor links
     * @default true
     */
    smoothScroll?: boolean;
    
    /**
     * Enable font loading optimizations
     * @default true
     */
    fontOptimization?: boolean;
    
    /**
     * Add resource hints for external domains
     * @default true
     */
    resourceHints?: boolean;
    
    /**
     * Defer non-critical JavaScript
     * @default true
     */
    deferJS?: boolean;
    
    /**
     * Enable performance metrics reporting
     * @default false
     */
    analytics?: boolean;
    
    /**
     * URL endpoint for analytics data
     */
    analyticsEndpoint?: string;
    
    /**
     * Enable debug logging
     * @default false
     */
    debug?: boolean;
  }
  
  /**
   * Performance metrics collected by Quacktize
   */
  export interface QuacktizeMetrics {
    /**
     * Total page load time in milliseconds
     */
    loadTime: number;
    
    /**
     * Number of resources optimized through prefetching
     */
    resourcesSaved: number;
    
    /**
     * Number of images optimized through lazy loading
     */
    imagesOptimized: number;
  }
  
  /**
   * Main Quacktize class for website performance optimization
   */
  export class Quacktize {
    /**
     * Create a new Quacktize instance
     * @param options - Configuration options
     */
    constructor(options?: QuacktizeOptions);
    
    /**
     * Initialize Quacktize with the provided options
     * @param options - Additional configuration options
     * @returns The Quacktize instance for chaining
     */
    init(options?: QuacktizeOptions): Quacktize;
    
    /**
     * Manually prefetch a URL
     * @param url - URL to prefetch
     * @returns The Quacktize instance for chaining
     */
    prefetch(url: string): Quacktize;
    
    /**
     * Manually load an image
     * @param selector - CSS selector for the image
     * @returns The Quacktize instance for chaining
     */
    loadImage(selector: string): Quacktize;
    
    /**
     * Generate critical CSS for above-the-fold content
     * @returns Critical CSS string
     */
    generateCriticalCSS(): string;
    
    /**
     * Apply critical CSS to the page
     */
    applyCriticalCSS(): void;
    
    /**
     * Get current performance metrics
     * @returns Performance metrics object
     */
    getMetrics(): QuacktizeMetrics;
    
    /**
     * Update configuration options
     * @param options - New configuration options
     * @returns The Quacktize instance for chaining
     */
    updateConfig(options: QuacktizeOptions): Quacktize;
  }
  
  export default Quacktize;