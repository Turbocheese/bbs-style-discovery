// ============================================
// BBS LOGO
// ============================================

var BBS_LOGO =
    '<div class="bbs-logo">' +
    '<img src="./images/bbs-logo.svg" alt="Benjamin Barker Studios" class="bbs-logo-image">' +
    '<span class="bbs-logo-name">Benjamin Barker Studios</span>' +
    "</div>";

// ============================================
// ARCHETYPE PROFILES 24  BBS personas
// ============================================

var archetypeProfiles = {
    v: {
        key: "v",
        name: "The Riviera Minimalist",
        sub: "Warm Ease",
        desc: "You look best in light, relaxed pieces that feel elegant without effort — soft structure, warm neutrals, and a wardrobe shaped by ease, sun, and movement.",
        notes: [
            "You respond well to lighter palettes and softer silhouettes",
            "You prefer polish that feels natural rather than formal",
            "Your wardrobe works best when it feels open, breathable, and quietly refined",
        ],
        tags: ["Warm Weather", "Relaxed", "Light Palette", "Effortless"],
        exploreNext: [
            ["tailoring", "jackets", "other_styles", "teba"],
            ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            ["colour_wardrobe", "warm_weather_palette"],
            ["fabrics", "suiting", "linen_suiting"],
        ],
    },
    o: {
        key: "o",
        name: "The Occasion Modernist",
        sub: "Polished Presence",
        desc: "You are at your best when dressing with intent — sharper tailoring, cleaner formality, and pieces that feel elevated enough for meaningful occasions.",
        notes: [
            "You are drawn to dressing that feels purposeful and composed",
            "You prefer sharper lines and more polished finishes when it matters",
            "Your wardrobe is strongest when occasion dressing still feels refined rather than theatrical",
        ],
        tags: ["Occasion", "Polished", "Sharper Tailoring", "Elevated"],
        exploreNext: [
            ["tailoring", "suits", "use_case", "wedding"],
            ["tailoring", "suits", "styles", "double_breasted"],
            ["tailoring", "jackets", "details", "lapels", "peak"],
            ["fabrics", "suiting", "wool_silk_linen"],
        ],
    },
    c: {
        key: "c",
        name: "The Craftsman",
        sub: "Built with Conviction",
        desc: "You value garments with integrity — strong cloth, thoughtful construction, and pieces that hold their shape and relevance over time.",
        notes: [
            "You respond to quality you can feel, not just quality you are told about",
            "You prefer structure, permanence, and materials with real presence",
            "Your best wardrobe is built slowly, with fewer but better pieces",
        ],
        tags: ["Structured", "Cloth-Led", "Long-Term", "Considered"],
        exploreNext: [
            ["tailoring", "suits"],
            ["tailoring", "jackets", "details", "construction", "half_canvas"],
            ["fabrics", "suiting", "worsted_wool"],
            ["colour_wardrobe", "core_colours", "navy"],
        ],
    },
    m: {
        key: "m",
        name: "The Relaxed Modernist",
        sub: "Ease with Polish",
        desc: "You dress best in pieces that feel clean, modern, and easy to wear — relaxed enough for real life, but always pulled together.",
        notes: [
            "You prefer comfort that still looks intentional",
            "You are drawn to softer tailoring and flexible wardrobe pieces",
            "Your style works best when polish never feels forced",
        ],
        tags: ["Flexible", "Smart Casual", "Modern", "Easy"],
        exploreNext: [
            ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            ["tailoring", "shirts", "use_case", "smart_casual"],
            ["colour_wardrobe", "core_wardrobe_anchors"],
            ["accessories", "shoes", "loafers", "penny_loafer"],
        ],
    },
    g: {
        key: "g",
        name: "The Traditionalist",
        sub: "Timeless Menswear",
        desc: "You are most at home in classic menswear codes — balanced tailoring, reliable elegance, and pieces that feel appropriate across occasions.",
        notes: [
            "You trust timeless forms over novelty",
            "You prefer a wardrobe that feels correct, composed, and enduring",
            "You are drawn to tailoring that carries quiet ceremony",
        ],
        tags: ["Classic", "Balanced", "Event Ready", "Enduring"],
        exploreNext: [
            ["tailoring", "suits", "styles", "single_breasted"],
            ["tailoring", "jackets"],
            ["tailoring", "suits", "use_case", "wedding"],
            ["fabrics", "suiting", "fresco"],
        ],
    },
    q: {
        key: "q",
        name: "The Quiet Classicist",
        sub: "Understated Refinement",
        desc: "You prefer restraint over display — a wardrobe built on calm colours, clean lines, and quality that speaks softly rather than loudly.",
        notes: [
            "You look best in simplicity with depth",
            "You favour subtle colour, clean silhouettes, and tonal harmony",
            "Your style is strongest when nothing feels overworked",
        ],
        tags: ["Understated", "Minimal", "Refined", "Quiet"],
        exploreNext: [
            ["colour_wardrobe", "core_colours", "navy"],
            ["colour_wardrobe", "core_colours", "stone_beige"],
            ["colour_wardrobe", "building_a_wardrobe"],
            ["tailoring", "shirts", "fabrics", "poplin"],
        ],
    },
    a: {
        key: "a",
        name: "The Modern Architect",
        sub: "Line and Precision",
        desc: "You are drawn to clarity in silhouette — strong shape, controlled detail, and garments that feel designed rather than merely styled.",
        notes: [
            "You notice proportion, line, and visual structure quickly",
            "You prefer distinction through shape rather than decoration",
            "Your wardrobe works best when every detail feels intentional",
        ],
        tags: ["Precise", "Modern", "Sharp", "Intentional"],
        exploreNext: [
            ["tailoring", "suits", "styles", "double_breasted"],
            ["tailoring", "jackets", "details", "lapels", "peak"],
            ["colour_wardrobe", "texture_vs_colour"],
            ["fabrics", "suiting", "high_twist_wool"],
        ],
    },
    u: {
        key: "u",
        name: "The Utilitarian",
        sub: "Practical Elegance",
        desc: "You want a wardrobe that works hard — resilient, versatile, and composed enough to move across different settings without fuss.",
        notes: [
            "You value usefulness as much as appearance",
            "You prefer pieces that travel well and adapt easily",
            "Your best wardrobe is efficient, durable, and quietly smart",
        ],
        tags: ["Practical", "Versatile", "Resilient", "Useful"],
        exploreNext: [
            ["tailoring", "jackets", "use_case", "travel"],
            ["tailoring", "suits", "use_case", "travel"],
            ["fabrics", "suiting", "high_twist_wool"],
            ["accessories", "shoes", "loafers", "suede_loafer"],
        ],
    },
    t: {
        key: "t",
        name: "The City Innovator",
        sub: "Performance with Polish",
        desc: "You want tailoring that performs in real life — breathable, resilient, and sharp enough to stay composed through long modern days.",
        notes: [
            "You value hidden performance inside a refined exterior",
            "You prefer fabrics that recover well and stay neat",
            "Your style works best when practicality feels invisible",
        ],
        tags: ["Performance", "Travel Ready", "Polished", "Modern"],
        exploreNext: [
            ["fabrics", "suiting", "fresco"],
            ["fabrics", "suiting", "high_twist_wool"],
            ["tailoring", "suits", "use_case", "work"],
            ["about", "tropical_tailoring"],
        ],
    },
    s: {
        key: "s",
        name: "The New Minimalist",
        sub: "Relaxed Clarity",
        desc: "You dress best in modern casual pieces with clean restraint — soft jackets, easy silhouettes, and a wardrobe that feels light, calm, and current.",
        notes: [
            "You prefer ease without sloppiness",
            "You are drawn to relaxed silhouettes with a clean finish",
            "Your best looks feel modern, open, and quietly controlled",
        ],
        tags: ["Relaxed", "Minimal", "Light", "Modern"],
        exploreNext: [
            ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            ["tailoring", "jackets", "other_styles", "teba"],
            ["colour_wardrobe", "warm_weather_palette"],
            ["accessories", "shoes", "loafers", "suede_loafer"],
        ],
    },
    r: {
        key: "r",
        name: "The Soft Classicist",
        sub: "Effortless Elegance",
        desc: "You are at your best in soft tailoring, rich texture, and combinations that feel elegant without ever seeming too formal or too deliberate.",
        notes: [
            "You respond to softness, drape, and texture",
            "You prefer elegance that feels natural rather than ceremonial",
            "Your wardrobe is strongest when it feels relaxed but cultivated",
        ],
        tags: ["Soft", "Textural", "Elegant", "Effortless"],
        exploreNext: [
            ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            ["fabrics", "suiting", "wool_linen"],
            ["fabrics", "suiting", "hopsack"],
            ["colour_wardrobe", "texture_vs_colour"],
        ],
    },
    e: {
        key: "e",
        name: "The Contrast Curator",
        sub: "Texture and Character",
        desc: "You enjoy wardrobes with nuance — mixing texture, pattern, and tonal contrast in a way that feels considered, fresh, and personal.",
        notes: [
            "You create interest through combination rather than obvious statement",
            "You are comfortable with texture, pattern, and layered contrast",
            "Your style feels strongest when it has subtle complexity",
        ],
        tags: ["Textural", "Expressive", "Layered", "Distinct"],
        exploreNext: [
            ["colour_wardrobe", "texture_vs_colour"],
            ["fabrics", "suiting", "summer_tweed"],
            ["fabrics", "suiting", "wool_silk_linen"],
            ["colour_wardrobe", "layering_in_warm_climates"],
        ],
    },
    b: {
        key: "b",
        name: "The Tropical Traditionalist",
        sub: "Classic Codes, Tropical Weight",
        desc: "You dress best in classic tailoring adapted intelligently for heat — breathable suiting, cleaner structure, and timeless menswear forms refined for tropical life rather than borrowed unchanged from colder traditions.",
        notes: [
            "You trust traditional menswear forms, but need them to feel lighter and more wearable in warm climates",
            "You prefer structure that stays composed without becoming heavy or rigid",
            "Your wardrobe works best when classic tailoring is rethought through climate, not just copied from elsewhere",
        ],
        tags: ["Tropical", "Classic", "Breathable", "Structured"],
        exploreNext: [
            ["fabrics", "suiting", "fresco"],
            ["fabrics", "suiting", "high_twist_wool"],
            ["tailoring", "suits", "styles", "single_breasted"],
            ["about", "tropical_tailoring"],
        ],
    },
    h: {
        key: "h",
        name: "The Heritage Modernist",
        sub: "Tradition with Intention",
        desc: "You dress best in classic menswear codes refined for modern life — heritage references, balanced tailoring, and pieces that feel rooted in tradition but edited with enough clarity to remain current and relevant.",
        notes: [
            "You appreciate classic references, but do not want them to feel costume-like or dated",
            "You prefer modern refinement over nostalgia for its own sake",
            "Your wardrobe works best when heritage and present-day ease feel naturally integrated",
        ],
        tags: ["Heritage", "Modern", "Balanced", "Refined"],
        exploreNext: [
            ["tailoring", "suits", "styles", "single_breasted"],
            ["fabrics", "suiting", "worsted_wool"],
            ["tailoring", "jackets", "details", "construction", "half_canvas"],
            ["colour_wardrobe", "core_colours", "navy"],
        ],
    },
    l: {
        key: "l",
        name: "The Layering Specialist",
        sub: "Depth Through Composition",
        desc: "You dress best through composition rather than statement — layering cloth, proportion, and colour with enough control that the wardrobe feels rich, adaptive, and seasonally intelligent without ever seeming overworked.",
        notes: [
            "You think in combinations rather than isolated garments",
            "You respond well to wardrobes that gain depth through layering, texture, and seasonal variation",
            "Your style works best when each layer contributes quietly to a more complete whole",
        ],
        tags: ["Layered", "Adaptive", "Textural", "Seasonal"],
        exploreNext: [
            ["colour_wardrobe", "layering_in_warm_climates"],
            ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            ["colour_wardrobe", "texture_vs_colour"],
            ["fabrics", "suiting", "hopsack"],
        ],
    },
    x: {
        key: "x",
        name: "The Texture Minimalist",
        sub: "Tactile Restraint",
        desc: "You dress best in restrained wardrobes enriched by cloth character — tonal dressing, quiet palettes, and fabric surfaces that create depth through touch, weave, and subtle variation rather than obvious colour or pattern.",
        notes: [
            "You create interest through cloth and texture rather than overt statement",
            "You prefer simplicity that reveals richness on closer attention",
            "Your wardrobe works best when restraint is supported by tactile depth and material quality",
        ],
        tags: ["Minimal", "Textural", "Tonal", "Refined"],
        exploreNext: [
            ["colour_wardrobe", "texture_vs_colour"],
            ["fabrics", "suiting", "hopsack"],
            ["fabrics", "suiting", "summer_tweed"],
            ["colour_wardrobe", "core_colours", "stone_beige"],
        ],
    },
    p: {
        key: "p",
        name: "The Performance Casual",
        sub: "Technical Ease",
        desc: "You dress best in casual pieces that perform quietly — resilient fabrics, relaxed silhouettes, and a wardrobe built for movement, comfort, and repeat wear without looking overtly technical or overly athletic.",
        notes: [
            "You value comfort and performance, but still want the wardrobe to feel considered",
            "You prefer pieces that move easily through daily life without fuss",
            "Your style works best when practicality is built in rather than loudly advertised",
        ],
        tags: ["Performance", "Casual", "Relaxed", "Useful"],
        exploreNext: [
            ["fabrics", "suiting", "high_twist_wool"],
            ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            ["tailoring", "jackets", "use_case", "travel"],
            ["accessories", "shoes", "loafers", "suede_loafer"],
        ],
    },
    k: {
        key: "k",
        name: "The Occasion Maximalist",
        sub: "Bold Celebration",
        desc: "You are at your best when occasion dressing carries real presence — stronger shape, richer colour, and pieces that feel elevated enough to mark the moment without losing elegance or control.",
        notes: [
            "You enjoy occasion dressing that feels intentional, memorable, and visually complete",
            "You are comfortable with stronger shape, richer cloth, and a little more flourish when the context supports it",
            "Your wardrobe is strongest when special dressing feels celebratory rather than cautious",
        ],
        tags: ["Occasion", "Bold", "Formal", "Expressive"],
        exploreNext: [
            ["tailoring", "suits", "styles", "double_breasted"],
            ["tailoring", "jackets", "details", "lapels", "peak"],
            ["tailoring", "suits", "use_case", "wedding"],
            ["fabrics", "suiting", "wool_silk_linen"],
        ],
    },
    w: {
        key: "w",
        name: "The Coastal Modernist",
        sub: "Sun, Salt, and Ease",
        desc: "You dress best in warm-weather pieces that feel light, open, and naturally polished — relaxed tailoring, sun-washed tones, and a wardrobe shaped by air, movement, and a quieter kind of confidence.",
        notes: [
            "You prefer clothing that feels breathable, open, and easy without becoming careless",
            "You respond to warm-weather palettes and softer structure more than urban sharpness",
            "Your wardrobe works best when refinement feels natural, unforced, and touched by climate",
        ],
        tags: ["Coastal", "Relaxed", "Light", "Warm Weather"],
        exploreNext: [
            ["fabrics", "suiting", "linen_suiting"],
            ["tailoring", "jackets", "other_styles", "teba"],
            ["colour_wardrobe", "warm_weather_palette"],
            ["tailoring", "shirts", "use_case", "smart_casual"],
        ],
    },
    f: {
        key: "f",
        name: "The Urban Formalist",
        sub: "City Sharp",
        desc: "You dress best in sharper city tailoring — clean suiting, disciplined lines, and a wardrobe that feels polished, direct, and composed enough for professional life without becoming stiff or old-fashioned.",
        notes: [
            "You prefer tailoring with clarity, structure, and visible control",
            "You respond to city-ready polish more than relaxed softness",
            "Your wardrobe works best when formality feels modern, efficient, and self-assured",
        ],
        tags: ["Urban", "Sharp", "Formal", "Professional"],
        exploreNext: [
            ["tailoring", "suits", "styles", "single_breasted"],
            ["tailoring", "suits", "use_case", "work"],
            ["fabrics", "suiting", "worsted_wool"],
            ["colour_wardrobe", "core_colours", "navy"],
        ],
    },
    n: {
        key: "n",
        name: "The Pattern Enthusiast",
        sub: "Confident Variation",
        desc: "You dress best when pattern is used with confidence and control — checks, stripes, and textured surfaces that add rhythm and individuality without tipping into excess.",
        notes: [
            "You are comfortable with visible pattern when it feels considered and well balanced",
            "You prefer variation that adds depth rather than noise",
            "Your wardrobe works best when pattern feels integrated into the whole, not pasted on for effect",
        ],
        tags: ["Pattern", "Expressive", "Layered", "Distinct"],
        exploreNext: [
            ["fabrics", "suiting", "summer_tweed"],
            ["colour_wardrobe", "texture_vs_colour"],
            ["tailoring", "shirts", "fabrics", "poplin"],
            ["fabrics", "suiting", "hopsack"],
        ],
    },
    d: {
        key: "d",
        name: "The Neo-Traditionalist",
        sub: "Modern Heritage",
        desc: "You dress best in traditional forms updated with clarity — classic tailoring, familiar menswear codes, and pieces that feel rooted in heritage but cut for present-day life rather than preserved unchanged.",
        notes: [
            "You trust classic references, but prefer them refined rather than rigidly traditional",
            "You want familiarity, but not heaviness or old-fashioned formality",
            "Your wardrobe works best when tradition is edited with ease, lightness, and modern proportion",
        ],
        tags: ["Traditional", "Updated", "Balanced", "Refined"],
        exploreNext: [
            ["tailoring", "suits", "styles", "single_breasted"],
            ["fabrics", "suiting", "fresco"],
            ["tailoring", "jackets", "details", "construction", "half_canvas"],
            ["about", "tropical_tailoring"],
        ],
    },
    y: {
        key: "y",
        name: "The Quiet Modernist",
        sub: "Understated Innovation",
        desc: "You dress best in modern wardrobes that stay calm — clean silhouettes, minimal finishing, and pieces that feel current through proportion, line, and subtle innovation rather than obvious trend.",
        notes: [
            "You prefer modernity that feels quiet rather than attention-seeking",
            "You are drawn to cleaner silhouettes and controlled restraint",
            "Your wardrobe works best when contemporary dressing feels natural, precise, and easy to live with",
        ],
        tags: ["Modern", "Clean", "Minimal", "Understated"],
        exploreNext: [
            ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            ["colour_wardrobe", "core_wardrobe_anchors"],
            ["tailoring", "shirts", "use_case", "smart_casual"],
            ["fabrics", "suiting", "high_twist_wool"],
        ],
    },
    z: {
        key: "z",
        name: "The Seasonal Purist",
        sub: "Weather-Led Dressing",
        desc: "You dress best when the wardrobe responds honestly to the season — lighter cloths in heat, richer textures in cooler months, and combinations that feel shaped by weather, atmosphere, and the rhythm of the year.",
        notes: [
            "You respond strongly to seasonal shifts in cloth, texture, and layering",
            "You prefer wardrobes that change with climate rather than staying visually flat all year",
            "Your style works best when dressing feels aligned with season, mood, and environment",
        ],
        tags: ["Seasonal", "Textural", "Classic", "Climate-Led"],
        exploreNext: [
            ["fabrics", "suiting", "fresco"],
            ["fabrics", "suiting", "worsted_wool"],
            ["colour_wardrobe", "layering_in_warm_climates"],
            ["fabrics", "suiting", "summer_tweed"],
        ],
    },
};

// ============================================
// ARCHETYPE QUIZ QUESTIONS
// ============================================

