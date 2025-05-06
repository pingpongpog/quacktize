# Quacktize.js

[![npm version](https://img.shields.io/npm/v/quacktize.svg)](https://www.npmjs.com/package/quacktize)
[![MIT License](https://img.shields.io/npm/l/quacktize.svg)](https://github.com/yourusername/quacktize/blob/main/LICENSE)
[![gzip size](https://img.badgesize.io/https://unpkg.com/quacktize/dist/quacktize.min.js?compression=gzip&label=gzip)](https://unpkg.com/quacktize/dist/quacktize.min.js)

A lightweight, zero-dependency library for optimizing website performance with minimal effort.

## Features

- 🖼️ **Lazy loading** - Load images only when they enter the viewport
- 🏎️ **Link prefetching** - Preload pages when users are likely to navigate to them
- 📱 **Smooth scrolling** - Enhance UX with smooth anchor navigation
- 🔤 **Font optimization** - Improve font loading and rendering
- ⚡ **Critical CSS** - Extract and inline critical CSS
- 🌐 **Resource hints** - Optimize resource loading with dns-prefetch and preconnect
- 📊 **Performance metrics** - Track and analyze performance improvements

## Installation

```bash
npm install quacktize
```

Or include it directly from CDN:

```html
<script type="module">
  import Quacktize from 'https://cdn.jsdelivr.net/npm/quacktize/dist/quacktize.min.js';
  
  const optimizer = new Quacktize();
  optimizer.init();
</script>
```

## Quick Start

```javascript
import Quacktize from 'quacktize';

// Initialize with default options
const optimizer = new Quacktize();
optimizer.init();
```

That's it! Quacktize will automatically:
- Lazy load images with `data-src` attribute
- Prefetch links as users scroll near them or hover over them
- Enable smooth scrolling for anchor links
- Optimize font loading
- Add resource hints for external domains
- Defer non-critical JavaScript

## Configuration

Customize Quacktize by passing options to the constructor or `init()` method:

```javascript
const optimizer = new Quacktize({
  lazyLoad: true,
  lazyLoadThreshold: 300, // Load images 300px before they enter viewport
  prefetch: true,
  prefetchDistance: 1000, // Prefetch links within 1000px of viewport
  smoothScroll: true,
  fontOptimization: true,
  resourceHints: true,
  deferJS: true,
  debug: true // Enable console logging
});

// Or update config later
optimizer.updateConfig({
  debug: false,
  lazyLoadThreshold: 500
});
```

## Usage Examples

### Lazy Loading Images

Add `data-src` to your images:

```html
<!-- Image will load only when near viewport -->
<img data-src="/path/to/image.jpg" alt="Lazy loaded image">

<!-- Use with srcset for responsive images -->
<img 
  data-src="/path/to/image.jpg" 
  data-srcset="/path/to/image-small.jpg 480w, /path/to/image-large.jpg 1080w"
  alt="Responsive lazy loaded image">
```

### Critical CSS Generation

Generate and apply critical CSS:

```javascript
// Generate critical CSS string
const criticalCSS = optimizer.generateCriticalCSS();

// Or automatically inject it into the page
optimizer.applyCriticalCSS();
```

### Manual Control

Manually trigger actions:

```javascript
// Manually prefetch a URL
optimizer.prefetch('/about-page');

// Manually load a specific image
optimizer.loadImage('#hero-image');
```

### Performance Metrics

Get performance metrics:

```javascript
// Get current metrics
const metrics = optimizer.getMetrics();
console.log(`Page loaded in ${metrics.loadTime}ms`);
console.log(`Optimized ${metrics.imagesOptimized} images`);
console.log(`Saved ${metrics.resourcesSaved} resource requests`);
```

## API Reference

### Constructor

```javascript
new Quacktize(options)
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lazyLoad` | Boolean | `true` | Enable lazy loading for images |
| `lazyLoadThreshold` | Number | `200` | Distance in pixels before viewport to start loading images |
| `prefetch` | Boolean | `true` | Enable link prefetching |
| `prefetchDistance` | Number | `800` | Distance in pixels before viewport to start prefetching links |
| `smoothScroll` | Boolean | `true` | Enable smooth scrolling for anchor links |
| `fontOptimization` | Boolean | `true` | Enable font loading optimization |
| `resourceHints` | Boolean | `true` | Add dns-prefetch and preconnect hints |
| `deferJS` | Boolean | `true` | Defer non-critical JavaScript |
| `analytics` | Boolean | `false` | Send analytics data (if analyticsEndpoint is set) |
| `analyticsEndpoint` | String | `null` | URL to send performance data to |
| `debug` | Boolean | `false` | Enable debug logging to console |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `init([options])` | Optional config object | `Quacktize` instance | Initialize with optional config overrides |
| `updateConfig(options)` | Config object | `Quacktize` instance | Update configuration |
| `prefetch(url)` | URL string | `Quacktize` instance | Manually prefetch a URL |
| `loadImage(selector)` | CSS selector string | `Quacktize` instance | Manually load a specific image |
| `generateCriticalCSS()` | None | Critical CSS string | Generate critical CSS for above-fold content |
| `applyCriticalCSS()` | None | `undefined` | Apply generated critical CSS to the page |
| `getMetrics()` | None | Metrics object | Get current performance metrics |

## Browser Support

Quacktize works in all modern browsers. For older browsers like IE11, some features degrade gracefully:

- Lazy loading falls back to scroll-based detection
- Smooth scrolling uses a JavaScript animation polyfill
- Resource hints are still applied but may have limited effect

## Examples

### Basic Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Quacktize Basic Example</title>
  <script type="module">
    import Quacktize from 'quacktize';
    
    document.addEventListener('DOMContentLoaded', () => {
      const optimizer = new Quacktize({
        debug: true
      });
      optimizer.init();
    });
  </script>
</head>
<body>
  <h1>Lazy Loading Demo</h1>
  
  <!-- These images will load lazily -->
  <img data-src="image1.jpg" alt="Image 1">
  <img data-src="image2.jpg" alt="Image 2">
  
  <!-- This link will be prefetched when near viewport -->
  <a href="/another-page">Go to another page</a>
</body>
</html>
```

### Advanced Configuration

```javascript
import Quacktize from 'quacktize';

const optimizer = new Quacktize({
  // Custom thresholds
  lazyLoadThreshold: 500,
  prefetchDistance: 1200,
  
  // Disable some features
  smoothScroll: false,
  
  // Enable debug mode
  debug: true
});

// Initialize
optimizer.init();

// After the page loads, apply critical CSS
window.addEventListener('load', () => {
  optimizer.applyCriticalCSS();
  
  // Log metrics
  const metrics = optimizer.getMetrics();
  console.log('Performance metrics:', metrics);
});

// Manually prefetch when user shows purchase intent
document.querySelector('#add-to-cart').addEventListener('click', () => {
  optimizer.prefetch('/checkout');
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Developed by [Your Name/Organization]

---

Made with 💛 and 🦆# quacktize
