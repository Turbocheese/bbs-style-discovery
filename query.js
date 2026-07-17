function findAllTopics(node, path, results) {
    path = path || [];
    results = results || [];

    if (!node) return results;

    if (node.type === "topic") {
        results.push({
            path: path,
            pathString: path.join(" > "),
            key: node.key,
            title: node.title,
            intro: node.intro,
            tags: node.tags || [],
            metadata: node.metadata || {},
            topic_kind: node.topic_kind || inferTopicKind(node, path),
        });
    }

    if (node.children) {
        for (var childKey in node.children) {
            findAllTopics(node.children[childKey], path.concat(childKey), results);
        }
    }

    return results;
}

function inferTopicKind(node, path) {
    path = path || [];

    if (!path.length) return "guide";

    var topLevel = path;
    var secondLevel = path || "";
    var lastSegment = path[path.length - 1];

    if (topLevel === "about") return "brand_philosophy";
    if (topLevel === "colour_wardrobe") return "wardrobe_strategy";
    if (topLevel === "cloth_origins") return "fabric_reference";

    if (topLevel === "accessories") {
        if (secondLevel === "shoes") {
            return "wardrobe_strategy";
        }
        return "wardrobe_strategy";
    }

    if (topLevel === "fabrics") return "fabric";

    if (
        secondLevel === "fabrics" ||
        secondLevel === "shirtings" ||
        secondLevel === "suiting"
    ) {
        return "fabric";
    }

    if (
        lastSegment === "work" ||
        lastSegment === "travel" ||
        lastSegment === "wedding" ||
        lastSegment === "evening" ||
        lastSegment === "resort" ||
        lastSegment === "smart_casual"
    ) {
        return "wardrobe_strategy";
    }

    if (path.indexOf("details") !== -1 || path.indexOf("configuration") !== -1) {
        return "garment_detail";
    }

    if (path.length > 2) return "garment_detail";

    return "garment";
}

function queryByMetadata(filters) {
    var allTopics = findAllTopics(guideTree);

    var filtered = allTopics.filter(function (topic) {
        var metadata = topic.metadata || {};

        if (filters.climate) {
            if (
                !metadata.climate ||
                metadata.climate.indexOf(filters.climate) === -1
            ) {
                return false;
            }
        }

        if (filters.formality) {
            if (
                !metadata.formality ||
                metadata.formality.indexOf(filters.formality) === -1
            ) {
                return false;
            }
        }

        if (filters.use_case) {
            if (
                !metadata.use_cases ||
                metadata.use_cases.indexOf(filters.use_case) === -1
            ) {
                return false;
            }
        }

        if (filters.bbs_signature === true) {
            if (!metadata.bbs_signature) {
                return false;
            }
        }

        if (filters.min_versatility) {
            if (
                !metadata.versatility ||
                metadata.versatility < filters.min_versatility
            ) {
                return false;
            }
        }

        return true;
    });

    var ranked = rankResults(filtered, filters);
    return diversifyResults(ranked);
}

// NEW: Ranking function
function rankResults(results, filters) {
    results.sort(function (a, b) {
        var scoreA = calculateResultScore(a, filters);
        var scoreB = calculateResultScore(b, filters);
        return scoreB - scoreA; // Higher score first
    });

    return results;
}

function calculateResultScore(topic, filters) {
    var score = 0;
    var metadata = topic.metadata || {};
    var kind = topic.topic_kind || "topic";

    // Core metadata signals
    if (metadata.bbs_signature) {
        score += 60;
    }

    if (metadata.versatility && metadata.versatility >= 5) {
        score += 30;
    } else if (metadata.versatility && metadata.versatility >= 4) {
        score += 18;
    } else if (metadata.versatility && metadata.versatility >= 3) {
        score += 8;
    }

    if (
        filters.use_case &&
        metadata.use_cases &&
        metadata.use_cases.indexOf(filters.use_case) !== -1
    ) {
        score += 35;
    }

    if (
        filters.climate &&
        metadata.climate &&
        metadata.climate.indexOf(filters.climate) !== -1
    ) {
        score += 25;
    }

    if (
        filters.formality &&
        metadata.formality &&
        metadata.formality.indexOf(filters.formality) !== -1
    ) {
        score += 20;
    }

    // Discovery-first topic kind weighting
    if (kind === "wardrobe_strategy") {
        score += 28;
    } else if (kind === "garment") {
        score += 24;
    } else if (kind === "fabric") {
        score += 20;
    } else if (kind === "fabric_reference") {
        score += 10;
    } else if (kind === "brand_philosophy") {
        score += 6;
    } else if (kind === "garment_detail") {
        score -= 8;
    }

    return score;
}