var archetypeQuestions = [
    {
        id: "climate",
        text: "What climate shapes the way you dress most often?",
        opts: [
            {
                a: "Tropical and humid year-round",
                b: "Tropical",
                s: {
                    c: 1,
                    m: 2,
                    g: 0,
                    q: 1,
                    a: 0,
                    u: 1,
                    t: 2,
                    s: 2,
                    r: 1,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 2,
                    h: 0,
                    l: 0,
                    x: 0,
                    p: 1,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 0,
                    d: 1,
                    y: 1,
                    z: 0,
                },
            },
            {
                a: "Warm, dry, and often sunny",
                b: "Warm & Dry",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 1,
                    a: 1,
                    u: 1,
                    t: 1,
                    s: 1,
                    r: 2,
                    e: 2,
                    v: 2,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 0,
                    x: 1,
                    p: 1,
                    k: 0,
                    w: 3,
                    f: 0,
                    n: 1,
                    d: 1,
                    y: 1,
                    z: 1,
                },
            },
            {
                a: "Temperate with changing seasons",
                b: "Temperate",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 1,
                    a: 2,
                    u: 0,
                    t: 0,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 0,
                    o: 1,
                    b: 0,
                    h: 2,
                    l: 3,
                    x: 1,
                    p: 0,
                    k: 1,
                    w: 0,
                    f: 1,
                    n: 2,
                    d: 2,
                    y: 1,
                    z: 3,
                },
            },
            {
                a: "Mostly indoors in strong air-conditioning",
                b: "Indoor Climate",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 2,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 0,
                    o: 1,
                    b: 1,
                    h: 1,
                    l: 0,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 0,
                    f: 2,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 0,
                },
            },
        ],
    },
    {
        id: "off_duty",
        text: "What kind of off-duty dressing feels most natural to you?",
        opts: [
            {
                a: "Relaxing in a quiet space",
                b: "Quiet Rest",
                s: {
                    c: 1,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 2,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 1,
                    e: 0,
                    v: 0,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 2,
                    p: 0,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 0,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Heading out on the move",
                b: "Active Day",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 1,
                    a: 1,
                    u: 2,
                    t: 0,
                    s: 2,
                    r: 1,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 1,
                    x: 0,
                    p: 3,
                    k: 0,
                    w: 2,
                    f: 1,
                    n: 1,
                    d: 1,
                    y: 1,
                    z: 0,
                },
            },
            {
                a: "Going out for food or art",
                b: "Out & About",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 1,
                    a: 2,
                    u: 0,
                    t: 2,
                    s: 0,
                    r: 2,
                    e: 2,
                    v: 1,
                    o: 2,
                    b: 1,
                    h: 2,
                    l: 2,
                    x: 1,
                    p: 0,
                    k: 2,
                    w: 1,
                    f: 1,
                    n: 2,
                    d: 2,
                    y: 1,
                    z: 1,
                },
            },
            {
                a: "Working on hobbies or crafts",
                b: "Making Things",
                s: {
                    c: 2,
                    m: 1,
                    g: 0,
                    q: 0,
                    a: 1,
                    u: 2,
                    t: 2,
                    s: 1,
                    r: 0,
                    e: 1,
                    v: 0,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 1,
                    d: 1,
                    y: 0,
                    z: 1,
                },
            },
        ],
    },
    {
        id: "garment_draw",
        text: "What draws you in first when a garment feels right?",
        opts: [
            {
                a: "The hand and feel of the cloth",
                b: "Cloth First",
                s: {
                    c: 2,
                    m: 0,
                    g: 1,
                    q: 1,
                    a: 2,
                    u: 2,
                    t: 2,
                    s: 0,
                    r: 0,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 2,
                    h: 1,
                    l: 2,
                    x: 2,
                    p: 1,
                    k: 1,
                    w: 1,
                    f: 1,
                    n: 2,
                    d: 2,
                    y: 1,
                    z: 2,
                },
            },
            {
                a: "The line and shape on the body",
                b: "Shape First",
                s: {
                    c: 1,
                    m: 2,
                    g: 1,
                    q: 0,
                    a: 2,
                    u: 0,
                    t: 1,
                    s: 1,
                    r: 2,
                    e: 2,
                    v: 1,
                    o: 2,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 2,
                    w: 2,
                    f: 2,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 0,
                },
            },
            {
                a: "The finishing and smaller details",
                b: "Detail First",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 0,
                    r: 1,
                    e: 2,
                    v: 0,
                    o: 2,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 0,
                    k: 1,
                    w: 0,
                    f: 1,
                    n: 1,
                    d: 2,
                    y: 1,
                    z: 1,
                },
            },
            {
                a: "How easily it works with what I own",
                b: "Wardrobe First",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 1,
                    u: 2,
                    t: 1,
                    s: 2,
                    r: 0,
                    e: 0,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 0,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
        ],
    },
    {
        id: "cloth_preference",
        text: "When cloth is the deciding factor, what kind of fabric character draws you in most?",
        opts: [
            {
                a: "Dry, crisp, and breathable",
                b: "Dry & Crisp",
                s: {
                    c: 2,
                    m: 0,
                    g: 1,
                    q: 1,
                    a: 0,
                    u: 2,
                    t: 2,
                    s: 0,
                    r: 0,
                    e: 0,
                    v: 1,
                    o: 0,
                    b: 2,
                    h: 1,
                    l: 2,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 0,
                    d: 1,
                    y: 0,
                    z: 4,
                },
            },
            {
                a: "Soft, fluid, and luxurious",
                b: "Soft & Fluid",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 1,
                    a: 1,
                    u: 0,
                    t: 0,
                    s: 1,
                    r: 2,
                    e: 2,
                    v: 1,
                    o: 2,
                    b: 0,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 0,
                    k: 2,
                    w: 1,
                    f: 0,
                    n: 1,
                    d: 0,
                    y: 1,
                    z: 0,
                },
            },
            {
                a: "Textured, irregular, and characterful",
                b: "Textured Character",
                s: {
                    c: 1,
                    m: 0,
                    g: 1,
                    q: 0,
                    a: 0,
                    u: 0,
                    t: 0,
                    s: 0,
                    r: 2,
                    e: 2,
                    v: 1,
                    o: 1,
                    b: 0,
                    h: 1,
                    l: 4,
                    x: 2,
                    p: 0,
                    k: 1,
                    w: 1,
                    f: 0,
                    n: 2,
                    d: 1,
                    y: 0,
                    z: 3,
                },
            },
            {
                a: "Balanced — I want cloth that simply works well",
                b: "Balanced Cloth",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 1,
                    a: 1,
                    u: 2,
                    t: 2,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 0,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 0,
                    p: 2,
                    k: 0,
                    w: 0,
                    f: 1,
                    n: 0,
                    d: 1,
                    y: 1,
                    z: 1,
                },
            },
        ],
    },

    {
        id: "silhouette_preference",
        text: "When shape matters most, what kind of silhouette feels most like you?",
        opts: [
            {
                a: "Sharp and structured",
                b: "Sharp Structure",
                s: {
                    c: 1,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 2,
                    u: 0,
                    t: 1,
                    s: 0,
                    r: 0,
                    e: 1,
                    v: 0,
                    o: 2,
                    b: 1,
                    h: 1,
                    l: 0,
                    x: 0,
                    p: 0,
                    k: 2,
                    w: 0,
                    f: 3,
                    n: 0,
                    d: 1,
                    y: 1,
                    z: 0,
                },
            },
            {
                a: "Soft and relaxed",
                b: "Soft Relaxed",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 1,
                    a: 0,
                    u: 1,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 2,
                    o: 0,
                    b: 0,
                    h: 0,
                    l: 2,
                    x: 0,
                    p: 1,
                    k: 0,
                    w: 2,
                    f: 0,
                    n: 0,
                    d: 0,
                    y: 1,
                    z: 1,
                },
            },
            {
                a: "Clean and minimal",
                b: "Clean Minimal",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 0,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 0,
                    f: 1,
                    n: 0,
                    d: 0,
                    y: 3,
                    z: 0,
                },
            },
            {
                a: "Balanced — refined, but not too rigid",
                b: "Balanced Shape",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 1,
                    a: 1,
                    u: 1,
                    t: 1,
                    s: 1,
                    r: 1,
                    e: 1,
                    v: 1,
                    o: 1,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 1,
                    f: 1,
                    n: 1,
                    d: 2,
                    y: 1,
                    z: 1,
                },
            },
        ],
    },

    {
        id: "detail_preference",
        text: "When details matter most, what kind of finishing feels right to you?",
        opts: [
            {
                a: "Quiet artisanal details you notice over time",
                b: "Quiet Craft",
                s: {
                    c: 2,
                    m: 0,
                    g: 1,
                    q: 1,
                    a: 1,
                    u: 0,
                    t: 1,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 0,
                    o: 1,
                    b: 1,
                    h: 3,
                    l: 0,
                    x: 1,
                    p: 0,
                    k: 0,
                    w: 0,
                    f: 0,
                    n: 1,
                    d: 3,
                    y: 1,
                    z: 1,
                },
            },
            {
                a: "Functional details that improve real wear",
                b: "Functional Detail",
                s: {
                    c: 1,
                    m: 1,
                    g: 0,
                    q: 0,
                    a: 1,
                    u: 2,
                    t: 2,
                    s: 0,
                    r: 0,
                    e: 0,
                    v: 0,
                    o: 0,
                    b: 1,
                    h: 0,
                    l: 1,
                    x: 0,
                    p: 2,
                    k: 0,
                    w: 0,
                    f: 1,
                    n: 0,
                    d: 1,
                    y: 1,
                    z: 1,
                },
            },
            {
                a: "Clean finishing with almost nothing extra",
                b: "Minimal Finish",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 0,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 0,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 0,
                    f: 1,
                    n: 0,
                    d: 0,
                    y: 3,
                    z: 0,
                },
            },
            {
                a: "A little flourish, as long as it stays elegant",
                b: "Controlled Flourish",
                s: {
                    c: 0,
                    m: 1,
                    g: 1,
                    q: 0,
                    a: 1,
                    u: 0,
                    t: 0,
                    s: 0,
                    r: 1,
                    e: 2,
                    v: 0,
                    o: 2,
                    b: 0,
                    h: 1,
                    l: 0,
                    x: 0,
                    p: 0,
                    k: 2,
                    w: 0,
                    f: 0,
                    n: 2,
                    d: 0,
                    y: 0,
                    z: 0,
                },
            },
        ],
    },

    {
        id: "wardrobe_building_preference",
        text: "When wardrobe logic matters most, how do you prefer to build?",
        opts: [
            {
                a: "Start with versatile anchors I can wear often",
                b: "Versatile Anchors",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 2,
                    a: 0,
                    u: 2,
                    t: 1,
                    s: 2,
                    r: 0,
                    e: 0,
                    v: 1,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 4,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 0,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Build around a few strong classic foundations",
                b: "Classic Foundations",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 1,
                    a: 1,
                    u: 1,
                    t: 1,
                    s: 0,
                    r: 1,
                    e: 0,
                    v: 0,
                    o: 1,
                    b: 2,
                    h: 2,
                    l: 1,
                    x: 0,
                    p: 0,
                    k: 0,
                    w: 0,
                    f: 1,
                    n: 0,
                    d: 2,
                    y: 0,
                    z: 2,
                },
            },
            {
                a: "Use texture and variation to keep things interesting",
                b: "Texture Variation",
                s: {
                    c: 1,
                    m: 0,
                    g: 0,
                    q: 0,
                    a: 0,
                    u: 0,
                    t: 0,
                    s: 0,
                    r: 2,
                    e: 2,
                    v: 0,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 4,
                    x: 2,
                    p: 0,
                    k: 1,
                    w: 0,
                    f: 0,
                    n: 2,
                    d: 0,
                    y: 0,
                    z: 2,
                },
            },
            {
                a: "Keep things streamlined and easy to combine",
                b: "Streamlined Wardrobe",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 1,
                    u: 2,
                    t: 1,
                    s: 2,
                    r: 0,
                    e: 0,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 0,
                    l: 1,
                    x: 1,
                    p: 4,
                    k: 0,
                    w: 1,
                    f: 0,
                    n: 0,
                    d: 0,
                    y: 2,
                    z: 0,
                },
            },
        ],
    },

    {
        id: "wardrobe_priority",
        text: "What matters most when building your wardrobe?",
        opts: [
            {
                a: "Pieces that hold up beautifully over time",
                b: "Longevity",
                s: {
                    c: 2,
                    m: 0,
                    g: 1,
                    q: 2,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 1,
                    e: 0,
                    v: 0,
                    o: 0,
                    b: 2,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 0,
                    w: 0,
                    f: 1,
                    n: 1,
                    d: 2,
                    y: 1,
                    z: 2,
                },
            },
            {
                a: "Flexibility across different occasions",
                b: "Versatility",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 2,
                    a: 0,
                    u: 2,
                    t: 0,
                    s: 2,
                    r: 1,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 2,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "A sense of heritage and lasting style",
                b: "Heritage",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 0,
                    r: 2,
                    e: 2,
                    v: 0,
                    o: 1,
                    b: 1,
                    h: 3,
                    l: 1,
                    x: 1,
                    p: 0,
                    k: 1,
                    w: 0,
                    f: 1,
                    n: 2,
                    d: 3,
                    y: 0,
                    z: 2,
                },
            },
            {
                a: "Ease without having to overthink it",
                b: "Ease",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 0,
                    a: 1,
                    u: 1,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 2,
                    v: 2,
                    o: 0,
                    b: 0,
                    h: 0,
                    l: 1,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 3,
                    f: 0,
                    n: 1,
                    d: 0,
                    y: 2,
                    z: 0,
                },
            },
        ],
    },
    {
        id: "polished_dressing",
        text: "When you want to look more put together, what feels most like you?",
        opts: [
            {
                a: "A classic suit with clear structure",
                b: "Structured",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 1,
                    u: 0,
                    t: 2,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 0,
                    o: 1,
                    b: 2,
                    h: 2,
                    l: 0,
                    x: 0,
                    p: 0,
                    k: 1,
                    w: 0,
                    f: 2,
                    n: 1,
                    d: 2,
                    y: 0,
                    z: 1,
                },
            },
            {
                a: "Tailored trousers with an easy jacket",
                b: "Relaxed Tailoring",
                s: {
                    c: 1,
                    m: 2,
                    g: 1,
                    q: 1,
                    a: 0,
                    u: 2,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 2,
                    x: 1,
                    p: 1,
                    k: 0,
                    w: 2,
                    f: 1,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Clean lines with very little fuss",
                b: "Minimal",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 0,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 0,
                    d: 0,
                    y: 3,
                    z: 0,
                },
            },
            {
                a: "A classic base with one thoughtful twist",
                b: "Considered Contrast",
                s: {
                    c: 1,
                    m: 2,
                    g: 1,
                    q: 0,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 2,
                    r: 1,
                    e: 2,
                    v: 1,
                    o: 1,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 1,
                    f: 1,
                    n: 2,
                    d: 1,
                    y: 1,
                    z: 1,
                },
            },
        ],
    },
    {
        id: "polished_dressing_warm",
        text: "In a warmer climate, what kind of polished dressing feels most natural to you?",
        opts: [
            {
                a: "A softly structured suit",
                b: "Soft Suiting",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 1,
                    u: 0,
                    t: 2,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 2,
                    h: 1,
                    l: 0,
                    x: 0,
                    p: 0,
                    k: 1,
                    w: 1,
                    f: 2,
                    n: 1,
                    d: 2,
                    y: 0,
                    z: 1,
                },
            },
            {
                a: "Tailored trousers with an easy jacket",
                b: "Relaxed Tailoring",
                s: {
                    c: 1,
                    m: 2,
                    g: 1,
                    q: 1,
                    a: 0,
                    u: 2,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 2,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 3,
                    f: 0,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 0,
                },
            },
            {
                a: "Clean lines with very little fuss",
                b: "Minimal",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 0,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 0,
                    d: 0,
                    y: 3,
                    z: 0,
                },
            },
            {
                a: "A classic base with one thoughtful twist",
                b: "Considered Contrast",
                s: {
                    c: 1,
                    m: 2,
                    g: 1,
                    q: 0,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 2,
                    r: 1,
                    e: 2,
                    v: 1,
                    o: 1,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 1,
                    f: 1,
                    n: 2,
                    d: 1,
                    y: 1,
                    z: 1,
                },
            },
        ],
    },
    {
        id: "polished_dressing_temperate",
        text: "When dressing across changing seasons, what feels most like you?",
        opts: [
            {
                a: "A classic suit with clear structure",
                b: "Structured",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 1,
                    u: 0,
                    t: 2,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 0,
                    o: 2,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 0,
                    p: 0,
                    k: 2,
                    w: 0,
                    f: 2,
                    n: 1,
                    d: 2,
                    y: 0,
                    z: 2,
                },
            },
            {
                a: "Layered tailoring with relaxed balance",
                b: "Layered Tailoring",
                s: {
                    c: 1,
                    m: 2,
                    g: 1,
                    q: 1,
                    a: 0,
                    u: 2,
                    t: 1,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 0,
                    o: 1,
                    b: 0,
                    h: 2,
                    l: 3,
                    x: 1,
                    p: 1,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 2,
                    d: 2,
                    y: 1,
                    z: 3,
                },
            },
            {
                a: "Clean lines with very little fuss",
                b: "Minimal",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 0,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 0,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 0,
                    f: 1,
                    n: 0,
                    d: 0,
                    y: 3,
                    z: 0,
                },
            },
            {
                a: "A classic base with one thoughtful twist",
                b: "Considered Contrast",
                s: {
                    c: 1,
                    m: 2,
                    g: 1,
                    q: 0,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 2,
                    r: 1,
                    e: 2,
                    v: 0,
                    o: 2,
                    b: 1,
                    h: 2,
                    l: 2,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 0,
                    f: 1,
                    n: 2,
                    d: 2,
                    y: 1,
                    z: 2,
                },
            },
        ],
    },
    {
        id: "wardrobe_role",
        text: "At its best, what should your wardrobe do for you?",
        opts: [
            {
                a: "Make me feel composed and assured",
                b: "Composure",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 1,
                    a: 2,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 1,
                    e: 2,
                    v: 0,
                    o: 2,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 2,
                    w: 1,
                    f: 2,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Give me confidence in the quality",
                b: "Quality",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 0,
                    o: 1,
                    b: 2,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 0,
                    f: 1,
                    n: 1,
                    d: 2,
                    y: 1,
                    z: 2,
                },
            },
            {
                a: "Keep me comfortable all day",
                b: "Comfort",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 2,
                    a: 0,
                    u: 2,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 2,
                    o: 0,
                    b: 0,
                    h: 0,
                    l: 1,
                    x: 1,
                    p: 3,
                    k: 0,
                    w: 3,
                    f: 0,
                    n: 1,
                    d: 0,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Help me look consistently well put together",
                b: "Consistency",
                s: {
                    c: 2,
                    m: 0,
                    g: 1,
                    q: 2,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 1,
                    o: 1,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 1,
                    f: 2,
                    n: 1,
                    d: 2,
                    y: 2,
                    z: 1,
                },
            },
        ],
    },
    {
        id: "wardrobe_role_longevity",
        text: "At its best, what should a lasting wardrobe give you?",
        opts: [
            {
                a: "Confidence in its quality and build",
                b: "Quality",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 0,
                    o: 1,
                    b: 2,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 0,
                    f: 1,
                    n: 1,
                    d: 2,
                    y: 1,
                    z: 2,
                },
            },
            {
                a: "A sense of composure and assurance",
                b: "Composure",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 1,
                    a: 2,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 1,
                    e: 2,
                    v: 0,
                    o: 1,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 1,
                    f: 2,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Consistency over many years of wear",
                b: "Consistency",
                s: {
                    c: 2,
                    m: 0,
                    g: 1,
                    q: 2,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 0,
                    o: 0,
                    b: 2,
                    h: 2,
                    l: 1,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 0,
                    f: 1,
                    n: 1,
                    d: 2,
                    y: 2,
                    z: 2,
                },
            },
            {
                a: "Comfort that still feels well made",
                b: "Comfort",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 2,
                    a: 0,
                    u: 2,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 2,
                    f: 0,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
        ],
    },
    {
        id: "wardrobe_role_versatility",
        text: "At its best, what should a flexible wardrobe do for you?",
        opts: [
            {
                a: "Move easily across different settings",
                b: "Adaptability",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 2,
                    a: 0,
                    u: 2,
                    t: 1,
                    s: 2,
                    r: 1,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 4,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 2,
                    f: 1,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 2,
                },
            },
            {
                a: "Keep you comfortable all day",
                b: "Comfort",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 2,
                    a: 0,
                    u: 2,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 0,
                    l: 1,
                    x: 1,
                    p: 3,
                    k: 0,
                    w: 3,
                    f: 0,
                    n: 1,
                    d: 0,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Help you look consistently well put together",
                b: "Consistency",
                s: {
                    c: 2,
                    m: 0,
                    g: 1,
                    q: 2,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 0,
                    o: 1,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 1,
                    f: 2,
                    n: 1,
                    d: 2,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Give you confidence without overthinking",
                b: "Ease",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 1,
                    a: 1,
                    u: 1,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 0,
                    l: 1,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 2,
                    f: 1,
                    n: 1,
                    d: 0,
                    y: 2,
                    z: 0,
                },
            },
        ],
    },

    {
        id: "wardrobe_role_heritage",
        text: "At its best, what should a timeless wardrobe do for you?",
        opts: [
            {
                a: "Make you feel composed and assured",
                b: "Composure",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 1,
                    a: 2,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 1,
                    e: 2,
                    v: 0,
                    o: 1,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 1,
                    f: 2,
                    n: 1,
                    d: 2,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Connect you to enduring style and tradition",
                b: "Tradition",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 2,
                    u: 1,
                    t: 1,
                    s: 0,
                    r: 2,
                    e: 2,
                    v: 0,
                    o: 2,
                    b: 2,
                    h: 3,
                    l: 1,
                    x: 1,
                    p: 0,
                    k: 1,
                    w: 0,
                    f: 1,
                    n: 2,
                    d: 3,
                    y: 0,
                    z: 2,
                },
            },
            {
                a: "Give you confidence in the quality",
                b: "Quality",
                s: {
                    c: 2,
                    m: 0,
                    g: 2,
                    q: 0,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 0,
                    r: 1,
                    e: 1,
                    v: 0,
                    o: 1,
                    b: 2,
                    h: 2,
                    l: 1,
                    x: 1,
                    p: 1,
                    k: 1,
                    w: 0,
                    f: 1,
                    n: 1,
                    d: 2,
                    y: 1,
                    z: 2,
                },
            },
            {
                a: "Help you look consistently well put together",
                b: "Consistency",
                s: {
                    c: 2,
                    m: 0,
                    g: 1,
                    q: 2,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 0,
                    e: 0,
                    v: 0,
                    o: 1,
                    b: 1,
                    h: 2,
                    l: 1,
                    x: 2,
                    p: 1,
                    k: 1,
                    w: 1,
                    f: 2,
                    n: 1,
                    d: 2,
                    y: 2,
                    z: 2,
                },
            },
        ],
    },
    {
        id: "wardrobe_role_ease",
        text: "At its best, what should an easy wardrobe do for you?",
        opts: [
            {
                a: "Keep you comfortable all day",
                b: "Comfort",
                s: {
                    c: 0,
                    m: 2,
                    g: 0,
                    q: 2,
                    a: 0,
                    u: 2,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 0,
                    h: 0,
                    l: 1,
                    x: 1,
                    p: 3,
                    k: 0,
                    w: 3,
                    f: 0,
                    n: 1,
                    d: 0,
                    y: 2,
                    z: 1,
                },
            },
            {
                a: "Help you feel quietly composed",
                b: "Composure",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 1,
                    a: 2,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 1,
                    e: 2,
                    v: 0,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 2,
                    p: 1,
                    k: 0,
                    w: 1,
                    f: 1,
                    n: 1,
                    d: 1,
                    y: 3,
                    z: 1,
                },
            },
            {
                a: "Make getting dressed feel effortless",
                b: "Ease",
                s: {
                    c: 0,
                    m: 1,
                    g: 0,
                    q: 2,
                    a: 0,
                    u: 1,
                    t: 0,
                    s: 2,
                    r: 2,
                    e: 2,
                    v: 2,
                    o: 0,
                    b: 0,
                    h: 0,
                    l: 1,
                    x: 1,
                    p: 2,
                    k: 0,
                    w: 3,
                    f: 0,
                    n: 1,
                    d: 0,
                    y: 2,
                    z: 0,
                },
            },
            {
                a: "Still give you confidence in how you look",
                b: "Confidence",
                s: {
                    c: 1,
                    m: 1,
                    g: 1,
                    q: 1,
                    a: 1,
                    u: 1,
                    t: 2,
                    s: 1,
                    r: 1,
                    e: 1,
                    v: 1,
                    o: 0,
                    b: 1,
                    h: 1,
                    l: 1,
                    x: 1,
                    p: 2,
                    k: 1,
                    w: 2,
                    f: 1,
                    n: 1,
                    d: 1,
                    y: 2,
                    z: 1,
                },
            },
        ],
    },
];

