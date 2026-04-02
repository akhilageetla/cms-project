# CMS Portal — Online Complaint Management System
## Complete Setup & Run Guide (Step-by-Step)

---

## WHAT YOU ARE BUILDING
- React 18 frontend  →  runs on http://localhost:3000
- Spring Boot 3 backend  →  runs on http://localhost:8080
- MySQL 8 database  →  runs on port 3306
- Claude AI (Anthropic)  →  called automatically after 3 minutes

---

## PREREQUISITE SOFTWARE — INSTALL THESE FIRST

### 1. Java 17
- Download: https://adoptium.net/temurin/releases/?version=17
- Choose: Windows x64 .msi installer → Install with defaults
- Verify: open Command Prompt → type:  java -version
  You should see:  openjdk version "17.x.x"

### 2. Maven 3.9
- Download: https://maven.apache.org/download.cgi
  → apache-maven-3.9.x-bin.zip
- Extract to:  C:\maven
- Add to PATH:
    Windows: Search "environment variables" → System Variables
    → select "Path" → Edit → New → type:  C:\maven\bin
- Verify:  mvn -version

### 3. Node.js 18+
- Download: https://nodejs.org  (LTS version)
- Install with defaults
- Verify:  node -v   and   npm -v

### 4. MySQL 8
- Download: https://dev.mysql.com/downloads/installer/
- Choose: mysql-installer-community → Run installer
- Setup Type: Developer Default
- Set root password — WRITE IT DOWN, you will need it
- Verify: open MySQL Workbench

### 5. Git (optional but useful)
- Download: https://git-scm.com/download/win

---

## STEP 1 — SET UP THE DATABASE

1. Open MySQL Workbench
2. Click the local connection (root)
3. Enter your root password
4. Go to:  File → Open SQL Script
5. Browse to this folder:  cms-project/database/setup.sql
6. Click the lightning bolt ⚡ button to run it
7. You should see:  "Database setup complete!"

---

## STEP 2 — GET YOUR API KEYS

### Gmail App Password (for OTP emails)
1. Go to: https://myaccount.google.com
2. Click "Security" in the left menu
3. Under "How you sign in to Google" → enable 2-Step Verification first
4. Then go to: https://myaccount.google.com/apppasswords
5. App name: type "CMS Portal" → click Create
6. COPY the 16-character password shown (e.g.  abcd efgh ijkl mnop)
7. Remove the spaces when you paste it:  abcdefghijklmnop

### Anthropic API Key
1. Go to: https://console.anthropic.com
2. Sign up / log in
3. Click "API Keys" in the left menu
4. Click "Create Key" → name it "CMS Portal"
5. COPY the key starting with  sk-ant-...

---

## STEP 3 — CONFIGURE THE BACKEND

Open this file in any text editor (Notepad, VS Code, etc.):
  cms-project/backend/src/main/resources/application.properties

Change these 4 lines:

```
spring.datasource.password=YOUR_MYSQL_PASSWORD
```
→ Replace  YOUR_MYSQL_PASSWORD  with your MySQL root password
  Example:  spring.datasource.password=MyPass@123

```
spring.mail.username=YOUR_GMAIL_ADDRESS@gmail.com
```
→ Replace with your actual Gmail address
  Example:  spring.mail.username=ravi.kumar@gmail.com

```
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
```
→ Replace with the 16-character app password (no spaces)
  Example:  spring.mail.password=abcdefghijklmnop

```
anthropic.api.key=YOUR_ANTHROPIC_API_KEY
```
→ Replace with your Anthropic API key
  Example:  anthropic.api.key=sk-ant-api03-xxxxx...

SAVE the file.

---

## STEP 4 — START THE BACKEND (Spring Boot)

Open Command Prompt (cmd) or Windows Terminal.

```
cd path\to\cms-project\backend
mvn clean install -DskipTests
mvn spring-boot:run
```

WAIT for this message:
  Started ComplaintManagementApplication in X.XXX seconds

The backend is now running at:  http://localhost:8080

Leave this window open. Do NOT close it.

Common errors:
- "Access denied for user 'root'" → Wrong MySQL password in application.properties
- "Port 8080 already in use" → Another app is using 8080. Change server.port=8081
- "java: command not found" → Java not installed or not in PATH

---

## STEP 5 — START THE FRONTEND (React)

Open a NEW Command Prompt window (keep the backend one open).

```
cd path\to\cms-project\frontend
npm install
npm start
```

npm install takes 2-5 minutes the first time (downloads packages).

WAIT for:
  Compiled successfully!
  Local: http://localhost:3000

Your browser will open automatically at http://localhost:3000

---

## STEP 6 — USE THE APPLICATION

