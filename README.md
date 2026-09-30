# NEXUS — MLBB Intelligence Hub

**Bu Netlify + Firebase uchun manba-kod paketi.** Jonli yangilanish faqat ushbu versiya GitHub orqali Netlify production deployga chiqqach boshlanadi.

Foydalanuvchi bergan `nexus-mlbb` Firebase Web config ulangan. Maxfiy server credentiali yoki AI kaliti paketga kiritilmagan.

## Eng qisqa ishga tushirish

1. ZIPni oching. `nexus` papkasini GitHub repoga yuklang (maxfiy kalitlar qo‘shmang).
2. Netlify → Add new project → Import an existing project → GitHub repongiz.
3. Build command: `npm run build`; Publish directory: `public`. Functions directory: `netlify/functions`. `netlify.toml` bularni avtomatik belgilaydi.
4. Firebase Console → Authentication → Sign-in method → **Email/Password**ni yoqing. Authentication → Settings → Authorized domains ichiga Netlify domenini qo‘shing.
5. Firebase’da Firestore va rasm yuklash uchun Storage’ni ishga tushiring. `firestore.rules` va `storage.rules` fayllarini tegishli Rules oynalarida publish qiling. Bu ilovada barcha ma’lumot operatsiyalari server orqali bajariladi, shu sababli brauzerdan to‘g‘ridan-to‘g‘ri yozish yopiq.
6. Firebase Project settings → Service accounts orqali server service-account JSON yarating. Uni **faqat Netlify Environment variables** ichidagi `FIREBASE_SERVICE_ACCOUNT`ga JSON matni sifatida joylang (Functions scope). Chatga, GitHub’ga yoki `public/`ga yubormang.
7. NEXUS AI uchun Netlify Environment variables (Functions) bo‘limiga `GEMINI_API_KEY`ni kiriting va qayta deploy qiling. Odatiy model `gemini-2.5-flash`; xohlasangiz `GEMINI_MODEL` bilan almashtiring. Oldingi `OPENAI_API_KEY` + `OPENAI_MODEL` varianti ham ishlaydi. Ikkalasi bo‘lsa Gemini tanlanadi. Kalitni GitHub yoki `public` ichiga joylamang.
8. Muhit qiymatlari kiritilgach Netlify’da qayta deploy qiling.
9. Saytda hisob oching. Firebase Authentication’dagi o‘z UID’ingizni oling. Ishonchli lokal terminalda server credentialini muhitga o‘rnatib `npm run owner -- YOUR_UID`ni bajaring. Qayta kirganda Admin ko‘rinadi. Sayt emailga qarab o‘z-o‘zidan admin bermaydi.
10. Xuddi shu ishonchli terminaldan `npm run seed`ni bajaring: hero, quiz, manba va challenge boshlang‘ich yozuvlari Firestore’ga qo‘shiladi. Mavjud yozuvlar almashtirilmaydi. Crew a’zolarini Admin → Crew’dan o‘zingizning haqiqiy ma’lumotingiz bilan kiriting.

**Faqat papkani Netlify Drop’ga tashlash yetmaydi:** bu frontendni ko‘rsatishi mumkin, lekin bu paketdagi server funksiyalari uchun Git import/build yoki Netlify CLI bilan deploy kerak.

Git ishlatmasangiz, lokal terminalda `npm install`, `npx netlify login`, `npx netlify deploy --build --prod` yo‘lidan foydalaning. Netlify login faqat o‘zingizning brauzeringizda bajariladi.

Firebase Storage yoki tashqi AI xizmatidan foydalanish hisob rejangizga bog‘liq; konsoldagi haqiqiy holatni tekshiring.

## Paketda nimalar bor

