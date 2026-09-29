import json,pathlib,random,collections
root=pathlib.Path(__file__).resolve().parents[1]/'public/data';heroes=json.loads((root/'heroes.json').read_text());items=json.loads((root/'items.json').read_text());rng=random.Random(15870);bank=[]
def add(q,answer,wrong,diff,cat,explanation):
 opts=list(dict.fromkeys([answer]+wrong));assert len(opts)>=4,(q,opts)
 opts=[answer]+rng.sample([x for x in opts if x!=answer],3);rng.shuffle(opts)
 bank.append(dict(id=len(bank)+1,question=q,options=opts,correct=opts.index(answer),difficulty=diff,category=cat,explanation=explanation))
roles=['Tank','Fighter','Assassin','Mage','Marksman','Support']
for h in heroes:
 answer=h['role'];other=[r for r in roles if r not in answer.split('/')]
 add(f"{h['name']} qaysi hero roliga kiradi?",answer,other,'easy','Heroes',f"Katalogdagi {h['name']} roli: {answer}. Rol va lane bir xil tushuncha emas.")
for h in heroes:
 add(f"{h['name']} uchun katalogda qaysi asosiy lane ko‘rsatilgan?",h['lane'],[l for l in ['Jungle','Gold','EXP','Mid','Roam'] if l!=h['lane']],'easy','Lanes',f"{h['name']} uchun odatiy yo‘nalish — {h['lane']}. Muqobil lane va turnir picklari bo‘lishi mumkin.")
for it in items:
 add(f"{it['name']} itemining asosiy vazifasi qaysi?",it['effect'],[x['effect'] for x in items if x['effect']!=it['effect']],'easy','Items',f"{it['name']}: {it['effect']}. Aniq qiymatlar patchga qarab o‘zgaradi.")
spells='''Retribution|Jungle monsteriga zarba va objective olish|Minionlarni doimiy kuchaytirish|Butun jamoani teleport qilish|Turretni to‘liq tiklash
Flicker|Qisqa masofaga joy almashtirish|Lordni darhol chaqirish|Qalqonni doimiy saqlash|Barcha skillni yangilash
Purify|Ko‘p nazorat effektlaridan chiqish|Har qanday suppressionni yo‘qotish|Raqib goldini olish|Basic attack masofasini doimiy oshirish
Vengeance|Qabul qilingan zararga qarshi himoya va qaytarish|Xaritani doimiy yoritish|Ultimate nusxalash|Jamoani bir joyga ko‘chirish
Aegis|Himoya qalqoni olish|Raqibni havoga ko‘tarish|Skill cooldownini to‘liq yangilash|Monster o‘g‘irlash uchun maxsus zarar
Sprint|Harakat tezligini vaqtincha oshirish|Basic attackni magic damagega aylantirish|Hero rolini almashtirish|Minionlarni teleport qilish
Inspire|Basic attack bosimini vaqtincha kuchaytirish|Dushman ultimate’ini o‘chirish|Lord HPsini tiklash|Turretga qalqon berish
Execute|Past HPli raqibni yakunlashga yordam|Ko‘rinmaslikni doimiy berish|Jamoa mana zaxirasini to‘ldirish|Xaritani kengaytirish
Flameshot|Uzoqqa yo‘nalgan zarba berish|Doimiy physical defense olish|Raqibning spellini almashtirish|Qayta tirilish
Arrival|Mos ittifoqchi obyektga teleport qilish|Har qanday enemy’ga tez sakrash|Raqibni yutib yuborish|Jamoaning barcha HPsini to‘ldirish
Petrify|Yaqin raqiblarni qisqa tosh holatiga keltirish|Uzoqdan butun xaritani stun qilish|Jungle buff yaratish|Kritik zarbani doimiy oshirish
Revitalize|Hudud ichida HP tiklanishiga yordam|Enemy turretini o‘chirish|Cooldownni doimiy nol qilish|Nishonni boshqa xaritaga yuborish'''
for row in spells.splitlines():
 n,a,*w=row.split('|');add(f"{n} battle spell nima uchun tanlanadi?",a,w,'easy','Spells',f"{n}: {a.lower()}. Har bir spellning cheklovi va cooldowni bor.")
