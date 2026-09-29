import json,re,pathlib
root=pathlib.Path(__file__).resolve().parents[1]/'public/data'
# Editorial starter catalogue; patch-sensitive values deliberately omitted.
raw='''Miya|Marksman|Gold|Moonlight Shadow|Hujum tezligi va masofadan zarba
Balmond|Fighter|Jungle|Lethal Counter|Aylanma zarba va yakunlash
Saber|Assassin|Jungle|Triple Sweep|Bitta nishonga nazorat va burst
Alice|Mage/Tank|EXP|Blood Ode|Jang ichida tiklanish
Nana|Mage|Mid|Molina Blitz|Molina orqali hudud nazorati
Tigreal|Tank|Roam|Implosion|Guruhli nazorat va engage
Alucard|Fighter/Assassin|Jungle|Fission Wave|Yaqin jang va lifesteal
Karina|Assassin|Jungle|Shadow Assault|Magic burst va reset
Akai|Tank|Jungle|Heavy Spin|Nishonni surish va objective nazorati
Franco|Tank|Roam|Bloody Hunt|Hook va suppression
Bane|Fighter/Mage|EXP|Deadly Catch|Aralash zarar va push
Bruno|Marksman|Gold|World Wave|Kuchli kritik zarbalar
Clint|Marksman|Gold|Grenade Bombardment|Skilldan keyingi masofali zarba
Rafaela|Support|Roam|Holy Baptism|Heal va tezlik
Eudora|Mage|Mid|Thunder's Wrath|Tezkor magic combo
Zilong|Fighter/Assassin|EXP|Supreme Warrior|Quvish va split push
Fanny|Assassin|Jungle|Cut Throat|Cable orqali harakat
Layla|Marksman|Gold|Destruction Rush|Uzoq masofali basic attack
Minotaur|Tank/Support|Roam|Minoan Fury|Heal va guruhli knock-up
Lolita|Support/Tank|Roam|Noumenon Blast|Yo‘nalgan qalqon va guruh nazorati
Hayabusa|Assassin|Jungle|Ougi: Shadow Kill|Soya orqali kirish va qaytish
Freya|Fighter|EXP|Valkyrie Descent|Qalqon va yaqin jang
Gord|Mage|Mid|Mystic Gush|Uzluksiz yo‘nalgan magic zarar
Natalia|Assassin|Roam|The Hunt|Yashirin yaqinlashish
Kagura|Mage|Mid|Yin Yang Overturn|Soyabon bilan combo
Chou|Fighter|EXP|The Way of Dragon|Nishonni jamoaga tepish
Sun|Fighter|EXP|Clone Techniques|Klonlar va split push
Alpha|Fighter|Jungle|Spear of Alpha|Beta yordami va sustain
Ruby|Fighter|EXP|I'm Offended!|Qayta-qayta CC va sustain
Yi Sun-shin|Assassin/Marksman|Jungle|Mountain Shocker|Xaritani ochuvchi ultimate
Moskov|Marksman|Gold|Spear of Destruction|Teshib o‘tuvchi basic attack
Johnson|Tank/Support|Roam|Rapid Touchdown|Mashina shaklida rotatsiya
Cyclops|Mage|Mid|Star Power Lockdown|Qisqa skill sikli va ta’qib
Estes|Support|Roam|Blessing of Moon Goddess|Guruhli heal
Hilda|Fighter/Tank|Roam|Power of Wildness|Bush orqali bosim
Aurora|Mage|Mid|Frigid Glacier|Muzlatish va hudud nazorati
Lapu-Lapu|Fighter|EXP|Bravest Fighter|Ikki shaklli jangchi
Vexana|Mage|Mid|Eternal Guard|Undead Knight chaqirish
Roger|Fighter/Marksman|Jungle|Wolf Transformation|Odam va bo‘ri shakli
Karrie|Marksman|Gold|Speedy Lightwheel|True damage passive
Gatotkaca|Tank/Fighter|Roam|Avatar of Guardian|Taunt va katta engage
Harley|Assassin/Mage|Jungle|Deadly Magic|Magic burst va qaytish
Irithel|Marksman|Gold|Heavy Crossbow|Harakatda basic attack
Grock|Tank/Fighter|Roam|Wild Charge|Devor va hudud nazorati
Argus|Fighter|EXP|Eternal Evil|Qisqa o‘lmaslik oynasi
Odette|Mage|Mid|Swan Song|Katta hududli magic zarar
Lancelot|Assassin|Jungle|Phantom Execution|Ketma-ket dash va aniqlik
Diggie|Support|Roam|Time Journey|Guruhni CCdan himoya qilish
Hylos|Tank|Roam|Glorious Pathway|Chidamlilik va yo‘l ochish
Zhask|Mage|Mid|Dominator's Descent|Nightmaric Spawn orqali nazorat
Helcurt|Assassin|Jungle|Dark Night Falls|Ko‘rishni cheklash va ambush
Pharsa|Mage|Mid|Feathered Air Strike|Uzoqdan hududga zarba
Lesley|Marksman/Assassin|Gold|Ultimate Snipe|Aniq uzoq masofali zarba
Jawhead|Fighter|EXP|Unstoppable Force|Nishonni uloqtirish
Angela|Support|Roam|Heartguard|Ittifoqchiga ulanish
Gusion|Assassin|Jungle|Incandescence|Xanjar bilan tezkor combo
Valir|Mage|Mid|Vengeance Flame|Surib chiqarish va slow
Martis|Fighter|Jungle|Decimation|CC oynalari va execute
Uranus|Tank|EXP|Consecration|Uzoq jangda tiklanish
Hanabi|Marksman|Gold|Higanbana|Sakrovchi basic attack
Chang'e|Mage|Mid|Meteor Shower|Uzoqdan projectile zarari
Kaja|Support/Fighter|Roam|Divine Judgment|Suppression va olib chiqish
Selena|Assassin/Mage|Roam|Primal Darkness|Trap va uzoq stun
Aldous|Fighter|EXP|Contract: Chase Fate|Stack va nishonni quvish
Claude|Marksman|Gold|Blazing Duet|Teleport nuqtasi va tez zarbalar
Vale|Mage|Mid|Windstorm|Knock-up va magic burst
Leomord|Fighter|Jungle|Phantom Steed|Otga minib jang qilish
Lunox|Mage|Mid|Order & Chaos|Ikki quvvat holati
Hanzo|Assassin|Jungle|Kinjutsu: Pinnacle Ninja|Masofadan xavf tug‘dirish
Belerick|Tank|Roam|Wrath of Dryad|Taunt va qaytuvchi zarar
Kimmy|Marksman/Mage|Gold|Maximum Charge|Nishonlab uzluksiz zarba
Thamuz|Fighter|EXP|Cauterant Inferno|Uzoq yaqin jang
Harith|Mage|Gold|Zaman Force|Dash va qisqa skill sikli
Minsitthar|Fighter|EXP|King's Calling|Dashni cheklovchi hudud
Kadita|Mage/Assassin|Mid|Rough Waves|Kutilmagan magic combo
Faramis|Support/Mage|Roam|Cult Alter|Jamoani jangda saqlash
Badang|Fighter|EXP|Fist Crack|Devor yonidagi combo
Khufra|Tank|Roam|Tyrant's Rage|Engage va dashni to‘xtatish
Granger|Marksman|Jungle|Death Sonata|Nishonli o‘q zarbalari
Guinevere|Fighter|EXP|Violet Requiem|Knock-updan keyingi combo
Esmeralda|Tank/Mage|EXP|Falling Starmoon|Qalqon bilan uzoq jang
Terizla|Fighter|EXP|Penalty Zone|Og‘ir zarba va hudud nazorati
X.Borg|Fighter|EXP|Last Insanity|Zirh va uzluksiz zarar
Ling|Assassin|Jungle|Tempest of Blades|Devor bo‘ylab harakat
Dyrroth|Fighter|EXP|Abysm Strike|Physical defense kamaytirish
Lylia|Mage|Mid|Black Shoes|Oldingi holatga qaytish
Baxia|Tank|Jungle|Tortoise's Puissance|Tiklanishga qarshi bosim
Masha|Fighter/Tank|EXP|Thunderclap|Nishonga yaqin bosim
Wanwan|Marksman|Gold|Crossbow of Tang|Zaif nuqtalarni ochish
Silvanna|Fighter|EXP|Imperial Justice|Nishonni duel hududida ushlash
Cecilion|Mage|Mid|Bats Feast|Stack bilan kuchayish
Carmilla|Support/Tank|Roam|Curse of Blood|Raqiblarni bir-biriga bog‘lash
Atlas|Tank|Roam|Fatal Links|Guruhni bir nuqtaga tortish
Popol and Kupa|Marksman|Gold|We Are Angry!|Sherik bo‘ri va traplar
Yu Zhong|Fighter|EXP|Black Dragon Form|Orqa safga kiruvchi ajdarho
Luo Yi|Mage|Mid|Diversion|Teleport va Yin-Yang nazorati
Benedetta|Assassin/Fighter|EXP|Alecto: Final Blow|Charged dash va harakat
Khaleed|Fighter|EXP|Raging Sandstorm|Tez rotatsiya va sustain
Barats|Tank/Fighter|Jungle|Detona's Welcome|Nishonni yutib nazorat qilish
Brody|Marksman|Gold|Torn-Apart Memory|Belgilar va kuchli yakunlash
Yve|Mage|Mid|Real World Manipulation|Katta hududni boshqarish
Paquito|Fighter/Assassin|EXP|Knockout Strike|Skill combo va tez bosim
Gloo|Tank|EXP|Split, Split|Nishonga yopishish
Beatrix|Marksman|Gold|Qurolga bog‘liq ultimatlar|To‘rt qurol bilan moslashish
Phoveus|Fighter|EXP|Infernal Pursuit|Yaqin jang va ketma-ket bosim
Natan|Marksman|Gold|Entropy?|Magic basic attack
Aulus|Fighter|Jungle|Undying Fury|Daraja oshganda kuchayish
Aamon|Assassin|Jungle|Endless Shards|Kamuflyaj va magic burst
Floryn|Support|Roam|Bloom|Xarita bo‘ylab heal
Valentina|Mage|Mid|I Am You|Raqib ultimate’ini nusxalash
Edith|Tank/Marksman|EXP|Primal Wrath|Tank va masofali shakl
Yin|Fighter/Assassin|Jungle|My Turn|Alohida duel hududi
Melissa|Marksman|Gold|Go Away!|Qo‘g‘irchoq va himoya hududi
Xavier|Mage|Mid|Dawning Light|Xarita bo‘ylab magic zarba
Julian|Fighter/Mage|Jungle|Alohida ultimate yo‘q|Kuchaytirilgan uchinchi skill
Fredrinn|Fighter/Tank|Jungle|Appraiser's Wrath|Yig‘ilgan zarar va sustain
Joy|Assassin|Jungle|Ha, Electrifying Beats!|Ritmga mos dash
Novaria|Mage|Mid|Astral Echo|Uzoq poke va ko‘rish
Arlott|Fighter/Assassin|EXP|Final Slash|Belgili nishonlar va dash
Ixia|Marksman|Gold|Full Barrage|Bir yo‘nalishda katta hudud zarari
Nolan|Assassin|Jungle|Fracture|Riftlar va tez rotatsiya
Cici|Fighter|EXP|Curtain Call|Harakatda yo-yo zarbalari
Chip|Support/Tank|Roam|Shortcut|Jamoa uchun portal
Zhuxin|Mage|Mid|Crimson Beacon|Ko‘tarish va hudud nazorati
Suyou|Assassin/Fighter|Jungle|Uch skill rejimi|Bosish va ushlab turish rejimlari
Lukas|Fighter|EXP|Unleash the Beast|Sacred Beast shakli
Kalea|Support/Fighter|Roam|Tsunami Slam|Heal va nishonni ko‘chirish
Zetian|Mage|Mid||Global bosim
Obsidia|Marksman|Gold||Hero ma’lumoti yangilanishi kerak
Sora|Fighter/Assassin|EXP||Hero ma’lumoti yangilanishi kerak
Marcel|Support|Roam||Hero ma’lumoti yangilanishi kerak
Hirara|Assassin|Jungle||Hero ma’lumoti yangilanishi kerak'''
heroes=[]
for line in raw.splitlines():
 n,r,l,u,s=line.split('|');id=re.sub('[^a-z0-9]+','-',n.lower()).strip('-')
 heroes.append(dict(id=id,name=n,role=r,lane=l,ultimate=u,specialty=s,difficulty='Medium',sourceUrl='https://www.mobilelegends.com/',sourceName='MLBB — o‘yinda qayta tekshiring',status='editorial',patch=None,updatedAt=None,image=None))
