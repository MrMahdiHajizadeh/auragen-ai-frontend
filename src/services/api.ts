/**
 * AuraGen AI - API Adapter Service
 * Handles token bindings, network requests, file uploads,
 * real WebSocket connection streams, and Café Bazaar receipt verifications.
 * 
 * Automatically falls back to local simulated databases when the server is offline!
 */

import { GeneratorModel, GalleryItem, CoinBundle } from '../types';
import { STATIC_MODELS, STATIC_GALLERY, COIN_BUNDLES } from '../data';

const API_BASE = 'http://192.168.1.9:8000/api';

// Helper to acquire user auth tokens
const getHeaders = (isMultipart = false) => {
  const savedUser = localStorage.getItem('auragen_user');
  const token = savedUser ? JSON.parse(savedUser).token : '';
  
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Check if server is running locally
let serverVerifiedOnline = false;
export async function checkServerStatus(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE}/plans/`, { signal: controller.signal });
    clearTimeout(timeoutId);
    serverVerifiedOnline = res.ok;
  } catch (e) {
    serverVerifiedOnline = false;
  }
  return serverVerifiedOnline;
}

export const ApiService = {
  // ==========================================
  // 1. AUTHENTICATION ENDPOINTS
  // ==========================================
  
  login: async (email: string, password: string) => {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      // Offline fallback login simulation
      return {
        success: true,
        access: 'mock-jwt-access-token',
        user: { name: email.split('@')[0], email: email }
      };
    }
    
    const res = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.error || 'Invalid credentials.');
    }
    return res.json();
  },

  register: async (email: string, name: string, password: string) => {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      return {
        success: true,
        access: 'mock-jwt-access-token',
        user: { name, email }
      };
    }
    
    const res = await fetch(`${API_BASE}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.email?.[0] || err.error || 'Registration failed.');
    }
    return res.json();
  },

  googleLogin: async (idToken: string) => {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      return {
        success: true,
        access: 'mock-jwt-google-token',
        user: { name: 'Google User', email: 'google.member@gmail.com' }
      };
    }

    const res = await fetch(`${API_BASE}/google/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken })
    });
    if (!res.ok) throw new Error('Google sign-in invalid or expired.');
    return res.json();
  },

  // ==========================================
  // 2. CREATIVE MODELS & PORTFOLIO ENDPOINTS
  // ==========================================
  
  getBanners: async () => {
    const isOnline = await checkServerStatus();
    if (!isOnline) return [];
    try {
      const res = await fetch(`${API_BASE}/banners/`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn("Banners fetch failed:", e);
    }
    return [];
  },

  getGenerators: async (): Promise<GeneratorModel[]> => {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      console.log("[Sandbox] Utilizing high-fidelity mock generators");
      return STATIC_MODELS;
    }
    
    try {
      const res = await fetch(`${API_BASE}/generators/`, { headers: getHeaders() });
      if (res.ok) {
        const rawList = await res.json();
        // Map backend Swagger properties to fit components model
        return rawList.map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description || 'Custom avatar synthesis model',
          cost: g.token_cost || 10,
          estTime: g.required_images_count > 2 ? '45 Sec' : '20 Sec',
          image: g.photo_url || g.icon_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM244-pOFRDxvVIm5Qnn7V-sgXnt6kBVRJiwExYhpjFmMSuJEzCf-o5dw-f-8vuOZKu9WXHHkp4FwyTsnkdCw7vh5fz6JtuaDBpKiHAmamQd34uvaNuspBzHSdZQmwhCj3XzjjQqUhhcQYuTg_QYMQl96n8ZYuoJxxUZhACa26roJLEN8FyhdGtnYV4RNTxOTVTbXx3dFm6k1gF6VGdXz2fYjghe9skplvBrttrlIkBA8UOQCMDRJ4BAeqSOOxsY03Jkre-2aO2byp',
          category: g.required_images_count > 5 ? 'Professional' : g.required_images_count === 0 ? '3D Render' : 'Anime',
          photosNeeded: g.required_images_count || 4,
          isTextPromptOnly: g.required_images_count === 0,
          details: g.description || 'Generate high precision computational artwork assets.',
          color: g.color || '#6366f1'
        }));
      }
    } catch (e) {
      console.error("Generators endpoint error, falling back:", e);
    }
    return STATIC_MODELS;
  },

  // ==========================================
  // 3. IMAGE UPLOAD & COMPILATION
  // ==========================================
  
  uploadImage: async (file: File): Promise<{ id: string; url: string }> => {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      // Offline fallback: simulate upload by generating object url
      const mockUrl = URL.createObjectURL(file);
      return {
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url: mockUrl
      };
    }

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/uploads/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.image?.[0] || 'Image upload failed. Supports JPEG/PNG under 5MB.');
    }
    
    const data = await res.json(); // returns UserUpload
    return {
      id: data.id,
      url: data.image_url || data.image
    };
  },

  initiateGeneration: async (generatorId: string, imageIds: string[], promptText: string) => {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      // Offline simulation response
      return {
        isMock: true,
        session_id: `session-${Date.now()}`,
        ws_url: '',
        message: 'Accepted'
      };
    }

    const res = await fetch(`${API_BASE}/generate/${generatorId}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        input_image_ids: imageIds,
        description: promptText
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Could not initiate generation session.');
    }
    return res.json(); // returns { session_id, ws_url }
  },

  // ==========================================
  // 4. GALLERY LOGS HISTORY
  // ==========================================
  
  getGallery: async (): Promise<GalleryItem[]> => {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      const savedLocalGallery = localStorage.getItem('auragen_gallery');
      return savedLocalGallery ? JSON.parse(savedLocalGallery) : STATIC_GALLERY;
    }

    try {
      const res = await fetch(`${API_BASE}/generated/`, { headers: getHeaders() });
      if (res.ok) {
        const rawList = await res.json();
        return rawList.map((item: any) => ({
          id: item.id,
          title: (item.generator?.name || 'AuraGen Model') + ' Iteration',
          prompt: item.description || 'Bespoke computational latent graphics synthesis.',
          engine: item.generator?.model_id || 'AuraGen Pro v4.2',
          duration: item.generation_time ? `${item.generation_time.toFixed(1)}s` : '32.4s',
          resolution: '1024 x 1024',
          seed: Math.floor(Math.random() * 900000000) + 100000000,
          cost: item.generator?.token_cost || 10,
          date: new Date(item.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          image: item.output_image_url || item.output_image,
          type: 'image',
          refImage: item.input_images?.[0]?.image_url || item.input_images?.[0]?.image || undefined
        }));
      }
    } catch (e) {
      console.error("Gallery fetch failed:", e);
    }
    return STATIC_GALLERY;
  },

  deleteGalleryItem: async (id: string): Promise<boolean> => {
    const isOnline = await checkServerStatus();
    if (!isOnline) return true; // Simulate success locally

    try {
      const res = await fetch(`${API_BASE}/generated/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // ==========================================
  // 5. SHOP PLANS & CAFE BAZAAR VERIFY
  // ==========================================
  
  getPlans: async (): Promise<CoinBundle[]> => {
    const isOnline = await checkServerStatus();
    if (!isOnline) return COIN_BUNDLES;

    try {
      const res = await fetch(`${API_BASE}/plans/`, { headers: getHeaders() });
      if (res.ok) {
        const rawPlans = await res.json();
        return rawPlans.map((p: any) => ({
          id: p.id,
          name: p.name,
          coins: p.coins,
          priceIri: new Intl.NumberFormat('fa-IR').format(p.price) + ' ریال',
          tag: p.coins === 2500 ? 'POPULAR' : undefined,
          features: [
            'Instant coins transfer',
            p.duration_days > 0 ? `${p.duration_days} Days validity` : 'Lifetime validity',
            'Priority queue rendering',
            'All premium models access'
          ],
          bazaar_product_id: p.bazaar_product_id
        }));
      }
    } catch (e) {
      console.warn("Plans fetch offline:", e);
    }
    return COIN_BUNDLES;
  },

  verifyPlanPurchase: async (planId: string, productId: string, purchaseToken: string) => {
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      return { success: true, message: 'Simulated checkout validated.' };
    }

    const res = await fetch(`${API_BASE}/plans/verify/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        package_name: 'com.auragen.ai',
        product_id: productId,
        purchase_token: purchaseToken,
        plan_id: planId
      })
    });

    if (!res.ok) {
      throw new Error('Payment receipt validation failed.');
    }
    return res.json(); // returns { success: true, message }
  }
};
