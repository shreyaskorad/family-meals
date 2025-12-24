// Offline “big-ish” food database for search/autocomplete.
// Intentionally generic and hand-curated to avoid licensing/copyright issues.
// You can safely extend this over time.

(function () {
  /**
   * DB contract:
   * - items: canonical items, grouped.
   * - aliases: maps alternative spellings -> canonical name.
   * - tokens: prebuilt search tokens per canonical item for fast contains matching.
   */

  const groups = {
    veggies: [
      'onion', 'tomato', 'potato', 'sweet potato', 'garlic', 'ginger', 'green chili', 'lemon',
      'capsicum', 'carrot', 'cucumber', 'lettuce', 'spinach', 'coriander', 'mint', 'spring onions',
      'cauliflower', 'cabbage', 'broccoli', 'mushroom', 'zucchini', 'pumpkin', 'beetroot', 'beans',
      'peas', 'corn', 'bhindi', 'lauki', 'ridge gourd', 'bitter gourd', 'raw banana',
      'coconut', 'coconut (desiccated)'
    ],
    fruits: [
      'banana', 'apple', 'mango', 'papaya', 'chiku', 'pear', 'avocado',
      'watermelon', 'muskmelon', 'orange', 'mosambi', 'pomegranate', 'grapes',
      'pineapple', 'kiwi', 'strawberries', 'blueberries', 'raspberries', 'peach', 'plum'
    ],
    dairy: [
      'eggs', 'milk', 'curd', 'butter', 'ghee', 'cream', 'buttermilk',
      'cheese', 'cheddar', 'mozzarella', 'feta', 'paneer', 'greek yoghurt', 'milk powder'
    ],
    protein: [
      'chicken (curry cut)', 'chicken (boneless)', 'chicken (mince)', 'fish', 'prawns',
      'mutton', 'tofu', 'soya chunks'
    ],
    grains: [
      'rice', 'basmati rice', 'poha', 'sooji', 'oats', 'ragi flour', 'atta', 'maida',
      'pasta', 'noodles', 'vermicelli', 'makhana'
    ],
    pulses: [
      'moong dal', 'toor dal', 'masoor dal', 'urad dal', 'chana dal',
      'rajma', 'chole', 'black chana', 'white chana'
    ],
    spices: [
      'salt', 'pepper', 'turmeric', 'red chilli powder', 'coriander powder', 'cumin', 'garam masala',
      'mustard seeds', 'curry leaves', 'hing'
    ],
    condiments: [
      'olive oil', 'cooking oil', 'mustard oil', 'coconut oil',
      'tomato ketchup', 'soy sauce', 'vinegar', 'mayonnaise', 'hot sauce'
    ],
    bakery: [
      'bread', 'multigrain bread', 'sourdough', 'focaccia', 'baguette', 'brioche',
      'pita', 'tortilla', 'burger buns', 'pizza base'
    ],
    freezer: [
      'frozen peas', 'frozen corn', 'frozen paratha', 'frozen momos', 'frozen fries'
    ],
    baby: [
      'almond powder', 'dates powder'
    ]
  };

  const aliases = {
    // dairy
    'yogurt': 'curd',
    'yoghurt': 'curd',
    'dahi': 'curd',
    'greek yogurt': 'greek yoghurt',

    // herbs
    'cilantro': 'coriander',
    'coriander leaves': 'coriander',
    'dhania': 'coriander',

    // veg
    'bell pepper': 'capsicum',
    'bellpepper': 'capsicum',
    'capsicums': 'capsicum',
    'lady finger': 'bhindi',
    'okra': 'bhindi',
    'bottle gourd': 'lauki',
    'gourd': 'lauki',
    'green chilli': 'green chili',

    // grains
    'semolina': 'sooji',
    'rava': 'sooji'
  };

  const unitHints = {
    milk: 'L',
    curd: 'g',
    rice: 'kg',
    atta: 'kg',
    eggs: 'pcs',
    onion: 'kg',
    tomato: 'kg',
    chicken: 'g'
  };

  // Build a flat searchable list
  const items = [];
  Object.entries(groups).forEach(([group, list]) => {
    (list || []).forEach((name) => {
      const canonical = String(name).trim().toLowerCase();
      if (!canonical) return;
      items.push({ name: canonical, group });
    });
  });

  // de-dupe (in case of overlaps)
  const seen = new Set();
  const uniqueItems = [];
  items.forEach((it) => {
    const key = it.name;
    if (seen.has(key)) return;
    seen.add(key);
    uniqueItems.push(it);
  });

  const tokens = {};
  uniqueItems.forEach((it) => {
    const t = it.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    tokens[it.name] = t;
  });

  window.FOOD_DB = {
    version: '2025-12-20',
    groups,
    items: uniqueItems,
    aliases,
    tokens,
    unitHints
  };
})();
