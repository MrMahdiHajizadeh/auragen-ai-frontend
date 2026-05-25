# API Matching Analysis & Integration Guide

We have analyzed the **React 19 Vite UI codebase** in detail and cross-referenced it with the **Swagger 2.0 API spec (`sawaggermagic`)**. 

Below is an extensive report showing **where the current UI types align, where discrepancies exist, and a step-by-step blueprint to bind the React UI to your real Django/FastAPI backend.**

---

## 📊 1. Type Discrepancies (React UI vs. Swagger Backend)

The frontend currently uses simplified mock interfaces in `src/types.ts`. To connect to your real API, these types must be updated to align with the Swagger definitions:

| Component / Model | React UI Field (`src/types.ts`) | Swagger API Key (`sawaggermagic`) | Discrepancy & Mapping Solution |
| :--- | :--- | :--- | :--- |
| **Generator** | `id` (string) | `id` (UUID string) | Matches. |
| | `name` (string) | `name` (string) | Matches. |
| | `description` (string) | `description` (string) | Matches. |
| | `image` (string) | `photo_url` (URI string) | **Rename / Map:** Map Swagger's `photo_url` to React's `image`. |
| | `cost` (number) | `token_cost` (integer) | **Rename / Map:** Map Swagger's `token_cost` to React's `cost`. |
| | `photosNeeded` (number) | `required_images_count` (integer) | **Rename / Map:** Map Swagger's `required_images_count` to `photosNeeded`. |
| | `category` (StyleCategory) | `category` (UUID string) | **UUID Bind:** Swagger references the parent category UUID. React uses a hardcoded tag string. Map by fetching the category list and matching the UUID. |
| **Generated Image** | `id` (string) | `id` (UUID string) | Matches. |
| | `image` (string) | `output_image_url` (URI string) | **Rename / Map:** Map Swagger's `output_image_url` to React's `image`. |
| | `duration` (string, e.g. '14.5s') | `generation_time` (float in seconds) | **Format:** Convert Swagger's `generation_time` float to a string (e.g. `${time.toFixed(1)}s`) for display. |
| | `cost` (number) | `cost` (float, USD price) | **Context Shift:** React uses "cost" as coin deduction. Swagger returns the actual dollar cost of compute. Bind accordingly. |
| | *Missing in React* | `input_tokens` (integer) | **Add Field:** Add to display precise LLM metrics in Lightbox details. |
| | *Missing in React* | `output_tokens` (integer) | **Add Field:** Add to display precise LLM metrics in Lightbox details. |
| **Pricing Plan** | `id` (string) | `id` (UUID string) | Matches. |
| | `coins` (number) | `coins` (integer) | Matches. |
| | `priceIri` (string, e.g. '500k ریال')| `price` (integer, Rials value) | **Format:** Format Swagger's raw integer `price` into formatted Rial strings using `Intl.NumberFormat('fa-IR')`. |
| | *Missing in React* | `bazaar_product_id` (string) | **Add Field:** Essential to query Cafe Bazaar in-app purchases. |

---

## 🔌 2. API Endpoint Connection Gaps

The React components are currently isolated and run on **mock datasets (`src/data.ts`)**. Here are the changes required to hook them into the real API routes:

### 🔐 A. Authentication (`src/components/AuthView.tsx`)
* **Current UI:** Simulates a login success when any username/email is provided.
* **Backend Hook:** Needs to POST to `/api/login/` (for email login) or `/api/register/` (for new accounts).
* **Token Storage:** The JWT access/refresh tokens returned in `AuthResponse` must be saved in `localStorage` or React context, and attached as an `Authorization: Bearer <token>` header to all subsequent API calls.
* **Google SSO:** Hook the Google login button payload up to `/api/google/` sending the generated `id_token`.

### 🖼️ B. Banners & Categories (`src/components/CreativeStudioView.tsx`)
* **Current UI:** Renders hardcoded categories and a single mock top hero banner.
* **Backend Hook:** 
  1. Fetch active banners from `/api/banners/` to dynamically populate the slider.
  2. Fetch top categories from `/api/categories/` to dynamically render category tabs (replacing the hardcoded tab array).

