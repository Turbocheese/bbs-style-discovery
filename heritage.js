// Heritage number tickers. Derived, truthful count-ups of the house's scale,
// shown across the app and animated when they scroll into view. See
// docs/superpowers/specs/2026-07-21-heritage-number-tickers-design.md
(function () {
    var SINCE = 1767; // Founding of the oldest mill in the collection.

    // The single source of truth. Cloths come from the live library; the
    // house count is read from the Mill Map's own pins (MILL_MAP_PINS) so the
    // strip can never disagree with the map's "N houses" lead. Years counts up
    // from the founding date every calendar year on its own.
    function heritageStats() {
        var cloths = 0, houses = 0;
        if (typeof CLOTH_LIBRARY !== "undefined" && CLOTH_LIBRARY.length) {
            cloths = CLOTH_LIBRARY.length;
        }
        if (typeof MILL_MAP_PINS !== "undefined" && MILL_MAP_PINS.length) {
            // Every charted house (mill or merchant), excluding raw cotton
            // origins — the exact count renderMillMap() prints as "N houses".
            for (var i = 0; i < MILL_MAP_PINS.length; i++) {
                if (MILL_MAP_PINS[i].type !== "origin") houses++;
            }
        } else if (typeof CLOTH_LIBRARY !== "undefined") {
            // Fallback (map not loaded): distinct mills in the collection.
            var seen = {};
            for (var j = 0; j < CLOTH_LIBRARY.length; j++) {
                var m = CLOTH_LIBRARY[j].mill;
                if (m && !seen[m]) { seen[m] = 1; houses++; }
            }
        }
        return {
            cloths: cloths,
            houses: houses,
            since: SINCE,
            years: new Date().getFullYear() - SINCE
        };
    }

    function fmt(n) { return Math.round(n).toLocaleString("en-US"); }

    // Animate el's text from 0 to target with an ease-out cubic. Honours
    // reduced-motion by jumping straight to the final value.
    function countUp(el, target, opts) {
        opts = opts || {};
        var dur = opts.duration || 1200;
        var reduced = window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced || target <= 0) { el.textContent = fmt(target); return; }
        var start = null;
        function step(ts) {
            if (start === null) start = ts;
            var p = Math.min(1, (ts - start) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(target * eased);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = fmt(target);
        }
        requestAnimationFrame(step);
    }

    // Markup for the trio. `variant` selects layout only; the figures are the
    // same everywhere. The aria-label carries the settled values so screen
    // readers never read the "0" placeholder or the intermediate frames.
    function renderHeritageStrip(variant) {
        var s = heritageStats();
        variant = variant || "home";
        function stat(value, label, caption) {
            return '<div class="heritage-stat">' +
                '<span class="heritage-num" data-count="' + value + '">0</span>' +
                '<span class="heritage-label">' + label + '</span>' +
                (caption ? '<span class="heritage-caption">' + caption + '</span>' : '') +
                '</div>';
        }
        var div = '<span class="heritage-div" aria-hidden="true"></span>';
        return '<div class="heritage-strip heritage-strip--' + variant + '" data-heritage-strip ' +
            'role="img" aria-label="' + s.years + ' years of heritage, ' +
            s.houses + ' houses, ' + s.cloths + ' cloths">' +
            stat(s.years, "Years", "since " + s.since) + div +
            stat(s.houses, "Houses", "Britain &amp; Europe") + div +
            stat(s.cloths, "Cloths", "in the collection") +
            '</div>';
    }

    // Wire every strip currently in the DOM to count up when it enters view,
    // and reset when it leaves so a revisit re-animates. Idempotent — safe to
    // call after every render.
    var _io = null;
    function animate(strip) {
        var nums = strip.querySelectorAll(".heritage-num");
        for (var i = 0; i < nums.length; i++) {
            countUp(nums[i], +nums[i].getAttribute("data-count"));
        }
    }
    function reset(strip) {
        var nums = strip.querySelectorAll(".heritage-num");
        for (var i = 0; i < nums.length; i++) nums[i].textContent = "0";
    }
    function initHeritageStrips() {
        var strips = document.querySelectorAll("[data-heritage-strip]");
        if (!strips.length) return;
        if (!("IntersectionObserver" in window)) {
            for (var j = 0; j < strips.length; j++) animate(strips[j]);
            return;
        }
        if (!_io) {
            _io = new IntersectionObserver(function (entries) {
                for (var k = 0; k < entries.length; k++) {
                    var strip = entries[k].target;
                    if (entries[k].isIntersecting) {
                        if (!strip._counted) { strip._counted = true; animate(strip); }
                    } else {
                        strip._counted = false;
                        reset(strip);
                    }
                }
            }, { threshold: 0.4 });
        }
        for (var m = 0; m < strips.length; m++) {
            if (strips[m]._observed) continue;
            strips[m]._observed = true;
            _io.observe(strips[m]);
        }
    }

    window.heritageStats = heritageStats;
    window.countUp = countUp;
    window.renderHeritageStrip = renderHeritageStrip;
    window.initHeritageStrips = initHeritageStrips;
})();
