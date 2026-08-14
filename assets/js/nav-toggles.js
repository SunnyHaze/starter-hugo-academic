/**
 * Turn Wowchemy's theme and language dropdowns into direct two-state toggles.
 * The hidden theme choices remain in the DOM so Wowchemy keeps handling theme
 * persistence, code highlighting, diagrams, and the wcThemeChange event.
 */
(() => {
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
      toggle.href = translation.href;
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);

      const currentLabel = toggle.querySelector('span');
      if (currentLabel) {
        currentLabel.textContent = targetLanguage;
      }
    }
  }
})();
