// ============================================
// WARDROBE AUDIT WORKSHEET — PREMIUM TEMPLATE SYSTEM
// PART 1 OF 3
// ============================================

var wardrobeTemplates = {
    // 1. The City Innovator (t)
    t: {
        outfits: [
            {
                name: "The Business Anchor",
                items: ["t_f1", "t_f2", "t_f3"],
                context: "High-stakes meetings and formal environments.",
            },
            {
                name: "The Smart Climate",
                items: ["t_f4", "t_f5", "t_f2", "t_r3"],
                context: "Daily office wear and business lunches.",
            },
            {
                name: "The Transit Look",
                items: ["t_r1", "t_r2", "t_f5"],
                context: "Comfortable air travel arriving ready for dinner.",
            },
        ],
        foundation: [
            {
                id: "t_f1",
                item: "High-twist tropical suit",
                priority: 1,
                tier: "foundation",
                mills: "Holland & Sherry 'Crispaire' / Fox Brothers 'Fox Air'",
                climate: ["tropical", "warm_climate"],
                paletteGuidance: {
                    "Navy & Stone": {
                        color: "#243B5A",
                        note: "Deep navy — avoid black-navy",
                    },
                    "City Greys": {
                        color: "#4A4A4A",
                        note: "Charcoal — the urban anchor",
                    },
                },
                why: "Your most critical investment. High-twist tropical fabrics maintain sharp lines in humid climates while staying breathable.",
                guide: ["fabrics", "suiting", "high_twist_wool"],
            },
            {
                id: "t_f2",
                item: "Breathable dress shirts",
                priority: 2,
                tier: "foundation",
                mills: "Thomas Mason (Poplin or Zephyr)",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Optic white + soft blue" },
                },
                why: "Crisp poplin or fine twill shirts complete your suit foundation.",
                guide: ["tailoring", "shirts", "fabrics", "poplin"],
            },
            {
                id: "t_f3",
                item: "Quality dress shoes",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    "Navy & Stone": { color: "#3B2A22", note: "Dark brown" },
                    "City Greys": { color: "#1E1E1E", note: "Black oxfords" },
                },
                why: "Goodyear-welted leather shoes complete your professional foundation.",
                guide: ["accessories", "shoes", "dress_shoes"],
            },
            {
                id: "t_f4",
                item: "Fresco wool jacket",
                priority: 4,
                tier: "enhancement",
                mills: "Hardy Minnis 'Fresco'",
                climate: ["tropical", "warm_climate"],
                paletteGuidance: {
                    "Navy & Stone": { color: "#687383", note: "Slate or airforce blue" },
                    "City Greys": { color: "#4A4A4A", note: "Medium grey" },
                },
                why: "Your versatility multiplier. A breathable odd jacket pairs with both suit and dress trousers.",
                guide: ["fabrics", "suiting", "fresco"],
            },
            {
                id: "t_f5",
                item: "Performance trousers",
                priority: 5,
                tier: "foundation",
                mills: "High-Twist Gabardine",
                climate: ["all"],
                paletteGuidance: {
                    "Navy & Stone": { color: "#243B5A", note: "Navy + stone grey" },
                    "City Greys": { color: "#4A4A4A", note: "Charcoal + soft grey" },
                },
                why: "High-twist trousers maintain their press through long days.",
                guide: ["tailoring", "trousers"],
            },
        ],
        refinements: [
            {
                id: "t_r1",
                item: "Travel-ready lightweight blazer",
                priority: 6,
                tier: "enhancement",
                mills: "Mock Leno weaves",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy — the ultimate travel color" },
                },
                why: "Unlined construction packs without wrinkling. Essential for business travel.",
                guide: ["tailoring", "jackets", "use_case", "travel"],
            },
            {
                id: "t_r2",
                item: "Smart-casual knitwear",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#5D718A", note: "Soft blue or grey" },
                },
                why: "Fine-gauge merino works under jackets or standalone.",
                guide: ["tailoring"],
            },
            {
                id: "t_r3",
                item: "Leather accessories",
                priority: 8,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#3B2A22", note: "Match your shoe leather exactly" },
                },
                why: "Quality leather goods anchor your entire look.",
                guide: ["accessories"],
            },
        ],
    },

    // 2. The Quiet Classicist (q)
    q: {
        outfits: [
            {
                name: "The Quiet Authority",
                items: ["q_f1", "q_f3", "q_f4"],
                context: "Formal simplicity that commands the room.",
            },
            {
                name: "The Tonal Weekend",
                items: ["q_f5", "q_r1", "q_f2"],
                context: "Relaxed elegance using layered neutrals.",
            },
            {
                name: "The Modern Gallery",
                items: ["q_f2", "q_r2", "q_f4"],
                context: "Crisp basics with impeccable fit.",
            },
        ],
        foundation: [
            {
                id: "q_f1",
                item: "Navy tailored suit",
                priority: 1,
                tier: "foundation",
                mills: "Loro Piana 'Tasmanian'",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#243B5A",
                        note: "True navy — your unshakeable anchor",
                    },
                },
                why: "Navy is the most versatile color in menswear. Your restrained aesthetic needs this.",
                guide: ["colour_wardrobe", "core_colours", "navy"],
            },
            {
                id: "q_f2",
                item: "Stone or grey trousers",
                priority: 2,
                tier: "foundation",
                mills: "Fox Brothers (Temperate) / High-Twist (Warm)",
                climate: ["all"],
                paletteGuidance: {
                    "Navy & Stone": { color: "#D8D2C4", note: "Soft stone" },
                    "City Greys": { color: "#B8B8B3", note: "Soft grey" },
                },
                why: "Your tonal wardrobe needs a lighter neutral trouser to balance darker jackets.",
                guide: ["colour_wardrobe", "core_colours", "stone_beige"],
            },
            {
                id: "q_f3",
                item: "Clean white shirts (poplin)",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Optic white — not cream" },
                },
                why: "Crisp white poplin is non-negotiable for your understated profile.",
                guide: ["tailoring", "shirts", "fabrics", "poplin"],
            },
            {
                id: "q_f4",
                item: "Minimal leather shoes",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    "Navy & Stone": { color: "#3B2A22", note: "Dark brown" },
                    "City Greys": { color: "#1E1E1E", note: "Black" },
                },
                why: "Whole-cut or plain-toe oxfords with minimal detailing. No broguing.",
                guide: ["accessories", "shoes"],
            },
            {
                id: "q_f5",
                item: "Minimal navy blazer",
                priority: 5,
                tier: "enhancement",
                mills: "Hopsack or Serge Twill",
                climate: ["all"],
                paletteGuidance: { all: { color: "#243B5A", note: "Deep navy" } },
                why: "A single-breasted navy blazer is your smart-casual anchor.",
                guide: ["tailoring", "jackets"],
            },
        ],
        refinements: [
            {
                id: "q_r1",
                item: "Tonal layering pieces (knitwear)",
                priority: 6,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Match your trouser tones" },
                },
                why: "A soft grey or stone cardigan keeps the palette calm but adds depth.",
                guide: ["colour_wardrobe", "building_a_wardrobe"],
            },
            {
                id: "q_r2",
                item: "Quality basics over statement pieces",
                priority: 7,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Perfect execution in neutrals" },
                },
                why: "Your aesthetic is about flawless execution of simple pieces.",
                guide: ["colour_wardrobe", "core_wardrobe_anchors"],
            },
        ],
    },

    // 3. The Coastal Modernist (w)
    w: {
        outfits: [
            {
                name: "The Resort Evening",
                items: ["w_f1", "w_f3", "w_f4"],
                context: "Sunset dinners and elevated warm-weather events.",
            },
            {
                name: "The Coastal Standard",
                items: ["w_r1", "w_f2", "w_f3"],
                context: "Effortless daytime polish.",
            },
            {
                name: "The Layered Breeze",
                items: ["w_f5", "w_f2", "w_r2"],
                context: "Cooler evenings by the water.",
            },
        ],
        foundation: [
            {
                id: "w_f1",
                item: "Linen suit or jacket",
                priority: 1,
                tier: "foundation",
                mills: "Spence Bryson or Irish Linen",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    "Riviera Light": { color: "#D8D0C2", note: "Stone or cream" },
                    "Navy & Stone": { color: "#D8D0C2", note: "Stone linen" },
                },
                why: "Linen defines your coastal aesthetic. The natural texture suits warm climates perfectly.",
                guide: ["fabrics", "suiting", "linen_suiting"],
            },
            {
                id: "w_f2",
                item: "Relaxed trousers (stone, sand)",
                priority: 2,
                tier: "foundation",
                mills: "Linen-Cotton blends",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    "Riviera Light": { color: "#D8C3A5", note: "Sand or warm stone" },
                },
                why: "High-rise, full-cut trousers create the relaxed silhouette your aesthetic needs.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "w_f3",
                item: "Soft shirts (open collars)",
                priority: 3,
                tier: "foundation",
                mills: "Linen/Cotton blends",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#F4ECDD", note: "Cream, soft blue, white" },
                },
                why: "Shirts with softer collars maintain polish without stiffness.",
                guide: ["tailoring", "shirts", "use_case", "smart_casual"],
            },
            {
                id: "w_f4",
                item: "Casual loafers or espadrilles",
                priority: 4,
                tier: "enhancement",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#B59C84", note: "Tan or brown suede" },
                },
                why: "Suede loafers or leather espadrilles complete your coastal look.",
                guide: ["accessories", "shoes", "loafers"],
            },
            {
                id: "w_f5",
                item: "Light knitwear",
                priority: 5,
                tier: "enhancement",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#9FB9CF", note: "Soft blue or stone" },
                },
                why: "Lightweight knits layer over shirts without adding bulk.",
                guide: ["tailoring"],
            },
        ],
        refinements: [
            {
                id: "w_r1",
                item: "Teba jacket",
                priority: 6,
                tier: "luxury",
                mills: "Heavy Linen or Summer Tweed",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#D8D0C2", note: "Stone linen or olive" },
                },
                why: "The Teba is a Spanish hunting jacket reimagined for coastal sophistication.",
                guide: ["tailoring", "jackets", "other_styles", "teba"],
            },
            {
                id: "w_r2",
                item: "Canvas or linen accessories",
                priority: 7,
                tier: "enhancement",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#D8D0C2", note: "Natural materials" },
                },
                why: "Your coastal aesthetic extends to every detail. Avoid heavy leather.",
                guide: ["accessories"],
            },
        ],
    },

    // 4. The Craftsman (c)
    c: {
        outfits: [
            {
                name: "The Artisan Anchor",
                items: ["c_f1", "c_f4", "c_f5"],
                context: "Business environments where presence matters.",
            },
            {
                name: "The Workshop Weekend",
                items: ["c_r1", "c_f4", "c_r2"],
                context: "Rugged but elevated casual days.",
            },
            {
                name: "The Structured Casual",
                items: ["c_f2", "c_f3", "c_f5"],
                context: "Smart-casual with architectural weight.",
            },
        ],
        foundation: [
            {
                id: "c_f1",
                item: "Half-canvas structured suit",
                priority: 1,
                tier: "foundation",
                mills: "Dugdale Bros / VBC",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Deep navy or heavy charcoal" },
                },
                why: "Canvas construction moulds to your body over time. The integrity of the build matters most to you.",
                guide: [
                    "tailoring",
                    "jackets",
                    "details",
                    "construction",
                    "half_canvas",
                ],
            },
            {
                id: "c_f2",
                item: "Heavy worsted or fresco jacket",
                priority: 2,
                tier: "foundation",
                mills: "Fox Brothers",
                climate: ["all"],
                paletteGuidance: {
                    "Heritage Browns": { color: "#684C39", note: "Rich tobacco" },
                    "Navy & Stone": { color: "#243B5A", note: "Navy" },
                },
                why: "A substantial jacket that holds its shape. You appreciate cloth with a strong 'hand'.",
                guide: ["fabrics", "suiting", "worsted_wool"],
            },
            {
                id: "c_f3",
                item: "Substantial trousers",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal or olive" },
                },
                why: "Trousers that drape cleanly due to fabric weight, resisting wrinkles naturally.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "c_f4",
                item: "Heavyweight cotton shirts (Oxford)",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "White and university blue" },
                },
                why: "Oxford cloth (OCBD) ages beautifully and softens over years of wear.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "c_f5",
                item: "Goodyear-welted shoes",
                priority: 5,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#3B2A22", note: "Dark brown or oxblood leather" },
                },
                why: "Footwear that can be resoled indefinitely. A testament to longevity.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "c_r1",
                item: "Tweed or heavy textured jacket",
                priority: 6,
                tier: "enhancement",
                mills: "Harris Tweed / Summer Tweed",
                climate: ["temperate", "warm_climate"],
                paletteGuidance: {
                    "Earth & Olive": {
                        color: "#8A5B3C",
                        note: "Textured brown or olive",
                    },
                },
                why: "Cloth with visual depth and honest origins.",
                guide: ["fabrics", "suiting", "summer_tweed"],
            },
            {
                id: "c_r2",
                item: "Artisanal leather goods",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#3B2A22", note: "Full-grain leathers" },
                },
                why: "Bridle leather belts and handcrafted accessories that patina over time.",
                guide: ["accessories"],
            },
        ],
    },

    // 5. The Relaxed Modernist (m)
    m: {
        outfits: [
            {
                name: "The Modern Office",
                items: ["m_f1", "m_f2", "m_f3"],
                context: "Creative agencies or relaxed business settings.",
            },
            {
                name: "The Weekend Polish",
                items: ["m_f4", "m_f2", "m_f5"],
                context: "Sunday brunches and gallery visits.",
            },
            {
                name: "The Seamless Transit",
                items: ["m_r2", "m_f3", "m_f5"],
                context: "Moving between flights and meetings.",
            },
        ],
        foundation: [
            {
                id: "m_f1",
                item: "Soft unstructured blazer",
                priority: 1,
                tier: "foundation",
                mills: "Hopsack / Jersey blends",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy or soft grey" },
                },
                why: "Removes the stiffness of traditional tailoring while maintaining the V-shape silhouette.",
                guide: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            },
            {
                id: "m_f2",
                item: "Smart-casual trousers",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Stone, olive, or navy" },
                },
                why: "Cotton-twill or high-twist wool that acts like a dress pant but feels like a chino.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "m_f3",
                item: "Versatile button-down shirts",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "White, light blue, subtle stripes" },
                },
                why: "Collars that stand up beautifully without a tie.",
                guide: ["tailoring", "shirts", "use_case", "smart_casual"],
            },
            {
                id: "m_f4",
                item: "Elevated knitwear",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#5D718A", note: "Tonal colors to match trousers" },
                },
                why: "Replaces the tailored jacket on highly casual days without looking sloppy.",
                guide: ["tailoring"],
            },
            {
                id: "m_f5",
                item: "Suede penny loafers",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#8A5A3B", note: "Chocolate or snuff suede" },
                },
                why: "The ultimate bridge shoe. Dressier than sneakers, more relaxed than oxfords.",
                guide: ["accessories", "shoes", "loafers", "penny_loafer"],
            },
        ],
        refinements: [
            {
                id: "m_r1",
                item: "Lightweight overshirt/shacket",
                priority: 6,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: { all: { color: "#687383", note: "Slate or olive" } },
                why: "A modern alternative to the sports coat for purely casual environments.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "m_r2",
                item: "Drawstring tailored trousers",
                priority: 7,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal or navy" },
                },
                why: "Hidden comfort features. Looks like a suit trouser, feels like a track pant.",
                guide: ["tailoring", "trousers"],
            },
        ],
    },

    // 6. The Traditionalist (g)
    g: {
        outfits: [
            {
                name: "The Executive Standard",
                items: ["g_f1", "g_f3", "g_f5"],
                context: "Boardrooms and formal business.",
            },
            {
                name: "The Club Look",
                items: ["g_f2", "g_f3", "g_f4"],
                context: "Traditional smart-casual and networking.",
            },
            {
                name: "The Ceremony",
                items: ["g_r1", "g_f3", "g_r2"],
                context: "Weddings, galas, and milestones.",
            },
        ],
        foundation: [
            {
                id: "g_f1",
                item: "Classic Navy Suit",
                priority: 1,
                tier: "foundation",
                mills: "VBC / Loro Piana",
                climate: ["all"],
                paletteGuidance: { all: { color: "#243B5A", note: "Classic Navy" } },
                why: "The cornerstone of traditional menswear. Appropriate everywhere.",
                guide: ["tailoring", "suits", "styles", "single_breasted"],
            },
            {
                id: "g_f2",
                item: "Traditional Sports Coat",
                priority: 2,
                tier: "foundation",
                mills: "Gunclub Check or Hopsack",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#684C39", note: "Brown check or solid navy" },
                },
                why: "The historical weekend uniform. Adds texture to your standard rotation.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "g_f3",
                item: "Formal dress shirts",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "White and pale blue" },
                },
                why: "Stiff collars, French cuffs optional. Built for ties.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "g_f4",
                item: "Conservative Silk Ties",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#6E2233", note: "Burgundy, forest, or navy dots" },
                },
                why: "Grenadine or woven silk. The traditionalist always wears a tie well.",
                guide: ["accessories"],
            },
            {
                id: "g_f5",
                item: "Black Cap-Toe Oxfords",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Highly polished black leather" },
                },
                why: "The only acceptable shoe for strict formal business.",
                guide: ["accessories", "shoes", "dress_shoes"],
            },
        ],
        refinements: [
            {
                id: "g_r1",
                item: "Three-piece suit",
                priority: 6,
                tier: "luxury",
                climate: ["temperate", "indoor"],
                paletteGuidance: { all: { color: "#4A4A4A", note: "Charcoal grey" } },
                why: "Adding a waistcoat elevates the formality instantly for weddings and events.",
                guide: ["tailoring", "suits", "use_case", "wedding"],
            },
            {
                id: "g_r2",
                item: "White linen pocket squares",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: { all: { color: "#F3F0EA", note: "Crisp white" } },
                why: "The TV fold. A subtle nod to classical tailoring rules.",
                guide: ["accessories"],
            },
        ],
    },

    // 7. The Modern Architect (a)
    a: {
        outfits: [
            {
                name: "The Sharp Pitch",
                items: ["a_f1", "a_f4", "a_f5"],
                context: "Design presentations and urban environments.",
            },
            {
                name: "The Monolith",
                items: ["a_r1", "a_f3", "a_f4"],
                context: "High-impact styling with strong geometry.",
            },
            {
                name: "The Clean Casual",
                items: ["a_f2", "a_f3", "a_r2"],
                context: "Off-duty but highly structured.",
            },
        ],
        foundation: [
            {
                id: "a_f1",
                item: "Slim-tailored monochromatic suit",
                priority: 1,
                tier: "foundation",
                mills: "High-twist worsted",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal, black, or stark navy" },
                },
                why: "You rely on silhouette over texture. The cut must be flawless and sharp.",
                guide: ["tailoring", "suits"],
            },
            {
                id: "a_f2",
                item: "Structured blazer",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "High contrast neutrals" },
                },
                why: "Strong shoulders, roped sleeves. The jacket acts as armor.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "a_f3",
                item: "Precise-fit trousers",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "No break at the hem" },
                },
                why: "A sharp crease and exact length. Slopiness ruins the architectural line.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "a_f4",
                item: "Crisp minimal shirts",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Optic white or stark black" },
                },
                why: "Hidden plackets, point collars. Stripped of all unnecessary details.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "a_f5",
                item: "Clean-line footwear",
                priority: 5,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#1E1E1E",
                        note: "Black leather or minimalist white sneakers",
                    },
                },
                why: "Chelsea boots or sleek monochrome sneakers. No busy stitching.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "a_r1",
                item: "Double-breasted jacket",
                priority: 6,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Sharp navy or charcoal" },
                },
                why: "Peak lapels and geometric button placement suit your love of structure.",
                guide: ["tailoring", "jackets", "details", "lapels", "peak"],
            },
            {
                id: "a_r2",
                item: "Geometric accessories",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#C0C0C0", note: "Brushed steel or silver" },
                },
                why: "Matte metal watches, minimalist eyewear. Hardware should look industrial.",
                guide: ["accessories"],
            },
        ],
    },

    // 8. The Utilitarian (u)
    u: {
        outfits: [
            {
                name: "The Commuter",
                items: ["u_f1", "u_f4", "u_f5"],
                context: "Long flights straight to the office.",
            },
            {
                name: "The Field Look",
                items: ["u_f2", "u_f3", "u_r2"],
                context: "Active days requiring polish.",
            },
            {
                name: "The Resilient Suit",
                items: ["u_r1", "u_f4", "u_f5"],
                context: "High-humidity business environments.",
            },
        ],
        foundation: [
            {
                id: "u_f1",
                item: "Wrinkle-resistant travel suit",
                priority: 1,
                tier: "foundation",
                mills: "High-Twist Wool (Crispaire)",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy or dark grey (hides stains)" },
                },
                why: "A suit that can be crumpled in a suitcase and shaken out perfectly. Pure utility.",
                guide: ["tailoring", "suits", "use_case", "travel"],
            },
            {
                id: "u_f2",
                item: "Multi-pocket odd jacket",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#7A7F47", note: "Olive, navy, or khaki" },
                },
                why: "Patch pockets for passports/phones. Unlined for maximum mobility.",
                guide: ["tailoring", "jackets", "use_case", "travel"],
            },
            {
                id: "u_f3",
                item: "Durable chinos/trousers",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Stone, olive, and navy" },
                },
                why: "Heavy cotton twill or technical wool blends that resist abrasion.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "u_f4",
                item: "Easy-care shirts",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#AFC4D6", note: "Light blue or subtle patterns" },
                },
                why: "Fabrics that dry quickly and require minimal ironing.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "u_f5",
                item: "Comfortable walking loafers",
                priority: 5,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#8A5A3B", note: "Brown suede or textured leather" },
                },
                why: "Rubber-soled or highly flexible loafers. Easy through airport security.",
                guide: ["accessories", "shoes", "loafers"],
            },
        ],
        refinements: [
            {
                id: "u_r1",
                item: "High-twist separate trousers",
                priority: 6,
                tier: "enhancement",
                mills: "Fresco / Tropical",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: { all: { color: "#4A4A4A", note: "Charcoal" } },
                why: "Bulletproof trousers that never lose their crease in the rain or heat.",
                guide: ["fabrics", "suiting", "high_twist_wool"],
            },
            {
                id: "u_r2",
                item: "Packable weather layers",
                priority: 7,
                tier: "foundation",
                climate: ["temperate"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy mac or lightweight trench" },
                },
                why: "Technical outerwear that fits over a suit but packs to nothing.",
                guide: ["tailoring"],
            },
        ],
    },
    // ============================================
    // WARDROBE AUDIT WORKSHEET — PREMIUM TEMPLATE SYSTEM
    // PART 2 OF 3
    // ============================================

    // 9. The New Minimalist (s)
    s: {
        outfits: [
            {
                name: "The Clean Slate",
                items: ["s_f1", "s_f3", "s_f5"],
                context: "Modern workplaces and creative meetings.",
            },
            {
                name: "The Tonal Casual",
                items: ["s_r1", "s_f2", "s_f4"],
                context: "Refined weekend coffee and errands.",
            },
            {
                name: "The Soft Structure",
                items: ["s_f1", "s_f2", "s_r2"],
                context: "Dinners out and evening events.",
            },
        ],
        foundation: [
            {
                id: "s_f1",
                item: "Soft minimal jacket",
                priority: 1,
                tier: "foundation",
                mills: "Lightweight Wool or Cotton-Silk",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal, navy, or soft grey" },
                },
                why: "Deconstructed shoulders and minimal padding. Feels like a cardigan, looks like a blazer.",
                guide: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            },
            {
                id: "s_f2",
                item: "Clean-cut trousers",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Stone, grey, or black" },
                },
                why: "Flat front, slight taper, no break. The silhouette must be uninterrupted.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "s_f3",
                item: "Simple shirts (no tie)",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "White, pale grey, or black" },
                },
                why: "Hidden plackets or band collars. The goal is to remove visual noise.",
                guide: ["tailoring", "shirts", "use_case", "smart_casual"],
            },
            {
                id: "s_f4",
                item: "Minimal knitwear",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#5D718A", note: "Tonal colors matching jackets" },
                },
                why: "A fine-gauge crewneck replaces a shirt effortlessly in your wardrobe.",
                guide: ["tailoring"],
            },
            {
                id: "s_f5",
                item: "Unlined suede loafers",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#8A5A3B", note: "Chocolate suede or matte black" },
                },
                why: "Slip-on ease without laces. Minimal hardware.",
                guide: ["accessories", "shoes", "loafers", "suede_loafer"],
            },
        ],
        refinements: [
            {
                id: "s_r1",
                item: "Tonal palette anchors",
                priority: 6,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#B8B8B3", note: "Build a gradient of one color" },
                },
                why: "Dressing head-to-toe in varying shades of grey or navy is your signature.",
                guide: ["colour_wardrobe", "core_wardrobe_anchors"],
            },
            {
                id: "s_r2",
                item: "Elevated t-shirts",
                priority: 7,
                tier: "luxury",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Crisp white or black" },
                },
                why: "Wearing a t-shirt under a suit only works if the t-shirt is pristine and perfectly cut.",
                guide: ["tailoring", "shirts", "use_case", "smart_casual"],
            },
        ],
    },

    // 10. The Soft Classicist (r)
    r: {
        outfits: [
            {
                name: "The Elegant Drape",
                items: ["r_f1", "r_f4", "r_f5"],
                context: "Relaxed dinners and elevated socializing.",
            },
            {
                name: "The Textural Blend",
                items: ["r_r1", "r_f2", "r_f3"],
                context: "Autumn/Winter daytime sophistication.",
            },
            {
                name: "The Effortless Weekend",
                items: ["r_f1", "r_r2", "r_f3"],
                context: "Sunday wandering with intent.",
            },
        ],
        foundation: [
            {
                id: "r_f1",
                item: "Soft-shouldered blazer",
                priority: 1,
                tier: "foundation",
                mills: "Spalla Camicia construction",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#8A5B3C", note: "Tobacco, olive, or soft navy" },
                },
                why: "The Neapolitan shoulder (unpadded, shirt-sleeve insertion) gives you natural elegance without rigidity.",
                guide: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            },
            {
                id: "r_f2",
                item: "Textured fabrics (hopsack, flannel)",
                priority: 2,
                tier: "foundation",
                mills: "Fox Brothers / Hardy Minnis",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Mid-grey or textured brown" },
                },
                why: "You rely on the physical depth of the cloth rather than bright colours.",
                guide: ["fabrics", "suiting", "hopsack"],
            },
            {
                id: "r_f3",
                item: "Relaxed trousers",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Stone, fawn, or olive" },
                },
                why: "A slightly fuller cut allows the fabric to drape naturally over the shoe.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "r_f4",
                item: "Soft cotton shirts",
                priority: 4,
                tier: "foundation",
                mills: "Chambray or brushed cotton",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#AFC4D6", note: "Soft blue or ecru" },
                },
                why: "Avoid stiff poplin. You need fabrics with a softer hand that move with you.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "r_f5",
                item: "Unstructured footwear",
                priority: 5,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#8A5A3B", note: "Brown suede or grained calf" },
                },
                why: "Suede chukkas, tassel loafers, or unlined derbies. Comfort implies elegance.",
                guide: ["accessories", "shoes", "loafers"],
            },
        ],
        refinements: [
            {
                id: "r_r1",
                item: "Wool-linen-silk blends",
                priority: 6,
                tier: "luxury",
                mills: "Loro Piana 'Summertime'",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#6E7440", note: "Olive or sand blends" },
                },
                why: "The holy trinity of summer fabrics. Wool for shape, linen for texture, silk for subtle sheen.",
                guide: ["fabrics", "suiting", "wool_linen"],
            },
            {
                id: "r_r2",
                item: "Textural layering pieces",
                priority: 7,
                tier: "enhancement",
                climate: ["temperate"],
                paletteGuidance: {
                    all: { color: "#684C39", note: "Rich autumnal tones" },
                },
                why: "Cashmere cardigans or suede vests. Layering soft materials is your superpower.",
                guide: ["colour_wardrobe", "texture_vs_colour"],
            },
        ],
    },

    // 11. The Contrast Curator (e)
    e: {
        outfits: [
            {
                name: "The Statement Maker",
                items: ["e_f1", "e_f2", "e_f4"],
                context: "Creative events and confident evening wear.",
            },
            {
                name: "The Pattern Play",
                items: ["e_f1", "e_f3", "e_r2"],
                context: "Standing out in smart-casual settings.",
            },
            {
                name: "The Complex Layer",
                items: ["e_r1", "e_f5", "e_f3"],
                context: "Cooler days requiring visual depth.",
            },
        ],
        foundation: [
            {
                id: "e_f1",
                item: "Textured statement jacket",
                priority: 1,
                tier: "foundation",
                mills: "Donegal Tweed / Summer Tweed",
                climate: ["all"],
                paletteGuidance: {
                    "Expressive Colour": {
                        color: "#B45C39",
                        note: "Rust or sage green check",
                    },
                    "Deep Colour": { color: "#6E2233", note: "Burgundy houndstooth" },
                },
                why: "You use pattern and texture as your primary vehicle for expression. Start here.",
                guide: ["fabrics", "suiting", "summer_tweed"],
            },
            {
                id: "e_f2",
                item: "Patterned shirts",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#AFC4D6", note: "Bengal stripes or subtle checks" },
                },
                why: "You have the confidence to mix a striped shirt with a textured jacket successfully.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "e_f3",
                item: "Varied trouser textures",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal flannel or olive cotton" },
                },
                why: "Your trousers must ground the outfit while still providing tactile interest.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "e_f4",
                item: "Statement accessories",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#B45C39", note: "Pull colors from your jacket weave" },
                },
                why: "Pocket squares with complex borders, textured knit ties. The devil is in the details.",
                guide: ["accessories"],
            },
            {
                id: "e_f5",
                item: "Layering pieces (vests, knits)",
                priority: 5,
                tier: "enhancement",
                climate: ["temperate"],
                paletteGuidance: {
                    all: { color: "#687383", note: "Contrasting waistcoats" },
                },
                why: "A contrasting waistcoat or cardigan breaks up the silhouette visually.",
                guide: ["colour_wardrobe", "layering_in_warm_climates"],
            },
        ],
        refinements: [
            {
                id: "e_r1",
                item: "Wool-silk-linen blends",
                priority: 6,
                tier: "luxury",
                mills: "Complex gunclub checks",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#666A42", note: "Olive/Brown multi-checks" },
                },
                why: "Allows you to wear complex, 'heavy-looking' tweeds in the dead of summer.",
                guide: ["fabrics", "suiting", "wool_silk_linen"],
            },
            {
                id: "e_r2",
                item: "Expressive colour accents",
                priority: 7,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D5A19C", note: "Soft pinks, ochres, teals" },
                },
                why: "You are one of the few archetypes that can deploy a bright accent color effectively.",
                guide: ["colour_wardrobe", "texture_vs_colour"],
            },
        ],
    },

    // 12. The Tropical Traditionalist (b)
    b: {
        outfits: [
            {
                name: "The Heatwave Executive",
                items: ["b_f1", "b_f4", "b_f5"],
                context: "Formal business in intense humidity.",
            },
            {
                name: "The Colonial Club",
                items: ["b_f2", "b_f3", "b_r2"],
                context: "Country club dinners and smart day events.",
            },
            {
                name: "The Breathable Classic",
                items: ["b_r1", "b_f3", "b_f4"],
                context: "Daily rotation for tropical professionals.",
            },
        ],
        foundation: [
            {
                id: "b_f1",
                item: "Tropical-weight suit",
                priority: 1,
                tier: "foundation",
                mills: "Holland & Sherry 'Crispaire' / Fresco",
                climate: ["tropical", "warm_climate"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy or mid-grey" },
                },
                why: "You want traditional tailoring codes but need them to survive 90% humidity. Open-weave worsteds are the only answer.",
                guide: ["fabrics", "suiting", "fresco"],
            },
            {
                id: "b_f2",
                item: "Breathable structured jacket",
                priority: 2,
                tier: "foundation",
                mills: "Mock Leno or Hopsack",
                climate: ["tropical", "warm_climate"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy blazers with open weaves" },
                },
                why: "Half-lined construction so the wind blows right through it, but keeps a structured shoulder.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "b_f3",
                item: "Classic dress trousers (lightweight)",
                priority: 3,
                tier: "foundation",
                climate: ["tropical", "warm_climate"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Stone, grey, or tan" },
                },
                why: "High-twist wool trousers won't stick to your legs in the heat and never lose their crease.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "b_f4",
                item: "Crisp dress shirts",
                priority: 4,
                tier: "foundation",
                mills: "Zephyr Cotton or Linen blends",
                climate: ["tropical", "warm_climate"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "White and ice blue" },
                },
                why: "Highly breathable shirting that still looks formal enough for a tie.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "b_f5",
                item: "Traditional footwear",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#3B2A22", note: "Brown calf leather" },
                },
                why: "Unlined loafers or lightweight oxfords. Skip the heavy double-leather soles.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "b_r1",
                item: "High-twist separate trousers",
                priority: 6,
                tier: "enhancement",
                climate: ["tropical", "warm_climate"],
                paletteGuidance: { all: { color: "#4A4A4A", note: "Charcoal fresco" } },
                why: "Fresco trousers are the secret weapon of the tropical wardrobe. Indestructible.",
                guide: ["fabrics", "suiting", "high_twist_wool"],
            },
            {
                id: "b_r2",
                item: "Classic ties for warm climates",
                priority: 7,
                tier: "luxury",
                climate: ["tropical", "warm_climate"],
                paletteGuidance: { all: { color: "#6E2233", note: "Grenadine silks" } },
                why: "Grenadine silk ties have an open weave that visually matches tropical suiting perfectly.",
                guide: ["about", "tropical_tailoring"],
            },
        ],
    },

    // 13. The Heritage Modernist (h)
    h: {
        outfits: [
            {
                name: "The New Establishment",
                items: ["h_f1", "h_f4", "h_f5"],
                context: "Modern boardrooms and important meetings.",
            },
            {
                name: "The Heritage Casual",
                items: ["h_f3", "h_r2", "h_f2"],
                context: "Weekend socializing with traditional roots.",
            },
            {
                name: "The Architectural Heirloom",
                items: ["h_r1", "h_f3", "h_f4"],
                context: "When construction and craft are the focus.",
            },
        ],
        foundation: [
            {
                id: "h_f1",
                item: "Classic suit with modern cut",
                priority: 1,
                tier: "foundation",
                mills: "VBC / Dugdale",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy or charcoal" },
                },
                why: "Traditional fabrics cut with slightly modern, cleaner proportions. Heritage without the dust.",
                guide: ["tailoring", "suits", "styles", "single_breasted"],
            },
            {
                id: "h_f2",
                item: "Heritage fabrics (worsted wool)",
                priority: 2,
                tier: "enhancement",
                mills: "Fox Brothers Flannel",
                climate: ["temperate"],
                paletteGuidance: {
                    "Heritage Browns": { color: "#684C39", note: "Rich brown or olive" },
                    "City Greys": { color: "#4A4A4A", note: "Mid-grey flannel" },
                },
                why: "You appreciate the history of cloth. Flannel, tweed, and heavy worsted are your playground.",
                guide: ["fabrics", "suiting", "worsted_wool"],
            },
            {
                id: "h_f3",
                item: "Traditional blazer",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy with subtle texture" },
                },
                why: "A modernized brass-button blazer or a soft tweed. Familiar codes updated.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "h_f4",
                item: "Quality dress shirts",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "White, blue, subtle stripes" },
                },
                why: "Substantial collars, classic patterns like Bengal stripes or micro-checks.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "h_f5",
                item: "Classic leather shoes",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#3B2A22", note: "Dark brown brogues or oxfords" },
                },
                why: "Bench-made shoes with traditional broguing or wingtips.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "h_r1",
                item: "Half-canvas construction",
                priority: 6,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Focus on internal structure" },
                },
                why: "You care about how it's built. A floating canvas chest piece ensures the jacket lives as long as the tradition it comes from.",
                guide: [
                    "tailoring",
                    "jackets",
                    "details",
                    "construction",
                    "half_canvas",
                ],
            },
            {
                id: "h_r2",
                item: "Heritage color palette",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    "Heritage Browns": { color: "#666A42", note: "Olive, rust, tobacco" },
                },
                why: "Deploying historical colors (hunting greens, equestrian browns) in modern city cuts.",
                guide: ["colour_wardrobe", "core_colours"],
            },
        ],
    },

    // 14. The Layering Specialist (l)
    l: {
        outfits: [
            {
                name: "The Three-Piece Modular",
                items: ["l_f1", "l_f3", "l_r2"],
                context: "Transitional weather and versatile daywear.",
            },
            {
                name: "The Textural Depth",
                items: ["l_r1", "l_f4", "l_f2"],
                context: "Rich autumnal or air-conditioned environments.",
            },
            {
                name: "The Smart Separates",
                items: ["l_f1", "l_f2", "l_f5"],
                context: "Dynamic casual office environments.",
            },
        ],
        foundation: [
            {
                id: "l_f1",
                item: "Versatile odd jacket",
                priority: 1,
                tier: "foundation",
                mills: "Hopsack or Mid-weight Tweed",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#687383", note: "Slate, olive, or brown" },
                },
                why: "Your wardrobe is built on separates. This jacket must pair with at least three different trousers.",
                guide: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            },
            {
                id: "l_f2",
                item: "Multiple trouser weights",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Stone, grey, navy" },
                },
                why: "You need trousers in linen, high-twist wool, and flannel to anchor your top-half layers across seasons.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "l_f3",
                item: "Layerable shirts",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#AFC4D6", note: "Chambray, oxford cloth, denim" },
                },
                why: "Shirts with enough texture to stand alone, but smooth enough to wear under a sweater and a jacket.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "l_f4",
                item: "Knitwear collection",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#8A5A3B", note: "Cardigans and vests in rich tones" },
                },
                why: "The secret weapon of the layering specialist. A merino vest bridges the gap between shirt and jacket beautifully.",
                guide: ["tailoring"],
            },
            {
                id: "l_f5",
                item: "Seasonal footwear",
                priority: 5,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#3B2A22", note: "Suede chukkas or derbies" },
                },
                why: "Shoes that can handle varying weather and varying levels of formality.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "l_r1",
                item: "Textured fabrics for depth",
                priority: 6,
                tier: "luxury",
                mills: "Donegal or Heavy Corduroy",
                climate: ["temperate", "indoor"],
                paletteGuidance: {
                    all: { color: "#666A42", note: "Speckled or ribbed textures" },
                },
                why: "When you layer 3 pieces, they must all have different textures (e.g., smooth shirt + ribbed knit + coarse jacket).",
                guide: ["fabrics", "suiting", "hopsack"],
            },
            {
                id: "l_r2",
                item: "Transitional outerwear",
                priority: 7,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy or olive mac coat" },
                },
                why: "The final layer. Needs to slip easily over a tailored jacket without bunching.",
                guide: ["colour_wardrobe", "layering_in_warm_climates"],
            },
        ],
    },

    // 15. The Texture Minimalist (x)
    x: {
        outfits: [
            {
                name: "The Tactile Monochrome",
                items: ["x_f1", "x_r1", "x_f3"],
                context: "Creative boardrooms and gallery openings.",
            },
            {
                name: "The Quiet Contrast",
                items: ["x_f2", "x_f4", "x_f5"],
                context: "Understated daily polish.",
            },
            {
                name: "The Tonal Anchor",
                items: ["x_r2", "x_f1", "x_f3"],
                context: "Sleek evening engagements.",
            },
        ],
        foundation: [
            {
                id: "x_f1",
                item: "Tonal suit (charcoal, stone)",
                priority: 1,
                tier: "foundation",
                mills: "Matte finish worsteds",
                climate: ["all"],
                paletteGuidance: {
                    "Soft Neutrals": { color: "#D8D0C2", note: "Stone or oat" },
                    "City Greys": { color: "#4A4A4A", note: "Matte charcoal" },
                },
                why: "You avoid bright colours and shiny fabrics. Your suit must be a calm, matte canvas.",
                guide: ["colour_wardrobe", "core_colours", "stone_beige"],
            },
            {
                id: "x_f2",
                item: "Textured neutral jacket",
                priority: 2,
                tier: "enhancement",
                mills: "Hopsack or Mock Leno",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#687383", note: "Textured slate or stone" },
                },
                why: "Interest is created through the 3D weave of the fabric rather than loud patterns.",
                guide: ["fabrics", "suiting", "hopsack"],
            },
            {
                id: "x_f3",
                item: "Monochrome trousers",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Black, charcoal, or dark navy" },
                },
                why: "Clean lines that don't distract from the texture of the top half.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "x_f4",
                item: "Minimal colour shirts",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Optic white or tonal greys" },
                },
                why: "High quality cotton poplin. Let the subtle texture of the jacket do the talking.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "x_f5",
                item: "Subtle footwear",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Matte black or dark grey suede" },
                },
                why: "Suede or matte leather. Avoid high-shine patent leathers.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "x_r1",
                item: "Summer tweed for texture",
                priority: 6,
                tier: "luxury",
                mills: "Silk-Linen-Wool blends",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Speckled stone or oat" },
                },
                why: "The holy grail for this archetype. Incredible visual depth from the slubby silk/linen mix, but in a muted palette.",
                guide: ["fabrics", "suiting", "summer_tweed"],
            },
            {
                id: "x_r2",
                item: "Texture over colour strategy",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#4A4A4A",
                        note: "Mix flannel, silk, and cotton in one colour",
                    },
                },
                why: "Pairing a charcoal flannel suit with a charcoal silk knit tie and a pale grey shirt. Masterful.",
                guide: ["colour_wardrobe", "texture_vs_colour"],
            },
        ],
    },

    // 16. The Performance Casual (p)
    p: {
        outfits: [
            {
                name: "The Active Commute",
                items: ["p_f1", "p_f2", "p_f5"],
                context: "Biking or walking to a creative office.",
            },
            {
                name: "The Resilient Traveler",
                items: ["p_r2", "p_f3", "p_r1"],
                context: "Long-haul flights arriving ready for dinner.",
            },
            {
                name: "The Technical Weekend",
                items: ["p_f4", "p_f2", "p_f5"],
                context: "Errands and off-duty movement.",
            },
        ],
        foundation: [
            {
                id: "p_f1",
                item: "Technical casual jacket",
                priority: 1,
                tier: "foundation",
                mills: "High-Twist or Technical Blends",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy or dark olive" },
                },
                why: "A jacket that stretches, breathes, and repels water while maintaining a tailored silhouette.",
                guide: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            },
            {
                id: "p_f2",
                item: "Performance trousers",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal or navy" },
                },
                why: "Hidden elastic waistbands, breathable fabrics, absolute comfort disguised as dress trousers.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "p_f3",
                item: "Easy-care shirts",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "White and light blue" },
                },
                why: "Shirts that require zero ironing and dry quickly. Untucked or tucked.",
                guide: ["tailoring", "shirts", "use_case", "smart_casual"],
            },
            {
                id: "p_f4",
                item: "Comfortable knitwear",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#5D718A", note: "Grey or airforce blue" },
                },
                why: "Washable merino wool that regulates body temperature dynamically.",
                guide: ["tailoring"],
            },
            {
                id: "p_f5",
                item: "Versatile loafers / Clean sneakers",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#1E1E1E",
                        note: "Minimalist white sneakers or suede loafers",
                    },
                },
                why: "Footwear built for 10,000 steps a day that still passes a dress code check.",
                guide: ["accessories", "shoes", "loafers", "suede_loafer"],
            },
        ],
        refinements: [
            {
                id: "p_r1",
                item: "High-twist fabrics",
                priority: 6,
                tier: "luxury",
                mills: "Fresco or Crispaire",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: { all: { color: "#243B5A", note: "Navy fresco" } },
                why: "The original 'performance' fabric. Wool spun so tightly it acts like a spring, refusing to wrinkle.",
                guide: ["fabrics", "suiting", "high_twist_wool"],
            },
            {
                id: "p_r2",
                item: "Travel-ready outerwear",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy packable mac" },
                },
                why: "A lightweight technical coat that packs into its own pocket.",
                guide: ["tailoring", "jackets", "use_case", "travel"],
            },
        ],
    },
    // ============================================
    // WARDROBE AUDIT WORKSHEET — PREMIUM TEMPLATE SYSTEM
    // PART 3 OF 3
    // ============================================

    // 17. The Occasion Maximalist (k)
    k: {
        outfits: [
            {
                name: "The Gala Statement",
                items: ["k_f1", "k_f3", "k_r1"],
                context: "Black tie optional and high-end evening events.",
            },
            {
                name: "The Bold Arrival",
                items: ["k_f2", "k_f4", "k_f5"],
                context: "Creative networking and launch parties.",
            },
            {
                name: "The Wedding Standard",
                items: ["k_r2", "k_f3", "k_f5"],
                context: "Making an impact as a guest without overshadowing.",
            },
        ],
        foundation: [
            {
                id: "k_f1",
                item: "Statement suit (double-breasted)",
                priority: 1,
                tier: "luxury",
                mills: "Rich Flannels or High-Twist",
                climate: ["all"],
                paletteGuidance: {
                    "Deep Colour": { color: "#223A57", note: "Deep ink navy" },
                    all: { color: "#223A57", note: "Bold navy or deep charcoal" },
                },
                why: "The double-breasted cut provides architectural sweep and immediate presence.",
                guide: ["tailoring", "suits", "styles", "double_breasted"],
            },
            {
                id: "k_f2",
                item: "Bold jacket options",
                priority: 2,
                tier: "enhancement",
                mills: "Velvet (Winter) / Silk Blends (Summer)",
                climate: ["all"],
                paletteGuidance: {
                    "Deep Colour": { color: "#6E2233", note: "Burgundy or forest green" },
                },
                why: "You thrive on occasion. A velvet dinner jacket or a silk-blend blazer ensures you are the best-dressed in the room.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "k_f3",
                item: "Formal dress shirts",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Stark white or dramatic black" },
                },
                why: "French cuffs and hidden plackets. The shirt must support the drama of the jacket.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "k_f4",
                item: "Expressive ties",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#B45C39", note: "Rich rusts or deep greens" },
                },
                why: "Wide silk ties with bold geometric patterns or rich solids.",
                guide: ["accessories"],
            },
            {
                id: "k_f5",
                item: "Polished dress shoes",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#1E1E1E",
                        note: "Patent leather or highly polished black calf",
                    },
                },
                why: "Evening wear demands footwear with high visual impact and immaculate shine.",
                guide: ["accessories", "shoes", "dress_shoes"],
            },
        ],
        refinements: [
            {
                id: "k_r1",
                item: "Peak lapel jacket",
                priority: 6,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Contrasting satin lapels" },
                },
                why: "The sweeping line of a peak lapel broadens the shoulders and commands attention.",
                guide: ["tailoring", "jackets", "details", "lapels", "peak"],
            },
            {
                id: "k_r2",
                item: "Wedding/event pieces",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal three-piece" },
                },
                why: "A dedicated three-piece suit ensures you are perpetually ready for major milestones.",
                guide: ["tailoring", "suits", "use_case", "wedding"],
            },
        ],
    },

    // 18. The Urban Formalist (f)
    f: {
        outfits: [
            {
                name: "The Executive Mandate",
                items: ["f_f1", "f_f4", "f_f5"],
                context: "Boardrooms and C-suite environments.",
            },
            {
                name: "The Sharp Contrast",
                items: ["f_f2", "f_f3", "f_f4"],
                context: "Business lunches and high-end client meetings.",
            },
            {
                name: "The City Stride",
                items: ["f_r1", "f_f3", "f_r2"],
                context: "Moving forcefully through the financial district.",
            },
        ],
        foundation: [
            {
                id: "f_f1",
                item: "Sharp business suit",
                priority: 1,
                tier: "foundation",
                mills: "High-Twist Worsted (Crispaire)",
                climate: ["all"],
                paletteGuidance: {
                    "Navy & Stone": { color: "#1F3550", note: "Immaculate dark navy" },
                    "City Greys": { color: "#454545", note: "Dark charcoal" },
                },
                why: "Your aesthetic is about control. The suit must hold a razor-sharp crease and pristine drape all day.",
                guide: ["tailoring", "suits", "use_case", "work"],
            },
            {
                id: "f_f2",
                item: "Structured blazer",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: { all: { color: "#223A57", note: "Dark navy" } },
                why: "Strong shoulders, roped sleeveheads. The jacket acts as professional armour.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "f_f3",
                item: "Crisp dress trousers",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#687383", note: "Mid-grey or slate" },
                },
                why: "A perfect break over the shoe and a sharp front crease. Sloppiness is the enemy.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "f_f4",
                item: "Formal dress shirts",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Optic white and ice blue" },
                },
                why: "Stiff collars that stand perfectly under a jacket lapel, with or without a tie.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "f_f5",
                item: "Polished oxfords",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Black calf leather" },
                },
                why: "The ultimate business shoe. Closed lacing, sleek profile, impeccably shined.",
                guide: ["accessories", "shoes", "dress_shoes"],
            },
        ],
        refinements: [
            {
                id: "f_r1",
                item: "Navy core wardrobe",
                priority: 6,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Multiple shades of navy" },
                },
                why: "Building depth through different weaves of the exact same highly professional colour.",
                guide: ["colour_wardrobe", "core_colours", "navy"],
            },
            {
                id: "f_r2",
                item: "City-appropriate accessories",
                priority: 7,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#C0C0C0", note: "Silver or steel hardware" },
                },
                why: "Sleek briefcases, minimal silver watches, discreet cufflinks. Everything must look precise.",
                guide: ["accessories"],
            },
        ],
    },

    // 19. The Pattern Enthusiast (n)
    n: {
        outfits: [
            {
                name: "The Checked Anchor",
                items: ["n_f1", "n_f3", "n_f5"],
                context: "Standing out confidently in smart-casual settings.",
            },
            {
                name: "The Pattern Clash",
                items: ["n_f1", "n_f2", "n_f4"],
                context: "Advanced sartorial moves for creative environments.",
            },
            {
                name: "The Textured Base",
                items: ["n_r2", "n_f2", "n_r1"],
                context:
                    "Letting a subtle shirt pattern breathe against solid texture.",
            },
        ],
        foundation: [
            {
                id: "n_f1",
                item: "Patterned suit or jacket",
                priority: 1,
                tier: "foundation",
                mills: "Prince of Wales or Gunclub Check",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#684C39", note: "Brown/Olive checks" },
                },
                why: "You are comfortable making a statement. A beautifully scaled check is your signature move.",
                guide: ["fabrics", "suiting", "summer_tweed"],
            },
            {
                id: "n_f2",
                item: "Checked or striped shirts",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#AFC4D6", note: "Blue Bengal stripes" },
                },
                why: "The foundation of pattern mixing. A tight stripe acts as a 'solid' when paired against a larger jacket check.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "n_f3",
                item: "Solid anchor pieces",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal or solid navy trousers" },
                },
                why: "If the top half is loud, the bottom half must be silent. This prevents the outfit from looking like a costume.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "n_f4",
                item: "Pattern-mixing accessories",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#B45C39",
                        note: "Dots, paisleys, and micro-geometrics",
                    },
                },
                why: "A dotted tie against a striped shirt under a checked jacket is the holy trinity of pattern mastery.",
                guide: ["accessories"],
            },
            {
                id: "n_f5",
                item: "Versatile footwear",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: { all: { color: "#3B2A22", note: "Brown brogues" } },
                why: "Brogues carry their own pattern (the perforations). They pair perfectly with textured, patterned tailoring.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "n_r1",
                item: "Texture and pattern guide",
                priority: 6,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Master scale and proportion" },
                },
                why: "Understanding that a small stripe and a large check work together, but two small patterns clash.",
                guide: ["colour_wardrobe", "texture_vs_colour"],
            },
            {
                id: "n_r2",
                item: "Hopsack or textured fabrics",
                priority: 7,
                tier: "luxury",
                mills: "Open-Weave Hopsack",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Solid navy with deep texture" },
                },
                why: "When you aren't wearing a printed pattern, you use the physical 3D weave of the cloth as your pattern.",
                guide: ["fabrics", "suiting", "hopsack"],
            },
        ],
    },

    // 20. The Neo-Traditionalist (d)
    d: {
        outfits: [
            {
                name: "The Updated Classic",
                items: ["d_f1", "d_f4", "d_f5"],
                context: "Traditional business, updated.",
            },
            {
                name: "The Soft Heritage",
                items: ["d_f2", "d_f3", "d_r2"],
                context: "Weekend social events with historical nods.",
            },
            {
                name: "The Climate Classic",
                items: ["d_r1", "d_f3", "d_f4"],
                context: "Looking historically correct in the sweltering heat.",
            },
        ],
        foundation: [
            {
                id: "d_f1",
                item: "Updated classic suit",
                priority: 1,
                tier: "foundation",
                mills: "VBC Super 110s",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy with a modern taper" },
                },
                why: "You respect the rules but reject the stiffness. The suit must look traditional but feel light and modern.",
                guide: ["tailoring", "suits", "styles", "single_breasted"],
            },
            {
                id: "d_f2",
                item: "Modern-cut traditional jacket",
                priority: 2,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    "Heritage Browns": { color: "#684C39", note: "Brown herringbone" },
                    all: { color: "#4A4A4A", note: "Grey herringbone" },
                },
                why: "Historical patterns (houndstooth, herringbone) cut with softer shoulders and half-canvas interiors.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "d_f3",
                item: "Classic trousers",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: { all: { color: "#D8D2C4", note: "Stone or fawn" } },
                why: "A slightly higher rise with side adjusters. Classic tailoring details without the bulk.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "d_f4",
                item: "Quality dress shirts",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "White, pale blue, ecru" },
                },
                why: "Substantial collars that roll beautifully under a jacket lapel.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "d_f5",
                item: "Traditional footwear",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#3B2A22", note: "Dark brown loafers or oxfords" },
                },
                why: "Goodyear-welted shoes are a nod to true craftsmanship.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "d_r1",
                item: "Tropical tailoring",
                priority: 6,
                tier: "enhancement",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#D8D2C4", note: "Light, breathable tones" },
                },
                why: "Knowing how to look like a gentleman from the 1930s without sweating like one.",
                guide: ["about", "tropical_tailoring"],
            },
            {
                id: "d_r2",
                item: "Lighter heritage fabrics",
                priority: 7,
                tier: "luxury",
                mills: "Fox Air / Fresco",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal or mid-grey" },
                },
                why: "Using high-twist open weaves to mimic the drape of heavy vintage wools.",
                guide: ["fabrics", "suiting", "fresco"],
            },
        ],
    },

    // 21. The Quiet Modernist (y)
    y: {
        outfits: [
            {
                name: "The Minimalist Anchor",
                items: ["y_f1", "y_f4", "y_f5"],
                context: "High-level creative or modern business.",
            },
            {
                name: "The Tonal Shift",
                items: ["y_f2", "y_f3", "y_r2"],
                context: "Evening events and gallery spaces.",
            },
            {
                name: "The Quiet Wardrobe",
                items: ["y_r1", "y_f3", "y_f4"],
                context: "Effortless, repetitive daily elegance.",
            },
        ],
        foundation: [
            {
                id: "y_f1",
                item: "Clean minimal suit",
                priority: 1,
                tier: "foundation",
                mills: "Matte Worsteds",
                climate: ["all"],
                paletteGuidance: {
                    "City Greys": { color: "#4A4A4A", note: "Charcoal or stark black" },
                    all: { color: "#243B5A", note: "Dark navy" },
                },
                why: "No contrast stitching, minimal pockets. The silhouette does all the talking.",
                guide: ["tailoring", "suits"],
            },
            {
                id: "y_f2",
                item: "Understated jacket",
                priority: 2,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#687383", note: "Slate grey or soft navy" },
                },
                why: "A soft, unstructured odd jacket that looks almost like architectural knitwear.",
                guide: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            },
            {
                id: "y_f3",
                item: "Simple trousers",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Black or charcoal" },
                },
                why: "Flat front, slight taper. The pant leg must fall cleanly without pooling over the shoe.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "y_f4",
                item: "Minimal shirts",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#F3F0EA", note: "Optic white, grey, or black" },
                },
                why: "Hidden plackets, stiff small collars. Often worn without a tie, buttoned to the top.",
                guide: ["tailoring", "shirts", "use_case", "smart_casual"],
            },
            {
                id: "y_f5",
                item: "Clean-line shoes",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#1E1E1E",
                        note: "Black leather boots or minimal sneakers",
                    },
                },
                why: "Chelsea boots or sleek monochrome sneakers. Zero broguing or unnecessary detailing.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "y_r1",
                item: "Tonal wardrobe building",
                priority: 6,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    "City Greys": {
                        color: "#B8B8B3",
                        note: "Mastering the grey gradient",
                    },
                },
                why: "Dressing in varying shades of exactly the same colour creates instant architectural depth.",
                guide: ["colour_wardrobe", "core_wardrobe_anchors"],
            },
            {
                id: "y_r2",
                item: "Quiet palette anchors",
                priority: 7,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    "Soft Neutrals": { color: "#D8D0C2", note: "Stone, oat, mushroom" },
                },
                why: "Investing heavily in the 3 core colours that make up 90% of your wardrobe.",
                guide: ["colour_wardrobe", "building_a_wardrobe"],
            },
        ],
    },

    // 22. The Seasonal Purist (z)
    z: {
        outfits: [
            {
                name: "The Winter Weight",
                items: ["z_f1", "z_r2", "z_f5"],
                context: "Cold-weather business and layering.",
            },
            {
                name: "The Summer Breeze",
                items: ["z_f2", "z_f3", "z_f4"],
                context: "Surviving the heat with dignity.",
            },
            {
                name: "The Transitional Layer",
                items: ["z_r1", "z_f2", "z_f3"],
                context: "Autumn and Spring adaptability.",
            },
        ],
        foundation: [
            {
                id: "z_f1",
                item: "Seasonal suit",
                priority: 1,
                tier: "foundation",
                mills: "Fresco (Summer) / Flannel (Winter)",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy in two distinct weights" },
                },
                why: "You refuse to wear a 'four-season' suit. You buy specific weights for specific weather. This is true sartorial mastery.",
                guide: ["fabrics", "suiting", "fresco"],
            },
            {
                id: "z_f2",
                item: "Climate-appropriate jackets",
                priority: 2,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#684C39",
                        note: "Brown tweed (Winter) / Tan linen (Summer)",
                    },
                },
                why: "Heavy, insulating textures when it's cold. Open, light-bouncing weaves when it's hot.",
                guide: ["tailoring", "jackets"],
            },
            {
                id: "z_f3",
                item: "Varied trouser weights",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal flannel and grey fresco" },
                },
                why: "The drape of a heavy winter trouser is entirely different from a summer trouser.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "z_f4",
                item: "Seasonal shirting",
                priority: 4,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#F3F0EA",
                        note: "White poplin (Summer) / Ecru brushed (Winter)",
                    },
                },
                why: "Swapping crisp poplin for soft, heat-trapping brushed cotton as the temperature drops.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "z_f5",
                item: "Weather-appropriate footwear",
                priority: 5,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: {
                        color: "#3B2A22",
                        note: "Dainite soles for rain, leather for sun",
                    },
                },
                why: "Suede and unlined loafers for the heat. Heavy, rubber-soled boots or brogues for the wet and cold.",
                guide: ["accessories", "shoes"],
            },
        ],
        refinements: [
            {
                id: "z_r1",
                item: "Layering for seasons",
                priority: 6,
                tier: "luxury",
                climate: ["temperate"],
                paletteGuidance: {
                    all: { color: "#6E7440", note: "Olive and autumnal tones" },
                },
                why: "The art of adding cardigans, vests, and overcoats to adapt to shifting daily temperatures.",
                guide: ["colour_wardrobe", "layering_in_warm_climates"],
            },
            {
                id: "z_r2",
                item: "Worsted for temperate",
                priority: 7,
                tier: "foundation",
                mills: "Classic Serge Twills",
                climate: ["temperate"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Classic navy worsted" },
                },
                why: "When the weather is perfectly balanced, the classic medium-weight worsted wool reigns supreme.",
                guide: ["fabrics", "suiting", "worsted_wool"],
            },
        ],
    },

    // 23. The Riviera Minimalist (v)
    v: {
        outfits: [
            {
                name: "The Sunset Dinner",
                items: ["v_f1", "v_f4", "v_f5"],
                context: "Warm-weather elegance and resort dining.",
            },
            {
                name: "The Easy Tailoring",
                items: ["v_f2", "v_f3", "v_f5"],
                context: "Smart-casual daytime wandering.",
            },
            {
                name: "The Light Layer",
                items: ["v_r1", "v_f4", "v_f3"],
                context: "Cooler coastal evenings.",
            },
        ],
        foundation: [
            {
                id: "v_f1",
                item: "Lightweight linen suit",
                priority: 1,
                tier: "foundation",
                mills: "Irish Linen or Cotton-Silk",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    "Riviera Light": { color: "#D8D0C2", note: "Stone or cream" },
                    "Earth & Olive": { color: "#D6BE98", note: "Warm sand" },
                },
                why: "The ultimate expression of effortless elegance. Must be slightly rumpled to look authentic.",
                guide: ["fabrics", "suiting", "linen_suiting"],
            },
            {
                id: "v_f2",
                item: "Soft odd jacket",
                priority: 2,
                tier: "foundation",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    "Riviera Light": { color: "#F4ECDD", note: "Cream or ivory" },
                },
                why: "Zero padding, zero lining. It should wear exactly like a shirt.",
                guide: ["tailoring", "jackets", "other_styles", "soft_odd_jacket"],
            },
            {
                id: "v_f3",
                item: "Relaxed trousers",
                priority: 3,
                tier: "foundation",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#D8C3A5", note: "Sand, stone, or white" },
                },
                why: "Drawstring or side-adjuster trousers with a slightly wider leg for airflow.",
                guide: ["tailoring", "trousers"],
            },
            {
                id: "v_f4",
                item: "Fine poplin or linen shirts",
                priority: 4,
                tier: "foundation",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#AFC4D6", note: "Ice blue or crisp white" },
                },
                why: "Worn open at the collar. The fabric must be light enough to catch the breeze.",
                guide: ["tailoring", "shirts", "fabrics", "poplin"],
            },
            {
                id: "v_f5",
                item: "Suede loafers",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#B59C84", note: "Tan or snuff suede" },
                },
                why: "Worn without socks. Suede absorbs light and looks infinitely softer than polished calf.",
                guide: ["accessories", "shoes", "loafers", "suede_loafer"],
            },
        ],
        refinements: [
            {
                id: "v_r1",
                item: "Light-weight knits",
                priority: 6,
                tier: "enhancement",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: {
                    all: { color: "#9FB9CF", note: "Soft blue or oat" },
                },
                why: "Cotton-silk or fine merino crewnecks thrown over the shoulders when the sun sets.",
                guide: ["tailoring"],
            },
            {
                id: "v_r2",
                item: "Soft canvas weekend bag",
                priority: 7,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#D8D0C2", note: "Natural canvas with tan leather" },
                },
                why: "The aesthetic extends to the luggage. Avoid harsh, structured briefcases.",
                guide: ["accessories"],
            },
        ],
    },

    // 24. The Occasion Modernist (o)
    o: {
        outfits: [
            {
                name: "The Modern Gala",
                items: ["o_f1", "o_f3", "o_f5"],
                context: "Black tie optional and high-impact evenings.",
            },
            {
                name: "The Architectural Event",
                items: ["o_f2", "o_r1", "o_f3"],
                context: "Weddings, openings, and sharp celebrations.",
            },
            {
                name: "The Silk Blend",
                items: ["o_r2", "o_f3", "o_f5"],
                context: "Summer weddings requiring elevated fabric.",
            },
        ],
        foundation: [
            {
                id: "o_f1",
                item: "Sharply tailored suit",
                priority: 1,
                tier: "foundation",
                mills: "High-Twist or Silk Blends",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#223A57", note: "Dark navy or charcoal" },
                    "Deep Colour": { color: "#223A57", note: "Deep ink" },
                },
                why: "You dress for moments that matter. The silhouette must be clean, structured, and visually powerful.",
                guide: ["tailoring", "suits", "styles", "single_breasted"],
            },
            {
                id: "o_f2",
                item: "Double-breasted blazer",
                priority: 2,
                tier: "luxury",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy with stark buttons" },
                },
                why: "The DB cut creates an immediate V-shape and elevates the formality of any room you enter.",
                guide: ["tailoring", "suits", "styles", "double_breasted"],
            },
            {
                id: "o_f3",
                item: "Crisp dress shirts",
                priority: 3,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: { all: { color: "#F3F0EA", note: "Optic white" } },
                why: "The canvas for your suit. It must be pristine. Consider a hidden placket for maximum modernism.",
                guide: ["tailoring", "shirts"],
            },
            {
                id: "o_f4",
                item: "Silk ties",
                priority: 4,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Black or deep navy silk" },
                },
                why: "Woven silk or satin. The modern evening requires a tie that catches the light elegantly.",
                guide: ["accessories"],
            },
            {
                id: "o_f5",
                item: "Polished dress shoes",
                priority: 5,
                tier: "foundation",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Highly polished black leather" },
                },
                why: "A dull shoe ruins a sharp suit. Invest in whole-cuts or cap-toe oxfords.",
                guide: ["accessories", "shoes", "dress_shoes"],
            },
        ],
        refinements: [
            {
                id: "o_r1",
                item: "Peak lapel details",
                priority: 6,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal peak lapel" },
                },
                why: "A peak lapel points the eye toward the shoulders, creating an authoritative, celebratory stance.",
                guide: ["tailoring", "jackets", "details", "lapels", "peak"],
            },
            {
                id: "o_r2",
                item: "Wool-silk blend suit",
                priority: 7,
                tier: "luxury",
                mills: "Loro Piana 'Australis' or Silk Blends",
                climate: ["warm_climate", "tropical"],
                paletteGuidance: { all: { color: "#243B5A", note: "Navy silk-blend" } },
                why: "The silk content gives the fabric a subtle, natural luster under evening lights.",
                guide: ["fabrics", "suiting", "wool_silk_linen"],
            },
        ],
    },
};

