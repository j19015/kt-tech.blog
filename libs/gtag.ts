export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const existsGaId = GA_MEASUREMENT_ID !== '';

export const pageview = (path: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

/**
 * GA4 にイベントを送る。GA が無い環境（ID 未設定・広告ブロッカー）では何もしない。
 * 計測の失敗で画面の動きを止めないよう、例外も外に出さない。
 */
export const event = (name: string, params: Record<string, string | number> = {}) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  } catch {
    // 計測できなくても困らない
  }
};
