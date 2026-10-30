(() => {
  'use strict';
  const tour = document.querySelector('.city-tour');
  if (tour) {
    const copy = JSON.parse(document.querySelector('#tour-copy').textContent);
    let choice = 0;
    const show = step => {
      tour.querySelectorAll('[data-tour-step]').forEach(panel => {
        panel.hidden = panel.dataset.tourStep !== String(step);
      });
      const progress = tour.querySelector('[data-tour-progress]');
      progress.textContent = `${progress.dataset.stepLabel} ${step} / 3`;
      tour.querySelector(`[data-tour-step="${step}"] h2`).focus({preventScroll: true});
    };
    tour.querySelectorAll('[data-goal]').forEach(button => button.addEventListener('click', () => {
      choice = Number(button.dataset.goal);
      tour.querySelector('[data-tour-result]').textContent = copy[choice];
      show(2);
    }));
    tour.querySelector('[data-tour-next]').addEventListener('click', () => show(3));
    tour.querySelectorAll('[data-tour-back]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.tourBack))));
  }
  const search = document.querySelector('#city-search');
  if (search) {
    document.querySelector('[data-search-wrap]').hidden = false;
    const cards = [...document.querySelectorAll('[data-city-card]')];
    const filter = () => {
      const query = search.value.trim().normalize('NFKC').toLocaleLowerCase();
      let count = 0;
      cards.forEach(card => {
        card.hidden = !card.textContent.normalize('NFKC').toLocaleLowerCase().includes(query);
        if (!card.hidden) count++;
      });
      document.querySelectorAll('[data-city-group]').forEach(group => {
        group.hidden = !group.querySelector('[data-city-card]:not([hidden])');
      });
      document.querySelector('[data-city-count]').textContent = `${count} ${count === 1 ? 'guide' : 'guides'}`;
      document.querySelector('[data-city-empty]').hidden = count !== 0;
    };
    search.addEventListener('input', filter);
    filter();
  }
})();
