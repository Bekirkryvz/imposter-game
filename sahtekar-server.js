// Sahtekar — Sunucu
// Node.js HTTP + WebSocket sunucusu

const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;

// ─── Kelime Havuzu ───
const WORDS = {

  yiyecek: [
    { w: 'Sarma', hc: 'yaprak dolma', hk: 'pilav sarma', ho: 'sofra', hz: 'gelenek' },
    { w: 'Künefe', hc: 'peynirli hamur', hk: 'şerbetli sıcak', ho: 'tatlı', hz: 'ısı' },
    { w: 'Kumpir', hc: 'doldurulmuş patates', hk: 'sokak lezzeti', ho: 'atıştırmalık', hz: 'doyum' },
    { w: 'Menemen', hc: 'yumurta domates', hk: 'tava kahvaltı', ho: 'sabah', hz: 'ev' },
    { w: 'İskender', hc: 'yoğurtlu et', hk: 'tereyağlı tabak', ho: 'lokanta', hz: 'şehir' },
    { w: 'Simit', hc: 'susamlı halka', hk: 'sokak satıcısı', ho: 'sabah', hz: 'şehir' },
    { w: 'Lahmacun', hc: 'kıymalı ince hamur', hk: 'limonlu sarma', ho: 'fırın', hz: 'hız' },
    { w: 'Baklava', hc: 'fıstıklı yufka', hk: 'şerbetli katman', ho: 'tatlı', hz: 'incelik' },
    { w: 'Mantı', hc: 'yoğurtlu bohça', hk: 'hamur içi kıyma', ho: 'sofra', hz: 'emek' },
    { w: 'Döner', hc: 'dönen şiş', hk: 'ekmek arası et', ho: 'sokak', hz: 'hız' },
    { w: 'Çiğ Köfte', hc: 'acılı bulgur', hk: 'limonlu dürüm', ho: 'sokak', hz: 'el emeği' },
    { w: 'Kadayıf', hc: 'tel hamur', hk: 'şerbetli tatlı', ho: 'tatlı', hz: 'incelik' },
    { w: 'Kokoreç', hc: 'bağırsak şiş', hk: 'gece sokak', ho: 'cesaret', hz: 'lezzet' },
    { w: 'Ayran', hc: 'yoğurtlu içecek', hk: 'yanında döner', ho: 'serinlik', hz: 'denge' },
    { w: 'Pide', hc: 'tekne hamur', hk: 'fırın çıkışı', ho: 'sofra', hz: 'şekil' },
    { w: 'Börek', hc: 'yufka arası', hk: 'fırın hamur', ho: 'kahvaltı', hz: 'katman' },
    { w: 'Kebap', hc: 'şiş et', hk: 'közde pişirme', ho: 'lokanta', hz: 'ateş' },
    { w: 'Tarhana', hc: 'kurutulmuş çorba', hk: 'kış hazırlığı', ho: 'anne mutfağı', hz: 'zaman' },
    { w: 'Su Böreği', hc: 'ıslak yufka', hk: 'haşlama hamur', ho: 'emek', hz: 'sabır' },
    { w: 'Gözleme', hc: 'saç üstü hamur', hk: 'el açması', ho: 'köy', hz: 'sadelik' },
    { w: 'Lokma', hc: 'şerbetli top', hk: 'hayır tatlısı', ho: 'bereket', hz: 'paylaşım' },
    { w: 'Pilav', hc: 'tereyağlı pirinç', hk: 'sofra tamamlayıcı', ho: 'yan yemek', hz: 'doyum' },
    { w: 'Çorba', hc: 'sıcak sıvı yemek', hk: 'başlangıç tabağı', ho: 'iyileşme', hz: 'sıcaklık' },
    { w: 'Muhallebi', hc: 'sütlü beyaz tatlı', hk: 'soğuk tatlı', ho: 'hafiflik', hz: 'serinlik' },
    { w: 'Tarator', hc: 'sarımsaklı yoğurt', hk: 'cevizli sos', ho: 'meze', hz: 'aroma' },
    { w: 'Kahve', hc: 'sabah fincanı', hk: 'türk geleneği', ho: 'sosyalleşme', hz: 'enerji' },
    { w: 'Çay', hc: 'demlik ısısı', hk: 'misafir ritüeli', ho: 'günlük rutin', hz: 'sıcaklık' },
    { w: 'Dondurma', hc: 'yaz serinliği', hk: 'çocuk sevinci', ho: 'mevsimsel tüketim', hz: 'mutluluk' },
    { w: 'Pizza', hc: 'fırın sofrası', hk: 'arkadaş buluşması', ho: 'sosyal yemek', hz: 'paylaşım' },
    { w: 'Burger', hc: 'hızlı öğün', hk: 'ekmek arası', ho: 'şehir hayatı', hz: 'pratiklik' },
    { w: 'Sushi', hc: 'japon sunumu', hk: 'ham deniz ürünü', ho: 'uzak doğu kültürü', hz: 'hassasiyet' },
    { w: 'Makarna', hc: 'italyan sofrası', hk: 'soslu karbonhidrat', ho: 'avrupa mutfağı', hz: 'doyum' },
    { w: 'Çikolata', hc: 'hediye kutusu', hk: 'kakao işlemi', ho: 'duygusal tüketim', hz: 'zevk' },
    { w: 'Bal', hc: 'arı kovanı', hk: 'doğal tatlandırıcı', ho: 'doğa hediyesi', hz: 'bereket' },
    { w: 'Peynir', hc: 'süt olgunlaşması', hk: 'kahvaltı sofrası', ho: 'fermente ürün', hz: 'zaman' },
    { w: 'Zeytin', hc: 'akdeniz sofrası', hk: 'yağ kaynağı', ho: 'tarihsel meyve', hz: 'barış' },
    { w: 'Limon', hc: 'ekşi sıkma', hk: 'mutfak tamamlayıcısı', ho: 'asitli meyve', hz: 'canlılık' },
    { w: 'Soğan', hc: 'göz yaşartıcı', hk: 'yemek tabanı', ho: 'mutfak zorunluluğu', hz: 'katman' },
    { w: 'Tereyağı', hc: 'ekmek üstü', hk: 'pişirme yağı', ho: 'süt dönüşümü', hz: 'zenginlik' },
    { w: 'Yumurta', hc: 'kahvaltı klasiği', hk: 'protein kaynağı', ho: 'evrensel malzeme', hz: 'başlangıç' },
    { w: 'Ekmek', hc: 'sofra vazgeçilmezi', hk: 'un ve su', ho: 'temel besin', hz: 'yaşam' },
    { w: 'Domates', hc: 'salata kırmızısı', hk: 'sos tabanı', ho: 'mutfak rengi', hz: 'taze' },
    { w: 'Elma', hc: 'günde bir', hk: 'çıtır meyve', ho: 'mevsim meyvesi', hz: 'sağlık' },
    { w: 'Muz', hc: 'sarı soyma', hk: 'enerji atıştırmalığı', ho: 'tropikal meyve', hz: 'enerji' },
  ],

  hayvan: [
    { w: 'Zürafa', hc: 'uzun boyun', hk: 'ağaç tepesi', ho: 'afrika ovası', hz: 'yükseklik' },
    { w: 'Bukalemun', hc: 'renk değişimi', hk: 'çevre uyumu', ho: 'gizlenme', hz: 'değişim' },
    { w: 'Baykuş', hc: 'gece avcısı', hk: 'büyük göz', ho: 'sessiz uçuş', hz: 'karanlık' },
    { w: 'Koala', hc: 'ağaç kucağı', hk: 'avustralya uyuklaması', ho: 'tembel görünüş', hz: 'yumuşaklık' },
    { w: 'Denizatı', hc: 'dik yüzüş', hk: 'at şekli', ho: 'yavaş deniz', hz: 'nadir' },
    { w: 'Flamingo', hc: 'tek ayak', hk: 'pembe duruş', ho: 'göl kıyısı', hz: 'zarafet' },
    { w: 'Platipus', hc: 'ördek gagası', hk: 'tuhaf melez', ho: 'avustralya', hz: 'karışım' },
    { w: 'Ahtapot', hc: 'sekiz kol', hk: 'mürekkep savunma', ho: 'zekalı deniz', hz: 'esneklik' },
    { w: 'Penguen', hc: 'siyah beyaz', hk: 'buz yürüyüşü', ho: 'yüzücü kuş', hz: 'takım' },
    { w: 'Jaguar', hc: 'benekli sürat', hk: 'amazon avcısı', ho: 'orman gölgesi', hz: 'hız' },
    { w: 'Kaplumbağa', hc: 'kabuk ev', hk: 'yavaş adım', ho: 'uzun ömür', hz: 'sabır' },
    { w: 'Kelebek', hc: 'tırtıl dönüşümü', hk: 'çiçek ziyareti', ho: 'kısa ömür', hz: 'dönüşüm' },
    { w: 'Akbaba', hc: 'leş kokusu', hk: 'kel baş', ho: 'doğa temizleyici', hz: 'son' },
    { w: 'Salyangoz', hc: 'kabuklu sürünüş', hk: 'iz bırakan yavaşlık', ho: 'bahçe sakinliği', hz: 'yavaşlık' },
    { w: 'Rakun', hc: 'maskeli yüz', hk: 'gece çöpçüsü', ho: 'şehir hayatı', hz: 'maske' },
    { w: 'Kutup Ayısı', hc: 'beyaz kürk', hk: 'buz avcısı', ho: 'kutup hayatta kalma', hz: 'soğuk' },
    { w: 'Suaygırı', hc: 'devasa ağız', hk: 'nehir devesi', ho: 'su altı sakinliği', hz: 'büyüklük' },
    { w: 'Karınca', hc: 'taşıma şampiyonu', hk: 'koloni hayatı', ho: 'organize topluluk', hz: 'disiplin' },
    { w: 'Arı', hc: 'çiçek ziyareti', hk: 'kovan düzeni', ho: 'doğa döngüsü', hz: 'üretim' },
    { w: 'Kurt', hc: 'ay uluması', hk: 'sürü liderliği', ho: 'vahşi içgüdü', hz: 'özgürlük' },
    { w: 'Aslan', hc: 'savana yöneticisi', hk: 'gururlu yürüyüş', ho: 'liderlik sembolü', hz: 'güç' },
    { w: 'Fil', hc: 'hafıza sembolü', hk: 'dev yürüyüş', ho: 'antik güç', hz: 'büyüklük' },
    { w: 'Yunus', hc: 'dalga sörfçüsü', hk: 'insan dostu', ho: 'akıllı denizci', hz: 'neşe' },
    { w: 'Ördek', hc: 'göl yüzüşü', hk: 'su ve kara', ho: 'sessiz gölet', hz: 'huzur' },
    { w: 'Papağan', hc: 'söylenen tekrar', hk: 'renkli tüy', ho: 'tropikal mimikri', hz: 'yansıma' },
    { w: 'Panda', hc: 'bambu bağımlısı', hk: 'nesil endişesi', ho: 'koruma sembolü', hz: 'nadir' },
    { w: 'Kaplan', hc: 'çizgili pusu', hk: 'orman sessizliği', ho: 'asya yırtıcısı', hz: 'tehlike' },
    { w: 'Gergedan', hc: 'burun silahı', hk: 'zırhlı deri', ho: 'nesli tehlikede', hz: 'sertlik' },
    { w: 'Tavuskuşu', hc: 'açılan kuyruk', hk: 'görsel gösteri', ho: 'kibir sembolü', hz: 'güzellik' },
    { w: 'Yılan', hc: 'sessiz sürünüş', hk: 'dil titreyişi', ho: 'evrensel korku', hz: 'tehlike' },
    { w: 'Maymun', hc: 'ağaç atlaması', hk: 'insan benzeri', ho: 'zeka gösterisi', hz: 'evrim' },
    { w: 'Timsah', hc: 'nehir pusuda', hk: 'zırhlı sürüngen', ho: 'antik avcı', hz: 'sabır' },
  ],

  meslek: [
    { w: 'Avukat', hc: 'dava savunma', hk: 'mahkeme sözü', ho: 'adalet sistemi', hz: 'adalet' },
    { w: 'Cerrah', hc: 'ameliyat masası', hk: 'keskin müdahale', ho: 'hayat kurtarma', hz: 'hassasiyet' },
    { w: 'Mimar', hc: 'bina tasarımı', hk: 'çizim masası', ho: 'şehir şekillendirme', hz: 'yaratıcılık' },
    { w: 'Pilot', hc: 'kokpit kontrolü', hk: 'bulut üstü', ho: 'ulaşım yönetimi', hz: 'gökyüzü' },
    { w: 'Astronot', hc: 'uzay kıyafeti', hk: 'yerçekimsiz ortam', ho: 'sınır ötesi keşif', hz: 'sonsuzluk' },
    { w: 'Dedektif', hc: 'ipucu takibi', hk: 'gizli gözlem', ho: 'gerçeği bulma', hz: 'gizem' },
    { w: 'Arkeolog', hc: 'toprak kazısı', hk: 'tarihi nesne', ho: 'geçmişi aydınlatma', hz: 'zaman' },
    { w: 'Psikolog', hc: 'zihin analizi', hk: 'dinleme odası', ho: 'iç dünya', hz: 'anlayış' },
    { w: 'Diplomat', hc: 'ülke temsili', hk: 'müzakere masası', ho: 'barış çabası', hz: 'denge' },
    { w: 'Gazeteci', hc: 'haber peşinde', hk: 'mikrofon sorgusu', ho: 'bilgi akışı', hz: 'gerçek' },
    { w: 'Veteriner', hc: 'hayvan muayene', hk: 'pençe bakımı', ho: 'sessiz hasta', hz: 'şefkat' },
    { w: 'Kuyumcu', hc: 'altın işleme', hk: 'kıymetli taş', ho: 'değer biçme', hz: 'parlaklık' },
    { w: 'Bahçıvan', hc: 'toprak elleri', hk: 'bitki büyütme', ho: 'doğa bakımı', hz: 'sabır' },
    { w: 'Aşçı', hc: 'ocak başı', hk: 'malzeme dönüşümü', ho: 'damak zevki', hz: 'yaratıcılık' },
    { w: 'Ressam', hc: 'tuval fırçası', hk: 'renk katmanı', ho: 'duygu aktarımı', hz: 'ifade' },
    { w: 'Heykeltıraş', hc: 'taş yontma', hk: 'üç boyutlu form', ho: 'madde dönüşümü', hz: 'şekil' },
    { w: 'Hakem', hc: 'düdük kararı', hk: 'kural uygulama', ho: 'tarafsız göz', hz: 'adalet' },
    { w: 'Kaptan', hc: 'dümen kontrolü', hk: 'deniz yönetimi', ho: 'sorumluluk taşıma', hz: 'liderlik' },
    { w: 'Madenci', hc: 'yer altı çalışma', hk: 'maden ocağı', ho: 'karanlık emek', hz: 'derinlik' },
    { w: 'Yangın Söndürücü', hc: 'alev müdahale', hk: 'kırmızı araç', ho: 'acil yardım', hz: 'cesaret' },
    { w: 'Öğretmen', hc: 'tahta ders', hk: 'nesil yetiştirme', ho: 'bilgi aktarımı', hz: 'gelecek' },
    { w: 'Doktor', hc: 'muayene odası', hk: 'teşhis koyma', ho: 'iyileşme süreci', hz: 'umut' },
    { w: 'Polis', hc: 'devriye görevi', hk: 'düzen sağlama', ho: 'güvenlik', hz: 'otorite' },
  ],

  yer: [
    { w: 'Kütüphane', hc: 'kitap rafları', hk: 'sessiz okuma', ho: 'bilgi mekanı', hz: 'bilgi' },
    { w: 'Stadyum', hc: 'tribün kalabalığı', hk: 'büyük alan', ho: 'toplu heyecan', hz: 'rekabet' },
    { w: 'Lunapark', hc: 'dönme dolap', hk: 'çocuk eğlencesi', ho: 'mevsimlik heyecan', hz: 'neşe' },
    { w: 'Hamam', hc: 'buhar sıcaklığı', hk: 'kese köpük', ho: 'geleneksel arınma', hz: 'temizlik' },
    { w: 'Liman', hc: 'gemi yanaşma', hk: 'deniz kapısı', ho: 'ticaret noktası', hz: 'bağlantı' },
    { w: 'Havalimanı', hc: 'uçak pisti', hk: 'vali çantası', ho: 'yolculuk başlangıcı', hz: 'hareket' },
    { w: 'Şato', hc: 'taş kule', hk: 'soylu geçmiş', ho: 'tarihi güç merkezi', hz: 'güç' },
    { w: 'Mağara', hc: 'kaya boşluğu', hk: 'doğal sığınak', ho: 'karanlık keşif', hz: 'derinlik' },
    { w: 'Çarşı', hc: 'dükkan sırası', hk: 'pazarlık kültürü', ho: 'ticari canlılık', hz: 'değişim' },
    { w: 'Baraj', hc: 'su tutma duvarı', hk: 'enerji üretimi', ho: 'doğa müdahalesi', hz: 'kontrol' },
    { w: 'Müze', hc: 'cam vitrin', hk: 'geçmiş sergi', ho: 'kolektif hafıza', hz: 'zaman' },
    { w: 'Hastane', hc: 'steril koridor', hk: 'tedavi süreci', ho: 'hayat kurtarma', hz: 'umut' },
    { w: 'Adliye', hc: 'tога ve tokmak', hk: 'dava dinleme', ho: 'hukuki karar', hz: 'adalet' },
    { w: 'Cami', hc: 'minare ezan', hk: 'ibadet düzeni', ho: 'toplum merkezi', hz: 'inanç' },
    { w: 'Fener', hc: 'dönen ışık', hk: 'deniz yönlendirme', ho: 'tehlike uyarısı', hz: 'yön' },
    { w: 'Köprü', hc: 'iki yakayı bağlama', hk: 'üstünden geçiş', ho: 'engel aşma', hz: 'bağlantı' },
    { w: 'Tünel', hc: 'yer altı geçiş', hk: 'karanlık yol', ho: 'engel delme', hz: 'geçiş' },
    { w: 'Pastane', hc: 'tatlı kokusu', hk: 'vitrin pasta', ho: 'keyif durağı', hz: 'zevk' },
    { w: 'Karakol', hc: 'polis merkezi', hk: 'şikayet noktası', ho: 'güvenlik üssü', hz: 'düzen' },
    { w: 'Yanardağ', hc: 'lav fışkırması', hk: 'yer altı ısısı', ho: 'doğa gücü', hz: 'ateş' },
  ],

  esya: [
    { w: 'Şemsiye', hc: 'yağmur açma', hk: 'elde taşıma', ho: 'hava koruması', hz: 'koruma' },
    { w: 'Pusula', hc: 'manyetik iğne', hk: 'yön bulma', ho: 'kaybolmama', hz: 'yön' },
    { w: 'Teleskop', hc: 'mercek uzaklık', hk: 'gökyüzü gözlemi', ho: 'bilimsel merak', hz: 'keşif' },
    { w: 'Mikroskop', hc: 'küçük büyütme', hk: 'laboratuvar aleti', ho: 'görünmeyeni görme', hz: 'derinlik' },
    { w: 'Stetoskop', hc: 'kalp dinleme', hk: 'doktor boynu', ho: 'tıbbi dinleme', hz: 'ses' },
    { w: 'Dürbün', hc: 'çift tüp', hk: 'uzağı yakınlaştırma', ho: 'gözlem aleti', hz: 'mesafe' },
    { w: 'Termos', hc: 'ısı koruma', hk: 'yolculuk içeceği', ho: 'pratik taşıma', hz: 'sabır' },
    { w: 'Valiz', hc: 'tekerlekli bavul', hk: 'seyahat hazırlığı', ho: 'yolculuk sembolü', hz: 'hareket' },
    { w: 'Mum', hc: 'fitil alevi', hk: 'romantik ışık', ho: 'elektriksiz aydınlık', hz: 'ışık' },
    { w: 'Ayna', hc: 'yansıyan görüntü', hk: 'kendine bakış', ho: 'öz farkındalık', hz: 'gerçek' },
    { w: 'Parfüm', hc: 'koku şişesi', hk: 'çıkış ritüeli', ho: 'kimlik ifadesi', hz: 'iz' },
    { w: 'Yastık', hc: 'baş dayanağı', hk: 'uyku konforu', ho: 'dinlenme', hz: 'yumuşaklık' },
    { w: 'Cüzdan', hc: 'para ve kart', hk: 'günlük taşıma', ho: 'kimlik taşıyıcı', hz: 'değer' },
    { w: 'Cetvel', hc: 'düz çizgi', hk: 'ölçüm aracı', ho: 'hassas çizim', hz: 'düzlük' },
    { w: 'Kumanda', hc: 'uzaktan kontrol', hk: 'kanepe aleti', ho: 'pasif izleme', hz: 'kontrol' },
    { w: 'Kulaklık', hc: 'kulak takma', hk: 'kişisel ses', ho: 'izole dinleme', hz: 'ses' },
    { w: 'Güneş Gözlüğü', hc: 'renkli cam', hk: 'göz koruması', ho: 'yaz aksesuarı', hz: 'ışık' },
    { w: 'Çanta', hc: 'omuz taşıma', hk: 'günlük eşya', ho: 'hazırlıklı olma', hz: 'taşıma' },
    { w: 'Terazi', hc: 'kefeli denge', hk: 'ağırlık ölçümü', ho: 'tarafsızlık', hz: 'adalet' },
    { w: 'Mektup', hc: 'el yazısı kağıt', hk: 'posta kutusu', ho: 'duygusal iletişim', hz: 'bağ' },
    { w: 'Saat', hc: 'akrep yelkovan', hk: 'günlük ritim', ho: 'değerli aksesuar', hz: 'geçicilik' },
    { w: 'Baret', hc: 'baş koruması', hk: 'iş sahası', ho: 'güvenlik önlemi', hz: 'önlem' },
    { w: 'Hesap Makinesi', hc: 'tuş hesap', hk: 'hızlı sonuç', ho: 'matematiksel araç', hz: 'kesinlik' },
  ],

  spor: [
    { w: 'Okçuluk', hc: 'yay gerdirme', hk: 'nişan alma', ho: 'odak sporu', hz: 'hedef' },
    { w: 'Eskrim', hc: 'kılıç duellosu', hk: 'maske ve kıyafet', ho: 'tarihi dövüş', hz: 'keskinlik' },
    { w: 'Kürek', hc: 'su üstü çekiş', hk: 'tekne ritmi', ho: 'takım uyumu', hz: 'güç' },
    { w: 'Triatlon', hc: 'üç spor birden', hk: 'dayanıklılık sınavı', ho: 'sınır zorlama', hz: 'azim' },
    { w: 'Ragbi', hc: 'oval top taşıma', hk: 'sert çarpışma', ho: 'güç ve strateji', hz: 'güç' },
    { w: 'Kano', hc: 'dar tekne kürek', hk: 'nehir akışı', ho: 'doğa sporu', hz: 'akış' },
    { w: 'Halter', hc: 'ağır demir kaldırma', hk: 'güç sınırı', ho: 'vücut gücü', hz: 'ağırlık' },
    { w: 'Jimnastik', hc: 'takla dönme', hk: 'esneklik gösterisi', ho: 'vücut kontrolü', hz: 'denge' },
    { w: 'Judo', hc: 'rakibi yere indirme', hk: 'japon kıyafet', ho: 'denge bozma', hz: 'denge' },
    { w: 'Karate', hc: 'el kol vuruşu', hk: 'renkli kemer', ho: 'disiplin sanatı', hz: 'disiplin' },
    { w: 'Dart', hc: 'küçük ok atma', hk: 'tahta hedef', ho: 'barda oynama', hz: 'hedef' },
    { w: 'Bilardo', hc: 'yeşil masa', hk: 'sopa ve top', ho: 'hesaplı vuruş', hz: 'hassasiyet' },
    { w: 'Satranç', hc: 'taşlı strateji', hk: 'hamle hesabı', ho: 'zihin sporu', hz: 'strateji' },
    { w: 'Golf', hc: 'çimde delik', hk: 'sopa ve top', ho: 'sabır sporu', hz: 'hassasiyet' },
    { w: 'Kayak', hc: 'kar üstü kayma', hk: 'dağ iniş', ho: 'kış eğlencesi', hz: 'hız' },
    { w: 'Yüzme', hc: 'su içi ilerleme', hk: 'nefes tekniği', ho: 'su ile uyum', hz: 'akış' },
    { w: 'Tenis', hc: 'raket karşılıklı', hk: 'kort zemini', ho: 'teknik beceri', hz: 'hız' },
    { w: 'Voleybol', hc: 'ağ üstü pas', hk: 'altı kişi takım', ho: 'smaç ve blok', hz: 'hava' },
    { w: 'Basketbol', hc: 'pota atışı', hk: 'yüksek sıçrama', ho: 'hız ve strateji', hz: 'yükseklik' },
    { w: 'Futbol', hc: 'kaleye vuruş', hk: 'on bir kişi', ho: 'küresel tutku', hz: 'birlik' },
  ],

  doga: [
    { w: 'Şelale', hc: 'düşen nehir', hk: 'köpüklü ses', ho: 'doğa seyri', hz: 'düşüş' },
    { w: 'Buzul', hc: 'yüzyıllık buz', hk: 'yavaş hareket', ho: 'iklim göstergesi', hz: 'zaman' },
    { w: 'Mercan Resifi', hc: 'sualtı rengi', hk: 'tropikal yaşam', ho: 'deniz ekosistemi', hz: 'çeşitlilik' },
    { w: 'Savanah', hc: 'geniş ot ovası', hk: 'yırtıcı av', ho: 'afrika ekosistemi', hz: 'özgürlük' },
    { w: 'Tundra', hc: 'donmuş düzlük', hk: 'ağaçsız soğuk', ho: 'kutup sınırı', hz: 'soğuk' },
    { w: 'Gökkuşağı', hc: 'yağmur rengi', hk: 'güneş kırılması', ho: 'gökyüzü olayı', hz: 'spektrum' },
    { w: 'Kuzey Işıkları', hc: 'gece renkli perde', hk: 'kutup gökyüzü', ho: 'manyetik gösteri', hz: 'ışık' },
    { w: 'Tsunami', hc: 'dev dalga', hk: 'deprem sonrası', ho: 'yıkıcı doğa', hz: 'güç' },
    { w: 'Kasırga', hc: 'dönen fırtına', hk: 'deniz kaynağı', ho: 'yıkıcı rüzgar', hz: 'kaos' },
    { w: 'Çöl', hc: 'kum ve susuzluk', hk: 'sıcak boşluk', ho: 'ekstrem ortam', hz: 'yalnızlık' },
    { w: 'Orman', hc: 'sık ağaç', hk: 'vahşi yaşam', ho: 'akciğer oksijen', hz: 'yaşam' },
    { w: 'Yanardağ', hc: 'lav fışkırması', hk: 'yer altı ısısı', ho: 'doğa gücü', hz: 'ateş' },
    { w: 'Deprem', hc: 'yer sarsıntısı', hk: 'bina yıkımı', ho: 'doğa gücü', hz: 'korku' },
    { w: 'Meteor', hc: 'gökyüzü çizgisi', hk: 'uzay taşı', ho: 'kozmik olay', hz: 'düşüş' },
    { w: 'Vadi', hc: 'dağ arası çukur', hk: 'nehir yatağı', ho: 'coğrafi şekil', hz: 'derinlik' },
    { w: 'Mağara', hc: 'kaya boşluğu', hk: 'karanlık sığınak', ho: 'doğal oluşum', hz: 'gizem' },
    { w: 'Okyanus', hc: 'sonsuz tuzlu su', hk: 'derin bilinmez', ho: 'dünya kaplama', hz: 'sonsuzluk' },
    { w: 'Dağ', hc: 'sarp zirve', hk: 'yüksek iklim', ho: 'coğrafi engel', hz: 'yükseklik' },
    { w: 'Göl', hc: 'kapalı durgun su', hk: 'çevre kara', ho: 'huzur noktası', hz: 'durgunluk' },
    { w: 'Erozyon', hc: 'toprak aşınması', hk: 'rüzgar ve yağmur', ho: 'yavaş değişim', hz: 'zaman' },
  ],

  teknoloji: [
    { w: 'Yapay Zeka', hc: 'makine öğrenmesi', hk: 'insan taklidi', ho: 'dijital evrim', hz: 'gelecek' },
    { w: 'Drone', hc: 'pervane uçuşu', hk: 'uzaktan kontrol', ho: 'havadan bakış', hz: 'kontrol' },
    { w: '3D Yazıcı', hc: 'katman katman üretim', hk: 'dijitalden fiziksel', ho: 'üretim devrimi', hz: 'yaratıcılık' },
    { w: 'Sanal Gerçeklik', hc: 'gözlük dünya', hk: 'dijital ortam', ho: 'gerçeklik yanılsaması', hz: 'kaçış' },
    { w: 'Blockchain', hc: 'değiştirilemez zincir', hk: 'şifreli kayıt', ho: 'güven sistemi', hz: 'güven' },
    { w: 'Kripto Para', hc: 'dijital madeni', hk: 'merkez dışı para', ho: 'finansal devrim', hz: 'değer' },
    { w: 'Bulut Bilişim', hc: 'internet deposu', hk: 'uzak sunucu', ho: 'dijital altyapı', hz: 'erişim' },
    { w: 'Siber Güvenlik', hc: 'dijital savunma', hk: 'hacker engeli', ho: 'veri koruma', hz: 'koruma' },
    { w: 'Hologram', hc: 'havada görüntü', hk: 'lazer yansıması', ho: 'görsel yanılsama', hz: 'ışık' },
    { w: 'Nanoteknoloji', hc: 'atom ölçeği', hk: 'görünmez üretim', ho: 'mikro müdahale', hz: 'küçüklük' },
    { w: 'Kuantum Bilgisayar', hc: 'süper hız hesap', hk: 'fizik ötesi', ho: 'hesaplama devrimi', hz: 'hız' },
    { w: 'Biyometri', hc: 'parmak izi kapı', hk: 'beden tanıma', ho: 'kimlik doğrulama', hz: 'kimlik' },
    { w: 'Akıllı Ev', hc: 'sesle kontrol', hk: 'otomatik yaşam', ho: 'konfor teknolojisi', hz: 'konfor' },
    { w: 'Fiber Optik', hc: 'cam kablo ışık', hk: 'hız alt yapısı', ho: 'iletişim omurgası', hz: 'hız' },
    { w: 'Lazer', hc: 'tek renk ışın', hk: 'keskin enerji', ho: 'hassas teknoloji', hz: 'keskinlik' },
    { w: 'Uydu', hc: 'yörüngede dönen', hk: 'uzay hizmeti', ho: 'küresel bağlantı', hz: 'bağlantı' },
    { w: 'Artırılmış Gerçeklik', hc: 'ekrana eklenen dünya', hk: 'gerçeğe katman', ho: 'dijital üst yazı', hz: 'katman' },
    { w: 'Mikroçip', hc: 'küçük devre', hk: 'elektronik beyin', ho: 'teknoloji temeli', hz: 'güç' },
    { w: 'Bluetooth', hc: 'kablosuz yakın bağ', hk: 'cihaz eşleşme', ho: 'kısa mesafe iletişim', hz: 'bağlantı' },
    { w: 'Wi-Fi', hc: 'kablosuz internet', hk: 'router dalgası', ho: 'dijital erişim', hz: 'özgürlük' },
  ],

  sanat: [
    { w: 'Ebru', hc: 'su yüzey boya', hk: 'türk kağıt sanatı', ho: 'geleneksel ifade', hz: 'akış' },
    { w: 'Hat', hc: 'kaligrafi yazı', hk: 'arap harfi sanatı', ho: 'islami ifade', hz: 'anlam' },
    { w: 'Origami', hc: 'kağıt katlama', hk: 'japon şekli', ho: 'sabır sanatı', hz: 'dönüşüm' },
    { w: 'Graffiti', hc: 'duvar boyası', hk: 'sokak ifadesi', ho: 'kentsel sanat', hz: 'isyan' },
    { w: 'Animasyon', hc: 'çizgi hareketlendirme', hk: 'kare kare film', ho: 'dijital anlatı', hz: 'hareket' },
    { w: 'Opera', hc: 'şarkıyla konuşma', hk: 'büyük ses sahne', ho: 'dramatik müzik', hz: 'duygu' },
    { w: 'Bale', hc: 'parmak ucu dans', hk: 'zarif sahne', ho: 'disiplinli hareket', hz: 'denge' },
    { w: 'Caz', hc: 'doğaçlama ritim', hk: 'amerikan sokaği', ho: 'özgür müzik', hz: 'özgürlük' },
    { w: 'Flamenco', hc: 'ayak vurma dans', hk: 'ispanyol ateşi', ho: 'tutkulu gösteri', hz: 'tutku' },
    { w: 'Kabuki', hc: 'boyalı yüz sahne', hk: 'japon maskesi', ho: 'geleneksel tiyatro', hz: 'maske' },
    { w: 'Heykel', hc: 'taş yontma', hk: 'üç boyutlu form', ho: 'madde sanatı', hz: 'şekil' },
    { w: 'Fotoğraf', hc: 'an dondurma', hk: 'ışık ve objektif', ho: 'görsel bellek', hz: 'zaman' },
    { w: 'Karikatür', hc: 'abartılı çizgi', hk: 'mizah eleştiri', ho: 'toplumsal ayna', hz: 'mizah' },
    { w: 'Sirk', hc: 'akrobat çadır', hk: 'palyaço gösteri', ho: 'canlı eğlence', hz: 'heyecan' },
    { w: 'Belgesel', hc: 'gerçek kamera', hk: 'bilgilendirici film', ho: 'toplumsal farkındalık', hz: 'gerçek' },
    { w: 'Resim', hc: 'tuval ve boya', hk: 'renk katmanı', ho: 'duygu aktarımı', hz: 'ifade' },
    { w: 'Tiyatro', hc: 'sahne ve perde', hk: 'canlı oyunculuk', ho: 'toplumsal yansıma', hz: 'oyun' },
    { w: 'Sinema', hc: 'büyük perde', hk: 'hareketli görüntü', ho: 'kültürel etki', hz: 'kaçış' },
    { w: 'Mimari', hc: 'bina tasarım sanatı', hk: 'estetik yapı', ho: 'şehir kimliği', hz: 'kalıcılık' },
    { w: 'Tezhip', hc: 'altın süsleme', hk: 'el yazması bezeme', ho: 'islami estetik', hz: 'değer' },
  ],

  tarih: [
    { w: 'Fetih', hc: 'şehir ele geçirme', hk: 'ordu zafer', ho: 'toprak genişleme', hz: 'güç' },
    { w: 'Rönesans', hc: 'sanat yeniden doğuş', hk: 'italya uyanışı', ho: 'kültürel dönüşüm', hz: 'yenilik' },
    { w: 'İpek Yolu', hc: 'çin avrupa ticaret', hk: 'kervan güzergahı', ho: 'kültür köprüsü', hz: 'bağlantı' },
    { w: 'Haçlı Seferi', hc: 'dini savaş', hk: 'avrupa doğu çatışması', ho: 'ideolojik mücadele', hz: 'inanç' },
    { w: 'Sanayi Devrimi', hc: 'fabrika ve buhar', hk: 'üretim dönüşümü', ho: 'toplumsal kırılma', hz: 'değişim' },
    { w: 'Gladyatör', hc: 'arena dövüşü', hk: 'roma eğlencesi', ho: 'güç gösterisi', hz: 'hayatta kalma' },
    { w: 'Matbaa', hc: 'baskı makinesi', hk: 'bilgi yayılımı', ho: 'iletişim devrimi', hz: 'bilgi' },
    { w: 'Barut', hc: 'patlayıcı toz', hk: 'silah dönüşümü', ho: 'savaş değişimi', hz: 'güç' },
    { w: 'Soğuk Savaş', hc: 'iki süper güç', hk: 'nükleer gerilim', ho: 'ideolojik çatışma', hz: 'korku' },
    { w: 'Sömürgecilik', hc: 'toprak işgali', hk: 'güçlü zayıfı ezer', ho: 'tarihsel sömürü', hz: 'güç' },
    { w: 'Arkeoloji', hc: 'kazı ve buluntu', hk: 'tarihi nesne', ho: 'geçmişe ulaşma', hz: 'zaman' },
    { w: 'Hiyeroglif', hc: 'mısır sembol yazısı', hk: 'resimli alfabe', ho: 'eski iletişim', hz: 'sembol' },
    { w: 'Ferman', hc: 'padişah emri', hk: 'resmi belge', ho: 'tarihi yönetim', hz: 'otorite' },
    { w: 'Devrim', hc: 'sistemi yıkma', hk: 'radikal değişim', ho: 'toplumsal kırılma', hz: 'değişim' },
    { w: 'İmparatorluk', hc: 'geniş toprak yönetim', hk: 'çok halklı güç', ho: 'tarihi yapı', hz: 'büyüklük' },
    { w: 'Uzay Yarışı', hc: 'iki güç rekabeti', hk: 'roket teknolojisi', ho: 'ideolojik üstünlük', hz: 'rekabet' },
    { w: 'Pusula', hc: 'yön iğnesi', hk: 'denizci rehberi', ho: 'keşif aracı', hz: 'yön' },
    { w: 'Kılıç', hc: 'metal kesici silah', hk: 'savaşçı sembolü', ho: 'güç göstergesi', hz: 'güç' },
    { w: 'Kale', hc: 'sur ve burç', hk: 'savunma yapısı', ho: 'güç merkezi', hz: 'savunma' },
    { w: 'Göç', hc: 'toplu yer değiştirme', hk: 'yeni yurt arayışı', ho: 'toplumsal hareket', hz: 'umut' },
  ],

  ulkeler: [
    { w: 'Japonya', hc: 'kiraz çiçeği', hk: 'doğu teknolojisi', ho: 'ada kültürü', hz: 'denge' },
    { w: 'Brezilya', hc: 'karnaval dansı', hk: 'tropikal orman', ho: 'canlı kültür', hz: 'tutku' },
    { w: 'Norveç', hc: 'fiyort manzarası', hk: 'kuzey soğuğu', ho: 'refah ülkesi', hz: 'huzur' },
    { w: 'Mısır', hc: 'piramit çölü', hk: 'firavun mirası', ho: 'antik uygarlık', hz: 'zaman' },
    { w: 'Hindistan', hc: 'baharat kokusu', hk: 'renkli kalabalık', ho: 'kadim uygarlık', hz: 'çeşitlilik' },
    { w: 'Arjantin', hc: 'tango dansı', hk: 'güney Amerika tutkusu', ho: 'latin kültürü', hz: 'ateş' },
    { w: 'İzlanda', hc: 'yanardağ buz', hk: 'kuzey ışıkları', ho: 'uç doğa', hz: 'soğuk' },
    { w: 'Fas', hc: 'çarşı labirent', hk: 'çöl ve medine', ho: 'kuzey Afrika', hz: 'renk' },
    { w: 'Peru', hc: 'inka harabesi', hk: 'and dağları', ho: 'antik uygarlık', hz: 'yükseklik' },
    { w: 'Yeni Zelanda', hc: 'maori kültürü', hk: 'yeşil ada', ho: 'okyanusya doğası', hz: 'uzaklık' },
    { w: 'Etiyopya', hc: 'kahve anavatanı', hk: 'antik krallık', ho: 'afrika mirası', hz: 'köken' },
    { w: 'İsveç', hc: 'nobel ödülü', hk: 'iskandinav düzeni', ho: 'refah modeli', hz: 'adalet' },
    { w: 'Küba', hc: 'puro ve salsa', hk: 'karayip adası', ho: 'eski amerikan araba', hz: 'direniş' },
    { w: 'İran', hc: 'pers halısı', hk: 'antik mimari', ho: 'orta doğu mirası', hz: 'derinlik' },
    { w: 'Yunanistan', hc: 'antik felsefe', hk: 'olimpiyat mirası', ho: 'batı medeniyeti', hz: 'köken' },
    { w: 'Meksika', hc: 'aztek mirası', hk: 'canlı renk', ho: 'latin Amerika', hz: 'ölüm ve yaşam' },
    { w: 'Portekiz', hc: 'keşifler çağı', hk: 'okyanus açılımı', ho: 'denizci miras', hz: 'cesaret' },
    { w: 'Endonezya', hc: 'bin ada ülkesi', hk: 'tropikal çeşitlilik', ho: 'güneydoğu asya', hz: 'çokluk' },
    { w: 'Kanada', hc: 'akçaağaç yaprağı', hk: 'geniş vahşi doğa', ho: 'kuzey yaşamı', hz: 'özgürlük' },
    { w: 'Avustralya', hc: 'kanguru çölü', hk: 'uzak kıta', ho: 'vahşi doğa', hz: 'uzaklık' },
  ],

  film_dizi: [
    { w: 'Aksiyon Filmi', hc: 'patlama ve kovalama', hk: 'hızlı tempo', ho: 'adrenalin eğlencesi', hz: 'hız' },
    { w: 'Korku Filmi', hc: 'karanlık ve canavar', hk: 'ürperti duygusu', ho: 'psikolojik baskı', hz: 'karanlık' },
    { w: 'Romantik Komedi', hc: 'aşk ve gülme', hk: 'mutlu son', ho: 'duygusal kaçış', hz: 'umut' },
    { w: 'Belgesel', hc: 'gerçek kamera', hk: 'bilgilendirici anlatı', ho: 'toplumsal farkındalık', hz: 'gerçek' },
    { w: 'Animasyon', hc: 'çizgi karakter', hk: 'hayal dünyası', ho: 'her yaşa hitap', hz: 'hayal' },
    { w: 'Bilim Kurgu', hc: 'uzay ve robot', hk: 'gelecek tahayyülü', ho: 'teknolojik merak', hz: 'gelecek' },
    { w: 'Polisiye Dizi', hc: 'dedektif ve suç', hk: 'bölüm bölüm gizem', ho: 'zihinsel merak', hz: 'gizem' },
    { w: 'Fantezi', hc: 'büyü ve ejderha', hk: 'başka dünya', ho: 'hayal gücü sınırı', hz: 'kaçış' },
    { w: 'Dram', hc: 'derin duygu', hk: 'insan çatışması', ho: 'gerçekçi anlatı', hz: 'duygu' },
    { w: 'Gerilim', hc: 'sürekli gerginlik', hk: 'sürpriz ve tehlike', ho: 'psikolojik baskı', hz: 'gerilim' },
    { w: 'Müzikal', hc: 'şarkıyla diyalog', hk: 'dans ve sahne', ho: 'duygusal anlatım', hz: 'müzik' },
    { w: 'Biyografi', hc: 'gerçek hayat hikayesi', hk: 'tarihi kişi', ho: 'ilham verici anlatı', hz: 'gerçek' },
    { w: 'Western', hc: 'kovboy ve çöl', hk: 'vahşi batı', ho: 'amerikan efsanesi', hz: 'özgürlük' },
    { w: 'Süper Kahraman', hc: 'özel güç kostüm', hk: 'iyilik mücadelesi', ho: 'modern mitoloji', hz: 'güç' },
    { w: 'Anime', hc: 'japon çizim stili', hk: 'abartılı ifade', ho: 'doğu anlatısı', hz: 'kültür' },
    { w: 'Mini Dizi', hc: 'kısa format', hk: 'yoğun anlatı', ho: 'sınırlı bölüm', hz: 'yoğunluk' },
    { w: 'Tarihi Dizi', hc: 'kostümlü dönem', hk: 'geçmiş sahne', ho: 'tarihi yeniden canlandırma', hz: 'zaman' },
    { w: 'Kara Komedi', hc: 'ölümle gülme', hk: 'karanlık mizah', ho: 'rahatsız edici güldürü', hz: 'ironi' },
    { w: 'Macera', hc: 'keşif yolculuğu', hk: 'tehlikeli görev', ho: 'sınır aşma', hz: 'keşif' },
    { w: 'Savaş Filmi', hc: 'cephe ve asker', hk: 'çatışma sahnesi', ho: 'insanlık ve yıkım', hz: 'çatışma' },
  ],

  muzik: [
    { w: 'Gitar', hc: 'altı tel parmak', hk: 'müzisyen simgesi', ho: 'yaygın çalgı', hz: 'ifade' },
    { w: 'Piyano', hc: 'tuş ve çekiç', hk: 'klasik müzik tabanı', ho: 'evrensel çalgı', hz: 'harmoni' },
    { w: 'Keman', hc: 'yay ve tel', hk: 'klasik orkestra', ho: 'duygusal ses', hz: 'duygu' },
    { w: 'Davul', hc: 'tokmak ritim', hk: 'grubun kalp atışı', ho: 'ritim temeli', hz: 'ritim' },
    { w: 'Bağlama', hc: 'uzun sap türk teli', hk: 'halk müziği kalbi', ho: 'anadolu ruhu', hz: 'gelenek' },
    { w: 'Ney', hc: 'kamış üfleme', hk: 'tasavvuf sesi', ho: 'mistik ifade', hz: 'ruh' },
    { w: 'Ud', hc: 'armut gövde tel', hk: 'doğu müziği', ho: 'tarihi melodi', hz: 'köken' },
    { w: 'Akordeon', hc: 'körük tuş', hk: 'dans müziği', ho: 'avrupa halk', hz: 'neşe' },
    { w: 'Trompet', hc: 'parlak metal üfleme', hk: 'askeri boru', ho: 'liderlik sesi', hz: 'güç' },
    { w: 'Saksofon', hc: 'caz metal kamış', hk: 'gece kulübü sesi', ho: 'duygu çalgısı', hz: 'tutku' },
    { w: 'Bateri', hc: 'çok parçalı vurma', hk: 'grup ritim seti', ho: 'enerji çıkışı', hz: 'güç' },
    { w: 'Flüt', hc: 'yan tutup üfleme', hk: 'ince tiz ses', ho: 'hafif klasik', hz: 'incelik' },
    { w: 'Arpa', hc: 'üçgen çok tel', hk: 'zarif salon çalgısı', ho: 'asil ses', hz: 'zarafet' },
    { w: 'Sitar', hc: 'uzun hint teli', hk: 'doğu melodisi', ho: 'mistik ses', hz: 'meditasyon' },
    { w: 'Gayda', hc: 'hava kesesi boru', hk: 'iskoç dağı sesi', ho: 'halk ritüeli', hz: 'rüzgar' },
    { w: 'Tuba', hc: 'dev boru sesi', hk: 'orkestranın en derin', ho: 'güçlü temel ses', hz: 'derinlik' },
    { w: 'Kanun', hc: 'yatay çok tel', hk: 'türk klasiği', ho: 'doğu armoni', hz: 'denge' },
    { w: 'Didgeridoo', hc: 'uzun ahşap boru', hk: 'yerli avustralya', ho: 'kadim ses', hz: 'toprak' },
    { w: 'Bas Gitar', hc: 'derin dört tel', hk: 'grubun alt sesi', ho: 'müzik temeli', hz: 'derinlik' },
    { w: 'Mandolin', hc: 'küçük armut sekiz tel', hk: 'folk müziği', ho: 'yöresel melodi', hz: 'nostalji' },
  ],

  bilim: [
    { w: 'Kara Delik', hc: 'ışık yutan uzay', hk: 'sonsuz çekim', ho: 'evren gizemi', hz: 'karanlık' },
    { w: 'DNA', hc: 'çift sarmal şifre', hk: 'kalıtım kodu', ho: 'yaşamın planı', hz: 'miras' },
    { w: 'Fotosentez', hc: 'güneş besin dönüşümü', hk: 'yeşil yaprak üretimi', ho: 'yaşam döngüsü', hz: 'dönüşüm' },
    { w: 'Evrim', hc: 'nesil değişimi', hk: 'doğal seçilim', ho: 'yaşam uyumu', hz: 'değişim' },
    { w: 'Yerçekimi', hc: 'düşme kuvveti', hk: 'kütle çekimi', ho: 'evren dengesi', hz: 'bağlantı' },
    { w: 'Atom', hc: 'maddenin en küçüğü', hk: 'kimya temeli', ho: 'görünmez yapı taşı', hz: 'temel' },
    { w: 'Gen', hc: 'kalıtım birimi', hk: 'dna bölgesi', ho: 'özellik aktarımı', hz: 'miras' },
    { w: 'Entropi', hc: 'düzenden kaosa', hk: 'dağılma eğilimi', ho: 'evrensel akış', hz: 'kaos' },
    { w: 'Antikor', hc: 'bağışıklık proteini', hk: 'hastalık savaşçısı', ho: 'savunma mekanizması', hz: 'koruma' },
    { w: 'Sinaps', hc: 'nöron bağlantı', hk: 'beyin sinyali', ho: 'sinir iletimi', hz: 'bağlantı' },
    { w: 'Radyasyon', hc: 'atom ışıması', hk: 'görünmez enerji', ho: 'tehlikeli yayılım', hz: 'enerji' },
    { w: 'Ekosistem', hc: 'canlı ve çevre', hk: 'doğa dengesi', ho: 'yaşam sistemi', hz: 'denge' },
    { w: 'Kuantum', hc: 'atom altı fizik', hk: 'belirsizlik ilkesi', ho: 'gerçeklik sınırı', hz: 'belirsizlik' },
    { w: 'Görelilik', hc: 'zaman esnekliği', hk: 'einstein teorisi', ho: 'fizik devrimi', hz: 'görecelik' },
    { w: 'Kataliz', hc: 'reaksiyon hızlandırma', hk: 'kimyasal tetikleyici', ho: 'süreç kolaylaştırma', hz: 'hız' },
    { w: 'Termodinamik', hc: 'ısı ve iş ilişkisi', hk: 'enerji dönüşümü', ho: 'fizik yasası', hz: 'enerji' },
    { w: 'Hücre', hc: 'yaşamın yapı taşı', hk: 'mikroskobik birim', ho: 'biyoloji temeli', hz: 'temel' },
    { w: 'Karanlık Madde', hc: 'görünmez evren', hk: 'çekim kaynağı', ho: 'kozmik gizem', hz: 'gizem' },
    { w: 'Işık Hızı', hc: 'evren maksimum hızı', hk: 'fizik sınırı', ho: 'kozmik referans', hz: 'sınır' },
    { w: 'Elektromanyetizma', hc: 'elektrik manyetik birlik', hk: 'temel kuvvet', ho: 'evrensel etki', hz: 'kuvvet' },
  ],

  mitoloji: [
    { w: 'Zeus', hc: 'yıldırım tanrısı', hk: 'olimpos babası', ho: 'tanrısal otorite', hz: 'güç' },
    { w: 'Medusa', hc: 'taşa çeviren bakış', hk: 'yılan saçlı korku', ho: 'dönüştürücü güç', hz: 'korku' },
    { w: 'Pegasus', hc: 'kanatlı at', hk: 'mitik uçuş', ho: 'özgür ruh', hz: 'özgürlük' },
    { w: 'Minotaur', hc: 'boğa başlı labirent', hk: 'karanlık hapishane', ho: 'melez yaratık', hz: 'kaos' },
    { w: 'Feniks', hc: 'külden doğan kuş', hk: 'ölümsüz ateş', ho: 'yeniden başlangıç', hz: 'yenilenme' },
    { w: 'Ejderha', hc: 'ateş üfleyen kanat', hk: 'korkulan güç', ho: 'mitik yıkım', hz: 'güç' },
    { w: 'Titan', hc: 'olimpos öncesi dev', hk: 'tanrı öncesi güç', ho: 'antik kuvvet', hz: 'büyüklük' },
    { w: 'Prometeus', hc: 'ateş hırsızı', hk: 'insanlık fedakarı', ho: 'ceza ve adanma', hz: 'fedakarlık' },
    { w: 'Odysseus', hc: 'on yıl eve dönüş', hk: 'akıllı kahraman', ho: 'uzun yolculuk', hz: 'azim' },
    { w: 'Herkül', hc: 'on iki görev', hk: 'yarı tanrı güç', ho: 'imkansız başarı', hz: 'güç' },
    { w: 'Thor', hc: 'çekiç şimşek', hk: 'iskandinav güç', ho: 'savaşçı tanrı', hz: 'güç' },
    { w: 'Loki', hc: 'düzenbaz tanrı', hk: 'iskandinav hile', ho: 'kaos yaratıcı', hz: 'aldatma' },
    { w: 'Anka Kuşu', hc: 'türk ateş kuşu', hk: 'ölümsüz efsane', ho: 'yeniden doğuş', hz: 'ölümsüzlük' },
    { w: 'Simurg', hc: 'iran dev bilge kuş', hk: 'doğu efsanesi', ho: 'bilgelik sembolü', hz: 'bilgelik' },
    { w: 'Gılgamış', hc: 'ölümsüzlük arayan kral', hk: 'sümer destanı', ho: 'antik kahraman', hz: 'arayış' },
    { w: 'Sfenks', hc: 'bilmece soran yaratık', hk: 'insan aslan karışımı', ho: 'antik gizem', hz: 'soru' },
    { w: 'Unicorn', hc: 'tek boynuzlu at', hk: 'saflık sembolü', ho: 'mitik nadir', hz: 'saflık' },
    { w: 'Poseidon', hc: 'üç çatallı deniz tanrısı', hk: 'deprem hükümdarı', ho: 'su egemenliği', hz: 'derinlik' },
    { w: 'Aşil', hc: 'topuk zayıflığı', hk: 'savaş efsanesi', ho: 'mükemmeliyetin sınırı', hz: 'güç' },
    { w: 'Olimpos', hc: 'tanrılar dağı', hk: 'kutsal zirve', ho: 'ilahi iktidar', hz: 'yükseklik' },
  ],

};
// Tüm kategorilerin listesi
const ALL_CATEGORIES = Object.keys(WORDS);

