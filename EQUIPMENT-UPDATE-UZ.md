# NEXUS yangilanishi

1. ZIP ichidagi `nexus` papkasini oching. Ichidagi fayl va papkalarni mavjud loyiha ildiziga ko‘chiring. `Replace` tanlang. Papkalar tuzilishini saqlang: `public`, `netlify`, `scripts`.
2. VS Code terminalini mavjud GitHub loyihangiz ildizida oching:

```bash
git add .
git commit -m "Add item images, guides, numbered quiz and full counters"
git push
```

3. Netlify deploy `Published` bo‘lgach saytni `Ctrl + Shift + R` bilan yangilang.
4. Oldin berilgan UID hisobingizga kiring: `4R73sZiJTMVt6Vg3dF0jYzKb66V2`. Ushbu hisobning tasdiqlangan Firebase tokeni serverda Owner sifatida taniladi. Profil va hisob tugmasida `OWNER` ko‘rinadi.
5. Admin → Users → foydalanuvchi yonidagi Rol → admin → Rol berish. Vakolat olgan foydalanuvchi chiqib qayta kirsin. Owner hisobini bu menyuda pasaytirib bo‘lmaydi.

## Qo‘shildi

- Build kartalari, hero buildlari, ochilgan build, vaziyatga qarab itemlar va build yaratish/tahrirlashda asl item rasmlari.
- Item rasmini bosganda uning vazifasi va qachon tanlash haqida o‘zbekcha izoh.
- Emblem va talent izohlari; 132 ta hero passive’i uchun ochiladigan menyu.
- Quizda skill nomi o‘rniga 1-skill, 2-skill, 3-skill, 4-skill. Passive alohida hisoblanadi. 1000 savol va javob tekshiruvi saqlangan.
- 132 hero uchun 1458 manbali counter juftligi. Manba sanasi ko‘rinadi. Counter ma’lumotlari mavjud 6 soatlik updater bilan yangilanadi; manba ishlamasa oxirgi to‘liq ro‘yxat saqlanadi.
- Oldingi NEXUS-Fixes tuzatishlari shu paketga ham kiritilgan.

## Tekshiruv

```bash
npm run check
node --experimental-vm-modules scripts/check-equipment.mjs
node --experimental-vm-modules scripts/check-fixes.mjs
node scripts/check-esports.mjs
npm run build
```

Mahalliy tekshiruvlar o‘tgan. Jonli saytdagi o‘zgarishlar ZIPni loyiha bilan birlashtirib push qilganingizdan keyin kuchga kiradi. Firebase server sozlamalari va avtomatik updaterning mavjud Netlify sozlamalari kerak.

Manbalar: item va skill ma’lumotlari MLBB Wiki orqali MLBBDex (https://mlbbdex.com/en/api-doc; CC BY-SA), asl rasmlar © Moonton. Argus passive manbasi: https://liquipedia.net/mobilelegends/Argus. Counter juftliklari: https://mlbbhub.com/matchups. NEXUS izohlari o‘zbekcha qisqa o‘quv tavsiflaridir. Stat, skill, item va counterlar patch bilan o‘zgarishi mumkin.
