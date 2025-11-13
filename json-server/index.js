const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, 'db.json'));

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

// Имитация задержки сети
server.use(async (req, res, next) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 500 + Math.random() * 300); // Случайная задержка 500-800ms
    });
    next();
});

// Эндпоинт для получения опций для селекта
server.get('/options/for/select', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
        const {options = []} = db;

        // 10% шанс ошибки для тестирования
        if (Math.random() < 0.1) {
            return res.status(500).json({message: 'Server error while fetching options'});
        }

        return res.json(options);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e.message});
    }
});

// Эндпоинт для отправки выбранной опции
server.post('/selected/option', (req, res) => {
    try {
        const {value} = req.body;

        // Валидация
        if (!value || typeof value !== 'string') {
            return res.status(400).json({message: 'Invalid option value'});
        }

        // 10% шанс ошибки для тестирования
        if (Math.random() < 0.1) {
            return res.status(500).json({message: 'Server error while processing option'});
        }

        // Успешный ответ
        return res.json({
            message: `Выбранная опция ${value} успешно принята.`
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e.message});
    }
});

// Простой health check
server.get('/health', (req, res) => {
    res.json({status: 'OK', timestamp: new Date().toISOString()});
});

server.use(router);

// Запуск сервера
server.listen(8000, () => {
    console.log('Сервер запущен на 8000 порту');
});