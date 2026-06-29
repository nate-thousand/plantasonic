/**
 * Visual preset browser — world cards with identity, search, favorites, recents.
 */

import { listPresetWorlds, resolvePresetWorld } from '@/presets/registry.ts';
import type { PresetWorldMeta } from '@/presets/types.ts';
import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { AppSettingsStore } from '@/services/appSettingsStore.ts';
import { getOverlayPanel } from './OverlayHost.ts';
import { animateControlFeedback, animatePresetCards } from '../motion/motionController.ts';

function collectTags(worlds: readonly PresetWorldMeta[]): string[] {
  const tags = new Set<string>();
  for (const world of worlds) {
    for (const tag of world.tags) tags.add(tag);
  }
  return [...tags].sort();
}

function renderCard(world: PresetWorldMeta, isFavorite: boolean, isActive: boolean): string {
  const tags = world.tags.map((t) => `<span class="ps-preset-card__tag">${t}</span>`).join('');
  const { icon, mood, motionStyle, accent } = world.identity;
  return `
    <article
      class="ps-preset-card ps-preset-card--${accent}${isActive ? ' ps-preset-card--active' : ''}"
      data-preset-id="${world.id}"
      tabindex="0"
      role="button"
      aria-pressed="${String(isActive)}"
      aria-label="Load ${world.name}"
    >
      <div class="ps-preset-card__thumb ps-world-thumb--${accent}" aria-hidden="true">
        <span class="ps-preset-card__thumb-icon">${icon}</span>
        <span class="ps-preset-card__thumb-glyphs">${glyphPattern(accent)}</span>
      </div>
      <header class="ps-preset-card__header">
        <div class="ps-preset-card__heading">
          <span class="ps-preset-card__icon" aria-hidden="true">${icon}</span>
          <h3 class="ps-preset-card__title">${world.name}</h3>
        </div>
        <button
          type="button"
          class="ps-preset-card__favorite${isFavorite ? ' ps-preset-card__favorite--on' : ''}"
          data-favorite-id="${world.id}"
          aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
        >
          ★
        </button>
      </header>
      <p class="ps-preset-card__mood">${mood}</p>
      <p class="ps-preset-card__desc">${world.description}</p>
      <p class="ps-preset-card__motion">${motionStyle}</p>
      <footer class="ps-preset-card__footer">
        <div class="ps-preset-card__tags">${tags}</div>
      </footer>
    </article>
  `;
}

function glyphPattern(accent: string): string {
  const patterns: Record<string, string> = {
    seed: '·:*·',
    mold: '#@!#',
    flow: '~≈~≈',
    zen: '· · ·',
    nebula: '✦ · ✦',
  };
  return patterns[accent] ?? '· · ·';
}

function renderSection(
  title: string,
  worlds: readonly PresetWorldMeta[],
  favorites: Set<string>,
  activeId: string,
): string {
  if (worlds.length === 0) return '';
  const cards = worlds.map((w) => renderCard(w, favorites.has(w.id), w.id === activeId)).join('');
  return `
    <section class="ps-preset-browser__section" aria-label="${title}">
      <h3 class="ps-preset-browser__section-title">${title}</h3>
      <div class="ps-preset-browser__grid">${cards}</div>
    </section>
  `;
}

