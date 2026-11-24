// The Shift Ladder 결과 데모: 평가 단계를 고르면 공개 결과표의 평균값을 막대로 보여 준다.
const artifact = 'https://github.com/flyho77/shift-ladder-can-ids-artifact/blob/main/experiments/';
const matchedSource = `${artifact}02_matched_update/RESULTS_v1.md`;
const externalSource = `${artifact}01_external_ranking/RESULTS_v1.md`;
const matchedContext = '동일한 7,992회 학습 업데이트 · 시드 5개 평균';
const externalContext = '학습 환경에서 정한 판정 기준 적용 · 시드 3개 평균';
const externalNote = '오탐률을 1% 이하로 제한하면 두 설정 모두 탐지율이 0%였습니다.';
const ruleLabel = 'Rule +30% (합성 보강)';

const conditions = {
  fixed: {
    metric: '공격 탐지율 · 높을수록 좋음',
    title: '고정 합성 변형',
    context: matchedContext,
    rows: [['실측 데이터만', 49.745, '49.74'], ['실측 공격 재표집 +30%', 48.7406, '48.74'], [ruleLabel, 99.9931, '99.99']],
    note: '합성 데이터로 보강한 모델은 실측 데이터만 쓴 모델보다 탐지율이 50.25%p 높았습니다.',
    source: matchedSource,
  },
  sensitivity: {
    metric: '공격 탐지율 · 높을수록 좋음',
    title: '민감도 평가',
    context: matchedContext,
    rows: [['실측 데이터만', 55.1, '55.10'], ['실측 공격 재표집 +30%', 52.8178, '52.82'], [ruleLabel, 72.0033, '72.00']],
    note: '합성 변형의 조건을 바꾼 평가에서도 탐지율 개선이 관찰됐으며, 개선 폭은 16.90%p였습니다.',
    source: matchedSource,
  },
  otids: externalResult('OTIDS', 99.8087, 99.9973),
  road: externalResult('ROAD', 99.9616, 100),
  cantt: externalResult('can-train-and-test', 99.9945, 99.9997),
};

function externalResult(dataset, realOnly, rule) {
  return {
    metric: '정상 구간 오탐률 · 낮을수록 좋음',
    title: dataset,
    context: externalContext,
    rows: [['실측 데이터만', realOnly, realOnly.toFixed(4)], [ruleLabel, rule, rule.toFixed(4)]],
    note: externalNote,
    source: externalSource,
    external: true,
  };
}

const choices = document.querySelectorAll('input[name="condition"]');
const panel = document.querySelector('#result');

if (choices.length && panel) {
  const metric = panel.querySelector('#result-metric');
  const title = panel.querySelector('#result-title');
  const context = panel.querySelector('#result-context');
  const bars = panel.querySelector('#bars');
  const note = panel.querySelector('#result-note');
  const source = panel.querySelector('#result-source');

  function makeBar(label, value, display) {
    const row = document.createElement('li');
    const legend = document.createElement('div');
    const name = document.createElement('span');
    const amount = document.createElement('strong');
    name.textContent = label;
    amount.textContent = `${display}%`;
    legend.append(name, amount);

    const track = document.createElement('div');
    track.className = label === ruleLabel ? 'bar rule' : 'bar';
    track.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('i');
    fill.style.setProperty('--value', '0%');
    track.append(fill);
    row.append(legend, track);
    // 한 프레임 뒤에 값을 넣어 막대가 자라는 모습을 보여 준다.
    requestAnimationFrame(() => requestAnimationFrame(() => fill.style.setProperty('--value', `${value}%`)));
    return row;
  }

  function renderResult() {
    const picked = [...choices].find((choice) => choice.checked) || choices[0];
    const result = conditions[picked.value];
    if (!result) return;
    metric.textContent = result.metric;
    title.textContent = result.title;
    context.textContent = result.context;
    panel.classList.toggle('is-external', Boolean(result.external));
    bars.replaceChildren(...result.rows.map(([label, value, display]) => makeBar(label, value, display)));
    note.textContent = result.note;
    source.href = result.source;
  }

  choices.forEach((choice) => choice.addEventListener('change', renderResult));
  // 주소 끝에 #road 처럼 단계 이름이 붙어 있으면 그 단계를 먼저 보여 준다.
  const fromHash = [...choices].find((choice) => `#${choice.value}` === location.hash);
  if (fromHash) fromHash.checked = true;
  if (!choices[0].checked || fromHash) renderResult();
}
