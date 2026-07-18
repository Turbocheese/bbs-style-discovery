// ============================================
// BBS MILL MAP — "The Provenance Chart"
// A stylised, hand-projected chart of the cloth world: Europe and
// the Mediterranean drawn as simplified coast polygons, with a
// tappable marker for every house in the guide's Cloth Origins
// section, district charts for the two mill heartlands (West
// Yorkshire and Northern Italy), and a Singapore inset for home.
// Equirectangular-ish projection; coasts are deliberately stylised
// (a merchant's chart, not an atlas).
// ============================================

// ---- Projection ----
var MAP_LON_MIN = -11, MAP_LON_MAX = 33, MAP_LAT_MIN = 30, MAP_LAT_MAX = 60;
var MAP_W = 730, MAP_H = 700;

function mapProject(lon, lat) {
    return {
        x: (lon - MAP_LON_MIN) * (MAP_W / (MAP_LON_MAX - MAP_LON_MIN)),
        y: (MAP_LAT_MAX - lat) * (MAP_H / (MAP_LAT_MAX - MAP_LAT_MIN)),
    };
}

// ---- Coastlines (lon/lat polygons, stylised from geography) ----
var MAP_COASTS = [
    // Great Britain
    [[-5.7,50.0],[-4.5,50.4],[-3.0,50.6],[-1.0,50.7],[0.3,50.8],[1.4,51.2],[1.6,52.1],[1.7,52.9],[0.2,53.0],[0.1,53.6],[-0.5,54.5],[-1.5,55.4],[-2.2,56.0],[-2.5,57.5],[-4.0,58.6],[-5.5,58.2],[-5.2,56.6],[-5.8,55.5],[-4.8,54.8],[-3.1,54.2],[-4.6,53.4],[-5.3,51.9],[-4.0,51.4],[-3.1,51.4],[-4.3,51.0]],
    // Ireland
    [[-6.0,54.6],[-5.5,54.3],[-6.2,53.3],[-6.5,52.3],[-8.5,51.5],[-10.2,51.8],[-9.8,53.3],[-10.0,54.3],[-8.5,55.2],[-7.2,55.3]],
    // Continent: Iberia, France, Low Countries, north edge, Balkans,
    // Greece, Italy, back along the western Mediterranean
    [[-5.4,36.1],[-8.9,37.0],[-9.4,38.7],[-8.7,41.2],[-9.3,43.0],[-7.5,43.7],[-4.5,43.4],[-1.8,43.4],[-1.2,45.6],[-2.5,47.3],[-4.8,48.0],[-3.5,48.8],[-1.5,49.7],[0.1,49.4],[1.5,50.9],[3.5,51.4],[4.5,52.5],[6.5,53.5],[8.5,54.0],[8.5,56.5],[10.5,57.5],[11.5,60.0],[33.0,60.0],[33.0,46.5],[29.2,45.4],[28.0,43.5],[28.4,41.8],[26.5,40.8],[24.5,40.9],[23.5,40.0],[23.0,39.0],[24.0,37.6],[22.5,36.5],[21.3,37.2],[20.5,39.0],[19.5,41.5],[18.0,42.5],[16.2,43.7],[13.8,45.6],[12.3,45.4],[12.5,44.2],[13.5,43.6],[14.5,42.4],[15.8,41.9],[16.2,41.3],[18.4,40.3],[17.2,40.0],[16.6,38.9],[15.7,37.9],[15.9,38.6],[14.9,40.2],[13.5,41.2],[12.2,41.7],[11.1,42.4],[10.3,43.5],[9.8,44.1],[8.7,44.4],[7.5,43.7],[6.5,43.1],[5.0,43.3],[4.0,43.5],[3.0,43.2],[1.5,41.3],[0.0,39.5],[-0.6,38.0],[-2.0,36.7],[-4.4,36.7]],
    // Sicily
    [[12.4,38.0],[15.1,38.2],[15.1,36.7],[12.6,37.5]],
    // Sardinia
    [[8.2,41.2],[9.6,41.0],[9.5,39.1],[8.4,38.9]],
    // Corsica
    [[8.6,43.0],[9.5,42.9],[9.2,41.4],[8.7,41.6]],
    // Crete
    [[23.5,35.5],[26.3,35.3],[24.0,34.9]],
    // Anatolia
    [[26.2,40.0],[27.0,38.5],[27.0,37.0],[28.2,36.6],[30.5,36.2],[33.0,36.1],[33.0,42.0],[31.0,41.3],[29.2,41.2],[26.8,40.6]],
    // North Africa & the Nile Delta
    [[-11.0,35.3],[-6.0,35.0],[-2.0,35.1],[3.0,36.9],[10.0,37.2],[11.0,33.5],[15.0,32.5],[20.0,32.5],[25.0,31.8],[29.7,31.2],[31.0,31.5],[32.4,31.2],[33.0,31.1],[33.0,30.0],[-11.0,30.0]],
];

