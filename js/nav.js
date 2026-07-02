// Shared cross-app navigation for the personalBudy cluster.
// Usage: <script src="https://splochev.github.io/personalBudy/js/nav.js" data-active="budget"></script>
// data-active values: "budget" | "diet" | "gym" | "home"
//
// NOTE: This script is intentionally NOT injected into budgetBuddy, DietBudy, or GymBudy
// because those apps already have full inline cross-app navigation in their header and sidebar.
// Add this script only to pages that have no built-in cross-app nav (e.g. personalBudy itself).
//
// Uses a plain (non-module) script tag so that document.currentScript works.

(function () {
  var script = document.currentScript || document.querySelector('script[data-active]');
  var active = script ? script.getAttribute('data-active') : '';

  var links = [
    { key: 'home',   href: 'https://splochev.github.io/personalBudy/',                        label: '🏠 Home' },
    { key: 'budget', href: 'https://splochev.github.io/budgetBuddy/budget.html',               label: '💰 Budget' },
    { key: 'diet',   href: 'https://splochev.github.io/DietBudy/food-manager.html',            label: '🥗 Diet' },
    { key: 'gym',    href: 'https://splochev.github.io/GymBudy/workout.html',                  label: '🏋️ Gym' },
  ];

  var nav = document.createElement('div');
  nav.id = 'shared-nav';
  nav.style.cssText = 'display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;';
  links.forEach(function(link) {
    var a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    a.style.cssText = 'font-size:0.8rem;opacity:0.75;text-decoration:none;padding:2px 6px;border-radius:4px;';
    if (link.key === active) {
      a.style.opacity = '1';
      a.style.fontWeight = 'bold';
      a.style.textDecoration = 'underline';
    }
    nav.appendChild(a);
  });

  function inject() {
    // Try to find an existing nav/header to append to; otherwise prepend to body
    var target = document.querySelector('nav') || document.querySelector('header') || document.body;
    if (target === document.body) {
      document.body.insertBefore(nav, document.body.firstChild);
    } else {
      target.appendChild(nav);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
