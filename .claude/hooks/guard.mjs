// 팀 하네스 가드 (Claude Code PreToolUse 훅). settings.json의 금지와 같은 것을 한 번 더 막는다.
// 막으면 종료 코드 2 + 이유(stderr) → Claude Code가 그 도구 호출을 멈추고 이유를 에이전트에게 돌려준다.
// 막는 것: .env 계열(.env.example 제외) · 키 파일 · secrets/ 접근, force push · main 직접 push · --no-verify.
import { readFileSync } from "node:fs";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { process.exit(0); }
const tool = input.tool_name ?? "";
const args = input.tool_input ?? {};

const SECRET_PATH = /(^|[\\/])\.env(?!\.example$)(\.[\w.-]+)?$|\.(pem|key|p12|pfx)$|(^|[\\/])secrets([\\/]|$)|(^|[\\/])id_(rsa|ed25519)$/i;
const SECRET_IN_CMD = /(^|[\s"'=/\\])\.env(?!\.example)(\.[\w.-]+)?(?=$|[\s"';|&)])|\.(pem|key)\b|(^|[\s/\\])secrets[/\\]|id_(rsa|ed25519)\b/i;
const PUSH_FORCE = /\bgit\s+push\b[^\n]*\s(--force(-with-lease)?|-f)\b/;
const PUSH_MAIN = /\bgit\s+push\b[^\n]*\s(origin\s+)?(HEAD:)?(main|master)\b/;
const NO_VERIFY = /\s--no-verify\b/;

const block = (why) => { process.stderr.write(`팀 하네스가 막았습니다: ${why}. AGENTS.md 1절 · 5절을 보세요.\n`); process.exit(2); };

const paths = [args.file_path, args.path, args.notebook_path].filter((p) => typeof p === "string");
if (paths.some((p) => SECRET_PATH.test(p))) block("비밀값 파일(.env · 키 · secrets/)은 읽거나 쓰지 않습니다");
if (tool === "Grep" && typeof args.glob === "string" && SECRET_PATH.test(args.glob)) block("비밀값 파일을 검색하지 않습니다");

if (tool === "Bash" && typeof args.command === "string") {
  const c = args.command;
  if (SECRET_IN_CMD.test(c)) block("명령에 비밀값 파일이 들어 있습니다");
  if (PUSH_FORCE.test(c)) block("force push는 금지입니다");
  if (PUSH_MAIN.test(c)) block("main에 직접 push하지 않습니다. 브랜치를 만들어 PR을 올리세요");
  if (NO_VERIFY.test(c)) block("커밋 훅을 건너뛰지 않습니다(--no-verify)");
}
process.exit(0);