terms='''Jungle|Lane orasidagi monster hududi
Gold Lane|Qo‘shimcha gold olishga yo‘naltirilgan yon lane
EXP Lane|Tajriba yig‘ishga yo‘naltirilgan yon lane
Mid Lane|Xaritaning o‘rta yo‘lagi
Roam|Jamoaga xarita bo‘ylab yordam berish vazifasi
Tank|Oldingi saf va nazoratga yo‘naltirilgan rol
Fighter|Chidamlilik va zararni birlashtirgan jangchi
Assassin|Muhim nishonni tez yo‘qotishga yo‘naltirilgan rol
Mage|Ko‘pincha skill va magic zararga tayanadigan rol
Marksman|Ko‘pincha masofali basic attackka tayanadigan rol
Support|Ittifoqchilarni himoya va yordam bilan qo‘llovchi rol
CC|Raqib harakatini yoki amalini cheklovchi nazorat
Stun|Nishonni qisqa harakatsiz va amalsiz qoldirish
Slow|Harakat tezligini kamaytirish
Knock-up|Nishonni havoga ko‘tarish
Suppression|Purify odatda chiqara olmaydigan qattiq nazorat
Silence|Skill ishlatishni vaqtincha cheklash
Taunt|Raqibni muayyan nishonga hujumga majburlash
Root|Harakatni cheklab, ayrim amallarni saqlaydigan effekt
Blink|Qisqa vaqt ichida joyni keskin almashtirish
Dash|Bir yo‘nalishda tez siljish
Burst|Qisqa vaqt ichida katta zarar
Sustain|Uzoq jang davomida bardosh berish qobiliyati
Poke|Xavfsiz masofadan takroriy kichik bosim
Kite|Masofani saqlab zarba berib chekinish
Peel|Ittifoqchiga hujum qilgan raqibni undan uzoqlashtirish
Engage|Jamoaviy jangni boshlash
Disengage|Jangdan xavfsiz chiqish
Gank|Boshqa lane yoki hududga kutilmagan hujum
Rotation|Vazifaga ko‘ra xaritada joy almashtirish
Invade|Raqib jungle hududiga kirib bosim qilish
Zoning|Raqibni xavfli hududga yaqinlashtirmaslik
Vision|Xaritadagi raqib joylashuvi haqida axborot
Fog of war|Ko‘rinmayotgan xarita hududi
Bush|Heroni ko‘rinishdan yashirishi mumkin bo‘lgan o‘tloq
Face-check|Axborotsiz bushga tana bilan kirib tekshirish
Wave|Bir guruh minionlar
Wave clear|Minion to‘lqinini tez tozalash
Freeze|Minion to‘lqinini qulay joyda ushlab turish
Slow push|To‘lqinlarni yig‘ib asta katta bosim yaratish
Fast push|Minionlarni tez tozalab oldinga surish
Split push|Asosiy jamoaviy jangdan alohida lane’da push qilish
Backdoor|Odatiy oldingi jangni chetlab bazaga hujum qilish
Recall|Bazaga qaytish amali
Respawn|O‘lgandan keyin qayta paydo bo‘lish
Cooldown|Skill yoki spellni qayta ishlatishgacha vaqt
Mana|Ko‘p herolarning skill ishlatish resursi
Energy|Ayrim herolardagi manadan boshqa skill resursi
HP|Qolgan jon miqdori
Shield|Zararni yutuvchi qo‘shimcha himoya
Lifesteal|Basic attack orqali HP tiklash mexanikasi
Spell vamp|Skill zarari orqali HP tiklash mexanikasi
Physical damage|Physical defense bilan bog‘liq zarar turi
Magic damage|Magic defense bilan bog‘liq zarar turi
True damage|Odatiy physical va magic defense’dan o‘tadigan zarar
Penetration|Raqib himoyasining ta’sirini kamaytirish
Anti-heal|HP tiklanish samaradorligini kamaytirish
Crit|Kritik basic attack mexanikasi
Attack speed|Basic attacklar tezligi
Movement speed|Xaritada yurish tezligi
AoE|Bir hududdagi bir nechta nishonga ta’sir
Single target|Bitta nishonga qaratilgan effekt
Frontline|Jamoaning oldingi safi
Backline|Jamoaning orqa safi
Squishy|Himoyasi va HPsi nisbatan past nishon
Power spike|Hero kuchi sezilarli oshadigan nuqta
Scaling|Vaqt, daraja yoki item bilan kuchayish
Snowball|Ustunlikdan yana kattaroq ustunlik olish
Trade|Zarar yoki resurs almashish
Objective|Turret, Turtle yoki Lord kabi strategik maqsad
Turtle|Jamoaga resurs ustunligi beradigan neytral objective
Lord|Lane bosimiga yordam beradigan neytral objective
Buff|Heroga vaqtincha foyda beruvchi effekt
Debuff|Heroga salbiy ta’sir beruvchi effekt
KDA|Kill, death va assist bilan bog‘liq ko‘rsatkich
MVP|Matchdagi baholash bo‘yicha ajralib turgan o‘yinchi
Draft|Hero tanlash va ban qilish bosqichi
Ban|Hero tanlanishini draftda taqiqlash
Counter pick|Raqib xususiyatiga qarshi hero tanlash
Synergy|Hero yoki itemlarning bir-birini kuchaytirishi
Ranked|Rank ko‘tarilishi yoki tushishiga ta’sir qiladigan rejim
Classic|Odatiy o‘yin mashqi uchun asosiy rejim
Brawl|Bir lane’dagi tezroq jang rejimi
Custom|O‘yinchilar sozlaydigan xususiy o‘yin
Minimap|Xaritaning kichik kuzatuv oynasi
Ping|Jamoaga qisqa xarita yoki signal xabari
AFK|O‘yinda faol qatnashmay qolish
Feeding|Ko‘p o‘lib raqibga resurs ustunligi berish
Last hit|Nishonga yakuniy zarba berish
Item slot|Jihoz joylashtiriladigan o‘rin'''
terms=[r.split('|') for r in terms.splitlines()]
need=400-len(bank)
for name,meaning in terms[:need]:add(f"MLBB’da «{name}» nimani anglatadi?",meaning,[v for n,v in terms if n!=name],'easy','MLBB terms',f"{name} — {meaning.lower()}.")
assert len(bank)==400,len(bank)
# Medium: hero-specific skill names and mechanics are distinct facts.
for h in heroes:
 if h['ultimate']:
  add(f"{h['name']}ning ultimate’i yoki maxsus skill rejimi qaysi?",h['ultimate'],[x['ultimate'] for x in heroes if x['ultimate'] and x['ultimate']!=h['ultimate']],'medium','Skills',f"Editorial katalogda {h['name']}: {h['ultimate']}. Revampdan keyin nomni o‘yinda tekshiring.")
for h in heroes:
 if 'yangilanishi kerak' not in h['specialty']:
  add(f"{h['name']}ning o‘yin uslubini qaysi xususiyat ifodalaydi?",h['specialty'],[x['specialty'] for x in heroes if x['specialty']!=h['specialty'] and 'yangilanishi' not in x['specialty']],'medium','Game mechanics',f"{h['name']}ni ajratib turuvchi jihat: {h['specialty'].lower()}.")
