/** Accessible, progressively enhanced tabs for the homepage project showcase. */
document.querySelectorAll('[data-project-tabs]').forEach((root) => {
  const tabs = Array.from(root.querySelectorAll('[data-project-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-project-panel]'));

  if (!tabs.length || tabs.length !== panels.length) {
    return;
  }

  const activate = (tab, moveFocus = false) => {
    const targetId = tab.getAttribute('aria-controls');

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      item.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });

    if (moveFocus) {
      tab.focus();
    }
  };

  root.classList.add('is-enhanced');
  activate(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0]);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;

      if (event.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activate(tabs[nextIndex], true);
    });
  });
});