- Dark/light, responsive o‘zbekcha interfeys; sidebar, global qidiruv, foydali xato/bo‘sh holatlar.
- 132 yozuvli editorial hero katalogi; rol/lane/difficulty filtrlari, tafsilotlar, 2–3 hero comparison uchun boshlang‘ich uchlik.
- Hero pool, counter tavsiyalari, 5v5 draft, 6 ban, duplicate nazorati va rolga asoslangan tahlil.
- 6 itemli build maker, emblem/talent/spell, situational item, edit/delete/share, like va comments.
- Random hero wheel, role/skill/random team maker, xususiy xona kodi.
- Qo‘lda match tarixi, hisoblangan win rate/KDA, profil, XP, achievement, favorite va bookmarks.
- Quiz: 1000 yozuv, 400 easy / 400 medium / 200 hard, 10/20/50/100/Endless/Daily, filtrlar, izohlar, xatolarni takrorlash; hisob bilan oddiy quiz natijasi serverda tekshiriladi.
- News, meta, patches, manba/sana/patch ko‘rsatish. Ma’lumot yo‘q bo‘lsa raqamlar to‘qilmaydi.
- NEXUS AI: 6 rejim, draft/pool konteksti, chat tarixi, qayta nomlash va o‘chirish.
- Crew, profiles/player search, friend requests, community, gallery, notifications, reports.
- Turnir ro‘yxati, jamoa ro‘yxatdan o‘tishi, single-elimination bracket va admin natijalari.
- Admin bo‘limlari, custom-claim huquqlari, source manager, updater run loglari, quiz import/export va duplicate tekshirish.
- Har 6 soatlik Netlify scheduled updater, server-only AI credentiallari, UID ownership va rate limits.
- Basic service worker/offline frontend va web manifest. Yangilanish, kirish va saqlash offline ishlamaydi.

## Hali tekshirilishi yoki kengaytirilishi kerak bo‘lgan qismlar

Bu bo‘lim foydalanuvchi talabidagi “hammasi production’da ishlaydi” bilan kod paketi holatini adashtirmaslik uchun yozilgan.

- **Jonli integratsiya sinovi bajarilmagan.** Netlify hisobiga kirish, Firebase server credentiali, AI kaliti va model berilmagan. Auth, Firestore, Storage, haqiqiy email, AI va cron ishlab turgan deb da’vo qilinmaydi.
- **Katalog to‘liq current database emas.** 132 editorial hero yozuvi bor. Barcha joriy herolar, yangi hero/revamp ma’lumotlari, passivlar, chuqur combo/counterlar va item qiymatlari to‘liq manba bilan audit qilinmagan. Hero qo‘llanmalarida bu cheklov ko‘rsatilgan.
- **Quiz texnik tekshirilgan, lekin 1000 savolning ekspert kontent auditi tugallanmagan.** Exact duplicate yo‘q; semantik yaqinlik, qiyinlik darajasi, variantlarning sifati va patch bo‘yicha to‘g‘rilikni Quiz Manager ko‘rib chiqishi kerak. Savollar orasida takrorlanuvchi shakldagi alohida hero-faktlar bor. Bu 1000 savolni “to‘liq ekspert tekshiruvidan o‘tgan” deb atamang.
- **Avtomatik news va patch:** MLBBDex RSS manbasi 6 soatda tekshiriladi; sana, qisqa parcha va original havola saqlanadi. Bu mustaqil fan manbasi, Moontonning rasmiy tasdig‘i emas. RSS’da kelmagan rasmiy patch yoki tadbir avtomatik topilmaydi. Eski `Official Mobile Legends` dinamik HTML manbasi avtomatik ishga tushirilmaydi.
- **Meta:** MLBBDex public rankings API tekshiriladi; faqat yaqin 21 kunlik o‘lchangan foizlar e’lon qilinadi. Manba patch versiyasini bermasa sayt “Patch ko‘rsatilmagan” deydi. API’ning data.heroes va data.measuredAt shakli haqiqiy javob bilan tekshirildi. Production Firestore sinovi deploydan keyin bajariladi. AI statistikani o‘zi yaratmaydi.
- **Build:** tasdiqlangan 6 item/emblem/spell feed ulanmadi. Buildlar avtomatik chiqmaydi; admin yoki community yozuvlari qoladi.
- **Auto-build AI generator yo‘q.** Bu paketdagi build updater tekshirilgan structured feedni yangilaydi; AI esa chatda tavsiya beradi. AI patchdan o‘z-o‘zidan yangi 6-item buildlar yaratib publish qilmaydi.
- **Hero comparison ballari rolga asoslangan taxminiy ko‘rsatkich**, o‘lchangan match statistikasi emas. Counter tizimi ham kichik editorial qoida bazasiga tayanadi.
- **Daily Quiz mehmon mashqi sifatida ishlaydi**, hisobdagi leaderboard/XPga yozilmaydi. Oddiy hisob bilan boshlangan quizlar saqlanadi.
- **XP/achievement to‘liq o‘yin telemetriyasi emas.** Build yaratish, quiz va qayd etilgan challenge orqali ishlaydi. Daily login, barcha community/turnir harakatlari uchun alohida mukofot sxemasi hali kiritilmagan.
- Community uchun haqiqiy realtime listeners o‘rniga so‘rov asosidagi yangilash ishlatilgan. Global qidiruv va ayrim admin ekranlari dastlabki 100–200 yozuv bilan cheklangan; katta hajm uchun cursor/search indeksini kengaytirish kerak.
- Public hero sahifalari SPA hash-route, alohida server-rendered SEO sahifalari emas. Dynamic social image generation yo‘q.
- Native brauzerda vizual, mobil va WebMCP QA bu muhitda mavjud bo‘lmagan; DOM-simulyatsiya va kod tekshiruvi o‘tkazilgan.
- To‘liq hisob o‘chirish, eski yuklangan rasm fayllarini avtomatik tozalash, mukammal anti-cheat va katta hajmli moderatsiya navbati alohida production kengaytirish ishlaridir.

