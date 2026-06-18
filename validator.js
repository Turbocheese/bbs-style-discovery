var forbiddenPaths = [["tailoring", "jackets", "construction"]];

var requiredPaths = [["tailoring", "jackets", "details", "construction"]];

function validateGuideTree(node, path, issues) {
    path = path || [];
    issues = issues || [];

    if (!node || typeof node !== "object") {
        return issues;
    }

    var pathStr = path.join(" > ") || "root";

    // Check for "tabs" typo
    if ("tabs" in node) {
        issues.push({
            severity: "error",
            path: pathStr,
            message: 'Found "tabs" instead of "tags"',
            fix: 'Rename "tabs" to "tags"',
        });
    }

    // Check for missing required fields
    if (!node.key && path.length > 0) {
        issues.push({
            severity: "error",
            path: pathStr,
            message: "Missing 'key' field",
        });
    }

    if (!node.title) {
        issues.push({
            severity: "warning",
            path: pathStr,
            message: "Missing 'title' field",
        });
    }

    if (!node.type || !["group", "topic"].includes(node.type)) {
        issues.push({
            severity: "error",
            path: pathStr,
            message: "Invalid or missing 'type' (must be 'group' or 'topic')",
        });
    }
    //test
    // Check for duplicate tags
    if (node.tags && Array.isArray(node.tags)) {
        var seen = {};
        for (var i = 0; i < node.tags.length; i++) {
            var tag = node.tags[i];
            if (seen[tag]) {
                issues.push({
                    severity: "warning",
                    path: pathStr,
                    message: 'Duplicate tag "' + tag + '"',
                    fix: "Remove duplicate",
                });
            }
            seen[tag] = true;
        }
    }

    // Check type-specific requirements
    if (node.type === "group") {
        if (!node.children || typeof node.children !== "object") {
            issues.push({
                severity: "error",
                path: pathStr,
                message: "Group missing 'children' object",
            });
        }
    }

    if (node.type === "topic") {
        if (!node.sections || !Array.isArray(node.sections)) {
            issues.push({
                severity: "error",
                path: pathStr,
                message: "Topic missing 'sections' array",
            });
        }
    }

    // Check forbidden paths
    for (var f = 0; f < forbiddenPaths.length; f++) {
        var forbiddenPath = forbiddenPaths[f];
        if (pathsMatch(path, forbiddenPath)) {
            issues.push({
                severity: "error",
                path: pathStr,
                message:
                    "This path is FORBIDDEN - construction should be under details",
            });
        }
    }

    // Recurse
    if (node.children) {
        for (var childKey in node.children) {
            validateGuideTree(node.children[childKey], path.concat(childKey), issues);
        }
    }

    return issues;
}

function pathsMatch(actualPath, targetPath) {
    if (actualPath.length !== targetPath.length) return false;
    for (var i = 0; i < actualPath.length; i++) {
        if (actualPath[i] !== targetPath[i]) return false;
    }
    return true;
}

function checkRequiredPaths(rootNode, requiredPaths) {
    var issues = [];
    for (var i = 0; i < requiredPaths.length; i++) {
        var requiredPath = requiredPaths[i];
        if (!pathExists(rootNode, requiredPath)) {
            issues.push({
                severity: "error",
                path: requiredPath.join(" > "),
                message: "REQUIRED path does not exist",
            });
        }
    }
    return issues;
}

function pathExists(node, path) {
    var current = node;
    for (var i = 0; i < path.length; i++) {
        var key = path[i];
        if (!current.children || !current.children[key]) {
            return false;
        }
        current = current.children[key];
    }
    return true;
}

function printReport(issues) {
    if (issues.length === 0) {
        console.log("\n========================================");
        console.log("✅ VALIDATION PASSED");
        console.log("========================================");
        console.log("✅ No errors found");
        console.log("✅ No warnings found");
        console.log("✅ Guide tree is healthy");
        console.log("========================================\n");
        return;
    }

    var errors = issues.filter(function (i) {
        return i.severity === "error";
    });
    var warnings = issues.filter(function (i) {
        return i.severity === "warning";
    });

    console.log("\n========================================");
    console.log("VALIDATION REPORT");
    console.log("========================================\n");

    if (errors.length > 0) {
        console.log("❌ ERRORS (" + errors.length + "):\n");
        errors.forEach(function (issue, index) {
            console.log(index + 1 + ". " + issue.path);
            console.log("   Issue: " + issue.message);
            if (issue.fix) console.log("   Fix: " + issue.fix);
            console.log("");
        });
    }

    if (warnings.length > 0) {
        console.log("⚠️  WARNINGS (" + warnings.length + "):\n");
        warnings.forEach(function (issue, index) {
            console.log(index + 1 + ". " + issue.path);
            console.log("   Issue: " + issue.message);
            if (issue.fix) console.log("   Fix: " + issue.fix);
            console.log("");
        });
    }

    console.log("========================================");
    console.log(
        "Total: " + errors.length + " errors, " + warnings.length + " warnings"
    );
    console.log("========================================\n");
}

function runValidation() {
    console.log("Running full validation...\n");

    if (typeof guideTree === "undefined") {
        console.error("❌ ERROR: guideTree not found.");
        return [];
    }

    var structureIssues = validateGuideTree(guideTree);
    var pathIssues = checkRequiredPaths(guideTree, requiredPaths);
    var allIssues = structureIssues.concat(pathIssues);

    printReport(allIssues);

    return allIssues;
}
