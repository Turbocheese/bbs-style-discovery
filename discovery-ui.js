// ============================================
// DISCOVERY STATE
// ============================================

var discoveryState = {
    isOpen: false,
    lastQueryLabel: "",
    lastFilters: {},
    lastResults: [],
    activePreset: "",
    lastKeyword: "",
};

// Saved scroll position for panel persistence
var _panelSavedScroll = 0;

// Debounce timer for real-time keyword search
var _keywordDebounceTimer = null;

// ============================================
// TOGGLE PANEL
// ============================================

function toggleDiscovery() {
    var panel = document.getElementById("discovery-panel");
    var fab = document.querySelector(".fab");
    var isOpening = !panel.classList.contains("open");

    if (isOpening) {
        panel.classList.add("open");
        discoveryState.isOpen = true;
        if (fab) fab.classList.add("is-active");
        setTimeout(function () {
            panel.scrollTop = _panelSavedScroll;
        }, 50);
    } else {
        _panelSavedScroll = panel.scrollTop;
        panel.classList.remove("open");
        discoveryState.isOpen = false;
        if (fab) fab.classList.remove("is-active");
    }
}

// ============================================
// PRESET QUERIES
// ============================================

function runQuery(queryType) {
    var results;
    var filters = {};
    var label = "";

    discoveryState.activePreset = queryType || "";
    discoveryState.lastKeyword = "";

    switch (queryType) {
        case "bbs_core":
            filters = { bbs_signature: true };
            label = "BBS Signature Pieces";
            results = queryBBSCore();
            break;
        case "versatile":
            filters = { min_versatility: 5 };
            label = "High Versatility";
            results = queryVersatile();
            break;
        case "tropical_work":
            filters = { climate: "tropical", use_case: "work" };
            label = "Tropical Work";
            results = queryTropicalWork();
            break;
        case "first_suit":
            filters = { bbs_signature: true, min_versatility: 5 };
            label = "Build First Suit";
            results = buildFirstSuit();
            break;
        default:
            label = "Query";
            results = [];
    }

    setDiscoveryResults(label, results, filters);
}

// ============================================
// CUSTOM QUERY (keyword + filters)
// ============================================

function runCustomQuery() {
    var keywordInput = document.getElementById("keyword-search-input");
    var climate = document.getElementById("climate-filter").value;
    var formality = document.getElementById("formality-filter").value;
    var useCase = document.getElementById("use-case-filter").value;
    var keyword = keywordInput ? keywordInput.value.trim() : "";

    var filters = {};
    var labelParts = [];

    discoveryState.activePreset = "";
    discoveryState.lastKeyword = keyword;

    if (climate) {
        filters.climate = climate;
        labelParts.push(formatFilterLabel(climate));
    }

    if (formality) {
        filters.formality = formality;
        labelParts.push(formatFilterLabel(formality));
    }

    if (useCase) {
        filters.use_case = useCase;
        labelParts.push(formatFilterLabel(useCase));
    }

    if (keyword) {
        filters.keyword = keyword;
    }

    if (!keyword && !climate && !formality && !useCase) {
        clearDiscoveryResults();
        return;
    }

    var label = "";

    if (keyword) {
        label = 'Keyword: "' + keyword + '"';
        if (labelParts.length) {
            label += " \u00b7 " + labelParts.join(" \u00b7 ");
        }
    } else {
        label = labelParts.length
            ? "Custom: " + labelParts.join(" \u00b7 ")
            : "Custom Query";
    }

    var results;

    if (keyword) {
        results = queryByKeyword(keyword, filters);
    } else {
        results = queryByMetadata(filters);
    }

    setDiscoveryResults(label, results, filters);
}

// ============================================
// BROWSE ALL
// ============================================

function searchAllTopics() {
    var allTopics = findAllTopics(guideTree);
    console.log("Total topics in guide:", allTopics.length);

    discoveryState.activePreset = "";
    discoveryState.lastKeyword = "";

    setDiscoveryResults("Browse All Topics", allTopics, {});
}

