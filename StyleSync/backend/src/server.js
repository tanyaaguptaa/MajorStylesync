const express = require('express');
const dotenv = require('dotenv');
const compression = require('compression');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes')
const addressRoutes = require('./routes/addressRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(express.json());
app.use(cors());
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products/:id/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/category', categoryRoutes)
app.use('/api/address', addressRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));