// Small-caps place labels on the Europe chart [text, lon, lat]
var MAP_PLACE_LABELS = [
    ["ENGLAND", -1.4, 52.4],
    ["SCOTLAND", -4.2, 57.0],
    ["IRELAND", -8.3, 53.2],
    ["FRANCE", 2.6, 47.0],
    ["ITALY", 13.2, 42.5],
    ["TURKEY", 30.6, 38.9],
    ["EGYPT", 27.6, 30.7],
];
var MAP_SEA_LABELS = [
    ["The Atlantic", -7.4, 46.4],
    ["The Mediterranean", 17.5, 34.6],
];

// ---- Districts (mill heartlands rendered as their own charts) ----
var MAP_DISTRICTS = {
    yorkshire: {
        name: "West Yorkshire",
        sub: "The English worsted heartland",
        lat: 53.68, lon: -1.75,
        places: [["Leeds", -1.44, 53.84], ["Huddersfield", -1.97, 53.54]],
    },
    n_italy: {
        name: "Northern Italy",
        sub: "Biella, the Valsesia, and the Lombard plain",
        lat: 45.62, lon: 9.4,
        places: [["Biella", 7.95, 45.47], ["Quarona", 8.32, 45.80], ["Busto Arsizio", 8.85, 45.53], ["Bergamo", 9.80, 45.78], ["Valdagno", 11.30, 45.56]],
    },
};

