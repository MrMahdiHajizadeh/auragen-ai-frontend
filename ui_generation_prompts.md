# UI Generation Prompts: AuraGen AI Web App

This file contains copy-pasteable, highly optimized prompts for AI UI generators (like **v0.dev**, **Bolt.new**, **Lovable.dev**, or **Cursor**) to build a premium React/Tailwind/TypeScript version of the **AuraGen AI** platform.

The prompts are fully aligned with your Swagger API endpoints (`sawaggermagic`), matching features like Django token authentication, uploader limits, WebSocket status logs, and Cafe Bazaar subscription plans in Rials.

---

## ⚡ Option 1: The All-in-One Full Application Prompt
*Best for **Bolt.new** or **Lovable.dev** to generate the entire multi-page application with routing, animations, and simulated API states.*

### Copy-Paste This Prompt:
```text
Build a state-of-the-art, premium AI Avatar and Image Generation Web Application named "AuraGen AI". 

Use React, Tailwind CSS, Lucide Icons, and Framer Motion for smooth micro-animations. The app should have a unified responsive dashboard layout with a sidebar (or slide-over menu on mobile) and a top bar displaying the user's name, coin count (e.g., 250 Coins), and a glowing gold coin badge.

Implement a complete mock state that models the backend Swagger schema, including:

1. GLASSMORPHIC AUTHENTICATION SCREEN:
   - Deep dark space-gray background with soft glowing radial gradients (cyan and indigo).
   - Minimalist, glassmorphic auth card.
   - Dual-tab toggle between "Sign In" and "Create Account".
   - Inputs: Name (for registration), Email, and Password.
   - "Continue with Google" button with micro-animations.

2. CREATIVE DASHBOARD:
   - Dynamic Hero Banner Carousel: Prominently displaying featured campaigns (e.g., "Cyberpunk Avatar Pack", "Professional Portraits") with a "Generate Now" CTA.
   - Horizontal scroll of Category Filters (e.g., All Models, Cyberpunk, Corporate, Anime, Classic Fantasy) with custom colored indicators.
   - Interactive Generator Cards Grid: Each card displaying a beautiful cover image, name, required upload slots count (e.g., "Requires 4 Photos"), and a neon coin cost tag (e.g., "15 Coins").

3. GENERATOR WORKSPACE / STUDIO:
   - Selecting a generator loads the Studio.
   - Drag-and-drop multi-file upload zone. The slots dynamically scale based on the selected generator's `required_images_count`.
   - Grid showing uploaded thumbnail previews with a "Remove" button on hover.
   - Optional text field for prompting/custom directions.
   - A glowing "Generate Avatar" button that shows cost warning and handles coin validation.
   - WEBSOCKET PROGRESS DIALOG: When starting generation, show an interactive circular progress modal (0-100%) with a server step log console simulator printing:
     * "Establishing socket channel to graphics cluster..."
     * "Transferring user assets into neural memory map..."
     * "Analyzing facial geometry and landmark mappings..."
     * "Denoising complete. Resolving face details..."
   - Reveal the final generated avatar side-by-side with original inputs upon completion.

4. MY GALLERY:
   - A grid of previous creations displaying output image and generator details.
   - Lightbox modal on click showing detailed parameters: Model used, generation time, tokens used, cost in USD, a download button, and a soft-delete trash icon.

5. SUBSCRIPTION STORE (CAFÉ BAZAAR INTEGRATION):
   - Three premium pricing cards showing plans (Starter, Gold Creator, Ultimate VIP) with pricing in Iranian Rials (e.g., "500,000 ریال") and coin counts.
   - Click "Refill Wallet" to trigger a simulated Café Bazaar purchase checkout modal showing Package name (com.auragen.ai), Product SKU (e.g., tokens_500), Total in Rials, and simulated validation.
   - Crediting user coin balance upon successful purchase.

Ensure the interface is extremely visually striking, glassmorphic, and looks like a high-end AI SaaS platform. Focus heavily on smooth layout transitions, micro-interactions, and active hover states.
```

---

## 🧩 Option 2: Page-by-Page Component Prompts
*Best for **v0.dev** to generate individual UI components that you can stitch together.*

### 📄 Component A: Auth Portal (Login / Register / Google Tab)
```text
Create a high-end, responsive Glassmorphic Authentication Portal for an AI application.
Design Requirements:
- Deep dark space-gray background with two beautiful soft neon radial glow spots (indigo and cyan) in the corners.
- Center login card using ultra-blur backdrop effects (backdrop-blur-xl bg-slate-900/40 border border-slate-800).
- Toggle tab at the top between "Sign In" and "Register".
- Input fields with glowing focus borders: Name (only for Register), Email, and Password. Show a password visibility toggle.
- Include a sleek "Continue with Google" button with a custom Google G-logo.
- A neat, animated checkbox for "Remember me" and a floating "Forgot Password?" link.
- Smooth transitions when toggling between Login and Register states.
```

