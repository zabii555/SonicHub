#!/usr/bin/env python3
"""
SonicHub - Headphone Store
Backend server (Python standard library only - NO pip install needed!)
Run:  python server.py
Open: http://localhost:8000
"""
import json, os, smtplib, time, uuid
from email.message import EmailMessage
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, "data")
os.makedirs(DATA_DIR, exist_ok=True)
CONTACT_EMAIL = "zm6133971@gmail.com"

PRODUCTS = [
  {"id": 1, "name": "AKG N9 Hybrid ANC", "category": "Wireless", "price": 349,
   "old_price": 399, "rating": 4.9, "img": "/static/img/8_Buy_the_AKG_N9_Hybrid_Premium_Wireless.png",
   "desc": "Premium wireless over-ear with adaptive noise cancelling & 100h battery."},
  {"id": 2, "name": "Beats Studio Pro", "category": "Wireless", "price": 329,
   "old_price": 379, "rating": 4.8, "img": "/static/img/2_Beats_Studio_Pro_Premium_Wireless.png",
   "desc": "Iconic sound, custom acoustic platform, lossless audio via USB-C."},
  {"id": 3, "name": "Green Lion GP32X Gaming", "category": "Gaming", "price": 89,
   "old_price": 120, "rating": 4.6, "img": "/static/img/3_Green_Lion_GP32X_Gaming_Headphone.png",
   "desc": "RGB gaming headset with 7.1 surround sound and noise-cancel mic."},
  {"id": 4, "name": "Apple AirPods Pro 2", "category": "AirPods", "price": 249,
   "old_price": 299, "rating": 4.9, "img": "/static/img/10_Apple_AirPods_Pro_2.png",
   "desc": "Active noise cancelling earbuds with H2 chip & 30h total battery."},
  {"id": 5, "name": "Roland VMH-S100 Studio", "category": "Studio", "price": 249,
   "old_price": 299, "rating": 4.7, "img": "/static/img/5_Roland_VMH_S100_Premium_Studio_Headphone.png",
   "desc": "Professional studio monitoring headphones, flat reference sound."},
  {"id": 6, "name": "HECATE G2II 7.1", "category": "Gaming", "price": 79,
   "old_price": 99, "rating": 4.4, "img": "/static/img/6_G2II_Black_HECATE_Gaming_Headset.png",
   "desc": "360-degree surround sound gaming headset with detachable mic."},
  {"id": 7, "name": "Logitech G733 RGB", "category": "Gaming", "price": 159,
   "old_price": 199, "rating": 4.8, "img": "/static/img/7_Logitech_G733_LIGHTSPEED_Wireless.png",
   "desc": "LIGHTSPEED wireless with RGB lighting, only 278g ultra light."},
  {"id": 8, "name": "SoundArt M98 Studio", "category": "Studio", "price": 129,
   "old_price": 169, "rating": 4.5, "img": "/static/img/9_SoundArt_Professional_Premium_Closed.png",
   "desc": "Closed-back studio headphones trusted by producers worldwide."},
  {"id": 9, "name": "Sony WF-1000XM5", "category": "Earbuds", "price": 299,
   "old_price": 349, "rating": 4.8, "img": "/static/img/13_Sony_WF_1000XM5_Earbuds.png",
   "desc": "Industry leading ANC earbuds with Hi-Res audio & 36h battery."},
  {"id": 10, "name": "Beats Studio Buds+", "category": "Earbuds", "price": 169,
   "old_price": 199, "rating": 4.6, "img": "/static/img/14_Beats_Studio_Buds_Plus.png",
   "desc": "Punchy bass, active ANC & seamless one-touch pairing."},
  {"id": 11, "name": "Apple AirPods (2nd Gen)", "category": "AirPods", "price": 129,
   "old_price": 159, "rating": 4.7, "img": "/static/img/21_AirPods_2nd_Gen.png",
   "desc": "The iconic AirPods with H1 chip, Hey Siri & wireless charging case."},
  {"id": 12, "name": "JBL Tour Pro 2", "category": "Earbuds", "price": 149,
   "old_price": 179, "rating": 4.4, "img": "/static/img/15_JBL_Tour_Pro_2.png",
   "desc": "Smart charging case with touchscreen, ANC & 40h playtime."},
  {"id": 13, "name": "Sennheiser Momentum TWS", "category": "Earbuds", "price": 219,
   "old_price": 259, "rating": 4.7, "img": "/static/img/19_Sennheiser_Momentum_TWS.png",
   "desc": "True wireless with audiophile sound & adaptive noise cancelling."},
  {"id": 14, "name": "Bose QuietComfort Earbuds", "category": "Earbuds", "price": 239,
   "old_price": 279, "rating": 4.8, "img": "/static/img/16_Bose_QuietComfort_Earbuds.png",
   "desc": "World-class noise cancelling with deep, rich bass response."},
  {"id": 15, "name": "Nothing Ear (a)", "category": "Earbuds", "price": 129,
   "old_price": 159, "rating": 4.5, "img": "/static/img/17_Nothing_Ear_a.png",
   "desc": "Clean sound, modern design and low-latency wireless performance."},
  {"id": 16, "name": "Bose QC Earbuds II", "category": "Earbuds", "price": 199,
   "old_price": 249, "rating": 4.6, "img": "/static/img/18_Bose_QC_Earbuds_Black.png",
   "desc": "CustomTune sound calibration, compact fit & all-day comfort."},
  {"id": 17, "name": "Pro Wired Handsfree", "category": "Handsfree", "price": 25,
   "old_price": 35, "rating": 4.3, "img": "/static/img/20_Wired_Handsfree.png",
   "desc": "Braided-cable 3.5mm earphones with HD mic and deep bass."},
  {"id": 18, "name": "Type-C Handsfree HD", "category": "Handsfree", "price": 19,
   "old_price": 29, "rating": 4.5, "img": "/static/img/22_Handsfree_TypeC.png",
   "desc": "Premium metal-body Type-C earphones with noise-isolating mic."},
  {"id": 19, "name": "Classic White Handsfree", "category": "Handsfree", "price": 15,
   "old_price": 22, "rating": 4.2, "img": "/static/img/23_Handsfree_Classic_White.png",
   "desc": "Lightweight everyday earphones — crystal-clear calls & music."},
]