// ============================================
// FIT OPTIONS FOR ONBOARDING
// ============================================

var archetypeFitOptions = {
    "Everyday Essentials": [
        { text: "Relaxed and easy", val: "Relaxed Fit" },
        { text: "Clean and close-cut", val: "Tapered Cut" },
        { text: "Open to guidance", val: "Adaptive Fit" },
    ],
    "Business Attire": [
        { text: "Classic tailored structure", val: "Classic Structure" },
        { text: "Softer modern tailoring", val: "Slim Tailored" },
        { text: "Guide me through it", val: "Studio Choice" },
    ],
    "Smart-Casual": [
        { text: "Relaxed soft layers", val: "Unstructured Relaxed" },
        { text: "Clean tailored casual", val: "Tailored Casual" },
        { text: "Comfort first", val: "Comfort First" },
    ],
    "Milestone Event": [
        { text: "Sharp and structured", val: "Sharp Custom" },
        { text: "Modern and easy", val: "Modern Formal" },
        { text: "Help me decide", val: "Evaluative Fit" },
    ],
    "Open / Unsure": [
        { text: "More directional shapes", val: "Experimental Cuts" },
        { text: "Timeless proportions", val: "Timeless Cuts" },
        { text: "Completely open", val: "Open Testing" },
    ],
};
// ============================================
// SCORING + ARCHETYPE HELPERS
// ============================================
function getGarmentDrawLabel() {
    if (
        appState.quizAnswersById &&
        appState.quizAnswersById["garment_draw"] !== null &&
        appState.quizAnswersById["garment_draw"] !== undefined
    ) {
        var questionMap = getArchetypeQuestionMap();
        var garmentQuestion = questionMap["garment_draw"];
        var answerIndex = appState.quizAnswersById["garment_draw"];

        if (
            garmentQuestion &&
            garmentQuestion.opts &&
            garmentQuestion.opts[answerIndex]
        ) {
            return garmentQuestion.opts[answerIndex].b;
        }
    }

    return "";
}
function syncQuizAnswersFromPath() {
    var path = getCurrentQuizPath();
    var synced = Array(path.length).fill(null);

    for (var i = 0; i < path.length; i++) {
        var questionId = path[i];
        if (
            appState.quizAnswersById &&
            appState.quizAnswersById[questionId] !== undefined &&
            appState.quizAnswersById[questionId] !== null
        ) {
            synced[i] = appState.quizAnswersById[questionId];
        }
    }

    appState.quizAnswers = synced;
}
function applyOnboardingArchetypeAdjustments(scores) {
    var adjusted = {
        c: scores.c || 0,
        m: scores.m || 0,
        g: scores.g || 0,
        q: scores.q || 0,
        a: scores.a || 0,
        u: scores.u || 0,
        t: scores.t || 0,
        s: scores.s || 0,
        r: scores.r || 0,
        e: scores.e || 0,
        v: scores.v || 0,
        o: scores.o || 0,
        b: scores.b || 0,
        h: scores.h || 0,
        l: scores.l || 0,
        x: scores.x || 0,
        p: scores.p || 0,
        k: scores.k || 0,
        w: scores.w || 0,
        f: scores.f || 0,
        n: scores.n || 0,
        d: scores.d || 0,
        y: scores.y || 0,
        z: scores.z || 0,
    };

    var original = {
        c: scores.c || 0,
        m: scores.m || 0,
        g: scores.g || 0,
        q: scores.q || 0,
        a: scores.a || 0,
        u: scores.u || 0,
        t: scores.t || 0,
        s: scores.s || 0,
        r: scores.r || 0,
        e: scores.e || 0,
        v: scores.v || 0,
        o: scores.o || 0,
        b: scores.b || 0,
        h: scores.h || 0,
        l: scores.l || 0,
        x: scores.x || 0,
        p: scores.p || 0,
        k: scores.k || 0,
        w: scores.w || 0,
        f: scores.f || 0,
        n: scores.n || 0,
        d: scores.d || 0,
        y: scores.y || 0,
        z: scores.z || 0,
    };

    if (appState.selClimate === "Warm & Dry") {
        adjusted.v += 1;
        adjusted.r += 1;
        adjusted.w += 2;
    } else if (appState.selClimate === "Tropical") {
        adjusted.v += 1;
        adjusted.t += 1;
        adjusted.b += 2;
        adjusted.w += 1;
        adjusted.p += 1;
    } else if (appState.selClimate === "Indoor Climate") {
        adjusted.t += 1;
        adjusted.q += 1;
        adjusted.f += 2;
        adjusted.d += 1;
        adjusted.y += 1;
    } else if (appState.selClimate === "Temperate") {
        adjusted.o += 1;
        adjusted.g += 1;
        adjusted.l += 2;
        adjusted.z += 2;
        adjusted.h += 1;
    }

    if (appState.selFocus === "Business Attire") {
        adjusted.t += 1;
        adjusted.g += 1;
        adjusted.o += 1;
        adjusted.c += 1;
        adjusted.f += 2;
        adjusted.b += 2;
        adjusted.d += 1;
    } else if (appState.selFocus === "Smart-Casual") {
        adjusted.m += 1;
        adjusted.r += 1;
        adjusted.p += 2;
        adjusted.y += 1;
        adjusted.l += 1;
        adjusted.w += 1;
    } else if (appState.selFocus === "Milestone Event") {
        adjusted.g += 1;
        adjusted.o += 2;
        adjusted.a += 1;
        adjusted.k += 2;
    } else if (appState.selFocus === "Everyday Essentials") {
        adjusted.m += 1;
        adjusted.u += 1;
        adjusted.p += 2;
        adjusted.w += 1;
    }

    if (appState.selFit === "Slim Tailored") {
        adjusted.a += 1;
        adjusted.t += 1;
        adjusted.f += 1;
        adjusted.y += 1;
    } else if (appState.selFit === "Classic Structure") {
        adjusted.c += 1;
        adjusted.g += 1;
        adjusted.b += 1;
        adjusted.h += 1;
        adjusted.d += 1;
    } else if (appState.selFit === "Unstructured Relaxed") {
        adjusted.r += 1;
        adjusted.w += 1;
        adjusted.p += 1;
        adjusted.l += 1;
    } else if (appState.selFit === "Tailored Casual") {
        adjusted.m += 1;
        adjusted.r += 1;
        adjusted.y += 1;
        adjusted.p += 1;
    } else if (appState.selFit === "Tapered Cut") {
        adjusted.a += 1;
        adjusted.y += 1;
    }

    if (appState.selPalette === "Riviera Light") {
        adjusted.v += 2;
        adjusted.w += 2;
        adjusted.q += 1;
        adjusted.s += 1;
    } else if (appState.selPalette === "Earth & Olive") {
        adjusted.r += 1;
        adjusted.e += 1;
        adjusted.w += 1;
        adjusted.d += 1;
        adjusted.b += 1;
    } else if (appState.selPalette === "Navy & Stone") {
        adjusted.t += 1;
        adjusted.g += 1;
        adjusted.f += 2;
        adjusted.b += 2;
    } else if (appState.selPalette === "Soft Neutrals") {
        adjusted.q += 2;
        adjusted.x += 2;
        adjusted.y += 2;
        adjusted.s += 1;
    } else if (appState.selPalette === "City Greys") {
        adjusted.q += 2;
        adjusted.a += 1;
        adjusted.x += 2;
        adjusted.y += 2;
        adjusted.f += 1;
    } else if (appState.selPalette === "Heritage Browns") {
        adjusted.g += 1;
        adjusted.h += 2;
        adjusted.d += 2;
        adjusted.z += 2;
        adjusted.r += 1;
        adjusted.l += 1;
    } else if (appState.selPalette === "Deep Colour") {
        adjusted.o += 1;
        adjusted.e += 1;
        adjusted.g += 1;
        adjusted.k += 2;
        adjusted.n += 1;
    } else if (appState.selPalette === "Expressive Colour") {
        adjusted.e += 2;
        adjusted.n += 2;
        adjusted.k += 1;
        adjusted.v += 1;
    }

    if (appState.selColourUse === "Mostly neutrals") {
        adjusted.q += 1;
        adjusted.x += 1;
        adjusted.y += 1;
        adjusted.z += 1;
    } else if (appState.selColourUse === "One accent colour") {
        adjusted.r += 1;
        adjusted.e += 1;
        adjusted.h += 1;
        adjusted.l += 1;
    } else if (appState.selColourUse === "More playful colour") {
        adjusted.e += 1;
        adjusted.o += 1;
        adjusted.k += 1;
        adjusted.n += 2;
    }

    for (var key in adjusted) {
        var adjustmentAmount = adjusted[key] - original[key];
        if (adjustmentAmount > 4) {
            adjusted[key] = original[key] + 4;
        }
    }

    return adjusted;
}

function getWardrobePriorityLabel() {
    if (
        appState.quizAnswersById &&
        appState.quizAnswersById["wardrobe_priority"] !== null &&
        appState.quizAnswersById["wardrobe_priority"] !== undefined
    ) {
        var priorityQuestionMap = getArchetypeQuestionMap();
        var priorityQuestion = priorityQuestionMap["wardrobe_priority"];
        var answerIndex = appState.quizAnswersById["wardrobe_priority"];

        if (
            priorityQuestion &&
            priorityQuestion.opts &&
            priorityQuestion.opts[answerIndex]
        ) {
            return priorityQuestion.opts[answerIndex].b;
        }
    }
    return "";
}

function getPaletteNote(palette) {
    if (palette === "Earth & Olive") {
        return "Ground your wardrobe in olive, sand, tobacco, and terracotta for warmth and natural depth.";
    } else if (palette === "Riviera Light") {
        return "Build around stone, cream, soft blue, and warm taupe for a lighter palette that still feels refined and composed.";
    } else if (palette === "Heritage Browns") {
        return "Lean into brown, tobacco, olive, and deep moss for richness, texture, and a more grounded classic wardrobe.";
    } else if (palette === "City Greys") {
        return "Use tonal contrast, texture, and clean silhouettes to keep a grey-led wardrobe sharp, modern, and controlled.";
    } else if (palette === "Deep Colour") {
        return "Use richer tones like burgundy, forest, navy, and dark chocolate to create depth without losing polish.";
    } else if (palette === "Navy & Stone") {
        return "Build around navy, slate, and soft stone to keep the wardrobe versatile, polished, and easy to extend.";
    } else if (palette === "Soft Neutrals") {
        return "Keep the wardrobe tonal and quiet with oat, stone, mushroom, and soft grey, using texture to create depth.";
    } else if (palette === "Expressive Colour") {
        return "Introduce colour with control through softer but more distinctive accents that keep the wardrobe expressive without becoming loud.";
    } else if (palette === "Open / Unsure") {
        return "Start with dependable anchors first, then build outward once your strongest colours become clearer.";
    }

    return "";
}

function getStaffSummary(archetype, climateLabel, palette, colourUse) {
    var garmentDrawLabel = getGarmentDrawLabel();
    var base = "";

    if (!archetype) return "";

    if (archetype.key === "s") {
        base = "Start with soft tailoring, easy silhouettes, and calm colour.";
    } else if (archetype.key === "c") {
        base =
            "Lead with cloth quality, structure, and long-term wardrobe anchors.";
    } else if (archetype.key === "q") {
        base = "Keep the wardrobe clean, tonal, and quietly refined.";
    } else if (archetype.key === "r") {
        base = "Build through texture, softness, and relaxed elegance.";
    } else if (archetype.key === "t") {
        base = "Focus on breathable performance and polished versatility.";
    } else if (archetype.key === "g") {
        base = "Begin with timeless tailoring and balanced formal foundations.";
    } else if (archetype.key === "m") {
        base =
            "Prioritise flexible pieces that stay polished without feeling rigid.";
    } else if (archetype.key === "u") {
        base = "Choose resilient, useful pieces that work across settings.";
    } else if (archetype.key === "a") {
        base = "Emphasise line, shape, and clean modern structure.";
    } else if (archetype.key === "e") {
        base = "Use texture, contrast, and controlled variation to build interest.";
    } else if (archetype.key === "v") {
        base =
            "Lean into effortless warm-weather elegance, light palettes, and soft drape.";
    } else if (archetype.key === "o") {
        base =
            "Present sharper, elevated options meant for specific, meaningful occasions.";
    } else if (archetype.key === "b") {
        base =
            "Start with breathable tropical suiting in classic cuts — fresco, high-twist wool, structured but light.";
    } else if (archetype.key === "h") {
        base =
            "Show timeless pieces with modern refinement — updated proportions in heritage fabrics.";
    } else if (archetype.key === "l") {
        base =
            "Build through layering — varied cloth weights, odd jackets, seasonal adaptability.";
    } else if (archetype.key === "x") {
        base =
            "Lead with texture over colour — monochrome with rich fabric character.";
    } else if (archetype.key === "p") {
        base =
            "Show technical casual pieces — performance fabrics in relaxed, polished silhouettes.";
    } else if (archetype.key === "k") {
        base =
            "Present statement occasion pieces — bold colours, double-breasted cuts, confident formality.";
    } else if (archetype.key === "w") {
        base =
            "Lead with coastal ease — linen, open collars, sun-washed neutrals, relaxed elegance.";
    } else if (archetype.key === "f") {
        base =
            "Focus on sharp urban suiting — crisp lines, modern formality, city-ready polish.";
    } else if (archetype.key === "n") {
        base =
            "Introduce controlled pattern — checks, stripes, textured weaves with confidence.";
    } else if (archetype.key === "d") {
        base =
            "Show updated traditional codes — classic silhouettes in modern, lighter materials.";
    } else if (archetype.key === "y") {
        base =
            "Present modern minimal tailoring — clean cuts, subtle innovation, understated refinement.";
    } else if (archetype.key === "z") {
        base =
            "Build seasonal variation — distinct weights, true climate response, weather-led dressing.";
    }

    if (garmentDrawLabel === "Cloth First") {
        return (
            base +
            " Lead with cloth handle, texture, and climate-appropriate fabric choices first."
        );
    } else if (garmentDrawLabel === "Shape First") {
        return (
            base +
            " Prioritise silhouette, proportion, and how the garment frames the body."
        );
    } else if (garmentDrawLabel === "Detail First") {
        return (
            base +
            " Use finishing, construction, and smaller design details to sharpen the recommendation."
        );
    } else if (garmentDrawLabel === "Wardrobe First") {
        return (
            base +
            " Keep the recommendation modular, versatile, and easy to integrate into what they already own."
        );
    }

    return base;
}

function getResultDescription(
    archetype,
    climateLabel,
    palette,
    wardrobePriority
) {
    var garmentDrawLabel = getGarmentDrawLabel();

    if (!archetype) return "";

    if (archetype.key === "s" && climateLabel === "Tropical") {
        return "You look best in easy, modern casual outfits shaped for heat and movement — soft jackets, relaxed shoulders, and refined separates that stay light in tropical conditions.";
    } else if (archetype.key === "s" && climateLabel === "Temperate") {
        return "You look best in easy, modern casual outfits with clean restraint — soft jackets, relaxed shoulders, and refined separates that layer naturally across the seasons.";
    } else if (archetype.key === "q" && palette === "City Greys") {
        return "You are drawn to understated dressing built on tonal clarity, clean lines, and quality that speaks softly rather than loudly.";
    } else if (archetype.key === "r" && palette === "Earth & Olive") {
        return "You dress best in soft tailoring, rich texture, and warmer grounded tones that feel elegant, natural, and entirely unforced.";
    } else if (archetype.key === "e" && palette === "Expressive Colour") {
        return "You enjoy wardrobes with nuance and personality — mixing texture, tonal contrast, and controlled colour in a way that feels fresh and considered.";
    } else if (archetype.key === "t" && climateLabel === "Indoor Climate") {
        return "You want tailoring that performs through modern city life — light enough for movement, polished enough for long days, and adaptable between air-conditioning and outdoor heat.";
    } else if (archetype.key === "c" && wardrobePriority === "Longevity") {
        return "You value garments with integrity — strong cloth, thoughtful construction, and pieces chosen to hold their shape and relevance over time.";
    } else if (archetype.key === "m" && wardrobePriority === "Versatility") {
        return "You dress best in pieces that move easily across different settings — modern, flexible, and polished without ever feeling overworked.";
    } else if (archetype.key === "g" && wardrobePriority === "Heritage") {
        return "You are most at home in classic menswear codes — balanced tailoring, timeless references, and a wardrobe shaped by lasting style.";
    } else if (archetype.key === "s" && wardrobePriority === "Ease") {
        return "You dress best in modern casual pieces that feel light, calm, and easy to wear — clean, relaxed, and quietly current.";
    }

    if (archetype.key === "b" && climateLabel === "Tropical") {
        return "You dress best in classic tailoring adapted intelligently for heat — breathable suiting, cleaner structure, and timeless menswear forms refined for tropical life rather than borrowed unchanged from colder traditions.";
    } else if (archetype.key === "w" && climateLabel === "Warm & Dry") {
        return "You look best in warm-weather pieces that feel open, light, and naturally polished — relaxed tailoring, sun-washed tones, and silhouettes shaped by ease rather than force.";
    } else if (archetype.key === "f" && climateLabel === "Indoor Climate") {
        return "You dress best in sharper city tailoring that stays composed indoors — clean suiting, disciplined lines, and a wardrobe that feels polished enough for professional life without becoming stiff.";
    } else if (archetype.key === "l" && climateLabel === "Temperate") {
        return "You dress best through composition — layering cloth, proportion, and seasonal variation in a way that feels adaptive, rich, and quietly intelligent across changing conditions.";
    } else if (archetype.key === "z" && climateLabel === "Temperate") {
        return "You dress best when the wardrobe responds honestly to the season — lighter cloths in warmth, richer texture in cooler months, and combinations shaped by weather rather than habit.";
    } else if (archetype.key === "x" && palette === "Soft Neutrals") {
        return "You dress best in restrained tonal wardrobes enriched by cloth character — soft neutrals, tactile depth, and fabric surfaces that create richness without obvious display.";
    } else if (archetype.key === "y" && palette === "City Greys") {
        return "You prefer modern wardrobes that stay calm — clean silhouettes, minimal finishing, and pieces that feel current through line and proportion rather than trend or decoration.";
    } else if (archetype.key === "h" && palette === "Heritage Browns") {
        return "You dress best in classic menswear codes refined for modern life — heritage references, balanced tailoring, and pieces that feel rooted in tradition but edited with enough clarity to remain current.";
    } else if (archetype.key === "k" && palette === "Deep Colour") {
        return "You are at your best when occasion dressing carries real presence — stronger shape, richer colour, and pieces that feel elevated enough to mark the moment without losing elegance or control.";
    } else if (archetype.key === "n" && palette === "Expressive Colour") {
        return "You dress best when pattern and variation are used with confidence — checks, stripes, and textured surfaces that add rhythm and individuality without tipping into excess.";
    } else if (archetype.key === "p" && wardrobePriority === "Versatility") {
        return "You dress best in casual pieces that perform quietly — resilient fabrics, relaxed silhouettes, and a wardrobe built for movement, comfort, and repeat wear without looking overtly technical.";
    } else if (archetype.key === "d" && wardrobePriority === "Heritage") {
        return "You dress best in traditional forms updated with clarity — classic tailoring, familiar menswear codes, and pieces that feel rooted in heritage but cut for present-day life.";
    }

    if (archetype.key === "c" && garmentDrawLabel === "Cloth First") {
        return "You are led by cloth integrity first — strong hand, honest texture, and materials that feel substantial, convincing, and built to age well.";
    } else if (archetype.key === "t" && garmentDrawLabel === "Cloth First") {
        return "You want cloth that performs as well as it looks — breathable, resilient, and technically capable without losing polish.";
    } else if (archetype.key === "r" && garmentDrawLabel === "Cloth First") {
        return "You respond to cloth with softness and tactility — fabrics with drape, texture, and a natural elegance that never feels forced.";
    } else if (archetype.key === "x" && garmentDrawLabel === "Cloth First") {
        return "You prefer cloth with tactile depth over obvious statement — surfaces that reveal richness through texture, restraint, and close attention.";
    } else if (archetype.key === "l" && garmentDrawLabel === "Cloth First") {
        return "You respond to cloth as part of a larger composition — texture, weight, and seasonal character matter because they shape how the whole wardrobe layers together.";
    } else if (archetype.key === "z" && garmentDrawLabel === "Cloth First") {
        return "You are sensitive to how cloth belongs to season — dry weaves, richer textures, and material character that feels right for the weather rather than interchangeable all year.";
    } else if (archetype.key === "a" && garmentDrawLabel === "Shape First") {
        return "You are drawn to clarity of silhouette first — clean lines, strong proportion, and garments that feel designed with visual precision.";
    } else if (archetype.key === "f" && garmentDrawLabel === "Shape First") {
        return "You look best in sharper, more urban tailoring — silhouettes that feel structured, composed, and immediately confident.";
    } else if (archetype.key === "m" && garmentDrawLabel === "Shape First") {
        return "You prefer shape that feels modern and easy — clean proportions, softer tailoring, and silhouettes that stay polished without stiffness.";
    } else if (archetype.key === "w" && garmentDrawLabel === "Shape First") {
        return "You look best in relaxed silhouettes that still feel composed — easy lines, open structure, and warm-weather balance without formality.";
    } else if (archetype.key === "y" && garmentDrawLabel === "Shape First") {
        return "You respond to modern silhouette before anything else — cleaner shape, quieter proportion, and garments that feel current without looking trend-driven.";
    } else if (archetype.key === "e" && garmentDrawLabel === "Detail First") {
        return "You create style through smaller decisions — texture, contrast, and subtle detail used with enough control to feel personal rather than busy.";
    } else if (archetype.key === "h" && garmentDrawLabel === "Detail First") {
        return "You appreciate details that connect refinement and tradition — considered finishing, heritage references, and design choices that reward attention.";
    } else if (archetype.key === "k" && garmentDrawLabel === "Detail First") {
        return "You enjoy detail when it sharpens presence — richer finishing, stronger accents, and pieces that feel elevated enough for meaningful occasions.";
    } else if (archetype.key === "q" && garmentDrawLabel === "Detail First") {
        return "You prefer details that almost disappear — quiet finishing, tonal control, and refinement that reveals itself slowly rather than all at once.";
    } else if (archetype.key === "d" && garmentDrawLabel === "Detail First") {
        return "You respond to details that modernise tradition — familiar forms sharpened through better finishing, cleaner construction, and quieter editing.";
    } else if (archetype.key === "u" && garmentDrawLabel === "Wardrobe First") {
        return "You think in terms of usefulness first — pieces that combine well, travel easily, and solve real dressing needs without unnecessary complication.";
    } else if (archetype.key === "q" && garmentDrawLabel === "Wardrobe First") {
        return "You build best through calm wardrobe foundations — clean colours, versatile anchors, and pieces that make getting dressed feel coherent and easy.";
    } else if (archetype.key === "p" && garmentDrawLabel === "Wardrobe First") {
        return "You want a wardrobe that works hard in real life — easy pieces, technical performance, and relaxed polish that integrates naturally into daily wear.";
    } else if (archetype.key === "y" && garmentDrawLabel === "Wardrobe First") {
        return "You prefer a wardrobe that feels streamlined and modern — fewer, cleaner pieces that combine easily and still look quietly intentional.";
    } else if (archetype.key === "l" && garmentDrawLabel === "Wardrobe First") {
        return "You think in combinations and layering logic — a wardrobe that builds depth through coordination, seasonal variation, and the way pieces support one another.";
    } else if (archetype.key === "z" && garmentDrawLabel === "Wardrobe First") {
        return "You prefer a wardrobe that changes with climate and season — not just in colour, but in cloth, layering, and the rhythm of how pieces are actually worn.";
    }

    if (garmentDrawLabel === "Cloth First") {
        return (
            archetype.desc +
            " You tend to trust fabric character early — hand, texture, and material performance shape your decisions more than surface styling alone."
        );
    } else if (garmentDrawLabel === "Shape First") {
        return (
            archetype.desc +
            " You respond quickly to silhouette — proportion, line, and the way a garment sits on the body matter immediately to you."
        );
    } else if (garmentDrawLabel === "Detail First") {
        return (
            archetype.desc +
            " You notice the smaller choices that make a garment feel complete — finishing, construction, and the details that sharpen identity without excess."
        );
    } else if (garmentDrawLabel === "Wardrobe First") {
        return (
            archetype.desc +
            " You think in combinations rather than isolated pieces — versatility, integration, and long-term usefulness matter strongly in how you dress."
        );
    }

    return archetype.desc;
}