// ─── Yardımcı Fonksiyonlar ───

// Oda kodu üretici (I, O, 0 hariç)
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Rastgele kelime seç
function pickWord(category) {
  let pool;
  if (category === 'karisik') {
    const cat = ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)];
    pool = WORDS[cat];
  } else {
    pool = WORDS[category] || WORDS.yiyecek;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// hint seviyesi → alan adı
function hintKey(level) {
  switch (level) {
    case 'cok_kolay': return 'hc';
    case 'kolay': return 'hk';
    case 'orta': return 'ho';
    case 'zor': return 'hz';
    default: return 'ho';
  }
}

// Avatar renkleri
const COLORS = ['#e63946','#888888','#c1121f','#a0a0a0','#ff6b6b','#666666','#d62828','#b0b0b0','#ef4444','#555555'];

// ─── Oda Yönetimi ───
const rooms = new Map();

function broadcastState(room) {
  for (const p of room.players) {
    if (p.ws && p.ws.readyState === 1) {
      p.ws.send(JSON.stringify({ type: 'state', state: roomState(room, p.idx) }));
    }
  }
}

// Oda durumu (myIdx kişiye özel)
function roomState(room, myIdx) {
  const me = room.players[myIdx];
  return {
    code: room.code,
    phase: room.phase,
    round: room.round,
    maxRounds: room.settings.maxRounds,
    myIdx,
    realWord: (room.phase === 'scoreboard' || room.phase === 'over') ? room.realWord : null,
    hint: (room.phase === 'scoreboard' || room.phase === 'over') ? room.hint : null,
    roundWinner: room.roundWinner,
    settings: room.settings,
    wordHistory: room.phase === 'over' ? room.wordHistory : null,
    players: room.players.map((p, i) => ({
      name: p.name,
      idx: p.idx,
      color: p.color,
      alive: p.alive,
      score: p.score,
      ready: p.ready,
      clue: (room.phase === 'clues' || room.phase === 'decision' || room.phase === 'scoreboard' || room.phase === 'over') ? p.clue : (p.clue ? true : false),
      hasVoted: !!p.vote && p.vote !== -1,
      isSahtekar: (room.phase === 'scoreboard' || room.phase === 'over') ? p.isSahtekar : (myIdx === i ? p.isSahtekar : null),
      isHost: i === 0,
      word: myIdx === i ? p.word : null,
      myHint: myIdx === i ? p.myHint : null,
    })),
  };
}

function send(ws, data) {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify(data));
}

