// Yleinen tagifiltteri kaikille sivuille, joilla on:
// .page-with-sidebar, .tag-sidebar-list, .cards-grid .card, .pill

document.addEventListener('DOMContentLoaded', () => {
  const sidebarList = document.querySelector('.tag-sidebar-list');
  const cardsGrid   = document.querySelector('.cards-grid');

  // Jos sivulla ei ole sivupalkkia tai kortteja, ei tehdä mitään
  if (!sidebarList || !cardsGrid) return;

  const cards = Array.from(cardsGrid.querySelectorAll('.card'));
  if (!cards.length) return;

  // key -> { label, colorClasses }
  const tagsMap = new Map();

  // Luetaan jokaisen kortin pilleri ja talletetaan tagi + väri
  cards.forEach(card => {
    const pill = card.querySelector('.pill');
    if (!pill) return;

    const label = pill.textContent.trim();
    const key   = label.toLowerCase();

    const colorClasses = Array.from(pill.classList)
      .filter(c => c.startsWith('pill-') && c !== 'pill');

    card.dataset.tag = key;

    if (!tagsMap.has(key)) {
      tagsMap.set(key, { label, colorClasses });
    }
  });

  // Jos yhtään tagia ei löytynyt, lopetetaan
  if (!tagsMap.size) return;

  // Apufunktio: luo filtterinappi sivupalkkiin
  const makeButton = (key, config) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('pill', 'filter-pill');
    (config.colorClasses || []).forEach(cls => btn.classList.add(cls));
    btn.dataset.filter = key;
    btn.textContent = config.label;
    sidebarList.appendChild(btn);
    return btn;
  };

  const buttons = [];

  // "All" / kaikki -nappi ensimmäiseksi (neutraali väri)
  buttons.push(makeButton('all', {
    label: 'All',
    colorClasses: ['pill-cyan']
  }));

  // Sitten yksi nappi per uniikki tagi, aakkosjärjestyksessä
  Array.from(tagsMap.entries())
    .sort((a, b) => a[1].label.localeCompare(b[1].label))
    .forEach(([key, config]) => {
      buttons.push(makeButton(key, config));
    });

  // Varsinainen filtteröinti
  const setActiveFilter = (key) => {
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === key);
    });

    cards.forEach(card => {
      const tag = card.dataset.tag;
      if (key === 'all' || tag === key) {
        card.classList.remove('is-hidden');
      } else {
        card.classList.add('is-hidden');
      }
    });
  };

  // Klikkien käsittely (event delegation)
  sidebarList.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter-pill');
    if (!btn) return;
    const key = btn.dataset.filter;
    setActiveFilter(key);
  });

  // Oletuksena näytetään kaikki kortit
  setActiveFilter('all');
});
