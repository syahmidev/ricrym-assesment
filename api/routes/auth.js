const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const Account = require('../models/Account');

const router = express.Router();
const SECRET_KEY = '123456';

// Login Endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ where: { username } });
        if (!account) return res.status(404).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });

        if (account.secretkey_2fa) {
            // 2FA is enabled for this user
            return res.json({ message: '2FA required', twoFactorRequired: true });
        }

        // If no 2FA, generate and return the token
        const token = jwt.sign({ name: account.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

// Enable 2FA
router.post('/enable-2fa', async (req, res) => {
    try {
        // Generate 2FA Secret
        const secret = speakeasy.generateSecret({ length: 20 });

        // Generate a QR code
        const otpauthUrl = secret.otpauth_url; // OTP Auth URL
        const qrCode = await qrcode.toDataURL(otpauthUrl); // Generate QR code image

        res.json({
            message: '2FA enabled successfully',
            secret: secret.base32,
            qrCode,
        });
    } catch (error) {
        console.error('Error enabling 2FA:', error);
        res.status(500).json({ error: 'Failed to enable 2FA' });
    }
});

// Verify 2FA
router.post('/verify-2fa', async (req, res) => {
    const { username, code, secret } = req.body;

    try {
        const account = await Account.findOne({ where: { username } });
        if (!account) return res.status(404).json({ error: 'User not found' });

        // Store the secret in the database
        account.secretkey_2fa = secret;
        await account.save();

        const isValid = speakeasy.totp.verify({
            secret: account.secretkey_2fa,
            encoding: 'base32',
            token: code,
        });

        if (!isValid) return res.status(401).json({ error: 'Invalid 2FA code' });

        // Generate a token after successful 2FA
        const token = jwt.sign({ name: account.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ error: 'Failed to verify 2FA' });
    }
});

// Check 2FA
router.post('/check-2fa', async (req, res) => {
    const { username } = req.body;

    try {
        const account = await Account.findOne({ where: { username } });

        // If the user is not found, return a 404 error
        if (!account) return res.status(404).json({ error: 'User not found' });

        // Check if the 2FA secret exists
        const is2FAEnabled = !!account.secretkey_2fa;
        return res.json(is2FAEnabled); // Respond with true or false
    } catch (error) {
        return res.status(500).json({ error: 'Failed to check 2FA' });
    }
});


module.exports = router;