function sendError(ws, msg) {
  send(ws, { type: 'error', message: msg });
}

// Yeni tur hazırlığı
function setupRound(room) {
  const wordObj = pickWord(room.settings.category);
  room.realWord = wordObj.w;
  const hk = hintKey(room.settings.hintLevel);
  room.hint = wordObj[hk];
  room.roundWinner = null;
  room.phase = 'word';
  console.log(`[HINT DEBUG] hintLevel ayarı: "${room.settings.hintLevel}" → hintKey: "${hk}" → hint: "${room.hint}" | Kelime: ${room.realWord} | Tüm hintler: hc="${wordObj.hc}" hk="${wordObj.hk}" ho="${wordObj.ho}" hz="${wordObj.hz}"`);

  // Sahtekar(lar) seç — önceki turda sahtekar olanlar hariç tutularak seçilir
  const players = room.players;
  const oyuncuSayisi = players.length;
  const kacSahtekar = Math.min(room.settings.imposters, Math.floor(oyuncuSayisi / 2));

  // Önceki sahtekarları bul
  const oncekiSahtekarlar = new Set(players.filter(p => p.isSahtekar).map(p => p.idx));

  // Önce önceki sahtekar olmayanlardan seç
  let adaylar = players.map((_, i) => i).filter(i => !oncekiSahtekarlar.has(i));

  // Eğer yeterli aday yoksa (herkes önceden sahtekar olduysa) hepsinden seç
  if (adaylar.length < kacSahtekar) {
    adaylar = players.map((_, i) => i);
  }

  // Manuel Fisher-Yates shuffle
  for (let i = adaylar.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = adaylar[i];
    adaylar[i] = adaylar[j];
    adaylar[j] = tmp;
  }

  // İlk N tanesi sahtekar
  const sahtekarlar = new Set(adaylar.slice(0, kacSahtekar));
  console.log(`[Tur ${room.round}] Oda: ${room.code} | Kelime: ${room.realWord} | Sahtekar idx: [${[...sahtekarlar].join(', ')}] | Önceki: [${[...oncekiSahtekarlar].join(', ')}] (toplam ${oyuncuSayisi} oyuncu)`);

  for (const p of room.players) {
    p.isSahtekar = sahtekarlar.has(p.idx);
    p.ready = false;
    p.clue = null;
    p.vote = null;
    if (p.isSahtekar) {
      p.word = null;
      p.myHint = room.hint;
    } else {
      p.word = room.realWord;
      p.myHint = null;
    }
  }
}

