/* ==========================================================================
 * SearchableSelect - a searchable dropdown for native <select> elements.
 *
 * The native <select> stays in the DOM and stays the single source of truth.
 * The widget adds a visible search box over it; choosing an item sets
 * select.selectedIndex and fires a normal "change" event, so every existing
 * handler (updateInverterData, updatePanelData, ...) keeps working untouched.
 *
 * Usage:
 *   SearchableSelect.upgrade('inverterModel', {
 *     gstType:       'inverter',   // passed to getGstFor() for the tax rate
 *     marginSection: 'inverter',   // passed to applyMarginTo() for the sell price
 *     placeholder:   'Search inverters...'
 *   });
 *
 *   SearchableSelect.upgradeAll({ inverterModel: {...}, panelModel: {...} });
 * ========================================================================== */

(function (global) {
  'use strict';

  var uid = 0;

  /* ---------------------------------------------------------------- */

  function money(v) {
    var num = Number(v);
    if (!isFinite(num)) return '₹0';
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  /** Clean display name for an option. */
  function optionName(opt) {
    return opt.dataset.ssName || opt.textContent;
  }

  /** "Dealer ₹12,375 -> Sells at ₹14,850 · GST 5% · ₹22.50/Wp" */
  function optionDetail(opt, cfg) {
    var base = Number(opt.dataset.price) || 0;
    var parts = ['Dealer ' + money(base)];

    // Selling price = dealer price with the tool's own margin applied.
    var selling = base;
    if (cfg.marginSection && typeof global.applyMarginTo === 'function') {
      try { selling = global.applyMarginTo(base, cfg.marginSection); } catch (e) { selling = base; }
    }
    if (Math.abs(selling - base) > 0.005) {
      parts.push('→ Sells at ' + money(selling));
    }

    // Tax rate comes from the tool, so it always matches the real quote.
    var gst = 18;
    if (cfg.gstType && typeof global.getGstFor === 'function') {
      try { gst = global.getGstFor(cfg.gstType); } catch (e) { gst = 18; }
    }
    parts.push('· GST ' + gst + '%');

    // Panels also carry a rate per watt.
    if (opt.dataset.watt) {
      var watt = Number(opt.dataset.watt);
      if (watt > 0) parts.push('· ₹' + (base / watt).toFixed(2) + '/Wp');
    }

    return parts.join(' ');
  }

  /* ---------------------------------------------------------------- *
   * Filtering
   * ---------------------------------------------------------------- */

  /**
   * Ranked substring search. Prefix matches float to the top, then the
   * earliest match wins, so "wa" puts Waaree above 70 other inverters.
   */
  function filterOptions(sel, query) {
    var q = String(query || '').trim().toLowerCase();
    var out = [];

    for (var i = 0; i < sel.options.length; i++) {
      var opt = sel.options[i];
      if (!q) { out.push({ opt: opt, rank: 1, pos: 0 }); continue; }

      var name = (opt.dataset.ssName || opt.textContent).toLowerCase();
      var hay = (opt.textContent + ' ' + name).toLowerCase();
      var at = hay.indexOf(q);
      if (at < 0) continue;

      var rank = name.indexOf(q) === 0 ? 0 : 1;
      out.push({ opt: opt, rank: rank, pos: at });
    }

    out.sort(function (a, b) {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.pos !== b.pos) return a.pos - b.pos;
      return 0;
    });
    return out;
  }

  /* ---------------------------------------------------------------- *
   * The widget
   * ---------------------------------------------------------------- */

  function upgrade(selectId, cfg) {
    cfg = cfg || {};

    var sel = document.getElementById(selectId);
    if (!sel) return null;
    if (sel.dataset.ssReady === '1') return sel.__ss;

    /* -- shell ---------------------------------------------------- */
    var wrap = document.createElement('div');
    wrap.className = 'ss';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'ss-input';
    input.placeholder = cfg.placeholder || 'Search…';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-autocomplete', 'list');

    var list = document.createElement('ul');
    list.className = 'ss-list';
    list.setAttribute('role', 'listbox');
    list.id = 'ss-list-' + (++uid);
    input.setAttribute('aria-controls', list.id);

    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    wrap.appendChild(input);
    wrap.appendChild(list);

    sel.classList.add('ss-native');
    sel.dataset.ssReady = '1';

    /* -- state ---------------------------------------------------- */
    var activeIndex = -1;

    function isOpen() { return wrap.classList.contains('is-open'); }

    function open() {
      wrap.classList.add('is-open');
      input.setAttribute('aria-expanded', 'true');
      render();
    }

    function close() {
      wrap.classList.remove('is-open');
      input.setAttribute('aria-expanded', 'false');
      setActive(-1);
    }

    function setActive(i) {
      var items = list.querySelectorAll('.ss-item');
      for (var k = 0; k < items.length; k++) {
        items[k].classList.remove('is-active');
        items[k].removeAttribute('aria-selected');
      }
      activeIndex = i;
      if (i >= 0 && items[i]) {
        items[i].classList.add('is-active');
        items[i].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', items[i].id);
        items[i].scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    /* -- rendering ------------------------------------------------ */
    function render() {
      list.innerHTML = '';
      var results = filterOptions(sel, input.value);

      if (!results.length) {
        var empty = document.createElement('li');
        empty.className = 'ss-empty';
        empty.textContent = 'No products match "' + String(input.value || '').trim() + '"';
        list.appendChild(empty);
        setActive(-1);
        return;
      }

      for (var i = 0; i < results.length; i++) {
        var opt = results[i].opt;
        var li = document.createElement('li');
        li.className = 'ss-item';
        li.id = list.id + '-i' + i;
        li.setAttribute('role', 'option');
        li.dataset.index = String(opt.index);
        if (opt.selected) li.classList.add('is-selected');

        var name = document.createElement('span');
        name.className = 'ss-name';
        name.textContent = optionName(opt);

        var detail = document.createElement('span');
        detail.className = 'ss-detail';
        detail.textContent = optionDetail(opt, cfg);

        li.appendChild(name);
        li.appendChild(detail);
        list.appendChild(li);
      }
      setActive(-1);
    }

    /* -- picking -------------------------------------------------- */
    function pick(opt) {
      sel.selectedIndex = opt.index;
      input.value = opt.textContent;
      close();
      // A normal change event so every existing handler runs as before.
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /* -- keep the box in step with the real select ---------------- */
    function syncFromSelect() {
      var sel_ = sel.options[sel.selectedIndex];
      input.value = (sel_ && sel_.value) ? sel_.textContent : '';
    }

    /* -- events --------------------------------------------------- */
    input.addEventListener('focus', function () {
      open();
      // Typing should replace the current text, not append to it.
      input.select();
    });

    input.addEventListener('input', function () {
      // The current selection is deliberately NOT cleared while typing -
      // clearing it would zero out the quotation mid-search.
      open();
    });

    input.addEventListener('keydown', function (e) {
      var items = list.querySelectorAll('.ss-item');
      var cur = list.querySelector('.ss-item.is-active');
      var idx = cur ? Array.prototype.indexOf.call(items, cur) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen()) open();
        setActive(Math.min(idx + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen()) open();
        setActive(Math.max(idx - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var active = list.querySelector('.ss-item.is-active');
        if (active) {
          var opt = sel.options[Number(active.dataset.index)];
          if (opt) pick(opt);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
        syncFromSelect();
      } else if (e.key === 'Home' && isOpen()) {
        e.preventDefault(); setActive(0);
      } else if (e.key === 'End' && isOpen()) {
        e.preventDefault(); setActive(items.length - 1);
      }
    });

    input.addEventListener('blur', function () {
      // Let a click on a list item land before the box is reset.
      setTimeout(function () {
        if (!wrap.contains(document.activeElement)) {
          close();
          syncFromSelect();
        }
      }, 120);
    });

    list.addEventListener('pointerdown', function (e) {
      var li = e.target.closest ? e.target.closest('.ss-item') : null;
      if (!li) return;
      e.preventDefault();               // keep focus in the search box
      var opt = sel.options[Number(li.dataset.index)];
      if (opt) pick(opt);
    });

    wrap.addEventListener('mousedown', function (e) {
      // Clicking the box itself should never blur it.
      if (e.target === input) e.preventDefault();
    });

    document.addEventListener('pointerdown', function (e) {
      if (isOpen() && !wrap.contains(e.target)) close();
    });

    sel.addEventListener('change', syncFromSelect);

    syncFromSelect();

    sel.__ss = { wrapper: wrap, input: input, list: list, pick: pick };
    return sel.__ss;
  }

  function upgradeAll(map) {
    if (!map) return;
    for (var id in map) {
      if (!Object.prototype.hasOwnProperty.call(map, id)) continue;
      upgrade(id, map[id]);
    }
  }

  global.SearchableSelect = { upgrade: upgrade, upgradeAll: upgradeAll };
})(window);