// ============================================
// RESULT STATE MANAGEMENT
// ============================================

function setDiscoveryResults(label, results, filters) {
    discoveryState.lastQueryLabel = label || "";
    discoveryState.lastResults = results || [];
    discoveryState.lastFilters = filters || {};

    syncDiscoveryFiltersToUI();
    syncPresetButtonsToUI();
    displayResults(discoveryState.lastResults, discoveryState.lastFilters);
}

function clearDiscoveryResults() {
    discoveryState.lastQueryLabel = "";
    discoveryState.lastFilters = {};
    discoveryState.lastResults = [];
    discoveryState.activePreset = "";
    discoveryState.lastKeyword = "";

    syncDiscoveryFiltersToUI();
    syncPresetButtonsToUI();

    var container = document.getElementById("results-container");
    if (container) {
        container.innerHTML =
            '<p class="results-empty">Choose a starting point or refine the discovery.</p>';
    }
}

// ============================================
// SYNC UI TO STATE
// ============================================

function syncDiscoveryFiltersToUI() {
    var climateSelect = document.getElementById("climate-filter");
    var formalitySelect = document.getElementById("formality-filter");
    var useCaseSelect = document.getElementById("use-case-filter");
    var keywordInput = document.getElementById("keyword-search-input");

    if (climateSelect) {
        climateSelect.value = discoveryState.lastFilters.climate || "";
    }

    if (formalitySelect) {
        formalitySelect.value = discoveryState.lastFilters.formality || "";
    }

    if (useCaseSelect) {
        useCaseSelect.value = discoveryState.lastFilters.use_case || "";
    }

    if (keywordInput) {
        keywordInput.value = discoveryState.lastKeyword || "";
    }
}

function syncPresetButtonsToUI() {
    var presetButtons = document.querySelectorAll(".query-btn[data-query-type]");

    for (var i = 0; i < presetButtons.length; i++) {
        var btn = presetButtons[i];
        var queryType = btn.getAttribute("data-query-type");

        if (queryType === discoveryState.activePreset) {
            btn.classList.add("is-active");
        } else {
            btn.classList.remove("is-active");
        }
    }
}

// ============================================
// LABEL HELPERS
// ============================================

function getTopicKindLabel(kind) {
    var labels = {
        garment: "Garment",
        fabric: "Fabric",
        garment_detail: "Garment Detail",
        wardrobe_strategy: "Wardrobe Strategy",
        brand_philosophy: "Brand Philosophy",
        fabric_reference: "Fabric Reference",
        guide: "Guide Topic",
    };

    return labels[kind] || "Topic";
}

function getTopicContextLabel(topic) {
    if (!topic || !topic.path || !topic.path.length) return "";

    var path = topic.path;
    var top = path || "";
    var second = path || "";
    var third = path || "";

    if (top === "tailoring" && second === "shirts" && third === "fabrics") {
        return "Shirt Fabric";
    }

    if (top === "fabrics" && second === "shirtings") {
        return "Fabric Reference";
    }

    if (top === "fabrics" && second === "suiting") {
        return "Suiting Fabric";
    }

    if (top === "accessories" && second === "shoes" && third === "dress_shoes") {
        return "Dress Shoe";
    }

    if (top === "accessories" && second === "shoes" && third === "loafers") {
        return "Loafer";
    }

    if (top === "accessories" && second === "shoes" && third === "boots") {
        return "Boot";
    }

    if (top === "accessories" && second === "shoes" && third === "sneakers") {
        return "Sneaker";
    }

    if (top === "tailoring" && third === "use_case") {
        if (second === "suits") return "Suit Use Case";
        if (second === "jackets") return "Jacket Use Case";
        if (second === "shirts") return "Shirt Use Case";
    }

    if (top === "tailoring" && second === "jackets" && third === "other_styles") {
        return "Jacket Style";
    }

    if (top === "tailoring" && second === "jackets" && third === "details") {
        return "Jacket Detail";
    }

    if (
        top === "tailoring" &&
        second === "trousers" &&
        third === "configuration"
    ) {
        return "Trouser Configuration";
    }

    if (top === "colour_wardrobe" && second === "core_colours") {
        return "Core Colour";
    }

    if (top === "colour_wardrobe") {
        return "Wardrobe Strategy";
    }

    if (top === "cloth_origins") {
        return "Mill / Cloth Reference";
    }

    if (top === "about") {
        return "BBS Philosophy";
    }

    return "";
}