// ---- The houses ----
// region drives the filter chips; cluster (if set) parks the pin
// inside a district chart; fabricKey links to the Cloth Room;
// guidePath links into the guide tree. est is omitted where the
// founding year is not confidently known.
var MILL_MAP_PINS = [
    // Britain — West Yorkshire district
    { key: "huddersfield", short: "Huddersfield", name: "Huddersfield", place: "Huddersfield, England", region: "Britain", cluster: "yorkshire", lat: 53.65, lon: -1.78, blurb: "The town that gave fine worsted its home address. Its name on a selvedge still means something.", guidePath: ["cloth_origins", "suiting", "english", "huddersfield"], fabricKey: "fresco" },
    { key: "standeven", short: "Standeven", name: "Standeven", place: "Huddersfield, England", region: "Britain", cluster: "yorkshire", lat: 53.61, lon: -1.86, blurb: "Classic English suiting character: structure, resilience, and cloth that improves with wear.", guidePath: ["cloth_origins", "suiting", "english", "standeven"], fabricKey: "wool_linen" },
    { key: "dugdale", short: "Dugdale", name: "Dugdale Bros", place: "Huddersfield, England", region: "Britain", cluster: "yorkshire", est: 1896, lat: 53.70, lon: -1.70, blurb: "Honest, hardworking English worsteds merchanted from Huddersfield since 1896.", guidePath: ["cloth_origins", "suiting", "english", "dugdale"] },
    { key: "scabal", short: "Scabal", name: "Scabal", place: "Brussels & Huddersfield", region: "Britain", cluster: "yorkshire", est: 1938, lat: 53.57, lon: -1.68, blurb: "A Brussels merchant weaving at its own Huddersfield mill — refined worsteds and ambitious superfines.", guidePath: ["cloth_origins", "suiting", "english", "scabal"] },
    { key: "alfred_brown", short: "A. Brown", name: "Alfred Brown", place: "Leeds, England", region: "Britain", cluster: "yorkshire", lat: 53.82, lon: -1.56, blurb: "Yorkshire weaving with a working wardrobe in mind — clean, dependable business cloth.", guidePath: ["cloth_origins", "suiting", "english", "alfred_brown"], fabricKey: "worsted_wool" },
    // Britain — free-standing
    { key: "fox", short: "Fox Bros", name: "Fox Brothers", place: "Wellington, Somerset", region: "Britain", est: 1772, lat: 50.98, lon: -3.22, blurb: "The definitive flannel, milled in Somerset since 1772.", guidePath: ["cloth_origins", "suiting", "english", "fox"], fabricKey: "fox_flannel" },
    { key: "holland_sherry", short: "Holland &amp; Sherry", labelDy: -13, name: "Holland & Sherry", place: "Savile Row, London", region: "Britain", est: 1836, lat: 51.51, lon: -0.14, blurb: "The Savile Row merchant with bunch walls that map the whole cloth world.", guidePath: ["cloth_origins", "suiting", "english", "holland_sherry"], fabricKey: "hs_gabardine" },
    { key: "harrisons", short: "Harrisons", name: "Harrisons", place: "Edinburgh, Scotland", region: "Britain", lat: 55.95, lon: -3.19, blurb: "A storied merchanting name with broad influence across classic tailoring.", guidePath: ["cloth_origins", "suiting", "english", "harrisons"], fabricKey: "summer_tweed" },
    { key: "johnstons", short: "Johnstons", labelDy: -13, name: "Johnstons of Elgin", place: "Elgin, Scotland", region: "Britain", est: 1797, lat: 57.65, lon: -3.31, blurb: "Highland cashmere and estate cloth, woven beside the River Lossie since 1797.", guidePath: ["cloth_origins", "suiting", "scottish", "johnstons"] },
    // Ireland
    { key: "magee", short: "Magee", labelDy: -13, name: "Magee", place: "Donegal, Ireland", region: "Ireland", est: 1866, lat: 54.65, lon: -8.11, blurb: "The Donegal house that made flecked tweed a tailoring signature.", guidePath: ["cloth_origins", "suiting", "irish", "magee"] },
    // France
    { key: "dormeuil", short: "Dormeuil", name: "Dormeuil", place: "Paris, France", region: "France", est: 1842, lat: 48.86, lon: 2.35, blurb: "Parisian polish in cloth form — heritage merchanting with international reach.", guidePath: ["cloth_origins", "suiting", "french", "dormeuil"], fabricKey: "dormeuil_glencheck" },
    // Italy — Northern Italy district
    { key: "vbc", short: "VBC", name: "Vitale Barberis Canonico", place: "Pratrivero, Biella", region: "Italy", cluster: "n_italy", est: 1663, lat: 45.72, lon: 8.03, blurb: "Weaving in the Biellese hills since 1663 — one of the oldest mills on earth.", guidePath: ["cloth_origins", "suiting", "italian", "vbc"], fabricKey: "hopsack" },
    { key: "zegna", short: "Zegna", name: "Zegna", place: "Trivero, Biella", region: "Italy", cluster: "n_italy", est: 1910, lat: 45.70, lon: 8.22, blurb: "The vertical wool mill that helped define the soft, modern Italian suit.", guidePath: ["cloth_origins", "suiting", "italian", "zegna"] },
    { key: "reda", short: "Reda", name: "Reda", place: "Valle Mosso, Biella", region: "Italy", cluster: "n_italy", est: 1865, lat: 45.63, lon: 8.16, blurb: "Springy, resilient merino — the travel suit's best friend.", guidePath: ["cloth_origins", "suiting", "italian", "reda"], fabricKey: "high_twist_wool" },
    { key: "cerruti", short: "Cerruti", name: "Cerruti", place: "Biella", region: "Italy", cluster: "n_italy", est: 1881, lat: 45.56, lon: 8.06, blurb: "Fluid, softly tailored cloth from a house that runs through fashion history.", guidePath: ["cloth_origins", "suiting", "italian", "cerruti"] },
    { key: "piacenza", short: "Piacenza", name: "Piacenza", place: "Pollone, Biella", region: "Italy", cluster: "n_italy", est: 1733, lat: 45.60, lon: 7.92, blurb: "Biella's oldest cashmere house — jacketing with a nap like candlelight.", guidePath: ["cloth_origins", "suiting", "italian", "piacenza"], fabricKey: "piacenza_camel" },
    { key: "drago", short: "Drago", name: "Drago", place: "Biella", region: "Italy", cluster: "n_italy", lat: 45.53, lon: 8.15, blurb: "Fine merino with quiet dimension — boardroom cloth, alive up close.", guidePath: ["cloth_origins", "suiting", "italian", "drago"], fabricKey: "drago_birdseye" },
    { key: "tallia_delfino", short: "Tallia", name: "Tallia di Delfino", place: "Strona, Biella", region: "Italy", cluster: "n_italy", est: 1903, lat: 45.68, lon: 7.96, blurb: "The connoisseur's corner of Biella — refined worsteds with a luminous finish.", guidePath: ["cloth_origins", "suiting", "italian", "tallia_delfino"] },
    { key: "loro_piana", short: "Loro Piana", name: "Loro Piana", place: "Quarona, Valsesia", region: "Italy", cluster: "n_italy", est: 1924, lat: 45.76, lon: 8.27, blurb: "The luxury benchmark: softness, finish, and fibre obsession.", guidePath: ["cloth_origins", "suiting", "italian", "loro_piana"], fabricKey: "wool_silk_linen" },
    { key: "solbiati", short: "Solbiati", name: "Solbiati", place: "Busto Arsizio, Lombardy", region: "Italy", cluster: "n_italy", lat: 45.58, lon: 8.85, blurb: "Italy's great linen house — dry, honest cloth for real heat.", guidePath: ["cloth_origins", "suiting", "italian", "solbiati"], fabricKey: "linen_suiting" },
    { key: "albini", short: "Albini", name: "Albini", place: "Albino, Bergamo", region: "Italy", cluster: "n_italy", est: 1876, lat: 45.76, lon: 9.79, blurb: "The shirting specialist — five generations of fine cotton weaving.", guidePath: ["cloth_origins", "shirtings", "italian", "albini"] },
    { key: "thomas_mason", short: "T. Mason", name: "Thomas Mason", place: "Bergamo (English heritage)", region: "Italy", cluster: "n_italy", est: 1796, lat: 45.71, lon: 9.62, blurb: "An English shirting archive of 1796, kept alive on Albini's Bergamo looms.", guidePath: ["cloth_origins", "shirtings", "italian", "thomas_mason"] },
    { key: "marzotto", short: "Marzotto", name: "Marzotto", place: "Valdagno, Veneto", region: "Italy", cluster: "n_italy", est: 1836, lat: 45.65, lon: 11.30, blurb: "Italian suiting standards at scale — quality made broadly accessible.", guidePath: ["cloth_origins", "suiting", "italian", "marzotto"] },
    // Turkey
    { key: "soktas", short: "Soktas", name: "Soktas", place: "Söke, Turkey", region: "Turkey", lat: 37.75, lon: 27.40, blurb: "Fine Turkish shirting cotton, grown and woven in the Aegean valley.", guidePath: ["cloth_origins", "shirtings", "turkish", "soktas"] },
    // Egypt — a cotton origin, not a mill
    { key: "egyptian_shirting", short: "", name: "Egyptian Cotton", place: "The Nile Delta", region: "Egypt", type: "origin", lat: 30.95, lon: 31.10, blurb: "Where extra-long staple cotton begins — the delta soil behind the world's smoothest shirtings.", guidePath: ["cloth_origins", "shirtings", "egyptian", "egyptian_shirting"] },
    // Singapore — the home inset
    { key: "officine_paladino", name: "Officine Paladino", place: "Singapore", region: "Singapore", type: "inset", est: 2017, lat: 1.35, lon: 103.82, blurb: "A Singapore merchant curating European cloth for our climate — the newest voice on this chart, and the closest to home.", guidePath: ["cloth_origins", "suiting", "singaporean", "officine_paladino"] },
];

