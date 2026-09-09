(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  // Fallback: pages not explicitly updated still receive the final polish stylesheet.
  if (!document.querySelector('link[href="polish.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'polish.css';
    document.head.appendChild(link);
  }

  const toastEl = $('[data-toast]');
  let toastTimer;
  const showToast = (message='Portfolio demo only — no information was submitted.') => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  };

  // Header polish + mobile menu.
  const header = $('[data-header]');
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  syncHeader();
  window.addEventListener('scroll', syncHeader, {passive:true});

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    };
    toggle.addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Before / after sliders.
  $$('[data-ba]').forEach(slider => {
    const range = $('.ba-range', slider);
    const after = $('.ba-after', slider);
    const divider = $('.ba-divider', slider);
    const handle = $('.ba-handle', slider);
    if (!range || !after || !divider || !handle) return;
    const render = () => {
      const value = Math.max(0, Math.min(100, Number(range.value) || 50));
      after.style.clipPath = `inset(0 0 0 ${value}%)`;
      divider.style.left = `${value}%`;
      handle.style.left = `${value}%`;
    };
    range.addEventListener('input', render);
    render();
  });

  // Treatment finder.
  const quizMap = {
    aging: ['Toxin + Skin Renewal', 'Soften expression lines while improving texture and glow.', 'toxin.html'],
    acne: ['Corrective Skin Plan', 'Pair consultation-led facials with a staged corrective routine.', 'book.html'],
    pigment: ['Laser + Brightening Plan', 'Target uneven tone with a skin-appropriate laser strategy.', 'laser.html'],
    lips: ['Dermal Filler', 'Explore conservative lip balance and facial harmony.', 'filler.html'],
    body: ['Body Consultation', 'Start with a consultation to map sculpting and tightening goals.', 'book.html'],
    wellness: ['Élan Membership', 'Build maintenance, priority access and recurring care into your routine.', 'memberships.html']
  };
  const quizForm = $('[data-quiz-form]');
  if (quizForm) {
    quizForm.addEventListener('submit', e => {
      e.preventDefault();
      const value = new FormData(quizForm).get('concern') || 'aging';
      const [title, copy, href] = quizMap[value] || quizMap.aging;
      const titleEl = $('[data-quiz-title]');
      const copyEl = $('[data-quiz-copy]');
      const linkEl = $('[data-quiz-link]');
      if (titleEl) titleEl.textContent = title;
      if (copyEl) copyEl.textContent = copy;
      if (linkEl) linkEl.href = href;
      showToast('Treatment match updated.');
    });
  }

  // Sample treatment-plan builder.
  const addButtons = $$('[data-service-add]');
  const builderItems = $('[data-builder-items]');
  const builderTotal = $('[data-builder-total]');
  const selected = new Map();

  const renderBuilder = () => {
    if (!builderItems || !builderTotal) return;
    builderItems.innerHTML = '';
    let total = 0;
    selected.forEach((price, name) => {
      total += price;
      const row = document.createElement('div');
      row.className = 'builder-item';
      row.innerHTML = `<span>${name}</span><strong>$${price.toLocaleString()}</strong>`;
      builderItems.appendChild(row);
    });
    if (!selected.size) {
      const empty = document.createElement('span');
      empty.className = 'concept-label';
      empty.textContent = 'Add services to preview a sample plan.';
      builderItems.appendChild(empty);
    }
    builderTotal.textContent = `$${total.toLocaleString()}`;
  };

  addButtons.forEach(btn => {
    btn.setAttribute('aria-pressed','false');
    btn.addEventListener('click', () => {
      const name = btn.dataset.serviceAdd || 'Service';
      const price = Math.max(0, Number(btn.dataset.price) || 0);
      if (selected.has(name)) {
        selected.delete(name);
        btn.textContent = '+';
        btn.setAttribute('aria-pressed','false');
      } else {
        selected.set(name, price);
        btn.textContent = '×';
        btn.setAttribute('aria-pressed','true');
      }
      renderBuilder();
    });
  });
  renderBuilder();

  // Provider matcher.
  const providerForm = $('[data-provider-form]');
  if (providerForm) {
    const matches = {
      injectables: 'Dr. Maya Ellis — injectables & facial balance',
      skin: 'Jordan Price, PA-C — skin, laser & corrective plans',
      body: 'Nia Brooks, RN — body, wellness & maintenance'
    };
    providerForm.addEventListener('submit', e => {
      e.preventDefault();
      const goal = new FormData(providerForm).get('goal') || 'injectables';
      const result = $('[data-provider-result]');
      if (result) result.textContent = matches[goal] || matches.injectables;
      showToast('Provider match updated.');
    });
  }

  // Results filters.
  const filterWrap = $('[data-result-filters]');
  if (filterWrap) {
    const buttons = $$('[data-filter]', filterWrap);
    const cards = $$('[data-result-card]');
    buttons.forEach(btn => btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'all';
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      cards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        card.classList.toggle('result-hidden', filter !== 'all' && !categories.includes(filter));
      });
    }));
  }

  // Demo forms / links / gift-card actions.
  $$('[data-demo-form]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const note = $('[data-form-note]', form);
    if (note) note.textContent = 'Portfolio demo only — your request was not submitted.';
    showToast('Demo request complete — nothing was transmitted or stored.');
  }));

  $$('[data-demo-gift], .gift-amount').forEach(btn => btn.addEventListener('click', () => {
    showToast('Gift-card checkout is a portfolio demo — no purchase was made.');
  }));

  $$('[data-demo-link]').forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    showToast(link.dataset.demoMessage || 'Portfolio demo link.');
  }));

  // Soft reveal animation: decorative only and disabled for reduced motion.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const revealTargets = $$('.section, .page-hero');
    revealTargets.forEach(el => el.classList.add('reveal-ready'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -40px 0px'});
    revealTargets.forEach(el => observer.observe(el));
  }
})();
