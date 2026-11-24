const artifact = 'https://github.com/flyho77/shift-ladder-can-ids-artifact/blob/main/experiments/';
const matchedSource = `${artifact}02_matched_update/RESULTS_v1.md`;
const externalSource = `${artifact}01_external_ranking/RESULTS_v1.md`;
const matchedContext = '동일한 7,992회 학습 업데이트 · 시드 5개 평균';
const externalContext = '학습 환경에서 정한 판정 기준 적용 · 시드 3개 평균';
const externalNote = '오탐률을 1% 이하로 제한하면 두 설정 모두 탐지율이 0%였습니다.';

const conditions = {
  fixed: {
    title: '고정 합성 변형 · 공격 탐지율',
    context: matchedContext,
    rows: [['실측 데이터만', 49.745, '49.74'], ['실측 공격 재표집 +30%', 48.7406, '48.74'], ['Rule +30%', 99.9931, '99.99']],
    note: '합성 데이터로 보강한 모델은 실측 데이터만 쓴 모델보다 탐지율이 50.25%p 높았습니다.',
    source: matchedSource,
  },
  sensitivity: {
    title: '민감도 평가 · 공격 탐지율',
    context: matchedContext,
    rows: [['실측 데이터만', 55.1, '55.10'], ['실측 공격 재표집 +30%', 52.8178, '52.82'], ['Rule +30%', 72.0033, '72.00']],
    note: '합성 변형의 조건을 바꾼 평가에서도 탐지율 개선이 관찰됐으며, 개선 폭은 16.90%p였습니다.',
    source: matchedSource,
  },
  otids: externalResult('OTIDS', 99.8087, 99.9973),
  road: externalResult('ROAD', 99.9616, 100),
  cantt: externalResult('can-train-and-test', 99.9945, 99.9997),
};

function externalResult(dataset, realOnly, rule) {
  return {
    title: `${dataset} · 정상 구간 오탐률`,
    context: externalContext,
    rows: [['실측 데이터만', realOnly, realOnly.toFixed(4)], ['Rule +30%', rule, rule.toFixed(4)]],
    note: externalNote,
    source: externalSource,
    external: true,
  };
}

const select = document.querySelector('#condition');
const title = document.querySelector('#result-title');
const context = document.querySelector('#result-context');
const bars = document.querySelector('#bars');
const note = document.querySelector('#result-note');
const source = document.querySelector('#result-source');

function makeBar(label, value, display) {
  const row = document.createElement('li');
  const legend = document.createElement('div');
  const name = document.createElement('span');
  const amount = document.createElement('strong');
  name.textContent = label;
  amount.textContent = `${display}%`;
  legend.append(name, amount);

  const track = document.createElement('div');
  track.className = label === 'Rule +30%' ? 'bar rule' : 'bar';
  track.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('i');
  fill.style.setProperty('--value', `${value}%`);
  track.append(fill);
  row.append(legend, track);
  return row;
}

function renderResult() {
  const result = conditions[select.value];
  title.textContent = result.title;
  context.textContent = result.context;
  bars.classList.toggle('external', Boolean(result.external));
  bars.replaceChildren(...result.rows.map(([label, value, display]) => makeBar(label, value, display)));
  note.textContent = result.note;
  source.href = result.source;
}

select.addEventListener('change', renderResult);
renderResult();
