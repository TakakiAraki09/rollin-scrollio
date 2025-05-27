# Rolling Scrollio

A lightweight scroll-driven animation library that tracks element visibility and provides smooth scroll progress values.

## Features

- 🎯 Track scroll progress of individual elements
- 🎨 CSS variable integration for animation control
- 🔧 Flexible API with multiple initialization options
- 🚀 Lightweight and performant
- 📦 TypeScript support

## Installation

```bash
npm install @takaki_araki09/rollin-scrollio
```

```bash
yarn add @takaki_araki09/rollin-scrollio
```

```bash
pnpm install @takaki_araki09/rollin-scrollio
```

## Basic Usage

```ts
import RollingScrollio from "@takaki_araki09/rollin-scrollio";

// Initialize with default settings
const scrollio = RollingScrollio();

// Clean up when done
scrollio.destroy();
```

## API

### Initialization Options

#### 1. Default Selector

By default, Rolling Scrollio targets elements with the `.rolling-scrollio` class:

```ts
RollingScrollio();
```

```html
<div class="rolling-scrollio">
  <!-- Your content -->
</div>
```

#### 2. Custom Selector

```ts
RollingScrollio({
  selector: '.my-custom-selector'
});
```

#### 3. Specific Element(s)

```ts
// Single element
const element = document.getElementById('my-element');
RollingScrollio({
  element: element
});

// Multiple elements
const elements = document.querySelectorAll('.my-elements');
RollingScrollio({
  element: Array.from(elements)
});
```

### Progress Callback

You can provide a callback function to receive scroll progress updates:

```ts
RollingScrollio({
  callback: (progress) => {
    console.log('Scroll progress:', progress);
    // Progress ranges from -2 to 2
  }
});
```

### CSS Variable Integration

Rolling Scrollio automatically sets a CSS variable `--rolling-scrollio-progress` on tracked elements. You can use this in your CSS for scroll-driven animations:

```css
.rolling-scrollio {
  transform: translateY(calc(var(--rolling-scrollio-progress) * 100px));
  opacity: calc(1 - abs(var(--rolling-scrollio-progress)));
}
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .scroll-element {
      height: 200vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scroll-element h2 {
      position: fixed;
      transform: translateY(calc(var(--rolling-scrollio-progress) * 50px));
      opacity: calc(1 - abs(var(--rolling-scrollio-progress) * 0.5));
      transition: transform 0.1s ease-out;
    }
  </style>
</head>
<body>
  <div class="rolling-scrollio scroll-element">
    <h2>Scroll to see animation</h2>
  </div>

  <script type="module">
    import RollingScrollio from "@takaki_araki09/rollin-scrollio";

    const scrollio = RollingScrollio({
      callback: (progress) => {
        console.log('Progress:', progress);
      }
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      scrollio.destroy();
    });
  </script>
</body>
</html>
```

## Progress Values

The progress value represents the element's position relative to the viewport:
- `-2` to `-1`: Element is above the viewport
- `-1` to `0`: Element is entering from the top
- `0`: Element is centered in the viewport
- `0` to `1`: Element is exiting to the bottom
- `1` to `2`: Element is below the viewport

## TypeScript

Rolling Scrollio includes TypeScript definitions. The main types are:

```ts
interface RollingScrollioOptions {
  selector?: string;
  element?: HTMLElement | HTMLElement[];
  callback?: (progress: number) => void;
}

function RollingScrollio(options?: RollingScrollioOptions): {
  destroy: () => void;
}
```

## Browser Support

Rolling Scrollio works in all modern browsers that support:
- ES6+
- CSS Custom Properties
- IntersectionObserver

