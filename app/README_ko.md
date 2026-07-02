<div align="center">
  <h1 align="center">
    <a href=".">
      <img src="assets/logo/logo.png" alt="Momo logo" width="42" align="center">
    </a>
    Momo
  </h1>

  <p align="center">
    <strong>macOS를 위한 로컬 우선 Markdown 지식 작업공간.</strong><br>
    일반 파일, 개인 위키, Second Brain 워크플로, AI diff, 암호화 동기화.
  </p>

  <p align="center">
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-f97316.svg" alt="License MIT"></a>&nbsp;
    <img src="https://img.shields.io/badge/platform-macOS-111827?logo=apple&logoColor=white" alt="macOS">&nbsp;
    <img src="https://img.shields.io/badge/built%20with-Tauri%20%2B%20SolidJS-24c8db" alt="Built with Tauri and SolidJS">
  </p>

  <p align="center">
    <img alt="Momo open source Markdown workspace" width="250" height="54" src="https://img.shields.io/badge/Momo-open%20source-f97316">
  </p>

  <p align="center">
    <a href="apps/web"><strong>Website</strong></a> ·
    <a href="docs/development_ko.md"><strong>개발 문서</strong></a> ·
    <a href="docs"><strong>문서</strong></a> ·
    <a href="docs/development_ko.md"><strong>개발 문서</strong></a> ·
    <a href="README.md"><strong>English</strong></a>
  </p>

  <p align="center">
    <a href=".">
      <img src="assets/readme/kuku-desktop-vault.png" alt="Momo desktop app screenshot" width="960">
    </a>
  </p>
</div>

<p align="center">
  ⭐ <em>Momo가 유용하거나 흥미롭다면 GitHub star로 프로젝트가 더 많은 사람에게 닿도록 도와주세요.</em>
</p>

## Momo란?

Momo는 노트가 이동 가능하고, 사적이고, AI에게도 유용하게 남기를 원하는 사람들을 위한 오픈소스 Markdown 앱입니다. 로컬 지식보관함의 일반 `.md` 파일을 직접 편집하고, 그 위에 검색, 그래프 탐색, AI 지원, Second Brain 워크플로, 암호화 동기화를 얹습니다.

Momo는 단순한 데스크톱 앱만이 아닙니다. 이 저장소에는 macOS 클라이언트, 웹 앱, Go 서버, protobuf 계약, Rust AI/인덱싱 크레이트, 시스템을 살펴보거나 직접 호스팅할 수 있는 Docker 인프라가 함께 들어 있습니다.

## 왜 만들었나요?

- **파일은 사용자에게 남아야 합니다**: 노트는 플랫폼 데이터가 아니라 일반 Markdown 파일입니다.
- **AI는 검토 가능해야 합니다**: AI는 읽고, 검색하고, 변경을 제안할 수 있지만 편집은 approval과 diff 흐름을 거칩니다.
- **지식은 명시적으로 개선되어야 합니다**: 결정 문서는 AI 제안을 추적 가능한 memory와 wiki 업데이트로 바꿉니다.
- **인프라는 살펴볼 수 있어야 합니다**: 서버, 동기화, 계약, 배포 코드가 공개되어 있습니다.
- **클라우드는 선택이어야 합니다**: 로컬로 쓰고, 편의를 위해 로그인하거나, 직접 스택을 호스팅할 수 있습니다.

## 주요 기능

- **로컬 Markdown 지식보관함**: 폴더를 열고 git, vim, Obsidian, 다른 Markdown 도구와 함께 쓸 수 있는 파일에 그대로 씁니다.
- **개인 위키**: `[[위키링크]]`, 백링크, 검색, 2D / 3D 그래프 탐색으로 노트를 연결합니다.
- **Second Brain 워크플로**: memory, wiki page, proposal, decision을 지식보관함 안의 Markdown으로 관리합니다.
- **자기개선 AI 맥락**: 결정 문서를 수락, 거절, 수정하면서 이후 AI 대화가 더 나은 맥락을 상속받게 합니다.
- **AI-native editing**: Agent / Ask / Inline 모드, 파일/선택 영역 첨부, 적용 전 diff 검토를 제공합니다.
- **암호화 동기화 기반**: 워크스페이스, 기기, key envelope, 서명된 commit, 암호화 object를 다루며 서버에 평문 노트를 노출하지 않도록 설계합니다.

## 설치

공식 빌드는 macOS용으로 제공됩니다.

- **권장**: 현재는 로컬 빌드를 사용하고, Momo 배포 레포가 준비되면 릴리스 링크를 연결합니다.

플랫폼 상태:

- macOS: 지원
- Windows: 준비 중
- Linux: 준비 중

## 오픈소스

Momo는 닫힌 서비스 위에 얇게 얹힌 클라이언트가 아니라 전체 스택 오픈소스 프로젝트입니다. 구조를 살펴보고 싶다면 여기서 시작하세요.

- [개발과 셀프 호스팅 문서](docs/development_ko.md)
- [기획 문서](docs)

## 기여

버그 리포트, 기능 제안, 문서 개선, PR 모두 환영합니다. 큰 변경을 시작하기 전에는 먼저 이슈를 열어 방향을 함께 맞춰 주세요.

Momo의 중요한 원칙은 단순합니다: 사용자의 파일은 사용자의 것이고, 도구는 그 통제권을 빼앗지 않아야 합니다.

## 라이선스

[MIT](LICENSE) © Momo
