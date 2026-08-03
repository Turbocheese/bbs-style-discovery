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
        category: "Suits",
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
        category: "Jackets",
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
        category: "Jackets",
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
        category: "Jackets",
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
        category: "Jackets",
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
        category: "Shirts",
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
        category: "Jackets",
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
        category: "Shirts",
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
        category: "Jackets",
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
        category: "Suits",
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
        category: "Jackets",
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
        category: "Shirts",
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
        category: "Jackets",
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
        category: "Jackets",
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
        category: "Jackets",
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
        category: "Suits",
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
        category: "Suits",
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
        category: "Accessories",
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
        category: "Trousers",
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
        category: "Jackets",
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
        category: "Accessories",
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
        category: "Jackets",
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
        category: "Suits",
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
        category: "Accessories",
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
        category: "Suits",
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
        category: "Jackets",
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
        category: "Suits",
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
        category: "Accessories",
        tags: ["Cut Panels", "Tape Measure", "In the Making"],
        note:
            "Cut panels, chalk lines and a tape measure, in black and white. What a finished jacket looks like halfway through — the shape is decided here, long before anyone tries it on.",
        guidePath: ["tailoring", "jackets", "details", "construction", "full_canvas"],
        guideLabel: "Read: Full Canvas",
    },
    // The following looks are from the FW25 "Ondo" collection and other
    // recently added campaign photography — added per founder request,
    // August 2026.
    {
        id: "look-navy-overcoat-concrete",
        img: "images/lookbook/bbs-editorial-r21519.jpg",
        title: "Navy Overcoat, Underground",
        season: "Autumn",
        category: "Jackets",
        tags: ["Overcoat", "Polka-Dot Scarf", "Suede Loafers"],
        note:
            "A long navy overcoat over a polka-dot scarf and cream trousers, leaning against poured concrete. The scarf does the only colour work here — everything else stays in one tone.",
        guidePath: ["tailoring", "outerwear", "overcoat"],
        guideLabel: "Read: the Overcoat",
    },
    {
        id: "look-scarf-reflection",
        img: "images/lookbook/bbs-editorial-r21535.jpg",
        title: "Scarf, in the Rain",
        season: "Autumn",
        category: "Accessories",
        tags: ["Polka-Dot Scarf", "Overcoat Collar", "Reflection"],
        note:
            "The same polka-dot scarf and navy coat collar, caught in a rain-streaked window reflection. Proof a scarf can carry a whole look's personality on its own.",
        guidePath: ["colour_wardrobe", "core_colours", "navy"],
        guideLabel: "Read: Navy",
    },
    {
        id: "look-safari-mono",
        img: "images/lookbook/bbs-editorial-r21358bw.jpg",
        title: "Safari, in Black and White",
        season: "Autumn",
        category: "Jackets",
        tags: ["Safari Shirt-Jacket", "Tie Waist", "Wide Trouser"],
        note:
            "A tie-waist safari shirt-jacket over a turtleneck, wide pleated trousers, a coat carried over one arm — shot in black and white. The same four-pocket logic as the warm-weather version, just heavier cloth.",
        guidePath: ["tailoring", "jackets", "other_styles", "safari"],
        guideLabel: "Read: the Safari Jacket",
    },
    {
        id: "look-corduroy-db",
        img: "images/lookbook/bbs-editorial-jc2085.jpg",
        title: "Corduroy, Double-Breasted",
        season: "Autumn",
        category: "Suits",
        tags: ["Corduroy", "Double Breasted", "Glen Check Overcoat"],
        note:
            "A beige corduroy double-breasted suit over a turtleneck, a glen-check overcoat carried over the arm, against a tiled temple wall in autumn light. Corduroy takes the DB silhouette somewhere a worsted cloth can't.",
        guidePath: ["tailoring", "suits", "styles", "double_breasted"],
        guideLabel: "Read: Double-Breasted Suit",
    },
    {
        id: "look-check-riverside",
        img: "images/lookbook/bbs-editorial-jc2003.jpg",
        title: "Check Jacket, Riverside",
        season: "Autumn",
        category: "Jackets",
        tags: ["Check Jacket", "Draped Scarf", "Ivory Trouser"],
        note:
            "A brown check jacket with a knit scarf draped loose, not tied, over ivory trousers, by a stone-stepped river. The scarf is worn like an accessory, not a necessity.",
        guidePath: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
        guideLabel: "Read: Soft Odd Jacket",
    },
    {
        id: "look-houndstooth-gate",
        img: "images/lookbook/bbs-editorial-r21692.jpg",
        title: "Houndstooth, at the Gate",
        season: "Autumn",
        category: "Jackets",
        tags: ["Houndstooth Overcoat", "Ivory Trouser", "Red Lacquer"],
        note:
            "A houndstooth overcoat over a crewneck knit and belted ivory trousers, against a red-lacquered temple gate. The pattern is loud up close and reads as texture from across the courtyard.",
        guidePath: ["fabrics", "suiting", "pattern_and_texture", "houndstooth_puppytooth"],
        guideLabel: "Read: Houndstooth and Puppytooth",
    },
    {
        id: "look-chambray-western",
        img: "images/lookbook/bbs-editorial-r21713.jpg",
        title: "Chambray, Western Yoke",
        season: "Autumn",
        category: "Shirts",
        tags: ["Chambray", "Snap Buttons", "Statement Belt"],
        note:
            "A western-yoke chambray shirt with snap buttons, worn over a cream turtleneck with a dark belt and brass buckle. The yoke and snaps are the only decoration a shirt like this needs.",
        guidePath: ["tailoring", "shirts", "fabrics", "chambray"],
        guideLabel: "Read: Chambray",
    },
    {
        id: "look-umbrella-mono",
        img: "images/lookbook/bbs-editorial-jc1954bw.jpg",
        title: "Umbrella, in Monochrome",
        season: "Autumn",
        category: "Accessories",
        tags: ["Overcoat", "Clear Umbrella", "Black and White"],
        note:
            "A long dark overcoat and scarf, wide cream trousers, a clear dome umbrella held loose — shot in black and white against a perforated concrete wall. The umbrella is the only prop; everything else is tailoring.",
        guidePath: ["colour_wardrobe", "core_colours", "black"],
        guideLabel: "Read: Black",
    },
    {
        id: "look-side-adjuster-trouser",
        img: "images/lookbook/bbs-editorial-r21435.jpg",
        title: "Side Adjusters, No Belt",
        season: "Autumn",
        category: "Trousers",
        tags: ["Side Adjusters", "Shawl Cardigan", "No Belt"],
        note:
            "Cream trousers closed with side-adjuster tabs instead of a belt, under a charcoal shawl-collar knit jacket. A cleaner line at the waist — nothing for a belt to interrupt.",
        guidePath: ["tailoring", "trousers", "configuration", "waistbands", "side_adjusters"],
        guideLabel: "Read: Side Adjusters",
    },
    {
        id: "look-checked-harrington",
        img: "images/lookbook/bbs-editorial-jc2104.jpg",
        title: "Checked Harrington, Cargo Trouser",
        season: "Autumn",
        category: "Jackets",
        tags: ["Cropped Jacket", "Cargo Trouser", "Loafers"],
        note:
            "A cropped checked jacket zipped over a turtleneck, olive cargo trousers, black loafers — caught mid-stride on a timber staircase. The jacket stays cropped so the trouser's own volume can do the work.",
        guidePath: ["tailoring", "jackets", "other_styles", "flight"],
        guideLabel: "Read: the Flight Jacket",
    },
    {
        id: "look-grey-courtyard",
        img: "images/lookbook/bbs-editorial-jc9567.jpg",
        title: "Grey, in the Courtyard",
        season: "Resort",
        category: "Jackets",
        tags: ["Odd Jacket", "Pleated Trouser", "Ochre Courtyard"],
        note:
            "A grey odd jacket over a white shirt and cream pleated trousers, belted, against an ochre-plastered courtyard pool. Warm architecture, cool cloth — the contrast does the styling.",
        guidePath: ["tailoring", "jackets", "use_case", "resort"],
        guideLabel: "Read: the Resort Jacket",
    },
    {
        id: "look-contrast-polo",
        img: "images/lookbook/bbs-editorial-jc8829.jpg",
        title: "Contrast Collar, Waiting Room",
        season: "Resort",
        category: "Shirts",
        tags: ["Knit Polo", "Contrast Collar", "Loafers"],
        note:
            "A contrast-collar knit polo, dark trousers, white socks and loafers, seated on a row of vintage bench chairs. A polo collar in a different colour from the body is a small detail that reads from a distance.",
        guidePath: ["tailoring", "shirts", "use_case", "resort"],
        guideLabel: "Read: the Resort Shirt",
    },
    // Added from the "Cala" (High Summer '26) collection page, August 2026.
    {
        id: "look-cala-db",
        img: "images/lookbook/bbs-editorial-cala-db.png",
        title: "Double-Breasted, Golden Hour",
        season: "Coastal",
        category: "Suits",
        tags: ["Double Breasted", "Knit Polo", "Raking Light"],
        note:
            "A brown double-breasted jacket over a cream knit polo, caught in raking evening light against open sky. The double-breasted line reads even in a tight crop — the silhouette does the work.",
        guidePath: ["tailoring", "suits", "styles", "double_breasted"],
        guideLabel: "Read: Double-Breasted Suit",
    },
    {
        id: "look-cala-cargo",
        img: "images/lookbook/bbs-editorial-cala-cargo.png",
        title: "Cargo Trouser, Dockside",
        season: "Coastal",
        category: "Trousers",
        tags: ["Cargo Trouser", "Deep Pleats", "Safari Shirt"],
        note:
            "A four-pocket shirt tucked over deep-pleated cargo trousers, hands in pockets on a wooden jetty. The cargo pocket sits low on the thigh, out of the way of a tucked-in shirt.",
        guidePath: ["tailoring", "trousers", "configuration", "pleats", "double_pleats"],
        guideLabel: "Read: Double Pleats",
    },
    {
        id: "look-cala-safari-boat",
        img: "images/lookbook/bbs-editorial-cala-safari.png",
        title: "The Safari Jacket, Underway",
        season: "Coastal",
        category: "Jackets",
        tags: ["Safari Jacket", "Shorts", "Sailboat"],
        note:
            "A cream safari jacket over a white tee and dark shorts, tossing a piece of fruit across the deck of a sailboat. Proof the four-pocket jacket works as easily above the waist as it does with tailored trousers below it.",
        guidePath: ["tailoring", "jackets", "other_styles", "safari"],
        guideLabel: "Read: the Safari Jacket",
    },
    // Added from the Cala editorial page (/pages/cala), August 2026.
    {
        id: "look-cala-pintuck",
        img: "images/lookbook/bbs-editorial-cala-pintuck.png",
        title: "Pintuck Shirt-Jacket, on Deck",
        season: "Coastal",
        category: "Jackets",
        tags: ["Pintuck Detail", "Tie Waist", "Sailboat"],
        note:
            "A cream pintuck shirt-jacket with a tie waist, worn open over a white tank and matching trousers, lounging on a sailboat deck at golden hour. The pintucks catch the low light and give a plain cloth some texture to work with.",
        guidePath: ["tailoring", "jackets", "other_styles", "safari"],
        guideLabel: "Read: the Safari Jacket",
    },
    {
        id: "look-cala-lemon",
        img: "images/lookbook/bbs-editorial-cala-lemon.png",
        title: "Cream Jacket, with a Lemon",
        season: "Coastal",
        category: "Jackets",
        tags: ["Patch Pocket", "Boxy Fit", "Sailboat Rigging"],
        note:
            "A cream patch-pocket jacket over dark trousers, leaning against sailboat rigging with a lemon in hand. A boxy, unstructured cut that asks nothing of the wearer.",
        guidePath: ["tailoring", "jackets", "other_styles", "chore"],
        guideLabel: "Read: the Chore Jacket",
    },
    {
        id: "look-cala-olive-zip",
        img: "images/lookbook/bbs-editorial-cala-olivezip.png",
        title: "Olive Zip Jacket, Pleated Waist",
        season: "Coastal",
        category: "Jackets",
        tags: ["Zip Jacket", "Stand Collar", "Pleated Trouser"],
        note:
            "An olive zip jacket with a stand collar and patch pockets over a white tank, cream pleated trousers closed with a tab and button. Close enough to see the trouser's own waistband construction, not just the jacket's.",
        guidePath: ["tailoring", "jackets", "other_styles", "flight"],
        guideLabel: "Read: the Flight Jacket",
    },
    {
        id: "look-cala-white-set",
        img: "images/lookbook/bbs-editorial-cala-whiteset.png",
        title: "White Linen Set, at the Marina",
        season: "Coastal",
        category: "Suits",
        tags: ["Matching Set", "Breton Stripe", "Sandals"],
        note:
            "A white linen jacket and matching trousers over a navy-and-white striped knit, standing at the end of a wooden jetty. Head-to-toe in one cloth, with just the stripe underneath doing the contrast work.",
        guidePath: ["fabrics", "suiting", "linen_suiting"],
        guideLabel: "Read: Linen Suiting",
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

// Garment-type categories, in a fixed reading order (not alphabetical —
// suits and jackets are the volume of the book, accessories are the tail).
// Derived from the data like getLookbookSeasons(), so a category with no
// looks in it never gets a chip.
function getLookbookCategories() {
    var order = ["Suits", "Jackets", "Trousers", "Shirts", "Accessories"];
    var present = [];
    for (var i = 0; i < order.length; i++) {
        for (var j = 0; j < lookbookData.length; j++) {
            if (lookbookData[j].category === order[i]) { present.push(order[i]); break; }
        }
    }
    for (var k = 0; k < lookbookData.length; k++) {
        if (present.indexOf(lookbookData[k].category) === -1) present.push(lookbookData[k].category);
    }
    return present;
}

function getLookbookCategoryFilter() {
    var c = appState.lookbookCategory;
    return c && c !== "all" ? c : "all";
}

function renderLookbook() {
    var filter = getLookbookFilter();
    var categoryFilter = getLookbookCategoryFilter();
    var seasons = getLookbookSeasons();
    var categories = getLookbookCategories();
    var shown = [];
    for (var s = 0; s < lookbookData.length; s++) {
        var look = lookbookData[s];
        if (filter !== "all" && look.season !== filter) continue;
        if (categoryFilter !== "all" && look.category !== categoryFilter) continue;
        shown.push(look);
    }

    var html = '<div class="lookbook-shell">';

    html += '<div class="lookbook-hero">';
    html += '<span class="lookbook-eyebrow">Editorial Archive</span>';
    html += "<h1>The BBS Lookbook</h1>";
    html +=
        "<p>A curated gallery of our tailoring, seasonal campaigns, and styling architecture. Tap any look to turn it over.</p>";
    html += "</div>";

    // Category chips first — the primary sort a client reaches for
    // ("show me jackets") — same visible-chip language as the Mill Map's
    // country filter, so a tap always beats a hidden dropdown here.
    html += '<div class="lookbook-category-chips">';
    html += '<button class="lookbook-category-chip btn-bare' + (categoryFilter === "all" ? " sel" : "") +
        '" type="button" data-action="lookbook-category" data-category="all">All</button>';
    for (var c = 0; c < categories.length; c++) {
        html += '<button class="lookbook-category-chip btn-bare' + (categoryFilter === categories[c] ? " sel" : "") +
            '" type="button" data-action="lookbook-category" data-category="' + categories[c] + '">' +
            categories[c] + "</button>";
    }
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
