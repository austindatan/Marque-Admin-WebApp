# DM Sans Font Weight Reference

## Using Font Weights with Tailwind CSS

Since DM Sans is now your default font, you can use these Tailwind utility classes anywhere in your components:

### Available Font Weights:

```jsx
// Light weights
<p className="font-light">Light (300)</p>        // Subtle, delicate text

// Regular
<p className="font-normal">Normal (400)</p>      // Default, body text

// Medium
<p className="font-medium">Medium (500)</p>      // Slightly emphasized

// Semi Bold
<p className="font-semibold">Semi Bold (600)</p> // Headings, important text

// Bold
<p className="font-bold">Bold (700)</p>          // Strong emphasis

// Extra Bold
<p className="font-extrabold">Extra Bold (800)</p> // Very strong

// Black
<p className="font-black">Black (900)</p>        // Maximum weight
```

## Examples in Your Login Page:

```jsx
{/* Logo label - use bold or semibold */}
<label className="block text-sm font-semibold text-gray-700 mb-3">
    Login to your account.
</label>

{/* Button - use bold or semibold */}
<button className="... font-bold">
    Sign In
</button>

{/* Small text - use normal or medium */}
<p className="text-xs text-gray-500 font-normal">
    By signing in, you agree to our Terms
</p>

{/* Headings - use bold, extrabold, or black */}
<h1 className="text-4xl font-black">Marque</h1>
<h2 className="text-2xl font-bold">Welcome</h2>
<h3 className="text-xl font-semibold">Sign In</h3>
```

## Common Patterns:

### Headers
- `font-black` - Main page titles
- `font-bold` - Section headings
- `font-semibold` - Sub-headings

### Body Text
- `font-normal` - Paragraphs, descriptions
- `font-medium` - Emphasized body text

### UI Elements
- `font-semibold` - Buttons, labels
- `font-medium` - Form labels, links
- `font-bold` - Call-to-action buttons

## Quick Update Example:

```jsx
// Before
<label className="block text-sm font-medium text-gray-700 mb-3">
    Login to your account.
</label>

// Make it bolder
<label className="block text-sm font-bold text-gray-700 mb-3">
    Login to your account.
</label>

// Or even heavier
<label className="block text-sm font-black text-gray-700 mb-3">
    Login to your account.
</label>
```

## Pro Tip:

You can combine font weights with other utilities:

```jsx
<p className="text-lg font-semibold text-gray-900 tracking-tight">
    Tight, semi-bold, large text
</p>

<button className="text-base font-bold uppercase tracking-wide">
    Bold, uppercase button
</button>
```

Just add or change the `font-*` class in your `className` prop!
