# Glow by Wanji

The website for **Glow by Wanji**, offering lash extensions and makeup.

- **Lash designs & prices.** Seven lash sets, each drawn so clients can see the shape. Clients can preview every set as Natural, Cat Eye, Doll Eye or Squirrel. There's also a price list for quick lashes & care, plus aftercare tips.
- **Makeup.** Four simple looks (Soft Glam, Full Glam, Bridal Glam, Shoot & Events) plus bridal extras.
- **Booking.** Clients pick a service, date and time. The booking opens in WhatsApp, already filled in, addressed to **0793 490 805**.
- **Contact.** Call and WhatsApp buttons, location, hours, Instagram and TikTok.

It's a plain HTML/CSS/JavaScript site with nothing to install or build. GitHub Pages hosts it for free.

---

## Changing prices, services or contact details

Everything you'd want to change lives in **one file: [`js/config.js`](js/config.js)**.

1. Open `js/config.js` on GitHub and click the ✏️ pencil icon.
2. Change what you need, for example `fullSet: 1800` to `fullSet: 2000`.
3. Click **Commit changes**. The live site updates within a minute or two.

| To change… | Look for… |
| --- | --- |
| Phone / WhatsApp number | `phoneDisplay` and `phoneInternational` |
| Instagram / TikTok | `instagram`, `tiktok` (no `@`) |
| Location & opening hours | `location`, `hours` |
| Lash set prices, names, descriptions | `lashSets` (`fullSet`, `refill`, `duration`) |
| Cluster, strip, lift & tint, removal… | `lashExtras` |
| Makeup looks & prices | `makeup` |
| Bridal party, trial, home service… | `makeupExtras` |
| Booking time slots | `timeSlots` |

Keep the quotes `" "` and commas `,` as they are. That's the only rule.

---

## Putting the site online (GitHub Pages), one-time setup

1. On GitHub, go to the repository, then **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Pick the branch the site is on and the **/ (root)** folder, then click **Save**.
4. After a minute the site is live at **https://pizzatechies.github.io/lash/**.

**Want the address to say Glow_by_Wanji?** Rename the repository to `Glow_by_Wanji` under **Settings → General**. The site then moves to `https://pizzatechies.github.io/Glow_by_Wanji/`. Also update the `og:image` link near the top of `index.html` so link previews on WhatsApp keep their picture.

---

## Files

```
index.html          the page
css/styles.css      colours, fonts, layout
js/config.js        ← prices, services, phone number (edit this one)
js/lash-art.js      draws the lash illustrations
js/main.js          booking form, menus, page behaviour
assets/             favicon, home-screen icon, link-preview image
```
