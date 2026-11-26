/* Glow by Wanji — page behaviour. Content comes from js/config.js. */
(function () {
  "use strict";

  var C = window.GLOW_CONFIG;
  var Art = window.GlowLashArt;

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var money = function (n, from) {
    return (from ? "From " : "") + C.currency + " " + Number(n).toLocaleString("en-KE");
  };
  var icon = function (name, cls) {
    return '<svg class="' + (cls || "ico") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  };

  var SHAPES = [
    { id: "natural",  name: "Natural",  desc: "Soft and balanced" },
    { id: "cat",      name: "Cat Eye",  desc: "Lifted outer corners" },
    { id: "doll",     name: "Doll Eye", desc: "Open, rounded centre" },
    { id: "squirrel", name: "Squirrel", desc: "Lifted, but soft" }
  ];
  var currentShape = "natural";

  /* ---------- Contact details everywhere ---------- */
  var telHref = "tel:+" + C.phoneInternational;
  var waBase = "https://wa.me/" + C.phoneInternational;
  var waHello = waBase + "?text=" + encodeURIComponent("Hi Wanji! I'd like to ask about your lash and makeup services.");

  $$("[data-phone-display]").forEach(function (el) { el.textContent = C.phoneDisplay; });
  $$("[data-phone-link]").forEach(function (el) { el.href = telHref; });
  $$("[data-wa-link]").forEach(function (el) {
    el.href = waHello; el.target = "_blank"; el.rel = "noopener";
  });
  $$("[data-instagram]").forEach(function (el) {
    el.href = "https://www.instagram.com/" + C.instagram + "/"; el.textContent = "@" + C.instagram;
  });
  $$("[data-tiktok]").forEach(function (el) {
    el.href = "https://www.tiktok.com/@" + C.tiktok; el.textContent = "@" + C.tiktok;
  });
  $$("[data-location]").forEach(function (el) { el.textContent = C.location; });
  $$("[data-hours]").forEach(function (el) {
    el.innerHTML = C.hours.map(function (h) {
      return '<p class="hours-row"><span>' + esc(h.days) + "</span><span>" + esc(h.time) + "</span></p>";
    }).join("");
  });
  $("#year").textContent = new Date().getFullYear();

  if (/^2547?0{7,}$/.test(C.phoneInternational)) {
    console.warn("Glow by Wanji: replace the placeholder phone number in js/config.js");
  }

  /* ---------- Hero ---------- */
  $("#hero-lash").innerHTML = Art.svg("volume", "cat", { label: "Volume lash set, cat eye shape" });
  var minLash = Math.min.apply(null, C.lashSets.map(function (s) { return s.fullSet; }));
  var minMakeup = Math.min.apply(null, C.makeup.map(function (s) { return s.price; }));
  $("#badge-lash-from").textContent = money(minLash);
  $("#badge-makeup-from").textContent = money(minMakeup);

  /* ---------- Lash designs ---------- */
  var shapeName = function (id) {
    var s = SHAPES.filter(function (x) { return x.id === id; })[0];
    return s ? s.name : "";
  };

  function renderShapes() {
    $("#shape-options").innerHTML = SHAPES.map(function (s) {
      return (
        '<button type="button" class="shape-btn" data-shape="' + s.id + '" aria-pressed="' + (s.id === currentShape) + '">' +
          '<span class="shape-art">' + Art.svg("classic", s.id, { label: s.name + " lash shape" }) + "</span>" +
          '<span class="shape-name">' + esc(s.name) + "</span>" +
          '<span class="shape-desc">' + esc(s.desc) + "</span>" +
        "</button>"
      );
    }).join("");
  }

  function renderLashCards() {
    $("#lash-grid").innerHTML = C.lashSets.map(function (s) {
      return (
        '<article class="lash-card reveal">' +
          '<div class="lash-card-art" data-art="' + esc(s.art) + '" data-name="' + esc(s.name) + '">' +
            Art.svg(s.art, currentShape, { label: s.name + ", " + shapeName(currentShape) + " shape" }) +
          "</div>" +
          '<div class="lash-card-body">' +
            '<span class="tag">' + esc(s.tag) + "</span>" +
            "<h3>" + esc(s.name) + "</h3>" +
            "<p>" + esc(s.description) + "</p>" +
            '<dl class="prices">' +
              "<div><dt>Full set</dt><dd>" + money(s.fullSet) + "</dd></div>" +
              "<div><dt>Refill</dt><dd>" + money(s.refill) + "</dd></div>" +
            "</dl>" +
            '<div class="card-foot">' +
              '<span class="duration">' + icon("clock") + esc(s.duration) + "</span>" +
              '<button type="button" class="btn btn-sm" data-book="set:' + esc(s.id) + '">Book this set ' + icon("arrow") + "</button>" +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("") + consultCard();
  }

  function consultCard() {
    var msg = "Hi Wanji! I'm not sure which lash set suits me. Can you help me choose?";
    return (
      '<article class="lash-card consult-card reveal">' +
        "<div>" +
          '<p class="eyebrow">Can&#39;t decide?</p>' +
          "<h3>Not sure which set is <em>you</em>?</h3>" +
          '<p class="consult-text">Send Wanji a selfie and a look you love on WhatsApp, and get a recommendation for the perfect set and shape for your eyes.</p>' +
          '<div class="consult-actions">' +
            '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + waBase + "?text=" + encodeURIComponent(msg) + '">' +
              icon("whatsapp") + "Ask Wanji</a>" +
            '<a class="btn btn-outline-light" href="#book">Go to booking</a>' +
          "</div>" +
        "</div>" +
        '<div class="consult-art" aria-hidden="true">' + Art.svg("wispy", "cat") + "</div>" +
      "</article>"
    );
  }

  function redrawCardArt() {
    $$(".lash-card-art").forEach(function (el) {
      el.innerHTML = Art.svg(el.dataset.art, currentShape, {
        label: el.dataset.name + ", " + shapeName(currentShape) + " shape"
      });
    });
  }

  function priceRow(item, bookValue) {
    return (
      '<li class="pl-row">' +
        '<div class="pl-name"><strong>' + esc(item.name) + "</strong>" +
          (item.note ? "<span>" + esc(item.note) + "</span>" : "") + "</div>" +
        '<span class="pl-lead" aria-hidden="true"></span>' +
        '<span class="pl-price">' + money(item.price, item.priceFrom) + "</span>" +
        (bookValue
          ? '<button type="button" class="pl-book" data-book="' + bookValue + '" aria-label="Book ' + esc(item.name) + '">Book</button>'
          : "") +
      "</li>"
    );
  }

  renderShapes();
  renderLashCards();
  $("#lash-extras").innerHTML = C.lashExtras.map(function (x) { return priceRow(x, "extra:" + x.id); }).join("");

  $("#shape-options").addEventListener("click", function (e) {
    var btn = e.target.closest(".shape-btn");
    if (!btn) return;
    currentShape = btn.dataset.shape;
    $$(".shape-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
    redrawCardArt();
    shapeSel.value = currentShape;
    updateForm();
  });

  /* ---------- Makeup ---------- */
  $("#makeup-grid").innerHTML = C.makeup.map(function (m, i) {
    return (
      '<article class="mu-card reveal' + (m.priceFrom ? " mu-feature" : "") + '" style="--d:' + i * 80 + 'ms">' +
        '<span class="mu-ico">' + icon(m.icon || "sparkle", "") + "</span>" +
        "<h3>" + esc(m.name) + "</h3>" +
        '<p class="mu-tag">' + esc(m.tagline) + "</p>" +
        '<p class="mu-desc">' + esc(m.description) + "</p>" +
        '<div class="mu-foot">' +
          '<span class="mu-price">' + (m.priceFrom ? "<small>From</small>" : "") + money(m.price) + "</span>" +
          '<button type="button" class="btn btn-sm btn-outline-gold" data-book="makeup:' + esc(m.id) + '">Book</button>' +
        "</div>" +
      "</article>"
    );
  }).join("");

  $("#makeup-extras").innerHTML = C.makeupExtras.map(function (x) {
    return (
      "<li><strong>" + esc(x.name) + "</strong>" +
        "<span>" + money(x.price, x.priceFrom) + (x.note ? " · " + esc(x.note) : "") + "</span></li>"
    );
  }).join("");

  /* ---------- Booking form ---------- */
  var form = $("#booking-form");
  var serviceSel = $("#service");
  var shapeSel = $("#shape");
  var timeSel = $("#time");
  var dateInput = $("#date");

  var LISTS = { set: C.lashSets, extra: C.lashExtras, makeup: C.makeup, mextra: C.makeupExtras };

  function lookup(value) {
    if (!value) return null;
    var parts = value.split(":");
    var item = (LISTS[parts[0]] || []).filter(function (x) { return x.id === parts[1]; })[0];
    return item ? { kind: parts[0], item: item } : null;
  }
  function categoryOf(kind) { return kind === "set" || kind === "extra" ? "lashes" : "makeup"; }

  function opt(value, label) { return '<option value="' + esc(value) + '">' + esc(label) + "</option>"; }
  function group(label, options) { return '<optgroup label="' + esc(label) + '">' + options.join("") + "</optgroup>"; }

  function fillServices(cat) {
    var html = opt("", "Choose a service…");
    if (cat === "lashes") {
      html += group("Lash sets", C.lashSets.map(function (s) { return opt("set:" + s.id, s.name + " · " + money(s.fullSet)); }));
      html += group("Quick lashes & care", C.lashExtras.map(function (x) { return opt("extra:" + x.id, x.name + " · " + money(x.price, x.priceFrom)); }));
    } else {
      html += group("Makeup looks", C.makeup.map(function (m) { return opt("makeup:" + m.id, m.name + " · " + money(m.price, m.priceFrom)); }));
      var bookable = C.makeupExtras.filter(function (x) { return x.bookable; });
      if (bookable.length) {
        html += group("Bridal extras", bookable.map(function (x) { return opt("mextra:" + x.id, x.name + " · " + money(x.price, x.priceFrom)); }));
      }
    }
    serviceSel.innerHTML = html;
  }

  shapeSel.innerHTML = opt("", "Not sure, help me choose") +
    SHAPES.map(function (s) { return opt(s.id, s.name + " (" + s.desc.toLowerCase() + ")"); }).join("");
  timeSel.innerHTML = opt("", "Choose a time…") + C.timeSlots.map(function (t) { return opt(t, t); }).join("");

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  dateInput.min = todayISO();

  function formatDate(iso) {
    var p = iso.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    return d.toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }

  function currentCategory() { return form.elements.category.value; }
  function people() {
    var n = parseInt(form.elements.people.value, 10);
    return isNaN(n) || n < 1 ? 1 : Math.min(n, 20);
  }

  function estimate() {
    var sel = lookup(serviceSel.value);
    if (!sel) return null;
    var e = { name: sel.item.name, detail: [], price: 0, from: !!sel.item.priceFrom, extraNote: "" };
    if (sel.kind === "set") {
      var refill = form.elements.apptType.value === "refill";
      e.detail.push(refill ? "Refill" : "Full set");
      e.price = refill ? sel.item.refill : sel.item.fullSet;
      if (shapeSel.value) e.shape = shapeName(shapeSel.value);
    } else if (sel.kind === "extra") {
      e.price = sel.item.price;
    } else {
      var n = sel.item.onePerson ? 1 : people();
      e.price = sel.item.price * n;
      if (n > 1) e.detail.push(n + " people");
      if (form.elements.home.checked) {
        e.detail.push("Home service");
        e.extraNote = "+ transport";
      }
    }
    return e;
  }

  function updateForm() {
    var sel = lookup(serviceSel.value);
    var cat = currentCategory();
    var isSet = !!sel && sel.kind === "set";
    var home = cat === "makeup" && form.elements.home.checked;
    var show = {
      set: isSet,
      makeup: cat === "makeup",
      people: cat === "makeup" && !(sel && sel.item.onePerson),
      home: home
    };
    $$("[data-show]", form).forEach(function (el) { el.hidden = !show[el.dataset.show]; });

    var e = estimate();
    var box = $("#summary");
    if (!e) {
      box.innerHTML = '<p class="summary-empty">Choose a service to see your estimate.</p>';
      return;
    }
    var title = e.name + (e.detail.length ? " · " + e.detail.join(" · ") : "");
    box.innerHTML =
      '<div class="summary-row"><span>Your booking</span><strong>' + esc(title) + "</strong></div>" +
      (e.shape ? '<div class="summary-row"><span>Lash shape</span><strong>' + esc(e.shape) + "</strong></div>" : "") +
      '<div class="summary-row summary-total"><span>Estimate</span><strong>' +
        money(e.price, e.from) + (e.extraNote ? ' <small>' + esc(e.extraNote) + "</small>" : "") +
      "</strong></div>";
  }

  form.addEventListener("change", function (e) {
    if (e.target.name === "category") {
      fillServices(currentCategory());
    }
    if (e.target.dataset && e.target.closest("[data-field]")) clearError(e.target.closest("[data-field]").dataset.field);
    updateForm();
  });
  form.addEventListener("input", function (e) {
    if (e.target.closest("[data-field]")) clearError(e.target.closest("[data-field]").dataset.field);
    if (e.target.name === "people") updateForm();
  });

  // "Book" buttons anywhere on the page pre-fill the form.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-book]");
    if (!btn) return;
    var value = btn.dataset.book;
    var sel = lookup(value);
    if (!sel) return;
    var cat = categoryOf(sel.kind);
    form.elements.category.value = cat;
    fillServices(cat);
    serviceSel.value = value;
    if (sel.kind === "set") form.elements.apptType.value = "full";
    clearError("service");
    updateForm();
    var card = $(".book-card");
    $("#book").scrollIntoView({ behavior: "smooth", block: "start" });
    card.classList.remove("flash");
    void card.offsetWidth;
    card.classList.add("flash");
    setTimeout(function () { serviceSel.focus({ preventScroll: true }); }, 600);
  });

  function setError(field, msg) {
    var wrap = $('[data-field="' + field + '"]', form);
    if (!wrap) return;
    wrap.classList.add("invalid");
    var input = $("input, select, textarea", wrap);
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", field + "-error");
    $("#" + field + "-error").textContent = msg;
  }
  function clearError(field) {
    var wrap = $('[data-field="' + field + '"]', form);
    if (!wrap || !wrap.classList.contains("invalid")) return;
    wrap.classList.remove("invalid");
    var input = $("input, select, textarea", wrap);
    input.removeAttribute("aria-invalid");
    $("#" + field + "-error").textContent = "";
  }

  function validate() {
    var errors = [];
    var f = form.elements;
    if (!serviceSel.value) errors.push(["service", "Please choose a service."]);
    if (!f.date.value) errors.push(["date", "Please pick a date."]);
    else if (f.date.value < todayISO()) errors.push(["date", "Please pick today or a future date."]);
    if (!f.time.value) errors.push(["time", "Please pick a time."]);
    if (f.name.value.trim().length < 2) errors.push(["name", "Please tell us your name."]);
    var digits = f.phone.value.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) errors.push(["phone", "Please enter a valid phone number."]);
    if (currentCategory() === "makeup" && f.home.checked && f.location.value.trim().length < 3) {
      errors.push(["location", "Please tell us where to come."]);
    }
    errors.forEach(function (er) { setError(er[0], er[1]); });
    return errors;
  }

  function buildMessage() {
    var f = form.elements;
    var e = estimate();
    var service = e.name + (e.detail.length ? " (" + e.detail.join(", ") + ")" : "");
    var lines = [
      "Hi Wanji! ✨ I'd like to book an appointment.",
      "",
      "*Service:* " + service,
      e.shape ? "*Lash shape:* " + e.shape : null,
      "*Date:* " + formatDate(f.date.value),
      "*Time:* " + f.time.value,
      "*Estimate:* " + money(e.price, e.from) + (e.extraNote ? " " + e.extraNote : ""),
      "",
      "*Name:* " + f.name.value.trim(),
      "*Phone:* " + f.phone.value.trim(),
      currentCategory() === "makeup" && f.home.checked ? "*Location:* " + f.location.value.trim() : null,
      f.notes.value.trim() ? "*Notes:* " + f.notes.value.trim() : null,
      "",
      "Please confirm if this slot is available. Thank you! 💕"
    ];
    return lines.filter(function (l) { return l !== null; }).join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errors = validate();
    if (errors.length) {
      var first = $('[data-field="' + errors[0][0] + '"] input, [data-field="' + errors[0][0] + '"] select', form);
      if (first) first.focus();
      return;
    }
    var url = waBase + "?text=" + encodeURIComponent(buildMessage());
    $("#wa-retry").href = url;
    $("#form-success").hidden = false;
    var win = window.open(url, "_blank", "noopener");
    if (!win) window.location.href = url;
  });

  fillServices("lashes");
  updateForm();

  /* ---------- Header & mobile menu ---------- */
  var header = $("#site-header");
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Hide the floating WhatsApp button where it would cover the form ---------- */
  if ("IntersectionObserver" in window) {
    var covering = [];
    var floatIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var i = covering.indexOf(en.target);
        if (en.isIntersecting && i < 0) covering.push(en.target);
        if (!en.isIntersecting && i >= 0) covering.splice(i, 1);
      });
      document.body.classList.toggle("hide-float", covering.length > 0);
    }, { rootMargin: "0px 0px -35% 0px" });
    ["#book", "#contact", ".site-footer"].forEach(function (s) {
      var el = $(s);
      if (el) floatIO.observe(el);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
})();
