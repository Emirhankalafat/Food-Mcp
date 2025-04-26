Food-Mcp 🥗
Food-Mcp, kullanıcıların günlük beslenme alışkanlıklarını takip etmelerine ve sağlıklı bir yaşam sürmeleri için gerekli verileri toplamalarına yardımcı olmayı amaçlayan bir uygulamadır. Claude AI entegrasyonu ile sesli komutlar kullanarak besin kayıtlarınızı kolayca yönetebilirsiniz.
Proje Hakkında
Bu proje, modern web teknolojileri ve yapay zeka entegrasyonu kullanılarak oluşturulmuş tam kapsamlı bir beslenme takip sistemidir. Kullanıcılar, günlük tükettikleri besinleri kaydedebilir, beslenme alışkanlıklarını analiz edebilir ve vücut ölçümlerini takip edebilir.
Özellikler

✅ Besin Takibi: Günlük öğünlerinizi kaydedip kalori değerlerini otomatik hesaplayın
📊 Analiz ve Grafikler: Beslenme verilerinizi çeşitli grafiklerle görselleştirin
🗓️ Zaman Bazlı Raporlar: Günlük, haftalık ve aylık beslenme raporlarına erişin
👤 Profil Yönetimi: Kişisel verilerinizi ve vücut ölçümlerinizi güncel tutun
🤖 Claude AI Entegrasyonu: Sesli komutlar ile veritabanı işlemlerini yapın
📱 Responsive Tasarım: Her ekran boyutunda kusursuz görünüm ve kullanım

Teknolojik Altyapı
Backend

Node.js & Express: Güçlü ve esnek bir API hizmeti
PostgreSQL: Güvenilir ilişkisel veritabanı
JWT: Güvenli kimlik doğrulama
MCP (Model Context Protocol): Claude AI entegrasyonu için araçlar

Frontend

React: Dinamik ve hızlı kullanıcı arayüzü
Recharts: İleri seviye veri görselleştirme
React Router: Sayfa yönetimi
Responsive Tasarım: Tüm cihazlarda sorunsuz deneyim

Claude AI Entegrasyonu
Food-Mcp, Claude yapay zeka asistanı için MCP (Model Context Protocol) araçları geliştirerek beslenme takibini çok daha kolaylaştırır:

food_add: Yeni besin kayıtları ekleyin
food_list: Belirli bir gün veya öğüne ait besinleri listeleyin
food_summary: Belirli bir tarih aralığındaki beslenme alışkanlıklarınızı analiz edin

Örnek kullanım:
"Bugün öğle yemeğinde 1 porsiyon makarna ve salata yedim"
"Dünkü kahvaltımda neler yemişim?"
"Son bir haftanın beslenme özetini göster"
Başlangıç
Gereksinimler

Node.js (v16+)
PostgreSQL
Claude AI Desktop (opsiyonel)

Kurulum Adımları

Projeyi klonlayın:
git clone https://github.com/Emirhankalafat/Food-Mcp.git
cd Food-Mcp

Backend ayarları:
cd backend
npm install

Veritabanını ayarlayın:

PostgreSQL'de foodmcp adında bir veritabanı oluşturun
backend/db/schema.sql dosyasındaki komutları çalıştırın veya:

sqlCREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(50),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  api_key VARCHAR(64) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, meal_type)
);

CREATE TABLE food_items (
  id SERIAL PRIMARY KEY,
  food_log_id INTEGER REFERENCES food_logs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  calories INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

.env dosyası oluşturun:
DATABASE_URL=postgresql://username:password@localhost:5432/foodmcp
JWT_SECRET=your_secure_secret
PORT=5000

Frontend ayarları:
cd ../diet-tracker-frontend
npm install

Uygulamayı başlatın:

Backend: npm run dev
Frontend: npm start
MCP (opsiyonel): cd ../mcp && npm start


Tarayıcınızda http://localhost:3000 adresine gidin

Katkıda Bulunma
Bu projeye katkıda bulunmak isterseniz:

Repoyu forklayın
Feature branch'i oluşturun (git checkout -b feature/YeniOzellik)
Değişikliklerinizi commit edin (git commit -m 'Yeni özellik: XYZ eklendi')
Branch'inize push yapın (git push origin feature/YeniOzellik)
Pull Request açın

Gelecek Planları

🔄 Daha fazla AI entegrasyonu
📱 Mobil uygulama geliştirme
🌐 Besin veritabanı entegrasyonu
🏋️ Egzersiz takibi modülü
🧪 Kapsamlı test suite'i
📊 Daha gelişmiş analitik özellikler
🌍 Çoklu dil desteği

Lisans
Bu proje MIT Lisansı ile lisanslanmıştır.
İletişim
Emirhan Kalafat - GitHub
Proje linki: https://github.com/Emirhankalafat/Food-Mcp