## Ma’lumot bazasi

`profiles`, `matches`, `heroes`, `meta`, `builds`, `matchups`, `challenges`, `userChallenges`, `quizQuestions`, `quizSessions`, `quizResults`, `news`, `patches`, `sources`, `gallery`, `community`, `comments`, `tournaments`, `rooms`, `crew`, `friends`, `notifications`, `favorites`, `aiChats`, `runs`, `reports`, `rateLimits`, `accountStatus`, `audit`.

Shaxsiy collection yozuvlari `ownerId` bilan bog‘langan. Ommaviy profile javoblari email, MLBB ID, hero pool yoki chatni chiqarmaydi. Role faqat Firebase custom claims’dan olinadi. Admin SDK credentiali brauzerga berilmaydi.

`rateLimits.expiresAt` uchun Firestore TTL policy qo‘yish tavsiya etiladi; aks holda ishlatilgan bucket yozuvlari yig‘ilib boradi. So‘rovlar kerak qilsa, Firebase bergan indeks havolasi bilan kerakli compound indeksni yarating.

## Auto-updater va tekshirish

Ushbu kodni GitHub repoga qo‘yib Netlify production deploy qilgandan so‘ng Admin → AI Data → Run Now bilan bir marta sinang. `sourcesChecked`, `added`, `errors` va News/Patches/Meta sahifasini tekshiring. Netlify Functions sahifasida `refresh` Scheduled sifatida ko‘rinishi kerak. Jadval UTC bo‘yicha `0 */6 * * *`; Netlify scheduled function limiti 30 soniya. `Official Mobile Legends` eski source yozuvini Admin → Sources’dan o‘chirishingiz yoki o‘chirib qo‘yishingiz mumkin. RSS yoki API ishlamay qolsa, run log sababni ko‘rsatadi.

## Auto-updater schema

News uchun RSS/Atom yoki official maqola havolalari/sanasi bor HTML. XML entity ishlovi o‘chirilgan. Redirectlar ham domen allowlist bilan tekshiriladi.

Meta JSON:

```json
{"heroes":[{"heroId":"aamon","winRate":51.2,"pickRate":2.1,"banRate":0.4,"rank":"Mythic","patch":"EXACT_PATCH","updatedAt":"2026-09-29T10:00:00Z","sourceUrl":"https://www.mobilelegends.com/ACTUAL_SOURCE"}]}
```

**Yuqoridagi raqamlar faqat schema misoli, haqiqiy statistika emas; seedga kiritilmaydi.**

Build JSON: `hero`, `name`, 6 elementli `items`, `emblem`, `spell`, `description`, `patch`, `updatedAt`, `sourceUrl` kerak. Manba domenlari serverdagi `lib/updater.mjs` va `api.mjs` allowlistida tekshiriladi. Yangi domenni faqat ishonchli manba ekanini tekshirib qo‘shing.

## Tekshiruv

```bash
npm ci
npm run check
npm run build
```

Tekshirilgan: JavaScript sintaksisi va module exportlari; asset yo‘llari; 1000 quiz schema, exact duplicate, javob indekslari va 400/400/200 taqsimoti; autentifikatsiyasiz write’ning 401 qaytarishi. Qo‘shimcha DOM QA: 39 route, 14 admin tab, hero qidiruv, duplicate draft prevention, team maker va quiz javob/izohi. Bu Firebase bilan end-to-end sinov o‘rnini bosmaydi.

## Arxitektura va fayllar

