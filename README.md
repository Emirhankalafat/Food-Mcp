🥗 Food-Mcp: Beslenme Takip Asistanınız
<div align="center">




</div>
📋 İçindekiler
📌 Proje Hakkında

✨ Özellikler

🚀 Teknolojiler

📊 Claude AI Entegrasyonu

🔍 Örnek Kullanım

⚙️ Kurulum

Gereksinimler

Adımlar

MCP Kurulumu

👨‍💻 Geliştiriciler

📄 Lisans

📌 Proje Hakkında
Food-Mcp, kullanıcıların günlük beslenme alışkanlıklarını kaydedebileceği, takip edebileceği ve analiz edebileceği modern bir beslenme takip uygulamasıdır.

Bu proje Claude AI ile Model Context Protocol (MCP) üzerinden entegre edilmiştir.

⚠️ Not: Sesli komut desteği yoktur. Tüm iletişim MCP protokolü üzerinden mesaj tabanlı gerçekleştirilir.

✨ Özellikler
<table> <tr> <td width="50%"> <h3>✅ Besin Takibi</h3> <p>Günlük öğünlerinizi kaydedin ve kalori bilgilerini takip edin.</p> </td> <td width="50%"> <h3>📊 Analiz ve Grafikler</h3> <p>Yemek kayıtlarınızı grafiklerle analiz edin ve gelişiminizi izleyin.</p> </td> </tr> <tr> <td width="50%"> <h3>📅 Zaman Bazlı Raporlar</h3> <p>Günlük, haftalık ve aylık bazda raporlar oluşturun.</p> </td> <td width="50%"> <h3>👤 Profil Yönetimi</h3> <p>Kullanıcı bilgilerinizi ve vücut ölçümlerinizi yönetin.</p> </td> </tr> <tr> <td width="50%"> <h3>🛡️ Güvenli Oturumlar</h3> <p>JWT tabanlı güvenli kimlik doğrulama ile giriş yapın.</p> </td> <td width="50%"> <h3>⚡ Claude AI Entegrasyonu</h3> <p>Claude AI ile MCP üzerinden doğal dilde sorgulamalar gerçekleştirin.</p> </td> </tr> </table>
🚀 Teknolojiler
Backend Teknolojileri
Node.js & Express

PostgreSQL

JWT

MCP (Model Context Protocol)

RESTful API

Bcrypt

Swagger

Frontend Teknolojileri
React

Recharts

React Router

Tailwind CSS

Redux Toolkit

Axios

Responsive Design

📊 Claude AI Entegrasyonu
food_add: Yeni bir besin kaydı ekler.

food_list: Belirli bir gün veya öğündeki yemekleri listeler.

food_summary: Belirli bir tarih aralığındaki beslenme özetini verir.

Claude ile mesaj tabanlı iletişim sağlanmaktadır. Sesli komut desteği yoktur.

🔍 Örnek Kullanım
text
Kopyala
Düzenle
"Bugün kahvaltıda neler yedim?"
"Son 1 haftalık yemek özetimi göster."
"Bugün öğle yemeğinde makarna ve salata yedim."
"Geçen hafta en çok hangi öğünde kalori aldım?"
"Yeni bir besin kaydı ekle: Akşam - 1 porsiyon tavuk göğsü, 200 kalori."
⚙️ Kurulum
Gereksinimler
Node.js (v16+)

PostgreSQL

Claude AI Desktop (isteğe bağlı)

NPM veya Yarn

Adımlar
Projeyi Klonlayın:

bash
Kopyala
Düzenle
git clone https://github.com/Emirhankalafat/Food-Mcp.git
cd Food-Mcp
Backend Kurulumu:

bash
Kopyala
Düzenle
cd backend
npm install
Veritabanı Ayarlamaları:

sql
Kopyala
Düzenle
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
Frontend Kurulumu:

bash
Kopyala
Düzenle
cd ../frontend
npm install
.env Dosyası Ayarla:

env
Kopyala
Düzenle
DATABASE_URL=postgresql://<kullanici_adi>:<parola>@localhost:5432/<veritabani_adi>
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
MCP_PORT=3030
Uygulamayı Başlatın:

bash
Kopyala
Düzenle
# Backend
cd backend
node src/index.js

# Frontend (yeni bir terminalde)
cd frontend
npm start
Not: Backend sunucusu doğrudan src/index.js dosyasından başlar.

🔌 MCP Kurulumu
Claude Desktop uygulamasında .mcp.json dosyası oluşturmanız gerekmektedir.

Örnek:

json
Kopyala
Düzenle
{
  "mcpServers": {
    "diet-tracker": {
      "command": "node",
      "args": [
        "C:/Kendi/Projenizin/Path'i/src/index.js"
      ],
      "env": {
        "API_KEY": "kendi_api_key",
        "NODE_OPTIONS": "--no-deprecation"
      }
    }
  }
}
👨‍💻 Geliştiriciler
Emirhan Kalafat

📄 Lisans
Bu proje MIT lisansı altında dağıtılmaktadır.

<div align="center"> <p>Food-Mcp ile sağlıklı bir yaşam sürmek artık daha kolay! 🥗</p>
<a href="https://github.com/Emirhankalafat/Food-Mcp/issues">Sorun Bildir</a> • <a href="https://github.com/Emirhankalafat/Food-Mcp/pulls">Katkıda Bulun</a>

</div>
