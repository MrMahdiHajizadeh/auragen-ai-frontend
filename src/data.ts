import { GeneratorModel, GalleryItem, CoinBundle } from './types';

export const STARTER_COIN_AMOUNT = 250;

export const STATIC_MODELS: GeneratorModel[] = [
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    description: 'Generate ultra-realistic LinkedIn headshots and corporate profiles with perfect studio lighting.',
    cost: 15,
    estTime: '45 Sec',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdTpMRQb7ollByiNJ8XwlcrImPHhzmxV85Tgk45FUCt1hmExZQ2TDP1M6Liy-8ZOpa37gH01Pfs2bWUi_C6rYKDwUNlNc79H4tS1W1B1piCT6XWI28mHCKq70HhhmAaCPWQz5w_xdRfuqSOkTZaGan_Jp0RGeIzTVXFKkg17jEfHa8U06oqc6RuxPiwLpS0tSl9AvvKPcGkZv0dnPdBDGn2blwkRGLxfSwAY1uU5gICKiJ8cKJxE1fLPCH2xMzQ6AU3lmV7uNaAb_H',
    category: 'Professional',
    photosNeeded: 10,
    details: 'Train a bespoke micro-model on a minimum of 4 clear facial references to synthesize hyper-realistic studio portraits, cyberpunk avatars, or classical oil compositions.'
  },
  {
    id: 'neo-tokyo-anime',
    name: 'Neo-Tokyo Anime',
    description: 'Transform everyday photos into high-quality, studio Ghibli or cyberpunk anime aesthetics.',
    cost: 25,
    estTime: '55 Sec',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHU0NuXKsejJXlh3vTfDTHVWo09-XBXsM2lZFhnn3nH0lkfT9ZfnckpfJWqKGdu2MfqF3NDlVgH2kOkclfEYYdkEQ3m8VCb5XUPsmrwRCsYKCjFr2ILazC9Q3HJq31eNxvW0c035gRPfR82KUL_UfRL1C5NJyJiGc-63qGEfA5GMuJy8iHEHlUsycooBQFY4tiXxsKL0ZqmcWabkWxfpwlYSCmfd0UhO_y3a68muBITIUYt2T9evGhJ3VnA8alCbg06ySdFNZx8qrs',
    category: 'Anime',
    photosNeeded: 5,
    tag: 'Trending',
    details: 'Convert user images or textual ideas into crisp anime characters with radiant ambient details set in futuristic neo-shibuya backgrounds.'
  },
  {
    id: 'surreal-octane',
    name: 'Surreal Octane',
    description: 'Create mind-bending abstract 3D compositions perfect for album covers and editorial design.',
    cost: 5,
    estTime: '20 Sec',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM244-pOFRDxvVIm5Qnn7V-sgXnt6kBVRJiwExYhpjFmMSuJEzCf-o5dw-f-8vuOZKu9WXHHkp4FwyTsnkdCw7vh5fz6JtuaDBpKiHAmamQd34uvaNuspBzHSdZQmwhCj3XzjjQqUhhcQYuTg_QYMQl96n8ZYuoJxxUZhACa26roJLEN8FyhdGtnYV4RNTxOTVTbXx3dFm6k1gF6VGdXz2fYjghe9skplvBrttrlIkBA8UOQCMDRJ4BAeqSOOxsY03Jkre-2aO2byp',
    category: '3D Render',
    isTextPromptOnly: true,
    details: 'Pure prompt-to-render framework designed to materialize liquid glass panels, intricate geometric configurations, glowing orbs, and hyper-modern 3D visual environments.'
  }
];