function getResultNotes(archetype, climateLabel, palette, colourUse) {
    var notes = [];
    var garmentDrawLabel = getGarmentDrawLabel();

    if (archetype && Array.isArray(archetype.notes)) {
        for (var i = 0; i < archetype.notes.length; i++) {
            notes.push(archetype.notes[i]);
        }
    }

    if (garmentDrawLabel === "Cloth First") {
        notes.push(
            "Prioritise cloth handle, breathability, and surface character early — the fabric itself should do much of the work."
        );
    } else if (garmentDrawLabel === "Shape First") {
        notes.push(
            "Pay close attention to silhouette, rise, shoulder line, and trouser shape — proportion will influence the result more than styling tricks."
        );
    } else if (garmentDrawLabel === "Detail First") {
        notes.push(
            "Use finishing, construction, and smaller design decisions to create distinction — details should feel intentional, not decorative."
        );
    } else if (garmentDrawLabel === "Wardrobe First") {
        notes.push(
            "Build around pieces that combine easily and repeat well — coherence and flexibility will make the wardrobe stronger over time."
        );
    }

    var climateNote = getClimateNote(climateLabel);
    if (climateNote) {
        notes.push(climateNote);
    }

    var paletteNote = getPaletteNote(palette);
    if (paletteNote) {
        notes.push(paletteNote);
    }

    var colourUseNote = getColourUseNote(colourUse);
    if (colourUseNote) {
        notes.push(colourUseNote);
    }

    return notes;
}

function scoreArchetypeAnswers() {
    var sc = {
        c: 0,
        m: 0,
        g: 0,
        q: 0,
        a: 0,
        u: 0,
        t: 0,
        s: 0,
        r: 0,
        e: 0,
        v: 0,
        o: 0,
        b: 0,
        h: 0,
        l: 0,
        x: 0,
        p: 0,
        k: 0,
        w: 0,
        f: 0,
        n: 0,
        d: 0,
        y: 0,
        z: 0,
    };

    var questionIds = getCurrentQuizPath();
    var questionMap = getArchetypeQuestionMap();

    for (var qi = 0; qi < questionIds.length; qi++) {
        var questionId = questionIds[qi];
        var question = questionMap[questionId];
        var answerIndex =
            appState.quizAnswersById &&
                appState.quizAnswersById[questionId] !== undefined
                ? appState.quizAnswersById[questionId]
                : null;

        if (
            answerIndex !== null &&
            answerIndex !== undefined &&
            question &&
            question.opts &&
            question.opts[answerIndex]
        ) {
            var s = question.opts[answerIndex].s;
            for (var k in s) {
                if (sc[k] !== undefined) {
                    sc[k] += s[k];
                }
            }
        }
    }

    return sc;
}

function getColourDirectionSummary(colourUse) {
    if (colourUse === "Mostly neutrals") return "Calm, tonal, and understated.";
    if (colourUse === "One accent colour")
        return "A quiet base with one controlled accent.";
    if (colourUse === "More playful colour")
        return "More expressive colour, balanced with restraint.";
    if (colourUse === "I'm not sure yet")
        return "Start with strong foundations, then build colour gradually.";
    return "";
}

function getCombinedArchetypeExploreLinks(
    primaryArchetype,
    secondaryArchetype,
    limit
) {
    limit = limit || 4;
    var combined = [];
    var seen = {};

    function addLinksFromArchetype(archetype) {
        var links = getArchetypeExploreLinks(archetype);
        for (var i = 0; i < links.length; i++) {
            var key = JSON.stringify(links[i].path);
            if (!seen[key]) {
                seen[key] = true;
                combined.push(links[i]);
            }
        }
    }

    if (primaryArchetype) addLinksFromArchetype(primaryArchetype);
    if (secondaryArchetype) addLinksFromArchetype(secondaryArchetype);

    return combined.slice(0, limit);
}

function getTopArchetypes(scores, limit) {
    limit = limit || 2;

    var ranked = [];
    for (var key in scores) {
        if (archetypeProfiles[key]) {
            ranked.push({
                key: key,
                score: scores[key],
                profile: archetypeProfiles[key],
            });
        }
    }

    ranked.sort(function (a, b) {
        return b.score - a.score;
    });

    return ranked.slice(0, limit);
}

function getColourUseNote(colourUse) {
    if (colourUse === "Mostly neutrals")
        return "Keep the wardrobe grounded in calm neutrals, then use texture and cloth character to create depth.";
    if (colourUse === "One accent colour")
        return "Use one controlled accent against a quieter base so colour adds interest without taking over.";
    if (colourUse === "More playful colour")
        return "Let colour play a clearer role, but keep the overall wardrobe balanced through restraint elsewhere.";
    if (colourUse === "I'm not sure yet")
        return "Start with dependable foundations first, then introduce colour gradually as your preferences become clearer.";
    return "";
}

function getCurrentQuizPath() {
    if (Array.isArray(appState.quizPath) && appState.quizPath.length) {
        return appState.quizPath;
    }

    appState.quizPath = [
        "climate",
        "off_duty",
        "garment_draw",
        "wardrobe_building_preference",
        "wardrobe_priority",
        "polished_dressing",
        "wardrobe_role",
    ];

    return appState.quizPath;
}

function getArchetypeQuestionMap() {
    var questionMap = {};
    for (var i = 0; i < archetypeQuestions.length; i++) {
        questionMap[archetypeQuestions[i].id] = archetypeQuestions[i];
    }
    return questionMap;
}

function getClimateLabel() {
    return appState.selClimate && appState.selClimate.trim()
        ? appState.selClimate
        : "\u2014";
}

function getClimateNote(climateLabel) {
    if (climateLabel === "Tropical")
        return "Prioritise breathable cloth, lighter construction, and pieces that keep their shape in heat and humidity.";
    if (climateLabel === "Warm & Dry")
        return "You can lean into texture, sun-washed neutrals, and warmer tonal dressing without losing refinement.";
    if (climateLabel === "Temperate")
        return "You have more room to layer, vary cloth weight, and build a wardrobe with stronger seasonal contrast.";
    if (climateLabel === "Indoor Climate")
        return "Focus on light layering and adaptable cloths that stay comfortable between strong air-conditioning and outdoor heat.";
    return "";
}

function getResolvedQuizPath() {
    var climate = appState.selClimate || "";
    var polishedQuestionId = "polished_dressing";
    var wardrobeRoleQuestionId = "wardrobe_role";
    var garmentBranchQuestionId = "wardrobe_building_preference";

    var wardrobePriorityAnswer = appState.quizAnswersById
        ? appState.quizAnswersById["wardrobe_priority"]
        : null;

    var garmentDrawAnswer = appState.quizAnswersById
        ? appState.quizAnswersById["garment_draw"]
        : null;

    if (
        climate === "Tropical" ||
        climate === "Warm & Dry" ||
        climate === "Indoor Climate"
    ) {
        polishedQuestionId = "polished_dressing_warm";
    } else if (climate === "Temperate") {
        polishedQuestionId = "polished_dressing_temperate";
    }

    if (garmentDrawAnswer === 0) {
        garmentBranchQuestionId = "cloth_preference";
    } else if (garmentDrawAnswer === 1) {
        garmentBranchQuestionId = "silhouette_preference";
    } else if (garmentDrawAnswer === 2) {
        garmentBranchQuestionId = "detail_preference";
    } else if (garmentDrawAnswer === 3) {
        garmentBranchQuestionId = "wardrobe_building_preference";
    }

    if (wardrobePriorityAnswer === 0) {
        wardrobeRoleQuestionId = "wardrobe_role_longevity";
    } else if (wardrobePriorityAnswer === 1) {
        wardrobeRoleQuestionId = "wardrobe_role_versatility";
    } else if (wardrobePriorityAnswer === 2) {
        wardrobeRoleQuestionId = "wardrobe_role_heritage";
    } else if (wardrobePriorityAnswer === 3) {
        wardrobeRoleQuestionId = "wardrobe_role_ease";
    }

    return [
        "climate",
        "off_duty",
        "garment_draw",
        garmentBranchQuestionId,
        "wardrobe_priority",
        polishedQuestionId,
        wardrobeRoleQuestionId,
    ];
}

function getWinningArchetype(scores) {
    var best = "s";
    var bestScore = -1;
    for (var k in scores) {
        if (scores[k] > bestScore) {
            bestScore = scores[k];
            best = k;
        }
    }
    return archetypeProfiles[best];
}

function getArchetypeExploreLinks(archetype) {
    var links = [];
    if (!archetype || !archetype.exploreNext) return links;
    for (var i = 0; i < archetype.exploreNext.length; i++) {
        var path = archetype.exploreNext[i];
        var node = getGuideNode(path);
        if (node) {
            links.push({ title: node.title, path: path, intro: node.intro });
        }
    }
    return links;
}

// ============================================
// APP STATE (Bulletproof Persistence)
// ============================================

function getFreshState() {
    return {
        view: "welcome",
        quizStep: 0,
        quizAnswers: [],
        quizAnswersById: {},
        quizPath: [],
        selFocus: "",
        selFit: "",
        selPalette: "",
        selColourUse: "",
        selClimate: "",
        archetypeKey: null,
        guidePath: [],
        history: [],
        clientName: "",
        colourStep: 0,
        colourAnswersById: {},
        colourResultKey: null,
        wardrobeChecklist: {},
    };
}

var savedSession = null;
try {
    savedSession = localStorage.getItem("bbs_session");
} catch (e) {
    console.log("Local storage disabled");
}

var appState = savedSession ? JSON.parse(savedSession) : getFreshState();

// ============================================
// NAVIGATION
// ============================================

function navigate(view, data, options) {
    data = data || {};
    options = options || {};
    appState.history.push({
        view: appState.view,
        data: JSON.parse(JSON.stringify(appState)),
    });
    appState.view = view;
    Object.assign(appState, data);
    render({ animate: options.animate !== false });
}

function navigateBack() {
    if (appState.view === "discover") {
        if (appState.quizStep > 0) {
            appState.quizStep = appState.quizStep - 1;
            render({ animate: false });
            return;
        }

        navigateHome();
        return;
    }

    if (appState.view === "onboarding") {
        appState.view = "discover";
        appState.quizStep = getCurrentQuizPath().length - 1;
        render({ animate: false });
        return;
    }

    if (appState.view === "result") {
        appState.view = "onboarding";
        render({ animate: false });
        return;
    }

    if (appState.history.length === 0) {
        navigateHome();
        return;
    }

    var previous = appState.history.pop();
    appState.view = previous.view;
    Object.assign(appState, previous.data);
    render();
}

function navigateHome() {
    appState.view = "home";
    appState.history = [];
    // We no longer delete the quiz answers here. The data is safe.
    render();
}

function navigateDiscover() {
    // 1. If they already completed the quiz, take them to the Result
    if (appState.selPalette && appState.selFocus) {
        appState.view = "result";
        render({ animate: true });
        return;
    }

    // 2. If they are halfway through, resume the quiz
    if (
        appState.quizAnswersById &&
        Object.keys(appState.quizAnswersById).length > 0
    ) {
        appState.view = "discover";
        render({ animate: true });
        return;
    }

    // 3. Otherwise, start fresh
    appState.view = "discover";
    appState.quizStep = 0;
    appState.quizAnswers = [];
    appState.quizAnswersById = {};
    appState.quizPath = [
        "climate",
        "off_duty",
        "garment_draw",
        "wardrobe_building_preference",
        "wardrobe_priority",
        "polished_dressing",
        "wardrobe_role",
    ];
    appState.selFocus = "";
    appState.selFit = "";
    appState.selPalette = "";
    appState.selColourUse = "";
    appState.selClimate = "";
    appState.archetypeKey = null;
    render({ animate: true });
}

function navigateGuide(path) {
    path = path || [];
    navigate("guide", { guidePath: path });
}
function navigateWorksheet() {
    appState.view = "worksheet";
    render({ animate: true });
}
function saveClientName(name) {
    var cleaned = (name || "").trim();
    if (!cleaned) return;
    appState.clientName = formatClientName(cleaned);
    appState.view = "home";
    render();
}

function clearClientName() {
    localStorage.removeItem("bbs_session");
    appState = getFreshState();
    render();
}

function formatClientName(name) {
    return name
        .trim()
        .split(/\s+/)
        .map(function (part) {
            return part
                .split("-")
                .map(function (seg) {
                    return seg
                        .split("'")
                        .map(function (p) {
                            return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
                        })
                        .join("'");
                })
                .join("-");
        })
        .join(" ");
}

// ============================================
// GUIDE HELPERS
// ============================================

function getGuideNode(path) {
    var node = guideTree;
    for (var i = 0; i < path.length; i++) {
        var key = path[i];
        if (!node.children || !node.children[key]) return null;
        node = node.children[key];
    }
    return node;
}

function getBreadcrumb(path) {
    var parts = ["The BBS Guide"];
    var node = guideTree;
    for (var i = 0; i < path.length; i++) {
        var key = path[i];
        if (!node.children || !node.children[key]) break;
        node = node.children[key];
        parts.push(node.title);
    }
    return parts.join(" / ");
}

// ============================================
// FAB VISIBILITY
// ============================================

function syncFabVisibility() {
    var fab = document.querySelector(".fab");
    if (!fab) return;
    var shouldShow = appState.view !== "welcome";
    fab.style.display = shouldShow ? "flex" : "none";
}
// ============================================
// RENDER WELCOME
// ============================================

function renderWelcome() {
    return (
        '<div class="welcome-shell">' +
        BBS_LOGO +
        '<div class="welcome-content-block">' +
        '<div class="welcome-hero">' +
        '<span class="welcome-kicker">Personal Style Discovery</span>' +
        "<h1>Your wardrobe,<br>considered.</h1>" +
        '<p class="welcome-intro">A personal consultation experience designed to help you find your direction in tailoring, cloth, and colour. It takes two minutes. The result lasts.</p>' +
        "</div>" +
        '<div class="welcome-form-card">' +
        '<div class="welcome-form">' +
        '<label class="welcome-label" for="client-name-input">How shall we address you?</label>' +
        '<input id="client-name-input" class="welcome-input" type="text" placeholder="Your first name" value="' +
        (appState.clientName || "") +
        '" autocomplete="given-name" autocorrect="off" spellcheck="false">' +
        '<p class="welcome-hint">This helps us make the experience feel personal. We do not store or share your name.</p>' +
        "</div>" +
        '<div class="welcome-actions">' +
        '<button class="button-primary" data-action="save-name">Begin the Experience</button>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
    );
}

// ============================================
// RENDER HOME
// ============================================

function renderHome() {
    var greeting = appState.clientName ? appState.clientName : null;

    var footerActions = "";
    if (appState.clientName) {
        footerActions =
            '<div style="text-align: center; margin-top: 1.5rem;">' +
            '<button class="home-change-name" data-action="change-name">Not ' +
            appState.clientName +
            "? Change client</button></div>";
    }

    // Watermark SVGs
    var compassSVG =
        '<svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>';
    var paletteSVG =
        '<svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 0-4.6H12a2 2 0 0 1 0-4h3.2A5.8 5.8 0 0 0 21 6.6 3.6 3.6 0 0 0 17.4 3H12z"></path><circle cx="7.5" cy="10" r="1"></circle><circle cx="10" cy="7.2" r="1"></circle><circle cx="14" cy="7.6" r="1"></circle><circle cx="16.5" cy="11" r="1"></circle></svg>';
    var bookSVG =
        '<svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
    var imageSVG =
        '<svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';

    // Footer SVGs
    var sunSVG =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>';
    var sparkSVG =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    var layersSVG =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>';

    return (
        '<div class="home-shell-v2">' +
        '<div class="home-brand-wrap">' +
        BBS_LOGO +
        "</div>" +
        '<div class="home-hero-v2">' +
        '<h1 class="home-hero-title-v2">' +
        (greeting ? "Welcome, " + greeting + "." : "Find Your Style Direction") +
        "</h1>" +
        '<p class="home-hero-sub-v2">' +
        (greeting
            ? "Your personal style discovery is ready."
            : "A bespoke discovery experience built around how you dress.") +
        "</p>" +
        "</div>" +
        '<div class="home-card-grid-triad">' +
        // TOP LEFT: Style
        '<div class="home-card home-card--primary" data-action="discover">' +
        '<div class="home-card-watermark home-card-watermark--primary">' +
        compassSVG +
        "</div>" +
        '<div class="home-card-content">' +
        '<div class="home-card-tag">Wardrobe Blueprint</div>' +
        '<h2 class="home-card-title">Style<br>Direction</h2>' +
        '<p class="home-card-body">A personal profile mapping your ideal cloth, cut, and silhouette.</p>' +
        '<div class="home-card-cta">Begin Assessment &rarr;</div>' +
        "</div>" +
        "</div>" +
        // TOP RIGHT: Colour
        '<div class="home-card home-card--primary" onclick="navigateColourDirection()">' +
        '<div class="home-card-watermark home-card-watermark--primary">' +
        paletteSVG +
        "</div>" +
        '<div class="home-card-content">' +
        '<div class="home-card-tag">Tonal Match</div>' +
        '<h2 class="home-card-title">Colour<br>Direction</h2>' +
        '<p class="home-card-body">Find the exact palettes and contrast architecture that harmonise with you.</p>' +
        '<div class="home-card-cta">Begin Assessment &rarr;</div>' +
        "</div>" +
        "</div>" +
        // BOTTOM LEFT: Guide
        '<div class="home-card home-card--secondary" data-action="guide">' +
        '<div class="home-card-watermark home-card-watermark--secondary">' +
        bookSVG +
        "</div>" +
        '<div class="home-card-content">' +
        '<div class="home-card-tag">Library</div>' +
        '<h2 class="home-card-title">The BBS<br>Guide</h2>' +
        '<p class="home-card-body">Explore our digital library of tailoring, cloth origins, and wardrobe strategy.</p>' +
        '<div class="home-card-cta">Open Guide &rarr;</div>' +
        "</div>" +
        "</div>" +
        // BOTTOM RIGHT: Lookbook
        '<div class="home-card home-card--secondary" onclick="navigateLookbook()">' +
        '<div class="home-card-watermark home-card-watermark--secondary">' +
        imageSVG +
        "</div>" +
        '<div class="home-card-content">' +
        '<div class="home-card-tag">Gallery</div>' +
        '<h2 class="home-card-title">Editorial<br>Lookbook</h2>' +
        '<p class="home-card-body">A curated visual archive of seasonal campaigns and tailoring examples.</p>' +
        '<div class="home-card-cta">View Gallery &rarr;</div>' +
        "</div>" +
        "</div>" +
        "</div>" +
        // 🌟 FIXED COMMAND BAR: Now uses data-action to trigger the panel slide-out
        '<div class="home-quick-queries">' +
        '<button class="quick-query-btn" data-action="quick-query" data-query="tropical_work">' +
        sunSVG +
        "<span>Tropical Weights</span></button>" +
        '<div class="quick-query-divider"></div>' +
        '<button class="quick-query-btn" data-action="quick-query" data-query="bbs_core">' +
        sparkSVG +
        "<span>BBS Signatures</span></button>" +
        '<div class="quick-query-divider"></div>' +
        '<button class="quick-query-btn" data-action="quick-query" data-query="versatile">' +
        layersSVG +
        "<span>High Versatility</span></button>" +
        "</div>" +
        footerActions +
        "</div>"
    );
}

