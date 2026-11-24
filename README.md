# flyho77.github.io

장현진(flyho77)의 연구·개발 포트폴리오입니다. → https://flyho77.github.io/

차량 네트워크 침입 탐지와 AI 에이전트 보안 연구, 프로젝트, 연구실적, 경력을 한 페이지에 담았습니다.

## 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 포트폴리오 본문 (소개, 대표 프로젝트, 다른 프로젝트, 연구실적, 경력·수상) |
| `can-results.html` | 대표 프로젝트 The Shift Ladder의 결과 데모 페이지 |
| `demo.js` | 결과 데모. 평가 단계를 고르면 공개 결과표의 평균값을 막대로 보여 줍니다 |
| `site.js` | 밝은/어두운 테마 전환, 메뉴의 현재 구역 표시 |
| `style.css` | 전체 스타일 |
| `resume.html` | 이력서 원본. 브라우저에서 A4로 인쇄해 `resume.pdf`를 만듭니다 |
| `resume.pdf` | 내려받을 수 있는 이력서 |

빌드 과정이 없는 정적 사이트입니다. `main` 브랜치에 올리면 GitHub Pages가 그대로 배포합니다.

## 로컬에서 보기

```sh
python -m http.server 8000
```

브라우저에서 http://localhost:8000 을 엽니다.
