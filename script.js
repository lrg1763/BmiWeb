(function () {
  'use strict';

  const CONFIG = {
    weight: { min: 20, max: 300, unit: 'кг' },
    height: { min: 100, max: 250, unit: 'см' }
  };

  const CATEGORIES = [
    { max: 16, key: 'severe_deficit', label: 'Выраженный дефицит массы тела', desc: 'Рекомендуется консультация врача.' },
    { max: 18.5, key: 'deficit', label: 'Недостаточная (дефицит) масса тела', desc: 'Рекомендуется консультация врача для оценки питания.' },
    { max: 25, key: 'normal', label: 'Норма', desc: 'Вес в пределах нормы для вашего роста.' },
    { max: 30, key: 'pre_obese', label: 'Избыточная масса тела (предожирение)', desc: 'Рекомендуется скорректировать питание и активность.' },
    { max: 35, key: 'obese1', label: 'Ожирение первой степени', desc: 'Рекомендуется консультация врача и план коррекции веса.' },
    { max: 40, key: 'obese2', label: 'Ожирение второй степени', desc: 'Рекомендуется консультация врача.' },
    { max: Infinity, key: 'obese3', label: 'Ожирение третьей степени (морбидное)', desc: 'Рекомендуется консультация врача.' }
  ];

  const dom = {
    form: document.getElementById('bmi-form'),
    weight: { input: document.getElementById('weight'), error: document.getElementById('weight-error') },
    height: { input: document.getElementById('height'), error: document.getElementById('height-error') },
    result: {
      section: document.getElementById('result'),
      value: document.getElementById('result-value'),
      category: document.getElementById('result-category'),
      desc: document.getElementById('result-desc')
    }
  };

  function validateNumber(value, min, max, unit) {
    const num = parseFloat(value, 10);
    if (value.trim() === '') return 'Введите значение';
    if (isNaN(num)) return 'Должно быть число';
    if (num < min || num > max) return `От ${min} до ${max} ${unit}`;
    return '';
  }

  function setFieldError(field, message) {
    field.error.textContent = message || '';
    field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function calculateBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  function getCategory(bmi) {
    return CATEGORIES.find((c) => bmi <= c.max) || CATEGORIES[CATEGORIES.length - 1];
  }

  function showResult(bmi, category) {
    const { section, value, category: catEl, desc } = dom.result;
    value.textContent = `ИМТ: ${bmi.toFixed(1)}`;
    catEl.textContent = category.label;
    catEl.className = `result-category result-category--${category.key}`;
    desc.textContent = category.desc;
    section.hidden = false;
    dom.form.closest('.page').classList.add('has-result');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    section.focus({ preventScroll: true });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const weight = dom.weight.input.value.trim();
    const height = dom.height.input.value.trim();
    const wErr = validateNumber(weight, CONFIG.weight.min, CONFIG.weight.max, CONFIG.weight.unit);
    const hErr = validateNumber(height, CONFIG.height.min, CONFIG.height.max, CONFIG.height.unit);

    setFieldError(dom.weight, wErr);
    setFieldError(dom.height, hErr);

    if (wErr || hErr) {
      dom.result.section.hidden = true;
      dom.form.closest('.page').classList.remove('has-result');
      return;
    }

    const bmi = calculateBMI(parseFloat(weight, 10), parseFloat(height, 10));
    showResult(bmi, getCategory(bmi));
  }

  function setupInputHandlers(field) {
    field.input.addEventListener('input', () => setFieldError(field, ''));
    field.input.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
  }

  dom.form.addEventListener('submit', handleSubmit);
  setupInputHandlers(dom.weight);
  setupInputHandlers(dom.height);
})();
