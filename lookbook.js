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
        id: "look-camel-db",
        img: "images/lookbook/bbs-editorial-jc2081.jpg",
        title: "The Double-Breasted, Camel",
        season: "Autumn",
        tags: ["Double Breasted", "Roll Neck", "Warm Neutral"],
        note:
            "A camel double-breasted suit over a fine roll neck, shot against timber and turning leaves. Soft tailoring in a warm neutral — a suit that carries like a coat.",
        guidePath: ["tailoring", "suits", "styles", "double_breasted"],
        guideLabel: "Read: the Double-Breasted Suit",
    },
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
        id: "look-khaki-safari",
        img: "images/lookbook/bbs-editorial-jc4619.jpg",
        title: "The Safari, Khaki",
        season: "Warm Weather",
        tags: ["Safari Jacket", "Belted Waist", "White Trouser"],
        note:
            "A khaki safari jacket — four pockets, belted at the waist — over white trousers against warm brick. The field jacket at its most tailored, structure that still breathes.",
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
        id: "look-navy-safari",
        img: "images/lookbook/bbs-editorial-jc9454.jpg",
        title: "The Safari, Navy",
        season: "Warm Weather",
        tags: ["Safari Jacket", "Cream Trouser", "Sun-washed"],
        note:
            "The safari jacket in navy over cream trousers, against a sun-baked wall. A darker cloth pulls the four-pocket cut toward town without losing the ease.",
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
        id: "look-oat-chore",
        img: "images/lookbook/bbs-editorial-jc4476.jpg",
        title: "The Chore Jacket, Oat",
        season: "Resort",
        tags: ["Chore Jacket", "Fine Knit", "White Trouser"],
        note:
            "An oat chore jacket over a fine knit with white trousers, worn easy in warm light. Workwear cut in a dress-weight cloth — the jacket you reach for when nothing needs saying.",
        guidePath: ["tailoring", "jackets", "other_styles", "chore"],
        guideLabel: "Read: the Chore Jacket",
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
    {
        id: "look-cream-tonal",
        img: "images/lookbook/bbs-editorial-jc4509.jpg",
        title: "Cream, End to End",
        season: "Resort",
        tags: ["Tonal", "Soft Jacket", "Full Cut"],
        note:
            "A head-to-toe cream look — soft jacket over an open shirt and full-cut trousers — carried through a lantern-lit villa. Tonal dressing that lives or dies on cloth and cut, not colour.",
        guidePath: ["fabrics", "suiting", "linen_suiting"],
        guideLabel: "Read: Linen Suiting",
    },
    {
        id: "look-pale-linen-suit",
        img: "images/lookbook/bbs-editorial-jc9770.jpg",
        title: "The Linen Suit, Pale",
        season: "Coastal",
        tags: ["Linen Suit", "Open Collar", "Full Trouser"],
        note:
            "A pale linen suit worn open at the collar on the rocks — jacket unbuttoned, trousers full. Linen earns its creases; that is rather the point of it.",
        guidePath: ["fabrics", "suiting", "linen_suiting"],
        guideLabel: "Read: Linen Suiting",
    },
    {
        id: "look-tobacco-blouson",
        img: "images/lookbook/bbs-editorial-jc9393.jpg",
        title: "Tobacco, on Terracotta",
        season: "Warm Weather",
        tags: ["Blouson", "Pleated Trouser", "Tonal Brown"],
        note:
            "A tobacco blouson over pleated trousers of the same warmth, against a sun-baked wall. Tonal brown carried through — a palette that only works when the textures differ.",
        guidePath: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
        guideLabel: "Read: the Soft Odd Jacket",
    },
    {
        id: "look-knit-coastal",
        img: "images/lookbook/bbs-editorial-jc9797.jpg",
        title: "Knit and White, Coastal",
        season: "Coastal",
        tags: ["Knit Polo", "Pleated Trouser", "Ecru"],
        note:
            "An ecru knit polo tucked into white pleated trousers, caught mid-stride on the sand. The whole warm-weather argument in two pieces — texture up top, ease below.",
        guidePath: ["colour_wardrobe", "warm_weather_palette"],
        guideLabel: "Read: the Warm-Weather Palette",
    },
    {
        id: "look-chocolate-overshirt",
        img: "images/lookbook/bbs-editorial-jc4570.jpg",
        title: "The Overshirt, Chocolate",
        season: "Resort",
        tags: ["Overshirt", "Open Collar", "White Trouser"],
        note:
            "A chocolate overshirt worn open over a tee with white trousers. Shirt-weight cloth doing a jacket's job — the least effortful way to look put together in the heat.",
        guidePath: ["tailoring", "jackets", "other_styles", "chore"],
        guideLabel: "Read: the Chore Jacket",
    },
    {
        id: "look-glen-check",
        img: "images/lookbook/bbs-editorial-r21757.jpg",
        title: "Glen Check, in the Trees",
        season: "Autumn",
        tags: ["Glen Check", "Roll Neck", "Layered"],
        note:
            "A grey glen-check jacket layered over a roll neck and a cap, standing among turning leaves. Country pattern taken somewhere quieter — check that reads as texture at a distance.",
        guidePath: ["fabrics", "suiting", "pattern_and_texture", "glen_check"],
        guideLabel: "Read: Glen Check",
    },
    {
        id: "look-check-and-stripe",
        img: "images/lookbook/bbs-editorial-jc2005.jpg",
        title: "Glen Check, and a Stripe",
        season: "Autumn",
        tags: ["Glen Check", "Striped Tie", "Coat Over Arm"],
        note:
            "A glen-check jacket, a striped tie and a cream coat carried over the shoulder. Two patterns at different scales — the check quiet and close, the stripe bold and wide, which is the whole trick.",
        guidePath: ["fabrics", "suiting", "pattern_and_texture", "glen_check"],
        guideLabel: "Read: Glen Check",
    },
    {
        id: "look-black-mono",
        img: "images/lookbook/bbs-editorial-r21329bw.jpg",
        title: "Black, in Monochrome",
        season: "Autumn",
        tags: ["Dark Suit", "Roll Neck", "Black and White"],
        note:
            "A dark suit over a roll neck, shot against bare concrete in black and white. No colour, no shirt, no tie — everything left to the line of the shoulder and the break of the trouser.",
        guidePath: ["tailoring", "suits", "use_case", "evening"],
        guideLabel: "Read: the Evening Suit",
    },
    {
        id: "look-brown-walking",
        img: "images/lookbook/bbs-editorial-r21601.jpg",
        title: "Brown, Walking Out",
        season: "Autumn",
        tags: ["Brown Suit", "Full Trouser", "Coat Over Arm"],
        note:
            "A brown suit walking away over fallen leaves, coat folded over the arm. Brown is the least severe of the dark neutrals — it belongs outdoors in low autumn light.",
        guidePath: ["colour_wardrobe", "core_colours", "brown"],
        guideLabel: "Read: Brown",
    },
    {
        id: "look-swatch-book",
        img: "images/lookbook/bbs-editorial-t7b0165.jpg",
        title: "Cloth, Chosen First",
        season: "Autumn",
        tags: ["Swatch Book", "Bunches", "The Choice"],
        note:
            "A hand turning through swatch cards, checks and blues laid open. Every look in this book starts here — the cloth is picked before the cut is drawn.",
        guidePath: ["fabrics", "suiting", "worsted_wool"],
        guideLabel: "Read: Worsted Wool",
    },
    {
        id: "look-check-wide-trouser",
        img: "images/lookbook/bbs-editorial-t7b0689.jpg",
        title: "Odd Jacket, Wide Trouser",
        season: "Warm Weather",
        tags: ["Checked Jacket", "Deep Pleats", "Indigo Trouser"],
        note:
            "A checked jacket worn open over a tee, with deep-pleated indigo trousers cut wide. The pleat is doing the work — volume in the leg is what keeps a soft jacket from reading as formal.",
        guidePath: ["tailoring", "trousers", "configuration", "pleats", "double_pleats"],
        guideLabel: "Read: Double Pleats",
    },
    {
        id: "look-tobacco-tie",
        img: "images/lookbook/bbs-editorial-t7b0806.jpg",
        title: "Tobacco, and a Printed Tie",
        season: "Autumn",
        tags: ["Tobacco", "Printed Tie", "Peak Lapel"],
        note:
            "A tobacco jacket with a small-print tie against a pale shirt. Warm mid-brown sits between a business navy and a country tweed — it goes almost anywhere and announces nothing.",
        guidePath: ["colour_wardrobe", "core_colours", "tobacco"],
        guideLabel: "Read: Tobacco",
    },
    {
        id: "look-loafers-rug",
        img: "images/lookbook/bbs-editorial-t7b2191.jpg",
        title: "Loafers, Lined Up",
        season: "Resort",
        tags: ["Loafers", "Suede and Calf", "No Laces"],
        note:
            "Three pairs of loafers laid out on a patterned rug — suede and polished calf, dark to light. The slip-on is the warm-climate dress shoe: less ceremony, the same line.",
        guidePath: ["accessories", "shoes", "loafers", "penny_loafer"],
        guideLabel: "Read: the Penny Loafer",
    },
    {
        id: "look-white-jacket",
        img: "images/lookbook/bbs-editorial-t7b3615.jpg",
        title: "White Jacket, Dark Trouser",
        season: "Resort",
        tags: ["Ivory Jacket", "Dark Trouser", "High Contrast"],
        note:
            "An ivory jacket worn open over dark pleated trousers. The sharpest contrast in the wardrobe, and the one that most needs the cut to be right — nothing hides on a pale jacket.",
        guidePath: ["colour_wardrobe", "core_colours", "cream_offwhite"],
        guideLabel: "Read: Cream and Off-White",
    },
    {
        id: "look-charcoal-courtyard",
        img: "images/lookbook/bbs-editorial-t7b4037.jpg",
        title: "Charcoal, in the Courtyard",
        season: "Warm Weather",
        tags: ["Charcoal Suit", "Patterned Tie", "Soft Shoulder"],
        note:
            "A charcoal suit with a patterned tie and dark glasses, out in the open air. Charcoal is the serious neutral — worn soft-shouldered and unbuttoned, it stops short of a boardroom.",
        guidePath: ["colour_wardrobe", "core_colours", "charcoal"],
        guideLabel: "Read: Charcoal",
    },
    {
        id: "look-foulard-tie",
        img: "images/lookbook/bbs-editorial-t7b4044.jpg",
        title: "The Printed Tie",
        season: "Warm Weather",
        tags: ["Printed Tie", "Open Jacket", "Textured Cloth"],
        note:
            "A small repeating print worn against a textured dark jacket and a pale shirt. A print at this scale reads as texture from across a room and as detail up close — the useful kind of tie.",
        guidePath: ["accessories", "ties", "when_to_wear_a_tie"],
        guideLabel: "Read: When to Wear a Tie",
    },
    {
        id: "look-tan-db",
        img: "images/lookbook/bbs-editorial-t7b4833.jpg",
        title: "Tan, Double-Breasted",
        season: "Warm Weather",
        tags: ["Double Breasted", "Tan", "Terracotta Floor"],
        note:
            "A tan double-breasted suit caught mid-stride across a terracotta floor. The heaviest silhouette in tailoring, cut in the lightest colour — which is what keeps it from looking like a uniform.",
        guidePath: ["colour_wardrobe", "core_colours", "tan_camel"],
        guideLabel: "Read: Tan and Camel",
    },
    {
        id: "look-wine-jacket",
        img: "images/lookbook/bbs-editorial-t7b9494.jpg",
        title: "Wine, Single-Breasted",
        season: "Warm Weather",
        tags: ["Odd Jacket", "Patch Pockets", "Wine"],
        note:
            "A wine-coloured single-breasted jacket on the stand, patch pockets and a soft lapel. A colour that only works as an odd jacket — as a suit it would be costume, on its own it is just confident.",
        guidePath: ["tailoring", "jackets", "styles", "single_breasted_jacket"],
        guideLabel: "Read: the Single-Breasted Jacket",
    },
    {
        id: "look-pinstripe-counter",
        img: "images/lookbook/bbs-editorial-t7b9535.jpg",
        title: "Pinstripe, at the Counter",
        season: "Autumn",
        tags: ["Pinstripe", "Navy", "Tie"],
        note:
            "A navy pinstripe suit and a printed tie, leaning at a café counter. The city stripe taken out of the city — the pattern is formal, everything about the posture is not.",
        guidePath: ["fabrics", "suiting", "pattern_and_texture", "pinstripe"],
        guideLabel: "Read: Pinstripe",
    },
    {
        id: "look-chalk-and-tape",
        img: "images/lookbook/bbs-editorial-t7b9822.jpg",
        title: "Chalk and Tape",
        season: "Autumn",
        tags: ["Cut Panels", "Tape Measure", "In the Making"],
        note:
            "Cut panels, chalk lines and a tape measure, in black and white. What a finished jacket looks like halfway through — the shape is decided here, long before anyone tries it on.",
        guidePath: ["tailoring", "jackets", "details", "construction", "full_canvas"],
        guideLabel: "Read: Full Canvas",
    },
];