// ============================================
// HELPERS
// ============================================

// Palette color chip database
var paletteColorChips = {
    "Earth & Olive": {
        navy: { color: "#3B4A4F", note: "Dark olive-navy" },
        grey: { color: "#6E7440", note: "Olive grey" },
        brown: { color: "#8A5B3C", note: "Tobacco brown" },
        stone: { color: "#D6BE98", note: "Warm stone" },
        white: { color: "#F3EBDD", note: "Cream white" },
    },
    "Riviera Light": {
        navy: { color: "#58708A", note: "Soft airforce" },
        grey: { color: "#B89D82", note: "Warm taupe" },
        brown: { color: "#B89D82", note: "Warm taupe" },
        stone: { color: "#D8D0C2", note: "Stone" },
        white: { color: "#F4ECDD", note: "Cream" },
    },
    "Navy & Stone": {
        navy: { color: "#1F3550", note: "True navy" },
        grey: { color: "#687383", note: "Slate grey" },
        brown: { color: "#8A5A3B", note: "Medium brown" },
        stone: { color: "#D9D1C4", note: "Soft stone" },
        white: { color: "#F3F0EA", note: "Off-white" },
    },
    "Soft Neutrals": {
        navy: { color: "#5D718A", note: "Soft navy" },
        grey: { color: "#B6B3AC", note: "Soft grey" },
        brown: { color: "#A59684", note: "Mushroom" },
        stone: { color: "#D8D0C2", note: "Stone" },
        white: { color: "#E6DED2", note: "Oat" },
    },
    "City Greys": {
        navy: { color: "#223A57", note: "Dark navy" },
        grey: { color: "#454545", note: "Charcoal" },
        brown: { color: "#3B2A22", note: "Dark brown" },
        stone: { color: "#AFAFA9", note: "Soft grey" },
        white: { color: "#F2EEE7", note: "Off-white" },
    },
    "Heritage Browns": {
        navy: { color: "#2E483B", note: "Forest green-navy" },
        grey: { color: "#666A42", note: "Olive grey" },
        brown: { color: "#684C39", note: "Heritage brown" },
        stone: { color: "#A18868", note: "Warm stone" },
        white: { color: "#F3EBDD", note: "Cream" },
    },
    "Deep Colour": {
        navy: { color: "#223A57", note: "Deep navy" },
        grey: { color: "#3A2A23", note: "Dark chocolate" },
        brown: { color: "#634434", note: "Deep brown" },
        stone: { color: "#687383", note: "Slate" },
        white: { color: "#F3F0EA", note: "Crisp white" },
    },
    "Expressive Colour": {
        navy: { color: "#223A57", note: "True navy" },
        grey: { color: "#687383", note: "Soft grey" },
        brown: { color: "#B45C39", note: "Rust brown" },
        stone: { color: "#D8D0C2", note: "Stone" },
        white: { color: "#F3F0EA", note: "White" },
    },
};