// ============================================
// TOP PICKS LOGIC
// ============================================

function getTopPicks(results, filters, limit) {
    limit = limit || 8;
    filters = filters || {};

    var picks = [];
    var usedTitles = {};
    var useCase = filters.use_case || "";
    var formality = filters.formality || "";

    function isUsed(topic) {
        return usedTitles[(topic.title || "").toLowerCase()];
    }

    function markUsed(topic) {
        usedTitles[(topic.title || "").toLowerCase()] = true;
    }

    function addPick(topic) {
        if (!topic || isUsed(topic)) return false;
        picks.push(topic);
        markUsed(topic);
        return true;
    }

    function matchesUseCase(topic) {
        return (
            useCase &&
            topic.metadata &&
            topic.metadata.use_cases &&
            topic.metadata.use_cases.indexOf(useCase) !== -1
        );
    }

    function matchesFormality(topic) {
        return (
            formality &&
            topic.metadata &&
            topic.metadata.formality &&
            topic.metadata.formality.indexOf(formality) !== -1
        );
    }

    function isColourTopic(topic) {
        if (!topic) return false;
        var pathString = topic.pathString || "";
        var tags = topic.tags || [];
        return (
            pathString.indexOf("colour_wardrobe") === 0 ||
            tags.indexOf("colour") !== -1 ||
            tags.indexOf("core_colours") !== -1 ||
            tags.indexOf("palette") !== -1
        );
    }

    function isAccessoryTopic(topic) {
        if (!topic) return false;
        var pathString = topic.pathString || "";
        var tags = topic.tags || [];
        return (
            pathString.indexOf("accessories") === 0 ||
            tags.indexOf("accessories") !== -1 ||
            tags.indexOf("shoes") !== -1 ||
            tags.indexOf("footwear") !== -1
        );
    }

    function isFootwearTopic(topic) {
        if (!topic) return false;
        var pathString = topic.pathString || "";
        var tags = topic.tags || [];
        return (
            pathString.indexOf("accessories > shoes") === 0 ||
            tags.indexOf("shoes") !== -1 ||
            tags.indexOf("footwear") !== -1 ||
            tags.indexOf("loafers") !== -1 ||
            tags.indexOf("dress_shoes") !== -1 ||
            tags.indexOf("boots") !== -1 ||
            tags.indexOf("sneakers") !== -1
        );
    }

    function isNonColourWardrobeTopic(topic) {
        return (
            topic.topic_kind === "wardrobe_strategy" &&
            !isColourTopic(topic) &&
            !isAccessoryTopic(topic)
        );
    }

    function findFirst(predicate) {
        for (var i = 0; i < results.length; i++) {
            var topic = results[i];
            if (isUsed(topic)) continue;
            if (predicate(topic)) return topic;
        }
        return null;
    }

    // Slot 1: non-colour wardrobe / use-case topic
    addPick(
        findFirst(function (topic) {
            return (
                isNonColourWardrobeTopic(topic) &&
                (matchesUseCase(topic) ||
                    matchesFormality(topic) ||
                    topic.title === "Smart Casual" ||
                    topic.title === "Building a Wardrobe" ||
                    topic.title === "Tropical Tailoring" ||
                    topic.title === "Core Wardrobe Anchors")
            );
        })
    );

    // Slot 2: garment
    addPick(
        findFirst(function (topic) {
            return (
                topic.topic_kind === "garment" &&
                (matchesUseCase(topic) ||
                    matchesFormality(topic) ||
                    topic.title === "Soft Odd Jacket" ||
                    topic.title === "Long Sleeve" ||
                    topic.title === "Short Sleeve" ||
                    topic.title === "Tropical Tailoring" ||
                    topic.title === "Teba")
            );
        })
    );

    // Slot 3: fabric
    addPick(
        findFirst(function (topic) {
            return (
                topic.topic_kind === "fabric" &&
                (matchesUseCase(topic) ||
                    matchesFormality(topic) ||
                    topic.title === "Oxford" ||
                    topic.title === "Hopsack" ||
                    topic.title === "High-Twist Wool" ||
                    topic.title === "Fresco" ||
                    topic.title === "Linen Shirting" ||
                    topic.title === "Linen Suiting")
            );
        })
    );

    // Slot 4: one accessory / shoe topic
    addPick(
        findFirst(function (topic) {
            return (
                topic.topic_kind === "wardrobe_strategy" &&
                isAccessoryTopic(topic) &&
                (isFootwearTopic(topic) || topic.title === "When to Skip the Belt") &&
                (matchesUseCase(topic) ||
                    topic.title === "Penny Loafer" ||
                    topic.title === "Suede Loafer" ||
                    topic.title === "When to Wear Loafers")
            );
        })
    );

    // Slot 5: one colour topic
    addPick(
        findFirst(function (topic) {
            return (
                topic.topic_kind === "wardrobe_strategy" &&
                isColourTopic(topic) &&
                (topic.title === "Navy" ||
                    topic.title === "Stone/Beige" ||
                    topic.title === "Soft Blue" ||
                    topic.title === "Sand" ||
                    topic.title === "Warm-Weather Palette")
            );
        })
    );

    // Slot 6: second non-colour wardrobe topic
    addPick(
        findFirst(function (topic) {
            return (
                isNonColourWardrobeTopic(topic) &&
                (topic.title === "Building a Wardrobe" ||
                    topic.title === "Core Wardrobe Anchors" ||
                    topic.title === "Texture vs Colour" ||
                    topic.title === "Layering in Warm Climates" ||
                    topic.title === "Smart Casual")
            );
        })
    );

    // Slot 7: second garment or fabric
    addPick(
        findFirst(function (topic) {
            return topic.topic_kind === "garment" || topic.topic_kind === "fabric";
        })
    );

    // Slot 8: best remaining non-colour, non-accessory, non-detail topic
    addPick(
        findFirst(function (topic) {
            return (
                (isNonColourWardrobeTopic(topic) ||
                    topic.topic_kind === "garment" ||
                    topic.topic_kind === "fabric") &&
                !isColourTopic(topic) &&
                !isAccessoryTopic(topic)
            );
        })
    );

    return picks.slice(0, limit);
}

