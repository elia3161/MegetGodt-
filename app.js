const defaults = { initial: 10000, monthly: 1500, years: 20, returnRate: 7, inflation: 2, tax: 0 };
const form = document.querySelector('#calculatorForm');
const $ = (selector) => document.querySelector(selector);
const money = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 });
const compactMoney = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', notation: 'compact', maximumFractionDigits: 1 });
let currentData = null;
let deferredInstallPrompt = null;

function readInputs() {
  const value = (id, fallback) => {
    const parsed = Number($(id).value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  return { initial: Math.max(0, value('#initial', defaults.initial)), monthly: Math.max(0, value('#monthly', defaults.monthly)), years: Math.max(1, value('#years', defaults.years)), returnRate: Math.max(0, value('#return', defaults.returnRate)), inflation: Math.max(0, value('#inflation', defaults.inflation)), tax: Math.min(100, Math.max(0, value('#tax', defaults.tax))) };
}

function formatMoney(value) { return money.format(Math.round(value)).replace(/\u00a0/g, ' '); }
function formatCompact(value) { return compactMoney.format(Math.round(value)).replace(/\u00a0/g, ' '); }
function formatPercent(value) { return `${value.toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`; }

function project({ initial, monthly, years, returnRate, tax }) {
  const months = Math.round(years * 12);
  const annualNet = returnRate / 100 * (1 - tax / 100);
  const monthlyRate = Math.pow(1 + annualNet, 1 / 12) - 1;
  let balance = initial;
  const points = [{ year: 0, value: balance, contributed: initial }];
  for (let month = 1; month <= months; month++) {
    balance *= 1 + monthlyRate;
    balance += monthly;
    if (month % 12 === 0 || month === months) points.push({ year: month / 12, value: balance, contributed: initial + monthly * month });
  }
  return { value: balance, contributed: initial + monthly * months, points, annualNet };
}

function updateLabels(data) {
  $('#yearsOutput').textContent = `${data.years} år`;
  $('#returnOutput').textContent = formatPercent(data.returnRate);
  $('#inflationOutput').textContent = formatPercent(data.inflation);
  $('#heroYears').textContent = `${data.years} år`;
  $('#chartMidpoint').textContent = `${Math.round(data.years / 2)} år`;
  $('#chartEnd').textContent = `${data.years} år`;
}

function calculateRealValue(value, inflation, years) { return value / Math.pow(1 + inflation / 100, years); }

function drawChart(data) {
  const canvas = $('#growthChart');
  const box = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(300, box.width); const height = Math.max(180, box.height);
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext('2d'); ctx.scale(ratio, ratio); ctx.clearRect(0, 0, width, height);
  const pad = { top: 17, right: 4, bottom: 10, left: 42 }; const plotW = width - pad.left - pad.right; const plotH = height - pad.top - pad.bottom;
  const max = Math.max(data.projected.value, data.projected.contributed, 1);
  const yMax = max * 1.08;
  const x = (year) => pad.left + (year / data.years) * plotW;
  const y = (value) => pad.top + plotH - (value / yMax) * plotH;
  ctx.font = '10px DM Sans, sans-serif'; ctx.fillStyle = '#9ca9a1'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) { const value = yMax * i / 4; const yy = y(value); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.strokeStyle = '#e8eee8'; ctx.lineWidth = 1; ctx.stroke(); if (i < 4) ctx.fillText(formatCompact(value), pad.left - 8, yy); }
  const points = data.projected.points;
  ctx.beginPath(); points.forEach((point, index) => index ? ctx.lineTo(x(point.year), y(point.value)) : ctx.moveTo(x(point.year), y(point.value))); ctx.lineTo(x(data.years), y(0)); ctx.lineTo(x(0), y(0)); ctx.closePath(); ctx.fillStyle = 'rgba(132, 202, 153, .14)'; ctx.fill();
  ctx.beginPath(); points.forEach((point, index) => index ? ctx.lineTo(x(point.year), y(point.value)) : ctx.moveTo(x(point.year), y(point.value))); ctx.strokeStyle = '#4b9b6d'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
  const last = points[points.length - 1]; ctx.beginPath(); ctx.arc(x(last.year), y(last.value), 4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#4b9b6d'; ctx.lineWidth = 2; ctx.stroke();
  canvas._chart = { points, x, y, width, height };
}

function renderScenarios(data) {
  const scenarios = [{ key: 'down', name: 'Forsigtigt', rate: Math.max(0, data.returnRate - 2) }, { key: 'base', name: 'Dit valg', rate: data.returnRate }, { key: 'up', name: 'Optimistisk', rate: data.returnRate + 2 }];
  const values = scenarios.map((scenario) => project({ ...data, returnRate: scenario.rate }).value);
  $('#scenarioGrid').innerHTML = scenarios.map((scenario, index) => `<article class="scenario ${scenario.key}"><div class="scenario-name">${scenario.name}</div><div class="scenario-rate">${formatPercent(scenario.rate)}</div><div class="scenario-value">${formatCompact(values[index])}</div><div class="scenario-bar"><span style="width:${Math.max(10, Math.min(100, values[index] / Math.max(...values) * 100))}%"></span></div></article>`).join('');
}

function render() {
  const data = readInputs();
  const projected = project(data);
  const real = calculateRealValue(projected.value, data.inflation, data.years);
  currentData = { ...data, projected, real };
  updateLabels(data);
  $('#futureValue').textContent = formatMoney(projected.value);
  $('#realValue').textContent = formatMoney(real);
  $('#contributedValue').textContent = formatMoney(projected.contributed);
  $('#growthValue').textContent = formatMoney(projected.value - projected.contributed);
  $('#growthPercent').textContent = `${Math.round((projected.value - projected.contributed) / Math.max(projected.contributed, 1) * 100).toLocaleString('da-DK')} %`;
  drawChart(currentData); renderScenarios(data);
}

function reset() { Object.entries({ '#initial': defaults.initial, '#monthly': defaults.monthly, '#years': defaults.years, '#return': defaults.returnRate, '#inflation': defaults.inflation, '#tax': defaults.tax }).forEach(([id, value]) => { $(id).value = value; }); render(); showToast('Beregningen er nulstillet'); }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600); }