function getMatchReason(topic, filters) {
    var reasons = [];
    var metadata = topic.metadata || {};
    filters = filters || {};

    if (metadata.bbs_signature) {
        reasons.push("BBS signature piece");
    }

    if (
        filters.use_case &&
        metadata.use_cases &&
        metadata.use_cases.indexOf(filters.use_case) !== -1
    ) {
        reasons.push("Matches " + filters.use_case);
    }

    if (
        filters.climate &&
        metadata.climate &&
        metadata.climate.indexOf(filters.climate) !== -1
    ) {
        reasons.push("Suited to " + filters.climate);
    }

    if (
        filters.formality &&
        metadata.formality &&
        metadata.formality.indexOf(filters.formality) !== -1
    ) {
        reasons.push("Matches " + filters.formality);
    }

    if (filters.keyword) {
        var keyword = filters.keyword.toLowerCase();
        var title = (topic.title || "").toLowerCase();
        var intro = (topic.intro || "").toLowerCase();
        var tags = topic.tags || [];

        // Check sections for the match reason
        var sectionMatch = false;
        if (topic.sections) {
            for (var s = 0; s < topic.sections.length; s++) {
                var secH = (topic.sections[s].heading || "").toLowerCase();
                var secB = (topic.sections[s].body || "").toLowerCase();
                if (secH.indexOf(keyword) !== -1 || secB.indexOf(keyword) !== -1) {
                    sectionMatch = true;
                    break;
                }
            }
        }

        if (title.indexOf(keyword) !== -1) {
            reasons.push("Matches keyword in title");
        } else if (tags.join(" ").toLowerCase().indexOf(keyword) !== -1) {
            reasons.push("Matches keyword in tags");
        } else if (intro.indexOf(keyword) !== -1) {
            reasons.push("Matches keyword in intro");
        } else if (sectionMatch) {
            reasons.push("Matches keyword in body text"); // NEW!
        }
    }

    if (metadata.versatility && metadata.versatility >= 5) {
        reasons.push("High versatility");
    }

    if (reasons.length === 0) {
        reasons.push("Relevant to your search");
    }

    return reasons.slice(0, 2).join(" • ");
}

function showResults(results) {
    if (results.length === 0) {
        console.log("No results found.");
        return;
    }

    console.log("\n========================================");
    console.log("QUERY RESULTS (" + results.length + " found)");
    console.log("========================================\n");

    results.forEach(function (topic, index) {
        console.log(index + 1 + ". " + topic.title);
        console.log(" Path: " + topic.pathString);
        console.log(" Type: " + topic.topic_kind);
        console.log(" Intro: " + topic.intro);
        if (topic.metadata.versatility) {
            console.log(" Versatility: " + topic.metadata.versatility + "/5");
        }
        if (topic.metadata.bbs_signature) {
            console.log(" ⭐ BBS Signature");
        }
        console.log("");
    });

    console.log("========================================\n");
}

function queryTropicalWork() {
    var results = queryByMetadata({
        climate: "tropical",
        use_case: "work",
    });
    showResults(results);
    return results;
}

function queryBBSCore() {
    var results = queryByMetadata({
        bbs_signature: true,
    });
    showResults(results);
    return results;
}

function queryVersatile() {
    var results = queryByMetadata({
        min_versatility: 5,
    });
    showResults(results);
    return results;
}