export const REFERENCE_PHOTOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-X4wMRIIwmfE7F_A_RdNXhNvnMwieXf_4T1v4hhi7uGyqDD62dJp_qysZVixb3nAACsOeWo78tcqyZ_qh7ErhIDO4fXQrSJ0edjE2d_rqXLYTaGqTjm712ltFMyuNEgBLKHwU-a6S622dYT0ftiHC_trE4umOcJCKmsl05mgn97QpPgWJd5G43CKHMf7eDBXbFCi6lPvYf7Q9ULGUUjvTzwxFEzZD9e3Huxdpn3WYCh84wCiYfQTSBMOLJtuC2G4riKzL7WwSWSIn",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAna9ZyTzSgCJDSzbMaLj_kd3CRcBbO1l9llTdr1AuzT9t2SFheacObhBo89EkQuGJsyoEhBdqg9a31Z3z-bNtsieTFsBLkhaAw7a4znEV7ugqQtz0DITe2f8Tyi3rWw500tsGNl4f1f5dBrepMcFEUYTJuT72YjTRHpZ_1MV_kxxPndgPUPeAmaF07BreJyJkclpBiaMHI4vKX7kf2RSbqrnFj9Jq2AYZXprTpwNoyzsTbgRLPMgeug1IMaPvwQddzSO2zlfPZ21p7",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHdJwU247OO3oBKX_gTkn1fHUnWQYauq5hgesGIPgkBsvQlDfV-y6SBanfGP5gI85_e1z47WvTv7R0uvgg1uND1TKPpNJQoPNyhBV89IiTyk1__JaDNPo9TW7gAmIFNrNbAB0MpabwItDixeuCCkQwRD3gbONOKEdI1caOeyustsSRcnNuvMBb9a-_hapBVxaoJTVV2yxsFXKvn6GJaViDiM3JGvjOpiNAa0ZKBei1zD7Zkpr6pZWyKClMzIXTr7zzr4Chb1P8NoI9"
];