form.addEventListener('input', render);
$('#resetButton').addEventListener('click', reset);
$('#saveButton').addEventListener('click', () => { localStorage.setItem('formue-calculation', JSON.stringify(readInputs())); showToast('Beregningen er gemt på denne enhed'); });

const saved = localStorage.getItem('formue-calculation');
if (saved) { try { const data = JSON.parse(saved); Object.entries({ '#initial': data.initial, '#monthly': data.monthly, '#years': data.years, '#return': data.returnRate, '#inflation': data.inflation, '#tax': data.tax }).forEach(([id, value]) => { if (value !== undefined) $(id).value = value; }); } catch { localStorage.removeItem('formue-calculation'); } }

window.addEventListener('resize', () => { if (currentData) drawChart(currentData); });
$('#growthChart').addEventListener('pointermove', (event) => { const chart = event.currentTarget._chart; if (!chart) return; const rect = event.currentTarget.getBoundingClientRect(); const pointerX = event.clientX - rect.left; let closest = chart.points[0]; chart.points.forEach((point) => { if (Math.abs(chart.x(point.year) - pointerX) < Math.abs(chart.x(closest.year) - pointerX)) closest = point; }); const tooltip = $('#chartTooltip'); tooltip.hidden = false; tooltip.style.left = `${chart.x(closest.year)}px`; tooltip.style.top = `${chart.y(closest.value) - 8}px`; tooltip.textContent = `${closest.year} år · ${formatMoney(closest.value)}`; });
$('#growthChart').addEventListener('pointerleave', () => { $('#chartTooltip').hidden = true; });

window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstallPrompt = event; $('#installButton').hidden = false; });
$('#installButton').addEventListener('click', async () => { if (!deferredInstallPrompt) return; deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; $('#installButton').hidden = true; });
window.addEventListener('appinstalled', () => { $('#installButton').hidden = true; showToast('Formue er installeret'); });
window.addEventListener('online', () => { $('#connectionLabel').textContent = 'Klar til offline'; });
window.addEventListener('offline', () => { $('#connectionLabel').textContent = 'Offline-tilstand'; });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
render();
