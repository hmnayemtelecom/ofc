# HM-NAYEM-TELECOM BANGLADESH — User App

শুধুমাত্র **ইউজার অ্যাপ** (অ্যাডমিন অ্যাপ এখানে নেই)। Plain HTML + CSS + JS + Firebase।

## সেটআপ

1. Firebase Console-এ প্রজেক্ট বানান, Authentication (Email/Password) ও Firestore চালু করুন।
2. `firebase-config.js` ফাইলে নিজের প্রজেক্টের config বসান (apiKey, projectId ইত্যাদি)।
3. `png/` ফোল্ডারে অপারেটর লোগোগুলো বসান (`png/README.txt` দেখুন)।
4. Firestore-এ নিচের কালেকশনগুলো লাগবে (অ্যাডমিন অ্যাপ তৈরি হওয়ার আগ পর্যন্ত ম্যানুয়ালি ডেটা বসিয়ে টেস্ট করতে পারেন):

- `users/{uid}` — name, email, walletBalance, totalSpent, blocked, district, photoUrl, supportWhatsApp
- `offers/{id}` — name, operator, category (recharge/internet/bundle/minute), validityDays (7/30), price, shopPrice, discount, condition, active
- `orders/{id}` — userId, offerId, offerName, operator, category, number, amount, status (pending/completed/rejected)
- `deposits/{id}` — userId, gateway (bkash/nagad/rocket/upay), amount, trxId, senderNumber, status (pending/approved/rejected)
- `paymentConfig/{gateway}` — number (এই কালেকশনের ডকুমেন্ট ID = bkash/nagad/rocket/upay, ফিল্ড = number)
- `banners/{id}` — imageUrl, socialLink, order, active
- `settings/notice` — text (হোমের স্ক্রলিং নোটিস)
- `notifications/{id}` — userId ("all" বা নির্দিষ্ট uid), title, message, read
- `chats/{uid}/messages/{id}` — text, sender (user/admin), createdAt

5. Firestore Security Rules অবশ্যই লিখতে হবে যাতে ইউজার নিজের ডেটা ছাড়া অন্য কিছু write করতে না পারে (বিশেষ করে `walletBalance` ও `totalSpent` ক্লায়েন্ট থেকে সরাসরি বদলানো বন্ধ করতে হবে — Cloud Functions আসার আগ পর্যন্ত সতর্ক থাকুন)।

## পেজ লিস্ট

| ফাইল | কাজ |
|---|---|
| `login.html` | লগইন/সাইনআপ (এন্ট্রি পয়েন্ট) |
| `home.html` | হোম ড্যাশবোর্ড |
| `recharge-operators.html` | সকল সিমে রিচার্জ — অপারেটর গ্রিড |
| `internet-operators.html` | ইন্টারনেট — অপারেটর গ্রিড |
| `bundle.html` / `minute.html` | বান্ডিল / মিনিট — অপারেটর গ্রিড |
| `offers.html` | অফার লিস্ট + Buy Now মোডাল |
| `simple-recharge.html` | সরাসরি রিচার্জ (Skitto স্টাইল) |
| `deposit.html` | ডিপোজিট রিকোয়েস্ট ফর্ম |
| `profile.html` | প্রফাইল + Top 10 লিডারবোর্ড |
| `chat.html` | ইনবক্স (এডমিনের সাথে চ্যাট) |
| `notifications.html` | বেল আইকন নোটিফিকেশন |
| `history.html` | রিচার্জ/ডিপোজিট হিস্টোরি |
| `privacy-policy.html`, `rules.html`, `about.html`, `developer-info.html` | প্লেসহোল্ডার — নিজের রেডি HTML দিয়ে রিপ্লেস করুন |

## গুরুত্বপূর্ণ নোট

- ব্লকড ইউজার চেক প্রতিটা পেজেই `checkBlockedStatus(uid)` দিয়ে হয় — ফুলস্ক্রিন ওভারলে এসে আটকে দেবে, WhatsApp বাটন থাকবে।
- অফার কেনা ও সাধারণ রিচার্জ — দুটোতেই Firestore transaction ব্যবহার করা হয়েছে যাতে ব্যালেন্স কাটা atomic হয় (রেসকন্ডিশন এড়াতে)।
- **রিফান্ড লজিক এখনো নেই** — অ্যাডমিন অ্যাপ থেকে অর্ডার Reject করলে অটো-রিফান্ড Cloud Function দিয়ে বসাতে হবে (অ্যাডমিন অ্যাপ তৈরির সময়)।
- টোস্ট মেসেজের জন্য `showToast('মেসেজ', 'success'|'error'|'info')` — যেকোনো পেজ থেকে কল করা যাবে।
