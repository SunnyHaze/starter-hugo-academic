/** Attach privacy-safe conversion metadata for the configured analytics providers. */
(() => {
  const UMAMI_EVENT_NAME = 'conversion-click';
  const GA_EVENT_NAME = 'conversion_click';
  const language = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';

  const placementFor = (element) => {
    if (element.closest('[data-project-tabs]')) return 'project-showcase';
    if (element.closest('.impact-card')) return 'impact-card';
    if (element.closest('#publications')) return 'publication';
    if (element.closest('#contact')) return 'contact';
    if (element.closest('#about')) return 'profile';
    return 'page';
  };

  const annotate = (element, channel, target) => {
    element.dataset.umamiEvent = UMAMI_EVENT_NAME;
    element.dataset.umamiEventChannel = channel;
    element.dataset.umamiEventTarget = target;
    element.dataset.umamiEventPlacement = placementFor(element);
    element.dataset.umamiEventLang = language;
  };

  const trackWithGoogleAnalytics = (element) => {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', GA_EVENT_NAME, {
      click_channel: element.dataset.umamiEventChannel || 'unknown',
      click_target: element.dataset.umamiEventTarget || 'unknown',
      click_placement: element.dataset.umamiEventPlacement || 'page',
      site_language: element.dataset.umamiEventLang || language,
    });
  };

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('mailto:')) {
      annotate(link, 'email', 'primary');
      return;
    }

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (_) {
      return;
    }

    const hostname = url.hostname.toLowerCase();
    if (hostname === 'github.com' || hostname === 'www.github.com') {
      const repository = url.pathname.split('/').filter(Boolean).slice(0, 2).join('/');
      annotate(link, 'github', repository || 'profile');
    } else if (hostname.includes('scholar.google.')) {
      annotate(link, 'scholar', 'profile');
    }
  });

  document.querySelectorAll('[data-project-tab]').forEach((tab) => {
    const target = tab.getAttribute('aria-controls')?.replace('project-panel-', '') || 'unknown';
    annotate(tab, 'project', target);
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-umami-event]');
    if (target) trackWithGoogleAnalytics(target);
  });

  document.querySelectorAll('.analytics-disclosure').forEach((disclosure) => {
    const frame = disclosure.querySelector('[data-analytics-frame]');
    if (!frame) return;

    const status = disclosure.querySelector('[data-analytics-frame-status]');
    const loadingCopy = disclosure.querySelector('[data-analytics-loading-copy]');
    const fallbackCopy = disclosure.querySelector('[data-analytics-fallback-copy]');
    let fallbackTimer;

    const markLoaded = () => {
      window.clearTimeout(fallbackTimer);
      status?.classList.add('is-loaded');
    };

    const showFallback = () => {
      if (!status || status.classList.contains('is-loaded')) return;
      loadingCopy?.setAttribute('hidden', '');
      fallbackCopy?.removeAttribute('hidden');
      status.classList.add('is-delayed');
    };

    const loadFrame = () => {
      if (disclosure.open && !frame.getAttribute('src')) {
        status?.classList.remove('is-loaded', 'is-delayed');
        frame.setAttribute('src', frame.dataset.src);
        fallbackTimer = window.setTimeout(showFallback, 12000);
      }
    };

    frame.addEventListener('load', markLoaded);
    disclosure.addEventListener('toggle', loadFrame);
    loadFrame();
  });
})();