// ============================================
// RESULT CARD HTML
// ============================================

function generateResultCardHTML(topic, filters) {
    var pathJson = JSON.stringify(topic.path).replace(/"/g, "&quot;");
    var matchReason = getMatchReason(topic, filters);
    var typeLabel = getTopicKindLabel(topic.topic_kind);
    var contextLabel = getTopicContextLabel(topic);

    var cleanPath = (topic.pathString || "")
        .split(" > ")
        .join(' <span class="path-sep">\u203a</span> ');

    var html =
        '<div class="result-card"' +
        ' tabindex="0"' +
        ' role="button"' +
        ' onclick="navigateToTopic(' +
        pathJson +
        ')"' +
        " onkeydown=\"if(event.key==='Enter'||event.key===' ')navigateToTopic(" +
        pathJson +
        ')">';

    html += '<div class="result-card-header">';
    html += '<div class="result-type-label-wrap">';
    html += '<div class="result-type-label">' + typeLabel + "</div>";

    if (contextLabel) {
        html += '<div class="result-context-label">' + contextLabel + "</div>";
    }

    html += "</div>";

    html += '<div class="result-badges">';
    if (topic.metadata && topic.metadata.versatility) {
        html +=
            '<span class="result-badge">Versatility ' +
            topic.metadata.versatility +
            "/5</span>";
    }
    if (topic.metadata && topic.metadata.bbs_signature) {
        var cardStarIcon =
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; margin-top: -1px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

        html +=
            '<span class="result-badge signature-badge" title="BBS Signature">' +
            cardStarIcon +
            "BBS Signature</span>";
    }

    html += "</div></div>";

    html += "<h4>" + topic.title + "</h4>";
    html += '<div class="result-path">' + cleanPath + "</div>";
    html += '<div class="result-intro">' + topic.intro + "</div>";

    html += '<div class="result-card-footer">';
    html += '<div class="result-match-reason">' + matchReason + "</div>";
    html += "</div>";

    html += "</div>";

    return html;
}

// ============================================
// DISPLAY RESULTS
// ============================================

function displayResults(results, filters) {
    var container = document.getElementById("results-container");
    filters = filters || {};

    if (!results || results.length === 0) {
        container.innerHTML =
            '<p class="results-empty">No matching topics found. Try broadening the filters.</p>';
        return;
    }

    var html =
        '<div class="results-count-label">' +
        results.length +
        " result" +
        (results.length === 1 ? "" : "s") +
        " found</div>";

    if (discoveryState.lastQueryLabel) {
        html +=
            '<div class="result-current-query">' +
            discoveryState.lastQueryLabel +
            "</div>";
    }

    // SMALL RESULT MODE (10 or fewer)
    if (results.length <= 10) {
        for (var s = 0; s < results.length; s++) {
            html += generateResultCardHTML(results[s], filters);
        }
        container.innerHTML = html;
        return;
    }

    // LARGE RESULT MODE
    var groupOrder = [
        "wardrobe_strategy",
        "garment",
        "fabric",
        "garment_detail",
        "fabric_reference",
        "brand_philosophy",
        "guide",
    ];

    var defaultExpanded = {
        wardrobe_strategy: false,
        garment: false,
        fabric: false,
        garment_detail: false,
        fabric_reference: false,
        brand_philosophy: false,
        guide: false,
    };

    var grouped = {};
    var topPicks = getTopPicks(results, filters, 8);

    for (var i = 0; i < results.length; i++) {
        var topic = results[i];
        var kind = topic.topic_kind || "guide";
        if (!grouped[kind]) grouped[kind] = [];
        grouped[kind].push(topic);
    }

    // Top Picks section
    if (topPicks.length) {
        html += '<div class="result-group top-picks-group">';
        html +=
            '<div class="result-group-heading">Recommended Starting Points</div>';

        for (var p = 0; p < topPicks.length; p++) {
            html += generateResultCardHTML(topPicks[p], filters);
        }

        html += "</div>";

        // Divider between top picks and browse zone
        html += '<div class="results-section-divider">';
        html +=
            '<span class="results-section-divider-label">All Matching Topics</span>';
        html += '<span class="results-section-divider-actions">';
        html +=
            '<button class="result-group-action-btn" type="button" onclick="showAllResultGroups()">Expand All</button>';
        html +=
            '<button class="result-group-action-btn" type="button" onclick="hideAllResultGroups()">Collapse All</button>';
        html += "</span></div>";
    }

    // Grouped sections
    for (var g = 0; g < groupOrder.length; g++) {
        var kindKey = groupOrder[g];
        var items = grouped[kindKey];

        if (!items || !items.length) continue;

        var expanded = defaultExpanded[kindKey];
        var contentStyle = expanded ? "" : ' style="display:none;"';
        var toggleSymbol = expanded ? "\u2212" : "+";

        html += '<div class="result-group">';
        html +=
            '<button class="result-group-toggle" type="button" onclick="toggleResultGroup(\'' +
            kindKey +
            "')\">";
        html +=
            '<span class="result-group-heading-text">' +
            getTopicKindLabel(kindKey) +
            " (" +
            items.length +
            ")</span>";
        html +=
            '<span class="result-group-toggle-symbol" id="toggle-symbol-' +
            kindKey +
            '">' +
            toggleSymbol +
            "</span>";
        html += "</button>";

        html +=
            '<div class="result-group-content" id="result-group-' +
            kindKey +
            '"' +
            contentStyle +
            ">";
        for (var j = 0; j < items.length; j++) {
            html += generateResultCardHTML(items[j], filters);
        }
        html += "</div></div>";
    }

    container.innerHTML = html;
}

// ============================================
// GROUP TOGGLE CONTROLS
// ============================================

function toggleResultGroup(kindKey) {
    var content = document.getElementById("result-group-" + kindKey);
    var symbol = document.getElementById("toggle-symbol-" + kindKey);

    if (!content || !symbol) return;

    var isHidden = content.style.display === "none";
    content.style.display = isHidden ? "block" : "none";
    symbol.textContent = isHidden ? "\u2212" : "+";
}

function showAllResultGroups() {
    var groups = document.querySelectorAll(".result-group-content");
    var symbols = document.querySelectorAll(".result-group-toggle-symbol");

    for (var i = 0; i < groups.length; i++) {
        groups[i].style.display = "block";
    }

    for (var j = 0; j < symbols.length; j++) {
        symbols[j].textContent = "\u2212";
    }
}

function hideAllResultGroups() {
    var groups = document.querySelectorAll(".result-group-content");
    var symbols = document.querySelectorAll(".result-group-toggle-symbol");

    for (var i = 0; i < groups.length; i++) {
        groups[i].style.display = "none";
    }

    for (var j = 0; j < symbols.length; j++) {
        symbols[j].textContent = "+";
    }
}

// ============================================
// NAVIGATION
// ============================================

function navigateToTopic(path) {
    var panel = document.getElementById("discovery-panel");
    var fab = document.querySelector(".fab");

    _panelSavedScroll = 0;
    panel.classList.remove("open");
    discoveryState.isOpen = false;

    if (fab) fab.classList.remove("is-active");

    navigateGuide(path);
    console.log("Navigating to:", path.join(" > "));
}

// ============================================
// FORMAT HELPER
// ============================================

function formatFilterLabel(value) {
    if (!value) return "";

    return value
        .split("_")
        .map(function (part) {
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(" ");
}

// ============================================
// EVENT LISTENERS
// ============================================

// Enter key in keyword input
document.addEventListener("keydown", function (e) {
    var keywordInput = document.getElementById("keyword-search-input");

    if (
        keywordInput &&
        document.activeElement === keywordInput &&
        e.key === "Enter"
    ) {
        clearTimeout(_keywordDebounceTimer);
        runCustomQuery();
    }
});

// Real-time keyword search with debounce (400ms)
document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "keyword-search-input") {
        clearTimeout(_keywordDebounceTimer);
        _keywordDebounceTimer = setTimeout(function () {
            if (e.target.value.trim().length >= 2) {
                runCustomQuery();
            } else if (e.target.value.trim().length === 0) {
                // If keyword cleared, re-run with filters only or clear
                var climate = document.getElementById("climate-filter").value;
                var formality = document.getElementById("formality-filter").value;
                var useCase = document.getElementById("use-case-filter").value;
                if (!climate && !formality && !useCase) {
                    clearDiscoveryResults();
                } else {
                    runCustomQuery();
                }
            }
        }, 400);
    }
});

// Auto-trigger on filter dropdown changes
(function () {
    var filterIds = ["climate-filter", "formality-filter", "use-case-filter"];
    filterIds.forEach(function (id) {
        document.addEventListener("change", function (e) {
            if (e.target && e.target.id === id) {
                runCustomQuery();
            }
        });
    });
})();

// ============================================
// INIT LOG
// ============================================

console.log("\uD83C\uDFA8 Discovery UI Loaded with UX Improvements!");