### 📄 Component B: Main Dashboard (Carousel, Filters, Generator Cards)
```text
Create a premium AI dashboard homepage for a platform named "AuraGen".
Design Requirements:
- Layout: Top navigation bar displaying a futuristic logo, a coin indicator in a pill badge (e.g., "🪙 250 Coins" in orange-yellow glowing border), a notification bell, and a user profile avatar dropdown.
- Hero Banner Carousel: Responsive horizontal slider showcasing active banners with dark high-contrast graphics, title overlays, and a glowing CTA button.
- Category Tabs: A sleek horizontal scroll list of categories with custom modern icons (e.g., Portrait, Anime, Retro, Sci-Fi, Concept Art). Selecting a tab filters the generator grid below.
- Generator Grid: Cards for different AI models. Each card should have:
  * A full-card background image with a dark linear gradient overlay.
  * A small hover-animated badge for token cost (e.g., "15 Coins") and image requirements (e.g., "Requires 4 Photos").
  * A glowing primary button "Open Studio" on hover.
```

### 📄 Component C: Generator Studio & Circular WebSocket Progress
```text
Create a state-of-the-art AI Generator Studio interface with multi-image uploading and an interactive generation modal.
Design Requirements:
- Left Column: Selected generator details (Name, model description, coin cost, required image uploads count). Below this, a text input area for optional prompt guidelines.
- Right Column: A large, drag-and-drop upload zone styled with dashed borders, pulsing upload icon, and text "Drag & drop 4 portrait photos here". Below it, show a grid of uploaded thumbnail slots with progress loaders and delete icons.
- Primary Action: A massive, glowing "Generate" button that activates the mock generation.
- Real-time Generation Progress Modal:
  * Triggers when generation begins.
  * Shows a circular progress loader or a premium glowing progress bar animating from 0% to 100%.
  * Displays a changing console-style log of current server steps (e.g., "Initializing container...", "Processing face embeddings...", "Synthesizing pixels...").
  * On completion, show a dazzling reveal animation of the newly generated avatar with a download option.
```

### 📄 Component D: User Gallery & Info Lightbox
```text
Create a responsive Gallery Grid with a premium Lightbox Detail View for generated AI images.
Design Requirements:
- Gallery Grid: Sleek columns of generated images. Each card shows the avatar, model name, and a "Hover Zoom" effect.
- Lightbox Modal: Triggers on image click. It should display:
  * Left side: Large high-resolution view of the generated image with a download and share action overlay.
  * Right side: Structured metadata panel displaying:
    - Model Name & Version (e.g., "Flux 1.1 Pro")
    - Seed & Inference Steps
    - Generation Time (e.g., "14.2 seconds")
    - Total Tokens consumed
    - USD cost equivalent (e.g., "$0.04")
    - Delete button (soft-delete style with double-confirmation toast).
```

### 📄 Component E: Coin Store & Cafe Bazaar Rials Payment Simulator
```text
Create a pricing and subscription store tailored for an Iranian Android App Store (Café Bazaar) integration.
Design Requirements:
- Title section: "Purchase Coins & Credits" with a glowing neon subtitle showing "Get access to premium ultra-realistic models".
- Pricing Cards Grid (3 Columns: Starter, Popular, VIP):
  * Popular card should have a "Best Value" banner ribbon glowing in amber gradient.
  * Details inside card: Package Name, Coin Count (e.g., "500 Coins"), duration (e.g., "Lifetime validity"), and Price in Persian Rials (formatted like "550,000 ریال").
  * Bullet checklist of features included (e.g., high priority queue, premium access, unlimited downloads).
- Cafe Bazaar Sandbox Modal:
  * Triggered by clicking "Buy".
  * Simulates a clean in-app payment sheet, showing App package name, Product SKU, and simulated validation.
  * Triggers success toast notifications: "Purchase completed! 500 Coins successfully added to your account."
```

---

## 🛠️ API Binding Specifications Reference
*Provide this schema metadata to the AI UI tool so that the generated forms perfectly match your Django backend model keys:*

| API Route | HTTP Method | Expected Model Keys & Formats |
| :--- | :--- | :--- |
| `/api/login/` | `POST` | Input: `{ email, password }` <br>Output: `{ access, refresh, user: { id, name, email } }` |
| `/api/register/` | `POST` | Input: `{ email, name, password }` <br>Output: `{ access, refresh, user: { id, name, email } }` |
| `/api/banners/` | `GET` | Output: Array of `{ id, name, link, banner_url }` |
| `/api/categories/` | `GET` | Output: Array of `{ id, name, color, photo_url }` |
| `/api/generators/` | `GET` | Output: Array of `{ id, name, required_images_count, token_cost, photo_url }` |
| `/api/generate/{id}/` | `POST` | Input: `{ input_image_ids: [UUIDs], description: "" }` <br>Output: `{ session_id, ws_url }` (Websocket connection URL) |
| `/api/plans/` | `GET` | Output: Array of `{ id, name, coins, price` (in Rials), `bazaar_product_id }` |
| `/api/plans/verify/` | `POST` | Input: `{ package_name, product_id, purchase_token, plan_id }` <br>Output: `{ success: true, message: "" }` |
