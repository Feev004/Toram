# ⚔️ Toram Online Database & Web Application Suite

ระบบฐานข้อมูลและเว็บแอปพลิเคชันสำหรับ **Toram Online** แยกสถาปัตยกรรม **หน้าบ้าน (Frontend - Next.js)** และ **หลังบ้าน (Backend - Node.js Express)** พร้อมเชื่อมต่อฐานข้อมูล **MySQL (`toram`)** และรองรับ **DevOps Suite & Ngrok Tunnel**

---

## 🏛️ สถาปัตยกรรมระบบ (Architecture)

```
Toram/
├── frontend/             # หน้าบ้าน: Next.js (App Router, Responsive UI, Toram RPG Theme)
│   ├── src/
│   │   ├── app/          # App Router & Styling
│   │   └── components/   # UI Modules (ItemExplorer, BossExplorer, Smith, SQL Console, DevOps)
│   └── Dockerfile
├── backend/              # หลังบ้าน: Node.js + Express API RESTful
│   ├── config/           # MySQL Connection Pool
│   ├── routes/           # items, bosses, recipes, maps, query, devops
│   └── Dockerfile
├── database/
│   └── init.sql          # สคีมาตารางและข้อมูลตั้งต้นของฐานข้อมูล `toram`
├── scripts/
│   └── start-tunnel.js   # สคริปต์รัน Ngrok Tunnel ด้วย Authtoken
├── docker-compose.yml    # DevOps Multi-Container (Frontend + Backend + MySQL)
├── ngrok.yml             # การตั้งค่า Ngrok
├── start-all.ps1         # สคริปต์ 1-Click Launch สำหรับ PowerShell
└── start-all.bat         # สคริปต์ 1-Click Launch สำหรับ Windows Batch
```

---

## 🚀 ฟีเจอร์หลัก (Key Features)

1. ⚔️ **ไอเทม & อุปกรณ์ (Item Database & Explorer)**
   - ค้นหาไอเทมตามชื่อภาษาไทย/ภาษาอังกฤษ (เช่น `เจมินัสซอร์ด`, `Geminus Sword`)
   - กรองตามประเภท (`Weapon`, `Armor`, `Additional`, `Special`, `Crysta`, `Material`)
   - กรองตามสายอาวุธ (`One-Handed Sword`, `Two-Handed Sword`, `Bow`, `Staff`, `Katana`, `Shield` ฯลฯ)
   - แสดงสเตตัสพื้นฐาน (Base ATK, Base DEF, Stability %)
   - ถอดรหัสแสดงสเตตัสหลัก (Main Stats) และสเตตัสโบนัสพิเศษตามเงื่อนไข (Conditional Bonus)
   - แสดงจุดดรอปจากบอส และเงื่อนไขการคราฟต์ที่โรงตีบวก

2. 🐉 **บอส & ดรอป (Boss Compendium)**
   - แสดงรายชื่อบอสทั้งหมด พร้อมแผนที่และบทเนื้อเรื่อง
   - ตารางระดับความยาก (Easy, Normal, Hard, Nightmare, Ultimate) พร้อมค่า HP, Level, EXP
   - ตารางแสดงไอเทมดรอปทั้งหมดของบอส พร้อมเงื่อนไขการทำลายชิ้นส่วน (Part Break)

3. 🔨 **โรงตีบวก & สูตรคราฟต์ (Smith Crafting)**
   - ดูสูตรสร้างอุปกรณ์ ค่าธรรมเนียม Spina และแต้มวัตถุดิบ
   - เครื่องคำนวณจำนวนวัตถุดิบที่ต้องใช้ตามจำนวนชิ้นที่ต้องการสร้าง

4. 💻 **SQL Console (phpMyAdmin Replica)**
   - กล่องรันคำสั่ง SQL สดๆ กับฐานข้อมูล `toram`
   - จำลองรูปแบบ phpMyAdmin พร้อมแสดงเวลารันคำสั่ง (เช่น `Query took 0.0008 seconds`)
   - ปุ่มคิวรีตัวอย่าง (Preset) ตรงตามคำสั่งในรูปภาพ phpMyAdmin ของผู้ใช้
   - Export ผลลัพธ์เป็น CSV และ JSON

5. 🛠️ **DevOps & Ngrok Control Center**
   - ตรวจสอบสถานะการเชื่อมต่อ MySQL, Uptime, Memory, CPU
   - เชื่อมต่อ Ngrok ด้วย Authtoken ที่ระบุ
   - คำสั่งรัน Docker Compose และคู่มือ CI/CD

---

## ⚡ วิธีการเริ่มใช้งาน (Quick Start)

### วิธีที่ 1: เปิดใช้งานแบบ 1-Click (แนะนำ)

ดับเบิลคลิกไฟล์ `start-all.bat` หรือรันผ่าน PowerShell:
```powershell
.\start-all.ps1
```

### วิธีที่ 2: รันแยกทีละส่วน (Manual)

1. **เริ่ม Backend API:**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *(Backend จะทำงานที่ `http://localhost:5000`)*

2. **เริ่ม Frontend (Next.js):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Frontend จะทำงานที่ `http://localhost:3000`)*

3. **เปิด Ngrok Tunnel (แชร์เว็บสู่สาธารณะ):**
   ```bash
   npm run tunnel
   ```

---

## 🐳 การใช้งานผ่าน Docker Compose (DevOps)

รันทั้งระบบรวม Database ด้วยคำสั่งเดียว:
```bash
docker-compose up --build -d
```
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **MySQL Database:** `localhost:3307`