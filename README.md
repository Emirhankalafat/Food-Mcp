# 🥗 Food-MCP: Beslenme Takip Asistanınız

<div align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/food-mcp-logo.png" alt="Food-MCP Logo" width="200"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-blue.svg)](https://www.postgresql.org/)
  [![Claude AI](https://img.shields.io/badge/Claude%20AI-MCP-purple.svg)](https://www.anthropic.com/claude)
</div>

## 📋 İçindekiler

- [📌 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🚀 Teknolojiler](#-teknolojiler)
- [📊 Claude AI Entegrasyonu](#-claude-ai-entegrasyonu)
- [⚙️ Kurulum](#️-kurulum)
  - [Gereksinimler](#gereksinimler)
  - [Backend Kurulumu](#backend-kurulumu)
  - [Frontend Kurulumu](#frontend-kurulumu)
  - [Veritabanı Ayarları](#veritabanı-ayarları)
  - [.env Dosyası Ayarları](#env-dosyası-ayarları)
- [🔌 MCP Kurulumu](#-mcp-kurulumu)
- [🧠 Claude AI ile Kullanım](#-claude-ai-ile-kullanım)
- [📱 Uygulama Kullanımı](#-uygulama-kullanımı)
- [🛣️ API Rotaları](#️-api-rotaları)
- [👨‍💻 Katkıda Bulunma](#-katkıda-bulunma)
- [🐛 Hata Raporlama](#-hata-raporlama)
- [📄 Lisans](#-lisans)

## 📌 Proje Hakkında

Food-MCP, kullanıcıların günlük beslenme alışkanlıklarını takip edebileceği, analiz edebileceği ve sağlıklı bir yaşam sürdürmelerine yardımcı olan modern bir beslenme takip uygulamasıdır. Uygulama, Claude AI ile Model Context Protocol (MCP) kullanarak entegre edilmiştir, böylece kullanıcılar doğal dil ile beslenme verilerini yönetebilirler.

Food-MCP şunları yapmanıza olanak tanır:
- Günlük yemek kayıtlarınızı tutma
- Kalori alımınızı takip etme
- Beslenme alışkanlıklarınızı analiz etme 
- Claude AI ile doğal dil sorguları yapma

> **Not:** Bu uygulama MCP protokolünü destekleyen AI'lar ile beraber çalışabilecek şekilde hazırlanmıştır.ların günlük beslenme alışkanlıklarını takip edebileceği, analiz edebileceği ve sağlıklı bir yaşam sürdürmelerine yardımcı olan modern bir beslenme takip uygulamasıdır. Uygulama, Claude AI ile Model Context Protocol (MCP) kullanarak entegre edilmiştir, böylece kullanıcılar doğal dil ile beslenme verilerini yönetebilirler.

Food-MCP şunları yapmanıza olanak tanır:
- Günlük yemek kayıtlarınızı tutma
- Kalori alımınızı takip etme
- Beslenme alışkanlıklarınızı analiz etme 
- Claude AI ile doğal dil sorguları yapma



Food-MCP şunları yapmanıza olanak tanır:
- Günlük yemek kayıtlarınızı tutma
- Kalori alımınızı takip etme
- Beslenme alışkanlıklarınızı analiz etme 
- Claude AI ile doğal dil sorguları yapma


## ✨ Özellikler

<table>
  <tr>
    <td width="50%">
      <h3>✅ Besin Takibi</h3>
      <p>Günlük öğünlerinizi kaydedin ve kalori bilgilerini takip edin. Kahvaltı, öğle yemeği, akşam yemeği ve ara öğünler için ayrı kayıt tutabilirsiniz.</p>
    </td>
    <td width="50%">
      <h3>📊 Analiz ve Grafikler</h3>
      <p>Yemek kayıtlarınızı günlük, haftalık ve aylık bazda grafiklerle analiz edin. Kalori alımınızı, öğün dağılımınızı ve beslenme trendlerinizi görselleştirin.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📅 Zaman Bazlı Raporlar</h3>
      <p>Günlük, haftalık ve aylık bazda detaylı raporlar oluşturun. Beslenme alışkanlıklarınızdaki değişimleri takip edin.</p>
    </td>
    <td width="50%">
      <h3>👤 Profil Yönetimi</h3>
      <p>Kişisel bilgilerinizi ve vücut ölçümlerinizi (boy, kilo, BMI) yönetin ve gelişiminizi izleyin.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🛡️ Güvenli Oturumlar</h3>
      <p>JWT tabanlı güvenli kimlik doğrulama ile giriş yapın. Verileriniz şifrelenmiş ve korumalı şekilde saklanır.</p>
    </td>
    <td width="50%">
      <h3>⚡ Claude AI Entegrasyonu</h3>
      <p>Claude AI ile MCP üzerinden doğal dilde sorgulamalar gerçekleştirin. Yemeklerinizi ekleyin, sorgulayın ve özet bilgiler alın.</p>
    </td>
  </tr>
</table>

## 🚀 Teknolojiler

### Backend Teknolojileri
- **Node.js & Express:** Hızlı ve ölçeklenebilir bir API sunucusu
- **PostgreSQL:** Güçlü ve güvenilir ilişkisel veritabanı
- **JWT (JSON Web Token):** Güvenli kimlik doğrulama
- **MCP (Model Context Protocol):** Claude AI entegrasyonu
- **RESTful API:** Standartlara uygun API tasarımı
- **Bcrypt:** Güvenli şifre hashleme
- **Date-fns:** Tarih işlemleri için kapsamlı kütüphane

### Frontend Teknolojileri
- **React 19:** Modern ve hızlı kullanıcı arayüzü
- **Recharts:** Veri görselleştirme için kapsamlı grafik kütüphanesi
- **React Router:** Sayfa yönlendirme ve navigasyon
- **React Icons:** Geniş simge kütüphanesi
- **Formik & Yup:** Form yönetimi ve doğrulama
- **Axios:** API istekleri için HTTP istemcisi
- **Responsive Design:** Tüm cihazlarda optimum kullanıcı deneyimi

## 📊 Claude AI Entegrasyonu

Food-MCP, Claude AI ile Model Context Protocol (MCP) üzerinden entegre edilmiştir. Bu entegrasyon sayesinde kullanıcılar doğal dil ile şu işlemleri gerçekleştirebilirler:

### MCP Protokolü Araçları

| Araç | Açıklama | Örnek Kullanım |
|------|----------|----------------|
| `food_add` | Yeni bir besin kaydı ekler | "Bugün öğle yemeğinde 1 porsiyon (200g) pilav yedim" |
| `food_list` | Belirli bir gün veya öğündeki yemekleri listeler | "Bugün sabah kahvaltıda ne yedim?" veya "Dünkü yemek listemi göster" |
| `food_summary` | Belirli bir tarih aralığındaki beslenme özetini verir | "Son 1 haftalık beslenme özetimi göster" |

> **Kalori Belirtme (Opsiyonel)**: Besin eklerken kalori değerini belirtmeniz opsiyoneldir. Kalori belirtmezseniz, Claude AI yaygın besinler için ortalama kalori değerlerini otomatik olarak hesaplar. Belirli bir değer girmek isterseniz, "350 kalori" gibi açıkça belirtebilirsiniz.

## ⚙️ Kurulum

### Gereksinimler

- Node.js (v18+)
- PostgreSQL (v14+)
- npm veya yarn
- Claude AI Desktop (MCP entegrasyonu için)

### Backend Kurulumu

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/food-mcp.git
cd food-mcp
```

2. Backend bağımlılıklarını yükleyin:
```bash
cd backend
npm install
```

### Frontend Kurulumu

1. Frontend bağımlılıklarını yükleyin:
```bash
cd ../diet-tracker-frontend
npm install
```

### Veritabanı Ayarları

1. PostgreSQL'de yeni bir veritabanı oluşturun:
```sql
CREATE DATABASE food_tracker;
```

2. Gerekli tabloları oluşturun:
```sql
-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  gender VARCHAR(20),
  weight DOUBLE PRECISION,
  height DOUBLE PRECISION,
  api_key VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_key
ON public.users (api_key);

-- FOOD_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.food_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  meal_type VARCHAR(20),
  CONSTRAINT idx_user_date_meal_type UNIQUE (user_id, date, meal_type)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_date_meal
ON public.food_logs (user_id, date, meal_type);

-- FOOD_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
  id SERIAL PRIMARY KEY,
  food_log_id INTEGER REFERENCES public.food_logs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity DOUBLE PRECISION NOT NULL,
  unit VARCHAR(50) NOT NULL,
  calories INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_food_items_log_id
ON public.food_items (food_log_id);
```

### .env Dosyası Ayarları

Proje ana dizininde `.env` dosyası oluşturun:

```env
DATABASE_URL=postgresql://<kullanici_adi>:<parola>@localhost:5432/food_tracker
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

## 🔌 MCP Kurulumu

Claude AI ile entegrasyon için MCP (Model Context Protocol) yapılandırması gereklidir. MCP, Claude AI'ın uygulama ile iletişim kurmasını sağlayan protokoldür. Ayrı bir sunucu gerektirmez, Claude Desktop uygulaması üzerinden çalışır.

### Claude Desktop'ta MCP Yapılandırması Adımları

1. Claude Desktop uygulamasını açın
2. Sağ alt köşedeki profil simgesine tıklayın
3. Açılan menüden "Settings" (Ayarlar) seçeneğine tıklayın
4. Sol menüden "Developer" (Geliştirici) bölümünü seçin
5. "Edit Config File" (Yapılandırma Dosyasını Düzenle) butonuna tıklayın
6. Açılan `claude_desktop_config` dosyasına aşağıdaki yapılandırmayı ekleyin:

```json
{
  "mcpServers": {
    "diet-tracker": {
      "command": "node",
      "args": [
        "<PROJE_YOLU>/mcp/index.js"
      ],
      "env": {
        "API_KEY": "<kullanici_api_anahtari>",
        "NODE_OPTIONS": "--no-deprecation",
        "NODE_ENV": "development"
      }
    }
  }
}
```

7. `<PROJE_YOLU>` kısmını gerçek proje yolunuzla değiştirin (örn. `/Users/kullanici/projeler/food-mcp`)
8. `<kullanici_api_anahtari>` kısmını API anahtarınızla değiştirin
9. Dosyayı kaydedin ve Claude Desktop uygulamasını yeniden başlatın

### NODE_ENV Seçenekleri

Yapılandırma dosyasında kullanabileceğiniz NODE_ENV değerleri:

- **development**: Geliştirme aşaması için. Hata ayıklama bilgileri daha detaylı gösterilir, kod değişiklikleri anında yansır.
  ```
  "NODE_ENV": "development"
  ```

- **production**: Canlı ortam için. Performans optimizasyonları yapılır, hata mesajları daha sınırlıdır, güvenlik önlemleri arttırılır.
  ```
  "NODE_ENV": "production"
  ```

Geliştirme yaparken `development`, uygulamayı gerçek ortamda kullanırken `production` modunu tercih edin.

### API Anahtarı Alma

API Anahtarınızı profil sayfasından alabilirsiniz:
- Uygulamaya giriş yapın ve sağ üst köşedeki profil menüsünden "Profil" sayfasına gidin
- Profil bilgileriniz altında "API Anahtarı" bölümünü bulun
- "Göster" butonuna tıklayarak anahtarınızı görüntüleyebilir, "Kopyala" butonuyla kopyalayabilirsiniz
- Bu anahtarı `claude_desktop_config` dosyasındaki `API_KEY` değeri olarak kullanın

## 🧠 Claude AI ile Kullanım

Claude AI ile Food-MCP'yi kullanmak için örnek sorgu ve komutlar:

1. **Besin ekleme:**
   - "Bugün öğle yemeğinde bir porsiyon makarna yedim."
   - "Kahvaltıda 2 adet yumurta ve 1 dilim ekmek tükettim."
   - "Dün akşam 200 gram tavuk göğsü ve salata yedim."
   - "Akşam yemeğinde büyük boy pizza yedim, yaklaşık 800 kalori." (kalori belirtme opsiyonel)

2. **Besin listeleme:**
   - "Bugün ne yedim?"
   - "Dünkü kahvaltımda neler vardı?"
   - "Bu haftaki yemek kayıtlarımı göster."
   - "11 Mayıs tarihindeki öğle yemeğim neydi?"

3. **Beslenme özeti:**
   - "Son bir haftanın kalori özetini göster."
   - "Geçen ay en çok hangi öğünde kalori almışım?"
   - "Bu hafta günlük ortalama ne kadar kalori tüketmişim?"
   - "Son 30 gündeki beslenme alışkanlıklarımı analiz et."

## 📱 Uygulama Kullanımı

### Backend'i Başlatma

```bash
cd backend
node src/index.js
```

### Frontend'i Başlatma

```bash
cd diet-tracker-frontend
npm start
```

### MCP Kurulumu için Adımlar

1. Food-MCP uygulamasına kaydolun ve profilinizden API anahtarınızı alın
2. `claude_desktop_config` dosyasını doğru şekilde yapılandırın
3. Claude AI Desktop uygulamasında Claude'a bir soru sormaya başlayın
4. Claude otomatik olarak Food-MCP'nin MCP araçlarını tanıyacak ve kullanacaktır

Uygulama şu adreslerde çalışacaktır:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Proje Yapısı

```
food-mcp/
├── .env                  # Çevre değişkenleri dosyası
├── .gitignore            # Git tarafından yok sayılacak dosyalar
├── README.md             # Proje dökümantasyonu
├── backend/              # Backend kaynak kodları
│   ├── package.json      # Backend bağımlılıkları
│   └── src/
│       ├── config/       # Veritabanı yapılandırmaları
│       ├── controllers/  # İşleyici fonksiyonları
│       ├── middleware/   # Middleware fonksiyonları
│       ├── routes/       # API rotaları
│       └── index.js      # Ana uygulama dosyası
├── diet-tracker-frontend/ # Frontend kaynak kodları
│   ├── package.json      # Frontend bağımlılıkları
│   ├── public/           # Statik dosyalar
│   └── src/
│       ├── api/          # API istek modülleri
│       ├── components/   # React bileşenleri
│       ├── context/      # React context yapıları
│       ├── pages/        # Sayfa bileşenleri
│       └── styles/       # CSS dosyaları
└── mcp/                  # Model Context Protocol entegrasyonu
    ├── tools/            # MCP araçları (food_add, food_list, vb.)
    ├── utils/            # Yardımcı fonksiyonlar
    └── index.js          # MCP giriş noktası
```

## 🛣️ API Rotaları

### Kimlik Doğrulama Rotaları

| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Kullanıcı girişi |
| POST | `/api/auth/regenerate-api-key` | API anahtarını yenileme |

### Kullanıcı Rotaları

| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/api/users/profile` | Kullanıcı profilini getirme |
| PUT | `/api/users/profile` | Kullanıcı profilini güncelleme |
| PUT | `/api/users/change-password` | Parola değiştirme |
| DELETE | `/api/users/account` | Hesabı silme |
| GET | `/api/users/stats` | Kullanıcı istatistiklerini getirme |

### Besin Rotaları

| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/foods` | Yeni besin ekleme |
| GET | `/api/foods/daily` | Günlük besinleri getirme |
| GET | `/api/foods/summary` | Besin özetini getirme |
| GET | `/api/foods/search` | Besin arama |
| GET | `/api/foods/frequent` | Sık tüketilen besinleri getirme |
| GET | `/api/foods/weekly` | Haftalık analiz |
| PUT | `/api/foods/:id` | Belirli bir besini güncelleme |
| DELETE | `/api/foods/:id` | Belirli bir besini silme |

## 👨‍💻 Katkıda Bulunma

Food-MCP projesine katkıda bulunmak istiyorsanız:

1. Projeyi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'e push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 🐛 Hata Raporlama

Bir hata bulduysanız veya yeni bir özellik önerisi varsa, lütfen GitHub Issues aracılığıyla bildirin:
1. "Issues" sekmesine gidin
2. "New Issue" butonuna tıklayın
3. Hata veya önerinizi detaylı bir şekilde açıklayın
4. Mümkünse ekran görüntüleri veya hata logları ekleyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">
  <p>Food-MCP ile sağlıklı bir yaşam sürmek artık daha kolay! 🥗</p>
  <a href="https://github.com/yourusername/food-mcp/issues">Sorun Bildir</a> •
  <a href="https://github.com/yourusername/food-mcp/pulls">Katkıda Bulun</a>
</div>