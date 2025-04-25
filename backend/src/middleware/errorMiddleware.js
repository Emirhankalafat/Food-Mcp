// Genel hata yakalama middleware'i
export const errorHandler = (err, req, res, next) => {
  // Hata durumuna göre farklı yanıtlar
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    message: err.message || 'Sunucu hatası',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Rota bulunamadı hatası
export const notFound = (req, res, next) => {
  const error = new Error(`Bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Doğrulama hatası middleware'i
export const validationErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    
    return res.status(400).json({
      message: 'Doğrulama hatası',
      errors
    });
  }
  
  next(err);
};
