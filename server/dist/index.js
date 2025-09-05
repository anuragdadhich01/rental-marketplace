"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const items_1 = __importDefault(require("./routes/items"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const upload_1 = __importDefault(require("./routes/upload"));
// Utils
const seedData_1 = require("./utils/seedData");
const security_1 = require("./middleware/security");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(security_1.generalLimiter);
app.use(security_1.speedLimiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files
app.use('/uploads', express_1.default.static(process.env.UPLOAD_PATH || 'uploads'));
// Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Rental Marketplace API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/items', items_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/upload', upload_1.default);
// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path
    });
});
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
    console.log(`📦 Items endpoints: http://localhost:${PORT}/api/items/*`);
    console.log(`📋 Booking endpoints: http://localhost:${PORT}/api/bookings/*`);
    console.log(`📁 Upload endpoints: http://localhost:${PORT}/api/upload/*`);
    console.log(`🖼️  Static files: http://localhost:${PORT}/uploads/*`);
    // Seed database with sample data
    await (0, seedData_1.seedDatabase)();
});
exports.default = app;
