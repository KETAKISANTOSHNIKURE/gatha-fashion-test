# GATHA FASHION — Test Environment

Shop app for memberships, checkout, inventory costing and sales reporting.

## Start

Install Node.js 18 or newer, then run `node server.mjs` from this folder. Open `http://127.0.0.1:51873` on the same computer. Set `PORT` in the shell if that port is already in use. The server deliberately binds to loopback; this setup is for one shop computer, not LAN or public hosting.

On first launch, choose **First time? Set up owner account** on the sign-in screen and create a unique password with at least 8 characters. Set the owner's phone number and save the one-time backup recovery code shown after setup. The shop has one owner login. The owner can add or remove cashier accounts under Inventory & Profit → Staff access. Cashiers can use checkout and membership lookup only. There are no preset credentials.

## Inventory and financial data

For local development, inventory, purchases, sales, expenses, returns, stock movements, and audit entries are stored under `data/inventory.json`; private product photos are stored under `data/uploads`. The data format has a schema version and migration hook. Back up the `data` directory regularly. Hosted Netlify deployments use the configured Supabase project instead of local files. Keep its service key in server-side environment variables only.

Hosted membership state is loaded from the app's authenticated API and cached in browser `localStorage` (`memberly-v1`). For the GitHub Pages frontends, the short-lived API session token is held in `sessionStorage` and sent only to the configured API host. Sessions expire after 12 hours.

Inventory, reports, settings and staff management require the owner session. Cashier sessions are limited to checkout and member lookup. Passwords and recovery codes use salted scrypt hashes; session tokens are random and stored as hashes by the API. Password recovery checks the registered phone number and the one-time backup code. It does not send SMS. Do not expose the local development server to the internet.

## Inventory features

- Product and variant catalog with photos, SKU, size and color
- Purchase batches with transport, packaging, alteration, other charges and non-recoverable tax allocated across batch units
- Weighted landed costs, markup or target-margin pricing, optional manual selling price, MRP and minimum price
- Stock-aware inventory sales, discount and loss warnings, payment method, receipts/invoices in the sales list
- Operating expense tracking, partial customer returns/refunds, and stock adjustments with reasons
- Dashboard, low-stock alerts, reports, stock movement history, audit events and CSV exports

Profit figures use landed unit cost for gross profit. Net profit means gross profit less recorded operating expenses and return adjustments. It does not include costs that have not been recorded, tax, or payment processing fees.

## Existing membership and WhatsApp

Membership and WhatsApp features remain in the browser app. WhatsApp messages are prepared for staff review and manual sending; this app does not automatically send SMS or WhatsApp messages.

## Hosted environments

The `main` branch is production and the `test` branch is the test version in `gatha-fashion-retail`. GitHub Pages serves static frontend files; the current API is supplied by the corresponding Netlify site and uses its existing Supabase environment. Pages cannot run the API itself. Keep Netlify running until a replacement API host is deployed and verified.


This public test repository deploys the test frontend separately from production. Its API uses the GATHA test Netlify site and test Supabase project.
