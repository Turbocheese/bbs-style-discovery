// ============================================
// BBS LOOKBOOK DATA & RENDERING
// ============================================
// Photography is the real BBS editorial shoot, vendored into
// images/lookbook/ (not hotlinked — the app must work offline, and a
// dead hotlink previously rendered a broken tile here).
//
// Captions describe only what is visible in the frame. Do not assert
// fibre content or cloth names that cannot be seen; where a look maps
// to a guide topic, link it instead and let the topic do the talking.

var lookbookData = [
    {
        id: "look-navy-field",
        img: "images/lookbook/bbs-editorial-037.jpg",
        title: "The Field Jacket, Navy",
        season: "Warm Weather",
        tags: ["Four Pockets", "Soft Shoulder", "Stone Trouser"],
        note:
            "A four-pocket field jacket worn open over a fine knit, with stone trousers. Structure without stiffness — the jacket does the work, the palette stays quiet.",
        guidePath: ["tailoring", "jackets", "other_styles", "safari"],
        guideLabel: "Read: the Safari Jacket",
    },
    {
        id: "look-black-field",
        img: "images/lookbook/bbs-editorial-158.jpg",
        title: "The Field Jacket, Black",
        season: "Warm Weather",
        tags: ["Belted Waist", "Breton Stripe", "Cream Trouser"],
        note:
            "The same silhouette in black, belted at the waist over a striped crew. Proof that a field jacket reads as evening-adjacent when the colour is severe enough.",
        guidePath: ["tailoring", "jackets", "other_styles", "safari"],
        guideLabel: "Read: the Safari Jacket",
    },
    {
        id: "look-blue-camp",
        img: "images/lookbook/bbs-editorial-1001.jpg",
        title: "The Camp Collar, Blue",
        season: "Warm Weather",
        tags: ["Camp Collar", "Flap Pockets", "Denim"],
        note:
            "An open camp collar with flap chest pockets, sleeves rolled, worn with dark denim. The most useful shirt in a hot climate: a shirt that behaves like a jacket.",
        guidePath: ["tailoring", "shirts", "fabrics", "chambray"],
        guideLabel: "Read: Chambray",
    },
    {
        id: "look-grey-camp",
        img: "images/lookbook/bbs-editorial-367.jpg",
        title: "The Camp Collar, Grey",
        season: "Warm Weather",
        tags: ["Micro Check", "Pleated Trouser", "Tonal"],
        note:
            "A grey micro-check camp collar over pleated dark trousers. Pattern at a distance reads as solid — texture doing the work that colour usually does.",
        guidePath: ["fabrics", "shirtings", "pattern_and_texture", "pencil_stripe"],
        guideLabel: "Read: shirting pattern",
    },
];

function navigateLookbook() {
    appState.view = "lookbook";
    render({ animate: true });
}

function renderLookbook() {
    var html = '<div class="lookbook-shell">';

    html += '<div class="lookbook-hero">';
    html += '<span class="lookbook-eyebrow">Editorial Archive</span>';
    html += "<h1>The BBS Lookbook</h1>";
    html +=
        "<p>A curated gallery of our tailoring, seasonal campaigns, and styling architecture. Tap any look to turn it over.</p>";
    html += "</div>";

    html += '<div class="lookbook-grid">';

    for (var i = 0; i < lookbookData.length; i++) {
        var item = lookbookData[i];

        var tagsHTML = "";
        for (var t = 0; t < item.tags.length; t++) {
            tagsHTML += '<span class="lookbook-tag">' + item.tags[t] + "</span>";
        }

        html +=
            '<div class="flip-card lookbook-item" data-action="flip-card" role="button" tabindex="0" aria-label="' +
            item.title + ' — tap to turn over">' +
            '<div class="flip-card-inner">' +
            // Front: the photograph
            '<div class="flip-card-face flip-card-front">' +
            '<img src="' + item.img + '" alt="' + item.title +
            '" loading="lazy" onerror="this.closest(\'.flip-card\').style.display=\'none\'">' +
            '<div class="lookbook-item-overlay">' +
            '<div class="lookbook-item-season">' + item.season + "</div>" +
            '<div class="lookbook-item-title">' + item.title + "</div>" +
            '<div class="lookbook-tags-row">' + tagsHTML + "</div>" +
            "</div>" +
            '<div class="flip-hint" aria-hidden="true">Turn over</div>' +
            "</div>" +
            // Back: the styling note
            '<div class="flip-card-face flip-card-back">' +
            '<div class="flip-back-eyebrow">' + item.season + "</div>" +
            '<div class="flip-back-title">' + item.title + "</div>" +
            '<p class="flip-back-note">' + item.note + "</p>" +
            '<button class="flip-back-link" data-action="result-link" data-path=\'' +
            JSON.stringify(item.guidePath) + "'>" + item.guideLabel + " &rarr;</button>" +
            '<div class="flip-hint" aria-hidden="true">Turn back</div>' +
            "</div>" +
            "</div>" +
            "</div>";
    }

    html += "</div>";

    html +=
        '<div class="nav-buttons" style="margin-top: 3rem; justify-content: center;">';
    html += '<button data-action="home">Back to Home</button>';
    html += "</div>";

    html += "</div>";

    return html;
}
