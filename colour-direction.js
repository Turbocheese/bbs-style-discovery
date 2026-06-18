var colourDirectionQuestions = [
    {
        id: "skin_depth",
        text: "Which skin depth feels closest to you?",
        helper:
            "Choose the closest match. If you are unsure, that is completely fine.",
        opts: [
            {
                a: "Light",
                b: "Fair to light",
                swatches: ["#F3D7C6"],
                s: {
                    light: 3,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 1,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 0,
                },
            },
            {
                a: "Light-Medium",
                b: "Light with warmth",
                swatches: ["#E4BC9D"],
                s: {
                    light: 2,
                    medium: 1,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 1,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 0,
                },
            },
            {
                a: "Medium",
                b: "Medium tone",
                swatches: ["#C98E68"],
                s: {
                    light: 0,
                    medium: 3,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 0,
                },
            },
            {
                a: "Tan",
                b: "Tan to deep",
                swatches: ["#A96B49"],
                s: {
                    light: 0,
                    medium: 2,
                    deep: 1,
                    warm: 0,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 1,
                    colourOpen: 0,
                    neutralLean: 0,
                },
            },
            {
                a: "Deep",
                b: "Deep tone",
                swatches: ["#6A3F2C"],
                s: {
                    light: 0,
                    medium: 0,
                    deep: 3,
                    warm: 0,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 2,
                    colourOpen: 0,
                    neutralLean: 0,
                },
            },
            {
                a: "I'm not sure",
                b: "Skip this question",
                swatches: ["#D9C8BB"],
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 1,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 0,
                },
            },
        ],
    },
    {
        id: "undertone",
        text: "Which undertone feels closest to your skin?",
        helper: "This is about the subtle warmth or coolness in the skin, not your overall depth.",
        opts: [
            {
                a: "Warmer / golden",
                b: "Golden, peachy cast",
                swatches: ["#D8A46A", "#C98A52"],
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 3,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 0,
                    colourOpen: 1,
                    neutralLean: 0,
                },
            },
            {
                a: "Cooler / pinker",
                b: "Pink, rosy cast",
                swatches: ["#D7A7A0", "#C58F96"],
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 3,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 0,
                    colourOpen: 1,
                    neutralLean: 0,
                },
            },
            {
                a: "Neutral / balanced",
                b: "No obvious lean",
                swatches: ["#D5B59C", "#C8A78C"],
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 3,
                    olive: 0,
                    softContrast: 1,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 1,
                },
            },
            {
                a: "Olive / muted",
                b: "Green, muted cast",
                swatches: ["#B5A06F", "#9B8A5A"],
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 1,
                    cool: 0,
                    neutral: 1,
                    olive: 3,
                    softContrast: 2,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 1,
                },
            },
            {
                a: "Rich / saturated", // ← NEW OPTION
                b: "Deeper, more colour",
                swatches: ["#8B5A42", "#6F4030"],
                s: {
                    light: 0,
                    medium: 1,
                    deep: 2,
                    warm: 1,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 2,
                    colourOpen: 2,
                    neutralLean: 0,
                },
            },
            {
                a: "I'm not sure",
                b: "Skip this question",
                swatches: ["#D9C8BB"],
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 1,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 1,
                },
            },
        ],
    },

    {
        id: "contrast_preference",
        text: "What kind of contrast usually feels best on you?",
        helper:
            "Think about the difference between the colours you wear — softer and blended, or clearer and stronger.",
        opts: [
            {
                a: "Softer, tonal contrast",
                b: "Gentle, blended tones",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 1,
                    olive: 1,
                    softContrast: 3,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 2,
                },
            },
            {
                a: "Balanced contrast",
                b: "Moderate disinctions",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 2,
                    olive: 0,
                    softContrast: 1,
                    strongContrast: 1,
                    colourOpen: 0,
                    neutralLean: 1,
                },
            },
            {
                a: "Stronger contrast",
                b: "Clear, defined edges",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 3,
                    colourOpen: 1,
                    neutralLean: 0,
                },
            },
            {
                a: "I'm not sure yet",
                b: "Skip question",
                swatches: ["#D9C8BB"],
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 1,
                    olive: 0,
                    softContrast: 1,
                    strongContrast: 1,
                    colourOpen: 0,
                    neutralLean: 1,
                },
            },
        ],
    },
    {
        id: "colour_comfort",
        text: "How do you like to use colour in your wardrobe?",
        helper: null,
        opts: [
            {
                a: "Mostly neutrals",
                b: "Neutrals First",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 2,
                    olive: 0,
                    softContrast: 1,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 3,
                },
            },
            {
                a: "One accent colour",
                b: "One Accent",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 1,
                    olive: 0,
                    softContrast: 1,
                    strongContrast: 0,
                    colourOpen: 1,
                    neutralLean: 2,
                },
            },
            {
                a: "A little more variation",
                b: "Some Variation",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 1,
                    colourOpen: 2,
                    neutralLean: 1,
                },
            },
            {
                a: "I'm open to colour",
                b: "Open to Colour",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 0,
                    olive: 0,
                    softContrast: 0,
                    strongContrast: 1,
                    colourOpen: 3,
                    neutralLean: 0,
                },
            },
        ],
    },
    {
        id: "main_need",
        text: "What would be most useful right now?",
        helper: null,
        opts: [
            {
                a: "Colours that suit me best",
                b: "Suitability",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 1,
                    cool: 1,
                    neutral: 1,
                    olive: 1,
                    softContrast: 1,
                    strongContrast: 1,
                    colourOpen: 0,
                    neutralLean: 0,
                },
            },
            {
                a: "Matching colours together",
                b: "Matching",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 2,
                    olive: 1,
                    softContrast: 2,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 2,
                },
            },
            {
                a: "Building a stronger palette",
                b: "Palette Building",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 1,
                    cool: 1,
                    neutral: 1,
                    olive: 1,
                    softContrast: 1,
                    strongContrast: 1,
                    colourOpen: 1,
                    neutralLean: 1,
                },
            },
            {
                a: "Adding colour without overdoing it",
                b: "Controlled Colour",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 1,
                    olive: 0,
                    softContrast: 2,
                    strongContrast: 0,
                    colourOpen: 1,
                    neutralLean: 2,
                },
            },
            {
                a: "Understanding seasonal changes", // ← NEW OPTION
                b: "Seasonal Guidance",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 1,
                    cool: 1,
                    neutral: 1,
                    olive: 1,
                    softContrast: 1,
                    strongContrast: 1,
                    colourOpen: 0,
                    neutralLean: 1,
                },
            },
            {
                a: "Dressing more confidently in neutrals",
                b: "Neutral Confidence",
                s: {
                    light: 0,
                    medium: 0,
                    deep: 0,
                    warm: 0,
                    cool: 0,
                    neutral: 2,
                    olive: 0,
                    softContrast: 2,
                    strongContrast: 0,
                    colourOpen: 0,
                    neutralLean: 3,
                },
            },
        ],
    },
];
var colourDirectionProfiles = {
    soft_tonal_warmth: {
        key: "soft_tonal_warmth",
        name: "Soft Tonal Warmth",
        desc: "You look best in softly blended, warmer tones. These colours feel natural, grounded, and gently connected rather than sharply contrasted.",
        bestColours: [
            { name: "Stone", hex: "#D8D2C4" },
            { name: "Warm Taupe", hex: "#B59C84" },
            { name: "Tobacco", hex: "#8A5A3B" },
            { name: "Olive", hex: "#7A7F47" },
            { name: "Cream", hex: "#F3EBDD" },
        ],
        strongNeutrals: [
            { name: "Stone", hex: "#D8D2C4" },
            { name: "Oat", hex: "#D9D2C3" },
            { name: "Warm Taupe", hex: "#B59C84" },
            { name: "Soft Brown", hex: "#8A5A3B" },
        ],
        accentColours: [
            { name: "Olive", hex: "#7A7F47" },
            { name: "Terracotta", hex: "#C96F4A" },
            { name: "Soft Blue", hex: "#AFC4D6" },
        ],
        contrast: "Soft",
        contrastNote: "Keep combinations tonal and gently blended rather than strongly separated.",
        matching: [
            "Stone + Olive + Cream",
            "Warm Taupe + Tobacco + Soft Blue",
            "Oat + Terracotta + Sand",
        ],
        fabricFinish: {
            title: "Light Absorbing Textures",
            desc: "Your skin harmonises best with matte fabrics. Opt for linen blends, brushed cottons, and flannel. These textures naturally diffuse light, making colours appear softer and richer, preventing the clothes from overpowering you."
        },
        contrastArchitecture: {
            title: "Tonal Layering",
            desc: "When pairing a jacket and shirt, keep the shades relatively close. A tobacco jacket over a warm taupe shirt creates a continuous, elegant flow that suits you far better than stark contrast."
        },
        hardware: {
            title: "Organic Hardware",
            desc: "Favour matte brass, bronze, dark brown horn, and woven leather buttons. Avoid cold silver metals or stark black onyx, as they will disrupt your warm, grounded baseline."
        },
        pattern: {
            title: "Blended Geometry",
            desc: "Avoid stark, high contrast chalk stripes. You require blended, tonal patterns like muted glen checks or subtle herringbone where the colours bleed gently into one another."
        },
        strategy: {
            title: "The Styling Cheat Code",
            desc: "If you must wear a stark black or pure optic white, keep it strictly to the lower half of the body. Always ground harsh colours by wearing your core tonal shades directly near the face."
        }
    },
    clean_cool_contrast: {
        key: "clean_cool_contrast",
        name: "Clean Cool Contrast",
        desc: "You look strongest in clearer, cooler combinations. Your best colours have enough separation to feel fresh, sharp, and visually defined without becoming severe.",
        bestColours: [
            { name: "Soft Grey", hex: "#B8B8B3" },
            { name: "Navy", hex: "#243B5A" },
            { name: "Off-White", hex: "#F3F0EA" },
            { name: "Airforce Blue", hex: "#5D718A" },
            { name: "Charcoal", hex: "#4A4A4A" },
        ],
        strongNeutrals: [
            { name: "Navy", hex: "#243B5A" },
            { name: "Soft Grey", hex: "#B8B8B3" },
            { name: "Off-White", hex: "#F3F0EA" },
            { name: "Charcoal", hex: "#4A4A4A" },
        ],
        accentColours: [
            { name: "Steel Blue", hex: "#8FAFCA" },
            { name: "Burgundy", hex: "#6E2233" },
            { name: "Forest", hex: "#2F4A3C" },
        ],
        contrast: "Balanced to Strong",
        contrastNote: "Clearer contrast works well for you, but it should still feel controlled rather than stark.",
        matching: [
            "Navy + Off-White + Soft Grey",
            "Charcoal + Airforce Blue + White",
            "Soft Grey + Burgundy + Navy",
        ],
        fabricFinish: {
            title: "Crisp & Light Bouncing",
            desc: "Your profile requires clarity. You excel in high-twist worsted wools, crisp poplin, and gabardine. These fabrics bounce light cleanly, ensuring your colours stay sharp, saturated, and highly defined."
        },
        contrastArchitecture: {
            title: "Sharp Separation",
            desc: "You carry visual separation beautifully. Build a clean, structured base of contrast. Framing your face with a deep charcoal jacket and a stark off-white shirt projects natural authority."
        },
        hardware: {
            title: "Polished & Cold",
            desc: "Opt for stark white Mother of Pearl, onyx, or polished silver metals. Avoid warm brass or wooden horn buttons. You need hardware that mirrors the clean edge of your palette."
        },
        pattern: {
            title: "Defined Edges",
            desc: "You handle highly defined, geometric prints perfectly. Sharp pinstripes, crisp windowpanes, and high contrast houndstooth are incredibly effective on your profile."
        },
        strategy: {
            title: "The Styling Cheat Code",
            desc: "If you want to wear a colour that is overly warm or muted, anchor it with pure navy or stark white directly against the collar. This frames your face in your best contrast while allowing the experimental colour to act as an accent."
        }
    },
    earth_led_balance: {
        key: "earth_led_balance",
        name: "Earth Led Balance",
        desc: "You suit grounded, natural colour better than sharp or synthetic contrast. Earthy combinations will feel rooted, warm, and quietly expressive.",
        bestColours: [
            { name: "Olive", hex: "#7A7F47" },
            { name: "Tobacco", hex: "#8A5A3B" },
            { name: "Sand", hex: "#D8C3A5" },
            { name: "Terracotta", hex: "#C96F4A" },
            { name: "Cream", hex: "#F3EBDD" },
        ],
        strongNeutrals: [
            { name: "Olive", hex: "#7A7F47" },
            { name: "Sand", hex: "#D8C3A5" },
            { name: "Tobacco", hex: "#8A5A3B" },
            { name: "Cream", hex: "#F3EBDD" },
        ],
        accentColours: [
            { name: "Terracotta", hex: "#C96F4A" },
            { name: "Muted Rust", hex: "#B4603D" },
            { name: "Soft Moss", hex: "#6C6F45" },
        ],
        contrast: "Balanced",
        contrastNote: "You work best with grounded contrast. You need enough separation to create structure, but not so much that the palette feels harsh.",
        matching: [
            "Olive + Sand + Cream",
            "Tobacco + Terracotta + Stone",
            "Sand + Moss + Soft Brown",
        ],
        fabricFinish: {
            title: "Rich & Dimensional",
            desc: "Flat, shiny fabrics can look synthetic on you. Lean into texture with tweed, hopsack, and heavy twills. The micro-shadows created by these weaves deepen your earthy colours and give them incredible architectural weight."
        },
        contrastArchitecture: {
            title: "Textural Contrast",
            desc: "Instead of relying purely on contrasting colours, build your outfit using different textures. An olive hopsack jacket over a cream brushed cotton shirt provides visual depth without jarring colour breaks."
        },
        hardware: {
            title: "Antiqued Elements",
            desc: "Select antiqued brass, tortoiseshell, and burnt horn. Highly polished silver or glossy metals will look disconnected. Your hardware should look as organic and rich as your cloth."
        },
        pattern: {
            title: "Textural Weaves",
            desc: "Favour patterns created by the weave itself rather than printed ink. Donegal flecks, complex gunclub checks, and slubby linen irregularities bring your wardrobe to life."
        },
        strategy: {
            title: "The Styling Cheat Code",
            desc: "If you must wear a stark, high contrast colour like black or pure white, break it up with heavy texture. A black corduroy or a white heavy knit softens the optical harshness significantly."
        }
    },
    quiet_monochrome: {
        key: "quiet_monochrome",
        name: "Quiet Monochrome",
        desc: "You look best in restrained neutrals and tonal combinations. Colour is used quietly, letting texture and value do more of the work than obvious contrast.",
        bestColours: [
            { name: "Charcoal", hex: "#4A4A4A" },
            { name: "Off-White", hex: "#F3F0EA" },
            { name: "Soft Grey", hex: "#B8B8B3" },
            { name: "Stone", hex: "#D8D2C4" },
            { name: "Black", hex: "#1E1E1E" },
        ],
        strongNeutrals: [
            { name: "Charcoal", hex: "#4A4A4A" },
            { name: "Soft Grey", hex: "#B8B8B3" },
            { name: "Off-White", hex: "#F3F0EA" },
            { name: "Stone", hex: "#D8D2C4" },
        ],
        accentColours: [
            { name: "Muted Navy", hex: "#5D718A" },
            { name: "Soft Burgundy", hex: "#6E2233" },
        ],
        contrast: "Soft to Balanced",
        contrastNote: "You suit tonal combinations best. Let value and texture create structure rather than heavy colour contrast.",
        matching: [
            "Charcoal + Off-White + Soft Grey",
            "Stone + Grey + Black",
            "Soft Grey + Off-White + Muted Navy",
        ],
        fabricFinish: {
            title: "Matte & Melange",
            desc: "You excel in melange yarns where multiple subtle shades are spun into a single thread. Look for fresco, brushed wools, and chambray. These fabrics provide a soft focus finish that mirrors your natural elegance."
        },
        contrastArchitecture: {
            title: "Subtle Gradation",
            desc: "Master the art of the gradient. Rather than pairing a stark white shirt with a black jacket, pair a soft grey shirt with a charcoal jacket. This seamless transition elevates the tailoring significantly."
        },
        hardware: {
            title: "Brushed Metals",
            desc: "Pewter, brushed steel, and smoked Mother of Pearl are flawless choices. They provide structure without breaking the quiet continuity of your monochromatic palette."
        },
        pattern: {
            title: "Micro Geometrics",
            desc: "Large prints will overwhelm your profile. Rely on tonal micro-patterns. Nailhead, bird's eye, and tight micro-houndstooth give your suiting character upon close inspection."
        },
        strategy: {
            title: "The Styling Cheat Code",
            desc: "If an occasion demands vibrant colour, execute it purely through silk accessories. A densely patterned, rich silk pocket square provides interest without compromising your calm foundation."
        }
    },
    light_warm_clarity: {
        key: "light_warm_clarity",
        name: "Light Warm Clarity",
        desc: "You are strongest in lighter, warmer colours that feel clear and fresh. These are bright enough to lift the wardrobe, but still grounded enough to feel refined.",
        bestColours: [
            { name: "Cream", hex: "#F3EBDD" },
            { name: "Stone", hex: "#D8D2C4" },
            { name: "Soft Blue", hex: "#AFC4D6" },
            { name: "Warm Taupe", hex: "#B59C84" },
            { name: "Sand", hex: "#D8C3A5" },
        ],
        strongNeutrals: [
            { name: "Cream", hex: "#F3EBDD" },
            { name: "Stone", hex: "#D8D2C4" },
            { name: "Sand", hex: "#D8C3A5" },
            { name: "Warm Taupe", hex: "#B59C84" },
        ],
        accentColours: [
            { name: "Soft Blue", hex: "#AFC4D6" },
            { name: "Olive", hex: "#7A7F47" },
            { name: "Muted Rust", hex: "#B4603D" },
        ],
        contrast: "Soft to Balanced",
        contrastNote: "Lighter combinations work well for you. They should stay warm and clear rather than icy or heavily contrasted.",
        matching: [
            "Cream + Soft Blue + Stone",
            "Sand + Warm Taupe + Olive",
            "Stone + Rust + Cream",
        ],
        fabricFinish: {
            title: "Smooth & Fluid",
            desc: "Heavy, light absorbing fabrics can dull your natural brightness. Favour tropical weight wools, fine pinpoint oxford, and silk blends. A slight surface sheen keeps your lighter palette looking intentionally crisp."
        },
        contrastArchitecture: {
            title: "Luminous Anchors",
            desc: "Most men anchor their outfits with dark colours. You should anchor yours with light. A warm sand jacket over an ivory shirt presents a vibrant, clear silhouette that honors your profile perfectly."
        },
        hardware: {
            title: "Light & Lively",
            desc: "Bright gold, clear Mother of Pearl, and light tan horn buttons complement your palette. Avoid heavy dark metals that will visually drag the garment down."
        },
        pattern: {
            title: "Crisp & Open",
            desc: "Prints should feel open and breathable. Spaced out stripes, lively but classic checks, and clear boundaries work perfectly. Avoid dense, muddy patterns."
        },
        strategy: {
            title: "The Styling Cheat Code",
            desc: "If you must incorporate dark, heavy winter colours, relegate them strictly to footwear and trousers. Ensure the garments framing your face remain light, clear, and warm."
        }
    },
    deep_controlled_colour: {
        key: "deep_controlled_colour",
        name: "Deep Controlled Colour",
        desc: "You carry richer, deeper tones well. These are especially strong when balanced by solid neutrals and used with enough restraint to feel composed rather than loud.",
        bestColours: [
            { name: "Burgundy", hex: "#6E2233" },
            { name: "Forest", hex: "#2F4A3C" },
            { name: "Navy", hex: "#243B5A" },
            { name: "Dark Chocolate", hex: "#3B2A22" },
            { name: "Charcoal", hex: "#4A4A4A" },
        ],
        strongNeutrals: [
            { name: "Navy", hex: "#243B5A" },
            { name: "Charcoal", hex: "#4A4A4A" },
            { name: "Dark Chocolate", hex: "#3B2A22" },
            { name: "Soft Stone", hex: "#D7D0C4" },
        ],
        accentColours: [
            { name: "Burgundy", hex: "#6E2233" },
            { name: "Forest", hex: "#2F4A3C" },
            { name: "Deep Blue", hex: "#223A5A" },
        ],
        contrast: "Balanced to Strong",
        contrastNote: "Deeper colour works well for you when it is anchored by neutrals and kept disciplined in combination.",
        matching: [
            "Navy + Burgundy + Soft Stone",
            "Forest + Charcoal + Off-White",
            "Dark Chocolate + Deep Blue + Stone",
        ],
        fabricFinish: {
            title: "Dense & Saturated",
            desc: "To achieve the deep colours you require, the cloth must take dye beautifully. Heavy cavalry twills, pure worsteds, and premium cottons hold dye saturation without fading, keeping your look authoritative."
        },
        contrastArchitecture: {
            title: "Anchored Accents",
            desc: "Use a dark, solid canvas to frame one deep accent. A charcoal suit with a crisp shirt creates the perfect stage for a rich forest green or burgundy tie to stand out without looking theatrical."
        },
        hardware: {
            title: "Substantial Weight",
            desc: "Dark gunmetal, deep brown horn, and rich antique brass anchor your garments. Flimsy or overly bright buttons will look entirely out of place against your saturated fabrics."
        },
        pattern: {
            title: "Grounded Prints",
            desc: "You have the visual gravity to handle bold, authoritative patterns. Wide chalk stripes and rich, dark-grounded checks look completely natural on you."
        },
        strategy: {
            title: "The Styling Cheat Code",
            desc: "If an event calls for pastel or light summer colours, ensure you frame them with a heavy, dark canvas. Wearing a soft pink shirt is perfectly fine provided it is worn beneath a structured navy or charcoal jacket."
        }
    },
    muted_olive_balance: {
        key: "muted_olive_balance",
        name: "Muted Olive Balance",
        desc: "You are strongest in more muted, grounded colour. These are tones that feel softened, olive leaning, and naturally balanced rather than bright, icy, or highly saturated.",
        bestColours: [
            { name: "Olive", hex: "#7A7F47" },
            { name: "Mushroom", hex: "#A89C8C" },
            { name: "Stone", hex: "#D8D2C4" },
            { name: "Soft Brown", hex: "#8A5A3B" },
            { name: "Muted Grey", hex: "#B7B7B2" },
        ],
        strongNeutrals: [
            { name: "Olive", hex: "#7A7F47" },
            { name: "Mushroom", hex: "#A89C8C" },
            { name: "Stone", hex: "#D8D2C4" },
            { name: "Soft Brown", hex: "#8A5A3B" },
        ],
        accentColours: [
            { name: "Muted Rust", hex: "#B4603D" },
            { name: "Soft Blue", hex: "#AFC4D6" },
            { name: "Deep Moss", hex: "#4E5A43" },
        ],
        contrast: "Soft to Balanced",
        contrastNote: "You work best with softened contrast and slightly muted colour relationships. Avoid very bright or stark combinations.",
        matching: [
            "Olive + Stone + Mushroom",
            "Soft Brown + Muted Grey + Cream",
            "Olive + Rust + Soft Blue",
        ],
        fabricFinish: {
            title: "Complex & Woven",
            desc: "Flat solids can feel uninspired on you. You shine in complex weaves like end-on-end or mock leno. By weaving two slightly different threads together, the fabric creates a natural muted harmony that perfectly matches your undertone."
        },
        contrastArchitecture: {
            title: "Harmonious Blending",
            desc: "Avoid visually cutting your body in half with contrasting colours. Let the shirt and jacket blend naturally. A mushroom jacket over a stone shirt provides sophisticated structure through a subtle shift, not shock."
        },
        hardware: {
            title: "Muted Finishes",
            desc: "Antiqued metals, grey horn, and matte finishes perform beautifully. Ensure the hardware blends into the garment rather than jumping out as a bright focal point."
        },
        pattern: {
            title: "Soft Plaid & Check",
            desc: "Favour blended plaids and softly woven checks where the boundaries between colours mix slightly. Sharp, geometric blocks of colour will clash with your softened profile."
        },
        strategy: {
            title: "The Styling Cheat Code",
            desc: "Never wear pure optic white near the face. It will cast harsh shadows on an olive undertone. Always substitute pure white with soft ecru, oyster, or stone to maintain facial harmony."
        }
    },
    refined_neutral_contrast: {
        key: "refined_neutral_contrast",
        name: "Refined Neutral Contrast",
        desc: "You suit a wardrobe built on strong neutrals and deliberate contrast. Cleaner combinations and sharper separation allow colour to feel polished rather than busy.",
        bestColours: [
            { name: "Navy", hex: "#243B5A" },
            { name: "Off-White", hex: "#F3F0EA" },
            { name: "Charcoal", hex: "#4A4A4A" },
            { name: "Soft Grey", hex: "#B8B8B3" },
            { name: "Stone", hex: "#D8D2C4" },
        ],
        strongNeutrals: [
            { name: "Navy", hex: "#243B5A" },
            { name: "Charcoal", hex: "#4A4A4A" },
            { name: "Off-White", hex: "#F3F0EA" },
            { name: "Soft Grey", hex: "#B8B8B3" },
        ],
        accentColours: [
            { name: "Burgundy", hex: "#6E2233" },
            { name: "Forest", hex: "#2F4A3C" },
            { name: "Airforce Blue", hex: "#5D718A" },
        ],
        contrast: "Balanced",
        contrastNote: "You look strongest when neutrals are clearly separated. This ensures the wardrobe feels clean, structured, and intentional.",
        matching: [
            "Navy + Off-White + Soft Grey",
            "Charcoal + Stone + Burgundy",
            "Soft Grey + Navy + Forest",
        ],
        fabricFinish: {
            title: "Balanced Worsted",
            desc: "You have the luxury of carrying classic tailoring fabrics beautifully. Classic serge twill and pinpoint oxford give you just enough light reflection to maintain a clean edge, without tipping into high shine or overly rustic territory."
        },
        contrastArchitecture: {
            title: "Structured Framing",
            desc: "Your styling should rely on classic architectural framing. A deep navy jacket paired with an ice blue or off-white shirt creates the timeless base of contrast that immediately conveys professionalism and intent."
        },
        hardware: {
            title: "Classic & Structured",
            desc: "Polished silver, classic navy horn, and structured metals fit your profile. Your hardware should look traditional, intent-driven, and perfectly matched to your suiting."
        },
        pattern: {
            title: "Traditional Tailoring",
            desc: "Lean entirely into the classics. Prince of Wales check, sharp pinstripes, and traditional houndstooth will always look bespoke and highly appropriate on you."
        },
        strategy: {
            title: "The Styling Cheat Code",
            desc: "If you wish to introduce a loud or highly unorthodox colour, execute it strictly through micro-accessories. A vivid pocket square or a patterned sock allows expression without destroying your clean silhouette."
        }
    }
};



