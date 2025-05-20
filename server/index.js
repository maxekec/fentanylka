const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const User = sequelize.define('User', {
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    login: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending',
    },
});

const Application = sequelize.define('Application', {
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: false },
    licenseSeries: { type: DataTypes.STRING, allowNull: false },
    licenseNumber: { type: DataTypes.STRING, allowNull: false },
    licenseIssueDate: { type: DataTypes.STRING, allowNull: false },
    carBrand: { type: DataTypes.STRING, allowNull: false },
    carModel: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT },
});

User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

// Регистрация пользователя
app.post('/register', async (req, res) => {
    try {
        const { fullName, phone, email, login, password } = req.body;

        if (!fullName || !phone || !email || !login || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const candidateLogin = await User.findOne({ where: { login } });
        if (candidateLogin) {
            return res.status(400).json({ message: 'Логин уже занят' });
        }

        const candidateEmail = await User.findOne({ where: { email } });
        if (candidateEmail) {
            return res.status(400).json({ message: 'Email уже зарегистрирован' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            phone,
            email,
            login,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Логин
app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({ message: 'Логин и пароль обязательны' });
    }

    try {
        const user = await User.findOne({ where: { login } });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }

        res.json({ message: 'Авторизация успешна', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.post('/applications', async (req, res) => {
    try {
        const {
            fullName, phone, email, address, date, time,
            licenseSeries, licenseNumber, licenseIssueDate,
            carBrand, carModel, message, userId
        } = req.body;

        if (!fullName || !phone || !email || !address || !date || !time ||
            !licenseSeries || !licenseNumber || !licenseIssueDate ||
            !carBrand || !carModel) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const application = await Application.create({
            fullName, phone, email, address, date, time,
            licenseSeries, licenseNumber, licenseIssueDate,
            carBrand, carModel, message, userId
        });

        res.status(201).json({ message: 'Заявка успешно отправлена', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.get('/applications', async (req, res) => {
    try {
        const applications = await Application.findAll({
            order: [['createdAt', 'DESC']],
            include: User,
        });
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при получении заявок' });
    }
});

app.get('/applications/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const applications = await Application.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при получении заявок пользователя' });
    }
});

app.put('/applications/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Некорректный статус' });
        }

        const application = await Application.findByPk(id);
        if (!application) {
            return res.status(404).json({ message: 'Заявка не найдена' });
        }

        application.status = status;
        await application.save();

        res.json({ message: 'Статус обновлен', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.get('/', (req, res) => {
    res.send('Сервер запущен и работает!');
});

// Синхронизация БД и запуск сервера
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
});
