# 팀 공용 하네스

팀원과 AI 에이전트(Claude Code · Codex)가 코드 · 문서 · 회의에서 지킬 규칙과, 되돌릴 수 없는 실수를 자동으로 막는 설정을 모아 둔 저장소입니다. 규칙 본문은 [`AGENTS.md`](AGENTS.md)입니다.

## 서비스 저장소에 적용하는 법

1. 아래 파일을 서비스 저장소 루트에 복사합니다
   - `AGENTS.md` · `CLAUDE.md` · `.claude/` · `.codex/`
   - `.github/workflows/harness.yml` · `.github/slop-words.txt`
   - `.pre-commit-config.yaml`
   - `.gitignore`의 줄들(서비스 저장소 `.gitignore` 맨 위에)
2. 저장소 Settings › Rules › Rulesets › Import ruleset으로 [`ruleset-main.json`](ruleset-main.json)을 가져옵니다
3. Settings › Advanced Security(Code security)에서 Secret scanning · Push protection이 켜져 있는지 확인합니다
4. PR 양식(`.github/pull_request_template.md`)은 이 저장소에 있으면 조직의 모든 저장소에 기본으로 적용됩니다

## 팀원이 한 번 할 일

- 커밋 훅: `pip install pre-commit` → 저장소 폴더에서 `pre-commit install`
- Codex: 저장소를 「신뢰한 프로젝트」로 지정해야 `.codex/config.toml`이 적용됩니다
- Claude Code: 저장소를 열면 `.claude/settings.json`과 가드 훅이 자동으로 적용됩니다(Node.js 필요)

## 규칙 바꾸기

`AGENTS.md`를 고치는 PR + 팀장 승인. 워크스페이스 › 프로젝트 › 그라운드룰 「팀 규칙」도 같은 문장으로 맞춥니다.

<!-- 하네스 동작 확인용 시험 PR. 머지하지 않고 닫습니다. -->
