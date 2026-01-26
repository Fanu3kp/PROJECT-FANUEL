# Email Setup Instructions

## Step 1: Install Node.js
1. Download from https://nodejs.org/ (LTS version recommended)
2. Install it on your computer

## Step 2: Install Dependencies
1. Open PowerShell/Command Prompt
2. Navigate to your project folder:
   ```
   cd "c:\Users\HomePC\Desktop\FANUEL PROJECT BT\PROJECT-FANUEL"
   ```
3. Install nodemailer:
   ```
   npm install nodemailer
   ```

## Step 3: Generate Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. You may need to sign in with your Google account
3. Select **Mail** and **Windows Computer**
4. Google will generate a 16-character password (no spaces)
5. Copy this password

## Step 4: Update server.js with Your Password
1. Open `server.js` in the same project folder
2. Find this line: `pass: 'your-app-password-here'`
3. Replace `your-app-password-here` with the 16-character password from Step 3
4. Save the file

## Step 5: Run the Email Server
1. Open PowerShell in your project folder
2. Run:
   ```
   node server.js
   ```
3. You should see:
   ```
   Server is running at http://localhost:3000
   ```

## Step 6: Test the Contact Form
1. Open your browser to `http://localhost:3000`
2. Go to the Contact page
3. Fill out the form and click "Send Message"
4. Check fanuelokeno@gmail.com for the email

## Troubleshooting
- If you get "Cannot find module nodemailer": Run `npm install nodemailer` again
- If emails don't send: Check that your App Password is correct (no spaces!)
- Keep both servers running: Python server (port 8000) and Node.js server (port 3000)
