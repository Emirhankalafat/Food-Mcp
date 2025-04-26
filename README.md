# 🥗 Food-Mcp: Beslenme Takip Asistanınız

<div align="center">
  
  ![Food-Mcp Logo](https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=Food-Mcp)
  
  [![GitHub stars](https://img.shields.io/github/stars/Emirhankalafat/Food-Mcp.svg?style=social&label=Star)](https://github.com/Emirhankalafat/Food-Mcp/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/Emirhankalafat/Food-Mcp.svg?style=social&label=Fork)](https://github.com/Emirhankalafat/Food-Mcp/network)
  [![GitHub issues](https://img.shields.io/github/issues/Emirhankalafat/Food-Mcp.svg)](https://github.com/Emirhankalafat/Food-Mcp/issues)
  [![GitHub license](https://img.shields.io/github/license/Emirhankalafat/Food-Mcp.svg)](https://github.com/Emirhankalafat/Food-Mcp/blob/master/LICENSE)
  
</div>

## 📋 İçindekiler

- [📌 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🚀 Teknolojiler](#-teknolojiler)
- [📊 Claude AI Entegrasyonu](#-claude-ai-entegrasyonu)
- [🔍 Örnek Kullanım](#-örnek-kullanım)
- [⚙️ Kurulum](#️-kurulum)
  - [Gereksinimler](#gereksinimler)
  - [Adımlar](#adımlar)
- [👨‍💻 Geliştiriciler](#-geliştiriciler)
- [📄 Lisans](#-lisans)

## 📌 Proje Hakkında

Food-Mcp, kullanıcıların günlük beslenme alışkanlıklarını takip etmelerine ve sağlıklı bir yaşam sürmelerine yardımcı olmayı amaçlayan modern bir uygulamadır. 

Claude AI entegrasyonu sayesinde sesli komutlar kullanarak besin kayıtlarınızı kolayca yönetebilirsiniz. Bu proje, modern web teknolojileri ve yapay zeka entegrasyonu kullanılarak oluşturulmuş kapsamlı bir beslenme takip sistemidir.

## ✨ Özellikler

<table>
  <tr>
    <td width="50%">
      <h3>✅ Besin Takibi</h3>
      <p>Günlük öğünlerinizi kaydedip kalori değerlerini otomatik hesaplayın.</p>
    </td>
    <td width="50%">
      <h3>📊 Analiz ve Grafikler</h3>
      <p>Beslenme verilerinizi çeşitli grafiklerle görselleştirin.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📅 Zaman Bazlı Raporlar</h3>
      <p>Günlük, haftalık ve aylık beslenme raporlarına erişin.</p>
    </td>
    <td width="50%">
      <h3>👤 Profil Yönetimi</h3>
      <p>Kişisel verilerinizi ve vücut ölçümlerinizi güncel tutun.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🗣️ Claude AI Entegrasyonu</h3>
      <p>Sesli komutlar ile veritabanı işlemlerini yapın.</p>
    </td>
    <td width="50%">
      <h3>📱 Responsive Tasarım</h3>
      <p>Her ekran boyutunda kusursuz görünüm ve kullanım.</p>
    </td>
  </tr>
</table>

## 🚀 Teknolojiler

### Backend
- **Node.js & Express:** Güçlü ve esnek bir API hizmeti
- **PostgreSQL:** Güvenilir ilişkisel veritabanı
- **JWT:** Güvenli kimlik doğrulama
- **MCP (Model Context Protocol):** Claude AI entegrasyonu için araçlar

### Frontend
- **React:** Dinamik ve hızlı kullanıcı arayüzü
- **Recharts:** İleri seviye veri görselleştirme
- **React Router:** Sayfa yönetimi
- **Responsive Tasarım:** Tüm cihazlarda sorunsuz deneyim

## 📊 Claude AI Entegrasyonu

Food-Mcp, Claude yapay zeka asistanı için MCP (Model Context Protocol) araçları geliştirerek beslenme takibini çok daha kolaylaştırır:

- **food_add:** Yeni besin kayıtları ekleyin
- **food_list:** Belirli bir gün veya öğüne ait besinleri listeleyin
- **food_summary:** Belirli bir tarih aralığındaki beslenme alışkanlıklarınızı analiz edin

## 🔍 Örnek Kullanım

```text
"Bugün öğle yemeğinde 1 porsiyon makarna ve salata yedim"
"Dünkü kahvaltımda neler yemişim?"
"Son bir haftanın beslenme özetini göster"
```

## ⚙️ Kurulum

### Gereksinimler
- Node.js (v16+)
- PostgreSQL
- Claude AI Desktop (opsiyonel)

### Adımlar

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/Emirhankalafat/Food-Mcp.git
   cd Food-Mcp
   ```

2. **Backend ayarları:**
   ```bash
   cd backend
   npm install
   ```

3. **Veritabanını ayarlayın:**
   
   PostgreSQL'de foodmcp adında bir veritabanı oluşturun `backend/db/schema.sql` dosyasındaki komutları çalıştırın veya:

   ```sql
   CREATE TABLE users (
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
     -- Diğer tablolar...
   );
   ```

4. **Frontend ayarları:**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Uygulamayı başlatın:**
   ```bash
   # Backend
   cd ../backend
   npm start
   
   # Frontend (yeni bir terminal)
   cd ../frontend
   npm start
   ```

## 👨‍💻 Geliştiriciler

- [Emirhan Kalafat](https://github.com/Emirhankalafat) - Proje Sahibi

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Daha fazla bilgi için lisans dosyasını inceleyebilirsiniz.

---

<div align="center">
  <p>Food-Mcp ile sağlıklı bir yaşam sürmek artık daha kolay! 🥗</p>
  
  <a href="https://github.com/Emirhankalafat/Food-Mcp/issues">Sorun Bildir</a> •
  <a href="https://github.com/Emirhankalafat/Food-Mcp/pulls">Katkıda Bulun</a>
</div>