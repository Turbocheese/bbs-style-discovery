// ============================================
// BBS LOOKBOOK DATA & RENDERING
// ============================================

var lookbookData = [
    {
        id: "look-01",
        img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
        title: "The Riviera Linen Double-Breasted",
        season: "Spring / Summer",
        tags: ["Linen", "Earth & Olive", "Soft Tailoring"]
    },
    {
        id: "look-02",
        img: "https://images.unsplash.com/photo-1593030761757-71fae46fa26c?auto=format&fit=crop&q=80&w=800",
        title: "High-Twist Tropical Worsted",
        season: "Core Wardrobe",
        tags: ["Navy", "Crispaire", "Business Attire"]
    },
    {
        id: "look-03",
        img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
        title: "Textural Layering",
        season: "Autumn / Winter",
        tags: ["Tweed", "Heritage Browns", "Layering"]
    }
];

function navigateLookbook() {
    appState.view = "lookbook";
    render({ animate: true });
}

function renderLookbook() {
    var html = '<div class="lookbook-shell">';

    html += '<div class="lookbook-hero">';
    html += '<span class="lookbook-eyebrow">Editorial Archive</span>';
    html += '<h1>The BBS Lookbook</h1>';
    html += '<p>A curated gallery of our tailoring, seasonal campaigns, and styling architecture.</p>';
    html += '</div>';

    html += '<div class="lookbook-grid">';

    for (var i = 0; i < lookbookData.length; i++) {
        var item = lookbookData[i];

        var tagsHTML = '';
        for (var t = 0; t < item.tags.length; t++) {
            tagsHTML += '<span class="lookbook-tag">' + item.tags[t] + '</span>';
        }

        html += '<div class="lookbook-item">';
        html += '<img src="' + item.img + '" alt="' + item.title + '" loading="lazy">';
        html += '<div class="lookbook-item-overlay">';
        html += '<div class="lookbook-item-season">' + item.season + '</div>';
        html += '<div class="lookbook-item-title">' + item.title + '</div>';
        html += '<div class="lookbook-tags-row">' + tagsHTML + '</div>';
        html += '</div>';
        html += '</div>';
    }

    html += '</div>';

    html += '<div class="nav-buttons" style="margin-top: 3rem; justify-content: center;">';
    html += '<button data-action="home">Back to Home</button>';
    html += '</div>';

    html += '</div>';

    return html;
}