function getWardrobeTemplate(archetypeKey) {
    return wardrobeTemplates[archetypeKey] || wardrobeTemplates.q;
}

function getColorChipForItem(item, selectedPalette) {
    if (!item.paletteGuidance || !selectedPalette) return null;

    if (item.paletteGuidance[selectedPalette]) {
        return item.paletteGuidance[selectedPalette];
    }

    if (item.paletteGuidance["all"]) {
        return item.paletteGuidance["all"];
    }

    var firstKey = Object.keys(item.paletteGuidance);
    return item.paletteGuidance[firstKey];
}

function filterItemsByClimate(items, selectedClimate) {
    if (!selectedClimate) return items;

    return items.filter(function (item) {
        if (!item.climate || item.climate.length === 0 || item.climate === "all") {
            return true;
        }

        var climateMap = {
            Tropical: "tropical",
            "Warm & Dry": "warm_climate",
            Temperate: "temperate",
            "Indoor Climate": "tropical",
        };

        var normalizedClimate =
            climateMap[selectedClimate] ||
            selectedClimate.toLowerCase().replace(/ /g, "_");

        return (
            item.climate.indexOf(normalizedClimate) !== -1 ||
            item.climate.indexOf("all") !== -1
        );
    });
}

function getLensRules(garmentDrawLabel) {
    var rules = [];

    if (garmentDrawLabel === "Cloth First") {
        rules = [
            "Harmonise your textures. A crisp worsted wool pairs best with refined trousers, while heavier tweeds or hopsack sit beautifully alongside denim and chinos.",
            "In warmer climates, prioritise the openness of the weave over the sheer weight of the cloth. Fabrics like fresco allow air to circulate while holding a clean drape.",
            "Let the cloth take the lead. If wearing a heavily textured jacket, balance it with a smooth, understated shirt to allow the jacket's character to stand out.",
        ];
    } else if (garmentDrawLabel === "Shape First") {
        rules = [
            "Prioritise classical proportions. A jacket that gently covers the seat maintains an elegant, unbroken line down the body.",
            "Consider a slightly higher rise on your trousers. This elongates the leg and ensures a seamless transition between your trousers and jacket fastening.",
            "Pay close attention to the collar. A well-cut jacket should rest cleanly against the back of your shirt collar, anchoring the entire silhouette.",
        ];
    } else if (garmentDrawLabel === "Detail First") {
        rules = [
            "Allow distinctive details room to breathe. If you opt for a peak lapel or a rich lining, keep the surrounding elements quiet and controlled.",
            "Create harmony through hardware. Ensuring the metals on your watch, belt, and tailoring align subtly elevates the entire look.",
            "Embrace details meant for the wearer. A hand-finished lapel buttonhole or a considered lining offers a quiet, personal luxury.",
        ];
    } else if (garmentDrawLabel === "Wardrobe First") {
        rules = [
            "Think in combinations. A new jacket is most valuable when it effortlessly complements at least two to three pairs of trousers you already own.",
            "Anchor your wardrobe in core neutrals. Navy, charcoal, and stone provide a highly versatile foundation that makes introducing seasonal colours much easier.",
            "Build depth through tonal layering. Collecting shirts and knitwear in shades just lighter or darker than your tailoring creates an inherently cohesive wardrobe.",
        ];
    } else {
        rules = [
            "Fit remains the foundation. A perfectly proportioned silhouette will always communicate more elegance than a label or price tag.",
            "Let the climate guide your cloth. True comfort yields a natural, unforced confidence.",
            "Care for your garments. A well-pressed trouser and a nourished shoe signal a quiet respect for the craft.",
        ];
    }

    return rules;
}
