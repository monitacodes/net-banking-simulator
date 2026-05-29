# NetBanking Simulator

A small front-end demo of an online banking page. Open `bank.html` in a browser.

## What it does

- Shows a fake account with a $10,000 starting balance
- Hide / show balance and account number
- Deposit and Transfer forms with validation
- Transaction history table
- Static panels for Loans, Bills, and Help

## Files

- `bank.html` — page structure
- `bank.css` — styling
- `bank.js` — state and logic
- `logo/mobile-banking.png` — favicon

## Concepts used

- **HTML forms** with labels, inputs, and selects
- **CSS Flexbox** for the navbar, cards, and workspace layout
- **A `.hidden` utility class** to show/hide panels and error messages
- **One state object** (`accountState`) as the single source of truth
- **Event listeners** for clicks and form submits
- **`preventDefault()`** to stop form page reloads
- **DOM updates** via `textContent`, `innerHTML`, and `classList`
- **A small router function** (`globalRouteTransition`) that hides all panels and shows one

## Run

Just open `bank.html` in any browser.
