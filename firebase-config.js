/* ==========================================================================
   HM-NAYEM-TELECOM BANGLADESH — Firebase Configuration
   এই ফাইলটি সব HTML পেজ থেকে <script> ট্যাগ দিয়ে লোড হবে।
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyBFi1-JvNby6Icj_Fj6ek7gmKo3U5akPXE",
  authDomain: "hm-nayem-telecom.firebaseapp.com",
  projectId: "hm-nayem-telecom",
  storageBucket: "hm-nayem-telecom.firebasestorage.app",
  messagingSenderId: "640135982172",
  appId: "1:640135982172:web:0e65779dca58aa6dfd4a99",
  measurementId: "G-YZQX3HZ4S8"
};
// Firebase SDK ইনিশিয়ালাইজ (compat SDK, Realtime Database ব্যবহার করা হয়েছে)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

/* ==========================================================================
   শেয়ার্ড হেল্পার ফাংশন — সব পেজে ব্যবহারযোগ্য
   ========================================================================== */

// বর্তমান লগইন করা ইউজার না থাকলে লগইন পেজে পাঠিয়ে দেয়
function requireAuth(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      callback(user);
    } else {
      window.location.href = "index.html";
    }
  });
}

// ইউজার ব্লক করা আছে কিনা চেক করে — থাকলে ফুলস্ক্রিন ব্লক ওভারলে দেখায়
function checkBlockedStatus(uid) {
  db.ref("users/" + uid).on("value", (snap) => {
    const data = snap.val();
    if (data && data.blocked === true) {
      showBlockedOverlay(data.supportWhatsApp || "8801XXXXXXXXX");
    }
  });
}

// ফুলস্ক্রিন ব্লক ওভারলে তৈরি করে দেখায় (পুরো স্ক্রিন লক করে দেয়)
function showBlockedOverlay(whatsappNumber) {
  if (document.getElementById("blocked-overlay")) return; // আগে থেকে থাকলে দুইবার বসাবে না

  const overlay = document.createElement("div");
  overlay.id = "blocked-overlay";
  overlay.innerHTML = `
    <div class="blocked-box">
      <div class="blocked-icon">⛔</div>
      <h2>আমাদের রুলস ভঙ্গ করার কারনে আপনাকে ব্লক করা হয়েছে</h2>
      <p>সাপোর্ট টিমের সাথে যোগাযোগ করুন</p>
      <a href="https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}" target="_blank" class="blocked-btn">
        📞 যোগাযোগ করুন
      </a>
    </div>
  `;
  overlay.style.cssText = `
    position: fixed; top:0; left:0; width:100vw; height:100vh;
    background: rgba(0,0,0,0.95); z-index: 999999;
    display:flex; align-items:center; justify-content:center;
    backdrop-filter: blur(6px);
  `;
  const style = document.createElement("style");
  style.textContent = `
    .blocked-box {
      text-align:center; padding:32px 24px; max-width:320px;
      border: 2px solid #ff2d55; border-radius:18px;
      box-shadow: 0 0 25px rgba(255,45,85,0.6), inset 0 0 15px rgba(255,45,85,0.2);
      background: #0a0a0a;
    }
    .blocked-icon { font-size:48px; margin-bottom:12px; }
    .blocked-box h2 { color:#ff2d55; font-size:20px; margin-bottom:8px; }
    .blocked-box p { color:#ddd; font-size:14px; margin-bottom:20px; }
    .blocked-btn {
      display:inline-block; padding:12px 28px; border-radius:30px;
      background: linear-gradient(135deg,#25D366,#128C7E);
      color:#fff; text-decoration:none; font-weight:bold;
      box-shadow: 0 0 15px rgba(37,211,102,0.6);
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);
}

// টোস্ট মেসেজ দেখানোর শেয়ার্ড ফাংশন (সব পেজে window.showToast() দিয়ে কল করা যাবে)
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position:fixed; top:14px; left:50%; transform:translateX(-50%);
      z-index:999999; display:flex; flex-direction:column; gap:8px;
      width:90%; max-width:400px; pointer-events:none;
    `;
    document.body.appendChild(container);
  }

  const colors = {
    success: { bg: "#0a2a1a", border: "#00e676", icon: "✅" },
    error:   { bg: "#2a0a0a", border: "#ff2d55", icon: "❌" },
    info:    { bg: "#0a1a2a", border: "#00e5ff", icon: "ℹ️" }
  };
  const c = colors[type] || colors.success;

  const toast = document.createElement("div");
  toast.textContent = `${c.icon} ${message}`;
  toast.style.cssText = `
    background:${c.bg}; border:1.5px solid ${c.border}; color:#fff;
    padding:12px 18px; border-radius:12px; font-size:14px; text-align:center;
    box-shadow:0 0 18px ${c.border}66; opacity:0; transform:translateY(-20px);
    transition:all 0.35s ease;
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

// ক্লিপবোর্ডে কপি করার শেয়ার্ড ফাংশন
// আধুনিক navigator.clipboard API আগে ট্রাই করে, না থাকলে (পুরনো WebView/
// Facebook-Instagram in-app browser/non-HTTPS পেজে) পুরনো পদ্ধতিতে fallback করে
function copyToClipboard(text, label = "কপি হয়েছে") {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(label, "success"))
      .catch(() => fallbackCopyToClipboard(text, label));
  } else {
    fallbackCopyToClipboard(text, label);
  }
}

function fallbackCopyToClipboard(text, label) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '-9999px';
    ta.setAttribute('readonly', '');
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) showToast(label, "success");
    else showToast('কপি করা যায়নি, ম্যানুয়ালি সিলেক্ট করে কপি করুন', 'error');
  } catch (e) {
    showToast('কপি করা যায়নি, ম্যানুয়ালি সিলেক্ট করে কপি করুন', 'error');
  }
}