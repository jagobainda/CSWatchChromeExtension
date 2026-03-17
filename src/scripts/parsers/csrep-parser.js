const createColorScheme = (baseColor) => ({
    color: `text-${baseColor}-500`,
    bgColor: `bg-${baseColor}-500/20`,
    borderColor: `border-${baseColor}-500`
});

const getV11RiskLevel = (score, applyFaceit, faceitAdjustmentValue) => {
    score = Math.min(score, 100);
    if (applyFaceit) score += faceitAdjustmentValue;
    if (score >= 98) return { text: "Extremely High Risk", ...createColorScheme("red") };
    if (score >= 90) return { text: "Very High Risk", ...createColorScheme("red") };
    if (score >= 75) return { text: "High Risk", ...createColorScheme("orange") };
    if (score >= 50) return { text: "Medium Risk", ...createColorScheme("orange") };
    if (score >= 25) return { text: "Low Risk", ...createColorScheme("yellow") };
    return { text: "Very Low Risk", ...createColorScheme("green") };
};

const getV11MetricMessage = (score, applyFaceit, faceitAdjustmentValue) => {
    score = Math.min(score, 100);
    if (applyFaceit) score += faceitAdjustmentValue;
    if (score >= 100) return { text: "Extremely Suspicious", color: "text-red-500" };
    if (score >= 80) return { text: "Highly Suspicious", color: "text-red-500" };
    if (score >= 60) return { text: "Suspicious", color: "text-orange-500" };
    if (score >= 50) return { text: "Little Suspicious", color: "text-yellow-500" };
    return { text: "Normal", color: "text-green-500" };
};