function buildFirstSuit() {
    var results = queryByMetadata({
        bbs_signature: true,
        min_versatility: 5,
    });

    console.log("\n========================================");
    console.log("🎯 BUILDING YOUR FIRST SUIT");
    console.log("========================================");
    console.log("BBS essentials with maximum versatility:\n");

    showResults(results);
    return results;
}

function getTopicByPath(path) {
    var node = guideTree;
    for (var i = 0; i < path.length; i++) {
        var key = path[i];
        if (!node.children || !node.children[key]) return null;
        node = node.children[key];
    }
    return node;
}

function scoreTopicSimilarity(a, b) {
    var score = 0;

    var aTags = a.tags || [];
    var bTags = b.tags || [];

    for (var i = 0; i < aTags.length; i++) {
        if (bTags.indexOf(aTags[i]) !== -1) {
            score += 2;
        }
    }

    var aMeta = a.metadata || {};
    var bMeta = b.metadata || {};

    if (aMeta.climate && bMeta.climate) {
        for (var j = 0; j < aMeta.climate.length; j++) {
            if (bMeta.climate.indexOf(aMeta.climate[j]) !== -1) {
                score += 3;
            }
        }
    }

    if (aMeta.formality && bMeta.formality) {
        for (var k = 0; k < aMeta.formality.length; k++) {
            if (bMeta.formality.indexOf(aMeta.formality[k]) !== -1) {
                score += 3;
            }
        }
    }

    if (aMeta.use_cases && bMeta.use_cases) {
        for (var m = 0; m < aMeta.use_cases.length; m++) {
            if (bMeta.use_cases.indexOf(aMeta.use_cases[m]) !== -1) {
                score += 4;
            }
        }
    }

    if (aMeta.bbs_signature && bMeta.bbs_signature) {
        score += 2;
    }

    return score;
}

function getRelatedTopics(currentPath, limit) {
    limit = limit || 3;

    var allTopics = findAllTopics(guideTree);
    var currentPathString = currentPath.join(" > ");
    var currentTopic = null;
    var related = [];

    for (var i = 0; i < allTopics.length; i++) {
        if (allTopics[i].pathString === currentPathString) {
            currentTopic = allTopics[i];
            break;
        }
    }

    if (!currentTopic) return [];

    for (var j = 0; j < allTopics.length; j++) {
        var topic = allTopics[j];

        if (topic.pathString === currentPathString) continue;

        var score = 0;

        // Same parent path = strongest signal
        if (
            topic.path.length === currentPath.length &&
            topic.path.slice(0, -1).join(" > ") ===
            currentPath.slice(0, -1).join(" > ")
        ) {
            score += 16;
        }

        // Same top-level section
        if (
            topic.path.length > 0 &&
            currentPath.length > 0 &&
            topic.path === currentPath
        ) {
            score += 5;
        }

        // Same topic kind
        if (topic.topic_kind && topic.topic_kind === currentTopic.topic_kind) {
            score += 4;
        }

        // Shared tags / metadata similarity
        score += scoreTopicSimilarity(currentTopic, topic);

        // Small boost for strong editorial topics
        if (topic.metadata && topic.metadata.bbs_signature) {
            score += 2;
        }

        // Slight penalty for fabric references unless current topic is also a fabric reference
        if (
            topic.topic_kind === "fabric_reference" &&
            currentTopic.topic_kind !== "fabric_reference"
        ) {
            score -= 2;
        }

        // Slight penalty for very generic wardrobe topics unless they genuinely match
        if (topic.topic_kind === "wardrobe_strategy" && score < 8) {
            score -= 2;
        }

        if (score > 0) {
            related.push({
                title: topic.title,
                path: topic.path,
                intro: topic.intro,
                topic_kind: topic.topic_kind,
                score: score,
            });
        }
    }

    related.sort(function (a, b) {
        return b.score - a.score;
    });

    return related.slice(0, limit);
}