/** Opens the preset browser overlay. */
export function openPresetBrowser(
  interaction: InteractionManager,
  appSettings: AppSettingsStore,
  onClose: () => void,
): () => void {
  const panel = getOverlayPanel();
  if (!panel) return () => undefined;

  const worlds = listPresetWorlds();
  const tags = collectTags(worlds);
  const state = interaction.getState();
  const settings = appSettings.getSettings();
  const favorites = new Set(settings.favoritePresets);

  const recentWorlds = settings.recentPresets
    .map((id) => resolvePresetWorld(id))
    .filter((w): w is NonNullable<typeof w> => w !== undefined)
    .map(({ id, name, description, tags: t, version, identity }) => ({
      id,
      name,
      description,
      tags: t,
      version,
      identity,
    }));

  const favoriteWorlds = worlds.filter((w) => favorites.has(w.id));

  panel.setAttribute('aria-labelledby', 'ps-preset-browser-title');
  panel.classList.add('ps-overlay-panel--wide');
  panel.innerHTML = `
    <header class="ps-overlay-panel__header">
      <div>
        <h2 id="ps-preset-browser-title" class="ps-overlay-panel__title">Worlds</h2>
        <p class="ps-overlay-panel__subtitle">Each preset is a complete audiovisual world</p>
      </div>
      <button type="button" class="btn btn-sm btn-outline-secondary" id="ps-preset-browser-close" aria-label="Close presets">
        Close
      </button>
    </header>
    <div class="ps-preset-browser__toolbar">
      <input
        type="search"
        class="form-control form-control-sm ps-preset-browser__search"
        id="ps-preset-search"
        placeholder="Search worlds…"
        aria-label="Search presets"
      />
      <div class="ps-preset-browser__filters" role="group" aria-label="Filter by tag">
        <button type="button" class="btn btn-sm btn-outline-secondary ps-preset-filter ps-preset-filter--active" data-tag="">
          All
        </button>
        ${tags.map((tag) => `<button type="button" class="btn btn-sm btn-outline-secondary ps-preset-filter" data-tag="${tag}">${tag}</button>`).join('')}
      </div>
    </div>
    <div class="ps-preset-browser__content" id="ps-preset-browser-content">
      ${renderSection('Recently Used', recentWorlds, favorites, state.preset ?? '')}
      ${renderSection('Favorites', favoriteWorlds, favorites, state.preset ?? '')}
      ${renderSection('All Worlds', worlds, favorites, state.preset ?? '')}
    </div>
  `;

  let activeTag = '';
  let query = '';

  const loadPreset = (id: string, card?: HTMLElement): void => {
    interaction.setPreset(id, 'ui');
    appSettings.recordRecentPreset(id);
    if (card) animateControlFeedback(card);
    onClose();
  };

  const filterContent = (): void => {
    const content = panel.querySelector('#ps-preset-browser-content');
    if (!content) return;

    const filtered = worlds.filter((world) => {
      const matchesTag = !activeTag || world.tags.includes(activeTag);
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        world.name.toLowerCase().includes(q) ||
        world.description.toLowerCase().includes(q) ||
        world.identity.mood.toLowerCase().includes(q) ||
        world.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });

    const currentPreset = interaction.getState().preset ?? '';
    if (query || activeTag) {
      content.innerHTML = renderSection('Results', filtered, favorites, currentPreset);
    } else {
      content.innerHTML =
        renderSection('Recently Used', recentWorlds, favorites, currentPreset) +
        renderSection('Favorites', favoriteWorlds, favorites, currentPreset) +
        renderSection('All Worlds', worlds, favorites, currentPreset);
    }
    bindCards();
    animatePresetCards(content);
  };

  const bindCards = (): void => {
    panel.querySelectorAll<HTMLElement>('.ps-preset-card').forEach((card) => {
      const id = card.dataset.presetId;
      if (!id) return;

      const onActivate = (): void => {
        loadPreset(id, card);
      };

      card.addEventListener('click', (event) => {
        if ((event.target as HTMLElement).closest('.ps-preset-card__favorite')) return;
        onActivate();
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate();
        }
      });
    });

    panel.querySelectorAll<HTMLButtonElement>('.ps-preset-card__favorite').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = btn.dataset.favoriteId;
        if (!id) return;
        appSettings.toggleFavorite(id);
        favorites.delete(id);
        if (appSettings.isFavorite(id)) favorites.add(id);
        btn.classList.toggle('ps-preset-card__favorite--on', appSettings.isFavorite(id));
        btn.setAttribute(
          'aria-label',
          appSettings.isFavorite(id) ? 'Remove from favorites' : 'Add to favorites',
        );
        if (!query && !activeTag) filterContent();
      });
    });
  };

  const onSearch = (event: Event): void => {
    query = (event.target as HTMLInputElement).value.trim();
    filterContent();
  };

  const onFilter = (event: Event): void => {
    const btn = event.target as HTMLButtonElement;
    if (!btn.classList.contains('ps-preset-filter')) return;
    activeTag = btn.dataset.tag ?? '';
    panel.querySelectorAll('.ps-preset-filter').forEach((el) => {
      el.classList.toggle('ps-preset-filter--active', el === btn);
    });
    filterContent();
  };

  const onCloseClick = (): void => {
    onClose();
  };

  panel.querySelector('#ps-preset-search')?.addEventListener('input', onSearch);
  panel.querySelector('.ps-preset-browser__filters')?.addEventListener('click', onFilter);
  panel.querySelector('#ps-preset-browser-close')?.addEventListener('click', onCloseClick);

  bindCards();
  animatePresetCards(panel);

  const searchInput = panel.querySelector<HTMLInputElement>('#ps-preset-search');
  searchInput?.focus();

  return () => {
    panel.classList.remove('ps-overlay-panel--wide');
    panel.querySelector('#ps-preset-search')?.removeEventListener('input', onSearch);
    panel.querySelector('.ps-preset-browser__filters')?.removeEventListener('click', onFilter);
    panel.querySelector('#ps-preset-browser-close')?.removeEventListener('click', onCloseClick);
  };
}
