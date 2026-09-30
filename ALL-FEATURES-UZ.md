# NEXUS — yangi imkoniyatlar

Bu yangilash paketi mavjud NEXUS loyihasiga qo‘yiladi. `nexus` ichidagi fayl va papkalarni VS Code’dagi loyiha ildiziga nusxalab, mos fayllarni Replace qiling. Papkalarni birlashtiring; tuzilishni buzib fayllarni bitta papkaga tashlamang. Mavjud `public/js/config.js` va Netlify’dagi server kalitlari saqlanadi. Kalitlar paketga kiritilmagan.

```sh
git add .
git commit -m "Add player tools and search-friendly guides"
git push
```

Netlify suratidagi kredit cheklovi ochilmaguncha production deploy to‘xtab turishi mumkin. Cheklov ochilgach Git deploy **Published** bo‘lganini tekshiring. Functions kerak bo‘lgani uchun faqat `public`ni drag-and-drop qilish yetarli emas.

## Qo‘shilganlar

- **Buyumlar va emblemlar:** 7 emblem va katalogdagi talentlar uchun rasmlar, o‘zbekcha vazifalar. Build ichidagi emblem/talent menyusida ham rasmlar bor. Ikki rasm paketda saqlangan; qolganlari MLBBDex manbasidan yuklanadi. Build vaqtida mavjud rasmlar avtomatik mahalliy nusxalanadi. Tashqi manba ochilmasa savol belgisi, nom va izoh qoladi; barcha original rasmlar mahalliy saqlangan deb hisoblamang.
- **Builds → AI build:** hero va 5 tagacha turli raqib hero tanlash. AI raqibga mos 6 item, emblem/talent, spell va o‘zbekcha izoh beradi. Har bir raqib tarkibi alohida 7 kunlik cache’da saqlanadi. AI kaliti serverda sozlangan bo‘lishi kerak; tavsiya g‘alaba kafolati emas.
- **Mashq rejasi:** har bir katalog herosiga 4 bosqich; Aamon va Alucardga alohida mashqlar. Hisob bilan kirganda serverda, mehmon uchun brauzerda saqlanadi. Bajarilganini foydalanuvchi belgilaydi, XP berilmaydi.
- **Patch taqqoslash:** yangilagich manbada aniq yozilgan oldingi va yangi qiymatlarni ajratadi. Dalil manba matnida bo‘lmasa qabul qilinmaydi. Qiymatlar yo‘q patchlarda jadval o‘rniga bu holat tushuntiriladi. Mavjud patchlar keyingi muvaffaqiyatli AI yangilanishida ko‘rib chiqiladi; har bir patchda taqqoslash bo‘lishi kafolatlanmaydi.
- **Build papkalari:** saqlangan buildlarni shaxsiy papkalarga ajratish, papka yaratish, nomini o‘zgartirish va o‘chirish. Papkani o‘chirish saqlangan buildlarni o‘chirmaydi.
- **Ma’lumotda xato bormi?:** hero, item, build, yangilik va patchdan xato yuborish. Owner bildirishnoma oladi, **Admin → Corrections** orqali ko‘rib `resolved` deb belgilaydi. Owner va admin ko‘ra oladi; foydalanuvchilar boshqa odamning xatosini ko‘rmaydi.
- **Rasmiy o‘yinlar → O‘yinni eslatish:** 5/15/30/60 daqiqa oldin eslatma. Netlify scheduled function har 5 daqiqada sayt bildirishnomasini yaratadi. Jadval surilsa eslatma qayta hisoblanadi. **Turnir eslatmalari** bo‘limida bekor qilish mumkin. Brauzer xabari ruxsat berilganda va sayt ochiq bo‘lganda ishlaydi; yopiq brauzer uchun push/SMS/email qo‘shilmagan.

## Internet qidiruvi

132 hero sahifasi, buyum/emblem katalogi va mashq qo‘llanmasi Google o‘qiy oladigan HTML bilan tayyorlangan. Public yangilik va build sahifalari serverdan olinadi. `robots.txt`, canonical va `sitemap.xml` mavjud; shaxsiy papka, progress va admin ma’lumotlari sitemapga kirmaydi.

Deploydan keyin [Google Search Console](https://search.google.com/search-console/)ga `https://nexus-mlbb.netlify.app/` saytini qo‘shing, Google bergan usul bilan tasdiqlang, **Sitemaps**da `sitemap.xml` yuboring. Tasdiqlash fayli hisobingizga bog‘liq va ushbu paketda yo‘q. `SEO-UPDATE-UZ.md`da batafsil yo‘riqnoma bor. Qidiruvga kiritish va muddatni Google belgilaydi.

## Tekshirilgan

`npm run build`; `check-player-features`, `check-fixes`, `check-equipment`, `check-esports`, `check-seo` tekshiruvlari o‘tdi. Server testlari izolyatsiya qilingan ma’lumot bazasi bilan bajarilgan; yangi imkoniyatlar jonli Firebase/Netlify’da hali deploy qilinmagan. Jonli deploydan keyin hisobga kirish, AI build, papka, xato yuborish va bitta eslatmani tekshiring.