// ---- Module state (not persisted; reset on entry) ----
var _mapSelected = null;
var _mapDistrict = null;
var _mapRegion = "All";

function mapResetState() {
    _mapSelected = null;
    _mapDistrict = null;
    _mapRegion = "All";
}

function getMillPin(key) {
    for (var i = 0; i < MILL_MAP_PINS.length; i++) {
        if (MILL_MAP_PINS[i].key === key) return MILL_MAP_PINS[i];
    }
    return null;
}

function getMillPinByName(name) {
    for (var i = 0; i < MILL_MAP_PINS.length; i++) {
        if (MILL_MAP_PINS[i].name === name) return MILL_MAP_PINS[i];
    }
    return null;
}

// ---- SVG builders ----

// Midpoint-smoothed closed path: quadratic curves through segment
// midpoints with the vertices as controls — turns the coarse
// polygons into soft, hand-drawn coastlines.
function mapCoastPath(poly) {
    var pts = [];
    for (var i = 0; i < poly.length; i++) {
        pts.push(mapProject(poly[i][0], poly[i][1]));
    }
    var n = pts.length;
    function mid(a, b) {
        return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
    var m0 = mid(pts[n - 1], pts[0]);
    var d = "M" + m0.x.toFixed(1) + "," + m0.y.toFixed(1);
    for (i = 0; i < n; i++) {
        var v = pts[i];
        var m = mid(v, pts[(i + 1) % n]);
        d += "Q" + v.x.toFixed(1) + "," + v.y.toFixed(1) + " " + m.x.toFixed(1) + "," + m.y.toFixed(1);
    }
    return d + "Z";
}

// labelMode: "none" | "short" (always-on compact label). The full
// name still appears above the selected pin.
function mapPinMarkerSVG(pin, x, y, idx, labelMode) {
    var dim = _mapRegion !== "All" && pin.region !== _mapRegion;
    var cls = "map-pin" + (pin.type === "origin" ? " map-pin--origin" : "") +
        (_mapSelected === pin.key ? " sel" : "") + (dim ? " dim" : "");
    var mark;
    if (pin.type === "origin") {
        mark =
            '<circle class="map-pin-ring map-pin-ring--dash" cx="0" cy="0" r="8"/>' +
            '<rect class="map-pin-dot" x="-3" y="-3" width="6" height="6" transform="rotate(45)"/>';
    } else {
        mark =
            '<circle class="map-pin-ring" cx="0" cy="0" r="7"/>' +
            '<circle class="map-pin-dot" cx="0" cy="0" r="2.7"/>';
    }
    var label = "";
    if (_mapSelected === pin.key) {
        label = '<text class="map-pin-name" x="0" y="-14">' + pin.name + "</text>";
    } else if (labelMode === "short") {
        var tag = pin.short !== undefined ? pin.short : pin.name;
        if (tag) {
            label = '<text class="map-pin-tag" x="0" y="' + (pin.labelDy || 20) + '">' + tag + "</text>";
        }
    }
    return (
        '<g class="' + cls + '" style="animation-delay:' + (idx * 45) + 'ms" transform="translate(' + x.toFixed(1) + "," + y.toFixed(1) + ')" data-action="map-pin" data-key="' + pin.key + '">' +
        '<circle class="map-pin-hit" cx="0" cy="0" r="20"/>' +
        mark +
        label +
        "</g>"
    );
}

function getMillMapSVG() {
    var svg = '<svg class="map-chart" viewBox="0 0 ' + MAP_W + " " + MAP_H + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">';

    // Graticule every 5 degrees
    var g, p1, p2;
    for (g = MAP_LON_MIN + 1 + ((4 - ((MAP_LON_MIN + 1) % 5)) % 5); g < MAP_LON_MAX; g += 5) {
        p1 = mapProject(g, MAP_LAT_MIN); p2 = mapProject(g, MAP_LAT_MAX);
        svg += '<line class="map-grid" x1="' + p1.x.toFixed(1) + '" y1="' + p1.y.toFixed(1) + '" x2="' + p2.x.toFixed(1) + '" y2="' + p2.y.toFixed(1) + '"/>';
    }
    for (g = 30; g <= 60; g += 5) {
        p1 = mapProject(MAP_LON_MIN, g); p2 = mapProject(MAP_LON_MAX, g);
        svg += '<line class="map-grid" x1="' + p1.x.toFixed(1) + '" y1="' + p1.y.toFixed(1) + '" x2="' + p2.x.toFixed(1) + '" y2="' + p2.y.toFixed(1) + '"/>';
    }

    // Land
    for (var c = 0; c < MAP_COASTS.length; c++) {
        svg += '<path class="map-land" d="' + mapCoastPath(MAP_COASTS[c]) + '"/>';
    }

    // Labels
    var i, p;
    for (i = 0; i < MAP_PLACE_LABELS.length; i++) {
        p = mapProject(MAP_PLACE_LABELS[i][1], MAP_PLACE_LABELS[i][2]);
        svg += '<text class="map-place-label" x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '">' + MAP_PLACE_LABELS[i][0] + "</text>";
    }
    for (i = 0; i < MAP_SEA_LABELS.length; i++) {
        p = mapProject(MAP_SEA_LABELS[i][1], MAP_SEA_LABELS[i][2]);
        svg += '<text class="map-sea-label" x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '">' + MAP_SEA_LABELS[i][0] + "</text>";
    }

    // District cluster markers
    var idx = 0;
    for (var dk in MAP_DISTRICTS) {
        var d = MAP_DISTRICTS[dk];
        var count = 0;
        for (i = 0; i < MILL_MAP_PINS.length; i++) {
            if (MILL_MAP_PINS[i].cluster === dk) count++;
        }
        var dp = mapProject(d.lon, d.lat);
        var dimD = _mapRegion !== "All" && ((dk === "yorkshire" && _mapRegion !== "Britain") || (dk === "n_italy" && _mapRegion !== "Italy"));
        svg +=
            '<g class="map-cluster' + (dimD ? " dim" : "") + '" style="animation-delay:' + (idx++ * 45) + 'ms" transform="translate(' + dp.x.toFixed(1) + "," + dp.y.toFixed(1) + ')" data-action="map-cluster" data-district="' + dk + '">' +
            '<circle class="map-pin-hit" cx="0" cy="0" r="26"/>' +
            '<circle class="map-cluster-disc" cx="0" cy="0" r="13"/>' +
            '<text class="map-cluster-count" x="0" y="4">' + count + "</text>" +
            '<text class="map-cluster-name" x="0" y="27">' + d.name + "</text>" +
            "</g>";
    }

    // Free-standing pins (not clustered, not the inset)
    for (i = 0; i < MILL_MAP_PINS.length; i++) {
        var pin = MILL_MAP_PINS[i];
        if (pin.cluster || pin.type === "inset") continue;
        p = mapProject(pin.lon, pin.lat);
        svg += mapPinMarkerSVG(pin, p.x, p.y, idx++, "short");
    }

    // Singapore inset, bottom right: home is off this chart's edge
    var ins = getMillPin("officine_paladino");
    var insDim = _mapRegion !== "All" && _mapRegion !== "Singapore";
    svg +=
        '<g class="map-inset' + (insDim ? " dim" : "") + '" transform="translate(' + (MAP_W - 96) + "," + (MAP_H - 96) + ')">' +
        '<circle class="map-inset-ring" cx="0" cy="0" r="62"/>' +
        '<text class="map-inset-eyebrow" x="0" y="-30">10,000 km east</text>' +
        '<g class="map-pin' + (_mapSelected === ins.key ? " sel" : "") + '" data-action="map-pin" data-key="officine_paladino">' +
        '<circle class="map-pin-hit" cx="0" cy="0" r="26"/>' +
        '<circle class="map-pin-ring" cx="0" cy="0" r="7"/>' +
        '<circle class="map-pin-dot" cx="0" cy="0" r="2.7"/>' +
        "</g>" +
        '<text class="map-inset-name" x="0" y="24">Singapore</text>' +
        '<text class="map-inset-sub" x="0" y="40">home</text>' +
        "</g>";

    svg += "</svg>";
    return svg;
}

// District chart: the cluster's pins spread across their own frame,
// projected from the district's own bounding box.
function getDistrictSVG(districtKey) {
    var d = MAP_DISTRICTS[districtKey];
    var pins = [];
    var i;
    for (i = 0; i < MILL_MAP_PINS.length; i++) {
        if (MILL_MAP_PINS[i].cluster === districtKey) pins.push(MILL_MAP_PINS[i]);
    }
    var minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    function grow(lon, lat) {
        if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
    }
    for (i = 0; i < pins.length; i++) grow(pins[i].lon, pins[i].lat);
    for (i = 0; i < d.places.length; i++) grow(d.places[i][1], d.places[i][2]);

    var W = 730, H = 460, PAD = 72;
    var lonSpan = Math.max(maxLon - minLon, 0.001), latSpan = Math.max(maxLat - minLat, 0.001);
    function proj(lon, lat) {
        return {
            x: PAD + (lon - minLon) / lonSpan * (W - 2 * PAD),
            y: (H - PAD) - (lat - minLat) / latSpan * (H - 2 * PAD),
        };
    }

    var svg = '<svg class="map-chart map-chart--district" viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">';
    for (var gx = 1; gx < 6; gx++) {
        svg += '<line class="map-grid" x1="' + (W / 6 * gx) + '" y1="0" x2="' + (W / 6 * gx) + '" y2="' + H + '"/>';
    }
    for (var gy = 1; gy < 4; gy++) {
        svg += '<line class="map-grid" x1="0" y1="' + (H / 4 * gy) + '" x2="' + W + '" y2="' + (H / 4 * gy) + '"/>';
    }
    var p;
    for (i = 0; i < d.places.length; i++) {
        p = proj(d.places[i][1], d.places[i][2]);
        svg += '<text class="map-place-label map-place-label--town" x="' + p.x.toFixed(1) + '" y="' + (p.y + 22).toFixed(1) + '">' + d.places[i][0] + "</text>";
        svg += '<line class="map-town-tick" x1="' + p.x.toFixed(1) + '" y1="' + (p.y + 6).toFixed(1) + '" x2="' + p.x.toFixed(1) + '" y2="' + (p.y + 12).toFixed(1) + '"/>';
    }
    for (i = 0; i < pins.length; i++) {
        p = proj(pins[i].lon, pins[i].lat);
        svg += mapPinMarkerSVG(pins[i], p.x, p.y, i, "short");
    }
    svg += "</svg>";
    return svg;
}

// ---- HTML builders ----

function getMapDetailHTML(pin) {
    if (!pin) {
        return (
            '<div class="map-detail-empty">Tap a marker to meet the house behind the cloth.</div>'
        );
    }
    var meta = pin.place + (pin.est ? " &middot; Est. " + pin.est : "");
    var links =
        '<button class="vis-guide-link" data-action="result-link" data-path=\'' +
        JSON.stringify(pin.guidePath) + "'>Read the guide &rarr;</button>";
    if (pin.fabricKey) {
        links +=
            '<button class="vis-guide-link" data-action="map-see-cloth" data-fabric="' + pin.fabricKey + '">See its cloth &rarr;</button>';
    }
    return (
        '<div class="map-detail-head">' +
        '<h2 class="map-detail-name">' + pin.name + "</h2>" +
        '<div class="map-detail-meta">' + meta + "</div>" +
        "</div>" +
        '<p class="map-detail-blurb">' + pin.blurb + "</p>" +
        '<div class="map-detail-links">' + links + "</div>"
    );
}

function getMapChipsHTML() {
    var regions = ["All", "Britain", "Ireland", "France", "Italy", "Turkey", "Egypt", "Singapore"];
    var html = "";
    for (var i = 0; i < regions.length; i++) {
        html +=
            '<button class="map-chip' + (_mapRegion === regions[i] ? " sel" : "") + '" data-action="map-region" data-region="' + regions[i] + '">' + regions[i] + "</button>";
    }
    return html;
}

function getMapIndexHTML() {
    var order = ["Britain", "Ireland", "France", "Italy", "Turkey", "Egypt", "Singapore"];
    var html = "";
    for (var r = 0; r < order.length; r++) {
        var entries = "";
        for (var i = 0; i < MILL_MAP_PINS.length; i++) {
            var pin = MILL_MAP_PINS[i];
            if (pin.region !== order[r]) continue;
            entries +=
                '<button class="map-index-entry' + (_mapSelected === pin.key ? " sel" : "") + '" data-action="map-pin" data-key="' + pin.key + '">' +
                '<span class="map-index-name">' + pin.name + "</span>" +
                '<span class="map-index-place">' + pin.place + "</span>" +
                "</button>";
        }
        html +=
            '<div class="map-index-group">' +
            '<div class="map-index-region">' + order[r] + "</div>" +
            entries +
            "</div>";
    }
    return html;
}

function getMapStageHTML() {
    if (_mapDistrict) {
        var d = MAP_DISTRICTS[_mapDistrict];
        return (
            '<div class="map-district-bar">' +
            '<button class="map-zoom-out" data-action="map-zoom-out">&larr; The full chart</button>' +
            '<div class="map-district-title">' + d.name + '<span class="map-district-sub">' + d.sub + "</span></div>" +
            "</div>" +
            getDistrictSVG(_mapDistrict)
        );
    }
    return getMillMapSVG();
}

function renderMillMap() {
    var houses = 0, origins = 0;
    for (var i = 0; i < MILL_MAP_PINS.length; i++) {
        if (MILL_MAP_PINS[i].type === "origin") origins++;
        else houses++;
    }
    return (
        '<div class="vis-shell map-shell">' +
        '<div class="vis-eyebrow">The Provenance Chart</div>' +
        "<h1 class=\"vis-title\">Where the Cloth Comes From</h1>" +
        '<p class="vis-lead">' + houses + " houses and " + (origins === 1 ? "one cotton origin" : origins + " cotton origins") + ", charted. Tap a marker to meet the house behind the cloth &mdash; the numbered discs open the two great mill districts.</p>" +
        '<div class="map-chips">' + getMapChipsHTML() + "</div>" +
        '<div class="map-stage" id="map-stage">' + getMapStageHTML() + "</div>" +
        '<div class="vis-info map-detail" id="map-detail">' + getMapDetailHTML(getMillPin(_mapSelected)) + "</div>" +
        '<div class="map-index">' + getMapIndexHTML() + "</div>" +
        '<div class="vis-footnote">A stylised merchant’s chart &mdash; drawn for the story, not for navigation.</div>' +
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

// ---- Partial updates ----

function mapRefreshStage() {
    var stage = document.getElementById("map-stage");
    if (stage) stage.innerHTML = getMapStageHTML();
}

function mapRefreshDetail() {
    var detail = document.getElementById("map-detail");
    if (detail) detail.innerHTML = getMapDetailHTML(getMillPin(_mapSelected));
}

function mapRefreshIndex() {
    var entries = document.querySelectorAll(".map-index-entry");
    for (var i = 0; i < entries.length; i++) {
        var isSel = entries[i].getAttribute("data-key") === _mapSelected;
        entries[i].className = "map-index-entry" + (isSel ? " sel" : "");
    }
}

function mapSelectPin(key) {
    var pin = getMillPin(key);
    if (!pin) return;
    _mapSelected = key;
    // A clustered pin picked from the index opens its district first.
    if (pin.cluster && _mapDistrict !== pin.cluster) _mapDistrict = pin.cluster;
    else if (!pin.cluster && _mapDistrict) _mapDistrict = null;
    mapRefreshStage();
    mapRefreshDetail();
    mapRefreshIndex();
}

function mapOpenDistrict(key) {
    if (!MAP_DISTRICTS[key]) return;
    _mapDistrict = key;
    mapRefreshStage();
}

function mapCloseDistrict() {
    _mapDistrict = null;
    mapRefreshStage();
}

function mapSetRegion(region) {
    _mapRegion = region;
    var chips = document.querySelectorAll(".map-chip");
    for (var i = 0; i < chips.length; i++) {
        var isSel = chips[i].getAttribute("data-region") === region;
        chips[i].className = "map-chip" + (isSel ? " sel" : "");
    }
    mapRefreshStage();
}

window.renderMillMap = renderMillMap;
