/* ==================================================================
   GLOW BY WANJI — SITE SETTINGS
   ------------------------------------------------------------------
   This is the only file you need to edit to change your phone number,
   socials, prices or services. Prices are in Kenyan Shillings.
   Keep the quotes "" and commas , exactly as they are.
   ================================================================== */

window.GLOW_CONFIG = {
  businessName: "Glow by Wanji",

  /* ---------- CONTACT ---------- */
  // What customers see on the site:
  phoneDisplay: "0793 490 805",
  // Used for the Call and WhatsApp buttons (bookings are sent here):
  // country code + number, no "+", no spaces, no leading 0.
  // e.g. 0793 490 805 -> "254793490805"
  phoneInternational: "254793490805",

  instagram: "glowbywanji", // without the @
  tiktok: "glowbywanji",    // without the @

  location: "Nairobi, Kenya",
  hours: [
    { days: "Monday – Saturday", time: "8:00 AM – 7:00 PM" },
    { days: "Sunday", time: "By appointment" }
  ],

  currency: "KSh",

  /* ---------- LASH DESIGNS ----------
     art: which illustration to draw. Options:
     classic, hybrid, volume, mega, wispy, wet, anime            */
  lashSets: [
    {
      id: "classic",
      name: "Classic Set",
      art: "classic",
      tag: "First-timer favourite",
      description: "One extension on each natural lash. Clean, defined and mascara-like.",
      fullSet: 1800,
      refill: 1000,
      duration: "1.5 hrs"
    },
    {
      id: "hybrid",
      name: "Hybrid Set",
      art: "hybrid",
      tag: "Soft & textured",
      description: "Classic lashes blended with soft volume fans. Natural, with a little extra.",
      fullSet: 2500,
      refill: 1300,
      duration: "2 hrs"
    },
    {
      id: "volume",
      name: "Volume Set",
      art: "volume",
      tag: "Full & fluffy",
      description: "Handmade lightweight fans (3D–6D) for a full, fluffy, glamorous finish.",
      fullSet: 3000,
      refill: 1500,
      duration: "2.5 hrs"
    },
    {
      id: "mega-volume",
      name: "Mega Volume",
      art: "mega",
      tag: "Maximum drama",
      description: "Dense, dark and dramatic. Ultra-fine fans packed in for a bold statement.",
      fullSet: 4000,
      refill: 2000,
      duration: "3 hrs"
    },
    {
      id: "wispy",
      name: "Wispy Set",
      art: "wispy",
      tag: "Trending",
      description: "A fluffy base with longer spikes woven through for that textured, wispy look.",
      fullSet: 3200,
      refill: 1600,
      duration: "2.5 hrs"
    },
    {
      id: "wet-look",
      name: "Wet Look",
      art: "wet",
      tag: "Glossy & spiky",
      description: "Sleek, defined spikes that look fresh out of the pool. Bold and on-trend.",
      fullSet: 3000,
      refill: 1500,
      duration: "2 hrs"
    },
    {
      id: "anime",
      name: "Anime Lashes",
      art: "anime",
      tag: "Statement",
      description: "Defined spikes on top and bottom for a doll-like, editorial look.",
      fullSet: 3500,
      refill: 1800,
      duration: "2.5 hrs"
    }
  ],

  /* ---------- QUICK LASHES & CARE ---------- */
  lashExtras: [
    { id: "cluster",   name: "Cluster Lashes",         note: "Quick glam that lasts 1–2 weeks",               price: 1200 },
    { id: "strip",     name: "Strip Lashes (applied)", note: "For a day out or a night out",                  price: 500 },
    { id: "lift-tint", name: "Lash Lift & Tint",       note: "Your own lashes, lifted and darkened for 6–8 weeks", price: 2000 },
    { id: "bottom",    name: "Bottom Lashes",          note: "Add-on to any full set",                        price: 500 },
    { id: "removal",   name: "Lash Removal",           note: "Gentle, safe removal of extensions",            price: 500 }
  ],

  /* ---------- MAKEUP ----------
     icon options: sparkle, lipstick, diamond, camera
     priceFrom: true shows "From KSh ..."                      */
  makeup: [
    {
      id: "soft-glam",
      name: "Soft Glam",
      icon: "sparkle",
      tagline: "You, but glowier.",
      description: "Fresh skin, soft eyes, everyday pretty.",
      price: 2500
    },
    {
      id: "full-glam",
      name: "Full Glam",
      icon: "lipstick",
      tagline: "Turn heads. All night.",
      description: "Sculpted, flawless and camera-ready. Lashes included.",
      price: 3500
    },
    {
      id: "bridal",
      name: "Bridal Glam",
      icon: "diamond",
      tagline: "Your day. Your glow.",
      description: "Long-wear bridal makeup that lasts from the vows to the last dance.",
      price: 8000,
      priceFrom: true,
      onePerson: true // bridesmaids are booked separately below
    },
    {
      id: "shoot-events",
      name: "Shoot & Events",
      icon: "camera",
      tagline: "Lights, camera, slay.",
      description: "Photoshoots, birthdays, graduations, dinners. Any moment worth a photo.",
      price: 3000
    }
  ],

  // bookable: false = shown on the price list but not in the booking menu
  // onePerson: true = no "number of people" box when booking it
  makeupExtras: [
    { id: "bridal-party", name: "Bridesmaids & Bridal Party", note: "Per person",                       price: 2500, bookable: true },
    { id: "bridal-trial", name: "Bridal Trial",               note: "Test your look before the big day", price: 3000, bookable: true, onePerson: true },
    { id: "home-service", name: "Home Service",               note: "Transport charged by location",     price: 1000, priceFrom: true, bookable: false },
    { id: "lash-addon",   name: "Add Strip Lashes",           note: "To any makeup look",                price: 300, bookable: false }
  ],

  /* ---------- BOOKING TIMES ---------- */
  timeSlots: [
    "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ]
};