export const STATIC_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Abstract Liquid Neon',
    prompt: 'A mesmerizing abstract liquid art composition featuring swirling currents of deep indigo, vibrant cyan, and ethereal white. The lighting is dramatic and luminescent, giving the fluid elements a glowing, high-energy presence against a stark black background.',
    engine: 'AuraV3 Fast',
    duration: '14.5s',
    resolution: '1024 x 1024',
    seed: 849201948,
    cost: 42,
    date: 'Oct 24, 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT_xFsBwBaN_ukqmp3CDDNmE-jCJLJo4UWgN7PDJWCkxAI0IDz7yUQa8DmS48JkFhmuuP_tObK9RHDJa_WKHZCgfoH9nOMduCgeBAFfP81xtg7NpeZ_NkGm36ZFv_NhzyJ3jNADVjenbxNNt3pTgAmcuHeBohCDcXPORZ79Vu05MPa7caX_x4yCormmPrMwlECCeho6tw2Tk-w0nSKRUM8dm7E1y5-oY2U18NVD70tI0OcckzyXD-R_xZgxVUzUS8KCnCHTVbpJ7X6',
    type: 'image'
  },
  {
    id: 'gal-2',
    title: 'Architectural Void',
    prompt: 'A hyper-realistic 3D rendering of a futuristic architectural structure composed of sheer glass panels and dark metallic beams. The lighting is atmospheric, with glowing volumetric rays casting stark shadows across the sleek surfaces. The color palette is minimal, dominating in cool blues, deep greys, and stark whites.',
    engine: 'AuraGen Pro',
    duration: '28.1s',
    resolution: '3840 x 2160',
    seed: 195284013,
    cost: 120,
    date: 'Oct 22, 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOKSnr-QLiSapn2AtSHTRxHavXKIu8OgLWIvgF4p3bA2182LAkDAzxKNqyXXrC-lsoCpXevBFhuTlnDXurt8EMJ4jENamvbxYBiG581vkzeXUqxSYVJa8jWMKham-zTMTcrraEqLypY-pVS3GzggROLMNuW8Mai5NWO8FsKW4lJ2F2rAcPUcdL9CUmxnAiiTfAA-4x7oMOQJoAnvOoR72UOrE5cmCY0QYLdZqy-U1sB0MOvvv6hn-NqSLmSa6yIfugov3jqDnu_TMM',
    type: 'image'
  },
  {
    id: 'gal-3',
    title: 'Synthetic Crystal Core',
    prompt: 'A stunning macro photograph of an artificial glowing crystal structure. The facets of the crystal refract internal light in vibrant shades of electric indigo and magenta. The background is a pure, infinite black void. The texture is hyper-detailed, showcasing microscopic imperfections.',
    engine: 'AuraV3 Standard',
    duration: '12.2s',
    resolution: '1024 x 1024',
    seed: 552194015,
    cost: 32,
    date: 'Sep 28, 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb7oHgcCuJjsLxAH2lwjYGlLOc1eKWQUw_885ALzLQ6NZBhmSPCzJ86gw41iCNxqTmzUGRZb0cc9pVRqW7V3GujMyW1151cB3Nbi8wKhczAHzQiWSNllVSmKkmEZ4DGsyt6fLUaQw9hLV8FCGiQ51NLDfb9psZEWZLhkRRYVh6TalJJUu2r--qdYq2htRw6-mqbqmxm_xL4CFgu6O1nDQuYmFb_AT6ZlOPwGzGb9S3c57VupVukbkSlzVu8w2nRt4Kf03CBM6I7xds',
    type: 'image'
  },
  {
    id: 'gal-4',
    title: 'Holographic UI Array',
    prompt: 'A sleek, futuristic user interface element floating in mid-air, composed of intricate glowing data lines, geometric wireframes, and dynamic charts. The color scheme features high-contrast neon cyan and deep purples against a dark, smoky backdrop.',
    engine: 'AuraV2 Base',
    duration: '18.4s',
    resolution: '1024 x 1024',
    seed: 331049281,
    cost: 55,
    date: 'Sep 15, 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlf8X0gVVFiKOfZUbVxeVO73ByrVCKnxnI0RzZIt7PAz6aUekryjYu1lT4FPJNGgrl7U8AWdUZQAyzD07uSL9fNGjnaPV69b1Ef5MMeTXC-f7HdV2u65iURexM71xKo6PzDjrhTG6P4npkF0cNV1evZVQZ_uxvEho63zIb7GYZ0IRzfq8ykU8fcVZKBanPM_MSGHIB-mLoeYqbEr1aOk1JpVMVD5kBSE6-u6whlET2CKURfYN3U0uY6b12V_GQjHzLI6UfJg7CNiBl',
    type: 'image'
  },
  {
    id: 'gal-5',
    title: 'Quantum Core Iteration 7',
    prompt: 'A conceptual rendering of a quantum computer core. Complex layers of polished brass, copper, and frosted glass encase a brilliantly glowing central orb of electric blue light. The intricate wiring and cooling tubes suggest immense computational power.',
    engine: 'AuraGen Pro',
    duration: '31.0s',
    resolution: '2560 x 1080',
    seed: 662910405,
    cost: 95,
    date: 'Aug 19, 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU9pYNEJr2aU7WYXLTWaEFseB4a9I2EqAi786PSo_N_Gkq1-XyHmXQn5IZfBu8PaPOqeMx9Rq1430vFI1Re6SyjlFZU0Lu--akS5C2ZTOQISB8CPYuGvO0ZIV85n33P0o9iuq3lvjK_WvgQc70mUOJHlUCHZnCGuAk7Kb7FoLPzEsc6eAIBOePA009Hf34fBdXNFamaL6aEqAI6wVO3nsx3zEnibd_EcbtW6TD8ylbVp-kDkvpJYNHGt6kOTiqg-eUnFV92augCzal',
    type: 'image'
  },
  {
    id: 'gal-6',
    title: 'Digital Nebula',
    prompt: 'A mesmerizing view of a distant nebula constructed from digital particles. The swirling dust clouds emit a soft, bioluminescent glow in shades of deep teal and vibrant orange. Tiny points of intense white light mimic stars scattered throughout the volume.',
    engine: 'AuraV3 Ultra',
    duration: '16.8s',
    resolution: '1280 x 720',
    seed: 704192059,
    cost: 48,
    date: 'Aug 02, 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM244-pOFRDxvVIm5Qnn7V-sgXnt6kBVRJiwExYhpjFmMSuJEzCf-o5dw-f-8vuOZKu9WXHHkp4FwyTsnkdCw7vh5fz6JtuaDBpKiHAmamQd34uvaNuspBzHSdZQmwhCj3XzjjQqUhhcQYuTg_QYMQl96n8ZYuoJxxUZhACa26roJLEN8FyhdGtnYV4RNTxOTVTbXx3dFm6k1gF6VGdXz2fYjghe9skplvBrttrlIkBA8UOQCMDRJ4BAeqSOOxsY03Jkre-2aO2byp',
    type: 'image'
  }
];

export const COIN_BUNDLES: CoinBundle[] = [
  {
    id: 'starter',
    name: 'Starter',
    coins: 500,
    priceIri: '500,000 ریال',
    features: [
      'Standard Generation Speed',
      'Basic Models Access'
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    coins: 2500,
    priceIri: '2,200,000 ریال',
    tag: 'POPULAR',
    features: [
      'Priority Generation Speed',
      'All Standard Models',
      '+10% Bonus Coins Included'
    ]
  },
  {
    id: 'vip',
    name: 'VIP',
    coins: 10000,
    priceIri: '7,500,000 ریال',
    features: [
      'Ultimate Generation Speed',
      'Exclusive Beta Models Access',
      'Dedicated Support Line',
      '+25% Bonus Coins Included'
    ]
  }
];