# Curated applied strategy questions; no fabricated patch statistics.
strategies='''Lane’da raqib ko‘rinmay qoldi. Jamoaga birinchi foydali amal?|Missing ping berib xavfli rotatsiyani bildirish|Minimapni yopish|Darhol jungle buffni tashlab ketish|Raqib qaytguncha hech narsa demaslik|Ko‘rinmay qolgan raqib boshqa lane’ga xavf tug‘dirishi mumkin.
Lord oldidan jungleringiz o‘ldi. Eng oqilona qaror?|Raqib holatini ko‘rib xavfsiz himoya yoki boshqa resursni tanlash|Lordni ko‘rmasdan majburan boshlash|Yakka-yakka pitga kirish|Retribution yo‘qligini hisobga olmaslik|Objective uchun secure vositasi va jamoa soni hisobga olinadi.
Marksman sifatida fightda birinchi kimga zarba berish xavfsizroq?|Xavfsiz masofadagi mavjud nishonga|Har safar eng orqadagi mage’ga yugurish|Faqat junglerga, boshqa nishonga emas|Turret ostiga kirgan birinchi heroga|Damage berishda tirik qolish va pozitsiya birinchi o‘rinda.
Raqib assassin ko‘rinmayapti. Backline qanday turishi kerak?|Peel beradigan ittifoqchi va xavfsiz yo‘l yaqinida|Yolg‘iz bush ichida|Jamoaning eng oldida|Raqib bazasiga yaqin|Ko‘rinmayotgan assassin orqa safga kirish imkonini qidiradi.
Jamoa fight yutdi, raqiblar uzoq vaqt yo‘q. Nima tekshiriladi?|Minion wave va olinadigan objective|Faqat kill soni|Faqat emote tanlovi|Faqat recall effekti|Kill ustunligini turret yoki objective’ga aylantirish foydali.
Raqib tank juda uzoqqa qochmoqda, Lord esa ochiq. Nima muhim?|Quvish qiymatini Lord va xarita resursi bilan solishtirish|Tankni xarita oxirigacha quvish|Barcha spellni bitta tankka sarflash|Minimapni tekshirmaslik|Har bir quvish vaqt va boshqa objective narxiga ega.
Roamerning yaxshi bush tekshiruvi qaysi?|Xavfsiz masofadan skill yoki vision vositasi bilan|Har safar marksmandan kirishni so‘rash|HPsi past bo‘lsa ham yolg‘iz kirish|Raqiblar yo‘qolganida visionni unutish|Vision olishda keraksiz o‘limga yo‘l qo‘ymaslik kerak.
Raqibda kuchli heal bor. Buildda nima baholanadi?|Mos anti-heal item va uni kim qo‘llashi|Faqat ko‘proq movement speed|Faqat mana regen|Faqat turret zarari|Anti-heal tiklanish samaradorligini kamaytirishga yordam beradi.
Jamoangizda faqat physical zarar bor. Raqibga nima osonlashadi?|Physical defense yig‘ish|Ikki xil himoyani teng taqsimlash zarurati|Faqat magic defense olish|Faqat mana sotib olish|Bir xil zarar turi himoya tanlovini soddalashtiradi.
Enemy magic burst kuchli. Qaysi himoya yo‘nalishi mantiqli?|Magic defense va burstga qarshi himoya|Faqat attack speed|Faqat critical damage|Faqat physical penetration|Himoyani raqibning asosiy xavfiga moslang.
Agar dash skilli qochish uchun kerak bo‘lsa, farmda uni sarflash xavfi?|Gank paytida chiqish vositasi qolmasligi|Minionlar boshqa jamoaga o‘tishi|Hero roli o‘zgarishi|Mana avtomatik ko‘payishi|Harakat skillini sarflash keyingi xavfsizlik oynasini kamaytiradi.
Roam sifatida jamoada carryga dushman yaqinlashdi. Peel nimani anglatadi?|Tahdidni carrydan to‘xtatish yoki uzoqlashtirish|Carryni yolg‘iz qoldirish|Faqat raqib bazasiga yurish|Lordni tekshirmay boshlash|Peel carryning xavfsiz damage berish vaqtini oshiradi.
Lane ustunligini saqlash uchun wave’ni freeze qilish qachon foydali?|Raqibni xavfliroq joyda farm qilishga majburlaganda|Har doim objective oldidan rotatsiyani to‘xtatishda|Minion bo‘lmaganida|Jamoa bazasi yiqilayotganida tashqarida turishda|Freeze minion joylashuvi orqali bosim yaratadi.
Tez rotatsiya oldidan wave’ni push qilishning foydasi?|Raqibni minionga javob berishga majburlash|Hero cooldownini avtomatik tiklash|Raqib spellini o‘chirish|Bushni doimiy yoritish|Push qilingan wave boshqa hududga o‘tish uchun vaqt yaratishi mumkin.
Jamoangiz orqada. Eng xavfli odat qaysi?|Vision bo‘lmay turib yakka-yakka yurish|Turret ostida birga wave tozalash|Raqib joyini kuzatish|Xavfsiz farmni tanlash|Orqada turgan jamoa alohida ushlanishdan ehtiyot bo‘lishi kerak.
Lord push kelmoqda. Avval nimani baholaysiz?|Wave clear, baza xavfi va tirik jamoa soni|Faqat raqibning skinini|Faqat emote cooldownini|Faqat o‘zingizning kill soningizni|Himoyada eng yaqin xavf va to‘lqinlarni boshqarish zarur.
Gold lead bo‘lsa ham yutqazish mumkinmi?|Ha, pozitsiya va objective qarorlari natijani o‘zgartiradi|Yo‘q, gold lead darhol g‘alaba beradi|Faqat teng HP bo‘lsa mumkin|Faqat barcha turretlar turganda mumkin|Resurs ustunligi avtomatik g‘alaba emas.
Jungler Retributionni qachon ehtiyot qilishi kerak?|Muhim objective secure yaqinlashganda|Har qanday emote oldidan|Recall animatsiyasi uchun|Shop ochilayotganda|Objective oxirgi zarbasi uchun Retribution tayyor bo‘lishi muhim.
Raqib engage ultimate’ini o‘tkazib yubordi. Bu nimani yaratadi?|Javob bosimi uchun vaqt oynasi|Barcha turretni darhol yo‘qotish|Raqib HPsini avtomatik to‘ldirish|Barcha jungleni o‘chirib qo‘yish|Muhim cooldown sarflanishi xavfni vaqtincha kamaytiradi.
Uzoq masofali poke jamoasiga qarshi qanday yondashuv ko‘rib chiqiladi?|Aniq engage oynasi yoki xavfsiz chekinish|Cheksiz ochiq maydonda turish|HP kamayishini e’tiborsiz qoldirish|Har bir skillni tanaga qabul qilish|Poke oldida bekor kutish resursni kamaytiradi.
Fight boshlashdan oldin minimapda nimani tekshirish kerak?|Ittifoqchilar masofasi va yo‘qolgan dushmanlar|Faqat o‘zingizning avataringizni|Faqat chat rangini|Faqat match nomini|Yordam kelolmaydigan engage jamoani qiyin ahvolga soladi.
Split push qachon xavfliroq?|Raqiblar ko‘rinmayotgan va chiqish yo‘li bo‘lmaganida|Raqiblar boshqa chetda ko‘rinib turganda|Xavfsiz chiqish skilli tayyor bo‘lganda|Jamoa bosimni muvofiqlashtirganda|Split push xarita axborotiga tayanadi.
Tank har doim jangni boshlashi shartmi?|Yo‘q, ba’zan carryni himoya qilish ustuvor|Ha, vaziyatdan qat’i nazar|Faqat kill ko‘p bo‘lsa|Faqat HP nolga yaqin bo‘lsa|Tank vazifasi jamoa tarkibi va xavfga qarab o‘zgaradi.
Raqibda suppression bor. Purifyga to‘liq tayanish to‘g‘rimi?|Yo‘q, suppression uchun alohida ehtiyot kerak|Ha, Purify har qanday nazoratni doim buzadi|Ha, u raqib ultini nusxalaydi|Faqat fizik hero bo‘lsa buzadi|Suppression oddiy nazoratdan farq qiladi.
Mana juda kam va fight yaqin. Qanday qaror ko‘rib chiqiladi?|Resursni tiklash yoki jamoaga tayyor emaslikni bildirish|Skill bo‘lmasa ham majburan engage qilish|Mana indikatorini yashirish|Raqib turretiga yolg‘iz yurish|Skill resursi bo‘lmasa jamoaviy vazifa bajarilmay qolishi mumkin.
Raqibni turret ostida quvishdan oldin nima zarur?|Turret xavfi, wave va chiqish rejasini hisoblash|Faqat raqibning ismini o‘qish|Barcha teammate’ni uzoqqa yuborish|Recall tugmasini olib tashlash|Dive aniq resurs va chiqish yo‘li talab qiladi.
Raqib jungler xaritaning narigi tomonida ko‘rindi. Bu nimaga yordam beradi?|Xavfsizroq objective yoki qarama-qarshi bosimni rejalashga|Hamma enemy yo‘q degan xulosaga|Minimap kerak emas deyishga|O‘yinni avtomatik yakunlashga|Bitta hero joyi imkoniyat yaratadi, lekin qolgan raqiblar ham hisobga olinadi.
Late game’da yolg‘iz o‘lish nega og‘irroq?|Uzoq respawn objective yoki bazani boy berishga olib kelishi mumkin|Chunki barcha item yo‘qoladi|Chunki hero o‘chirib tashlanadi|Chunki barcha spell doimiy bloklanadi|Vaqt va son ustunligi late game’da juda muhim.
Buildni har match bir xil olishning kamchiligi?|Raqib xavfi va himoyasiga moslashmaslik|Hero nomi o‘zgarishi|Item sloti yo‘qolishi|Minionlar harakatdan to‘xtashi|Situational itemlar joriy raqib tarkibiga javob beradi.
Jamoada engage bor, lekin follow-up uzoqda. Nima qilish kerak?|Ittifoqchilar yetib kelishini yoki yaxshiroq oynani kutish|Darhol besh raqibga kirish|Pingni o‘chirish|Barcha defans itemni sotish|Engage qiymati undan keyingi yordam bilan bog‘liq.
Dushman healeri orqa safda himoyalangan. Qanday reja oqilona?|Kiruvchi yo‘l, CC va anti-healni birga rejalash|Har safar to‘g‘ri chiziqda yolg‘iz yugurish|Faqat tankni cheksiz urish|O‘z jamoangni boshqa tomonga tarqatish|Muhim nishonga kirish jamoaviy resurs va pozitsiya talab qiladi.
Emblem tanlashda nimaga tayanish kerak?|Hero vazifasi va rejalashtirilgan o‘yin uslubiga|Faqat emblem rangiga|Faqat eng uzun nomga|Faqat do‘st tanlaganiga|Emblem hero resursi, zarar uslubi va lane vazifasini qo‘llashi kerak.
Crit build va on-hit build bir xilmi?|Yo‘q, ular turli zarar mexanikasiga tayanadi|Ha, barcha effektlar bir xil|Faqat boots farq qiladi|Faqat item narxi farq qiladi|Kritik zarba va on-hit effektlar alohida mexanikalardir.
Jamoa Lordni urmoqda, tankning bir foydali vazifasi?|Raqib kirish yo‘lini nazorat qilish|Har safar eng ko‘p damage musobaqasi|Pitdan juda uzoqda AFK turish|Minimapni e’tiborsiz qoldirish|Zoning objective secure uchun vaqt va joy beradi.
Roamer xarita bo‘ylab nima uchun harakat qiladi?|Vision, yordam va objective bosimini taqsimlash uchun|Faqat barcha minion goldini olish uchun|Jungler o‘rniga har doim barcha buffni olish uchun|Carry farmiga doim xalaqit qilish uchun|Roam vazifasi jamoaviy axborot va yordamni oshirishdir.
Raqibning asosiy damage herosi o‘ldi. Nima o‘zgaradi?|Jamoaviy jangdagi xavf va objective imkoniyati|Barcha enemy skill yo‘qoladi|Barcha turret o‘chadi|Raqibda endi hech qanday CC qolmaydi|Muhim hero o‘limi katta imkoniyat, ammo qolgan tahdidlar saqlanadi.
Qalqonli hero umuman zarar olmaydimi?|Yo‘q, qalqonning chegarasi va qarshi mexanikalar bor|Ha, har qanday qalqon doimiy immunity|Faqat melee zararga doim immune|Faqat turretga doim immune|Qalqon zarar yutadi, lekin cheksiz himoya bermaydi.
True damagega qarshi oddiy defense yig‘ish yetarlimi?|Yo‘q, HP, pozitsiya va boshqa himoya vositalari ham muhim|Ha, faqat physical armor to‘liq to‘xtatadi|Ha, faqat magic defense to‘liq to‘xtatadi|Hero rangini almashtirish kifoya|True damage odatiy physical va magic defense’dan o‘tadi.
Poke skillingiz bilan bush tekshirdingiz, hech narsa ko‘rinmadi. Nima unutilmasin?|Har bir skillning reveal va hit axboroti turlicha|Endi butun xarita doim xavfsiz|Raqiblar bazada ekani kafolat|Barcha bushlar avtomatik ochilgan|Bitta tekshiruv barcha xavfni yo‘qotmaydi.
Raqib Flickerini sarfladi. Jamoaga aytishning foydasi?|Keyingi gank yoki engage oynasini rejalash|O‘z Flickeringizni avtomatik tiklash|Raqib spellini doimiy o‘chirish|Turretlarni kuchaytirish|Muhim spell cooldowni taktik axborotdir.
Minion wave yo‘q holda turret urishga shoshilish xavfi?|Turret bosimi va push samarasi noto‘g‘ri baholanishi|Barcha item o‘chirilishi|Rank darhol yo‘qolishi|Raqib spawn bo‘lmay qolishi|Turretga hujumda minion holati va himoya mexanikalari hisobga olinadi.
Early game kuchli hero bilan ustunlik qanday ishlatiladi?|Xavfsiz bosimni objective va resursga aylantirish|Faqat kill quvib wave yo‘qotish|Doim bazada kutish|Jamoaning farmiga xalaqit qilish|Kuchli vaqt oynasidan xarita ustunligi olish kerak.
Scaling hero uchun foydali reja qaysi?|Xavfsiz farm va muhim power spikega yetish|Har safar noqulay 1v3 jang|Minionlarni butunlay tashlash|Item sotib olmaslik|Scaling uchun vaqt va resursni yo‘qotmaslik muhim.
Jamoada ikki hero bir lane resursini talashmoqda. Eng yaxshi yo‘l?|Vazifalarni kelishib farmni taqsimlash|Bir-birini ataylab bloklash|Ikkalasi ham o‘yinni tark etish|Barcha pinglarni spam qilish|Vazifalar va resurslar kelishuvi jamoa samaradorligini oshiradi.
Skillni basic attack orasiga qo‘shishning qiymati nimaga bog‘liq?|Hero passive’i va combo mexanikasiga|Faqat skinning narxiga|Faqat chat tiliga|Faqat avatar rangiga|Har bir hero skill/basic attack ketma-ketligidan turlicha foyda oladi.
Enemy combo sizni ushlashga tayyor. Kirishni kechiktirish qachon foydali?|Muhim CC sarflanishini kutganda|Har doim jamoa fight tugatgandan keyingina|Faqat barcha do‘stlar o‘lganda|Hech qachon foydali emas|Assassin yoki carry uchun CC oynasini kutish xavfni kamaytiradi.
Raqib orqa safga kirganda mage nima baholaydi?|Saqlangan nazorat skilli va xavfsiz pozitsiya|Faqat eng oldingi tank HPsi|Faqat minion skinlari|Faqat kill animatsiyasi|Defensive CC va pozitsiya backline’ni saqlashi mumkin.
Barcha hero uchun bir xil battle spell eng yaxshimi?|Yo‘q, role va match rejasiga bog‘liq|Ha, har doim Execute|Ha, har doim Arrival|Ha, har doim Inspire|Spell lane, vazifa, xavf va hero mexanikasiga mos tanlanadi.
Jamoa fightdan keyin HPsi past holda qolgan. Lord qarori nimaga tayanadi?|Tirik raqiblar, secure, HP va qaytish vaqtiga|Faqat kill soniga|Faqat emote borligiga|Faqat turret rangiga|Fight yutish har doim darhol Lord olish mumkin degani emas.
Raqib bir lane’ni ko‘p gank qilmoqda. Qarama-qarshi bosim nima?|Boshqa hududdagi objective yoki resursdan foyda olish|Hammaning birma-bir o‘sha gankka o‘lishi|Xaritadagi barcha minionni e’tiborsiz qoldirish|Doim o‘sha joyga ko‘r-ko‘rona teleport|Bir joydagi ko‘p raqib boshqa hududda imkoniyat qoldiradi.
Skill shot nima bilan farqlanadi?|Nishonlash va yo‘nalishni hisoblash talab qilishi bilan|Har doim avtomatik tegishi bilan|Har doim global bo‘lishi bilan|Har doim turretni yo‘q qilishi bilan|Skill shot ko‘pincha raqib harakatini oldindan hisoblashni talab qiladi.
Qo‘llanmadagi win rate sanasi eski. Qanday xulosa kerak?|Uni hozirgi patchning isboti deb olmaslik|Uni doimiy haqiqat deb qabul qilish|Sanani o‘chirib current deyish|Foizni o‘zingiz ko‘paytirish|Meta raqami manba, davr, rank va patch bilan baholanadi.
Professional turnir pickini solo rankka ko‘chirishda nima muhim?|Jamoa muvofiqligi va skill talabining farqi|Faqat pro nicknameni nusxalash|Faqat bir xil avatar qo‘yish|Hech qanday shartni hisobga olmaslik|Turnir koordinatsiyasi solo rankdan farq qiladi.
Counter hero tanlashning o‘zi g‘alabani kafolatlaydimi?|Yo‘q, ijro, farm va jamoaviy qarorlar ham ta’sir qiladi|Ha, draft tugashi bilan g‘alaba|Faqat skin bo‘lsa kafolat|Faqat hero narxi yuqori bo‘lsa kafolat|Counter moslik ustunligi beradi, lekin o‘yin natijasini oldindan belgilamaydi.
Bitta katta shutdown uchun uzoq quvish nimaga almashtiriladi?|Yo‘qotiladigan wave, objective va o‘lim xavfiga|Faqat skin animatsiyasiga|Faqat chatdagi matnga|Faqat loading ekraniga|Quvishning foydasi va xarajatini solishtiring.
Jungler buff olayotganda teammate nima qilishi mumkin?|Xavfsiz vision va kerak bo‘lsa yordam berish|Har safar oxirgi zarbani tortib olish|Ataylab monster reset qilish|Yordam signalini e’tiborsiz qoldirish|Jungle xavfsizligi va resurs taqsimoti jamoaga ta’sir qiladi.
Bir raqibni besh kishi quvib ketishning asosiy xavfi?|Boshqa lane va objective’larni bo‘sh qoldirish|Raqibning rangi o‘zgarishi|O‘z hero nomi o‘zgarishi|Chat yo‘qolishi|Xaritada faqat bitta kill emas, boshqa maqsadlar ham bor.
Lord jangida raqib junglerini zoning qilish nega foydali?|Uning secure masofasiga kirishini qiyinlashtiradi|Retributionni avtomatik o‘chiradi|Lordni darhol jamoangizga beradi|Barcha raqiblarni muzlatadi|Masofa va kirish yo‘lini boshqarish contest xavfini kamaytiradi.
Carry himoya itemi olsa damage kamayishi har doim yomonmi?|Yo‘q, tirik qolish umumiy damage vaqtini oshirishi mumkin|Ha, himoya hech qachon foydali emas|Faqat tank item olishi mumkin|Har qanday himoya itemi taqiqlangan|Sustained damage uchun omon qolish ham zarur.
Raqib turret ostida farm qilayotganini ko‘rib qanday harakat qilinadi?|Vision va resursga qarab bosim yoki rotatsiya|Har safar yolg‘iz dive|Minionni darhol butunlay tark etish|Har safar barcha ultimate sarflash|Turret ostidagi raqibga qarshi imkoniyat vaziyatga bog‘liq.
Immortality ishlagach xavfsiz chiqish nega zarur?|Qayta tirilishdan keyin ham xavf saqlanadi|Chunki item barcha skillni doimiy o‘chiradi|Chunki hero roli almashtiriladi|Chunki baza yo‘qoladi|Qayta tirilish to‘liq xavfsizlik kafolati emas.
Enemy itemlarini ko‘rish nimaga yordam beradi?|Keyingi build va jang rejasini moslashga|Raqib hisobiga kirishga|Raqib skillini o‘g‘irlashga|Raqib pingini o‘zgartirishga|Himoya va damage yo‘nalishini ko‘rib mos javob tanlash mumkin.
Roamer faqat kill olmasa foydasizmi?|Yo‘q, vision, peel va engage ham katta hissa|Ha, kill bo‘lmasa hissa nol|Faqat MVP olsa foydali|Faqat jungle farm qilsa foydali|Roam qiymati faqat kill bilan o‘lchanmaydi.
Raqibning barcha herolari ko‘rinib turganida nima yaxshilanadi?|Xavf va imkoniyatni aniqroq baholash|Cooldownlar avtomatik nolga tushishi|Item narxining kamayishi|Barcha minionlar o‘lmas bo‘lishi|Ko‘proq axborot yaxshiroq xarita qaroriga yordam beradi.
Objective oldidan recall vaqtini kelishish nega muhim?|Jamoa kerakli paytda resurs bilan birga yetishi uchun|Recall doimiy bonus damage bergani uchun|Barcha enemy’ni qo‘rqitgani uchun|Lordni avtomatik muzlatgani uchun|Kech recall jamoani vaqtincha kam sonli qoldiradi.
Kuchli CC combo bir nishonga bir vaqtda sarflansa nima xavf bor?|Nazorat davomiyligining bekor ustma-ust ketishi|Raqib itemi ko‘payishi|O‘z HP avtomatik nol bo‘lishi|Skill nomi o‘zgarishi|CCni ketma-ket ulash ba’zan ko‘proq nazorat vaqti beradi.
Zarar yetkazishdan oldin resistance kamaytirish foydasi nima?|Keyingi mos turdagi zararning samarasi oshishi|Har doim true damagega aylanishi|Barcha spell cooldownini tiklashi|Goldni avtomatik bo‘lishishi|Defense reduction keyingi zarbalar uchun imkoniyat yaratadi.
Build manbasida patch yo‘q. Uni qanday ko‘rish kerak?|Umumiy tavsiya sifatida, joriy eng yaxshi deb emas|Aniq current meta deb|Rasmiy kafolat deb|Har hero uchun yagona build deb|Patch konteksti bo‘lmasa dolzarblikni tasdiqlash qiyin.
Tournament bracketda BYE nimani bildiradi?|Raqibsiz keyingi bosqichga o‘tish|Avtomatik mag‘lubiyat|Jamoa diskvalifikatsiyasi|Barcha matchni qayta boshlash|BYE to‘liq bo‘lmagan bracketni to‘ldirishda ishlatiladi.
Best-of-3 formatida seriyani yutish uchun nechta g‘alaba kerak?|2|1|3|4|Uch o‘yingacha davom etadigan seriyada ikki g‘alaba yetarli.
Best-of-5 formatida seriyani yutish uchun nechta g‘alaba kerak?|3|1|2|5|Beshtagacha o‘yinda birinchi uch g‘alaba seriyani yakunlaydi.
Scrim nima?|Jamoalarning kelishilgan mashq uchrashuvi|Majburiy reyting reseti|Skin savdosi|Bir kishilik tutorial|Scrim jamoa tarkibi va strategiyani mashq qilish uchun o‘tkaziladi.
Hero pool kengaytirishning draftdagi foydasi?|Ban va counterga qarshi ko‘proq variant qoladi|Barcha herolarni bir vaqtda tanlash mumkin|Raqibga ban taqiqlanadi|Barcha lane goldi ko‘payadi|Bir nechta hero bilish draft moslashuvini oshiradi.
Bir hero ko‘p ban qilinsa uning win rate’i haqida nimani bilamiz?|Faqat ban rate’dan aniq win rate chiqarib bo‘lmaydi|Win rate albatta 100%|Win rate albatta 0%|Ban rate va win rate har doim teng|Har statistika alohida o‘lchov va tanlanmaga ega.
Win rate uchun kichik tanlanmaning muammosi?|Tasodifiy natija foizni kuchli o‘zgartirishi mumkin|Foiz hisoblash umuman taqiqlanadi|Barcha natija avtomatik yolg‘on bo‘ladi|Win va loss soni ahamiyatsiz bo‘ladi|Tanlanma hajmi statistik ishonchlilikka ta’sir qiladi.
Ko‘p matchdagi past death soni har doim yaxshi o‘yin deganimi?|Yo‘q, vazifa, objective va jamoaviy hissa ham kerak|Ha, boshqa barcha ko‘rsatkich keraksiz|Faqat skin bilan birga bo‘lsa|Faqat tankda bunday bo‘ladi|Ko‘rsatkichlar kontekst bilan baholanadi.
Minimapni faqat o‘lgandan keyin ko‘rish kamchiligi?|Xavf haqida kech ma’lumot olish|Damage avtomatik kamayishi|Barcha item muzlashi|Hero tanlovi o‘zgarishi|O‘yin davomida tez-tez xarita axborotini olish zarur.
Ittifoqchi split push qilmoqda, asosiy jamoa nima kelishishi kerak?|Bosimni saqlash va noqulay majburiy fightdan qochish|Har safar uning yoniga besh kishi borish|Barchasi bazada yashirinish|Xarita axborotini uzish|Split push va jamoa bosimi vaqt bo‘yicha mos kelishi kerak.
Raqibdan qochayotganda to‘g‘ri chiziqda yurish qachon xavfli?|Yo‘nalgan skill shotni oldindan nishonlash oson bo‘lganda|Har safar turretda turganda|Faqat gold nol bo‘lsa|Faqat support bo‘lsa|Harakat yo‘lini o‘zgartirish skill shot xavfini kamaytirishi mumkin.
Gank muvaffaqiyatsiz bo‘ldi. Keyin nimani tekshirish kerak?|Yo‘qotilgan vaqt, wave va keyingi xavfsiz resurs|Faqat chatda aybdor qidirish|Darhol yana yolg‘iz dive|Barcha buyumlarni sotish|Muvaffaqiyatsiz urinishdan keyin resurs rejasini tiklash kerak.
Jamoada disengage vositasi bo‘lsa, u qachon qadrlanadi?|Raqib noqulay sharoitda fight majburlaganda|Faqat g‘alaba ekranida|Faqat shop ochilganda|Faqat barcha enemy o‘lganda|Disengage jangni qulayroq shartga ko‘chirish imkonini beradi.
Objective’dan oldin mid wave’ni tozalash foydasi?|Xarita bosimi va harakat uchun vaqt olish|Lord HPsini avtomatik nol qilish|Raqib spellini muzlatish|Barcha turretni heal qilish|Wave bosimi objective atrofidagi erkinlikni o‘zgartiradi.
Jungler objective urayotganda carry keraksiz duel boshladi. Xavf?|Jamoa ikki ishga bo‘linib himoya yo‘qotishi|Objective darhol yengillashishi|Barcha dushman bazaga qaytishi|Spelllar bepul bo‘lishi|Bir vaqtdagi kelishilmagan vazifalar xavfni oshiradi.
Damage carryga qarshi flank nega foydali bo‘lishi mumkin?|Oldingi safni chetlab kirish burchagi yaratadi|Har doim ko‘rinmaslik beradi|Har doim stun immunity beradi|Raqib HPsini avtomatik kamaytiradi|Flank pozitsiya ustunligi beradi, lekin vision va chiqish rejasini talab qiladi.
Qalqon yoki heal borligi dive uchun yetarli sababmi?|Yo‘q, damage, CC va chiqish imkonini ham hisoblash kerak|Ha, har doim|Faqat uchta skin bo‘lsa|Faqat chat jim bo‘lsa|Bitta himoya vositasi barcha xavfni qoplamaydi.
Raqibning asosiy ultimate’i tayyor ekanini bilmaysiz. Nima foydali?|Oldingi ishlatilgan vaqt va ehtimoliy xavfni hisoblash|Doim cooldown deb taxmin qilish|Minimapni yopish|Faqat qahramon narxini hisoblash|Aniq axborot bo‘lmasa ehtiyotkor risk bahosi kerak.
Power spike faqat level bilan bo‘ladimi?|Yo‘q, muhim item yoki mexanika ham spike yaratadi|Ha, itemlar ta’sir qilmaydi|Faqat skin bilan bo‘ladi|Faqat ping bilan bo‘ladi|Power spike level, item va hero mexanikasiga bog‘liq.
Tankni kesib o‘tib carryga yetolmayapsiz. Nima o‘zgartiriladi?|Kirish burchagi, timing yoki mavjud nishonga zarar rejasi|Har safar aynan bir xil muvaffaqiyatsiz yo‘l|Barcha visiondan voz kechish|Cooldownlarni e’tiborsiz qoldirish|Jang rejasi real pozitsiya va vositalarga moslashadi.
Teammate muhim skillini kutishni so‘radi. Qanday yordam foydali?|Fightni majburlamasdan xavfsiz pozitsiya va wave nazorati|Uni kutmay besh kishiga kirish|Ataylab o‘lish|Jungleni raqibga topshirish|Jamoa resurslari bir vaqtda tayyor bo‘lsa fight kuchliroq bo‘ladi.
Counter build tanlashda faqat hero rolini ko‘rish yetarlimi?|Yo‘q, haqiqiy damage manbai va build ham kerak|Ha, nomi Tank bo‘lsa damage nol|Ha, Mage doim bir xil build qiladi|Ha, role barcha mexanikani to‘liq bildiradi|Dual role va muqobil buildlar himoya qarorini o‘zgartiradi.
Baza xavf ostida va uzoqdagi buff ochiq. Ustuvorlik?|Baza va xavfli wave’ni saqlash|Har safar buff uchun ketish|Raqib spawnini tomosha qilish|Faqat chat yozish|Bazani yo‘qotish matchni tugatishi mumkin.
Mapda son ustunligi yaratish nima?|Muayyan hududda raqibdan ko‘proq tayyor teammate jamlash|Faqat umumiy killni oshirish|Faqat item slotini ko‘paytirish|Faqat hero levelini yashirish|Mahalliy son ustunligi fight yoki objective imkonini oshiradi.
Vision bor joydan xavfsiz yo‘l tanlashning foydasi?|Ambush ehtimolini kamaytirish|Barcha slow’ni bekor qilish|Hujum tezligini doimiy oshirish|Goldni ikki baravar qilish|Axborotli yo‘l riskni pasaytiradi, lekin nolga tushirmaydi.
Buildda ikki item bir xil nomlangan unique effektga ega. Nima qilish kerak?|Stack qoidalarini o‘yinda tekshirish|Effektlar har doim cheksiz qo‘shiladi deb olish|Ikkalasi ham doim ishlamaydi deyish|Faqat nom uzunligini solishtirish|Unique passive’larning birga ishlashi item qoidalariga bog‘liq.
Target lock sozlamasi nimaga yordam beradi?|Muhim nishonni aniqroq tanlashga|Raqibni avtomatik o‘ldirishga|Skill cooldownini o‘chirishga|Mappni kengaytirishga|Boshqaruv sozlamalari nishon aniqligiga yordam beradi.
Last hitni o‘rganishning foydasi?|Lane resursini ishonchliroq olish|Har safar Lordni tug‘dirish|Teammate XPni o‘chirish|Battle spellni almashtirish|Resurs yig‘ish item va level vaqtiga ta’sir qiladi.
Raqibda uzoq poke va sekin engage bor. Qaysi joylashuv xavfli?|Tor yo‘lakda ko‘rinib uzoq kutish|Xavfsiz flank axborotini yig‘ish|HPni tiklab qayta kelish|Jamoa bilan kirish vaqtini belgilash|Tor joyda poke va AoE bir nechta nishonga tegishi osonlashadi.
Enemy CC immunity oynasiga nazorat tashlash xavfi?|Nazorat samarasiz sarflanishi|O‘z XP avtomatik yo‘qolishi|Barcha minion o‘lishi|Gold doimiy kamayishi|Nazoratni immunity tugagach ishlatish foydaliroq bo‘lishi mumkin.
Raqib retreat qilayotganda barcha mobilityni kirishga sarflash nimani qiyinlashtiradi?|Qayta engage yoki ambushdan chiqishni|Minion nomini o‘qishni|Item xarid tarixini|Emote almashtirishni|Qochish uchun resurs qoldirish zarur bo‘lishi mumkin.
Yangi hero bilan rankedga kirishdan oldin nima foydali?|Skill, combo va resursni mashq rejimida sinash|Faqat skin olish|Faqat hero narxini yodlash|Birorta skillni o‘qimaslik|Mexanika bilan tanishish noto‘g‘ri qarorlarni kamaytiradi.
Qo‘llanmada “must pick” deyilsa nima tekshiriladi?|Sana, patch, rank va muallif dalili|Faqat sarlavha rangi|Faqat reklama soni|Faqat sahifa uzunligi|Meta tavsiyasini dalil va kontekst bilan tekshiring.
Ko‘p assistli support natijasini qanday baholash kerak?|Peel, heal, vision va objective hissasi bilan|Faqat kill soni bilan|Faqat olingan minionlar bilan|Faqat sotib olingan itemlar soni bilan|Rolga mos hissa umumiy statistika bilan birga baholanadi.
Bir hero bilan yutqazgach u doim kuchsiz degan xulosa to‘g‘rimi?|Yo‘q, bitta match ko‘p omilli natija|Ha, bitta loss yetarli dalil|Faqat dushman MVP bo‘lsa|Faqat match uzun bo‘lsa|Skill, draft, farm va jamoa qarorlari natijaga ta’sir qiladi.
Fightdan oldin ikki teammate boshqa lane’da. Qaysi signal foydali?|Kutish yoki chekinish haqida aniq ping|Ataylab noto‘g‘ri attack ping spam|Hech qanday axborot bermaslik|Doim barcha chatni o‘chirish|Aniq signal jamoaning bir qarorga kelishiga yordam beradi.
Turret olingach juda chuqurda qolishning xavfi?|Raqib respawn va yopish yo‘li tufayli ushlanish|Turret o‘z-o‘zidan qayta qurilishi|Itemlar avtomatik sotilishi|Skilllar almashishi|Objective’dan keyin xavfsiz reset ham muhim.
Objective uchun fight majburlamasdan bosim berish mumkinmi?|Ha, wave, vision va zoning orqali|Yo‘q, faqat kill bilan|Faqat besh assassin bo‘lsa|Faqat barcha enemy offline bo‘lsa|Xarita nazorati bevosita jang bo‘lmasa ham ustunlik yaratadi.
Raqibning damage turi aralash. Himoyani qanday tanlash kerak?|Eng katta real xavf va o‘yin bosqichiga qarab|Faqat bitta turga ko‘r-ko‘rona|Faqat eng arzon itemga|Faqat item tasviriga|Resurs cheklanganligi uchun eng muhim xavf ustuvor bo‘ladi.
“Safe lane” har doim mutlaq xavfsizmi?|Yo‘q, vision va raqib rotatsiyasi bilan xavf o‘zgaradi|Ha, u yerda o‘lib bo‘lmaydi|Faqat ranged hero bo‘lsa o‘lmaydi|Faqat boots bo‘lsa o‘lmaydi|Lane nomi har vaziyatda xavfsizlik kafolati bermaydi.
Teamfight boshlanganda kamera bilan nimani kuzatish foydali?|Tahdid, carry joyi va ishlatilgan muhim skilllar|Faqat o‘z avataringiz|Faqat recall paneli|Faqat buyum narxlari|Kengroq fight axboroti timing va target qarorini yaxshilaydi.
Raqib buffini o‘g‘irlash uchun ko‘p teammate wave yo‘qotsa nima baholanadi?|Olingan foyda bilan jami yo‘qotilgan resurs|Faqat buff rangi|Faqat bosilgan ping soni|Faqat o‘yin uzunligi|Invade foydasi uning jamoaviy xarajatidan katta bo‘lishi kerak.
G‘alaba uchun asosiy yakuniy maqsad nima?|Raqib bazasini yo‘q qilish|Faqat eng ko‘p kill olish|Faqat barcha itemni qimmat qilish|Faqat mapda eng uzoq yurish|Objective va baza natijani belgilaydi, kill vositalardan biridir.'''
strategies=[line.split('|') for line in strategies.splitlines()]
for row in strategies:
 q,a,w1,w2,w3,e=row;add(q,a,[w1,w2,w3],'medium','Strategy',e)
# Concrete skill facts replace synthetic name-swapped tactical scenarios.
facts=[]
for line in (pathlib.Path(__file__).parent/'skill-facts.txt').read_text().splitlines():
 name,s1,e1,s2,e2=line.split('|');facts += [(name,s1,e1),(name,s2,e2)]
need_medium=800-len(bank)
for i,(name,skill,effect) in enumerate(facts[:need_medium+200]):
 diff='medium' if i<need_medium else 'hard'
 alternatives=[e for n,s,e in facts if e!=effect]
 add(f"{name}ning «{skill}» skilli qaysi vazifani bajaradi?",effect,alternatives,diff,'Skills',f"{skill}: {effect.lower()}. Skillning aniq qiymati va patchdagi o‘zgarishlarini o‘yin ichida tekshiring.")
remaining=need_medium
assert len(bank)==1000,len(bank)
assert len({q['question'] for q in bank})==1000
assert collections.Counter(q['difficulty'] for q in bank)=={'easy':400,'medium':400,'hard':200}
(root/'quiz-data.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2))
print('Questions',len(bank),'strategies',len(strategies),'composition',remaining)
