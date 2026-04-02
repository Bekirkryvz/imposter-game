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
    { w: 'Sarma', hc: 'Yaprak içine sarılmış pirinçli et yemeği', hk: 'Türk mutfağının sarmalı yemeği', ho: 'Geleneksel Türk yemeği', hz: 'Yaşam' },
    { w: 'Künefe', hc: 'Kadayıf hamuruyla yapılan sıcak peynirli tatlı', hk: 'Peynirli ve şerbetli sıcak tatlı', ho: 'Türk tatlısı', hz: 'Isı' },
    { w: 'Kumpir', hc: 'İçi oyulmuş büyük patatesin içine malzeme doldurulur', hk: 'Ortaköy\'ün meşhur doldurulmuş patatesi', ho: 'Sokak yemeği', hz: 'Toprak' },
    { w: 'Menemen', hc: 'Domates biber yumurtayla yapılan Türk kahvaltısı', hk: 'Tavada pişirilen yumurtalı kahvaltılık', ho: 'Kahvaltı yemeği', hz: 'Sabah' },
    { w: 'İskender', hc: 'Döner üzerine yoğurt ve tereyağı dökülen Bursa yemeği', hk: 'Yoğurtlu ve tereyağlı döner yemeği', ho: 'Et yemeği', hz: 'Tarih' },
    { w: 'Simit', hc: 'Susamlı halka şeklinde Türk sokak ekmeği', hk: 'Seyyar satıcıların sattığı susamlı halka', ho: 'Sokak yiyeceği', hz: 'Çember' },
    { w: 'Lahmacun', hc: 'Üzeri kıymalı sebzeli ince hamur, limonla yenir', hk: 'Türk pizzası denen ince kıymalı hamur', ho: 'Fırın yemeği', hz: 'Yuvarlak' },
    { w: 'Baklava', hc: 'İnce yufkalar arasında fıstık ve şerbetle yapılan tatlı', hk: 'Gaziantep\'in meşhur fıstıklı tatlısı', ho: 'Türk tatlısı', hz: 'Katmanlar' },
    { w: 'Mantı', hc: 'İçi kıymalı küçük hamur, yoğurt ve sosla yenir', hk: 'Yoğurtlu küçük hamur bohçaları', ho: 'Hamur yemeği', hz: 'Bohça' },
    { w: 'Döner', hc: 'Dönen şişte pişirilen et, ekmekle yenir', hk: 'Dönen şişte pişen ünlü Türk eti', ho: 'Et yemeği', hz: 'Dönüş' },
    { w: 'Çiğ Köfte', hc: 'Bulgurla yapılan, limon ve narla yenen acılı atıştırmalık', hk: 'Dürüm yapılan acılı bulgurlu atıştırmalık', ho: 'Sokak yiyeceği', hz: 'Ham' },
    { w: 'Kadayıf', hc: 'Tel tel hamurdan yapılan şerbetli Türk tatlısı', hk: 'İnce tel hamurdan şerbetli tatlı', ho: 'Türk tatlısı', hz: 'Tel' },
    { w: 'Kokoreç', hc: 'Bağırsak sarılı şişte pişirilen ekmek arası Türk sokak yemeği', hk: 'Sakatat içeren meşhur Türk sokak yemeği', ho: 'Sokak yemeği', hz: 'Sarmal' },
    { w: 'Ayran', hc: 'Yoğurt su ve tuzla yapılan Türk içeceği', hk: 'Türklerin en sevdiği yoğurtlu soğuk içecek', ho: 'Türk içeceği', hz: 'Beyaz' },
    { w: 'Pide', hc: 'Üzeri kaşarlı kıymalı tekne şekilli Türk ekmeği', hk: 'Fırında pişen Türk pizzasına benzer yiyecek', ho: 'Fırın yemeği', hz: 'Tekne' },
    { w: 'Börek', hc: 'Yufka arası peynirli veya kıymalı fırın yemeği', hk: 'İnce yufkadan yapılan peynirli hamur işi', ho: 'Hamur işi', hz: 'Katman' },
    { w: 'Kebap', hc: 'Şişe geçirilip közde pişirilen et yemeği', hk: 'Ateşte pişen Türk et yemeği', ho: 'Et yemeği', hz: 'Ateş' },
    { w: 'Tarhana', hc: 'Kurutulmuş domates yoğurt unundan yapılan çorba', hk: 'Kışlık hazırlanan geleneksel Türk çorbası', ho: 'Çorba', hz: 'Kış' },
    { w: 'Su Böreği', hc: 'Haşlanmış yufkadan yapılan peynirli fırın böreği', hk: 'Islak yufkadan yapılan özel börek çeşidi', ho: 'Hamur işi', hz: 'Su' },
    { w: 'Gözleme', hc: 'Sacda pişirilen ince hamur içi peynirli veya ıspanaklı', hk: 'Köy pazarlarının vazgeçilmezi ince hamur', ho: 'Hamur işi', hz: 'İnce' },
    { w: 'Lokma', hc: 'Hayır için dağıtılan şerbete batırılmış küçük hamur tatlısı', hk: 'Şerbetli küçük yuvarlak hamur tatlısı', ho: 'Türk tatlısı', hz: 'Bereket' },
    { w: 'Pilav', hc: 'Tereyağında kavrulan pirincin su ile pişirilmesi', hk: 'Türk sofrasının vazgeçilmez pirinç yemeği', ho: 'Yanık yemeği', hz: 'Tane' },
    { w: 'Çorba', hc: 'Sebze et veya mercimekle yapılan sıcak sıvı yemek', hk: 'Her öğünde içilen sıcak sıvı yemek', ho: 'Sıcak yemek', hz: 'Sıcaklık' },
    { w: 'Muhallebi', hc: 'Süt nişasta ve şekerle yapılan beyaz sütlü tatlı', hk: 'Soğuk servis edilen sütlü Türk tatlısı', ho: 'Sütlü tatlı', hz: 'Beyaz' },
    { w: 'Tarator', hc: 'Sarımsaklı yoğurt ceviz soslu soğuk meze', hk: 'Sarımsaklı yoğurtlu cevizli meze', ho: 'Meze', hz: 'Sos' },
  ],

  hayvan: [
    { w: 'Zürafa', hc: 'Boynu çok uzun Afrika\'nın en uzun kara hayvanı', hk: 'Uzun boyunlu Afrika memelisi', ho: 'Afrika hayvanı', hz: 'Yükseklik' },
    { w: 'Bukalemun', hc: 'Rengini çevresine göre değiştirebilen kertenkele', hk: 'Renk değiştiren sürüngen', ho: 'Egzotik sürüngen', hz: 'Değişim' },
    { w: 'Baykuş', hc: 'Geceleri avlanan büyük gözlü bilgelik sembolü kuş', hk: 'Geceleri uçan bilgelik sembolü kuş', ho: 'Gece kuşu', hz: 'Karanlık' },
    { w: 'Koala', hc: 'Avustralya\'da okaliptüs yaprağı yiyen torbалı hayvan', hk: 'Avustralya\'nın sevimli ağaç tırmanıcısı', ho: 'Avustralya hayvanı', hz: 'Yumuşaklık' },
    { w: 'Denizatı', hc: 'At başı şeklinde dik yüzen küçük deniz balığı', hk: 'At şekline benzeyen küçük deniz canlısı', ho: 'Deniz canlısı', hz: 'At' },
    { w: 'Flamingo', hc: 'Tek ayak üzerinde duran pembe renkli uzun bacaklı kuş', hk: 'Pembe renkli uzun bacaklı kuş', ho: 'Egzotik kuş', hz: 'Pembe' },
    { w: 'Platipus', hc: 'Ördek gagalı, kunduz kuyruklu, zehirli memelilerden', hk: 'Ördek gagalı Avustralya memelisi', ho: 'Garip görünümlü hayvan', hz: 'Karışım' },
    { w: 'Ahtapot', hc: 'Sekiz kollu mürekkep sıkan zeki deniz canlısı', hk: 'Sekiz kollu deniz canlısı', ho: 'Deniz canlısı', hz: 'Kol' },
    { w: 'Penguen', hc: 'Uçamayan, yüzebilen siyah beyaz Antarktika kuşu', hk: 'Siyah beyaz buzul kuşu', ho: 'Kutup hayvanı', hz: 'Resmiyet' },
    { w: 'Jaguar', hc: 'Amazon\'un en büyük benekli kedi yırtıcısı', hk: 'Benekli büyük kedi Amazon ormanlarında', ho: 'Yırtıcı kedi', hz: 'Hız' },
    { w: 'Timsah', hc: 'Ağzı geniş dişleri keskin sürüngenlerin en büyüğü', hk: 'Büyük ağızlı nehir sürüngeni', ho: 'Sürüngen', hz: 'Tehlike' },
    { w: 'Kartal', hc: 'Keskin görüşlü yükseklerde süzülen büyük yırtıcı kuş', hk: 'Güç sembolü büyük yırtıcı kuş', ho: 'Yırtıcı kuş', hz: 'Özgürlük' },
    { w: 'Köpekbalığı', hc: 'Okyanusun en büyük yırtıcı balığı keskin dişli', hk: 'Okyanusun korkunç yırtıcı balığı', ho: 'Deniz yırtıcısı', hz: 'Korku' },
    { w: 'Kaplumbağa', hc: 'Kabuğu sırtında taşıyan yavaş sürüngen', hk: 'Kabuğuna çekilen yavaş sürüngen', ho: 'Sürüngen', hz: 'Yavaşlık' },
    { w: 'Kelebek', hc: 'Tırtıldan dönüşen renkli kanatlı böcek', hk: 'Dönüşümün simgesi renkli böcek', ho: 'Böcek', hz: 'Dönüşüm' },
    { w: 'Akbaba', hc: 'Ölü hayvanlarla beslenen büyük kel başlı kuş', hk: 'Leş yiyen büyük kuş', ho: 'Yırtıcı kuş', hz: 'Ölüm' },
    { w: 'Salyangoz', hc: 'Kabuğunu sırtında taşıyan yavaş yumuşakça', hk: 'Kabuğunda yaşayan yavaş canlı', ho: 'Yumuşakça', hz: 'Yavaşlık' },
    { w: 'Rakun', hc: 'Gözleri maskeli görünen gece gezgin memelisi', hk: 'Maskeli yüzlü çöpçü hayvan', ho: 'Gece hayvanı', hz: 'Maske' },
    { w: 'Kutup Ayısı', hc: 'Arktik\'te yaşayan beyaz kürklü en büyük kara yırtıcısı', hk: 'Beyaz kürklü Kuzey Kutbu ayısı', ho: 'Kutup hayvanı', hz: 'Soğuk' },
    { w: 'Suaygırı', hc: 'Afrika nehirlerinde yaşayan devasa ağızlı memeli', hk: 'Afrika nehirlerinin devasa memelisi', ho: 'Afrika hayvanı', hz: 'Su' },
  ],

  meslek: [
    { w: 'Avukat', hc: 'Mahkemede müvekkili savunan hukuk mezunu', hk: 'Hukuki davalarda insanları temsil eden', ho: 'Hukuk mesleği', hz: 'Adalet' },
    { w: 'Cerrah', hc: 'Ameliyathanede bıçakla vücut içinde işlem yapan doktor', hk: 'Ameliyat yapan uzman doktor', ho: 'Tıp mesleği', hz: 'Keskinlik' },
    { w: 'Mimar', hc: 'Binaların tasarımını çizen inşaat projecisi', hk: 'Bina ve yapı tasarlayan uzman', ho: 'Tasarım mesleği', hz: 'Yaratıcılık' },
    { w: 'Pilot', hc: 'Uçağı kullanan kabin ekibinin başındaki kişi', hk: 'Uçağı yöneten kaptan', ho: 'Havacılık mesleği', hz: 'Gökyüzü' },
    { w: 'Astronot', hc: 'Uzay mekiğiyle uzaya giden özel eğitimli kişi', hk: 'Uzaya giden özel eğitimli insan', ho: 'Uzay mesleği', hz: 'Sonsuzluk' },
    { w: 'Dedektif', hc: 'Suçları çözmek için ipucu toplayan özel ajan', hk: 'Suç soruşturan gizli araştırmacı', ho: 'Araştırma mesleği', hz: 'Gizem' },
    { w: 'Arkeolog', hc: 'Toprak kazarak eski uygarlıkların kalıntılarını bulan bilim insanı', hk: 'Tarihi kalıntıları kazıp bulan uzman', ho: 'Tarih mesleği', hz: 'Geçmiş' },
    { w: 'Psikolog', hc: 'İnsan zihnini ve davranışlarını inceleyen uzman terapist', hk: 'Ruh sağlığıyla ilgilenen uzman', ho: 'Sağlık mesleği', hz: 'Zihin' },
    { w: 'Diplomat', hc: 'Ülkeler arasında müzakere yürüten büyükelçilik görevlisi', hk: 'Ülkeler arası ilişkileri yürüten devlet görevlisi', ho: 'Devlet mesleği', hz: 'Barış' },
    { w: 'Gazeteci', hc: 'Haber yapıp gazete televizyon için yazan muhabir', hk: 'Haber toplayan ve yayınlayan medya çalışanı', ho: 'Medya mesleği', hz: 'Bilgi' },
    { w: 'Veteriner', hc: 'Hasta hayvanları muayene edip tedavi eden doktor', hk: 'Hayvanların doktoru', ho: 'Sağlık mesleği', hz: 'Şefkat' },
    { w: 'Kuyumcu', hc: 'Altın gümüş ve mücevher satan veya yapan esnaf', hk: 'Altın ve takı satan esnaf', ho: 'Ticaret mesleği', hz: 'Parlaklık' },
    { w: 'Bahçıvan', hc: 'Park ve bahçelerdeki bitkileri yetiştirip sulayan işçi', hk: 'Bitki ve çiçek yetiştiren kişi', ho: 'Doğa mesleği', hz: 'Büyüme' },
    { w: 'Aşçı', hc: 'Restoranda yemek pişiren mutfağın ustası', hk: 'Profesyonel yemek pişiren usta', ho: 'Yiyecek mesleği', hz: 'Ateş' },
    { w: 'Ressam', hc: 'Tuval üzerine boya ile tablo yapan sanatçı', hk: 'Tablo yapan görsel sanatçı', ho: 'Sanat mesleği', hz: 'Renk' },
    { w: 'Heykeltıraş', hc: 'Taş ahşap veya metalden üç boyutlu figür yapan sanatçı', hk: 'Heykel yapan sanatçı', ho: 'Sanat mesleği', hz: 'Şekil' },
    { w: 'Hakem', hc: 'Maç sırasında kuralları uygulayan ve karar veren kişi', hk: 'Spor müsabakalarında kural uygulayan görevli', ho: 'Spor mesleği', hz: 'Adalet' },
    { w: 'Kaptan', hc: 'Gemiyi yöneten ve denizde kaptanlık yapan yetkili', hk: 'Gemiyi yöneten yetkili denizci', ho: 'Denizcilik mesleği', hz: 'Liderlik' },
    { w: 'Madenci', hc: 'Yer altında maden ocağında çalışan işçi', hk: 'Yer altında çalışan maden işçisi', ho: 'Ağır iş mesleği', hz: 'Karanlık' },
    { w: 'Yangın Söndürücü', hc: 'Yangın çıkınca kırmızı araçla gelen ve alevleri söndüren ekip', hk: 'Yangınlara müdahale eden itfaiyeci', ho: 'Acil durum mesleği', hz: 'Cesaret' },
  ],

  yer: [
    { w: 'Kütüphane', hc: 'Binlerce kitabın raflarda sıralandığı sessiz okuma yeri', hk: 'Kitap ödünç alınan sessiz kamu binası', ho: 'Kültür mekanı', hz: 'Bilgi' },
    { w: 'Stadyum', hc: 'Etrafı tribünlerle çevrili büyük spor müsabaka alanı', hk: 'Büyük spor müsabakalarının yapıldığı alan', ho: 'Spor mekanı', hz: 'Kalabalık' },
    { w: 'Lunapark', hc: 'Dönme dolap korku treni olan eğlence parkı', hk: 'Dönme dolaplı ailece eğlence yeri', ho: 'Eğlence mekanı', hz: 'Neşe' },
    { w: 'Hamam', hc: 'Osmanlıdan kalma sıcak buharla yıkanılan tarihi yıkanma yeri', hk: 'Geleneksel Türk banyo kültürünün mekanı', ho: 'Tarihi mekan', hz: 'Temizlik' },
    { w: 'Liman', hc: 'Gemilerin yanaşıp yük boşalttığı kıyı tesisi', hk: 'Gemilerin bağlandığı deniz kenarı tesisi', ho: 'Deniz tesisi', hz: 'Bağlantı' },
    { w: 'Havalimanı', hc: 'Uçakların inip kalktığı büyük terminal binası olan alan', hk: 'Uçakların iniş kalkış yaptığı yer', ho: 'Ulaşım tesisi', hz: 'Yolculuk' },
    { w: 'Şato', hc: 'Ortaçağda soyluların yaşadığı kale görünümlü taş yapı', hk: 'Ortaçağ soylusunun taş kale konutu', ho: 'Tarihi yapı', hz: 'Güç' },
    { w: 'Mağara', hc: 'Dağ içinde doğal olarak oluşan karanlık boşluk', hk: 'Dağ içindeki doğal karanlık tünel', ho: 'Doğal oluşum', hz: 'Karanlık' },
    { w: 'Çarşı', hc: 'Yüzlerce dükkanın bir arada olduğu kapalı alışveriş sokakları', hk: 'Geleneksel Türk alışveriş pasajı', ho: 'Ticaret mekanı', hz: 'Kalabalık' },
    { w: 'Baraj', hc: 'Nehri durduran beton duvar ve arkasında biriken su gölü', hk: 'Nehri durduran büyük beton yapı', ho: 'Su tesisi', hz: 'Güç' },
    { w: 'Müze', hc: 'Tarihi eserlerin cam vitrinlerde sergilendiği kültür binası', hk: 'Tarihi eserlerin sergilendiği kültür yapısı', ho: 'Kültür mekanı', hz: 'Geçmiş' },
    { w: 'Hastane', hc: 'Hastaların tedavi edildiği doktor hemşire çalışan büyük bina', hk: 'Hastaların tedavi gördüğü sağlık tesisi', ho: 'Sağlık tesisi', hz: 'Umut' },
    { w: 'Adliye', hc: 'Mahkemelerin bulunduğu hukuki işlemlerin yapıldığı resmi bina', hk: 'Davaların görüldüğü resmi hukuk binası', ho: 'Resmi bina', hz: 'Adalet' },
    { w: 'Cami', hc: 'Minareli Müslümanların namaz kıldığı ibadet yeri', hk: 'Müslümanların ibadet ettiği yapı', ho: 'İbadet yeri', hz: 'İnanç' },
    { w: 'Fener', hc: 'Kıyıda gemilere yol gösteren dönen ışıklı kule', hk: 'Denizde gemilere yön gösteren ışık kulesi', ho: 'Deniz yapısı', hz: 'Yön' },
    { w: 'Köprü', hc: 'İki yakayı birbirine bağlayan üzerinden geçilen yapı', hk: 'İki yakayı birleştiren geçit yapısı', ho: 'Ulaşım yapısı', hz: 'Bağlantı' },
    { w: 'Tünel', hc: 'Dağ veya yer altından geçen karanlık geçit', hk: 'Dağ içinden geçen kapalı yol', ho: 'Ulaşım yapısı', hz: 'Geçiş' },
    { w: 'Pastane', hc: 'Pasta börek kurabiye satılan tatlı kokan dükkan', hk: 'Tatlı ve pastanın satıldığı dükkan', ho: 'Gıda dükkanı', hz: 'Tatlılık' },
    { w: 'Karakol', hc: 'Polislerin çalıştığı şikayetlerin alındığı güvenlik binası', hk: 'Polisin görev yaptığı resmi bina', ho: 'Güvenlik tesisi', hz: 'Düzen' },
    { w: 'Yanardağ', hc: 'İçinden lav ve duman çıkan aktif volkanik dağ', hk: 'Lav fışkırtan aktif dağ', ho: 'Doğal oluşum', hz: 'Ateş' },
  ],

  esya: [
    { w: 'Şemsiye', hc: 'Yağmurda açılan saplı yağmurluğa benzer taşınabilir örtü', hk: 'Yağmurdan korunan açılır kapanır araç', ho: 'Günlük eşya', hz: 'Koruma' },
    { w: 'Pusula', hc: 'Kuzey yönünü gösteren iğneli yön bulma aleti', hk: 'Manyetik yön gösteren navigasyon aleti', ho: 'Navigasyon aleti', hz: 'Yön' },
    { w: 'Teleskop', hc: 'Uzaktaki yıldızları büyütüp gösteren optik alet', hk: 'Uzak nesneleri büyüten optik alet', ho: 'Bilim aleti', hz: 'Uzaklık' },
    { w: 'Mikroskop', hc: 'Gözle görülemeyen küçük organizmaları büyüten laboratuvar aleti', hk: 'Küçük nesneleri büyüten laboratuvar aleti', ho: 'Bilim aleti', hz: 'Küçüklük' },
    { w: 'Stetoskop', hc: 'Doktorun hastanın kalbini ve ciğerini dinlediği çatal kulaklıklı alet', hk: 'Doktorun kalp sesi dinlediği tıbbi alet', ho: 'Tıbbi alet', hz: 'Dinleme' },
    { w: 'Dürbün', hc: 'İki tüpten oluşan uzağı yakın gösteren optik alet', hk: 'Uzağı yakın görmek için çift tüplü araç', ho: 'Optik alet', hz: 'Uzaklık' },
    { w: 'Termos', hc: 'Sıcak soğuk içeceği uzun süre koruyan yalıtımlı şişe', hk: 'İçeceği sıcak tutan yalıtımlı kap', ho: 'Günlük eşya', hz: 'Sıcaklık' },
    { w: 'Valiz', hc: 'Seyahatte giysiler taşınan tekerlekli büyük bavul', hk: 'Seyahatte kullanılan büyük bavul', ho: 'Seyahat eşyası', hz: 'Yolculuk' },
    { w: 'Mum', hc: 'Fitilli balmumundan yapılan ışık kaynağı', hk: 'Yakıldığında ışık veren balmumu çubuğu', ho: 'Işık kaynağı', hz: 'Işık' },
    { w: 'Ayna', hc: 'Yüzü ve vücudu olduğu gibi yansıtan parlak cam yüzey', hk: 'Görüntüyü yansıtan cam yüzey', ho: 'Ev eşyası', hz: 'Yansıma' },
    { w: 'Parfüm', hc: 'Güzel koku için cilde sıkılan şişeli sıvı', hk: 'Güzel koku için kullanılan şişeli sıvı', ho: 'Kozmetik ürün', hz: 'Koku' },
    { w: 'Yastık', hc: 'Uyurken başın altına konan yumuşak kırlent', hk: 'Uyurken başın altına konan yumuşak nesne', ho: 'Uyku eşyası', hz: 'Yumuşaklık' },
    { w: 'Cüzdan', hc: 'Para kart kimlik taşınan deri veya kumaş küçük kılıf', hk: 'Para ve kartların taşındığı küçük deri kılıf', ho: 'Günlük eşya', hz: 'Para' },
    { w: 'Cetvel', hc: 'Düz çizgi çizmek ve ölçmek için kullanılan uzun şerit', hk: 'Ölçme ve çizme için düz şerit alet', ho: 'Okul gereci', hz: 'Düzlük' },
    { w: 'Kumanda', hc: 'Koltuktan uzaktan televizyonu değiştiren tuşlu alet', hk: 'Uzaktan televizyon kanalını değiştiren alet', ho: 'Elektronik eşya', hz: 'Kontrol' },
    { w: 'Kulaklık', hc: 'Müzik dinlemek için kulağa takılan ses aktarma cihazı', hk: 'Kulağa takılan müzik dinleme cihazı', ho: 'Elektronik eşya', hz: 'Ses' },
    { w: 'Güneş Gözlüğü', hc: 'Güneş ışığından gözleri koruyan renkli camlı aksesuar', hk: 'Güneşten gözleri koruyan renkli gözlük', ho: 'Aksesuar', hz: 'Işık' },
    { w: 'Çanta', hc: 'Eşya taşımak için omza veya ele alınan kap', hk: 'Günlük eşya taşınan omuz çantası', ho: 'Günlük eşya', hz: 'Taşıma' },
    { w: 'Anahtarlık', hc: 'Anahtarları bir arada tutan küçük halkalı aksesuar', hk: 'Birden fazla anahtarı bir arada tutan aksesuar', ho: 'Günlük aksesuar', hz: 'Bağlantı' },
    { w: 'Hesap Makinesi', hc: 'Matematiksel işlemleri hızlı yapan tuşlu elektronik alet', hk: 'Matematik işlemleri yapan elektronik alet', ho: 'Elektronik alet', hz: 'Hesap' },
  ],

  spor: [
    { w: 'Okçuluk', hc: 'Yay kullanarak oku hedefe fırlatma sporu', hk: 'Yay ve ok ile hedef vuran spor', ho: 'Nişan sporu', hz: 'Hedef' },
    { w: 'Eskrim', hc: 'Kılıç benzeri alet kullanarak rakiple duello yapılan olimpik spor', hk: 'Kılıçla yapılan olimpik dövüş sporu', ho: 'Dövüş sporu', hz: 'Keskinlik' },
    { w: 'Kürek', hc: 'Kürekle tekneyi ileri götürme yarışma sporu', hk: 'Suда kürekle yapılan yarış sporu', ho: 'Su sporu', hz: 'Güç' },
    { w: 'Triatlon', hc: 'Yüzme bisiklet koşuyu arka arkaya yapan dayanıklılık yarışı', hk: 'Üç sporu arka arkaya yapan yarış', ho: 'Dayanıklılık sporu', hz: 'Üç' },
    { w: 'Ragbi', hc: 'Oval topun elle taşınıp fizikselin yoğun olduğu takım sporu', hk: 'Oval toplu sert temaslı takım sporu', ho: 'Takım sporu', hz: 'Güç' },
    { w: 'Kano', hc: 'Tek kişilik dar teknede kürekle suda ilerleme sporu', hk: 'Dar teknede kürekle nehirde ilerleyen spor', ho: 'Su sporu', hz: 'Akış' },
    { w: 'Halter', hc: 'Ağır demir barbelri kaldırarak yapılan güç sporu', hk: 'Ağır barbell kaldırma güç sporu', ho: 'Güç sporu', hz: 'Ağırlık' },
    { w: 'Jimnastik', hc: 'Esneklik denge ve akrobasi hareketlerinden oluşan spor', hk: 'Esneklik ve denge gerektiren olimpik spor', ho: 'Olimpik spor', hz: 'Esneklik' },
    { w: 'Judo', hc: 'Rakibi tutup yere yatırma üzerine kurulu Japon dövüş sanatı', hk: 'Japon kıyafetli tutma ve yatırma sporu', ho: 'Dövüş sporu', hz: 'Denge' },
    { w: 'Karate', hc: 'El kol ve ayak vuruşlarıyla yapılan Japon savunma sanatı', hk: 'El ve ayak vuruşlarına dayalı Japon dövüş sanatı', ho: 'Dövüş sanatı', hz: 'Disiplin' },
    { w: 'Dart', hc: 'Küçük okçukları tahta hedefe fırlatarak puan toplama oyunu', hk: 'Küçük okları tahta hedefe atma oyunu', ho: 'Nişan oyunu', hz: 'Hedef' },
    { w: 'Bilardo', hc: 'Uzun sopa ile topları yeşil masada deliğe atma oyunu', hk: 'Yeşil masada sopalarla oynanan top oyunu', ho: 'Masa oyunu', hz: 'Hassasiyet' },
    { w: 'Satranç', hc: 'Tahtada 32 farklı taşla oynanan strateji oyunu', hk: '64 kareli tahtada strateji oyunu', ho: 'Strateji oyunu', hz: 'Zeka' },
    { w: 'Golf', hc: 'Sopalarla küçük topu deliğe sokma üzerine kurulu açık alan sporu', hk: 'Çimde sopayla küçük topu deliğe sokan spor', ho: 'Açık alan sporu', hz: 'Hassasiyet' },
    { w: 'Kayak', hc: 'Kar üzerinde uzun tahta veya plastiklerle kayan spor', hk: 'Karlı dağlarda yapılan kış sporu', ho: 'Kış sporu', hz: 'Hız' },
    { w: 'Yüzme', hc: 'Suda kollar ve bacaklarla ilerleyerek yapılan spor', hk: 'Havuz veya açık suda yapılan olimpik spor', ho: 'Su sporu', hz: 'Akış' },
    { w: 'Tenis', hc: 'Raket ve top ile ağ üzerinden karşılıklı vuruşma sporu', hk: 'Raket ve topla oynanan kort sporu', ho: 'Raket sporu', hz: 'Hız' },
    { w: 'Voleybol', hc: 'Altı kişilik takımların ağ üzerinden top vurduğu spor', hk: 'Altı kişilik ağ üzerinden top oyunu', ho: 'Takım sporu', hz: 'Hava' },
    { w: 'Basketbol', hc: 'Beş kişilik takımın yüksek sepete top attığı spor', hk: 'Beş kişilik takımla oynanan top sepet sporu', ho: 'Takım sporu', hz: 'Yükseklik' },
    { w: 'Futbol', hc: 'On bir kişilik takımın ayakla topu kaleye attığı dünya sporu', hk: 'En popüler takım sporu ayakla oynanan', ho: 'Takım sporu', hz: 'Tutku' },
  ],

  doga: [
    { w: 'Şelale', hc: 'Nehrin yüksekten düşerek köpüklü su perdesi oluşturması', hk: 'Yüksekten düşen nehir suyu', ho: 'Doğal su oluşumu', hz: 'Düşüş' },
    { w: 'Buzul', hc: 'Kutup veya dağlarda yüzyıllarca biriken dev buz kütlesi', hk: 'Yavaşça hareket eden dev buz kütlesi', ho: 'Kutup oluşumu', hz: 'Soğuk' },
    { w: 'Mercan Resifi', hc: 'Tropikal denizlerde renkli canlılardan oluşan sualtı ekosistemi', hk: 'Tropikal denizlerin renkli sualtı yapısı', ho: 'Deniz ekosistemi', hz: 'Renk' },
    { w: 'Savanah', hc: 'Afrika\'nın geniş düz otlak arazisi aslanlı fillili', hk: 'Afrika\'nın geniş ot dolu düzlüğü', ho: 'Tropikal alan', hz: 'Genişlik' },
    { w: 'Tundra', hc: 'Kutup çevresinde ağaçsız donmuş topraklı soğuk düzlük', hk: 'Kuzey kutbu çevresinin donmuş çorak düzlüğü', ho: 'Kutup bölgesi', hz: 'Soğuk' },
    { w: 'Gökkuşağı', hc: 'Yağmur sonrası güneşle oluşan yedi renkli yarım daire', hk: 'Yağmur sonrası gökyüzünde oluşan renkli yay', ho: 'Atmosfer olayı', hz: 'Renk' },
    { w: 'Kuzey Işıkları', hc: 'Kuzey kutbunda geceleyin yeşil mor renklerde dans eden ışık perdesi', hk: 'Kutuplarda görülen renkli gece ışıkları', ho: 'Atmosfer olayı', hz: 'Işık' },
    { w: 'Tsunami', hc: 'Deprem sonrası oluşan kıyıyı yutan dev okyanus dalgası', hk: 'Depremle oluşan yıkıcı deniz dalgası', ho: 'Doğal afet', hz: 'Güç' },
    { w: 'Kasırga', hc: 'Deniz üzerinde dönerek ilerleyen yıkıcı fırtına sistemi', hk: 'Dönen rüzgarlardan oluşan şiddetli fırtına', ho: 'Doğal afet', hz: 'Güç' },
    { w: 'Çöl', hc: 'Yıllık yağışın çok az olduğu kum ve kaya kaplı geniş alan', hk: 'Kurak ve kumlu geniş alan', ho: 'Doğal alan', hz: 'Susuzluk' },
    { w: 'Orman', hc: 'Sık ağaçlar ve çeşitli canlılarla dolu yeşil alan', hk: 'Sık ağaçlık yeşil doğal alan', ho: 'Doğal alan', hz: 'Yeşillik' },
    { w: 'Yanardağ', hc: 'İçinden lav ve duman fışkırtan aktif volkanik dağ', hk: 'Lav fışkırtan aktif dağ', ho: 'Jeolojik oluşum', hz: 'Ateş' },
    { w: 'Deprem', hc: 'Yer kabuğunun kayması sonucu oluşan yeryüzü sarsıntısı', hk: 'Yer kabuğunun kaymasıyla oluşan sarsıntı', ho: 'Doğal afet', hz: 'Sarsıntı' },
    { w: 'Meteor', hc: 'Uzaydan düşen göktaşı atmosferde yanan ışıklı çizgi', hk: 'Gökyüzünde yanan uzay kayası', ho: 'Uzay olayı', hz: 'Düşüş' },
    { w: 'Vadi', hc: 'İki dağ arasında kalan derin uzun çukur arazi', hk: 'İki dağ arasındaki uzun çukur alan', ho: 'Coğrafi oluşum', hz: 'Derinlik' },
    { w: 'Mağara', hc: 'Dağ içinde doğal olarak oluşan karanlık boşluk', hk: 'Dağ içindeki doğal karanlık tünel', ho: 'Doğal oluşum', hz: 'Karanlık' },
    { w: 'Okyanus', hc: 'Dünya yüzeyinin büyük bölümünü kaplayan tuzlu dev su kütlesi', hk: 'Dünyayı kaplayan büyük tuzlu su kütlesi', ho: 'Su kütlesi', hz: 'Sonsuzluk' },
    { w: 'Dağ', hc: 'Etrafına göre çok yükselen sarp kayalık arazi şekli', hk: 'Yüksek ve sarp doğal arazi oluşumu', ho: 'Coğrafi oluşum', hz: 'Yükseklik' },
    { w: 'Göl', hc: 'Etrafı kara ile çevrili durgun tatlı su kütlesi', hk: 'Etrafı karayla çevrili durgun su', ho: 'Su kütlesi', hz: 'Durgunluk' },
    { w: 'Erozyon', hc: 'Rüzgar ve yağmurun toprağı yavaşça aşındırması', hk: 'Doğa güçlerinin toprağı aşındırması', ho: 'Doğal süreç', hz: 'Zaman' },
  ],

  teknoloji: [
    { w: 'Yapay Zeka', hc: 'Bilgisayarın insan gibi düşünüp öğrenmesini sağlayan teknoloji', hk: 'Makinelerin insan gibi öğrenmesi', ho: 'İleri teknoloji', hz: 'Gelecek' },
    { w: 'Drone', hc: 'Uzaktan kumandalı dört pervaneli küçük insansız uçan araç', hk: 'Uzaktan kumandalı insansız uçan araç', ho: 'Hava aracı', hz: 'Uçuş' },
    { w: '3D Yazıcı', hc: 'Dijital tasarımı katman katman malzeme ekleyerek gerçek nesneye dönüştüren makine', hk: 'Dijital modeli fiziksel nesneye dönüştüren makine', ho: 'Üretim teknolojisi', hz: 'Yaratıcılık' },
    { w: 'Sanal Gerçeklik', hc: 'Gözlük takınca gerçekmiş gibi hissettiren dijital dünya', hk: 'Gözlükle girilen tamamen dijital ortam', ho: 'Dijital teknoloji', hz: 'Yanılsama' },
    { w: 'Blockchain', hc: 'Verilerin değiştirilemez zincir bloklar halinde saklandığı dağıtık sistem', hk: 'Şifreli ve değiştirilemez veri zinciri sistemi', ho: 'Veri teknolojisi', hz: 'Güven' },
    { w: 'Kripto Para', hc: 'Merkez bankası olmayan şifreli dijital para birimi', hk: 'Dijital ve merkeziyetsiz para sistemi', ho: 'Dijital finans', hz: 'Değer' },
    { w: 'Bulut Bilişim', hc: 'Dosya ve programların kendi bilgisayarın yerine internet üzerinde saklanması', hk: 'Verilerin internet üzerinde depolanması', ho: 'İnternet teknolojisi', hz: 'Bulut' },
    { w: 'Siber Güvenlik', hc: 'Bilgisayar sistemlerini hackerlardan ve saldırılardan koruyan alan', hk: 'Dijital sistemleri saldırılardan koruyan alan', ho: 'Güvenlik teknolojisi', hz: 'Koruma' },
    { w: 'Hologram', hc: 'Havada üç boyutlu görüntü oluşturan lazer ışığı teknolojisi', hk: 'Havada görünen üç boyutlu ışık görüntüsü', ho: 'Görüntü teknolojisi', hz: 'Işık' },
    { w: 'Nanoteknoloji', hc: 'Atomlar ve moleküller düzeyinde madde manipüle eden bilim dalı', hk: 'Atomik ölçekte madde üzerinde çalışan teknoloji', ho: 'İleri bilim', hz: 'Küçüklük' },
    { w: 'Kuantum Bilgisayar', hc: 'Kuantum fiziği kullanarak klasik bilgisayardan trilyon kat hızlı işlem yapan', hk: 'Kuantum fiziğiyle çalışan süper hızlı bilgisayar', ho: 'İleri bilgisayar', hz: 'Hız' },
    { w: 'Biyometri', hc: 'Parmak izi yüz tarama gibi fiziksel özelliklerle kimlik doğrulama', hk: 'Parmak izi ve yüzle kimlik doğrulama', ho: 'Güvenlik teknolojisi', hz: 'Kimlik' },
    { w: 'Akıllı Ev', hc: 'Telefon ve sesle kontrol edilen otomatik aydınlatma ısıtma güvenlik sistemi', hk: 'Telefonla yönetilen otomatik ev sistemi', ho: 'Otomasyon', hz: 'Konfor' },
    { w: 'Fiber Optik', hc: 'Işık hızında veri ileten ince cam kablo internet altyapısı', hk: 'Işıkla veri ileten cam kablo sistemi', ho: 'İletişim teknolojisi', hz: 'Hız' },
    { w: 'Lazer', hc: 'Tek frekanslı yoğun ışık demeti üreten cihaz', hk: 'Yoğun tek renkli ışık üreten cihaz', ho: 'Işık teknolojisi', hz: 'Keskinlik' },
    { w: 'Uydu', hc: 'Dünya çevresinde dönerek iletişim GPS hava durumu sağlayan uzay aracı', hk: 'Dünya yörüngesinde dönen yapay uzay cismi', ho: 'Uzay teknolojisi', hz: 'Bağlantı' },
    { w: 'Artırılmış Gerçeklik', hc: 'Gerçek dünya görüntüsüne dijital bilgi ve nesneler ekleyen teknoloji', hk: 'Gerçek dünyaya dijital katman ekleyen teknoloji', ho: 'Dijital teknoloji', hz: 'Katman' },
    { w: 'Mikroçip', hc: 'Milyonlarca transistör içeren küçük silikon entegre devre', hk: 'Elektronik cihazların beyni küçük devre', ho: 'Elektronik bileşen', hz: 'Küçüklük' },
    { w: 'Bluetooth', hc: 'Kısa mesafede kablosuz cihaz bağlantısı sağlayan radyo teknolojisi', hk: 'Kısa mesafeli kablosuz bağlantı teknolojisi', ho: 'Kablosuz teknoloji', hz: 'Bağlantı' },
    { w: 'Wi-Fi', hc: 'Router üzerinden havadan internet bağlantısı sağlayan kablosuz ağ', hk: 'Kablosuz internet bağlantı teknolojisi', ho: 'İnternet teknolojisi', hz: 'Bağlantı' },
  ],

  sanat: [
    { w: 'Ebru', hc: 'Su yüzeyinde boyalarla yapılan mermer görünümlü Türk sanatı', hk: 'Su yüzeyinde yapılan Türk boyama sanatı', ho: 'Geleneksel Türk sanatı', hz: 'Su' },
    { w: 'Hat', hc: 'Arap alfabesiyle kaligrafi yapılan İslam sanatı', hk: 'Arap harfleriyle yapılan kaligrafi sanatı', ho: 'Geleneksel sanat', hz: 'Yazı' },
    { w: 'Origami', hc: 'Kağıdı katlamakla hayvan ve şekil yapılan Japon sanatı', hk: 'Kağıt katlama Japon sanatı', ho: 'El sanatı', hz: 'Katlama' },
    { w: 'Graffiti', hc: 'Duvarlara sprey boya ile yapılan sokak sanatı', hk: 'Duvar ve yüzeylere yapılan sokak sanatı', ho: 'Sokak sanatı', hz: 'Renk' },
    { w: 'Animasyon', hc: 'Ardışık kareler halinde çizilen hareketli film', hk: 'Çizimlerden oluşan hareketli film sanatı', ho: 'Dijital sanat', hz: 'Hareket' },
    { w: 'Opera', hc: 'Tüm diyalogların şarkıyla söylendiği klasik sahne sanatı', hk: 'Her şeyin şarkıyla anlatıldığı tiyatro türü', ho: 'Sahne sanatı', hz: 'Ses' },
    { w: 'Bale', hc: 'Uçucu kostümlerle parmak ucunda dans edilen klasik sahne sanatı', hk: 'Parmak ucunda yapılan klasik dans sanatı', ho: 'Dans sanatı', hz: 'Zarafet' },
    { w: 'Caz', hc: 'Doğaçlama enstrüman soloları ile Amerika\'dan çıkan müzik türü', hk: 'Doğaçlamaya dayalı Amerikan müzik türü', ho: 'Müzik türü', hz: 'Özgürlük' },
    { w: 'Flamenco', hc: 'Ayak vurmaları ve el çırpmaları olan İspanyol dans müziği', hk: 'Ayak vurmalı İspanyol dans sanatı', ho: 'Dans sanatı', hz: 'Tutku' },
    { w: 'Kabuki', hc: 'Yüzü boyalı kostümlü Japon geleneksel tiyatro sanatı', hk: 'Boyalı yüzlü geleneksel Japon tiyatrosu', ho: 'Geleneksel tiyatro', hz: 'Maske' },
    { w: 'Heykel', hc: 'Taş mermer veya metalden yapılan üç boyutlu sanat eseri', hk: 'Taştan veya metalden yapılan 3 boyutlu sanat', ho: 'Görsel sanat', hz: 'Şekil' },
    { w: 'Fotoğraf', hc: 'Işığı yüzeye kayıt ederek anı donduran görsel sanat', hk: 'Anı donduran görsel kayıt sanatı', ho: 'Görsel sanat', hz: 'An' },
    { w: 'Karikatür', hc: 'Kişi ve olayları abartarak çizen mizahi çizgi sanatı', hk: 'Abartılı çizimlerle mizah yapan sanat', ho: 'Çizgi sanatı', hz: 'Mizah' },
    { w: 'Sirk', hc: 'Akrobat palyaço ve hayvan gösterilerinin yapıldığı çadır eğlencesi', hk: 'Akrobat ve palyaçoların gösteriş yaptığı eğlence', ho: 'Gösteri sanatı', hz: 'Heyecan' },
    { w: 'Belgesel', hc: 'Gerçek olayları kamera ile kayıt eden bilgilendirici film türü', hk: 'Gerçek hayatı anlatan film türü', ho: 'Film türü', hz: 'Gerçek' },
    { w: 'Resim', hc: 'Tuval veya kağıda boya ile yapılan görsel sanat eseri', hk: 'Boya ile tuvale yapılan görsel sanat', ho: 'Görsel sanat', hz: 'Renk' },
    { w: 'Tiyatro', hc: 'Sahnede aktörlerin canlı seyirciye oyun oynadığı gösteri sanatı', hk: 'Sahnede canlı oynanan gösteri sanatı', ho: 'Sahne sanatı', hz: 'Oyun' },
    { w: 'Sinema', hc: 'Büyük perdede gösterilen hareketli görüntü sanatı', hk: 'Büyük perdede izlenen film sanatı', ho: 'Görsel sanat', hz: 'Karanlık' },
    { w: 'Mimari', hc: 'Bina ve yapıları tasarlayan hem sanat hem mühendislik dalı', hk: 'Yapı ve binaları tasarlayan sanat dalı', ho: 'Tasarım sanatı', hz: 'Yapı' },
    { w: 'Tezhip', hc: 'El yazması kitaplara altın ve renkli boyayla yapılan süsleme sanatı', hk: 'El yazmalarına altınla yapılan süsleme sanatı', ho: 'Geleneksel Türk sanatı', hz: 'Süsleme' },
  ],

  tarih: [
    { w: 'Fetih', hc: 'Orduyla bir şehri veya ülkeyi ele geçirme', hk: 'Askeri güçle toprak ele geçirme', ho: 'Tarihi olay', hz: 'Güç' },
    { w: 'Rönesans', hc: '15. yüzyılda İtalya\'da başlayan sanat ve bilim yeniden doğuşu', hk: 'Avrupa\'da sanat ve bilimin yeniden canlanma dönemi', ho: 'Tarihi dönem', hz: 'Yenilik' },
    { w: 'İpek Yolu', hc: 'Çin\'den Avrupa\'ya uzanan tarihi ticaret yolu güzergahı', hk: 'Çin ile Avrupa\'yı birleştiren tarihi ticaret yolu', ho: 'Tarihi ticaret yolu', hz: 'Bağlantı' },
    { w: 'Haçlı Seferi', hc: 'Orta çağda Avrupalı Hristiyanların Kudüs için düzenlediği savaş', hk: 'Orta çağda dini amaçlı düzenlenen savaş seferleri', ho: 'Tarihi savaş', hz: 'İnanç' },
    { w: 'Sanayi Devrimi', hc: '18. yüzyılda İngiltere\'de başlayan buhar gücü ile fabrika üretimi dönemi', hk: 'Buhar makinesiyle başlayan üretim devrimi', ho: 'Tarihi dönem', hz: 'Değişim' },
    { w: 'Gladyatör', hc: 'Roma arenasında seyirci önünde can pahasına dövüşen köle savaşçı', hk: 'Roma arenasında dövüşen köle savaşçı', ho: 'Roma tarihi', hz: 'Güç' },
    { w: 'Matbaa', hc: 'Gutenberg\'in kitapları basıp çoğaltmayı sağlayan icat ettiği makine', hk: 'Kitap basmayı mümkün kılan tarihi icat', ho: 'Tarihi icat', hz: 'Bilgi' },
    { w: 'Barut', hc: 'Silah ve topları ateşlemek için kullanılan patlayıcı madde', hk: 'Silahları ateşleyen patlayıcı madde', ho: 'Tarihi icat', hz: 'Patlama' },
    { w: 'Soğuk Savaş', hc: 'ABD ile SSCB arasındaki ideolojik ve silahlanma yarışı dönemi', hk: 'Amerika ile Sovyetler arası gerilim dönemi', ho: 'Modern tarih', hz: 'Gerilim' },
    { w: 'Sömürgecilik', hc: 'Güçlü ülkelerin zayıf ülkeleri işgal edip sömürdüğü dönem', hk: 'Güçlü devletlerin zayıf toprakları işgali', ho: 'Tarihi dönem', hz: 'Güç' },
    { w: 'Arkeoloji', hc: 'Toprak kazarak eski uygarlıkların kalıntılarını inceleyen bilim', hk: 'Tarihi kalıntıları kazıp inceleyen bilim dalı', ho: 'Bilim dalı', hz: 'Geçmiş' },
    { w: 'Hiyeroglif', hc: 'Eski Mısırlıların resim ve sembollerle yazdığı yazı sistemi', hk: 'Eski Mısır\'ın sembol yazı sistemi', ho: 'Eski yazı sistemi', hz: 'Sembol' },
    { w: 'Ferman', hc: 'Osmanlı padişahının mühürlü resmi emir belgesi', hk: 'Osmanlı padişahının resmi yazılı emri', ho: 'Tarihi belge', hz: 'Emir' },
    { w: 'Devrim', hc: 'Mevcut sistemi yıkıp yeni bir düzen kuran köklü toplumsal değişim', hk: 'Eski düzeni yıkan köklü toplumsal değişim', ho: 'Tarihi olay', hz: 'Değişim' },
    { w: 'İmparatorluk', hc: 'Çok geniş toprakları bir hükümdar altında toplayan büyük devlet', hk: 'Çok geniş toprakları yöneten büyük devlet yapısı', ho: 'Devlet yapısı', hz: 'Büyüklük' },
    { w: 'Uzay Yarışı', hc: 'ABD ve SSCB\'nin birbirine karşı uzaya ilk gitme yarışması', hk: 'Amerika ve Sovyetlerin uzay keşif yarışı', ho: 'Modern tarih', hz: 'Rekabet' },
    { w: 'Pusula', hc: 'Manyetik kuzey yönünü göstererek denizciliği değiştiren icat', hk: 'Denizciliği değiştiren yön bulan tarihi alet', ho: 'Tarihi icat', hz: 'Yön' },
    { w: 'Kılıç', hc: 'Savaşçıların kullandığı uzun keskin metal bıçak silah', hk: 'Savaşçıların kullandığı uzun metal silah', ho: 'Tarihi silah', hz: 'Keskinlik' },
    { w: 'Kale', hc: 'Düşmana karşı surlarla çevrili savunma amaçlı tarihi yapı', hk: 'Surlarla çevrilen tarihi savunma yapısı', ho: 'Tarihi yapı', hz: 'Savunma' },
    { w: 'Göç', hc: 'Toplulukların daha iyi yaşam için yurtlarından başka yere gitmesi', hk: 'İnsanların toplu olarak yer değiştirmesi', ho: 'Tarihi olay', hz: 'Hareket' },
  ],

  ulkeler: [
    { w: 'Japonya', hc: 'Çiçek festivallerinin samuray kültürünün teknolojinin ada ülkesi', hk: 'Samuray ve teknolojinin buluştuğu ada ülkesi', ho: 'Asya ülkesi', hz: 'Doğu' },
    { w: 'Brezilya', hc: 'Karnavalın Amazon ormanının futbol tutkusunun anavatanı', hk: 'Karnaval ve futbolun ülkesi', ho: 'Güney Amerika ülkesi', hz: 'Tropikal' },
    { w: 'Norveç', hc: 'Fiyortların kuzey ışıklarının ve yüksek yaşam kalitesinin ülkesi', hk: 'Fiyortlar ve kuzey ışıklarıyla ünlü İskandinav ülkesi', ho: 'Kuzey Avrupa ülkesi', hz: 'Soğuk' },
    { w: 'Mısır', hc: 'Piramitlerin Sfenks\'in Nil nehrinin bulunduğu Kuzey Afrika ülkesi', hk: 'Piramitler ve firavunlarla ünlü ülke', ho: 'Afrika ülkesi', hz: 'Antik' },
    { w: 'Hindistan', hc: 'Tac Mahal\'in baharatların Bollywood\'un köri yemeğinin ülkesi', hk: 'Tac Mahal ve baharatların ülkesi', ho: 'Güney Asya ülkesi', hz: 'Renkli' },
    { w: 'Arjantin', hc: 'Tango dansının Patagunya\'nın ve son dünya kupasının ülkesi', hk: 'Tango ve futbolun güney Amerika ülkesi', ho: 'Güney Amerika ülkesi', hz: 'Tutku' },
    { w: 'İzlanda', hc: 'Aktif yanardağların jeotermal suyun kuzey ışıklarının küçük ada ülkesi', hk: 'Yanardağlar ve kuzey ışıklarının ada ülkesi', ho: 'Kuzey Atlantik ülkesi', hz: 'Buz' },
    { w: 'Fas', hc: 'Medine çarşılarının Sahra çölünün ve Arap Berber kültürünün ülkesi', hk: 'Sahra ve rengarenk çarşılarıyla Kuzey Afrika ülkesi', ho: 'Kuzey Afrika ülkesi', hz: 'Kum' },
    { w: 'Peru', hc: 'Machu Picchu\'nun İnka uygarlığının Amazon\'un Andes\'in ülkesi', hk: 'Machu Picchu ve İnka mirasının ülkesi', ho: 'Güney Amerika ülkesi', hz: 'Antik' },
    { w: 'Yeni Zelanda', hc: 'Hobbit çekimlerinin kivi meyvesinin Maori kültürünün ada ülkesi', hk: 'Maori kültürünün yeşil ada ülkesi', ho: 'Okyanusya ülkesi', hz: 'Yeşil' },
    { w: 'Etiyopya', hc: 'Afrika\'nın en eski devletinin kahvenin anavatanının ülkesi', hk: 'Afrika\'nın en eski devleti ve kahvenin anavatanı', ho: 'Afrika ülkesi', hz: 'Antik' },
    { w: 'İsveç', hc: 'IKEA\'nın Volvo\'nun Nobel ödülünün sarışın insanların ülkesi', hk: 'Nobel ödülünün ve IKEA\'nın İskandinav ülkesi', ho: 'Kuzey Avrupa ülkesi', hz: 'Düzen' },
    { w: 'Küba', hc: 'Puroların savanın eski Amerikan arabalarının ada ülkesi', hk: 'Puro ve salsa müziğinin Karayip ada ülkesi', ho: 'Karayip ülkesi', hz: 'Sıcak' },
    { w: 'İran', hc: 'Pers uygarlığının halıların safranın ve petrolün ülkesi', hk: 'Antik Pers uygarlığının ve halıların ülkesi', ho: 'Orta Doğu ülkesi', hz: 'Antik' },
    { w: 'Yunanistan', hc: 'Demokrasinin felsefenin olimpiyatların mitolojinin anavatanı', hk: 'Antik felsefenin ve olimpiyatların anavatanı', ho: 'Güney Avrupa ülkesi', hz: 'Antik' },
    { w: 'Meksika', hc: 'Azteklerin tacos\'un tekila\'nın Dia de los Muertos\'un ülkesi', hk: 'Aztek mirası ve canlı kültürü olan ülke', ho: 'Orta Amerika ülkesi', hz: 'Canlı' },
    { w: 'Portekiz', hc: 'Fado müziğinin keşiflerin çağının pasteis de nata\'nın ülkesi', hk: 'Büyük coğrafi keşiflerin başladığı ülke', ho: 'Batı Avrupa ülkesi', hz: 'Deniz' },
    { w: 'Endonezya', hc: 'Binlerce adanın Bali\'nin Orangutan\'ın dünyanın en kalabalık dördüncüsü', hk: 'Binlerce adadan oluşan Güneydoğu Asya ülkesi', ho: 'Asya ülkesi', hz: 'Ada' },
    { w: 'Kanada', hc: 'Akçaağaç şurubu hokeyinin uzak doğanın ve çok kültürlülüğün ülkesi', hk: 'Akçaağaç yaprağı ve hokeyin soğuk ülkesi', ho: 'Kuzey Amerika ülkesi', hz: 'Soğuk' },
    { w: 'Avustralya', hc: 'Kanguru koala Sydney Opera binası ve korkunç örümceklerin ülkesi', hk: 'Kanguru ve koalanın yaşadığı kıta ülkesi', ho: 'Okyanusya ülkesi', hz: 'Uzak' },
  ],

  film_dizi: [
    { w: 'Aksiyon Filmi', hc: 'Patlama dövüş ve araba kovalamacası olan hızlı tempolu film', hk: 'Patlama ve dövüş sahneli hızlı film türü', ho: 'Film türü', hz: 'Hız' },
    { w: 'Korku Filmi', hc: 'İzleyeni ürküten canavar hayalet veya katil içeren film', hk: 'İzleyende korku yaratan film türü', ho: 'Film türü', hz: 'Karanlık' },
    { w: 'Romantik Komedi', hc: 'Aşk ve gülmecenin birleştiği mutlu sonla biten film', hk: 'Aşk ve mizahın bir arada olduğu film türü', ho: 'Film türü', hz: 'Aşk' },
    { w: 'Belgesel', hc: 'Gerçek olayları kamera kayıt eden eğitici bilgilendirici film', hk: 'Gerçek hayatı anlatan bilgilendirici film', ho: 'Film türü', hz: 'Gerçek' },
    { w: 'Animasyon', hc: 'Çizgi veya bilgisayar grafiğiyle yapılan hareketli film', hk: 'Çizimlerle yapılan hareketli film türü', ho: 'Film türü', hz: 'Çizgi' },
    { w: 'Bilim Kurgu', hc: 'Uzay seyahati robot ve gelecek teknolojilerini konu alan film', hk: 'Uzay ve gelecek teknolojilerini konu alan film', ho: 'Film türü', hz: 'Gelecek' },
    { w: 'Polisiye Dizi', hc: 'Her bölümde cinayet veya suç çözülen dedektif odaklı dizi', hk: 'Suç çözmeye odaklı dedektif dizisi', ho: 'Dizi türü', hz: 'Gizem' },
    { w: 'Fantezi', hc: 'Büyü ejderha ve farklı dünyaların olduğu hayal gücüne dayalı film', hk: 'Büyü ve mitolojik varlıkların olduğu film türü', ho: 'Film türü', hz: 'Hayal' },
    { w: 'Dram', hc: 'Karakterlerin duygusal çatışma ve zorluklarını işleyen ciddi film', hk: 'Duygusal ve ciddi konuları işleyen film türü', ho: 'Film türü', hz: 'Duygu' },
    { w: 'Gerilim', hc: 'İzleyiciyi gergin tutmak için sürpriz ve tehlike kullanan film', hk: 'Sürekli gerilim yaratan heyecanlı film türü', ho: 'Film türü', hz: 'Gerilim' },
    { w: 'Müzikal', hc: 'Karakterlerin konuşmak yerine şarkı söyleyip dans ettiği film', hk: 'Şarkı ve dans ile anlatılan film türü', ho: 'Film türü', hz: 'Müzik' },
    { w: 'Biyografi', hc: 'Gerçek bir kişinin yaşamını konu alan film veya dizi', hk: 'Gerçek kişinin hayatını anlatan film', ho: 'Film türü', hz: 'Gerçek' },
    { w: 'Western', hc: 'Kovboy at ve Vahşi Batı temalı Amerikan film türü', hk: 'Kovboy ve çöl temalı Amerikan film türü', ho: 'Film türü', hz: 'Çöl' },
    { w: 'Süper Kahraman', hc: 'Özel güçleri olan kahraman kötülere karşı şehri kurtarır', hk: 'Özel güçlü kahramanın kötülerle savaştığı film', ho: 'Film türü', hz: 'Güç' },
    { w: 'Anime', hc: 'Japonya yapımı kendine özgü çizim stiline sahip animasyon', hk: 'Japon çizim stilindeki animasyon türü', ho: 'Animasyon türü', hz: 'Japon' },
    { w: 'Mini Dizi', hc: 'Belirli sayıda bölümde tamamlanan kısa format dizi', hk: 'Az bölümde tamamlanan kısa dizi formatı', ho: 'Dizi formatı', hz: 'Kısa' },
    { w: 'Tarihi Dizi', hc: 'Geçmiş bir dönemin kostüm ve mekanlarıyla çekilen dizi', hk: 'Tarihi dönemde geçen kostümlü dizi', ho: 'Dizi türü', hz: 'Geçmiş' },
    { w: 'Kara Komedi', hc: 'Ölüm trajedi gibi karanlık konuları güldürü yoluyla işleyen film', hk: 'Karanlık konuları mizahla işleyen film türü', ho: 'Film türü', hz: 'Karanlık' },
    { w: 'Macera', hc: 'Keşif yolculuk ve tehlikeli görevleri içeren heyecanlı film', hk: 'Yolculuk ve keşiflerle dolu heyecanlı film', ho: 'Film türü', hz: 'Keşif' },
    { w: 'Savaş Filmi', hc: 'Gerçek veya kurgusal savaş sahnelerini anlatan film türü', hk: 'Savaş sahnelerini konu alan film türü', ho: 'Film türü', hz: 'Savaş' },
  ],

  muzik: [
    { w: 'Gitar', hc: 'Altı telli, parmakla veya mızrapla çalınan yaylı çalgı', hk: 'Altı telli parmakla çalınan yaygın çalgı', ho: 'Yaylı çalgı', hz: 'Tel' },
    { w: 'Piyano', hc: 'Tuşlara basılınca teller titreşen büyük klavyeli çalgı', hk: 'Tuşlarla çalınan büyük klavyeli çalgı', ho: 'Klavyeli çalgı', hz: 'Tuş' },
    { w: 'Keman', hc: 'Yay ile çalınan dört telli küçük klasik müzik çalgısı', hk: 'Yay ile çalınan dört telli çalgı', ho: 'Klasik çalgı', hz: 'Tel' },
    { w: 'Davul', hc: 'İki tokmakla vurulan büyük silindirik ritim çalgısı', hk: 'Tokmakla vurulan büyük ritim çalgısı', ho: 'Vurmalı çalgı', hz: 'Ritim' },
    { w: 'Bağlama', hc: 'Uzun saplı Türk halk müziğinin telli milli çalgısı', hk: 'Türk halk müziğinin milli telli çalgısı', ho: 'Türk çalgısı', hz: 'Gelenek' },
    { w: 'Ney', hc: 'Kamıştan yapılan üflemeli tasavvuf müziğinin çalgısı', hk: 'Kamıştan yapılan Türk tasavvuf çalgısı', ho: 'Üflemeli çalgı', hz: 'Ruh' },
    { w: 'Ud', hc: 'Armut gövdeli perdесiz Arap ve Türk müziğinin telli çalgısı', hk: 'Armut şekilli Doğu müziğinin telli çalgısı', ho: 'Doğu çalgısı', hz: 'Gelenek' },
    { w: 'Akordeon', hc: 'İki elde tutulan körük sistemi ve tuşlarla çalınan çalgı', hk: 'Körük sistemiyle çalınan tuşlu çalgı', ho: 'Nefesli çalgı', hz: 'Körük' },
    { w: 'Trompet', hc: 'Üfleyerek ve tuşlara basarak çalınan parlak metal nefesli çalgı', hk: 'Parlak metal üflemeli nefesli çalgı', ho: 'Nefesli çalgı', hz: 'Parlak' },
    { w: 'Saksofon', hc: 'Caza özgü metal gövdeli kamışlı nefesli çalgı', hk: 'Cazın simgesi metal kamışlı nefesli çalgı', ho: 'Nefesli çalgı', hz: 'Caz' },
    { w: 'Bateri', hc: 'Birden fazla davul ve zil içeren çok parçalı ritim seti', hk: 'Çok parçalı profesyonel ritim çalgı seti', ho: 'Vurmalı çalgı', hz: 'Ritim' },
    { w: 'Flüt', hc: 'Yanlamasına tutulup üflenerek çalınan ince metal nefesli çalgı', hk: 'Yanlamasına üflenen ince nefesli çalgı', ho: 'Nefesli çalgı', hz: 'İncelik' },
    { w: 'Arpa', hc: 'Üçgen gövdeli çok telli büyük klasik müzik çalgısı', hk: 'Üçgen büyük gövdeli çok telli çalgı', ho: 'Klasik çalgı', hz: 'Zarafet' },
    { w: 'Sitar', hc: 'Uzun saplı çok telli Hint klasik müziğinin telli çalgısı', hk: 'Uzun saplı Hint müziğinin telli çalgısı', ho: 'Hint çalgısı', hz: 'Doğu' },
    { w: 'Gayda', hc: 'Hava kesesi ve borulardan oluşan İskoç halk müziği çalgısı', hk: 'Hava keseli İskoç halk çalgısı', ho: 'Halk çalgısı', hz: 'Rüzgar' },
    { w: 'Tuba', hc: 'Orkestranın en büyük ve en kalın sesli nefesli bakır çalgısı', hk: 'Orkestranın en büyük nefesli çalgısı', ho: 'Nefesli çalgı', hz: 'Büyüklük' },
    { w: 'Kanun', hc: 'Yatay tutulan çok telli Türk klasik müziği çalgısı', hk: 'Yatay çok telli Türk klasik müzik çalgısı', ho: 'Türk klasik çalgısı', hz: 'Tel' },
    { w: 'Didgeridoo', hc: 'Avustralya yerlilerinin uzun ahşap borulu üflemeli çalgısı', hk: 'Avustralya yerlilerinin uzun boru çalgısı', ho: 'Geleneksel çalgı', hz: 'Uzak' },
    { w: 'Bas Gitar', hc: 'Bandın en düşük ve kalın sesini üreten elektrikli dört telli çalgı', hk: 'Düşük ses üreten dört telli elektrikli çalgı', ho: 'Elektrikli çalgı', hz: 'Derinlik' },
    { w: 'Mandolin', hc: 'Sekiz telli küçük armut gövdeli mızrapla çalınan çalgı', hk: 'Küçük gövdeli sekiz telli mızrap çalgısı', ho: 'Telli çalgı', hz: 'Küçüklük' },
  ],

  bilim: [
    { w: 'Kara Delik', hc: 'Işığın bile kaçamadığı sonsuz çekim gücüne sahip uzay cismi', hk: 'Işığı bile içine çeken uzay oluşumu', ho: 'Uzay fenomeni', hz: 'Karanlık' },
    { w: 'DNA', hc: 'Canlıların kalıtsal bilgisini taşıyan çift sarmal molekül', hk: 'Kalıtsal bilgiyi taşıyan çift sarmal yapı', ho: 'Biyoloji kavramı', hz: 'Kod' },
    { w: 'Fotosentez', hc: 'Bitkilerin güneş ışığını kullanarak karbondioksiti besin ve oksijene çevirmesi', hk: 'Bitkilerin güneş ışığıyla besin üretmesi', ho: 'Biyoloji süreci', hz: 'Işık' },
    { w: 'Evrim', hc: 'Canlıların milyonlarca yılda doğal seçilimle değişip dönüşmesi', hk: 'Canlıların nesiller boyu değişip gelişmesi', ho: 'Biyoloji teorisi', hz: 'Değişim' },
    { w: 'Yerçekimi', hc: 'Kütlelerin birbirini çeken temel fizik kuvveti', hk: 'Nesneleri yere çeken temel kuvvet', ho: 'Fizik kavramı', hz: 'Düşüş' },
    { w: 'Atom', hc: 'Maddenin kimyasal özelliğini koruyan en küçük parçası', hk: 'Maddenin en küçük kimyasal birimi', ho: 'Kimya kavramı', hz: 'Küçüklük' },
    { w: 'Gen', hc: 'DNA üzerinde kalıtsal özellikleri belirleyen kod bölgesi', hk: 'Kalıtsal özellikleri taşıyan DNA bölgesi', ho: 'Biyoloji kavramı', hz: 'Miras' },
    { w: 'Entropi', hc: 'Sistemlerin zamanla düzensizliğe doğru gitme eğilimi', hk: 'Düzenden düzensizliğe gidiş eğilimi', ho: 'Fizik kavramı', hz: 'Düzensizlik' },
    { w: 'Antikor', hc: 'Bağışıklık sisteminin ürettiği yabancı madde tanıyan protein', hk: 'Bağışıklık sisteminin hastalıkla savaşan proteini', ho: 'Biyoloji kavramı', hz: 'Savunma' },
    { w: 'Sinaps', hc: 'İki nöron arasında sinyal iletimini sağlayan bağlantı noktası', hk: 'Nöronlar arasındaki sinyal geçiş noktası', ho: 'Nöroloji kavramı', hz: 'Bağlantı' },
    { w: 'Radyasyon', hc: 'Atom çekirdeğinden salınan yüksek enerjili parçacık veya dalga', hk: 'Atomdan salınan yüksek enerjili ışıma', ho: 'Fizik kavramı', hz: 'Enerji' },
    { w: 'Ekosistem', hc: 'Canlılar ve çevrelerinin oluşturduğu karşılıklı bağımlı sistem', hk: 'Canlılar ve ortamlarının oluşturduğu sistem', ho: 'Ekoloji kavramı', hz: 'Denge' },
    { w: 'Kuantum', hc: 'Enerji ve maddenin en küçük ayrık birim miktarı fizik teorisi', hk: 'Atom altı parçacıkları inceleyen fizik dalı', ho: 'Fizik kavramı', hz: 'Belirsizlik' },
    { w: 'Görelilik', hc: 'Zamanın ve uzayın gözlemciye göre değiştiği Einstein teorisi', hk: 'Zamanın göreli olduğunu söyleyen Einstein teorisi', ho: 'Fizik teorisi', hz: 'Zaman' },
    { w: 'Kataliz', hc: 'Kendisi değişmeden kimyasal tepkimeyi hızlandıran madde etkisi', hk: 'Kimyasal tepkimeleri hızlandıran etki', ho: 'Kimya kavramı', hz: 'Hız' },
    { w: 'Termodinamik', hc: 'Isı enerji ve iş arasındaki ilişkileri inceleyen fizik dalı', hk: 'Isı ve enerji ilişkilerini inceleyen fizik dalı', ho: 'Fizik dalı', hz: 'Isı' },
    { w: 'Hücre', hc: 'Tüm canlıların temel yapı ve işlev birimi', hk: 'Canlıların en küçük yaşayan birimi', ho: 'Biyoloji kavramı', hz: 'Temel' },
    { w: 'Karanlık Madde', hc: 'Evrenin büyük bölümünü oluşturan ama görülemeyen madde', hk: 'Görünmez ama evreni şekillendiren madde', ho: 'Astrofizik kavramı', hz: 'Gizem' },
    { w: 'Işık Hızı', hc: 'Saniyede 300.000 kilometre olan evrendeki maksimum hız', hk: 'Evrende ulaşılabilecek maksimum hız', ho: 'Fizik sabiti', hz: 'Hız' },
    { w: 'Elektromanyetizma', hc: 'Elektrik ve manyetizmanın birleşik temel fizik kuvveti', hk: 'Elektrik ve manyetizmanın birleşik kuvveti', ho: 'Fizik kavramı', hz: 'Kuvvet' },
  ],

  mitoloji: [
    { w: 'Zeus', hc: 'Olympos tanrılarının babası şimşek ve yıldırım tanrısı', hk: 'Yunan mitolojisinin en güçlü tanrısı', ho: 'Yunan mitolojisi', hz: 'Güç' },
    { w: 'Medusa', hc: 'Yılan saçlı bakışı taşa çeviren Yunan mitolojisinin canavarı', hk: 'Bakışı taşa çeviren yılan saçlı mitolojik canavar', ho: 'Yunan mitolojisi', hz: 'Korku' },
    { w: 'Pegasus', hc: 'Yunan mitolojisinin kanatlı uçan beyaz atı', hk: 'Kanatlı uçan mitolojik at', ho: 'Yunan mitolojisi', hz: 'Özgürlük' },
    { w: 'Minotaur', hc: 'İnsan vücutlu boğa başlı Girit labirentinde yaşayan canavar', hk: 'Boğa başlı insan gövdeli labirent canavarı', ho: 'Yunan mitolojisi', hz: 'Karışım' },
    { w: 'Feniks', hc: 'Küllerinden yeniden doğan mitolojik ateş kuşu', hk: 'Yanıp külünden yeniden doğan mitolojik kuş', ho: 'Mitolojik yaratık', hz: 'Yenilenme' },
    { w: 'Ejderha', hc: 'Ateş püskürten uçan devasa kanatlı sürüngen mitolojik yaratık', hk: 'Ateş üfleyen uçan mitolojik yaratık', ho: 'Mitolojik yaratık', hz: 'Ateş' },
    { w: 'Titan', hc: 'Yunan mitolojisinde olimposlu tanrılardan önceki dev güçlü varlıklar', hk: 'Yunan mitolojisinde olimpos öncesi dev varlıklar', ho: 'Yunan mitolojisi', hz: 'Büyüklük' },
    { w: 'Prometeus', hc: 'İnsanlara ateşi çalan ve bunu yapınca karaciğeri yenilen titan', hk: 'İnsanlara ateşi veren ve bedelini ödeyen titan', ho: 'Yunan mitolojisi', hz: 'Fedakarlık' },
    { w: 'Odysseus', hc: 'Truva savaşından eve dönmek için 10 yıl denizde dolaşan Yunan kahramanı', hk: 'Truva savaşından eve dönemeyen akıllı Yunan kahraman', ho: 'Yunan mitolojisi', hz: 'Yolculuk' },
    { w: 'Herkül', hc: 'On iki imkansız görevi başaran Zeus\'un yarı tanrı oğlu', hk: 'On iki görevi olan Yunan mitolojisinin en güçlü kahramanı', ho: 'Yunan mitolojisi', hz: 'Güç' },
    { w: 'Thor', hc: 'Çekiç taşıyan gök gürültüsü ve şimşek İskandinav tanrısı', hk: 'Çekiçli İskandinav gök gürültüsü tanrısı', ho: 'İskandinav mitolojisi', hz: 'Güç' },
    { w: 'Loki', hc: 'Sürekli hile ve oyun oynayan İskandinav mitolojisinin düzenbaz tanrısı', hk: 'İskandinav mitolojisinin düzenbaz tanrısı', ho: 'İskandinav mitolojisi', hz: 'Hile' },
    { w: 'Anka Kuşu', hc: 'Türk ve İslam mitolojisinde ateşten doğan ölümsüz efsanevi kuş', hk: 'Türk mitolojisinin efsanevi ateş kuşu', ho: 'Türk mitolojisi', hz: 'Ölümsüzlük' },
    { w: 'Simurg', hc: 'İran ve Türk mitolojisinde bilge ve devasa efsanevi kuş', hk: 'İran mitolojisinin dev ve bilge efsanevi kuşu', ho: 'Doğu mitolojisi', hz: 'Bilgelik' },
    { w: 'Gılgamış', hc: 'Sümer destanının ölümsüzlük arayan kral kahraman karakteri', hk: 'Dünyanın en eski destanının kahraman kralı', ho: 'Mezopotamya mitolojisi', hz: 'Ölümsüzlük' },
    { w: 'Sfenks', hc: 'İnsan başlı aslan gövdeli Mısır\'ın bilmece soran efsanevi yaratığı', hk: 'İnsan başlı aslan gövdeli bilmece soran yaratık', ho: 'Mısır mitolojisi', hz: 'Gizem' },
    { w: 'Unicorn', hc: 'Alnından tek boynuzu çıkan beyaz mitolojik at', hk: 'Tek boynuzlu beyaz efsanevi at', ho: 'Mitolojik yaratık', hz: 'Saflık' },
    { w: 'Poseidon', hc: 'Yunan mitolojisinin üçençatalı deniz ve deprem tanrısı', hk: 'Yunan mitolojisinin deniz tanrısı', ho: 'Yunan mitolojisi', hz: 'Deniz' },
    { w: 'Aşil', hc: 'Topuğu dışında tüm vücudu zırhsız Truva savaşının kahraman', hk: 'Tek zayıf noktası topuğu olan Truva savaşı kahramanı', ho: 'Yunan mitolojisi', hz: 'Güç' },
    { w: 'Olimpos', hc: 'Yunan tanrılarının gökyüzündeki dağ üzerindeki yaşam yeri', hk: 'Yunan tanrılarının yaşadığı kutsal dağ', ho: 'Yunan mitolojisi', hz: 'Yükseklik' },
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