// ============================================
// RENDER DISCOVER — archetype quiz
// ============================================
function renderDiscover() {
    var questionIds = getCurrentQuizPath();
    var questionMap = getArchetypeQuestionMap();
    var currentQuestionId = questionIds[appState.quizStep];
    var q = questionMap[currentQuestionId];
    var stepNum = appState.quizStep + 1;
    var totalSteps = questionIds.length;
    var currentAnswer =
        appState.quizAnswersById &&
            appState.quizAnswersById[currentQuestionId] !== undefined
            ? appState.quizAnswersById[currentQuestionId]
            : null;
    var isLastStep = appState.quizStep === totalSteps - 1;
    var canContinue = currentAnswer !== null && currentAnswer !== undefined;

    var helperText = "";
    if (currentQuestionId === "cloth_preference") {
        helperText = "Adjusted for cloth-led dressing.";
    } else if (currentQuestionId === "silhouette_preference") {
        helperText = "Adjusted for silhouette-led dressing.";
    } else if (currentQuestionId === "detail_preference") {
        helperText = "Adjusted for detail-led dressing.";
    } else if (currentQuestionId === "wardrobe_building_preference") {
        helperText = "Adjusted for wardrobe-led dressing.";
    } else if (currentQuestionId === "polished_dressing_warm") {
        helperText = "Adjusted for warm-weather dressing.";
    } else if (currentQuestionId === "polished_dressing_temperate") {
        helperText = "Adjusted for seasonal dressing.";
    } else if (currentQuestionId === "wardrobe_role_longevity") {
        helperText = "Adjusted for a wardrobe built around longevity.";
    } else if (currentQuestionId === "wardrobe_role_versatility") {
        helperText = "Adjusted for a wardrobe built around versatility.";
    } else if (currentQuestionId === "wardrobe_role_heritage") {
        helperText = "Adjusted for a wardrobe built around heritage.";
    } else if (currentQuestionId === "wardrobe_role_ease") {
        helperText = "Adjusted for a wardrobe built around ease.";
    }

    var pipsHTML = '<div class="arch-pips">';
    for (var p = 0; p < totalSteps; p++) {
        var pipClass = "arch-pip";
        if (p < appState.quizStep) {
            pipClass += " on";
        } else if (p === appState.quizStep) {
            pipClass += " cur";
        }
        pipsHTML += '<span class="' + pipClass + '"></span>';
    }
    pipsHTML += "</div>";

    var gridHTML = '<div class="arch-grid">';
    for (var i = 0; i < q.opts.length; i++) {
        var opt = q.opts[i];
        var selClass = currentAnswer === i ? " sel" : "";
        gridHTML +=
            '<button class="arch-opt' +
            selClass +
            '" type="button" ' +
            'data-action="quiz-pick" data-index="' +
            i +
            '">' +
            '<span class="arch-opt-main">' +
            opt.a +
            "</span>" +
            '<span class="arch-opt-sub">' +
            opt.b +
            "</span>" +
            "</button>";
    }
    gridHTML += "</div>";

    return (
        '<div class="arch-shell">' +
        pipsHTML +
        '<div class="arch-q-label">Step ' +
        stepNum +
        " of " +
        totalSteps +
        "</div>" +
        '<div class="arch-q-title">' +
        q.text +
        "</div>" +
        (helperText ? '<p class="arch-q-subtext">' + helperText + "</p>" : "") +
        gridHTML +
        '<div class="arch-nav">' +
        '<button class="arch-btn-back" data-action="back"' +
        (appState.quizStep === 0 ? " disabled" : "") +
        ">\u2190 Back</button>" +
        '<button class="arch-btn-home" data-action="home">Home</button>' +
        '<button class="arch-btn-next" data-action="quiz-next"' +
        (canContinue ? "" : " disabled") +
        ">" +
        (isLastStep ? "Continue \u2192" : "Next \u2192") +
        "</button>" +
        "</div>" +
        "</div>"
    );
}

// ============================================
// RENDER ONBOARDING — post-quiz preferences
// ============================================
function getPaletteSwatches(palette) {
    if (palette === "Earth & Olive") {
        return ["#6E7440", "#D6BE98", "#8A5B3C", "#C46A45", "#9B7A5C"];
    } else if (palette === "Riviera Light") {
        return ["#D8D0C2", "#F4ECDD", "#9FB9CF", "#B89D82", "#E8DFD1"];
    } else if (palette === "Navy & Stone") {
        return ["#1F3550", "#687383", "#58708A", "#D9D1C4", "#A9B5C0"];
    } else if (palette === "Soft Neutrals") {
        return ["#D8D0C2", "#C8BEAF", "#A59684", "#B6B3AC", "#E6DED2"];
    } else if (palette === "City Greys") {
        return ["#454545", "#F2EEE7", "#AFAFA9", "#202020", "#7E7E79"];
    } else if (palette === "Heritage Browns") {
        return ["#684C39", "#86573D", "#666A42", "#4A5640", "#A18868"];
    } else if (palette === "Deep Colour") {
        return ["#6A2031", "#2E483B", "#223A57", "#3A2A23", "#634434"];
    } else if (palette === "Expressive Colour") {
        return ["#879967", "#B45C39", "#D5A19C", "#86B2D6", "#C29A33"];
    } else if (palette === "Open / Unsure") {
        return ["#D8D0C2", "#B7B2AA", "#8A7E73", "#4A4A4A", "#E6DED2"];
    }

    return ["#D8D0C2", "#B7B2AA", "#8A7E73", "#4A4A4A", "#E6DED2"];
}

function renderOnboarding() {
    var focusOptions = [
        { val: "Everyday Essentials", label: "Everyday Wardrobe" },
        { val: "Business Attire", label: "Professional Dressing" },
        { val: "Smart-Casual", label: "Refined Casual" },
        { val: "Milestone Event", label: "Wedding or Occasion" },
        { val: "Open / Unsure", label: "Exploring My Style" },
    ];

    var focusHTML = "";
    for (var i = 0; i < focusOptions.length; i++) {
        var fo = focusOptions[i];
        var activeClass = appState.selFocus === fo.val ? " active" : "";
        focusHTML +=
            '<button class="arch-pref-btn' +
            activeClass +
            '" type="button" ' +
            'data-action="onboard-focus" data-value="' +
            fo.val +
            '">' +
            '<span class="arch-pref-main">' +
            fo.label +
            "</span>" +
            "</button>";
    }

    var fitHTML = "";
    if (appState.selFocus && archetypeFitOptions[appState.selFocus]) {
        var fits = JSON.parse(
            JSON.stringify(archetypeFitOptions[appState.selFocus])
        );

        var isWarmClimate =
            appState.selClimate === "Tropical" ||
            appState.selClimate === "Warm & Dry" ||
            appState.selClimate === "Indoor Climate";

        var isTemperateClimate = appState.selClimate === "Temperate";

        if (isWarmClimate) {
            for (var wf = 0; wf < fits.length; wf++) {
                if (fits[wf].val === "Classic Structure") {
                    fits[wf].text = "Light, classic structure";
                } else if (fits[wf].val === "Slim Tailored") {
                    fits[wf].text = "Soft, modern tailoring";
                } else if (fits[wf].val === "Sharp Custom") {
                    fits[wf].text = "Sharp, but still light";
                } else if (fits[wf].val === "Modern Formal") {
                    fits[wf].text = "Relaxed formal ease";
                } else if (fits[wf].val === "Unstructured Relaxed") {
                    fits[wf].text = "Soft and breathable";
                } else if (fits[wf].val === "Tailored Casual") {
                    fits[wf].text = "Clean, easy tailoring";
                } else if (fits[wf].val === "Relaxed Fit") {
                    fits[wf].text = "Relaxed and breathable";
                } else if (fits[wf].val === "Tapered Cut") {
                    fits[wf].text = "Clean and lightweight";
                }
            }
        } else if (isTemperateClimate) {
            for (var tf = 0; tf < fits.length; tf++) {
                if (fits[tf].val === "Classic Structure") {
                    fits[tf].text = "Classic structure with presence";
                } else if (fits[tf].val === "Slim Tailored") {
                    fits[tf].text = "Modern tailored line";
                } else if (fits[tf].val === "Sharp Custom") {
                    fits[tf].text = "Sharp and structured";
                } else if (fits[tf].val === "Modern Formal") {
                    fits[tf].text = "Modern formal balance";
                } else if (fits[tf].val === "Unstructured Relaxed") {
                    fits[tf].text = "Relaxed layered ease";
                } else if (fits[tf].val === "Tailored Casual") {
                    fits[tf].text = "Clean layered tailoring";
                } else if (fits[tf].val === "Relaxed Fit") {
                    fits[tf].text = "Relaxed with room to layer";
                } else if (fits[tf].val === "Tapered Cut") {
                    fits[tf].text = "Clean, tapered shape";
                }
            }
        }

        for (var j = 0; j < fits.length; j++) {
            var fit = fits[j];
            var fitActive = appState.selFit === fit.val ? " active" : "";
            fitHTML +=
                '<button class="arch-pref-btn' +
                fitActive +
                '" type="button" ' +
                'data-action="onboard-fit" data-value="' +
                fit.val +
                '">' +
                '<span class="arch-pref-main">' +
                fit.text +
                "</span>" +
                "</button>";
        }
    }

    var paletteOptions;

    if (
        appState.selClimate === "Tropical" ||
        appState.selClimate === "Warm & Dry" ||
        appState.selClimate === "Indoor Climate"
    ) {
        paletteOptions = [
            {
                val: "Earth & Olive",
                label: "Earth & Olive",
                sub: "Olive, Sand, Tobacco, Terracotta",
            },
            {
                val: "Riviera Light",
                label: "Riviera Light",
                sub: "Stone, Cream, Soft Blue, Warm Taupe",
            },
            {
                val: "Navy & Stone",
                label: "Navy & Stone",
                sub: "Navy, Slate, Airforce, Soft Stone",
            },
            {
                val: "Soft Neutrals",
                label: "Soft Neutrals",
                sub: "Oat, Stone, Mushroom, Soft Grey",
            },
            {
                val: "Expressive Colour",
                label: "Expressive Colour",
                sub: "Sage, Rust, Soft Pink, Sky, Mustard",
            },
            {
                val: "Open / Unsure",
                label: "Open / Unsure",
                sub: "A curated direction from our stylists",
            },
        ];
    } else if (appState.selClimate === "Temperate") {
        paletteOptions = [
            {
                val: "Heritage Browns",
                label: "Heritage Browns",
                sub: "Brown, Tobacco, Olive, Deep Moss",
            },
            {
                val: "City Greys",
                label: "City Greys",
                sub: "Charcoal, Off-White, Soft Grey, Black",
            },
            {
                val: "Deep Colour",
                label: "Deep Colour",
                sub: "Burgundy, Forest, Navy, Dark Chocolate",
            },
            {
                val: "Navy & Stone",
                label: "Navy & Stone",
                sub: "Navy, Slate, Airforce, Soft Stone",
            },
            {
                val: "Soft Neutrals",
                label: "Soft Neutrals",
                sub: "Oat, Stone, Mushroom, Soft Grey",
            },
            {
                val: "Expressive Colour",
                label: "Expressive Colour",
                sub: "Rust, Teal, Ochre, Soft Pink",
            },
            {
                val: "Open / Unsure",
                label: "Open / Unsure",
                sub: "A curated direction from our stylists",
            },
        ];
    } else {
        paletteOptions = [
            {
                val: "Earth & Olive",
                label: "Earth & Olive",
                sub: "Olive, Sand, Tobacco, Terracotta",
            },
            {
                val: "Riviera Light",
                label: "Riviera Light",
                sub: "Stone, Cream, Soft Blue, Warm Taupe",
            },
            {
                val: "Navy & Stone",
                label: "Navy & Stone",
                sub: "Navy, Slate, Airforce, Soft Stone",
            },
            {
                val: "Soft Neutrals",
                label: "Soft Neutrals",
                sub: "Oat, Stone, Mushroom, Soft Grey",
            },
            {
                val: "City Greys",
                label: "City Greys",
                sub: "Charcoal, Off-White, Soft Grey, Black",
            },
            {
                val: "Expressive Colour",
                label: "Expressive Colour",
                sub: "Sage, Rust, Soft Pink, Sky, Mustard",
            },
            {
                val: "Open / Unsure",
                label: "Open / Unsure",
                sub: "A curated direction from our stylists",
            },
        ];
    }

    var paletteHTML = "";
    for (var k = 0; k < paletteOptions.length; k++) {
        var po = paletteOptions[k];
        var palActive = appState.selPalette === po.val ? " active" : "";
        var swatchHTML = "";

        if (isPaletteOpenUnsure(po.val)) {
            swatchHTML = getOpenUnsurePaletteIconsHTML();
        } else {
            var swatches = getPaletteSwatches(po.val);
            swatchHTML = '<span class="arch-palette-swatches">';
            for (var si = 0; si < swatches.length; si++) {
                swatchHTML +=
                    '<span class="arch-palette-swatch" style="background-color: ' +
                    swatches[si] +
                    ';"></span>';
            }
            swatchHTML += "</span>";
        }

        paletteHTML +=
            '<button class="arch-pref-btn arch-pref-btn--palette' +
            palActive +
            '" type="button" ' +
            'data-action="onboard-palette" data-value="' +
            po.val +
            '">' +
            '<span class="arch-pref-copy">' +
            '<span class="arch-pref-main">' +
            po.label +
            "</span>" +
            '<span class="arch-pref-sub">' +
            po.sub +
            "</span>" +
            "</span>" +
            swatchHTML +
            "</button>";
    }

    var colourUseOptions = [
        { val: "Mostly neutrals", label: "Mostly neutrals" },
        { val: "One accent colour", label: "One accent colour" },
        { val: "More playful colour", label: "More playful colour" },
        { val: "I'm not sure yet", label: "I'm not sure yet" },
    ];

    var colourUseHTML = "";
    for (var cu = 0; cu < colourUseOptions.length; cu++) {
        var colourUse = colourUseOptions[cu];
        var colourUseActive =
            appState.selColourUse === colourUse.val ? " active" : "";
        colourUseHTML +=
            '<button class="arch-pref-btn' +
            colourUseActive +
            '" type="button" ' +
            'data-action="onboard-colour-use" data-value="' +
            colourUse.val +
            '">' +
            '<span class="arch-pref-main">' +
            colourUse.label +
            "</span>" +
            "</button>";
    }

    var nameVal = appState.clientName || "";

    var canGenerate =
        nameVal.length > 0 &&
        appState.selFocus !== "" &&
        appState.selFit !== "" &&
        appState.selPalette !== "" &&
        appState.selColourUse !== "";

    return (
        '<div class="arch-onboard-shell">' +
        '<div class="arch-onboard-label">Almost there</div>' +
        '<h1 class="arch-onboard-title">A Few Final Details</h1>' +
        '<p class="arch-onboard-desc">This helps us shape a more considered recommendation.</p>' +
        (appState.selClimate
            ? '<p class="arch-q-subtext">Adjusted for ' +
            appState.selClimate +
            " dressing.</p>"
            : "") +
        '<div class="arch-pref-group">' +
        '<div class="arch-pref-label">Your name</div>' +
        '<input id="onboard-name-input" class="arch-name-input" type="text" ' +
        'placeholder="First name" value="' +
        nameVal +
        '" ' +
        'autocomplete="given-name" autocorrect="off" spellcheck="false" ' +
        'data-action="onboard-name">' +
        "</div>" +
        '<div class="arch-pref-group">' +
        '<div class="arch-pref-label">What are you building towards?</div>' +
        '<div class="arch-pref-options">' +
        focusHTML +
        "</div>" +
        "</div>" +
        (appState.selFocus
            ? '<div class="arch-pref-group">' +
            '<div class="arch-pref-label">Preferred silhouette</div>' +
            '<div class="arch-pref-options">' +
            fitHTML +
            "</div>" +
            "</div>"
            : "") +
        '<div class="arch-pref-group">' +
        '<div class="arch-pref-label">Colour direction</div>' +
        '<div class="arch-pref-options">' +
        paletteHTML +
        "</div>" +
        "</div>" +
        '<div class="arch-pref-group">' +
        '<div class="arch-pref-label">How do you like to wear colour?</div>' +
        '<div class="arch-pref-options">' +
        colourUseHTML +
        "</div>" +
        "</div>" +
        '<div class="arch-nav">' +
        '<button class="arch-btn-back" data-action="back">\u2190 Back</button>' +
        '<button class="arch-btn-next" data-action="onboard-submit"' +
        (canGenerate ? "" : " disabled") +
        ">See My Match \u2192</button>" +
        "</div>" +
        "</div>"
    );
}
function isPaletteOpenUnsure(palette) {
    return palette === "Open / Unsure";
}
function getOpenUnsurePaletteIconsHTML() {
    var hatIcon =
        '<span class="arch-palette-icon-token">' +
        '<svg class="arch-palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 14c1.5-1 3.8-1.5 6-1.5s4.5.5 6 1.5"></path>' +
        '<path d="M9 12V9.8c0-1.8 1.3-3.3 3-3.3s3 1.5 3 3.3V12"></path>' +
        '<path d="M4.5 15.5h15"></path>' +
        "</svg>" +
        "</span>";

    var jacketIcon =
        '<span class="arch-palette-icon-token">' +
        '<svg class="arch-palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M9 4l3 2 3-2 3 4-2 3v9H8v-9L6 8l3-4z"></path>' +
        '<path d="M12 6v14"></path>' +
        "</svg>" +
        "</span>";

    var shirtIcon =
        '<span class="arch-palette-icon-token">' +
        '<svg class="arch-palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M8 4l4 2 4-2 3 3-2 3v10H7V10L5 7l3-3z"></path>' +
        '<path d="M10 8h4"></path>' +
        "</svg>" +
        "</span>";

    var trouserIcon =
        '<span class="arch-palette-icon-token">' +
        '<svg class="arch-palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M8 4h8l-1 7-1 9h-3l-1-7-1 7H6l1-9 1-7z"></path>' +
        "</svg>" +
        "</span>";

    var shoeIcon =
        '<span class="arch-palette-icon-token">' +
        '<svg class="arch-palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M4 15c2 0 3.5-.4 5-1.5l2-1.5 2 2c1 .9 2.3 1.5 4 1.5h2v3H4v-4z"></path>' +
        "</svg>" +
        "</span>";

    return (
        '<span class="arch-palette-swatches arch-palette-swatches--icons">' +
        hatIcon +
        jacketIcon +
        shirtIcon +
        trouserIcon +
        shoeIcon +
        "</span>"
    );
}

// ============================================
// RENDER RESULT — BULLETPROOF VERSION
// ============================================

