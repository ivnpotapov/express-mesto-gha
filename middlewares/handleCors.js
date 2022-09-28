module.exports.handleCors = (req, res, next) => {
  const allowedCors = [
    'https://iv-partner.nomoredomains.xyz',
    'http://iv-partner.nomoredomains.xyz',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://52.41.36.82',
    'http://54.191.253.12',
    'http://44.226.122.3',
    'https://ivnpotapov.github.io',
  ];

  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const requestHeaders = req.headers['access-control-request-headers']; // сохраняем список заголовков исходного запроса
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'; // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)

  if (allowedCors.includes(origin)) {
    // проверяем, что источник запроса есть среди разрешённых
    res.header('Access-Control-Allow-Origin', '*');
  }

  if (method === 'OPTIONS') {
    // Если это предварительный запрос, добавляем нужные заголовки
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); // разрешаем кросс-доменные запросы любых типов (по умолчанию)

    res.header('Access-Control-Allow-Headers', requestHeaders); // разрешаем кросс-доменные запросы с этими заголовками

    return res.end(); // завершаем обработку запроса и возвращаем результат клиенту
  }

  return next();
};
