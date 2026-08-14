(() => {
  const timeline = document.querySelector('[data-career-timeline]');
  if (!timeline) return;

  const TRACKS = ['education', 'experience'];
  const DAY_MS = 24 * 60 * 60 * 1000;
  const CARD_GAP = 22;
  const YEAR_HEIGHT = 115;
  const EXTRA_ITEM_HEIGHT = 90;
  const EMPTY_YEAR_HEIGHT = 22;
  const MIN_OLDEST_YEAR_HEIGHT = 52;
  const ENTRY_HIGHLIGHT_MS = 750;

  const chronology = timeline.querySelector('[data-career-chronology]');
  const axis = timeline.querySelector('[data-career-axis]');
  const tickLayer = timeline.querySelector('[data-career-ticks]');
  const cards = Array.from(timeline.querySelectorAll('[data-career-card]'));
  const periodsById = new Map(
    Array.from(timeline.querySelectorAll('[data-career-period]'))
      .map((period) => [period.dataset.target, period]),
  );
  const focusById = new Map(
    Array.from(timeline.querySelectorAll('[data-career-focus]'))
      .map((focus) => [focus.dataset.target, focus]),
  );
  const mobileQuery = window.matchMedia('(max-width: 767.98px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const parseDate = (value, fallback) => {
    if (!value) return fallback;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isNaN(date.getTime()) ? fallback : date;
  };

  const now = parseDate(timeline.dataset.now, new Date());
  const items = cards.map((card) => {
    const start = parseDate(card.dataset.start, now);
    const end = parseDate(card.dataset.end, now);
    const duration = Math.max(0, end.getTime() - start.getTime());
    const recentBias = Math.min(duration * 0.15, 120 * DAY_MS);

    return {
      id: card.id,
      card,
      period: periodsById.get(card.id),
      focus: focusById.get(card.id),
      start,
      end,
      // Long entries sit near their recent endpoint; their bracket still
      // represents the complete interval.
      anchor: new Date(end.getTime() - recentBias),
      track: card.dataset.track,
    };
  });

  if (!items.length) return;

  const itemById = new Map(items.map((item) => [item.id, item]));
  const oldest = new Date(Math.min(...items.map((item) => item.start.getTime())));
  const entryHighlightTimers = new Map();
  let activeTarget = null;
  let layoutTimer;

  const buildScale = () => {
    const currentYear = now.getUTCFullYear();
    const oldestYear = oldest.getUTCFullYear();
    const density = new Map();

    items.forEach((item) => {
      const year = item.anchor.getUTCFullYear();
      const count = density.get(year) || { education: 0, experience: 0 };
      count[item.track] += 1;
      density.set(year, count);
    });

    const segments = [];
    let top = 0;
    for (let year = currentYear; year >= oldestYear; year -= 1) {
      const count = density.get(year) || { education: 0, experience: 0 };
      const laneDensity = Math.max(count.education, count.experience);
      let height = laneDensity
        ? YEAR_HEIGHT + (laneDensity - 1) * EXTRA_ITEM_HEIGHT
        : EMPTY_YEAR_HEIGHT;

      if (year === oldestYear) {
        const yearTop = new Date(Date.UTC(year + 1, 0, 1, 12));
        const yearBottom = new Date(Date.UTC(year, 0, 1, 12));
        const covered = (yearTop - oldest) / (yearTop - yearBottom);
        height = Math.max(
          MIN_OLDEST_YEAR_HEIGHT,
          height * Math.max(0.2, Math.min(1, covered)),
        );
      }

      segments.push({ year, top, height, bottom: top + height });
      top += height;
    }

    const segmentByYear = new Map(segments.map((segment) => [segment.year, segment]));
    const mapDate = (date) => {
      const year = Math.max(oldestYear, Math.min(currentYear, date.getUTCFullYear()));
      const segment = segmentByYear.get(year);
      const segmentStart = year === currentYear
        ? now
        : new Date(Date.UTC(year + 1, 0, 1, 12));
      const segmentEnd = year === oldestYear
        ? oldest
        : new Date(Date.UTC(year, 0, 1, 12));
      const span = Math.max(1, segmentStart - segmentEnd);
      const progress = Math.max(0, Math.min(1, (segmentStart - date) / span));
      return segment.top + progress * segment.height;
    };

    return { height: top, mapDate, segments };
  };

  const renderTicks = (segments) => {
    const importantYears = new Set([now.getUTCFullYear(), oldest.getUTCFullYear()]);
    items.forEach((item) => {
      importantYears.add(item.start.getUTCFullYear());
      importantYears.add(item.end.getUTCFullYear());
    });

    const fragment = document.createDocumentFragment();
    const nowTick = document.createElement('span');
    nowTick.className = 'career-axis-tick career-axis-tick-now';
    nowTick.dataset.year = String(now.getUTCFullYear());
    nowTick.style.top = '0px';
    nowTick.textContent = timeline.dataset.nowLabel;
    fragment.appendChild(nowTick);

    segments.forEach((segment) => {
      if (!importantYears.has(segment.year)) return;
      const tick = document.createElement('span');
      tick.className = 'career-axis-tick';
      tick.dataset.year = String(segment.year);
      tick.style.top = `${segment.bottom}px`;
      tick.textContent = String(segment.year);
      fragment.appendChild(tick);
    });

    tickLayer.replaceChildren(fragment);
  };

  const clearDesktopLayout = () => {
    chronology.style.removeProperty('height');
    axis.style.removeProperty('height');
    items.forEach(({ card, period, focus }) => {
      card.style.removeProperty('top');
      card.style.removeProperty('--connector-delta');
      card.style.removeProperty('--connector-vertical-top');
      card.style.removeProperty('--connector-vertical-height');
      [period, focus].forEach((range) => {
        range?.style.removeProperty('top');
        range?.style.removeProperty('height');
      });
    });
    tickLayer.replaceChildren();
    timeline.classList.remove('is-layout-ready');
  };

  const layoutDesktop = () => {
    if (mobileQuery.matches) {
      clearDesktopLayout();
      return;
    }

    const scale = buildScale();
    const positions = new Map();
    axis.style.height = `${scale.height}px`;
    renderTicks(scale.segments);

    items.forEach((item) => {
      const startY = scale.mapDate(item.start);
      const endY = scale.mapDate(item.end);
      const top = Math.min(startY, endY);
      const bottom = Math.max(startY, endY);
      const height = Math.max(18, bottom - top);
      const middle = Math.max(top, Math.min(bottom, scale.mapDate(item.anchor)));

      [item.period, item.focus].forEach((range) => {
        if (!range) return;
        range.style.top = `${top}px`;
        range.style.height = `${height}px`;
      });
      positions.set(item.id, { middle });
    });

    let cardLayerHeight = 0;
    TRACKS.forEach((track) => {
      const laneItems = items
        .filter((item) => item.track === track)
        .sort((a, b) => positions.get(a.id).middle - positions.get(b.id).middle);
      let cursor = 0;

      laneItems.forEach((item) => {
        const cardHeight = item.card.getBoundingClientRect().height;
        const connectorDelta = positions.get(item.id).middle - (cursor + cardHeight / 2);
        item.card.style.top = `${cursor}px`;
        item.card.style.setProperty('--connector-delta', `${connectorDelta}px`);
        item.card.style.setProperty('--connector-vertical-top', `${Math.min(0, connectorDelta)}px`);
        item.card.style.setProperty('--connector-vertical-height', `${Math.abs(connectorDelta)}px`);
        cursor += cardHeight + CARD_GAP;
      });

      cardLayerHeight = Math.max(cardLayerHeight, Math.max(0, cursor - CARD_GAP));
    });

    chronology.style.height = `${Math.max(scale.height, cardLayerHeight)}px`;
    timeline.classList.add('is-layout-ready');
    if (activeTarget) setHighlight(activeTarget, true);
  };

  const scheduleLayout = () => {
    window.clearTimeout(layoutTimer);
    layoutTimer = window.setTimeout(layoutDesktop, 80);
  };

  const clearTickHighlight = () => {
    tickLayer.querySelectorAll('.career-axis-tick').forEach((tick) => {
      tick.classList.remove(
        'is-highlighted',
        'is-highlighted-education',
        'is-highlighted-experience',
      );
    });
  };

  function setHighlight(targetId, highlighted) {
    if (!highlighted && activeTarget !== targetId) return;
    const selected = itemById.get(targetId);
    if (!selected) return;

    activeTarget = highlighted ? targetId : null;
    items.forEach((item) => {
      const isSelected = highlighted && item.id === targetId;
      item.card.classList.toggle('is-highlighted', isSelected);
      item.period?.classList.toggle('is-highlighted', isSelected);
      if (!isSelected) item.focus?.classList.remove('is-active');
    });
    clearTickHighlight();
    if (!highlighted) return;

    selected.focus?.classList.add('is-active');
    const startYear = selected.start.getUTCFullYear();
    const endYear = selected.end.getUTCFullYear();
    tickLayer.querySelectorAll('.career-axis-tick').forEach((tick) => {
      const year = Number(tick.dataset.year);
      if (year < startYear || year > endYear) return;
      tick.classList.add('is-highlighted', `is-highlighted-${selected.track}`);
    });
  }

  const highlightOnEntry = (item) => {
    window.clearTimeout(entryHighlightTimers.get(item.id));
    item.card.classList.add('is-highlighted');
    item.period?.classList.add('is-highlighted');
    item.focus?.classList.add('is-active');

    const timer = window.setTimeout(() => {
      entryHighlightTimers.delete(item.id);
      if (activeTarget === item.id || item.card.matches(':hover, :focus-within')) return;
      item.card.classList.remove('is-highlighted');
      item.period?.classList.remove('is-highlighted');
      item.focus?.classList.remove('is-active');
    }, ENTRY_HIGHLIGHT_MS);
    entryHighlightTimers.set(item.id, timer);
  };

  const hideOnExit = (item) => {
    window.clearTimeout(entryHighlightTimers.get(item.id));
    entryHighlightTimers.delete(item.id);
    item.card.classList.remove('is-visible', 'is-highlighted');
    item.period?.classList.remove('is-highlighted');
    item.focus?.classList.remove('is-active');
  };

  items.forEach((item) => {
    item.card.addEventListener('mouseenter', () => {
      setHighlight(item.id, true);
    });
    item.card.addEventListener('mouseleave', () => setHighlight(item.id, false));
    item.card.addEventListener('focusin', () => {
      setHighlight(item.id, true);
    });
    item.card.addEventListener('focusout', () => setHighlight(item.id, false));
  });

  layoutDesktop();
  window.addEventListener('load', scheduleLayout, { once: true });
  window.addEventListener('resize', scheduleLayout);
  document.fonts?.ready.then(scheduleLayout);

  if ('ResizeObserver' in window) {
    const sizeObserver = new ResizeObserver(scheduleLayout);
    items.forEach((item) => sizeObserver.observe(item.card));
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.card.classList.add('is-visible'));
  } else {
    timeline.classList.add('is-motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const item = itemById.get(entry.target.id);
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          highlightOnEntry(item);
        } else {
          hideOnExit(item);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((item) => observer.observe(item.card));
  }
})();
