# 🎯 React First Steps

> A beautiful, lightweight, and fully customizable onboarding tour library for React and Next.js applications.

![Demo](https://github.com/KHARBAQOssama/rc-first-steps/blob/main/demo.gif?raw=true)

Create stunning product tours and user guides with zero configuration. Perfect for onboarding new users, showcasing features, or providing guided tutorials.

---

## ✨ Features

- 🎨 **Fully Customizable** - Style every element to match your brand
- 🎯 **Smart Positioning** - Automatically finds the best tooltip placement
- 📱 **Responsive** - Works flawlessly on all screen sizes
- ⚡ **Lightweight** - Under 10KB gzipped, zero dependencies
- 🔧 **TypeScript** - Full type safety and IntelliSense support
- 🌙 **Theme Support** - Pre-built themes included (dark, modern, minimal, colorful)
- 🎭 **Spotlight Effect** - Beautiful element highlighting with overlay
- 🔄 **Auto-scroll** - Automatically scrolls to highlighted elements
- 💫 **Smooth Animations** - Buttery smooth transitions
- 🚫 **Smart Placement** - Tooltips never cover highlighted elements
- 🎮 **Full Control** - Programmatic API for complete control

---

## 📦 Installation

```bash
npm install rc-first-steps
```

```bash
yarn add rc-first-steps
```

```bash
pnpm add rc-first-steps
```

---

## 🚀 Quick Start

```tsx
import { OnboardingProvider } from 'rc-first-steps';

function App() {
  const config = {
    steps: [
      {
        target: '#welcome',
        title: 'Welcome! 👋',
        content: 'Let me show you around our platform',
        placement: 'bottom',
      },
      {
        target: '#dashboard',
        title: 'Your Dashboard',
        content: 'This is where all the magic happens',
        placement: 'right',
      },
    ],
    showProgress: true,
    showSkipButton: true,
  };

  return (
    <OnboardingProvider 
      config={config} 
      run={true}
      onComplete={() => console.log('Tour completed!')}
    >
      <YourApp />
    </OnboardingProvider>
  );
}
```
---

## 📖 Complete Documentation

### Basic Setup

#### 1. Wrap Your Application

```tsx
import { OnboardingProvider } from 'rc-first-steps';

function App() {
  return (
    <OnboardingProvider config={config} run={shouldRun}>
      <YourApp />
    </OnboardingProvider>
  );
}
```

#### 2. Define Tour Steps

```tsx
const config = {
  steps: [
    {
      target: '#element-id',           // CSS selector
      title: 'Step Title',
      content: 'Step description here',
      placement: 'bottom',              // 'top' | 'bottom' | 'left' | 'right' | 'auto'
      spotlightClicks: false,           // Allow clicks on highlighted element
    },
    // Add more steps...
  ],
  showProgress: true,                   // Show "Step 1 of 3"
  showSkipButton: true,                 // Show skip button
  scrollToSteps: true,                  // Auto-scroll to elements
  scrollOffset: 100,                    // Scroll offset in pixels
  spotlightPadding: 8,                  // Padding around spotlight
};
```

#### 3. Control the Tour Programmatically

```tsx
import { useOnboarding } from 'rc-first-steps';

function MyComponent() {
  const { start, stop, next, back, isActive } = useOnboarding();
  
  return (
    <div>
      <button onClick={start}>Start Tour</button>
      <button onClick={stop}>Stop Tour</button>
      <button onClick={next}>Next Step</button>
      <button onClick={back}>Previous Step</button>
    </div>
  );
}
```

---

## 🎨 Customization

### Custom Styling

```tsx
const config = {
  steps: [...],
  styles: {
    // Customize the spotlight
    spotlight: {
      borderRadius: '16px',
      border: '3px solid #3b82f6',
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
    },
    // Customize the tooltip container
    tooltip: {
      filter: 'drop-shadow(0 10px 40px rgba(0, 0, 0, 0.3))',
    },
    // Customize Next button
    buttonNext: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '12px 28px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '10px',
    },
    // Customize Back button
    buttonBack: {
      background: '#f3f4f6',
      border: '2px solid #e5e7eb',
      color: '#374151',
    },
    // Customize Skip button
    buttonSkip: {
      color: '#ef4444',
      fontWeight: '600',
    },
  },
};
```

### Using Pre-built Themes

```tsx
import { OnboardingProvider, darkTheme } from 'rc-first-steps';

const config = {
  steps: [...],
  ...darkTheme, // Apply dark theme
};

// Available themes:
// - darkTheme
// - modernTheme
// - minimalTheme
// - colorfulTheme
```

---

## 🎯 Advanced Usage

### Conditional Tour Display

```tsx
function App() {
  const [showTour, setShowTour] = useState(() => {
    // Only show to new users
    return !localStorage.getItem('tourCompleted');
  });

  const handleComplete = () => {
    localStorage.setItem('tourCompleted', 'true');
    setShowTour(false);
  };

  return (
    <OnboardingProvider
      config={config}
      run={showTour}
      onComplete={handleComplete}
    >
      <YourApp />
    </OnboardingProvider>
  );
}
```

### Multi-page Tours

```tsx
// Page 1
const step1Config = {
  steps: [
    { target: '#feature-1', title: 'Feature 1', content: 'Description' },
  ],
};

// Page 2
const step2Config = {
  steps: [
    { target: '#feature-2', title: 'Feature 2', content: 'Description' },
  ],
};

// Use different configs on different pages
```

### Dynamic Steps

```tsx
function App() {
  const [userType, setUserType] = useState('beginner');
  
  const config = {
    steps: userType === 'beginner' 
      ? beginnerSteps 
      : advancedSteps,
  };

  return <OnboardingProvider config={config} />;
}
```

---

## 🔧 API Reference

### `OnboardingProvider` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `OnboardingConfig` | required | Tour configuration object |
| `run` | `boolean` | `false` | Start/stop the tour |
| `onComplete` | `() => void` | - | Callback when tour completes |
| `onSkip` | `() => void` | - | Callback when tour is skipped |
| `children` | `ReactNode` | required | Your app components |

### `OnboardingConfig` Object

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `steps` | `OnboardingStep[]` | required | Array of tour steps |
| `showProgress` | `boolean` | `false` | Show step counter |
| `showSkipButton` | `boolean` | `false` | Show skip button |
| `scrollToSteps` | `boolean` | `false` | Auto-scroll to elements |
| `scrollOffset` | `number` | `100` | Scroll offset in pixels |
| `spotlightPadding` | `number` | `8` | Padding around spotlight |
| `disableOverlay` | `boolean` | `false` | Disable dark overlay |
| `styles` | `StyleConfig` | `{}` | Custom styles object |

### `OnboardingStep` Object

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `target` | `string` | required | CSS selector (#id, .class, [data-attr]) |
| `title` | `string` | required | Step title |
| `content` | `string` | required | Step description |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'auto'` | `'auto'` | Tooltip position |
| `spotlightClicks` | `boolean` | `false` | Allow clicks on element during tour |

### `useOnboarding` Hook

```tsx
const {
  isActive,      // boolean - Is tour currently running
  currentStep,   // number - Current step index (0-based)
  start,         // () => void - Start the tour
  stop,          // () => void - Stop the tour
  next,          // () => void - Go to next step
  back,          // () => void - Go to previous step
  goToStep,      // (step: number) => void - Jump to specific step
} = useOnboarding();
```

---

## 🌟 Examples

### Next.js App Router

```tsx
// app/layout.tsx
import { OnboardingProvider } from 'rc-first-steps';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <OnboardingProvider config={config} run={true}>
          {children}
        </OnboardingProvider>
      </body>
    </html>
  );
}
```

### Next.js Pages Router

```tsx
// pages/_app.tsx
import { OnboardingProvider } from 'rc-first-steps';

