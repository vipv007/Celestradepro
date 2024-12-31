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
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');
const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());
// Twilio configuration
const accountSid = 'ACa82d5e6d304a7ec9e4bfc9d9b8a7eaf5'; // Replace with your Twilio Account SID
const authToken = '8e1331a5fe0c7b966b0ffbca559ffbf2'; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);
// Supabase configuration
const supabaseUrl = 'https://hqemdkeyervllskrrmnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZW1ka2V5ZXJ2bGxza3JybW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0MjUwMzIsImV4cCI6MjAyNzAwMTAzMn0.BUfiUmRa_er1OTZx_ww1Nmp0y4uUNW7-SifOwkwcxpk';
const supabase = createClient(supabaseUrl, supabaseKey);
// Endpoint to send OTP
app.post('/send-otp', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { phone } = req.body;
    console.log('Incoming request body:', req.body); // Log the incoming request body
    if (!phone) {
        console.error('Phone number is missing');
        return res.status(400).send({ error: 'Phone number is required' });
    }
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        // Send OTP using Twilio
        const message = yield client.messages.create({
            from: '+18577464047', // Replace with your Twilio phone number
            to: phone,
            body: `Your OTP code is ${otp}`
        });
        console.log('Twilio message sent:', message.sid);
        // Store the OTP in Supabase with an expiry time (e.g., 10 minutes)
        const { data, error } = yield supabase.from('otps').insert([{ phone, otp, created_at: new Date() }]);
        if (error)
            throw error;
        console.log('OTP stored in Supabase:', data);
        res.send({ success: true, message: 'OTP sent successfully' });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send({ error: error.message });
    }
}));
// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        console.error('Phone number or OTP is missing');
        return res.status(400).send({ error: 'Phone number and OTP are required' });
    }
    try {
        // Check if the OTP exists and is valid (not expired)
        const { data, error } = yield supabase
            .from('otps')
            .select('*')
            .eq('phone', phone)
            .eq('otp', otp)
            .order('created_at', { ascending: false })
            .limit(1);
        if (error)
            throw error;
        if (data.length === 0 || new Date() - new Date(data[0].created_at) > 10 * 60 * 1000) {
            return res.status(400).send({ error: 'Invalid or expired OTP' });
        }
        res.send({ success: true, message: 'OTP verified successfully' });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send({ error: error.message });
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=ser.js.map