# More specific guides, rather than fabricated current win rates.
guides={
'aamon':dict(passive='Invisible Armor',skills=['Soul Shards','Slayer Shards','Endless Shards'],combo='Shardlarni yig‘ing, nishonning muhim himoya skillini kuting, yaqinlashib ultimate bilan yakunlang.',strengths='Yumshoq nishonga magic burst; kamuflyaj orqali kirish.',weaknesses='Keng maydonli zarar va vaqtida ishlatilgan himoya burstni to‘xtatadi.',spell='Retribution',emblem='Assassin',counters=['eudora','kaja','franco'],allies=['tigreal','atlas','angela']),
'alucard':dict(passive='Pursuit',skills=['Groundsplitter','Whirling Smash','Fission Wave'],combo='Raqibning qattiq CCsi sarflangach kiring. Skilllar orasiga basic attack qo‘shing.',strengths='Uzluksiz yaqin jang va lifesteal.',weaknesses='Anti-heal, suppression va uzoqdan kite.',spell='Retribution',emblem='Fighter',counters=['baxia','franco','kaja'],allies=['rafaela','angela','tigreal']),
'fredrinn':dict(passive='Crystalline Armor',skills=['Piercing Strike','Brave Assault','Energy Eruption',"Appraiser’s Wrath"],combo='Skilllarni bog‘lab combo nuqtalarini boshqaring. Ultimate uchun dushmanni markazda tuting.',strengths='Frontline, taunt va uzoq jang.',weaknesses='Kite, tiklanishni kamaytirish va foizli zarar.',spell='Retribution',emblem='Tank',counters=['karrie','valir','baxia'],allies=['angela','xavier','claude']),
'phoveus':dict(passive='Demonic Force',skills=['Demonic Impact','Dark Wave','Infernal Pursuit'],combo='Belgili nishonlarga bosim bering. Uzoq jangda masofani yo‘qotmang.',strengths='Yaqin jang, sustain va davomli bosim.',weaknesses='Uzoqdan kite va anti-heal.',spell='Vengeance',emblem='Fighter',counters=['valir','karrie','baxia'],allies=['rafaela','angela','atlas']),
'fanny':dict(passive='Air Superiority',skills=['Tornado Strike','Steel Cable','Cut Throat'],combo='Cable yo‘lini oldindan tanlang. Energiya yetishini va qaytish yo‘lini hisoblang.',strengths='Juda tez xarita harakati.',weaknesses='Energiya nazorati, suppression va invade.',spell='Retribution',emblem='Assassin',counters=['khufra','kaja','franco'],allies=['angela','rafaela','tigreal']),
'valentina':dict(passive='Primal Force',skills=['Shadow Strike','Arcane Shade','I Am You'],combo='Jamoaviy jangga mos raqib ultimate’ini tanlang.',strengths='Dushman draftidagi kuchli ultimate’lardan foydalanadi.',weaknesses='Nusxalash uchun foydali nishon bo‘lmagan draftda qiymati pasayadi.',spell='Flicker',emblem='Mage',counters=['kaja','saber','franco'],allies=['atlas','tigreal','fredrinn']),
}
for h in heroes:
 h.update(guides.get(h['id'],{}));h['difficulty']='Hard' if h['id'] in ['fanny','ling','gusion','kagura','lancelot','benedetta','joy','hayabusa'] else 'Easy' if h['id'] in ['layla','miya','eudora','saber','rafaela','balmond','nana'] else 'Medium'
 h['damage']='Magic' if h['role'].startswith('Mage') or h['id'] in ['aamon','karina','gusion','natan','joy','julian'] else 'Physical'
 h['ratings']={'burst':4 if 'Assassin' in h['role'] or 'Mage' in h['role'] else 2,'sustain':4 if 'Fighter' in h['role'] or 'Tank' in h['role'] else 1,'mobility':4 if 'Assassin' in h['role'] else 2,'cc':4 if 'Tank' in h['role'] else 2,'early':3,'late':4 if 'Marksman' in h['role'] else 3,'teamfight':4 if 'Tank' in h['role'] or 'Mage' in h['role'] else 3,'duel':4 if 'Fighter' in h['role'] or 'Assassin' in h['role'] else 2}
 h['ratingsNote']='Rolga asoslangan taxminiy tavsif; match statistikasi emas.'