function diversifyResults(results) {
    var diversified = [];
    var deferred = [];
    var seenTitles = {};
    var seenPaths = {};
    var kindCounts = {};

    for (var i = 0; i < results.length; i++) {
        var topic = results[i];
        var titleKey = (topic.title || "").toLowerCase();
        var topLevel = topic.path && topic.path.length ? topic.path : "";
        var kind = topic.topic_kind || "topic";
        var clusterKey = topLevel + "::" + kind;

        if (seenPaths[topic.pathString]) {
            continue;
        }

        var titleCount = seenTitles[titleKey] || 0;
        var clusterCount = kindCounts[clusterKey] || 0;

        // Push repeated titles and over-clustered result types slightly later
        if (titleCount >= 1 || clusterCount >= 4) {
            deferred.push(topic);
            continue;
        }

        diversified.push(topic);
        seenPaths[topic.pathString] = true;
        seenTitles[titleKey] = titleCount + 1;
        kindCounts[clusterKey] = clusterCount + 1;
    }

    for (var j = 0; j < deferred.length; j++) {
        var deferredTopic = deferred[j];
        if (!seenPaths[deferredTopic.pathString]) {
            diversified.push(deferredTopic);
            seenPaths[deferredTopic.pathString] = true;
        }
    }

    return diversified;
}
// In-store vocabulary -> guide vocabulary. A search for any key also
// searches its mapped terms, so "blazer" finds the jacket topics even
// though the guide never uses the word. Keep entries verifiable: every
// mapped term should actually hit topics (see verify/smoke checks).
var KEYWORD_SYNONYMS = {
    blazer: ["jacket", "odd jacket"],
    sportcoat: ["odd jacket", "jacket"],
    "sport coat": ["odd jacket", "jacket"],
    tux: ["dinner jacket", "black tie"],
    tuxedo: ["dinner jacket", "black tie"],
    chinos: ["trousers"],
    slacks: ["trousers"],
    pants: ["trousers"],
    waistcoat: ["vest"],
    trainers: ["sneaker"],
    handkerchief: ["pocket square"],
    necktie: ["tie"],
    "smoking jacket": ["dinner jacket"],
    "lounge suit": ["suit"],
};

function expandSearchTerms(term) {
    var terms = [term];
    for (var key in KEYWORD_SYNONYMS) {
        if (term.indexOf(key) !== -1) {
            terms = terms.concat(KEYWORD_SYNONYMS[key]);
        }
    }
    return terms;
}

function queryByKeyword(keyword, filters) {
    var allTopics = findAllTopics(guideTree);
    var term = (keyword || "").trim().toLowerCase();
    filters = filters || {};

    if (!term) return [];

    var terms = expandSearchTerms(term);

    var results = allTopics.filter(function (topic) {
        var title = (topic.title || "").toLowerCase();
        var intro = (topic.intro || "").toLowerCase();
        var tags = (topic.tags || []).join(" ").toLowerCase();
        var metadata = topic.metadata || {};

        var keywordMatch = false;
        for (var ti = 0; ti < terms.length && !keywordMatch; ti++) {
            var t = terms[ti];
            if (title.indexOf(t) !== -1 || intro.indexOf(t) !== -1 || tags.indexOf(t) !== -1) {
                keywordMatch = true;
                break;
            }
            // Search through the actual body paragraphs and headings
            if (topic.sections && Array.isArray(topic.sections)) {
                for (var s = 0; s < topic.sections.length; s++) {
                    var secHeading = (topic.sections[s].heading || "").toLowerCase();
                    var secBody = (topic.sections[s].body || "").toLowerCase();
                    if (secHeading.indexOf(t) !== -1 || secBody.indexOf(t) !== -1) {
                        keywordMatch = true;
                        break;
                    }
                }
            }
        }

        if (!keywordMatch) return false;

        if (filters.climate) {
            if (
                !metadata.climate ||
                metadata.climate.indexOf(filters.climate) === -1
            ) {
                return false;
            }
        }
        if (filters.formality) {
            if (
                !metadata.formality ||
                metadata.formality.indexOf(filters.formality) === -1
            ) {
                return false;
            }
        }
        if (filters.use_case) {
            if (
                !metadata.use_cases ||
                metadata.use_cases.indexOf(filters.use_case) === -1
            ) {
                return false;
            }
        }

        return true;
    });

    return rankResults(results, filters);
}

console.log("🔍 Query Engine Loaded with Ranking!");
