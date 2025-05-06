/**
 * Quacktize.js
 * A comprehensive library for optimizing website performance with a simple API
 * 
 * Features:
 * - Lazy loading of images
 * - Image pre-fetching
 * - Resource prioritization
 * - Smooth scrolling
 * - Font optimization
 * - Critical CSS extraction
 * - Network resource hints
 * - Defer non-critical JavaScript
 */

/**
 * Main Quacktize class
 */
export class Quacktize {
    constructor(options = {}) {
      // Default configuration
      this.config = {
        lazyLoad: true,
        lazyLoadThreshold: 200,
        prefetch: true,
        prefetchDistance: 800,
        smoothScroll: true,
        fontOptimization: true,
        resourceHints: true,
        deferJS: true,
        analytics: false,
        debug: false,
        ...options
      };
  
      this.prefetchedUrls = new Set();
      this.initialized = false;
      this.metrics = {
        loadTime: 0,
        resourcesSaved: 0,
        imagesOptimized: 0
      };
    }
  
    /**
     * Initialize the optimizer with provided options
     * @param {Object} options - Configuration options
     * @returns {Quacktize} - Instance for chaining
     */
    init(options = {}) {
      if (this.initialized) {
        this._log('Quacktize already initialized');
        return this;
      }
  
      // Merge options
      this.config = { ...this.config, ...options };
      this._log('Initializing Quacktize with config:', this.config);
  
      // Record page load start time
      this.startTime = performance.now();
  
      // Initialize features based on config
      if (this.config.lazyLoad) this._initLazyLoad();
      if (this.config.prefetch) this._initPrefetch();
      if (this.config.smoothScroll) this._initSmoothScroll();
      if (this.config.fontOptimization) this._optimizeFonts();
      if (this.config.resourceHints) this._addResourceHints();
      if (this.config.deferJS) this._deferNonCriticalJS();
  
      // Set initialized flag
      this.initialized = true;
  
      // Calculate and report initial metrics
      window.addEventListener('load', () => {
        this.metrics.loadTime = performance.now() - this.startTime;
        this._log(`Page fully loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        if (this.config.analytics) this._reportMetrics();
      });
  
      return this;
    }
  
    /**
     * Initialize lazy loading for images
     * @private
     */
    _initLazyLoad() {
      this._log('Initializing lazy loading');
      
      // Use Intersection Observer if available
      if ('IntersectionObserver' in window) {
        const lazyLoadOptions = {
          rootMargin: `${this.config.lazyLoadThreshold}px`,
          threshold: 0.01
        };
  
        const lazyLoadObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Replace src with data-src
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                this.metrics.imagesOptimized++;
              }
              
              // Replace srcset with data-srcset
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
              }
              
              lazyLoadObserver.unobserve(img);
            }
          });
        }, lazyLoadOptions);
  
        // Target all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
          lazyLoadObserver.observe(img);
        });
      } else {
        // Fallback for browsers without Intersection Observer
        this._lazyLoadFallback();
      }
    }
  
    /**
     * Fallback lazy loading for browsers without IntersectionObserver
     * @private
     */
    _lazyLoadFallback() {
      this._log('Using fallback lazy loading');
      
      const loadVisibleImages = () => {
        const viewHeight = window.innerHeight;
        
        document.querySelectorAll('img[data-src]').forEach(img => {
          const rect = img.getBoundingClientRect();
          
          // Check if image is in viewport or about to be
          if (rect.top <= viewHeight + this.config.lazyLoadThreshold) {
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              this.metrics.imagesOptimized++;
            }
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
          }
        });
      };
  
      // Load initial visible images
      loadVisibleImages();
      
      // Add scroll and resize listeners
      window.addEventListener('scroll', this._throttle(loadVisibleImages, 200));
      window.addEventListener('resize', this._throttle(loadVisibleImages, 200));
    }
  
    /**
     * Initialize prefetching for links
     * @private
     */
    _initPrefetch() {
      this._log('Initializing link prefetching');
      
      if ('IntersectionObserver' in window) {
        const prefetchObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const link = entry.target;
              const href = link.getAttribute('href');
              
              if (href && 
                  href.startsWith(window.location.origin) && 
                  !this.prefetchedUrls.has(href) && 
                  !href.includes('#')) {
                
                this._prefetchUrl(href);
                this.prefetchedUrls.add(href);
                prefetchObserver.unobserve(link);
              }
            }
          });
        }, {
          rootMargin: `${this.config.prefetchDistance}px`,
          threshold: 0.01
        });
  
        // Observe all links on the page
        document.querySelectorAll('a[href]').forEach(link => {
          prefetchObserver.observe(link);
        });
      }
  
      // Add event listeners for hover prefetching
      document.addEventListener('mouseover', this._throttle((e) => {
        if (e.target.tagName === 'A') {
          const href = e.target.getAttribute('href');
          
          if (href && 
              href.startsWith(window.location.origin) && 
              !this.prefetchedUrls.has(href) && 
              !href.includes('#')) {
            
            this._prefetchUrl(href);
            this.prefetchedUrls.add(href);
          }
        }
      }, 100));
    }
  
    /**
     * Prefetch a URL
     * @param {string} url - URL to prefetch
     * @private
     */
    _prefetchUrl(url) {
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = url;
      document.head.appendChild(prefetchLink);
      this._log(`Prefetched: ${url}`);
      this.metrics.resourcesSaved++;
    }
  
    /**
     * Initialize smooth scrolling
     * @private
     */
    _initSmoothScroll() {
      this._log('Initializing smooth scrolling');
      
      // Add smooth scrolling to internal links
      document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          
          const targetId = anchor.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Use scrollIntoView with smooth behavior if supported
            if ('scrollBehavior' in document.documentElement.style) {
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            } else {
              // Fallback for browsers that don't support smooth scrolling
              this._smoothScrollFallback(targetElement);
            }
          }
        });
      });
    }
  
    /**
     * Fallback smooth scrolling implementation
     * @param {Element} targetElement - Element to scroll to
     * @private
     */
    _smoothScrollFallback(targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 500; // ms
      let startTime = null;
      
      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeInOutCubic = progress < 0.5 
          ? 4 * progress ** 3 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }
      
      requestAnimationFrame(animation);
    }
  
    /**
     * Optimize fonts loading
     * @private
     */
    _optimizeFonts() {
      this._log('Optimizing font loading');
  
      // Add font-display: swap to all font-face rules
      const styleSheets = Array.from(document.styleSheets);
      
      try {
        styleSheets.forEach(sheet => {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule instanceof CSSFontFaceRule) {
                if (!rule.style.fontDisplay) {
                  rule.style.fontDisplay = 'swap';
                }
              }
            });
          }
        });
      } catch (e) {
        // CORS error when trying to access cross-origin stylesheets
        this._log('Could not access some stylesheets due to CORS restrictions');
      }
      
      // Preload important fonts
      const fontUrls = this._extractFontUrls();
      fontUrls.slice(0, 2).forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'font';
        link.type = 'font/woff2'; // Assuming WOFF2, adjust as needed
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  
    /**
     * Extract font URLs from stylesheets
     * @returns {Array} - Array of font URLs
     * @private
     */
    _extractFontUrls() {
      const fontUrls = [];
      const styleSheets = Array.from(document.styleSheets);
      
      try {
        styleSheets.forEach(sheet => {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule instanceof CSSFontFaceRule) {
                const src = rule.style.getPropertyValue('src');
                if (src) {
                  const urlMatch = src.match(/url\(['"]?([^'")\s]+)['"]?\)/);
                  if (urlMatch && urlMatch[1]) {
                    fontUrls.push(urlMatch[1]);
                  }
                }
              }
            });
          }
        });
      } catch (e) {
        // CORS error when trying to access cross-origin stylesheets
        this._log('Could not access some stylesheets due to CORS restrictions');
      }
      
      return fontUrls;
    }
  
    /**
     * Add resource hints to improve loading
     * @private
     */
    _addResourceHints() {
      this._log('Adding resource hints');
      
      // DNS prefetching for external domains
      const externalDomains = new Set();
      
      document.querySelectorAll('a[href], link[href], script[src], img[src]').forEach(el => {
        let url;
        
        if (el.tagName === 'A' || el.tagName === 'LINK') {
          url = el.href;
        } else {
          url = el.src;
        }
        
        if (url) {
          try {
            const domain = new URL(url).hostname;
            if (domain && domain !== window.location.hostname) {
              externalDomains.add(domain);
            }
          } catch (e) {
            // Invalid URL, skip
          }
        }
      });
      
      // Add DNS prefetch links for external domains
      externalDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = `//${domain}`;
        document.head.appendChild(link);
      });
      
      // Preconnect to important domains
      const preconnectDomains = Array.from(externalDomains).slice(0, 3);
      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `//${domain}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  
    /**
     * Defer non-critical JavaScript
     * @private
     */
    _deferNonCriticalJS() {
      this._log('Deferring non-critical JavaScript');
      
      // Add defer attribute to non-critical scripts
      document.querySelectorAll('script:not([async]):not([defer])').forEach(script => {
        // Skip inline scripts
        if (!script.src) return;
        
        // Skip scripts with critical attributes
        if (script.hasAttribute('nomodule') || 
            script.type === 'module' || 
            script.id === 'critical') return;
            
        // Clone the script and add defer attribute
        const deferredScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => {
          deferredScript.setAttribute(attr.name, attr.value);
        });
        deferredScript.defer = true;
        
        // Replace the original script
        script.parentNode.replaceChild(deferredScript, script);
        this.metrics.resourcesSaved++;
      });
    }
  
    /**
     * Generate critical CSS
     * @returns {string} - Critical CSS
     */
    generateCriticalCSS() {
      this._log('Generating critical CSS');
      
      const criticalCSS = [];
      const viewportHeight = window.innerHeight;
      const aboveFoldElements = [];
      
      // Find all elements above the fold
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportHeight && rect.bottom > 0) {
          aboveFoldElements.push(el);
        }
      });
      
      // Extract CSS rules for above-fold elements
      const styleSheets = Array.from(document.styleSheets);
      
      try {
        styleSheets.forEach(sheet => {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule instanceof CSSStyleRule) {
                // Check if this rule applies to any above-fold element
                const selector = rule.selectorText;
                try {
                  const matchedElements = document.querySelectorAll(selector);
                  const isAboveFold = Array.from(matchedElements).some(el => 
                    aboveFoldElements.includes(el)
                  );
                  
                  if (isAboveFold) {
                    criticalCSS.push(rule.cssText);
                  }
                } catch (e) {
                  // Invalid selector, skip
                }
              } else if (rule instanceof CSSFontFaceRule || rule instanceof CSSKeyframesRule) {
                // Include font-face and keyframes rules
                criticalCSS.push(rule.cssText);
              }
            });
          }
        });
      } catch (e) {
        // CORS error when trying to access cross-origin stylesheets
        this._log('Could not access some stylesheets due to CORS restrictions');
      }
      
      return criticalCSS.join('\n');
    }
  
    /**
     * Apply critical CSS to the page
     */
    applyCriticalCSS() {
      const criticalCSS = this.generateCriticalCSS();
      
      if (criticalCSS) {
        const styleElement = document.createElement('style');
        styleElement.id = 'critical-css';
        styleElement.textContent = criticalCSS;
        document.head.insertBefore(styleElement, document.head.firstChild);
        this._log('Applied critical CSS');
      }
    }
  
    /**
     * Get performance metrics
     * @returns {Object} - Performance metrics
     */
    getMetrics() {
      // Update metrics with latest data
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
      }
      
      return { ...this.metrics };
    }
  
    /**
     * Report metrics to console or analytics service
     * @private
     */
    _reportMetrics() {
      const metrics = this.getMetrics();
      this._log('Performance metrics:', metrics);
      
      // Here you could send the metrics to an analytics service
      if (window.navigator.sendBeacon && this.config.analyticsEndpoint) {
        navigator.sendBeacon(
          this.config.analyticsEndpoint, 
          JSON.stringify(metrics)
        );
      }
    }
  
    /**
     * Throttle function to limit execution rate
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} - Throttled function
     * @private
     */
    _throttle(func, limit) {
      let lastCall = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
          lastCall = now;
          return func.apply(this, args);
        }
      };
    }
  
    /**
     * Log messages to console if debug mode is enabled
     * @private
     */
    _log(...args) {
      if (this.config.debug) {
        console.log('[Quacktize]', ...args);
      }
    }
  
    /**
     * Public API methods
     */
  
    /**
     * Manually prefetch a URL
     * @param {string} url - URL to prefetch
     * @returns {Quacktize} - Instance for chaining
     */
    prefetch(url) {
      if (!url || this.prefetchedUrls.has(url)) return this;
      
      this._prefetchUrl(url);
      this.prefetchedUrls.add(url);
      return this;
    }
  
    /**
     * Manually load an image
     * @param {string} selector - CSS selector for image
     * @returns {Quacktize} - Instance for chaining
     */
    loadImage(selector) {
      const img = document.querySelector(selector);
      
      if (img && img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        this._log(`Manually loaded image: ${selector}`);
        this.metrics.imagesOptimized++;
      }
      
      return this;
    }
  
    /**
     * Update configuration
     * @param {Object} options - New configuration options
     * @returns {Quacktize} - Instance for chaining
     */
    updateConfig(options) {
      this.config = { ...this.config, ...options };
      this._log('Updated configuration:', this.config);
      return this;
    }
  }
  
  // Default export
  export default Quacktize;