```text
public/
  index.html, style.css, sw.js, manifest.webmanifest
  js/app.js       routing, qidiruv, WebMCP
  js/core.js      API, UI helpers, app state
  js/auth.js      Firebase Authentication
  js/views.js    hero/build/draft/profile/news/tools
  js/social.js   AI/community/crew/admin/tournament
  js/quiz.js     quiz engine
  js/data.js     local tactical helpers
  js/config.js   public Firebase web config
  data/          heroes, items, quiz JSON
netlify/functions/
  api.mjs        authenticated application API
  refresh.mjs    scheduled update
  lib/db.mjs     Firebase Admin, auth, rate limit
  lib/updater.mjs trusted source fetch, normalization, AI
scripts/
  build.mjs, check.mjs, check-imports.mjs
  set-owner.mjs, seed.mjs
  make-data.py, make-quiz.py, skill-facts.txt
```

Frontend framework talab qilmaydi. Node 22+ server/build uchun, Python faqat editorial data’ni qayta yaratish uchun kerak; oddiy deploy Python ishlatmaydi.

## Dizayn

Deep navy `#0b0e17`, panel `#121724`, violet `#a596ff`, royal blue `#6085f4`, gold `#e4be73`. System typography, 16px body, past kontrastli ortiqcha neon yo‘q, reduced-motion qo‘llanadi. Asosiy breakpointlar 1200/900/600px.

## Manbalar va artwork

- Firebase custom claims: https://firebase.google.com/docs/auth/admin/custom-claims
- Firebase email/password: https://firebase.google.com/docs/auth/web/password-auth
- Netlify Functions: https://docs.netlify.com/build/functions/overview/
- Netlify schedules: https://docs.netlify.com/build/functions/scheduled-functions/
- Netlify environment variables: https://docs.netlify.com/build/functions/environment-variables/
- MLBB: https://www.mobilelegends.com/

Aamon/Fredrinn ikonlari publisher CDN’dan olingan; character artwork © MOONTON. NEXUS rasmiy loyiha emas. Alohida artwork litsenziyasi aniqlanmagan; commercial foydalanishda ruxsatni tekshiring yoki initials placeholder’larini ishlating. Qolgan hero tasvirlari taxminan yaratilmagan.

Asset URLlari `ASSETS.md`da.


## September 2026 update
132 local hero portraits. Uzbek news titles and short summaries from MLBBDex, Esports.gg, and official MPL Malaysia news; previous automatic English news is migrated. AI builds are validated against the local item catalogue and cached for 7 days; eight heroes are prepared by the updater, and any catalogue hero can be generated from Builds. These are AI recommendations, not verified current competitive builds.

Rasmiy o‘yinlar displays the rolling past 15 days and next 15 days for MPL Philippines, Malaysia, and Indonesia, from their official schedules, refreshed every six hours. Liga buttons filter results inside NEXUS. Match times use Asia/Tashkent. AI forecasts use up to five recent completed official matches per team and up to three head-to-head matches from the preceding 90 days. They contain no invented probabilities and return insufficient-data when either team has fewer than three results. Forecasts are cached for six hours or until their source context changes. This is not a live score feed or worldwide tournament coverage.

Refresh uses a signed background function, an overlap lease, and run history. AI translation/build generation requires the existing server AI key. Failed translations remain queued for a later run. No secrets are included in the update archive.


## Functional fixes
Public News reads ordered records and filters unpublished rows on the server, avoiding a published/date composite-index dependency. Snapshot cursors preserve ordered pagination. Empty collections run their render callbacks so filters and actions bind. Authentication clears account state and ignores stale profile responses after sign-out. Registration persists the chosen nickname; profile creation is transactional and does not reset XP. Auth-dependent pages redraw after restored login. Daily Quiz now creates a server session for logged-in users and submits results idempotently. Build leaderboards aggregate likes by owner and omit imported AI entries. Build comments link to the singular build route. Moderation warns the reported author. Manual builds validate hero and item IDs; AI metadata cannot be forged by user saves. Hero detail requests builds filtered by that hero. Crew/Tournaments expose owner creation shortcuts. Dates use explicit Uzbek month labels and Tashkent time. Service worker version rotates offline assets.

Verification: npm run build; node --experimental-vm-modules scripts/check-fixes.mjs; node scripts/check-esports.mjs. API regressions use isolated Firebase substitutes, not production credentials. Live public read checks before deployment returned Builds and official matches successfully, while News returned HTTP 500 on the previous deployment.