function renderResult() {
    var primaryKey = appState.archetypeKey || "s";
    var secondaryKey = null;
    var scores = null;

    if (!appState.archetypeKey) {
        var rawScores = scoreArchetypeAnswers();
        scores = applyOnboardingArchetypeAdjustments(rawScores);

        var highestScore = -1;
        var secondHighest = -1;

        for (var key in scores) {
            if (scores[key] > highestScore) {
                secondaryKey = primaryKey;
                secondHighest = highestScore;
                primaryKey = key;
                highestScore = scores[key];
            } else if (scores[key] > secondHighest) {
                secondaryKey = key;
                secondHighest = scores[key];
            }
        }

        appState.archetypeKey = primaryKey;
    }

    var archetype = archetypeProfiles[primaryKey] || archetypeProfiles.s;


    var secondaryArchetype = secondaryKey
        ? archetypeProfiles[secondaryKey]
        : null;

    if (secondaryArchetype && secondaryArchetype.key === archetype.key) {
        secondaryArchetype = null;
    }

    var links = getCombinedArchetypeExploreLinks(
        archetype,
        secondaryArchetype,
        4
    );
    var name = appState.clientName || "";
    var climateLabel = getClimateLabel();
    var garmentDrawLabel = getGarmentDrawLabel();
    var wardrobePriority = getWardrobePriorityLabel();

    var resultDesc = getResultDescription(
        archetype,
        climateLabel,
        appState.selPalette,
        wardrobePriority
    );

    var baseNotes = archetype.notes || [];
    var coreNotesHTML = "";
    for (var n = 0; n < baseNotes.length; n++) {
        coreNotesHTML += '<div class="arch-card-note">' + baseNotes[n] + "</div>";
    }

    var garmentDrawNote = "";
    if (garmentDrawLabel === "Cloth First")
        garmentDrawNote =
            "Prioritise cloth handle, breathability, and surface character early. The fabric itself should do much of the work.";
    else if (garmentDrawLabel === "Shape First")
        garmentDrawNote =
            "Pay close attention to silhouette, rise, shoulder line, and trouser shape. Proportion will influence the result more than styling tricks.";
    else if (garmentDrawLabel === "Detail First")
        garmentDrawNote =
            "Use finishing, construction, and smaller design decisions to create distinction. Details should feel intentional, not decorative.";
    else if (garmentDrawLabel === "Wardrobe First")
        garmentDrawNote =
            "Build around pieces that combine easily and repeat well. Coherence and flexibility will make the wardrobe stronger over time.";

    var climateNote = getClimateNote(climateLabel);
    var paletteNote = getPaletteNote(appState.selPalette);
    var colourUseNote = getColourUseNote(appState.selColourUse);
    var staffSummary = getStaffSummary(
        archetype,
        climateLabel,
        appState.selPalette,
        appState.selColourUse
    );

    var iconEnvironment =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color: #a8998a; margin-top: 2px;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>';
    var iconPalette =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color: #a8998a; margin-top: 2px;"><path d="M12 2.69l5.66 4.2c3.11 3.11 3.11 8.16 0 11.27-3.11 3.11-8.16 3.11-11.27 0-3.11-3.11-3.11-8.16 0-11.27L12 2.69z"></path></svg>';
    var iconStaff =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color: #a8998a; margin-top: 2px;"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="9" y1="14" x2="15" y2="14"></line><line x1="9" y1="18" x2="15" y2="18"></line></svg>';

    var tagsHTML = "";
    for (var t = 0; t < archetype.tags.length; t++) {
        tagsHTML += '<span class="arch-card-chip">' + archetype.tags[t] + "</span>";
    }

    var linksHTML = "";
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var pathJson = JSON.stringify(link.path);
        linksHTML +=
            '<div class="arch-explore-card" data-action="result-link" data-path=\'' +
            pathJson +
            "'>" +
            '<span class="arch-explore-kind">Guide</span>' +
            '<div class="arch-explore-title">' +
            link.title +
            "</div>" +
            '<div class="arch-explore-intro">' +
            (link.intro || "") +
            "</div>" +
            "</div>";
    }

    return (
        '<div class="arch-result-shell">' +
        '<div class="arch-result-label">Your Match</div>' +
        '<div class="arch-result-name">' +
        (name ? '<span class="arch-result-client">' + name + "</span>" : "") +
        '<span class="arch-result-persona">' +
        archetype.name +
        "</span>" +
        "</div>" +
        '<div class="arch-result-divider"></div>' +
        '<p class="arch-result-desc">' +
        resultDesc +
        "</p>" +
        '<p class="arch-result-secondary">' +
        (secondaryArchetype
            ? "Secondary influence: " + secondaryArchetype.name
            : "Secondary influence: none") +
        "</p>" +
        '<div class="arch-card-wrap">' +
        '<div class="arch-style-card" id="arch-style-card">' +
        '<div class="arch-card-top">' +
        '<span class="arch-card-brand">Benjamin Barker Studios</span>' +
        '<span class="arch-card-tag">STYLE ARCHETYPE</span>' +
        "</div>" +
        (name ? '<div class="arch-card-client">Name: ' + name + "</div>" : "") +
        '<div class="arch-card-persona">' +
        archetype.name +
        "</div>" +
        '<div class="arch-card-persona-sub">' +
        archetype.sub +
        "</div>" +
        '<div class="arch-card-rule"></div>' +
        '<div class="arch-card-section-label">Your Profile</div>' +
        '<div class="arch-card-baseline-grid">' +
        '<div class="arch-card-baseline-item">' +
        '<div class="arch-card-baseline-lbl">Climate</div>' +
        '<div class="arch-card-baseline-val">' +
        climateLabel +
        "</div>" +
        "</div>" +
        '<div class="arch-card-baseline-item">' +
        '<div class="arch-card-baseline-lbl">Style Lens</div>' +
        '<div class="arch-card-baseline-val">' +
        (garmentDrawLabel || "\u2014") +
        "</div>" +
        "</div>" +
        '<div class="arch-card-baseline-item">' +
        '<div class="arch-card-baseline-lbl">Goal</div>' +
        '<div class="arch-card-baseline-val">' +
        (appState.selFocus || "\u2014") +
        "</div>" +
        "</div>" +
        '<div class="arch-card-baseline-item">' +
        '<div class="arch-card-baseline-lbl">Fit</div>' +
        '<div class="arch-card-baseline-val">' +
        (appState.selFit || "\u2014") +
        "</div>" +
        "</div>" +
        '<div class="arch-card-baseline-item">' +
        '<div class="arch-card-baseline-lbl">Palette</div>' +
        '<div class="arch-card-baseline-val">' +
        (appState.selPalette || "\u2014") +
        "</div>" +
        "</div>" +
        '<div class="arch-card-baseline-item">' +
        '<div class="arch-card-baseline-lbl">Colour Use</div>' +
        '<div class="arch-card-baseline-val">' +
        (appState.selColourUse || "\u2014") +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="arch-card-section-label">Core Principles</div>' +
        '<div class="arch-card-notes" style="margin-bottom: 1.6rem;">' +
        coreNotesHTML +
        "</div>" +
        '<div class="arch-card-section-label">Bespoke Insights</div>' +
        (climateNote || garmentDrawNote
            ? '<div class="bespoke-insight-card">' +
            '<div class="bespoke-insight-header">' +
            iconEnvironment +
            '<span class="bespoke-insight-title">Sartorial Strategy</span></div>' +
            '<p class="bespoke-insight-desc">' +
            (climateNote ? climateNote + " " : "") +
            garmentDrawNote +
            "</p>" +
            "</div>"
            : "") +
        (paletteNote || colourUseNote
            ? '<div class="bespoke-insight-card">' +
            '<div class="bespoke-insight-header">' +
            iconPalette +
            '<span class="bespoke-insight-title">Palette Foundation</span></div>' +
            '<p class="bespoke-insight-desc">' +
            (paletteNote ? paletteNote + " " : "") +
            colourUseNote +
            "</p>" +
            "</div>"
            : "") +
        '<div class="arch-card-section-label" style="margin-top: 1rem;">Details</div>' +
        '<div class="arch-card-tags">' +
        tagsHTML +
        "</div>" +
        (staffSummary
            ? '<div class="arch-card-section-label">Staff Direction</div>' +
            '<div class="bespoke-insight-card" style="border-color: rgba(243, 239, 233, 0.3); background: rgba(255, 255, 255, 0.08);">' +
            '<div class="bespoke-insight-header">' +
            iconStaff +
            '<span class="bespoke-insight-title" style="color: #fff;">Stylist Note</span></div>' +
            '<p class="bespoke-insight-desc" style="color: #fff;">' +
            staffSummary +
            "</p>" +
            "</div>"
            : "") +
        '<div class="arch-card-footer">' +
        '<div class="arch-card-cta-text">Show this card to staff in store</div>' +
        '<div class="arch-card-url">benjaminbarkerstudios.com</div>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="arch-card-actions">' +
        '<button class="arch-btn-fill" data-action="save-card">Save Card</button>' +
        '<button class="arch-btn-stroke" data-action="worksheet">Build Your Wardrobe</button>' +
        '<button class="arch-btn-stroke" data-action="show-qr">Share to Phone</button>' +
        '</div>' +


        '<div class="arch-journey-bridge" onclick="navigateColourDirection()">' +
        '<div class="arch-journey-bridge-content">' +
        '<div class="arch-journey-bridge-label">Next Step</div>' +
        '<h3 class="arch-journey-bridge-title">Discover Your Colour Architecture</h3>' +
        '<p class="arch-journey-bridge-desc">Your silhouette is defined. Now discover the exact cloth finish and contrast levels that harmonise with your complexion.</p>' +
        "</div>" +
        '<div class="arch-journey-bridge-icon">&rarr;</div>' +
        "</div>" +
        (links.length > 0
            ? '<div class="arch-explore-section">' +
            '<div class="arch-explore-heading">Explore the BBS Guide</div>' +
            '<p class="arch-explore-intro-text">These areas of the guide are most aligned with your style direction.</p>' +
            '<div class="arch-explore-grid">' +
            linksHTML +
            "</div>" +
            "</div>"
            : "") +
        '<div class="arch-result-footer">' +
        // 🌟 HERE IS THE FIXED BUTTON ACTION:
        '<button class="arch-restart" data-action="style-restart">Start Over</button>' +
        "</div>" +
        "</div>"
    );
}

// ============================================
// RENDER WORKSHEET — PREMIUM ENHANCED VERSION
// ============================================

function renderWorksheet() {
    var archetypeKey = appState.archetypeKey;
    if (!archetypeKey)
        return '<div class="worksheet-shell"><p>Please complete the assessment first.</p></div>';

    var archetype = archetypeProfiles[archetypeKey];
    var template = getWardrobeTemplate(archetypeKey);
    var checklist = appState.wardrobeChecklist || {};
    var selectedPalette = appState.selPalette || "";
    var selectedClimate = appState.selClimate || "";
    var garmentDrawLabel = getGarmentDrawLabel(); // 🆕 Get style lens

    var foundationItems = filterItemsByClimate(
        template.foundation,
        selectedClimate
    );
    var refinementItems = filterItemsByClimate(
        template.refinements,
        selectedClimate
    );

    foundationItems.sort(function (a, b) {
        return a.priority - b.priority;
    });
    refinementItems.sort(function (a, b) {
        return a.priority - b.priority;
    });

    var totalItems = foundationItems.length + refinementItems.length;
    var checkedItems = 0;
    var foundationChecked = 0;
    var refinementChecked = 0;

    for (var key in checklist) {
        if (checklist[key].checked) {
            checkedItems++;
            if (
                foundationItems.some(function (item) {
                    return item.id === key;
                })
            ) {
                foundationChecked++;
            } else {
                refinementChecked++;
            }
        }
    }

    var progressPercent =
        totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

    // 🆕 Helper to build item HTML
    function buildItemHTML(item, isChecked, isExpanded) {
        var checkedClass = isChecked ? " checked" : "";
        var expandedClass = isExpanded ? " expanded" : "";
        var guidePathJson = item.guide
            ? JSON.stringify(item.guide).replace(/"/g, "&quot;")
            : "";

        var colorChip = getColorChipForItem(item, selectedPalette);
        var colorChipHTML = colorChip
            ? '<div class="worksheet-item-color-chip" style="background-color: ' +
            colorChip.color +
            ';" title="' +
            colorChip.note +
            '"></div>'
            : "";

        var tierClass = "tier-" + (item.tier || "foundation");
        var tierLabel =
            item.tier === "foundation"
                ? "Foundation"
                : item.tier === "enhancement"
                    ? "Enhancement"
                    : "Luxury";

        var html =
            '<div class="worksheet-item' +
            checkedClass +
            expandedClass +
            '" data-item-id="' +
            item.id +
            '">';
        html += '<div class="worksheet-item-priority">' + item.priority + "</div>";
        html +=
            '<div class="worksheet-item-check" data-action="toggle-item" data-item-id="' +
            item.id +
            '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>';

        html += '<div class="worksheet-item-content">';
        html += '<div class="worksheet-item-main">';
        html +=
            '<div class="worksheet-item-label-row"><div class="worksheet-item-label">' +
            item.item +
            "</div>" +
            colorChipHTML +
            "</div>";
        html +=
            '<div class="worksheet-item-meta"><span class="worksheet-item-tier ' +
            tierClass +
            '">' +
            tierLabel +
            "</span>";

        // 🆕 Mill Sourcing UI
        if (item.mills) {
            html +=
                '<span class="worksheet-item-mills"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 12l10 10 10-10L12 2z"></path></svg>' +
                item.mills +
                "</span>";
        }

        html += "</div></div>"; // end main

        html += '<div class="worksheet-item-actions">';
        if (item.guide)
            html +=
                '<button class="worksheet-item-guide-link" data-action="worksheet-guide-link" data-path=\'' +
                guidePathJson +
                "'>View in Guide →</button>";
        if (item.why)
            html +=
                '<button class="worksheet-item-why-toggle" data-action="toggle-why" data-item-id="' +
                item.id +
                '"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>Why this matters</button>';
        html += "</div>";

        if (item.why) {
            html += '<div class="worksheet-item-why">';
            html += '<div class="worksheet-item-why-label">Strategic Value:</div>';
            html += '<div class="worksheet-item-why-text">' + item.why + "</div>";
            if (colorChip && colorChip.note) {
                html +=
                    '<div class="worksheet-item-palette-note"><strong>For your ' +
                    selectedPalette +
                    " palette:</strong> " +
                    colorChip.note +
                    "</div>";
            }
            html += "</div>";
        }
        html += "</div></div>";
        return html;
    }

    // 🆕 Combinator Logic
    var outfitsHTML = "";
    if (template.outfits && template.outfits.length > 0) {
        outfitsHTML += '<div class="worksheet-section" style="margin-top: 2rem;">';
        outfitsHTML +=
            '<div class="worksheet-section-header"><h3 class="worksheet-section-title">Signature Combinations</h3></div>';
        outfitsHTML +=
            '<p class="worksheet-section-intro">Here is how to deploy your foundation pieces together.</p>';
        outfitsHTML += '<div class="worksheet-outfits-grid">';

        for (var o = 0; o < template.outfits.length; o++) {
            var outfit = template.outfits[o];

            // Look up item names
            var itemNames = [];
            var outfitCheckedCount = 0;

            for (var k = 0; k < outfit.items.length; k++) {
                var reqId = outfit.items[k];
                var foundItem =
                    foundationItems.find(function (i) {
                        return i.id === reqId;
                    }) ||
                    refinementItems.find(function (i) {
                        return i.id === reqId;
                    });
                if (foundItem) {
                    itemNames.push(foundItem.item);
                    if (checklist[reqId] && checklist[reqId].checked)
                        outfitCheckedCount++;
                }
            }

            var isOutfitReady = outfitCheckedCount === itemNames.length;
            var outfitStatusClass = isOutfitReady ? "outfit-ready" : "outfit-pending";
            var outfitStatusText = isOutfitReady
                ? "✓ Ready to Wear"
                : outfitCheckedCount + "/" + itemNames.length + " Acquired";

            outfitsHTML +=
                '<div class="worksheet-outfit-card ' + outfitStatusClass + '">';
            outfitsHTML +=
                '<div class="worksheet-outfit-meta"><span class="outfit-tag">Capsule</span><span class="outfit-status">' +
                outfitStatusText +
                "</span></div>";
            outfitsHTML +=
                '<h4 class="worksheet-outfit-title">' + outfit.name + "</h4>";
            outfitsHTML +=
                '<p class="worksheet-outfit-context">' + outfit.context + "</p>";
            outfitsHTML += '<ul class="worksheet-outfit-list">';
            for (var n = 0; n < itemNames.length; n++) {
                outfitsHTML += "<li>" + itemNames[n] + "</li>";
            }
            outfitsHTML += "</ul></div>";
        }
        outfitsHTML += "</div></div>";
    }

    // 🆕 Rules Logic
    var rulesHTML = "";
    // 🆕 Principles Logic
    var rulesHTML = "";
    var lensRules = getLensRules(garmentDrawLabel);
    if (lensRules && lensRules.length > 0) {
        rulesHTML += '<div class="worksheet-rules-card">';
        rulesHTML +=
            '<div class="worksheet-rules-header"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg> Sartorial Principles</div>';
        rulesHTML +=
            '<p class="worksheet-rules-intro">With a focus on <strong>' +
            garmentDrawLabel +
            "</strong>, keep these guiding principles in mind as you build your wardrobe:</p>";
        rulesHTML += '<ul class="worksheet-rules-list">';

        for (var r = 0; r < lensRules.length; r++) {
            rulesHTML += "<li>" + lensRules[r] + "</li>";
        }
        rulesHTML += "</ul></div>";
    }

    // Render foundation
    var foundationHTML = '<div class="worksheet-section">';
    foundationHTML +=
        '<div class="worksheet-section-header"><h3 class="worksheet-section-title">Foundation Pieces</h3>';
    foundationHTML +=
        '<span class="worksheet-section-count">' +
        foundationChecked +
        " / " +
        foundationItems.length +
        " complete</span></div>";
    foundationHTML += '<div class="worksheet-items">';
    for (var i = 0; i < foundationItems.length; i++) {
        var state = checklist[foundationItems[i].id] || {
            checked: false,
            expanded: false,
        };
        foundationHTML += buildItemHTML(
            foundationItems[i],
            state.checked,
            state.expanded
        );
    }
    foundationHTML += "</div></div>";

    // Render refinements
    var refinementsHTML = '<div class="worksheet-section">';
    refinementsHTML +=
        '<div class="worksheet-section-header"><h3 class="worksheet-section-title">Refinements</h3>';
    refinementsHTML +=
        '<span class="worksheet-section-count">' +
        refinementChecked +
        " / " +
        refinementItems.length +
        " complete</span></div>";
    refinementsHTML += '<div class="worksheet-items">';
    for (var j = 0; j < refinementItems.length; j++) {
        var rState = checklist[refinementItems[j].id] || {
            checked: false,
            expanded: false,
        };
        refinementsHTML += buildItemHTML(
            refinementItems[j],
            rState.checked,
            rState.expanded
        );
    }
    refinementsHTML += "</div></div>";

    // Assemble Page
    var html = '<div class="worksheet-shell">';
    html +=
        '<div class="worksheet-header"><div class="worksheet-eyebrow">Wardrobe Building Strategy</div>';
    html += "<h1>Your Personal Worksheet</h1>";
    html +=
        '<p class="worksheet-intro">A considered checklist tailored to your <strong>' +
        archetype.name +
        "</strong> profile.</p></div>";

    html += rulesHTML; // 🆕 Inject rules at top

    html += '<div class="worksheet-progress-wrap">';
    html += '<div class="worksheet-progress-header">';
    html += '<span class="worksheet-progress-label">Wardrobe Progress</span>';
    html +=
        '<span class="worksheet-progress-value">' +
        checkedItems +
        " / " +
        totalItems +
        " items</span></div>";
    html +=
        '<div class="worksheet-progress-bar"><div class="worksheet-progress-fill" style="width: ' +
        progressPercent +
        '%"></div></div>';
    html += "</div>";

    html += foundationItems.length > 0 ? foundationHTML : "";
    html += refinementItems.length > 0 ? refinementsHTML : "";
    html += outfitsHTML; // 🆕 Inject combinations at bottom

    html += '<div class="worksheet-actions">';
    html +=
        '<button class="button-primary" data-action="export-worksheet">Export Worksheet</button>';
    html += '<button data-action="back">Back to Result</button>';
    html += "</div></div>";

    return html;
}

function exportWorksheetPDF() {
    if (
        typeof html2canvas === "undefined" ||
        typeof window.jspdf === "undefined"
    ) {
        alert("Export libraries not loaded. Please refresh and try again.");
        return;
    }

    var archetypeKey = appState.archetypeKey;
    var archetype = archetypeProfiles[archetypeKey];
    var template = getWardrobeTemplate(archetypeKey);
    var checklist = appState.wardrobeChecklist || {};
    var clientName = appState.clientName || "Client";
    var selectedPalette = appState.selPalette || "";
    var selectedClimate = appState.selClimate || "";
    var garmentDrawLabel = getGarmentDrawLabel();

    var foundationItems = filterItemsByClimate(
        template.foundation,
        selectedClimate
    );
    var refinementItems = filterItemsByClimate(
        template.refinements,
        selectedClimate
    );
    foundationItems.sort(function (a, b) {
        return a.priority - b.priority;
    });
    refinementItems.sort(function (a, b) {
        return a.priority - b.priority;
    });

    var printContent = '<div class="worksheet-export-card">';

    // Header
    printContent += '<div class="worksheet-export-header">';
    printContent +=
        '<div class="worksheet-export-brand">Benjamin Barker Studios</div>';
    printContent +=
        '<div class="worksheet-export-title">Wardrobe Strategy Worksheet</div>';
    printContent +=
        '<div class="worksheet-export-client">' + clientName + "</div>";
    printContent +=
        '<div class="worksheet-export-archetype">' + archetype.name + "</div>";
    printContent += "</div>";

    // 🆕 Principles
    var lensRules = getLensRules(garmentDrawLabel);
    if (lensRules.length > 0) {
        printContent += '<div class="worksheet-export-section">';
        printContent +=
            '<div class="worksheet-export-section-title">Sartorial Principles (' +
            garmentDrawLabel +
            ")</div>";

        for (var r = 0; r < lensRules.length; r++) {
            printContent +=
                '<div class="worksheet-export-item" style="border:none; padding-bottom:4px;">• ' +
                lensRules[r] +
                "</div>";
        }
        printContent += "</div>";
    }

    // Items
    printContent += '<div class="worksheet-export-section">';
    printContent +=
        '<div class="worksheet-export-section-title">Phase 1: Foundation Pieces</div>';
    for (var i = 0; i < foundationItems.length; i++) {
        var item = foundationItems[i];
        var checked = checklist[item.id] && checklist[item.id].checked ? "☑" : "☐";
        var cNote = getColorChipForItem(item, selectedPalette)
            ? " (" + getColorChipForItem(item, selectedPalette).note + ")"
            : "";
        var millNote = item.mills
            ? '<div style="font-size:11px; color:#8a5a3b; margin-left:18px;">Source: ' +
            item.mills +
            "</div>"
            : "";
        printContent +=
            '<div class="worksheet-export-item"><strong>' +
            item.priority +
            ".</strong> " +
            checked +
            " " +
            item.item +
            cNote +
            millNote +
            "</div>";
    }
    printContent += "</div>";

    printContent += '<div class="worksheet-export-section">';
    printContent +=
        '<div class="worksheet-export-section-title">Phase 2: Refinements</div>';
    for (var j = 0; j < refinementItems.length; j++) {
        var refItem = refinementItems[j];
        var rChecked =
            checklist[refItem.id] && checklist[refItem.id].checked ? "☑" : "☐";
        var rcNote = getColorChipForItem(refItem, selectedPalette)
            ? " (" + getColorChipForItem(refItem, selectedPalette).note + ")"
            : "";
        var rMillNote = refItem.mills
            ? '<div style="font-size:11px; color:#8a5a3b; margin-left:18px;">Source: ' +
            refItem.mills +
            "</div>"
            : "";
        printContent +=
            '<div class="worksheet-export-item"><strong>' +
            refItem.priority +
            ".</strong> " +
            rChecked +
            " " +
            refItem.item +
            rcNote +
            rMillNote +
            "</div>";
    }
    printContent += "</div>";

    // 🆕 Combinations
    if (template.outfits && template.outfits.length > 0) {
        printContent += '<div class="worksheet-export-section">';
        printContent +=
            '<div class="worksheet-export-section-title">Signature Combinations</div>';
        for (var o = 0; o < template.outfits.length; o++) {
            var outfit = template.outfits[o];
            printContent +=
                '<div class="worksheet-export-item" style="border:none; padding-bottom:8px;">';
            printContent += "<strong>" + outfit.name + ":</strong> " + outfit.context;
            printContent += "</div>";
        }
        printContent += "</div>";
    }

    printContent +=
        '<div class="worksheet-export-footer">benjaminbarkerstudios.com</div>';
    printContent += "</div>";

    var tempContainer = document.createElement("div");
    tempContainer.innerHTML = printContent;
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = "800px";
    document.body.appendChild(tempContainer);

    setTimeout(function () {
        html2canvas(tempContainer, { scale: 3, backgroundColor: "#ffffff" }).then(
            function (canvas) {
                var imgWidth = 210;
                var imgHeight = (canvas.height * imgWidth) / canvas.width;
                var pdf = new window.jspdf.jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                });
                pdf.addImage(
                    canvas.toDataURL("image/jpeg", 1.0),
                    "JPEG",
                    0,
                    0,
                    imgWidth,
                    imgHeight
                );
                pdf.save(
                    "BBS-Wardrobe-Strategy-" + clientName.replace(/\s+/g, "") + ".pdf"
                );
                document.body.removeChild(tempContainer);
            }
        );
    }, 100);
}

