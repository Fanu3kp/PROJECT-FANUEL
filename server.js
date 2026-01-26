const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Import nodemailer for email sending
let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (e) {
    console.log('⚠️  nodemailer not installed. Install it with: npm install nodemailer');
    nodemailer = null;
}

// Gmail SMTP configuration
const transporter = nodemailer ? nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fanuelokeno@gmail.com',
        pass: 'sgir mkzn mlth svbn' // Gmail App Password
    }
}) : null;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve static files
    if (req.method === 'GET') {
        let filePath = path.join(__dirname, req.url);
        if (filePath === path.join(__dirname, '/')) {
            filePath = path.join(__dirname, 'index.html');
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - File Not Found</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
        return;
    }

    // Handle contact form submission
    if (req.method === 'POST' && req.url === '/api/contact') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                // Save email to file
                const timestamp = new Date().toISOString();
                const emailContent = `
===========================================
New Contact Form Submission
===========================================
Date: ${timestamp}
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Message:
${data.message}
===========================================
                `.trim();

                // Save to emails.txt file
                fs.appendFile(path.join(__dirname, 'emails.txt'), emailContent + '\n\n', (err) => {
                    if (err) {
                        console.log('Error saving to file:', err);
                    } else {
                        console.log('✅ Email saved to emails.txt');
                    }
                });

                // Send email to Gmail inbox if nodemailer is available
                if (transporter) {
                    const mailOptions = {
                        from: 'fanuelokeno@gmail.com',
                        to: 'fanuelokeno@gmail.com',
                        subject: `Portfolio Contact: ${data.subject}`,
                        html: `
                            <h2>New Contact Form Submission</h2>
                            <hr/>
                            <p><strong>From:</strong> ${data.name}</p>
                            <p><strong>Email:</strong> ${data.email}</p>
                            <p><strong>Subject:</strong> ${data.subject}</p>
                            <hr/>
                            <p><strong>Message:</strong></p>
                            <p>${data.message.replace(/\n/g, '<br>')}</p>
                            <hr/>
                            <p style="color: gray; font-size: 12px;">This email was sent from your portfolio contact form.</p>
                        `
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('❌ Error sending email:', error.message);
                        } else {
                            console.log('📧 Email sent to Gmail inbox successfully');
                        }
                    });
                }

                // Send success response
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Email sent successfully!' }));

            } catch (error) {
                console.log('Parse error:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid request: ' + error.message }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
    console.log('📧 Contact form submissions will be saved to emails.txt');
});
