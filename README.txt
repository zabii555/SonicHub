SONIC HUB - Headphone Store (Full-stack website)
=================================================

WHAT'S INCLUDED
---------------
- index.html          -> Frontend (homepage, products, cart, contact)
- static/style.css    -> Dark purple/pink modern design
- static/app.js       -> Shopping cart, filters, checkout logic
- static/img/         -> Real headphone product images
- server.py           -> BACKEND (Python) - products API, order saving, contact form
- data/               -> Orders & messages saved here automatically (JSON)

HOW TO RUN (no installation needed!)
------------------------------------
1. Install Python from https://python.org (if not installed)
2. Open terminal / command prompt in this folder
3. Run:   python server.py
4. Open browser:   http://localhost:8000

That's it! The backend saves all orders in data/orders.json

Admin tip: open http://localhost:8000/api/orders to see all orders as JSON.