function MyApp({ Component, pageProps }) {
  return (
    <OnboardingProvider config={config}>
      <Component {...pageProps} />
    </OnboardingProvider>
  );
}
```

### Vite + React

```tsx
// src/main.tsx
import { OnboardingProvider } from 'rc-first-steps';

createRoot(document.getElementById('root')).render(
  <OnboardingProvider config={config}>
    <App />
  </OnboardingProvider>
);
```

---

## 💡 Best Practices

1. **Keep Tours Short** - 3-5 steps is ideal for user retention
2. **Use Descriptive Titles** - Make it clear what each step teaches
3. **Auto-placement** - Use `placement: 'auto'` for best results
4. **Save Completion State** - Don't annoy returning users
5. **Test on Mobile** - Ensure responsive design works everywhere
6. **Use Semantic Selectors** - Prefer IDs over generic classes
7. **Provide Skip Option** - Always allow users to exit
8. **Track Analytics** - Monitor tour completion rates

---

## 🎓 Tips & Tricks

### Restart Tour

```tsx
function RestartButton() {
  const { start } = useOnboarding();
  
  return <button onClick={start}>Restart Tour</button>;
}
```

### Conditional Steps

```tsx
const steps = features.map(feature => ({
  target: `#${feature.id}`,
  title: feature.name,
  content: feature.description,
}));
```

### Track Analytics

```tsx
<OnboardingProvider
  config={config}
  onComplete={() => {
    analytics.track('Onboarding Completed');
  }}
  onSkip={() => {
    analytics.track('Onboarding Skipped');
  }}
/>
```

---

## 🐛 Troubleshooting

### Element Not Found

```tsx
// Make sure element exists before starting tour
useEffect(() => {
  const element = document.querySelector('#my-element');
  if (element) {
    setRunTour(true);
  }
}, []);
```

### Tooltip Behind Modal

```tsx
// Increase z-index in styles
styles: {
  tooltip: {
    zIndex: 10000,
  }
}
```

### Tour Not Starting

```tsx
// Check that run prop is true
<OnboardingProvider config={config} run={true} />

// Or use the hook
const { start } = useOnboarding();
start();
```

<!-- ---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/rc-first-steps.git
cd rc-first-steps

# Install dependencies
npm install

# Build the library
npm run build

# Test locally
npm link

# In your test project
npm link rc-first-steps
``` -->

---

## 📊 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔒 TypeScript Support

Full TypeScript support out of the box with complete type definitions.

```tsx
import type { OnboardingConfig, OnboardingStep } from 'rc-first-steps';

const steps: OnboardingStep[] = [
  {
    target: '#welcome',
    title: 'Welcome',
    content: 'Get started here',
    placement: 'bottom',
  }, 
];

const config: OnboardingConfig = {
  steps,
  showProgress: true,
};
```

---

## 📄 License

MIT © Ossama KHARBAQ (https://github.com/KHARBAQOssama)

```
MIT License

Copyright (c) 2025 Ossama KHARBAQ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


Built with ❤️ for the React community