(root/'heroes.json').write_text(json.dumps(heroes,ensure_ascii=False,indent=2))
items_raw='''Warrior Boots|Movement|Physical himoya
Tough Boots|Movement|Magic himoya va nazorat davomiyligi
Arcane Boots|Movement|Magic penetration
Swift Boots|Movement|Attack speed
Magic Shoes|Movement|Cooldown qisqartirish
Demon Shoes|Movement|Mana tiklash
Rapid Boots|Movement|Rotatsiya tezligi
Blade of Despair|Physical|Yuqori physical attack
Berserker’s Fury|Physical|Kritik zarar
Windtalker|Physical|Hujum tezligi
Haas’s Claws|Physical|Lifesteal
Malefic Roar|Physical|Physical penetration
Hunter Strike|Physical|Physical burst va harakat
Blade of the Heptaseas|Physical|Dastlabki zarba bosimi
Endless Battle|Physical|Skilldan keyingi basic attack
Demon Hunter Sword|Physical|HPga qarshi basic attack
Golden Staff|Physical|On-hit sinergiya
Corrosion Scythe|Physical|Basic attack orqali slow
Sea Halberd|Physical|Tiklanishga qarshi
Wind of Nature|Physical|Vaqtincha physical immunity
Rose Gold Meteor|Physical|Himoya qalqoni
Great Dragon Spear|Physical|Ultimate bilan harakat
War Axe|Physical|Uzoq jang
Sky Piercer|Adaptive|Past HPli nishonni yakunlash
Holy Crystal|Magic|Magic power
Divine Glaive|Magic|Magic penetration
Genius Wand|Magic|Magic defense kamaytirish
Glowing Wand|Magic|Davomiy zarar va tiklanishga qarshi
Ice Queen Wand|Magic|Skill orqali slow
Concentrated Energy|Magic|Magic sustain
Feather of Heaven|Magic|Magic basic attack
Lightning Truncheon|Magic|Magic burst
Clock of Destiny|Magic|Magic jangchi uchun himoya
Enchanted Talisman|Magic|Mana va cooldown
Fleeting Time|Magic|Ultimate sikli
Winter Crown|Adaptive|Vaqtincha muzlash himoyasi
Blood Wings|Magic|Magic qalqon
Wishing Lantern|Magic|HPga qarshi magic zarar
Athena’s Shield|Defense|Magic burstga qarshi
Radiant Armor|Defense|Davomiy magic zararga qarshi
Antique Cuirass|Defense|Physical skill zararga qarshi
Blade Armor|Defense|Basic attackka qarshi
Dominance Ice|Defense|Tiklanish va hujum tezligiga qarshi
Immortality|Defense|Qayta tirilish
Oracle|Defense|Qalqon va tiklanishni kuchaytirish
Guardian Helmet|Defense|Jangdan tashqari HP tiklash
Brute Force Breastplate|Defense|Uzoq jangda himoya
Thunder Belt|Defense|Basic attack va slow
Queen’s Wings|Defense|Past HPda omon qolish
Twilight Armor|Defense|Katta bir martalik zarbaga qarshi'''
items=[]
for line in items_raw.splitlines():
 n,t,e=line.split('|');items.append(dict(id=re.sub('[^a-z0-9]+','-',n.lower()).strip('-'),name=n,type=t,effect=e))
(root/'items.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))

# Concrete active-skill facts, with current numeric values intentionally omitted.
facts_path=pathlib.Path(__file__).parent/'skill-facts.txt'
if facts_path.exists():
 for row in facts_path.read_text().splitlines():
  n,s1,e1,s2,e2=row.split('|')
  h=next((x for x in heroes if x['name']==n),None)
  if h: h['activeSkills']=[{'name':s1,'effect':e1},{'name':s2,'effect':e2}]
for h in heroes:
 if h['id'] in ['aamon','fredrinn']: h['image']='/assets/'+h['id']+'.png'
(root/'heroes.json').write_text(json.dumps(heroes,ensure_ascii=False,indent=2))
