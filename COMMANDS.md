# CMS Portal — All PowerShell Commands

## EVERY TIME YOU START THE APP — do these steps

---

### WINDOW 1 — Start Backend (Spring Boot)

Open PowerShell and run these commands ONE BY ONE:

```
cd C:\Users\geetl\OneDrive\Desktop\cms-project\backend
mvn spring-boot:run
```

Wait until you see:
Started ComplaintManagementApplication in X seconds

DO NOT close this window. Leave it running.

---

### WINDOW 2 — Start Frontend (React)

Open a NEW PowerShell window and run:

```
cd C:\Users\geetl\OneDrive\Desktop\cms-project\frontend
npm start
```

Wait until you see:
Compiled successfully!
Local: http://localhost:3000

Your browser opens automatically.

---

### WHEN PORT 8080 IS ALREADY IN USE (run in backend window)

```
Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess
Stop-Process -Id XXXX -Force
mvn spring-boot:run
```
(Replace XXXX with the number shown)

---

### WHEN PORT 3000 IS ALREADY IN USE (run in frontend window)

```
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Stop-Process -Id XXXX -Force
npm start
```

---

### TO STOP EVERYTHING

Go to each window and press: Ctrl + C

---

### IF YOU CHANGE ANY BACKEND JAVA FILE

```
cd C:\Users\geetl\OneDrive\Desktop\cms-project\backend
mvn clean install -DskipTests
mvn spring-boot:run
```

---

### IF YOU CHANGE ANY FRONTEND FILE

The frontend auto-reloads. No restart needed.

---

### FULL RESET — if something is broken

```
cd C:\Users\geetl\OneDrive\Desktop\cms-project\backend
mvn clean install -DskipTests
mvn spring-boot:run
```

In second window:
```
cd C:\Users\geetl\OneDrive\Desktop\cms-project\frontend
npm install
npm start
```

---

## HOW THE APP WORKS

1. Open http://localhost:3000
2. Click "Get Started" -> Fill name, email, password -> Click "Send Verification Code"
3. Check your Gmail inbox (cms251803@gmail.com receives the OTP)
4. If email fails -> check backend window for the OTP printed there
5. Enter the 6-digit OTP -> Click "Verify & Continue"
6. You are logged in! Click "+ New Complaint"
7. Fill category, subject, description, priority -> Submit
8. Wait 3 minutes -> AI response appears automatically
9. Rate the resolution with stars -> Click "Submit Feedback"
10. Ticket is closed!

---

## YOUR CREDENTIALS (already saved in application.properties)

MySQL Password : System
Gmail Account  : cms251803@gmail.com
Gmail App Pass : bbycxzmqohkcfwsn
Anthropic Key  : already configured