function navigateLookbook() {
    appState.view = "lookbook";
    render({ animate: true });
}

// The seasons actually present in the data, in a sensible reading order —
// derived rather than hard-coded so a new look cannot fall outside the filter.
function getLookbookSeasons() {
    var order = ["Warm Weather", "Resort", "Coastal", "Autumn"];
    var present = [];
    for (var i = 0; i < order.length; i++) {
        for (var j = 0; j < lookbookData.length; j++) {
            if (lookbookData[j].season === order[i]) { present.push(order[i]); break; }
        }
    }
    // anything new that is not in the order above still gets a chip
    for (var k = 0; k < lookbookData.length; k++) {
        if (present.indexOf(lookbookData[k].season) === -1) present.push(lookbookData[k].season);
    }
    return present;
}

function getLookbookFilter() {
    var f = appState.lookbookFilter;
    return f && f !== "all" ? f : "all";
}

function renderLookbook() {
    var filter = getLookbookFilter();
    var seasons = getLookbookSeasons();
    var shown = [];
    for (var s = 0; s < lookbookData.length; s++) {
        if (filter === "all" || lookbookData[s].season === filter) shown.push(lookbookData[s]);
    }

    var html = '<div class="lookbook-shell">';

    html += '<div class="lookbook-hero">';
    html += '<span class="lookbook-eyebrow">Editorial Archive</span>';
    html += "<h1>The BBS Lookbook</h1>";
    html +=
        "<p>A curated gallery of our tailoring, seasonal campaigns, and styling architecture. Tap any look to turn it over.</p>";
    html += "</div>";

    var optsHTML = getDropdownOptHTML("lookbook-filter", 'data-season="all"', filter === "all", "All looks");
    for (var f = 0; f < seasons.length; f++) {
        optsHTML += getDropdownOptHTML("lookbook-filter", 'data-season="' + seasons[f] + '"',
            filter === seasons[f], seasons[f]);
    }
    html += '<div class="lookbook-filter-dd">';
    html += getDropdownHTML("lookbook-season", "Season", filter === "all" ? "All looks" : filter,
        filter === "all" ? 0 : 1, optsHTML);
    html += '<span class="filter-dd-count">' + shown.length +
        (shown.length === 1 ? " look" : " looks") + "</span>";
    html += "</div>";

    html += '<div class="lookbook-grid">';

    for (var i = 0; i < shown.length; i++) {
        var item = shown[i];

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
            // Eager, not lazy: these are precached and few, and lazy loading
            // inside the gallery left blank-but-flippable cards on iPad Safari.
            '<img src="' + item.img + '" alt="' + item.title +
            '" decoding="async" onerror="this.closest(\'.flip-card\').style.display=\'none\'">' +
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

    html += "</div>";

    return html;
}
