# Buyumlar, emblemlar va Google qidiruvi

ZIPdagi `nexus` ichidagi fayl va papkalarni mavjud loyiha ildiziga Replace qiling. Papka tuzilishini saqlang. Git add → commit → push qiling.

Netlify suratidagi xabar: mavjud sayt ishlaydi, ammo production deploy va Agent Runner ishlashi kredit limiti tufayli vaqtincha to‘xtatilgan. Keyingi hisob davrini kutish yoki tarifni oshirish orqali deployni davom ettirish mumkin. Ushbu cheklov yechilmaguncha yangi push jonli saytni yangilamasligi mumkin.

Deploy Published bo‘lgach:

- Sayt menyusi → **Buyumlar va emblemlar**: barcha itemlar, o‘zbekcha nom ma’nolari, emblem va talent izohlari. Kirish talab qilinmaydi.
- **Builds** → buildni ochish: item rasmlari, emblem va o‘yin rejasi.
- https://nexus-mlbb.netlify.app/guide/ : Google o‘qiy oladigan ochiq qo‘llanma.
- https://nexus-mlbb.netlify.app/guide/items/ : 50 item.
- https://nexus-mlbb.netlify.app/guide/emblems/ : 7 emblem va talentlar.
- https://nexus-mlbb.netlify.app/sitemap.xml : hero, qo‘llanma, public yangilik va build manzillari. Maxfiy profil, izohlar yoki admin ma’lumotlari kiritilmaydi.

Google’da tezroq topilishi uchun:

1. https://search.google.com/search-console/ saytiga o‘z Google hisobingiz bilan kiring.
2. **Add property → URL prefix**: `https://nexus-mlbb.netlify.app/`.
3. Google taklif qilgan tasdiqlash usulini bajaring. HTML fayl usulida berilgan fayl loyiha `public` papkasiga joylanib qayta deploy qilinadi; tasdiqlash fayli hisobingizga bog‘liq bo‘lgani uchun bu paketda yo‘q.
4. **Sitemaps** → `sitemap.xml` → Submit.
5. **URL inspection** orqali bosh sahifa yoki `/guide/` manzilini tekshirib **Request indexing** bosing.

Sitemap Google’ga manzillarni topishga yordam beradi. Qidiruvga kiritish, muddat va o‘rin Google tomonidan belgilanadi; har bir qidiruvda chiqish kafolatlanmaydi. Manba: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview

Statik hero sahifalari build vaqtida yaratiladi. Hero ma’lumotlari yangilansa keyingi deploy ularni qayta chiqaradi. Public yangilik va build sahifalari serverdan o‘qiladi; sitemap ham ularni oladi. Bu sahifalar uchun serverdagi mavjud Firebase sozlamasi kerak. Sitemap va public sahifalar bir soatgacha CDN cache’da turishi mumkin.

Tekshirish: `npm run build`, `node --experimental-vm-modules scripts/check-seo.mjs`, `node --experimental-vm-modules scripts/check-equipment.mjs`.

Bu paket oldingi NEXUS-Complete-Update fayllarini ham o‘z ichiga oladi.
