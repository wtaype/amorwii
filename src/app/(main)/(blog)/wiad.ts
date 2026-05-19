/**
 * ANUNCIOS PREMIUM (Wiad TS)
 * Configuración segura de banners publicitarios de AmorWii & WiiHope.
 * Diseñado para ser 100% compatible con Server-Side Rendering (SSR).
 */

if (typeof window !== "undefined") {
  const styleId = "wiad_styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .wi_ad_link { max-width: 300px; display: block; transition: opacity 0.3s ease, transform 0.3s ease; }
      .wi_ad_link:hover { opacity: 1 !important; transform: scale(1.01); }
      .wi_ad_img { margin-block: 4vh 2vh; width: 100%; border-radius: 1.2vh; }
    `;
    document.head.appendChild(style);
  }
}

export const adLeft: string = `
  <div class="lc_ad_side lc_ad_l">
    <a href="https://lovewi.web.app/" target="_blank" class="lc_ad_box wi_ad_link">
      <img src="Img0.webp" alt="Ad Left" class="wi_ad_img" />
    </a>
  </div>
`;

export const adRight: string = `
  <div class="lc_ad_side lc_ad_r">
    <a href="https://wtaype.me/" target="_blank" class="lc_ad_box wi_ad_link">
      <img src="https://typingwii.web.app/Img1.webp" alt="Ad Right" class="wi_ad_img" />
    </a>
  </div>
`;