function getSkinDepthSwatches() {
    return {
        Light: ["#F3D7C6"],
        "Light-Medium": ["#E4BC9D"],
        Medium: ["#C98E68"],
        Tan: ["#A96B49"],
        Deep: ["#6A3F2C"],
        Unsure: ["#D9C8BB"],
    };
}
function getUndertoneSwatches() {
    return {
        Warm: ["#D8A46A", "#C98A52"],
        Cool: ["#D7A7A0", "#C58F96"],
        Neutral: ["#D5B59C", "#C8A78C"],
        Olive: ["#B5A06F", "#9B8A5A"],
        Unsure: ["#D9C8BB"],
    };
}
function getColourDirectionProfileKey(scores) {
    if (scores.olive >= 3 && scores.softContrast >= 3) {
        return "muted_olive_balance";
    }

    if (
        scores.deep >= 3 &&
        scores.strongContrast >= 3 &&
        scores.colourOpen >= 1
    ) {
        return "deep_controlled_colour";
    }

    if (scores.cool >= 3 && scores.strongContrast >= 2) {
        return "clean_cool_contrast";
    }

    if (
        scores.neutralLean >= 3 &&
        scores.softContrast >= 3 &&
        scores.colourOpen === 0
    ) {
        return "quiet_monochrome";
    }

    if (scores.warm >= 3 && scores.light >= 2 && scores.softContrast >= 2) {
        return "light_warm_clarity";
    }

    if (scores.warm >= 2 && scores.softContrast >= 3 && scores.neutralLean >= 1) {
        return "soft_tonal_warmth";
    }

    if (scores.warm >= 2 && scores.colourOpen >= 1 && scores.neutralLean >= 1) {
        return "earth_led_balance";
    }

    return "refined_neutral_contrast";
}
function scoreColourDirectionAnswers(answersById) {
    var sc = {
        light: 0,
        medium: 0,
        deep: 0,
        warm: 0,
        cool: 0,
        neutral: 0,
        olive: 0,
        softContrast: 0,
        strongContrast: 0,
        colourOpen: 0,
        neutralLean: 0,
    };

    var questionMap = {};
    for (var i = 0; i < colourDirectionQuestions.length; i++) {
        questionMap[colourDirectionQuestions[i].id] = colourDirectionQuestions[i];
    }

    for (var questionId in answersById) {
        var answerIndex = answersById[questionId];
        var question = questionMap[questionId];

        if (
            question &&
            question.opts &&
            question.opts[answerIndex] &&
            question.opts[answerIndex].s
        ) {
            var answerScores = question.opts[answerIndex].s;
            for (var key in answerScores) {
                if (sc[key] !== undefined) {
                    sc[key] += answerScores[key];
                }
            }
        }
    }

    return sc;
}
function getColourDirectionProfileData(profileKey) {
    return (
        colourDirectionProfiles[profileKey] ||
        colourDirectionProfiles.refined_neutral_contrast
    );
}
function getColourDirectionQuestionMap() {
    var questionMap = {};
    for (var i = 0; i < colourDirectionQuestions.length; i++) {
        questionMap[colourDirectionQuestions[i].id] = colourDirectionQuestions[i];
    }
    return questionMap;
}
// ============================================
// COLOUR DIRECTION TO GUIDE MAPPING
// ============================================

