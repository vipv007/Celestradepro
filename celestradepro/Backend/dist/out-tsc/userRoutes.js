var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const router = express.Router();
const User = require('./models/User'); // Correctly import the User model
// Endpoint to store email
router.post('/store-email', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = new User({ email });
        yield user.save();
        res.status(200).json({ message: 'Email stored successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to store email' });
    }
}));
// Endpoint to get user theme
router.get('/user-theme/:email', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield User.findOne({ email });
        res.status(200).json({ theme: user.theme });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch theme' });
    }
}));
// Endpoint to update user theme
router.post('/update-user-theme', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email, theme } = req.body;
        yield User.updateOne({ email }, { theme });
        res.status(200).json({ message: 'Theme updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update theme' });
    }
}));
// Endpoint to get user data
router.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User.findOne({ email });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get user data' });
    }
}));
// Endpoint to update selected sections for the user
router.post('/update-selected-sections', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email, selectedSections } = req.body;
        yield User.updateOne({ email }, { selectedSections });
        res.status(200).json({ message: 'Selected sections updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update selected sections' });
    }
}));
module.exports = router;
//# sourceMappingURL=userRoutes.js.map