def save_record(filename, record):
    path = os.path.join(DATA_DIR, filename)
    data = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            try: data = json.load(f)
            except Exception: data = []
    data.append(record)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def forward_contact_message(msg):
    sender = os.environ.get("SONICHUB_GMAIL")
    password = os.environ.get("SONICHUB_GMAIL_APP_PASSWORD")
    if not sender or not password:
        return False
    email = EmailMessage()
    email["Subject"] = f"SonicHub message from {msg['name']}"
    email["From"] = sender
    email["To"] = CONTACT_EMAIL
    email.set_content(
        f"Name: {msg['name']}\n"
        f"Email: {msg['email'] or 'Not provided'}\n"
        f"Message:\n{msg['message']}\n"
    )
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as smtp:
        smtp.login(sender, password)
        smtp.send_message(email)

def forward_order(order):
    sender = os.environ.get("SONICHUB_GMAIL")
    password = os.environ.get("SONICHUB_GMAIL_APP_PASSWORD")
    if not sender or not password:
        return False
    items = "\n".join(
        f"- {item.get('name', 'Item')} x{item.get('qty', 1)} = ${item.get('price', 0) * item.get('qty', 1)}"
        for item in order["items"]
    )
    email = EmailMessage()
    email["Subject"] = f"New SonicHub Order: {order['order_id']}"
    email["From"] = sender
    email["To"] = CONTACT_EMAIL
    email.set_content(
        f"New order received\n\n"
        f"Order ID: {order['order_id']}\n"
        f"Customer: {order['name']}\n"
        f"Phone: {order['phone'] or 'Not provided'}\n"
        f"Address: {order['address']}\n"
        f"Payment: {order['payment_method']}\n"
        f"Transaction ID: {order['payment_reference'] or 'Not provided'}\n\n"
        f"Items:\n{items}\n\n"
        f"Total: ${order['total']}\n"
        f"Time: {order['time']}\n"
    )
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as smtp:
        smtp.login(sender, password)
        smtp.send_message(email)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=BASE, **kw)

    def log_message(self, *a):  # quiet console
        pass

    def _json(self, obj, status=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length == 0: return {}
        try: return json.loads(self.rfile.read(length))
        except Exception: return {}

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.path = "/index.html"
        elif self.path == "/api/products":
            return self._json({"products": PRODUCTS})
        elif self.path == "/api/orders":
            path = os.path.join(DATA_DIR, "orders.json")
            if os.path.exists(path):
                with open(path, encoding="utf-8") as f:
                    return self._json({"orders": json.load(f)})
            return self._json({"orders": []})
        super().do_GET()

    def do_POST(self):
        body = self._read_body()
        if self.path == "/api/order":
            name, address = body.get("name", "").strip(), body.get("address", "").strip()
            items = body.get("items", [])
            if not name or not address or not items:
                return self._json({"success": False, "error": "Name, address and items are required."}, 400)
            order = {"order_id": "ORD-" + uuid.uuid4().hex[:8].upper(),
                     "name": name, "address": address, "phone": body.get("phone", ""),
                     "payment_method": body.get("payment_method", "Cash on Delivery"),
                     "payment_reference": body.get("payment_reference", ""),
                     "items": items, "total": body.get("total", 0),
                     "time": time.strftime("%Y-%m-%d %H:%M:%S")}
            save_record("orders.json", order)
            try:
                forwarded = forward_order(order)
            except (OSError, smtplib.SMTPException) as error:
                print(f"Could not forward order: {error}")
                forwarded = False
            return self._json({"success": True, "order": order, "forwarded": forwarded})
        if self.path == "/api/contact":
            msg = {"name": body.get("name", ""), "email": body.get("email", ""),
                   "message": body.get("message", ""),
                   "time": time.strftime("%Y-%m-%d %H:%M:%S")}
            if not msg["name"] or not msg["message"]:
                return self._json({"success": False, "error": "Name and message are required."}, 400)
            save_record("messages.json", msg)
            try:
                forwarded = forward_contact_message(msg)
            except (OSError, smtplib.SMTPException) as error:
                print(f"Could not forward contact message: {error}")
                forwarded = False
            return self._json({"success": True, "forwarded": forwarded})
        if self.path == "/api/newsletter":
            email = body.get("email", "").strip()
            if "@" not in email or "." not in email:
                return self._json({"success": False, "error": "Invalid email"}, 400)
            save_record("newsletter.json", {"email": email, "time": time.strftime("%Y-%m-%d %H:%M:%S")})
            return self._json({"success": True})
        return self._json({"success": False, "error": "Not found"}, 404)

if __name__ == "__main__":
    port = 8000
    print(f"\n  SonicHub Headphone Store")
    print(f"  Server running ->  http://localhost:{port}\n")
    print("  Press Ctrl+C to stop.\n")
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
