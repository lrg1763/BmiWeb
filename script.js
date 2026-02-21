(function () {
  'use strict';

  const form = document.getElementById('bmi-form');
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const weightError = document.getElementById('weight-error');
  const heightError = document.getElementById('height-error');
  const resultSection = document.getElementById('result');
  const resultValue = document.getElementById('result-value');
  const resultCategory = document.getElementById('result-category');
  const resultDesc = document.getElementById('result-desc');

  const categories = [
    { max: 16, key: 'severe_deficit', label: 'Выраженный дефицит массы тела', desc: 'Рекомендуется консультация врача.' },
    { max: 18.5, key: 'deficit', label: 'Недостаточная (дефицит) масса тела', desc: 'Рекомендуется консультация врача для оценки питания.' },
    { max: 25, key: 'normal', label: 'Норма', desc: 'Вес в пределах нормы для вашего роста.' },
    { max: 30, key: 'pre_obese', label: 'Избыточная масса тела (предожирение)', desc: 'Рекомендуется скорректировать питание и активность.' },
    { max: 35, key: 'obese1', label: 'Ожирение первой степени', desc: 'Рекомендуется консультация врача и план коррекции веса.' },
    { max: 40, key: 'obese2', label: 'Ожирение второй степени', desc: 'Рекомендуется консультация врача.' },
    { max: Infinity, key: 'obese3', label: 'Ожирение третьей степени (морбидное)', desc: 'Рекомендуется консультация врача.' }
  ];

  function getCategory(bmi) {
    return categories.find(function (c) { return bmi <= c.max; }) || categories[categories.length - 1];
  }

  function validateNumber(value, min, max, unit) {
    const num = parseFloat(value, 10);
    if (value.trim() === '') return 'Введите значение';
    if (isNaN(num)) return 'Должно быть число';
    if (num < min || num > max) return 'От ' + min + ' до ' + max + ' ' + unit;
    return '';
  }

  function showErrors(weightMsg, heightMsg) {
    weightError.textContent = weightMsg || '';
    heightError.textContent = heightMsg || '';
  }

  function calculateBMI(weightKg, heightCm) {
    var heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  function showResult(bmi, category) {
    resultValue.textContent = 'ИМТ: ' + bmi.toFixed(1);
    resultCategory.textContent = category.label;
    resultCategory.className = 'result-category result-category--' + category.key;
    resultDesc.textContent = category.desc;
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var weight = weightInput.value.trim();
    var height = heightInput.value.trim();

    var wErr = validateNumber(weight, 20, 300, 'кг');
    var hErr = validateNumber(height, 100, 250, 'см');
    showErrors(wErr, hErr);

    if (wErr || hErr) {
      resultSection.hidden = true;
      return;
    }

    var bmi = calculateBMI(parseFloat(weight, 10), parseFloat(height, 10));
    var category = getCategory(bmi);
    showResult(bmi, category);
  });

  weightInput.addEventListener('input', function () {
    weightError.textContent = '';
  });
  heightInput.addEventListener('input', function () {
    heightError.textContent = '';
  });

  // Запрет изменения значения колёсиком мыши — только ввод с клавиатуры
  weightInput.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
  heightInput.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
})();