function getColourExploreLinks(profileKey) {
    var links = [];
    var guidePaths = [];

    // Map profiles to specific guide topics based on textile physics
    switch (profileKey) {
        case "soft_tonal_warmth":
            guidePaths = [
                ["colour_wardrobe", "texture_vs_colour"],
                ["fabrics", "suiting", "hopsack"],
                ["colour_wardrobe", "layering_in_warm_climates"]
            ];
            break;
        case "clean_cool_contrast":
            guidePaths = [
                ["colour_wardrobe", "core_colours", "navy"],
                ["fabrics", "suiting", "high_twist_wool"],
                ["colour_wardrobe", "core_wardrobe_anchors"]
            ];
            break;
        case "earth_led_balance":
            guidePaths = [
                ["fabrics", "suiting", "summer_tweed"],
                ["colour_wardrobe", "texture_vs_colour"],
                ["colour_wardrobe", "core_colours", "stone_beige"]
            ];
            break;
        case "quiet_monochrome":
            guidePaths = [
                ["colour_wardrobe", "texture_vs_colour"],
                ["tailoring", "shirts", "use_case", "smart_casual"],
                ["colour_wardrobe", "core_wardrobe_anchors"]
            ];
            break;
        case "light_warm_clarity":
            guidePaths = [
                ["colour_wardrobe", "warm_weather_palette"],
                ["fabrics", "suiting", "linen_suiting"],
                ["colour_wardrobe", "core_colours", "stone_beige"]
            ];
            break;
        case "deep_controlled_colour":
            guidePaths = [
                ["colour_wardrobe", "core_colours", "navy"],
                ["fabrics", "suiting", "worsted_wool"],
                ["tailoring", "suits", "styles", "double_breasted"]
            ];
            break;
        case "muted_olive_balance":
            guidePaths = [
                ["colour_wardrobe", "texture_vs_colour"],
                ["colour_wardrobe", "layering_in_warm_climates"],
                ["fabrics", "suiting", "fresco"]
            ];
            break;
        case "refined_neutral_contrast":
            guidePaths = [
                ["colour_wardrobe", "core_wardrobe_anchors"],
                ["colour_wardrobe", "core_colours", "navy"],
                ["fabrics", "suiting", "worsted_wool"]
            ];
            break;
        default:
            guidePaths = [
                ["colour_wardrobe", "core_wardrobe_anchors"],
                ["colour_wardrobe", "texture_vs_colour"]
            ];
    }

    // Convert paths to actual guide nodes
    if (typeof getGuideNode === "function") {
        for (var i = 0; i < guidePaths.length; i++) {
            var node = getGuideNode(guidePaths[i]);
            if (node) {
                links.push({
                    title: node.title,
                    path: guidePaths[i],
                    intro: node.intro,
                    topic_kind: node.topic_kind || "guide"
                });
            }
        }
    }

    return links;
}
