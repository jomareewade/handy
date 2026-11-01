# handy

A clickable prototype of a three-step eSIM activation flow for a fictional provider, Aurora Mobile.

It shows how the flow looks and feels. Nothing is validated and no data is checked: every path leads to success. For a version with real validation, error handling and synthetic customer data, see the **le-portable** repo.

## The flow

1. **Get ready**: a checklist of four things to confirm before starting (phone supports eSIM, connected to Wi-Fi, QR code ready, keep current SIM in). "Scan QR code" unlocks once all four are ticked, or tap "Mark all as ready".
2. **Scan**: a simulated camera finds a QR code, then a progress sheet runs through reading the code, downloading the eSIM and activating the line. The back arrow cancels and returns to the checklist.
3. **Success**: confirms the eSIM is active and explains what to do next. "Done" starts the flow again.

The camera and scan are simulated: no camera access is requested.

## Files

| File | What it does |
| --- | --- |
| `index.html` | All three screens |
| `style.css` | Layout, colours and animations |
| `script.js` | Ticking the checklist, switching screens and timing the simulated scan |

## Running it locally

Open `index.html` in a browser, or in VS Code right-click it → **Open with Live Server**.

## Changing the look

All colours, corner radii and the font are set at the top of `style.css`. Change `--brand` to re-colour the whole flow.

## Design notes

- Mobile-first: fills the screen on a phone, and shows as a phone-sized card on a computer.
- Buttons are at least 44px tall for easy tapping.
- Animations are turned off for anyone who has "Reduce motion" switched on in their device settings.
