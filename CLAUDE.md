# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

U'Wallet is UNIMINUTO's institutional wallet app: student/staff/graduate ID card (carnet), QR-based access control, event registration/check-in, parking (parqueadero), and bicycle parking (bicicletero). It's an Ionic 7 + Angular 16 app packaged with Capacitor 5/7 for Android and iOS.

## Commands

```bash
npm install                              # install deps
ionic serve                              # dev server (or: npm start / ng serve)
ng build --configuration=development     # test build
ng build --configuration=production      # production build (default configuration)
ng test                                  # unit tests (Karma/Jasmine)
ng lint                                  # ESLint
```

Run a single spec: `ng test --include='**/home.page.spec.ts'`

### Native builds

```bash
npx cap copy android      # sync web build (www/) into the Android project
npx cap copy ios          # sync web build (www/) into the iOS project
npx cap sync              # copy + update native dependencies
```

After `ng build`, output goes to `www/` (see `outputPath` in `angular.json`), which is `webDir` in `capacitor.config.ts`. Native projects live in `android/` (Gradle) and `ios/App` (CocoaPods/Xcode workspace) and must be built with Android Studio / Xcode respectively — there is no CLI build command for the native shells in this repo.

## Architecture

**Module structure**: Classic Angular NgModule app (not standalone components). Every page under `src/app/pages/*` is its own lazy-loaded feature module (`*.module.ts` + `*-routing.module.ts`), wired up in `src/app/app-routing.module.ts` with `loadChildren`. When adding a new page, follow the existing pattern: `page.module.ts`, `page-routing.module.ts`, `page.page.ts/.html/.scss`, then register the route in `app-routing.module.ts`.

**Entry flow**: `''` redirects to `loading` → login happens in `pages/home` (three login modes toggled via `formLogin()`: `uniminuto` staff/student email+password, `egresado` graduate by ID+birthdate, `tercero`/`proveedor` third-party) → on success, session fields (`correo`, `firstname`, `lastname`, `uid`, `cn`, `title`, etc.) are written individually via `LocalService` (wraps `@capacitor/preferences`) → navigates to `carnet`, the main ID-card page. `tabs` hosts the primary bottom-tab navigation once logged in.

**Services (`src/app/services/`)** are thin, stateless HTTP wrappers around several independent backend systems — there is no shared API client or interceptor layer, so each service builds its own headers/URLs:
- `uniminuto.service.ts` — core directory/auth APIs (`comunidad.uniminuto.edu`, `webapi.uniminuto.edu`, `registros.uniminuto.edu`), permissions, menu config
- `uwallet.service.ts` — the wallet backend (`environment.urlapiwallet`) for photos, campus/rectory lookups, events, WhatsApp notifications, Dorlet accreditation
- `softexpert.service.ts` — SoftExpert events backend (`environment.urlapieventos`), including a `handleError` pattern (timeout/retry/typed `ApiError`) other services don't use
- `digibee.service.ts` / `bytte.service.ts` — Digibee integration platform (rectories/campuses, Bytte QR) via `environment.urlDigibee` + `apiKeyDigibeeRectorias`
- `dasnet.service.ts` — Dorlet/DASNET QR token service, Basic-auth via `environment.username`/`password`
- `bicicletero.service.ts` — bike parking backend (hardcoded URL, not in `environment`)
- `parqueadero.service.ts` — parking QR generation (`environment.urlParqueadero`), returns a `Blob`
- `local.service.ts` — key/value session storage on top of Capacitor `Preferences`
- `message.service.ts` — Ionic `ToastController`/`AlertController`/`LoadingController` wrappers used across pages instead of calling those controllers directly
- `EncryptionService.ts` — AES via `crypto-js` with a hardcoded key, used for lightweight obfuscation (not real secret protection)

Domain response/request shapes live in `src/app/interfaces/` (`interfaces.ts` is the main catch-all; `digibee.ts`, `softexpert.ts`, `parqueadero.ts`, `apierror.ts` are per-integration). Spanish naming is used throughout for domain types and variables (`eventos`, `rectoria`, `sede`, `cupoUsuario`, etc.) — match this convention rather than translating to English.

**QR / access-control pages**: `qr`, `qr-perdomo`, `qr-provisional`, `scanner-qr`, `lector-qr`, `lector-evento` implement QR generation and scanning flows for different access scenarios (regular carnet, Perdomo campus, provisional/temporary passes, event check-in). `@zxing/ngx-scanner` and `@techiediaries/ngx-qrcode` are the scanning/generation libraries; `@capacitor-community/barcode-scanner` is also present for native scanning.

**Native plugins**: Custom Capacitor plugins are defined in Kotlin under `android/app/src/main/java/edu/uniminuto/uwallet/` (`SDKDMAPlugin.kt` wraps Dorlet's Mobile Access SDK for BLE/NFC door access, `StatusMonitorPlugin.kt` watches Bluetooth/location status, `EchoPlugin.kt`). Their TypeScript interfaces are declared in `src/app/interfaces/plugins.ts`. Plugin registration in `MainActivity.kt` is currently commented out — check there first if a native plugin call isn't reaching the native side.

**Environments**: `src/environments/environment.ts` (dev) and `environment.prod.ts` (prod, swapped in via `fileReplacements` in `angular.json`) hold all backend base URLs and API credentials (Digibee API key, DASNET basic-auth credentials). There is no `.env`/secrets-manager layer — treat these files as the single source of truth for which backend a build talks to, and be aware credentials are committed directly in them.

## Conventions

- Angular 16, TypeScript, module-per-page architecture — do not convert pages to standalone components unless asked.
- ESLint config: `.eslintrc.json` (Angular ESLint + `@typescript-eslint`). Directive/component selector prefix is not enforced beyond Angular defaults — check existing page code for naming before adding new selectors.
- `.editorconfig`: 2-space indent for the whole repo.
- Spanish is the working language for UI copy, variable/method names in feature code, and commit messages; keep new code consistent with this rather than switching to English mid-file.