// ─── HTTP Sunucu ───
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Sunucu hatası');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Bulunamadı');
  }
});

// ─── WebSocket Sunucu ───
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  let myRoom = null;
  let myIdx = -1;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {

      // ─── Oda Oluştur ───
      case 'create': {
        const name = (msg.name || '').trim().slice(0, 20);
        if (!name) return sendError(ws, 'İsim gerekli');

        let code;
        do { code = generateCode(); } while (rooms.has(code));

        const room = {
          code,
          phase: 'lobby',
          players: [],
          settings: {
            timerSecs: (msg.timerSecs !== undefined && msg.timerSecs !== null) ? msg.timerSecs : 0,
            category: msg.category || 'karisik',
            hintLevel: msg.hintLevel || 'orta',
            imposters: msg.imposters || 1,
            votingEnabled: !!msg.votingEnabled,
            maxRounds: (msg.maxRounds !== undefined && msg.maxRounds !== null) ? msg.maxRounds : 0, // 0 = sınırsız
          },
          round: 0,
          realWord: null,
          hint: null,
          roundWinner: null,
          wordHistory: [],
        };

        const player = {
          ws, name, idx: 0, color: COLORS[0],
          alive: true, score: 0, word: null, myHint: null,
          isSahtekar: false, ready: false, clue: null, vote: null,
        };
        room.players.push(player);
        rooms.set(code, room);
        myRoom = room;
        myIdx = 0;

        send(ws, { type: 'created', code });
        broadcastState(room);
        break;
      }

      // ─── Odaya Katıl ───
      case 'join': {
        const name = (msg.name || '').trim().slice(0, 20);
        const code = (msg.code || '').toUpperCase().trim();
        if (!name) return sendError(ws, 'İsim gerekli');
        if (!code) return sendError(ws, 'Oda kodu gerekli');

        const room = rooms.get(code);
        if (!room) return sendError(ws, 'Oda bulunamadı');
        if (room.phase !== 'lobby') return sendError(ws, 'Oyun zaten başlamış');
        if (room.players.length >= 10) return sendError(ws, 'Oda dolu (maks 10)');
        if (room.players.some(p => p.name === name)) return sendError(ws, 'Bu isim zaten kullanılıyor');

        const idx = room.players.length;
        const player = {
          ws, name, idx, color: COLORS[idx % COLORS.length],
          alive: true, score: 0, word: null, myHint: null,
          isSahtekar: false, ready: false, clue: null, vote: null,
        };
        room.players.push(player);
        myRoom = room;
        myIdx = idx;

        send(ws, { type: 'joined', code });
        broadcastState(room);
        break;
      }

      // ─── Oyunu Başlat ───
      case 'start': {
        if (!myRoom || myIdx !== 0) return;
        if (myRoom.players.length < 3) return sendError(ws, 'En az 3 oyuncu gerekli');
        if (myRoom.phase !== 'lobby') return;

        myRoom.round = 1;
        setupRound(myRoom);
        broadcastState(myRoom);
        break;
      }

      // ─── Hazırım ───
      case 'ready': {
        if (!myRoom || myRoom.phase !== 'word') return;
        const me = myRoom.players[myIdx];
        if (!me || !me.alive) return;
        me.ready = true;

        // Herkes hazır mı?
        const allReady = myRoom.players.filter(p => p.alive).every(p => p.ready);
        if (allReady) {
          myRoom.phase = 'clue';
        }
        broadcastState(myRoom);
        break;
      }

      // ─── Tarif Gönder ───
      case 'clue': {
        if (!myRoom || myRoom.phase !== 'clue') return;
        const me = myRoom.players[myIdx];
        if (!me || !me.alive || me.clue) return;

        me.clue = (msg.clue || '').trim().slice(0, 200);
        if (!me.clue) return sendError(ws, 'Tarif boş olamaz');

        // Herkes gönderdi mi?
        const allClued = myRoom.players.filter(p => p.alive).every(p => p.clue);
        if (allClued) {
          myRoom.phase = 'clues';
        }
        broadcastState(myRoom);
        break;
      }

      // ─── Oylamaya Geç ───
      case 'go_vote': {
        if (!myRoom || myIdx !== 0) return;
        if (myRoom.phase !== 'clues' && myRoom.phase !== 'decision') return;
        myRoom.phase = 'decision';
        broadcastState(myRoom);
        break;
      }

      // ─── Oy Ver ───
      case 'vote': {
        if (!myRoom || myRoom.phase !== 'decision') return;
        if (!myRoom.settings.votingEnabled) return;
        const me = myRoom.players[myIdx];
        if (!me || !me.alive) return;
        const target = msg.target;
        if (target === myIdx) return;
        if (!myRoom.players[target] || !myRoom.players[target].alive) return;

        me.vote = target;

        // Herkes oy kullandı mı?
        const alivePlayers = myRoom.players.filter(p => p.alive);
        const allVoted = alivePlayers.every(p => p.vote != null && p.vote !== -1);
        if (allVoted) {
          // Oyları say
          const voteCounts = {};
          for (const p of alivePlayers) {
            voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
          }
          const maxVotes = Math.max(...Object.values(voteCounts));
          const topVoted = Object.keys(voteCounts).filter(k => voteCounts[k] === maxVotes).map(Number);
          // Eşitlikte rastgele
          const eliminated = topVoted[Math.floor(Math.random() * topVoted.length)];
          myRoom.players[eliminated].alive = false;

          // Elenen sahtekar mıydı?
          if (myRoom.players[eliminated].isSahtekar) {
            // Masumlar kazandı
            myRoom.roundWinner = 'masumlar';
            for (const p of myRoom.players) {
              if (p.alive && !p.isSahtekar) p.score += 1;
            }
          } else {
            // Sahtekar kazandı
            myRoom.roundWinner = 'sahtekar';
            const totalPlayers = myRoom.players.length;
            for (const p of myRoom.players) {
              if (p.isSahtekar) p.score += (totalPlayers - 1);
            }
          }

          myRoom.wordHistory.push({ round: myRoom.round, word: myRoom.realWord, hint: myRoom.hint, winner: myRoom.roundWinner });
          myRoom.phase = 'scoreboard';
        }
        broadcastState(myRoom);
        break;
      }

      // ─── Kazananı Seç (oylama kapalı) ───
      case 'set_winner': {
        if (!myRoom || myIdx !== 0) return;
        if (myRoom.phase !== 'clues' && myRoom.phase !== 'decision') return;

        const winner = msg.winner; // 'masumlar' veya 'sahtekar'
        if (winner !== 'masumlar' && winner !== 'sahtekar') return;

        myRoom.roundWinner = winner;
        if (winner === 'masumlar') {
          for (const p of myRoom.players) {
            if (p.alive && !p.isSahtekar) p.score += 1;
          }
        } else {
          const totalPlayers = myRoom.players.length;
          for (const p of myRoom.players) {
            if (p.isSahtekar) p.score += (totalPlayers - 1);
          }
        }

        myRoom.wordHistory.push({ round: myRoom.round, word: myRoom.realWord, hint: myRoom.hint, winner: myRoom.roundWinner });
        myRoom.phase = 'scoreboard';
        broadcastState(myRoom);
        break;
      }

      // ─── Yeni Tur ───
      case 'next_round': {
        if (!myRoom || myIdx !== 0) return;
        if (myRoom.phase !== 'scoreboard') return;

        // Maksimum tur kontrolü
        if (myRoom.settings.maxRounds > 0 && myRoom.round >= myRoom.settings.maxRounds) {
          myRoom.phase = 'over';
          broadcastState(myRoom);
          return;
        }

        myRoom.round++;
        // Tüm oyuncuları yeniden canlandır
        for (const p of myRoom.players) {
          p.alive = true;
        }
        setupRound(myRoom);
        broadcastState(myRoom);
        break;
      }

      // ─── Oyunu Bitir ───
      case 'end_game': {
        if (!myRoom || myIdx !== 0) return;
        if (myRoom.phase !== 'scoreboard') return;
        myRoom.phase = 'over';
        broadcastState(myRoom);
        break;
      }

      // ─── Yeniden Başlat ───
      case 'restart_game': {
        if (!myRoom || myIdx !== 0) return;
        myRoom.phase = 'lobby';
        myRoom.round = 0;
        myRoom.realWord = null;
        myRoom.hint = null;
        myRoom.roundWinner = null;
        myRoom.wordHistory = [];
        for (const p of myRoom.players) {
          p.alive = true;
          p.score = 0;
          p.word = null;
          p.myHint = null;
          p.isSahtekar = false;
          p.ready = false;
          p.clue = null;
          p.vote = null;
        }
        broadcastState(myRoom);
        break;
      }
    }
  });

  // ─── Bağlantı Kesildi ───
  ws.on('close', () => {
    if (!myRoom) return;
    const room = myRoom;

    if (myIdx === 0) {
      // Host ayrıldı
      if (room.phase === 'lobby') {
        // Lobideyse odayı sil
        for (const p of room.players) {
          if (p.ws && p.ws !== ws && p.ws.readyState === 1) {
            send(p.ws, { type: 'error', message: 'Ev sahibi odadan ayrıldı' });
          }
        }
        rooms.delete(room.code);
      } else {
        // Oyun içindeyse alive=false
        if (room.players[myIdx]) {
          room.players[myIdx].alive = false;
          room.players[myIdx].ws = null;
        }
        broadcastState(room);
      }
    } else {
      if (room.phase === 'lobby') {
        // Lobideyse oyuncuyu çıkar
        room.players.splice(myIdx, 1);
        // İndeksleri güncelle
        room.players.forEach((p, i) => { p.idx = i; p.color = COLORS[i % COLORS.length]; });
        broadcastState(room);
      } else {
        // Oyun içindeyse alive=false
        if (room.players[myIdx]) {
          room.players[myIdx].alive = false;
          room.players[myIdx].ws = null;
        }
        broadcastState(room);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Sahtekar sunucusu ${PORT} portunda çalışıyor`);
});
