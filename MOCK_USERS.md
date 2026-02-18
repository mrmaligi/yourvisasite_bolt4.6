# VisaBuild Mock Users

**Last Updated:** February 19, 2026  
**Total Users:** 31  
**Default Password:** `TestPass123!`

---

## 👤 Regular Users (11)

| # | Email | Full Name | Role |
|---|-------|-----------|------|
| 1 | user1@visabuild.test | Sarah Chen | user |
| 2 | user2@visabuild.test | James Wilson | user |
| 3 | user3@visabuild.test | Priya Patel | user |
| 4 | user4@visabuild.test | Mohammed Al-Hassan | user |
| 5 | user5@visabuild.test | Emma Thompson | user |
| 6 | user6@visabuild.test | Carlos Rodriguez | user |
| 7 | user7@visabuild.test | Yuki Tanaka | user |
| 8 | user8@visabuild.test | Fatima Ahmed | user |
| 9 | user9@visabuild.test | Liam O'Brien | user |
| 10 | user10@visabuild.test | Sofia Rossi | user |
| 11 | user11@visabuild.test | User Eleven | user |

**User Features:**
- Can search visas
- Can save visas to favorites
- Can upload documents
- Can buy premium content ($49/visa)
- Can book lawyer consultations
- Can track visa processing times

---

## ⚖️ Lawyers (10)

| # | Email | Full Name | Bar Number | Jurisdiction | Hourly Rate |
|---|-------|-----------|------------|--------------|-------------|
| 1 | lawyer1@visabuild.test | Dr. Amanda Hayes | AU-12345 | NSW | $250/hr |
| 2 | lawyer2@visabuild.test | Barrister Raj Kapoor | AU-23456 | VIC | $300/hr |
| 3 | lawyer3@visabuild.test | Sarah Mitchell LLB | AU-34567 | QLD | $200/hr |
| 4 | lawyer4@visabuild.test | David Park | AU-45678 | WA | $275/hr |
| 5 | lawyer5@visabuild.test | Maria Santos | AU-56789 | SA | $225/hr |
| 6 | lawyer6@visabuild.test | Thomas Wright | AU-67890 | NSW | $350/hr |
| 7 | lawyer7@visabuild.test | Aisha Khan | AU-78901 | VIC | $280/hr |
| 8 | lawyer8@visabuild.test | Robert Chen | AU-89012 | QLD | $320/hr |
| 9 | lawyer9@visabuild.test | Jennifer Adams | AU-90123 | WA | $240/hr |
| 10 | lawyer10@visabuild.test | Michael Brown | AU-01234 | SA | $290/hr |

**Lawyer Features:**
- Verified and approved
- Can set availability (consultation slots)
- Can view client documents
- Can set hourly rates
- Can receive bookings
- Can comment on news
- Can submit weighted tracker entries

---

## 👑 Admins (10)

| # | Email | Full Name | Role |
|---|-------|-----------|------|
| 1 | admin1@visabuild.test | Alex Admin | admin |
| 2 | admin2@visabuild.test | System Moderator | admin |
| 3 | admin3@visabuild.test | Content Manager | admin |
| 4 | admin4@visabuild.test | Support Lead | admin |
| 5 | admin5@visabuild.test | Security Admin | admin |
| 6 | admin6@visabuild.test | Data Admin | admin |
| 7 | admin7@visabuild.test | User Admin | admin |
| 8 | admin8@visabuild.test | Finance Admin | admin |
| 9 | admin9@visabuild.test | Tech Admin | admin |
| 10 | admin10@visabuild.test | Super Admin | admin |

**Admin Features:**
- Full dashboard access
- Manage users and lawyers
- Approve/reject lawyer registrations
- Manage visa information
- Manage premium content
- Manage news articles
- View all tracker data
- Manage YouTube feed

---

## 🔑 Quick Login Reference

### For Testing User Flow:
```
Email: user1@visabuild.test
Password: TestPass123!
```

### For Testing Lawyer Flow:
```
Email: lawyer1@visabuild.test
Password: TestPass123!
```

### For Testing Admin Flow:
```
Email: admin1@visabuild.test
Password: TestPass123!
```

---

## 🧪 Test Scenarios

### 1. User Registration & Onboarding
- Login as `user1@visabuild.test`
- Search for visa subclass 189 (Skilled Independent)
- Save visa to favorites
- Upload documents (passport, ID)

### 2. Premium Purchase
- Login as `user2@visabuild.test`
- Find visa 190 (Skilled Nominated)
- Click "Buy Premium Guide" ($49)
- Complete Stripe test payment
- Access premium content

### 3. Lawyer Consultation
- Login as `user3@visabuild.test`
- Go to Lawyer Directory
- Book consultation with Dr. Amanda Hayes
- Pay consultation fee
- Upload documents for lawyer review

### 4. Lawyer Workflow
- Login as `lawyer1@visabuild.test`
- Check availability settings
- View client bookings
- Access client documents
- Submit tracker update

### 5. Admin Management
- Login as `admin1@visabuild.test`
- Review pending lawyer applications
- Manage visa database
- Add/edit premium content
- Moderate news comments

---

## 📊 Database Stats

| Table | Count | Description |
|-------|-------|-------------|
| visas | 99 | Australian visa subclasses |
| profiles | 31 | Users (11) + Lawyers (10) + Admins (10) |
| visa_premium_content | 90 | Premium guides (5 steps × 18 visas) |
| tracker_entries | 15+ | Processing time reports |
| news_articles | 5 | Immigration news |
| news_comments | 10 | User/lawyer discussions |
| marketplace_listings | 5 | Lawyer templates/checklists |
| marketplace_reviews | 3 | User reviews |
| consultation_slots | 50 | Lawyer availability |
| saved_visas | 30+ | User saved visas |
| user_documents | 40+ | Uploaded documents |
| messages | 20+ | User-lawyer chats |

---

## 🌐 Live URLs

- **Production:** https://yourvisasite-bolt4-6.vercel.app/
- **Supabase Dashboard:** https://supabase.com/dashboard/project/usiorucxradthxhetqaq
- **GitHub Repo:** https://github.com/mrmaligi2007/yourvisasite_bolt4.6

---

## 🔧 Support

For any issues:
1. Check browser console (F12) for errors
2. Verify Supabase connection
3. Report errors with screenshots
4. Contact: Mk via Telegram

---

*Generated by VisaBuild Dev Agent*
