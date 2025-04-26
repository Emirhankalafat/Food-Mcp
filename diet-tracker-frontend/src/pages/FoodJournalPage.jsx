// src/pages/FoodJournalPage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/FoodJournalPage.css';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import AddFood from '../components/food/AddFood';
import FoodList from '../components/food/FoodList';
import { getDailyFoods, searchFoods, getFrequentFoods, addFoodEntry } from '../api/foodService';
import { FaUtensils, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaSearch, FaStar } from 'react-icons/fa';

const FoodJournalPage = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('daily'); // 'daily', 'search', 'frequent'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [frequentFoods, setFrequentFoods] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal için yeni state'ler
  const [selectedMealType, setSelectedMealType] = useState('kahvaltı');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  
  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getDailyFoods(selectedDate);
      setFoods(data);
    } catch (err) {
      console.error('Besin verileri alınamadı:', err);
      setError('Besin kayıtları alınırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchFrequentFoods = async () => {
    try {
      setIsLoading(true);
      const data = await getFrequentFoods(15);
      setFrequentFoods(data.frequentFoods || []);
    } catch (err) {
      console.error('Sık kullanılan besinler alınamadı:', err);
      setError('Sık kullanılan besinler alınırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      return;
    }
    
    try {
      setIsSearching(true);
      setError('');
      const data = await searchFoods(searchQuery);
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Besin arama hatası:', err);
      setError('Besin aranırken bir hata oluştu');
    } finally {
      setIsSearching(false);
    }
  };
  
  useEffect(() => {
    if (view === 'daily') {
      fetchFoods();
    } else if (view === 'frequent') {
      fetchFrequentFoods();
    }
  }, [selectedDate, view]);
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  
  const goToPreviousDay = () => {
    const prevDay = subDays(parseISO(selectedDate), 1);
    setSelectedDate(format(prevDay, 'yyyy-MM-dd'));
  };
  
  const goToNextDay = () => {
    const nextDay = addDays(parseISO(selectedDate), 1);
    setSelectedDate(format(nextDay, 'yyyy-MM-dd'));
  };
  
  const handleFoodAdded = () => {
    fetchFoods(); // Yeni besin eklendiğinde listeyi güncelle
  };
  
  const handleAddFrequentFood = (food) => {
    setSelectedFood(food);
    setIsAddModalOpen(true);
  };
  
  const confirmAddFood = async () => {
    if (!selectedFood) return;
    
    try {
      await addFoodEntry({
        name: selectedFood.name,
        calories: selectedFood.avg_calories,
        quantity: selectedFood.avg_quantity,
        unit: selectedFood.unit,
        mealType: selectedMealType,
        date: selectedDate
      });
      fetchFoods();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Besin eklenirken hata:', err);
      setError('Besin eklenirken bir hata oluştu');
    }
  };
  
  const displayDate = format(parseISO(selectedDate), 'd MMMM yyyy, EEEE', { locale: tr });
  
  return (
    <div className="food-journal-container">
      <div className="food-journal-header">
        <h1><FaUtensils /> Besin Günlüğü</h1>
        
        <div className="view-tabs">
          <button 
            className={`tab-button ${view === 'daily' ? 'active' : ''}`}
            onClick={() => setView('daily')}
          >
            <FaCalendarAlt /> Günlük Kayıt
          </button>
          <button 
            className={`tab-button ${view === 'search' ? 'active' : ''}`}
            onClick={() => setView('search')}
          >
            <FaSearch /> Besin Ara
          </button>
          <button 
            className={`tab-button ${view === 'frequent' ? 'active' : ''}`}
            onClick={() => setView('frequent')}
          >
            <FaStar /> Sık Kullanılanlar
          </button>
        </div>
      </div>
      
      {view === 'daily' && (
        <>
          <div className="date-navigation">
            <button className="nav-button" onClick={goToPreviousDay}>
              <FaChevronLeft /> Önceki Gün
            </button>
            
            <div className="current-date">
              <FaCalendarAlt /> {displayDate}
            </div>
            
            <button className="nav-button" onClick={goToNextDay}>
              Sonraki Gün <FaChevronRight />
            </button>
          </div>
          
          <div className="date-selector">
            <label htmlFor="date">Tarih Seç:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          
          <AddFood selectedDate={selectedDate} onFoodAdded={handleFoodAdded} />
          
          {isLoading ? (
            <div className="loading">Yükleniyor...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <FoodList foods={foods} onFoodDeleted={fetchFoods} />
          )}
        </>
      )}
      
      {view === 'search' && (
        <div className="search-container">
          <h2>Besin Ara</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Besin adı girin (en az 2 karakter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={isSearching || searchQuery.trim().length < 2}>
              {isSearching ? 'Aranıyor...' : 'Ara'}
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {searchResults.length > 0 ? (
            <div className="search-results">
              <h3>Arama Sonuçları ({searchResults.length})</h3>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Besin Adı</th>
                    <th>Miktar</th>
                    <th>Kalori</th>
                    <th>Eklenme Tarihi</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((food) => (
                    <tr key={food.id}>
                      <td>{food.name}</td>
                      <td>{food.quantity} {food.unit}</td>
                      <td>{food.calories} kcal</td>
                      <td>{food.date}</td>
                      <td>
                        <button 
                          className="btn-small"
                          onClick={() => {
                            setSelectedDate(food.date);
                            setView('daily');
                          }}
                        >
                          Tarihe Git
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : searchQuery.trim().length >= 2 && !isSearching ? (
            <div className="no-results">
              <p>Arama kriterinize uygun sonuç bulunamadı.</p>
            </div>
          ) : null}
        </div>
      )}
      
      {view === 'frequent' && (
        <div className="frequent-foods-container">
          <h2>Sık Tüketilen Besinler</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          {isLoading ? (
            <div className="loading">Yükleniyor...</div>
          ) : frequentFoods.length > 0 ? (
            <div className="frequent-foods-list">
              <table className="frequent-table">
                <thead>
                  <tr>
                    <th>Besin Adı</th>
                    <th>Ortalama Miktar</th>
                    <th>Ortalama Kalori</th>
                    <th>Kullanım Sıklığı</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {frequentFoods.map((food, index) => (
                    <tr key={index}>
                      <td>{food.name}</td>
                      <td>{food.avg_quantity?.toFixed(1)} {food.unit}</td>
                      <td>{food.avg_calories?.toFixed(0)} kcal</td>
                      <td>{food.frequency} kez</td>
                      <td>
                        <button 
                          className="btn-small"
                          onClick={() => handleAddFrequentFood(food)}
                        >
                          Bugüne Ekle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-results">
              <p>Henüz yeterli veri yok. Besin eklemeye devam edin.</p>
              <button 
                className="btn-primary"
                onClick={() => setView('daily')}
              >
                Besin Ekle
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Besin Ekle</h3>
            <div className="form-group">
              <label>Öğün Tipi</label>
              <select 
                value={selectedMealType} 
                onChange={(e) => setSelectedMealType(e.target.value)}
              >
                <option value="kahvaltı">Kahvaltı</option>
                <option value="öğlen">Öğle Yemeği</option>
                <option value="akşam">Akşam Yemeği</option>
                <option value="ara öğün">Ara Öğün</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={confirmAddFood}>Ekle</button>
              <button onClick={() => setIsAddModalOpen(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodJournalPage;