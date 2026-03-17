const displayCSRepStats = (responseObject, faceitAdjustment) => {
    if (!responseObject) {
        showErrorCSRep('Failed to fetch player data');
        return;
    }

    const { breakdown: data, totalScore, unadjustedScore, version, faceitAdjustment: faceitAdjustmentValue, message } = responseObject.data.csRepAnalysis;

    if (data.length < 1) {
        showErrorCSRep(message);
        return;
    }

    const elementIds = ['kd-ratio', 'time-to-damage', 'preaim-degree', 'aim-rating', 'win-rate', 'risk-rate', 'analysis-version'];
    const elements = Object.fromEntries(
        elementIds.map(id => [id, document.getElementById(`cs-rep-stats-${id}`) || document.getElementById(id.replace('-', ''))])
    );

    elements['analysis-version'] = document.getElementById('analysis-version');

    if (Object.values(elements).some(el => !el)) {
        showErrorCSRep('Failed to fetch player data');
        return;
    }

    const metricTypes = ['kd', 'reaction', 'preaim', 'aim', 'winrate'];
    const metricKeys = ['kd-ratio', 'time-to-damage', 'preaim-degree', 'aim-rating', 'win-rate'];
    const suffixes = ['', ' ms', 'º', ' %', ' %'];

    const metricsData = Object.fromEntries(
        metricTypes.map((type, i) => [metricKeys[i], data.find(item => item.type === type)])
    );

    metricKeys.forEach((key, i) => {
        elements[key].innerText = metricsData[key].value + suffixes[i];
    });

    const score = faceitAdjustment ? totalScore : unadjustedScore;
    elements['risk-rate'].innerText = `${score} %`;
    elements['analysis-version'].innerText = `v${version}`;

    const colorClasses = ["text-red-500", "text-orange-500", "text-yellow-500", "text-green-500"];

    metricKeys.forEach(key => {
        const el = elements[key];
        el.classList.remove(...colorClasses);
        const { color, text } = getV11MetricMessage(metricsData[key].score, faceitAdjustment, faceitAdjustmentValue);
        el.classList.add(color);
        el.title = text;
    });

    const riskLevel = getV11RiskLevel(score);
    elements['risk-rate'].classList.add(riskLevel.color);
    elements['risk-rate'].title = riskLevel.text;
};