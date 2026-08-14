/**
 * Turn Wowchemy's theme and language dropdowns into direct two-state toggles.
 * The hidden theme choices remain in the DOM so Wowchemy keeps handling theme
 * persistence, code highlighting, diagrams, and the wcThemeChange event.
 */
(() => {
  const SCROLL_PARAMS = {
    document: '_lang_scroll',
    section: '_lang_section',
    sectionProgress: '_lang_section_progress',
  };

  const captureLanguageScroll = () => {
    const viewportAnchor = window.scrollY + window.innerHeight / 2;
    const sections = [...document.querySelectorAll('main section[id]')];
    const section = sections.find((candidate) => {
      const top = candidate.getBoundingClientRect().top + window.scrollY;
      return viewportAnchor >= top && viewportAnchor <= top + candidate.offsetHeight;
    });
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    return {
      documentProgress: window.scrollY / maxScroll,
      sectionId: section?.id || '',
      sectionProgress: section
        ? (viewportAnchor - (section.getBoundingClientRect().top + window.scrollY)) / Math.max(section.offsetHeight, 1)
        : 0,
    };
  };

  const restoreLanguageScroll = () => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(SCROLL_PARAMS.document)) return;

    const state = {
      documentProgress: Number(url.searchParams.get(SCROLL_PARAMS.document)),
      sectionId: url.searchParams.get(SCROLL_PARAMS.section) || '',
      sectionProgress: Number(url.searchParams.get(SCROLL_PARAMS.sectionProgress)),
    };
    if (!Number.isFinite(state.documentProgress)) return;

    Object.values(SCROLL_PARAMS).forEach((parameter) => url.searchParams.delete(parameter));
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);

    const restore = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      let top = state.documentProgress * maxScroll;
      const section = state.sectionId ? document.getElementById(state.sectionId) : null;

      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        top = sectionTop + state.sectionProgress * section.offsetHeight - window.innerHeight / 2;
      }

      window.scrollTo(0, Math.min(Math.max(top, 0), maxScroll));
    };

    const restoreAfterLayout = () => {
      requestAnimationFrame(() => requestAnimationFrame(restore));
      // The career timeline and web fonts can still settle just after load.
      window.setTimeout(restore, 300);
    };
    if (document.readyState === 'complete') {
      restoreAfterLayout();
    } else {
      window.addEventListener('load', restoreAfterLayout, { once: true });
    }
  };

  restoreLanguageScroll();

  const themeItem = document.querySelector('.theme-dropdown');

  if (themeItem) {
    const toggle = themeItem.querySelector(':scope > .nav-link');
    const icon = toggle?.querySelector('i');
    const lightChoice = themeItem.querySelector('.js-set-theme-light');
    const darkChoice = themeItem.querySelector('.js-set-theme-dark');

    if (toggle && icon && lightChoice && darkChoice) {
      const updateThemeToggle = (isDark) => {
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);

        const label = isDark ? toggle.dataset.lightLabel : toggle.dataset.darkLabel;
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
      };

      themeItem.classList.remove('dropdown');
      toggle.removeAttribute('data-toggle');
      toggle.removeAttribute('aria-haspopup');
      toggle.classList.add('nav-direct-toggle');
      toggle.dataset.lightLabel = document.documentElement.lang.startsWith('zh') ? '切换至浅色模式' : 'Switch to light mode';
      toggle.dataset.darkLabel = document.documentElement.lang.startsWith('zh') ? '切换至深色模式' : 'Switch to dark mode';

      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        const choice = document.body.classList.contains('dark') ? lightChoice : darkChoice;
        choice.click();
      });

      document.addEventListener('wcThemeChange', (event) => {
        updateThemeToggle(Boolean(event.detail?.isDarkTheme?.()));
      });

      updateThemeToggle(document.body.classList.contains('dark'));
    }
  }

  const languageItem = document.querySelector('.i18n-dropdown');

  if (languageItem) {
    const toggle = languageItem.querySelector(':scope > .nav-link');
    const translation = languageItem.querySelector('.dropdown-menu a.dropdown-item');

    if (toggle && translation) {
      const targetLanguage = translation.textContent.trim();
      const label = document.documentElement.lang.startsWith('zh')
        ? `切换至${targetLanguage}`
        : `Switch to ${targetLanguage}`;

      languageItem.classList.remove('dropdown');
      toggle.classList.remove('dropdown-toggle');
      toggle.classList.add('nav-direct-toggle');
      toggle.removeAttribute('data-toggle');
      toggle.removeAttribute('aria-haspopup');
      // Keep the switch on the current host even if a deployment overrides or
      // misconfigures Hugo's baseURL (for example, on a preview domain).
      const targetUrl = new URL(translation.href, window.location.href);
      toggle.href = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
      toggle.addEventListener('click', () => {
        const state = captureLanguageScroll();
        targetUrl.searchParams.set(SCROLL_PARAMS.document, state.documentProgress.toFixed(6));
        targetUrl.searchParams.set(SCROLL_PARAMS.section, state.sectionId);
        targetUrl.searchParams.set(SCROLL_PARAMS.sectionProgress, state.sectionProgress.toFixed(6));
        toggle.href = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
      });

      const currentLabel = toggle.querySelector('span');
      if (currentLabel) {
        currentLabel.textContent = targetLanguage;
      }
    }
  }
})();