### First Time (New User)
1. Browser opens at http://localhost:3000
2. Click "Get Started" or "Create Account"
3. Fill in: Name, Email, Password (8+ characters)
4. Click "Send Verification Code"
   → An OTP email is sent to your Gmail
5. Open your Gmail, find the email from CMS Portal
6. Enter the 6-digit code in the OTP screen
7. You are now logged in!

### Submit a Complaint
1. Click "+ New Complaint"
2. Select Category, enter Subject and Description
3. Select Priority, click "Submit Complaint"
4. You see your ticket with a unique ID like:  CMS-2024-12345
5. A countdown timer shows:  AI response in 3:00
6. After 3 minutes, the AI response appears automatically
   (The page auto-refreshes every 10 seconds)

### Give Feedback
1. After AI responds, scroll down
2. Click the stars (1-5) to rate the resolution
3. Optionally add a comment
4. Click "Submit Feedback"
5. Ticket status changes to "Closed"

### Sign In (Returning User)
1. Go to http://localhost:3000
2. Click "Sign In"
3. Enter your email and password
4. You see your Dashboard with all past tickets

---

## FOLDER STRUCTURE

```
cms-project/
├── backend/                          ← Spring Boot
│   ├── pom.xml                       ← Maven dependencies
│   └── src/main/
│       ├── java/com/cms/
│       │   ├── ComplaintManagementApplication.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   └── ComplaintController.java
│       │   ├── service/
│       │   │   ├── AuthService.java
│       │   │   ├── ComplaintService.java
│       │   │   ├── AiService.java
│       │   │   └── EmailService.java
│       │   ├── model/
│       │   │   ├── User.java
│       │   │   ├── Complaint.java
│       │   │   ├── OtpToken.java
│       │   │   └── Feedback.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   ├── ComplaintRepository.java
│       │   │   ├── OtpTokenRepository.java
│       │   │   └── FeedbackRepository.java
│       │   ├── security/
│       │   │   ├── JwtUtil.java
│       │   │   ├── JwtFilter.java
│       │   │   └── SecurityConfig.java
│       │   └── dto/
│       │       ├── AuthDTOs.java
│       │       └── ComplaintDTOs.java
│       └── resources/
│           └── application.properties  ← EDIT THIS FILE
│
├── frontend/                          ← React 18
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       ├── context/AuthContext.js
│       ├── services/api.js
│       ├── components/
│       │   ├── Navbar.js
│       │   └── PrivateRoute.js
│       └── pages/
│           ├── Landing.js
│           ├── SignUp.js
│           ├── OtpVerify.js
│           ├── SignIn.js
│           ├── Dashboard.js
│           ├── NewComplaint.js
│           └── ComplaintDetail.js
│
└── database/
    └── setup.sql                      ← RUN THIS FIRST
```

---

## API REFERENCE

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | /api/auth/signup | Register new user | No |
| POST | /api/auth/verify-otp | Verify email OTP | No |
| POST | /api/auth/signin | Login | No |
| POST | /api/complaints | Submit complaint | Yes |
| GET | /api/complaints | List my complaints | Yes |
| GET | /api/complaints/{id} | Get one complaint | Yes |
| POST | /api/complaints/{id}/feedback | Submit feedback | Yes |

---

## TROUBLESHOOTING

### "CORS error" in browser console
→ Make sure backend is running on port 8080
→ Check application.properties:  cors.allowed.origins=http://localhost:3000

### OTP email not received
→ Check spam/junk folder
→ Make sure 2-Step Verification is ON in your Google account
→ Use App Password, NOT your regular Gmail password
→ Check the backend console for email error messages

### AI response not appearing after 3 minutes
→ Check your Anthropic API key in application.properties
→ Check backend console for error messages
→ Make sure you have credits in your Anthropic account
→ The app uses a fallback response if AI fails, so you will still see an answer

### npm install fails
→ Delete  cms-project/frontend/node_modules  folder
→ Run  npm cache clean --force
→ Run  npm install  again

### Maven build fails
→ Make sure Java 17 is installed:  java -version
→ Make sure JAVA_HOME is set to your Java 17 installation
→ Run:  mvn clean install -DskipTests  (skip tests on first run)

---

## PORTS USED

| Service | Port | URL |
|---------|------|-----|
| React Frontend | 3000 | http://localhost:3000 |
| Spring Boot API | 8080 | http://localhost:8080 |
| MySQL Database | 3306 | localhost:3306 |

---

## IMPORTANT NOTES

1. Always start the BACKEND first, then the FRONTEND
2. Both terminal windows must stay open while using the app
3. The AI scheduler runs every 30 seconds checking for pending complaints
4. Complaints older than 3 minutes get picked up automatically
5. JWT tokens expire after 24 hours — you will be logged out automatically
6. All data is stored in your local MySQL database

---

Built with: React 18 · Spring Boot 3 · MySQL 8 · Claude AI (Anthropic)
