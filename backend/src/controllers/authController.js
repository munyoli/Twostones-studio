const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Explicitly force role to 'customer' to prevent mass assignment vulnerability
        const user = await User.create({
            name,
            email,
            password,
            role: 'customer'
        });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for Admin via Environment Variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Find or create admin user in database to ensure we have a valid ID
            const [adminUser] = await User.findOrCreate({
                where: { email: process.env.ADMIN_EMAIL },
                defaults: {
                    name: 'Administrator',
                    password: await require('bcryptjs').hash(process.env.ADMIN_PASSWORD, 10),
                    role: 'admin'
                }
            });

            // Ensure role is admin (in case it existed but was different)
            if (adminUser.role !== 'admin') {
                adminUser.role = 'admin';
                await adminUser.save();
            }

            const token = jwt.sign(
                { id: adminUser.id, role: 'admin', email: adminUser.email, name: adminUser.name },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                message: 'Admin login successful',
                token,
                user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'admin' }
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

module.exports = { register, login, getMe };