### 🧪 C. Avatar Generation Workspace (`src/components/WorkspaceView.tsx`)
* **Current UI:** Reference photos are preloaded mock links. Generating is simulated using a simple timer array.
* **Backend Hook:**
  1. **Upload Phase:** When the user selects or drops a photo, perform a `multipart/form-data` POST request to `/api/uploads/` sending the raw image file. Capture the returned `{ id }` (UserUpload UUID).
  2. **Initiate Phase:** POST to `/api/generate/{generator_id}/` passing:
     ```json
     {
       "input_image_ids": ["UUID_1", "UUID_2"],
       "description": "Custom prompt textbox value"
     }
     ```
  3. **WebSocket Progress:** The backend returns a `ws_url` (WebSocket progress link). Open a native browser `WebSocket` connection to this link:
     ```typescript
     const socket = new WebSocket(data.ws_url);
     socket.onmessage = (event) => {
       const progress = JSON.parse(event.data);
       // progress contains percent (0-100) and message status.
       // Update your progress dialog bar and terminal logs in real-time!
     };
     ```

### 🗃️ D. Gallery & Lightbox (`src/components/MyGalleryView.tsx`)
* **Current UI:** Displays hardcoded historical pieces.
* **Backend Hook:**
  1. Fetch completed items from `/api/generated/` on page mount.
  2. Map returned `GeneratedImage` fields to feed the gallery cards.
  3. Hook the delete button up to a `DELETE` request at `/api/generated/{id}/` for instant soft-deletions.

### 🪙 E. Coin Store & Café Bazaar Checkout (`src/components/CoinStoreView.tsx`)
* **Current UI:** Simulates purchases locally by granting mock coin credits.
* **Backend Hook:**
  1. Fetch plans from `/api/plans/` to dynamically populate purchase tier cards.
  2. On clicking purchase, execute the Café Bazaar Android SDK purchase call.
  3. Upon receiving the success SKU validation token from Bazaar, execute a POST request to `/api/plans/verify/` passing the verification payload:
     ```json
     {
       "package_name": "com.auragen.ai",
       "product_id": "tokens_500",
       "purchase_token": "bazaar-sdk-purchase-token",
       "plan_id": "Plan-UUID-From-API"
     }
     ```
  4. Once validated by your Django backend, credit the coin amount to the user's active profile in the UI.

---

## 🛠️ 3. Concrete Integration Blueprint (API Adapter Service)

To make connection simple and keep the components clean, we recommend creating a unified API client file at **`src/services/api.ts`** that automatically handles JWT credentials, header bindings, uploads, and fetches:

```typescript
// Proposed src/services/api.ts (Clean API Adapter Client)
const API_BASE = 'http://192.168.1.9:8000/api';

const getHeaders = () => {
  const user = localStorage.getItem('auragen_user');
  const token = user ? JSON.parse(user).token : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const ApiService = {
  // Authentication
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  // Fetch Banners
  getBanners: async () => {
    const res = await fetch(`${API_BASE}/banners/`, { headers: getHeaders() });
    return res.json();
  },

  // Fetch Generators Models
  getGenerators: async () => {
    const res = await fetch(`${API_BASE}/generators/`, { headers: getHeaders() });
    const data = await res.json();
    // Map backend keys to fit the React UI model properties
    return data.map((g: any) => ({
      id: g.id,
      name: g.name,
      description: g.description || '',
      cost: g.token_cost,
      image: g.photo_url || g.icon_url,
      photosNeeded: g.required_images_count,
      details: g.description || '',
      category: g.category_name || 'All'
    }));
  },

  // Upload raw image file
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const user = localStorage.getItem('auragen_user');
    const token = user ? JSON.parse(user).token : '';
    
    const res = await fetch(`${API_BASE}/uploads/`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    return res.json(); // returns UserUpload { id, image_url }
  },

  // Initiate generation session
  generateAvatar: async (generatorId: string, imageIds: string[], promptText: string) => {
    const res = await fetch(`${API_BASE}/generate/${generatorId}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        input_image_ids: imageIds,
        description: promptText
      })
    });
    return res.json(); // returns { session_id, ws_url }
  }
};
```