// ============================================
// RENDER GUIDE — router
// ============================================

function renderGuide() {
    var node = getGuideNode(appState.guidePath);
    if (!node) return "<p>Content not found.</p>";
    if (node.type === "topic") return renderTopic(node);
    if (appState.guidePath.length === 0) return renderGuideHome(node);
    return renderGroup(node);
}

// ============================================
// RENDER GUIDE HOME
// ============================================

function renderGuideHome(node) {
    var childrenHTML = "";
    var index = 0;
    for (var key in node.children) {
        index++;
        var child = node.children[key];
        var indexLabel = index < 10 ? "0" + index : "" + index;
        childrenHTML +=
            '<div class="guide-list-item-v2" data-action="navigate-child" data-child="' +
            key +
            '">' +
            '<div class="guide-list-item-v2-index">' +
            indexLabel +
            "</div>" +
            '<div class="guide-list-item-v2-body"><div class="guide-list-item-v2-title">' +
            child.title +
            '</div><div class="guide-list-item-v2-intro">' +
            child.intro +
            "</div></div>" +
            '<div class="guide-list-item-v2-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>' +
            "</div>";
    }

    return (
        '<div class="guide-shell-v2">' +
        '<div class="guide-hero-v2"><div class="guide-eyebrow-v2">The BBS Guide</div><h1>Enter the BBS Guide</h1><p class="guide-lead-v2">A calm way to explore tailoring, cloth, colour, and the broader BBS point of view. Read selectively, or move through the guide at your own pace.</p></div>' +
        '<div class="guide-list-v2">' +
        childrenHTML +
        "</div>" +
        '<div class="nav-buttons"><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

// ============================================
// RENDER GROUP
// ============================================

function renderGroup(node) {
    var breadcrumb = getBreadcrumb(appState.guidePath);
    var childrenHTML = "";
    var childCount = 0;
    var index = 0;

    for (var key in node.children) {
        childCount++;
        index++;
        var child = node.children[key];
        var childTypeLabel = child.type === "group" ? "Section" : "Topic";
        var indexLabel = index < 10 ? "0" + index : "" + index;

        childrenHTML +=
            '<div class="guide-list-item-v2" data-action="navigate-child" data-child="' +
            key +
            '">' +
            '<div class="guide-list-item-v2-index">' +
            indexLabel +
            "</div>" +
            '<div class="guide-list-item-v2-body"><div class="guide-list-item-v2-kind">' +
            childTypeLabel +
            '</div><div class="guide-list-item-v2-title">' +
            child.title +
            '</div><div class="guide-list-item-v2-intro">' +
            child.intro +
            "</div></div>" +
            '<div class="guide-list-item-v2-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>' +
            "</div>";
    }

    return (
        '<div class="guide-shell-v2">' +
        '<div class="breadcrumb" style="margin-bottom: 1.5rem;">' +
        breadcrumb +
        "</div>" +
        '<div class="guide-hero-v2"><h1>' +
        node.title +
        '</h1><p class="guide-lead-v2">' +
        node.intro +
        '</p><div class="guide-count-v2">' +
        childCount +
        " item" +
        (childCount === 1 ? "" : "s") +
        "</div></div>" +
        '<div class="guide-list-v2">' +
        childrenHTML +
        "</div>" +
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

// ============================================
// RENDER TOPIC
// ============================================

function renderTopic(node) {
    var breadcrumb = getBreadcrumb(appState.guidePath);

    var sectionsHTML = '<div class="topic-spec-sheet">';
    for (var i = 0; i < node.sections.length; i++) {
        var section = node.sections[i];
        sectionsHTML +=
            '<div class="topic-spec-row"><div class="topic-spec-label">' +
            section.heading +
            '</div><div class="topic-spec-value">' +
            section.body +
            "</div></div>";
    }
    sectionsHTML += "</div>";

    var relatedTopics =
        typeof getRelatedTopics === "function"
            ? getRelatedTopics(appState.guidePath, 3)
            : [];
    var relatedHTML = "";
    if (relatedTopics.length > 0) {
        relatedHTML +=
            '<div class="topic-related-section"><div class="topic-related-header">Explore Further</div><div class="card-grid">';
        for (var j = 0; j < relatedTopics.length; j++) {
            var rt = relatedTopics[j];
            var rtPathJson = JSON.stringify(rt.path);
            var typeLabel =
                typeof getTopicKindLabel === "function"
                    ? getTopicKindLabel(rt.topic_kind || "guide")
                    : rt.topic_kind || "Guide";
            var contextLabel =
                typeof getTopicContextLabel === "function"
                    ? getTopicContextLabel(rt)
                    : "";
            var cleanPath = rt.path.join(" / ");
            relatedHTML +=
                '<div class="topic-related-card" data-action="result-link" data-path=\'' +
                rtPathJson +
                "'>" +
                '<div class="topic-related-meta"><span class="topic-related-type">' +
                typeLabel +
                "</span>" +
                (contextLabel
                    ? '<span class="topic-related-context">' + contextLabel + "</span>"
                    : "") +
                "</div>" +
                '<h3 class="topic-related-title">' +
                rt.title +
                "</h3>" +
                '<div class="topic-related-path">' +
                cleanPath +
                "</div>" +
                '<p class="topic-related-intro">' +
                rt.intro +
                "</p>" +
                "</div>";
        }
        relatedHTML += "</div></div>";
    }

    var metadataHTML = "";
    if (node.metadata) {
        var metaItems = [];
        var iconClimate =
            '<svg class="topic-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>';
        var iconFormality =
            '<svg class="topic-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 12l10 10 10-10L12 2z"></path></svg>';
        var iconVersatility =
            '<svg class="topic-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>';
        var iconSignature =
            '<svg class="topic-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

        if (node.metadata.climate && node.metadata.climate.length) {
            var climateText = node.metadata.climate
                .map(function (c) {
                    return c
                        .split("_")
                        .map(function (w) {
                            return w.charAt(0).toUpperCase() + w.slice(1);
                        })
                        .join(" ");
                })
                .join(", ");
            metaItems.push(
                '<div class="topic-meta-card"><div class="topic-meta-card-header">' +
                iconClimate +
                '<span>Climate</span></div><div class="topic-meta-card-value">' +
                climateText +
                "</div></div>"
            );
        }
        if (node.metadata.formality && node.metadata.formality.length) {
            var formalityText = node.metadata.formality
                .map(function (f) {
                    return f
                        .split("_")
                        .map(function (w) {
                            return w.charAt(0).toUpperCase() + w.slice(1);
                        })
                        .join(" ");
                })
                .join(", ");
            metaItems.push(
                '<div class="topic-meta-card"><div class="topic-meta-card-header">' +
                iconFormality +
                '<span>Formality</span></div><div class="topic-meta-card-value">' +
                formalityText +
                "</div></div>"
            );
        }
        if (node.metadata.versatility) {
            metaItems.push(
                '<div class="topic-meta-card"><div class="topic-meta-card-header">' +
                iconVersatility +
                '<span>Versatility</span></div><div class="topic-meta-card-value">' +
                node.metadata.versatility +
                " / 5</div></div>"
            );
        }
        if (node.metadata.bbs_signature) {
            metaItems.push(
                '<div class="topic-meta-card topic-meta-card--signature"><div class="topic-meta-card-header">' +
                iconSignature +
                '<span>BBS Signature</span></div><div class="topic-meta-card-value">Signature Piece</div></div>'
            );
        }
        if (metaItems.length > 0)
            metadataHTML =
                '<div class="topic-meta-grid">' + metaItems.join("") + "</div>";
    }

    var imageHTML = "";
    if (
        node.metadata &&
        node.metadata.image_refs &&
        node.metadata.image_refs.length > 0
    ) {
        imageHTML =
            '<div class="topic-image-editorial"><img src="' +
            node.metadata.image_refs +
            '" alt="' +
            node.title +
            ' reference image" loading="lazy"></div>';
    }

    var topicKindLabel = "";
    if (node.topic_kind) {
        var kindMap2 = {
            garment: "Garment",
            fabric: "Fabric",
            garment_detail: "Garment Detail",
            wardrobe_strategy: "Wardrobe Strategy",
            brand_philosophy: "Brand Philosophy",
            fabric_reference: "Fabric Reference",
            guide: "Guide",
        };
        topicKindLabel = kindMap2[node.topic_kind] || node.topic_kind;
    }

    return (
        '<div class="topic-shell">' +
        '<div class="breadcrumb" style="margin-bottom: 1.5rem;">' +
        breadcrumb +
        "</div>" +
        '<div class="topic-hero-editorial">' +
        (topicKindLabel
            ? '<div class="topic-type-badge">' + topicKindLabel + "</div>"
            : "") +
        "<h1>" +
        node.title +
        '</h1><p class="topic-intro-app">' +
        node.intro +
        "</p></div>" +
        metadataHTML +
        imageHTML +
        sectionsHTML +
        relatedHTML +
        '<div class="nav-buttons" style="margin-top: 3rem;"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

// ============================================
// RENDER — main router
// ============================================

// ============================================
// RENDER — MAIN ROUTER
// ============================================

function render(options) {
    // 🌟 AUTO-SAVE TO IPAD MEMORY ON EVERY SCREEN CHANGE
    localStorage.setItem("bbs_session", JSON.stringify(appState));

    options = options || {};
    var animate = options.animate !== false;
    var app = document.getElementById("app");
    var content = "";

    if (animate) {
        window.scrollTo(0, 0);
    }

    switch (appState.view) {
        case "welcome":
            content = renderWelcome();
            break;
        case "home":
            content = renderHome();
            break;
        case "discover":
            content = renderDiscover();
            break;
        case "onboarding":
            content = renderOnboarding();
            break;
        case "result":
            content = renderResult();
            break;
        case "guide":
            content = renderGuide();
            break;
        case "colour-direction":
            content = renderColourDirection();
            break;
        case "colour-result":
            content = renderColourDirectionResult();
            break;
        case "lookbook": // 🌟 THE NEW LOOKBOOK ROUTE
            content = renderLookbook();
            break;
        case "worksheet": // 🆕 ADD THIS CASE
            content = renderWorksheet();
            break;
        default:
            content = appState.clientName ? renderHome() : renderWelcome();
    }

    if (!animate) {
        app.innerHTML = content;
        syncFabVisibility();
        if (appState.view === "welcome") {
            var immediateInput = document.getElementById("client-name-input");
            if (immediateInput) {
                setTimeout(function () {
                    immediateInput.focus();
                }, 50);
            }
        }
        return;
    }

    app.classList.add("is-transitioning");
    setTimeout(function () {
        app.innerHTML = content;
        syncFabVisibility();
        if (appState.view === "welcome") {
            var nameInput = document.getElementById("client-name-input");
            if (nameInput) {
                setTimeout(function () {
                    nameInput.focus();
                }, 50);
            }
        }
        app.classList.remove("is-transitioning");
    }, 120);
}

// ============================================
// CLICK EVENT HANDLER
// ============================================

var _logoTapCount = 0;
var _logoTapTimer = null;

document.body.addEventListener("click", function (e) {
    // 🌟 THE HIDDEN STAFF RESET: Double-tap the logo to wipe the app
    var logoEl = e.target.closest(".bbs-logo");
    if (logoEl) {
        _logoTapCount++;
        clearTimeout(_logoTapTimer);

        if (_logoTapCount >= 2) {
            localStorage.removeItem("bbs_session");
            appState = getFreshState(); // 🌟 Pure, clean wipe
            render({ animate: true });
            _logoTapCount = 0;
            return;
        }

        _logoTapTimer = setTimeout(function () {
            _logoTapCount = 0;
        }, 400);

        return;
    }

    var target = e.target.closest("[data-action]");
    if (!target) return;

    var action = target.dataset.action;

    if (action === "discover") {
        navigateDiscover();
    } else if (action === "guide") {
        navigateGuide([]);
    } else if (action === "quick-query") {
        // 🌟 QUICK QUERY COMMAND BAR ACTION
        var queryType = target.dataset.query;
        var panel = document.getElementById("discovery-panel");

        if (panel && !panel.classList.contains("open")) {
            toggleDiscovery();
        }

        if (typeof runQuery === "function") {
            runQuery(queryType);
        }
    } else if (action === "back") {
        navigateBack();
    } else if (action === "home") {
        navigateHome();
    } else if (action === "save-name") {
        var input = document.getElementById("client-name-input");
        if (input && input.value.trim()) {
            saveClientName(input.value);
        }
    } else if (action === "change-name") {
        clearClientName();
    } else if (action === "quiz-pick") {
        var idx = parseInt(target.dataset.index, 10);
        var questionIds = getCurrentQuizPath();
        var questionMap = getArchetypeQuestionMap();
        var currentQuestionId = questionIds[appState.quizStep];
        var currentQuestion = questionMap[currentQuestionId];

        var previousClimate = appState.selClimate || "";
        var previousGarmentDraw = appState.quizAnswersById
            ? appState.quizAnswersById["garment_draw"]
            : null;
        var previousWardrobePriority = appState.quizAnswersById
            ? appState.quizAnswersById["wardrobe_priority"]
            : null;

        if (
            !appState.quizAnswersById ||
            typeof appState.quizAnswersById !== "object"
        ) {
            appState.quizAnswersById = {};
        }

        appState.quizAnswersById[currentQuestionId] = idx;

        if (
            currentQuestionId === "climate" &&
            currentQuestion &&
            currentQuestion.opts &&
            currentQuestion.opts[idx]
        ) {
            appState.selClimate = currentQuestion.opts[idx].b;
        }

        var needsFullRender = false;

        if (
            currentQuestionId === "climate" &&
            appState.selClimate !== previousClimate
        ) {
            delete appState.quizAnswersById["polished_dressing"];
            delete appState.quizAnswersById["polished_dressing_warm"];
            delete appState.quizAnswersById["polished_dressing_temperate"];
            delete appState.quizAnswersById["wardrobe_role"];
            delete appState.quizAnswersById["wardrobe_role_longevity"];
            delete appState.quizAnswersById["wardrobe_role_versatility"];
            delete appState.quizAnswersById["wardrobe_role_heritage"];
            delete appState.quizAnswersById["wardrobe_role_ease"];
            appState.quizPath = getResolvedQuizPath();
            needsFullRender = true;
        }

        if (currentQuestionId === "garment_draw" && idx !== previousGarmentDraw) {
            delete appState.quizAnswersById["cloth_preference"];
            delete appState.quizAnswersById["silhouette_preference"];
            delete appState.quizAnswersById["detail_preference"];
            delete appState.quizAnswersById["wardrobe_building_preference"];
            delete appState.quizAnswersById["wardrobe_priority"];
            delete appState.quizAnswersById["wardrobe_role"];
            delete appState.quizAnswersById["wardrobe_role_longevity"];
            delete appState.quizAnswersById["wardrobe_role_versatility"];
            delete appState.quizAnswersById["wardrobe_role_heritage"];
            delete appState.quizAnswersById["wardrobe_role_ease"];
            delete appState.quizAnswersById["polished_dressing"];
            delete appState.quizAnswersById["polished_dressing_warm"];
            delete appState.quizAnswersById["polished_dressing_temperate"];
            appState.quizPath = getResolvedQuizPath();
            needsFullRender = true;
        }

        if (
            currentQuestionId === "wardrobe_priority" &&
            idx !== previousWardrobePriority
        ) {
            delete appState.quizAnswersById["wardrobe_role"];
            delete appState.quizAnswersById["wardrobe_role_longevity"];
            delete appState.quizAnswersById["wardrobe_role_versatility"];
            delete appState.quizAnswersById["wardrobe_role_heritage"];
            delete appState.quizAnswersById["wardrobe_role_ease"];
            appState.quizPath = getResolvedQuizPath();
            needsFullRender = true;
        }

        if (!needsFullRender) {
            var allOpts = document.querySelectorAll(".arch-opt");
            for (var i = 0; i < allOpts.length; i++) {
                allOpts[i].classList.remove("sel");
            }

            var clickedOption = target.closest(".arch-opt");
            if (clickedOption) {
                clickedOption.classList.add("sel");
            }

            var nextBtn = document.querySelector(".arch-btn-next");
            if (nextBtn) {
                nextBtn.disabled = false;
            }
            // 🌟 FORCE SAVE TO IPAD MEMORY INSTANTLY
            localStorage.setItem("bbs_session", JSON.stringify(appState));
        } else {
            render({ animate: false });
        }
    } else if (action === "quiz-next") {
        var questionIds = getCurrentQuizPath();
        var currentQuestionId = questionIds[appState.quizStep];
        var currentAnswer =
            appState.quizAnswersById &&
                appState.quizAnswersById[currentQuestionId] !== undefined
                ? appState.quizAnswersById[currentQuestionId]
                : null;

        if (currentAnswer === null || currentAnswer === undefined) {
            return;
        }

        if (appState.quizStep < questionIds.length - 1) {
            appState.quizStep = appState.quizStep + 1;
            render({ animate: false });
        } else {
            appState.view = "onboarding";
            render({ animate: true });
        }
    } else if (action === "onboard-focus") {
        appState.selFocus = target.dataset.value;
        appState.selFit = "";
        render({ animate: false });
    } else if (action === "onboard-fit") {
        appState.selFit = target.dataset.value;
        render({ animate: false });
    } else if (action === "onboard-palette") {
        appState.selPalette = target.dataset.value;
        render({ animate: false });
    } else if (action === "onboard-colour-use") {
        appState.selColourUse = target.dataset.value;
        render({ animate: false });
    } else if (action === "onboard-submit") {
        var nameInputEl = document.getElementById("onboard-name-input");
        if (nameInputEl && nameInputEl.value.trim()) {
            appState.clientName = formatClientName(nameInputEl.value);
        }

        if (
            !appState.clientName ||
            !appState.selFocus ||
            !appState.selFit ||
            !appState.selPalette ||
            !appState.selColourUse
        ) {
            return;
        }

        // Store archetype key for worksheet
        var rawScores = scoreArchetypeAnswers();
        var scores = applyOnboardingArchetypeAdjustments(rawScores);
        var primaryKey = "s";
        var highestScore = -1;
        for (var key in scores) {
            if (scores[key] > highestScore) {
                primaryKey = key;
                highestScore = scores[key];
            }
        }
        appState.archetypeKey = primaryKey;

        appState.view = "result";
        render({ animate: true });
    } else if (action === "colour-pick") {
        var colourIdx = parseInt(target.dataset.index, 10);
        var colourQuestion = colourDirectionQuestions[appState.colourStep];

        appState.colourAnswersById[colourQuestion.id] = colourIdx;

        var allColourOpts = document.querySelectorAll(
            ".arch-opt, .arch-opt--colour"
        );
        for (var i = 0; i < allColourOpts.length; i++) {
            allColourOpts[i].classList.remove("sel");
        }

        var clickedOption = target.closest(".arch-opt, .arch-opt--colour");
        if (clickedOption) {
            clickedOption.classList.add("sel");
        }

        var nextBtn = document.querySelector(".arch-btn-next");
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        // 🌟 FORCE SAVE TO IPAD MEMORY INSTANTLY WITHOUT FLICKERING
        localStorage.setItem("bbs_session", JSON.stringify(appState));
    } else if (action === "colour-next") {
        var currentColourQuestion = colourDirectionQuestions[appState.colourStep];
        var currentColourAnswer =
            appState.colourAnswersById &&
                appState.colourAnswersById[currentColourQuestion.id] !== undefined
                ? appState.colourAnswersById[currentColourQuestion.id]
                : null;

        if (currentColourAnswer === null || currentColourAnswer === undefined) {
            return;
        }

        if (appState.colourStep < colourDirectionQuestions.length - 1) {
            appState.colourStep++;
            render({ animate: false });
        } else {
            appState.view = "colour-result";
            render({ animate: true });
        }
    } else if (action === "colour-back") {
        if (appState.colourStep > 0) {
            appState.colourStep--;
            render({ animate: false });
        } else {
            navigateHome();
        }
    } else if (action === "colour-restart") {
        // 🌟 WIPE COLOUR MEMORY SO IT DOES NOT "RESUME"
        appState.colourStep = 0;
        appState.colourAnswersById = {};
        appState.colourResultKey = null;
        localStorage.setItem("bbs_session", JSON.stringify(appState));

        navigateColourDirection();
    } else if (action === "style-restart") {
        // Wipe all Style Direction memory so it does not "Resume"
        appState.quizStep = 0;
        appState.quizAnswers = [];
        appState.quizAnswersById = {};
        appState.selFocus = "";
        appState.selFit = "";
        appState.selPalette = "";
        appState.selColourUse = "";
        appState.selClimate = "";
        appState.archetypeKey = null;

        // Save the wiped state instantly
        localStorage.setItem("bbs_session", JSON.stringify(appState));

        // Launch a fresh quiz
        navigateDiscover();
    } else if (action === "result-link") {
        var path = JSON.parse(target.dataset.path);
        navigateGuide(path);
    } else if (action === "navigate-child") {
        var childKey = target.dataset.child;
        var newPath = appState.guidePath.slice();
        newPath.push(childKey);
        navigateGuide(newPath);
    } else if (action === "save-card") {
        var card = document.getElementById("arch-style-card");
        if (!card) {
            alert("Tip: Take a screenshot of your style card!");
            return;
        }
        if (typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
            alert("Export libraries not loaded. Please refresh and try again.");
            return;
        }

        var filePrefix =
            appState.view === "result"
                ? "BBS-Style-Archetype-"
                : "BBS-Colour-Direction-";
        var clientName = appState.clientName
            ? appState.clientName.replace(/\s+/g, "")
            : "Profile";

        card.classList.add("is-exporting");

        setTimeout(function () {
            html2canvas(card, {
                scale: 4,
                backgroundColor: "#050505",
                useCORS: true,
                logging: false,
                windowWidth: card.scrollWidth,
                windowHeight: card.scrollHeight,
            })
                .then(function (canvas) {
                    try {
                        // Calculate PDF dimensions to match card aspect ratio
                        var imgWidth = 210; // A4 width in mm
                        var imgHeight = (canvas.height * imgWidth) / canvas.width;

                        // Determine orientation based on aspect ratio
                        var orientation = imgHeight > imgWidth ? "portrait" : "landscape";

                        // Create PDF
                        var pdf = new window.jspdf.jsPDF({
                            orientation: orientation,
                            unit: "mm",
                            format: "a4",
                        });

                        var imgData = canvas.toDataURL("image/jpeg", 1.0);

                        // Center the card on the page if smaller than A4
                        var xOffset = 0;
                        var yOffset = 0;

                        var pageHeight = orientation === "portrait" ? 297 : 210;

                        if (imgHeight < pageHeight) {
                            yOffset = (pageHeight - imgHeight) / 2;
                        } else {
                            // If card is taller than page, scale to fit
                            imgHeight = pageHeight - 20; // 10mm margin top/bottom
                            imgWidth = (canvas.width * imgHeight) / canvas.height;
                            yOffset = 10;

                            if (imgWidth > 210) {
                                imgWidth = 190; // 10mm margin left/right
                                imgHeight = (canvas.height * imgWidth) / canvas.width;
                                xOffset = 10;
                            }
                        }

                        pdf.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight);
                        pdf.save(filePrefix + clientName + ".pdf");

                        card.classList.remove("is-exporting");
                    } catch (err) {
                        card.classList.remove("is-exporting");
                        console.error("PDF generation failed:", err);
                        alert("Could not generate PDF. Please take a screenshot instead.");
                    }
                })
                .catch(function (err) {
                    card.classList.remove("is-exporting");
                    console.error("Canvas rendering failed:", err);
                    alert("Export failed. Please take a screenshot of your style card.");
                });
        }, 250);
    } else if (action === "book-visit") {
        window.open(
            "https://www.benjaminbarkerstudios.com/pages/studios",
            "_blank"
        );
    } else if (action === "show-qr") {
        // Generate link from state
        var link = generateShareLink();
        var modal = document.getElementById("qr-modal");

        if (modal && typeof QRious !== "undefined") {
            // Clear old canvas
            var canvas = document.getElementById('qr-canvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw fresh QR Code
            new QRious({
                element: canvas,
                value: link,
                size: 240, // High-res size for easy scanning
                background: '#ffffff',
                foreground: '#050505',
                level: 'M' // Medium error correction (cleaner look)
            });

            // Animate modal in
            modal.classList.add('is-visible');
        } else {
            alert("QR Library failed to load. Please check your connection.");
        }

    } else if (action === "close-qr") {
        // Hide modal
        var modal = document.getElementById("qr-modal");
        if (modal) {
            modal.classList.remove('is-visible');
        }
    } else if (action === "worksheet") {
        navigateWorksheet();
    } else if (action === "toggle-item") {
        var itemId = target.dataset.itemId;
        if (!itemId) return;

        if (!appState.wardrobeChecklist) {
            appState.wardrobeChecklist = {};
        }

        if (!appState.wardrobeChecklist[itemId]) {
            appState.wardrobeChecklist[itemId] = { checked: false, expanded: false };
        }

        appState.wardrobeChecklist[itemId].checked = !appState.wardrobeChecklist[itemId].checked;

        localStorage.setItem('bbs_session', JSON.stringify(appState));
        render({ animate: false });

    } else if (action === "toggle-why") {
        e.stopPropagation();
        var itemId = target.dataset.itemId;
        if (!itemId) return;

        if (!appState.wardrobeChecklist) {
            appState.wardrobeChecklist = {};
        }

        if (!appState.wardrobeChecklist[itemId]) {
            appState.wardrobeChecklist[itemId] = { checked: false, expanded: false };
        }

        appState.wardrobeChecklist[itemId].expanded = !appState.wardrobeChecklist[itemId].expanded;

        var itemEl = document.querySelector('.worksheet-item[data-item-id="' + itemId + '"]');
        if (itemEl) {
            itemEl.classList.toggle('expanded');
        }

        localStorage.setItem('bbs_session', JSON.stringify(appState));

    } else if (action === "worksheet-guide-link") {
        e.stopPropagation();
        var guidePath = JSON.parse(target.dataset.path);
        navigateGuide(guidePath);
    } else if (action === "export-worksheet") {
        exportWorksheetPDF();
    }
});


// ============================================
// KEYBOARD HANDLERS
// ============================================

document.addEventListener("keydown", function (e) {
    if (appState.view === "welcome" && e.key === "Enter") {
        var input = document.getElementById("client-name-input");
        if (input && input.value.trim()) saveClientName(input.value);
    }
});

// ============================================
// INPUT HANDLER — onboarding name field
// ============================================

document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "onboard-name-input") {
        var val = e.target.value.trim();
        appState.clientName =
            val.length > 0 ? formatClientName(e.target.value) : "";
        var submitBtn = document.querySelector("[data-action='onboard-submit']");
        if (submitBtn) {
            var canGo =
                appState.clientName.length > 0 &&
                appState.selFocus !== "" &&
                appState.selFit !== "" &&
                appState.selPalette !== "" &&
                appState.selColourUse !== "";
            submitBtn.disabled = !canGo;
        }
    }
});

// ============================================
// COLOUR DIRECTION HELPERS
// ==========================================
function navigateColourDirection() {
    // If they already started, resume
    if (
        appState.colourAnswersById &&
        Object.keys(appState.colourAnswersById).length > 0
    ) {
        appState.view = "colour-direction";
        render({ animate: true });
        return;
    }

    // Otherwise, start fresh
    appState.view = "colour-direction";
    appState.colourStep = 0;
    appState.colourAnswersById = {};
    appState.colourResultKey = null;
    render({ animate: true });
}
function renderColourDirectionResult() {
    var scores = scoreColourDirectionAnswers(appState.colourAnswersById);
    var resultKey = getColourDirectionProfileKey(scores);
    var profile = getColourDirectionProfileData(resultKey);

    appState.colourResultKey = resultKey;

    var heroPaletteHTML = '<div class="colour-hero-palette">';
    for (var h = 0; h < profile.bestColours.length; h++) {
        heroPaletteHTML +=
            '<div class="colour-hero-swatch" style="background-color: ' +
            profile.bestColours[h].hex +
            ';" title="' +
            profile.bestColours[h].name +
            '">' +
            '<span class="colour-hero-swatch-name">' +
            profile.bestColours[h].name +
            "</span>" +
            "</div>";
    }
    heroPaletteHTML += "</div>";

    function renderColourList(items) {
        var html = '<div class="colour-result-chip-row">';
        for (var i = 0; i < items.length; i++) {
            html +=
                '<div class="colour-result-chip">' +
                '<span class="colour-result-chip-swatch" style="background-color:' +
                items[i].hex +
                ';"></span>' +
                '<span class="colour-result-chip-label">' +
                items[i].name +
                "</span>" +
                "</div>";
        }
        html += "</div>";
        return html;
    }

    function renderMatchingList(items) {
        var html = '<div class="colour-result-notes">';
        for (var i = 0; i < items.length; i++) {
            html += '<div class="arch-card-note">' + items[i] + "</div>";
        }
        html += "</div>";
        return html;
    }

    var links = getColourExploreLinks(resultKey);
    var linksHTML = "";
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var pathJson = JSON.stringify(link.path);

        var kindMap = {
            garment: "Garment",
            fabric: "Fabric",
            garment_detail: "Detail",
            wardrobe_strategy: "Wardrobe",
            brand_philosophy: "Philosophy",
            fabric_reference: "Mill Reference",
            guide: "Guide",
        };
        var kindLabel = kindMap[link.topic_kind] || "Guide";

        linksHTML +=
            '<div class="arch-explore-card" data-action="result-link" data-path=\'' +
            pathJson +
            "'>" +
            '<span class="arch-explore-kind">' +
            kindLabel +
            "</span>" +
            '<div class="arch-explore-title">' +
            link.title +
            "</div>" +
            '<div class="arch-explore-intro">' +
            (link.intro || "") +
            "</div>" +
            "</div>";
    }

    // 🌟 FIVE BESPOKE SVG ICONS
    var iconFabric =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color: #a8998a; margin-top: 2px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>';
    var iconContrast =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color: #a8998a; margin-top: 2px;"><polygon points="12 2 2 22 22 22"></polygon></svg>';
    var iconHardware =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color: #a8998a; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><circle cx="10" cy="10" r="1"></circle><circle cx="14" cy="10" r="1"></circle><circle cx="10" cy="14" r="1"></circle><circle cx="14" cy="14" r="1"></circle></svg>';
    var iconPattern =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color: #a8998a; margin-top: 2px;"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';
    var iconStrategy =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color: #a8998a; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>';

    return (
        '<div class="arch-result-shell">' +
        '<div class="arch-result-label">Palette Analysis</div>' +
        '<div class="arch-result-name">' +
        (appState.clientName
            ? '<span class="arch-result-client">' + appState.clientName + "</span>"
            : "") +
        '<span class="arch-result-persona">' +
        profile.name +
        "</span>" +
        "</div>" +
        '<div class="arch-result-divider"></div>' +
        '<p class="arch-result-desc">' +
        profile.desc +
        "</p>" +
        '<div class="arch-card-wrap">' +
        '<div class="arch-style-card" id="arch-style-card">' +
        '<div class="arch-card-top">' +
        '<span class="arch-card-brand">Benjamin Barker Studios</span>' +
        '<span class="arch-card-tag">Colour Direction</span>' +
        "</div>" +
        (appState.clientName
            ? '<div class="arch-card-client">Name: ' + appState.clientName + "</div>"
            : "") +
        '<div class="arch-card-persona">' +
        profile.name +
        "</div>" +
        '<div class="arch-card-rule"></div>' +
        heroPaletteHTML +
        '<div class="arch-card-section-label">Best On You</div>' +
        renderColourList(profile.bestColours) +
        '<div class="arch-card-section-label">Strong Neutrals</div>' +
        renderColourList(profile.strongNeutrals) +
        '<div class="arch-card-section-label">Accent Colours</div>' +
        renderColourList(profile.accentColours) +
        // 🌟 THE NEW GAUNTLET OF BESPOKE INSIGHTS
        '<div class="arch-card-section-label" style="margin-top: 1.5rem;">Bespoke Insights</div>' +
        '<div class="bespoke-insight-card">' +
        '<div class="bespoke-insight-header">' +
        iconFabric +
        '<span class="bespoke-insight-title">' +
        profile.fabricFinish.title +
        "</span></div>" +
        '<p class="bespoke-insight-desc">' +
        profile.fabricFinish.desc +
        "</p>" +
        "</div>" +
        '<div class="bespoke-insight-card">' +
        '<div class="bespoke-insight-header">' +
        iconContrast +
        '<span class="bespoke-insight-title">' +
        profile.contrastArchitecture.title +
        "</span></div>" +
        '<p class="bespoke-insight-desc">' +
        profile.contrastArchitecture.desc +
        "</p>" +
        "</div>" +
        '<div class="bespoke-insight-card">' +
        '<div class="bespoke-insight-header">' +
        iconHardware +
        '<span class="bespoke-insight-title">' +
        profile.hardware.title +
        "</span></div>" +
        '<p class="bespoke-insight-desc">' +
        profile.hardware.desc +
        "</p>" +
        "</div>" +
        '<div class="bespoke-insight-card">' +
        '<div class="bespoke-insight-header">' +
        iconPattern +
        '<span class="bespoke-insight-title">' +
        profile.pattern.title +
        "</span></div>" +
        '<p class="bespoke-insight-desc">' +
        profile.pattern.desc +
        "</p>" +
        "</div>" +
        '<div class="bespoke-insight-card">' +
        '<div class="bespoke-insight-header">' +
        iconStrategy +
        '<span class="bespoke-insight-title">' +
        profile.strategy.title +
        "</span></div>" +
        '<p class="bespoke-insight-desc">' +
        profile.strategy.desc +
        "</p>" +
        "</div>" +
        '<div class="arch-card-section-label" style="margin-top: 1.5rem;">Matching Guidance</div>' +
        renderMatchingList(profile.matching) +
        '<div class="arch-card-footer">' +
        '<div class="arch-card-cta-text">Use this as a colour guide in store</div>' +
        '<div class="arch-card-url">benjaminbarkerstudios.com</div>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="arch-card-actions">' +
        '<button class="arch-btn-fill" data-action="save-card">Save Card</button>' +
        '<button class="arch-btn-stroke" data-action="colour-restart">Start Again</button>' +
        "</div>" +
        (links.length > 0
            ? '<div class="arch-explore-section">' +
            '<div class="arch-explore-heading">Explore the BBS Guide</div>' +
            '<p class="arch-explore-intro-text">Deepen your knowledge of the fabrics and strategies suited to your profile.</p>' +
            '<div class="arch-explore-grid">' +
            linksHTML +
            "</div>" +
            "</div>"
            : "") +
        '<div class="arch-result-footer">' +
        '<button class="arch-restart" data-action="home">Back to Home</button>' +
        "</div>" +
        "</div>"
    );
}

// ============================================
// COLOUR DIRECTION NAVIGATION & RENDERING
// ============================================

function navigateColourDirection() {
    // 1. If they already completed the quiz, take them to the Result
    if (appState.colourResultKey) {
        appState.view = "colour-result";
        render({ animate: true });
        return;
    }

    // 2. If they are halfway through, resume the quiz
    if (
        appState.colourAnswersById &&
        Object.keys(appState.colourAnswersById).length > 0
    ) {
        appState.view = "colour-direction";
        render({ animate: true });
        return;
    }

    // 3. Otherwise, start fresh
    appState.view = "colour-direction";
    appState.colourStep = 0;
    appState.colourAnswersById = {};
    appState.colourResultKey = null;
    render({ animate: true });
}

function renderColourDirection() {
    var questionMap = getColourDirectionQuestionMap();
    var q = colourDirectionQuestions[appState.colourStep];
    var stepNum = appState.colourStep + 1;
    var totalSteps = colourDirectionQuestions.length;
    var currentAnswer =
        appState.colourAnswersById && appState.colourAnswersById[q.id] !== undefined
            ? appState.colourAnswersById[q.id]
            : null;
    var isLastStep = appState.colourStep === totalSteps - 1;
    var canContinue = currentAnswer !== null && currentAnswer !== undefined;

    var pipsHTML = '<div class="arch-pips">';
    for (var p = 0; p < totalSteps; p++) {
        var pipClass = "arch-pip";
        if (p < appState.colourStep) {
            pipClass += " on";
        } else if (p === appState.colourStep) {
            pipClass += " cur";
        }
        pipsHTML += '<span class="' + pipClass + '"></span>';
    }
    pipsHTML += "</div>";

    var optionsHTML = '<div class="arch-grid">';

    for (var i = 0; i < q.opts.length; i++) {
        var opt = q.opts[i];
        var selClass = currentAnswer === i ? " sel" : "";
        var swatchHTML = "";

        if (opt.swatches && opt.swatches.length) {
            swatchHTML = '<span class="colour-option-swatches">';
            for (var si = 0; si < opt.swatches.length; si++) {
                swatchHTML +=
                    '<span class="colour-option-swatch" style="background-color: ' +
                    opt.swatches[si] +
                    ';"></span>';
            }
            swatchHTML += "</span>";
        }

        optionsHTML +=
            '<button class="arch-opt arch-opt--colour' +
            selClass +
            '" type="button" ' +
            'data-action="colour-pick" data-index="' +
            i +
            '">' +
            '<span class="arch-opt-copy">' +
            '<span class="arch-opt-main">' +
            opt.a +
            "</span>" +
            '<span class="arch-opt-sub">' +
            opt.b +
            "</span>" +
            "</span>" +
            swatchHTML +
            "</button>";
    }

    optionsHTML += "</div>";

    return (
        '<div class="arch-shell">' +
        pipsHTML +
        '<div class="arch-q-label">Step ' +
        stepNum +
        " of " +
        totalSteps +
        "</div>" +
        '<div class="arch-q-title">' +
        q.text +
        "</div>" +
        (q.helper ? '<p class="arch-q-subtext">' + q.helper + "</p>" : "") +
        optionsHTML +
        '<div class="arch-nav">' +
        '<button class="arch-btn-back" data-action="colour-back"' +
        (appState.colourStep === 0 ? " disabled" : "") +
        ">\u2190 Back</button>" +
        '<button class="arch-btn-home" data-action="home">Home</button>' +
        '<button class="arch-btn-next" data-action="colour-next"' +
        (canContinue ? "" : " disabled") +
        ">" +
        (isLastStep ? "See My Colour Direction \u2192" : "Next \u2192") +
        "</button>" +
        "</div>" +
        "</div>"
    );
}
// ============================================
// URL STATE SHARING (STAFF HANDOFF)
// ============================================

function generateShareLink() {
    var url = window.location.origin + window.location.pathname;
    var params = [];

    if (appState.archetypeKey) {
        params.push("arch=" + encodeURIComponent(appState.archetypeKey));
    }

    if (appState.selPalette) {
        params.push("pal=" + encodeURIComponent(appState.selPalette));
    }

    if (appState.selClimate) {
        params.push("clim=" + encodeURIComponent(appState.selClimate));
    }

    if (appState.selFocus) {
        params.push("focus=" + encodeURIComponent(appState.selFocus));
    }

    if (appState.selFit) {
        params.push("fit=" + encodeURIComponent(appState.selFit));
    }

    if (appState.selColourUse) {
        params.push("colourUse=" + encodeURIComponent(appState.selColourUse));
    }

    if (appState.clientName) {
        params.push("name=" + encodeURIComponent(appState.clientName));
    }

    if (params.length > 0) {
        return url + "?" + params.join("&");
    }

    return url;
}
function parseUrlState() {
    if (!window.location.search) return false;

    try {
        var search = window.location.search.substring(1);
        var params = {};
        var pairs = search.split("&");

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            if (pair.length === 2) {
                params[pair] = decodeURIComponent(pair.replace(/\+/g, " "));
            }
        }

        if (params.arch && archetypeProfiles[params.arch]) {
            appState.archetypeKey = params.arch;
            appState.selPalette = params.pal || "";
            appState.selClimate = params.clim || "";
            appState.selFocus = params.focus || "";
            appState.selFit = params.fit || "";
            appState.selColourUse = params.colourUse || "";
            appState.clientName = params.name || "";

            // Force the app into a completed result state
            appState.view = "result";
            appState.quizStep = 0;
            appState.quizAnswers = [];
            appState.quizAnswersById = {};
            appState.quizPath = getResolvedQuizPath ? getResolvedQuizPath() : [];
            appState.history = [];

            // Clean URL after successful import
            window.history.replaceState({}, document.title, window.location.pathname);

            return true;
        }
    } catch (e) {
        console.error("Failed to parse URL state:", e);
    }

    return false;
}


// ============================================
// URL STATE SHARING & QR CODE GENERATION
// ============================================

function generateShareLink() {
    // Get the exact base URL without any previous parameters
    var url = window.location.origin + window.location.pathname;
    var params = [];

    // Safely encode the profile data into the URL
    if (appState.archetypeKey) params.push('arch=' + encodeURIComponent(appState.archetypeKey));
    if (appState.selPalette) params.push('pal=' + encodeURIComponent(appState.selPalette));
    if (appState.selClimate) params.push('clim=' + encodeURIComponent(appState.selClimate));
    if (appState.clientName) params.push('name=' + encodeURIComponent(appState.clientName));

    if (params.length > 0) {
        return url + '?' + params.join('&');
    }
    return url;
}

function parseUrlState() {
    // If there's no '?' in the URL, return false immediately
    if (!window.location.search) return false;

    try {
        var search = window.location.search.substring(1);
        var params = {};
        var pairs = search.split('&');

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            if (pair.length === 2) {
                // Decode the URL parameters (handles spaces and special characters like '&')
                params[pair] = decodeURIComponent(pair.replace(/\+/g, ' '));
            }
        }

        // If the URL has an 'arch' parameter and it matches a real archetype
        if (params.arch && typeof archetypeProfiles !== 'undefined' && archetypeProfiles[params.arch]) {
            console.log("📥 Loading bespoke profile from QR Code/URL...");

            // Override the app state with the URL data
            appState.archetypeKey = params.arch;
            if (params.pal) appState.selPalette = params.pal;
            if (params.clim) appState.selClimate = params.clim;
            if (params.name) appState.clientName = params.name;

            // Force the view to jump straight to the result card
            appState.view = "result";

            // Clean the URL in the browser bar so it looks professional and doesn't get stuck
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        }
    } catch (e) {
        console.error("Failed to parse URL state:", e);
    }

    return false;
}

// ============================================
// BOOT SEQUENCE (CRITICAL)
// ============================================

// 1. Check if the user just scanned a QR code or clicked a shared link
var loadedFromUrl = parseUrlState();

if (loadedFromUrl) {
    // 2a. If YES: Save this new profile to the phone's memory and render the result
    localStorage.setItem("bbs_session", JSON.stringify(appState));
    render({ animate: false });
} else {
    // 2b. If NO: Boot the app normally (Home/Welcome screen)
    render();
}
