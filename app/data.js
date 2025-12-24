// ============================================
// FAMILY MEAL DATA
// ============================================

const MEALS = {
    breakfast: [
        { id: 1, name: "Sunny Side Up + Toast", source: "You", protein: "High", notes: "Quick" },
        { id: 2, name: "Omelette + Toast", source: "You", protein: "High", notes: "Quick" },
        { id: 3, name: "Masala Dosa", source: "Order", protein: "Low", notes: "South Indian" },
        { id: 4, name: "Sabudana Khichdi", source: "Maid", protein: "Low", notes: "Maharashtrian" },
        { id: 5, name: "Thalipeeth + Curd", source: "Maid", protein: "Medium", notes: "Maharashtrian" },
        { id: 6, name: "McDonald's Breakfast", source: "Order", protein: "High", notes: "McMuffin etc" },
        { id: 7, name: "Overnight Oats", source: "You", protein: "Medium", notes: "Prep night before" },
        { id: 8, name: "Full English Breakfast", source: "Order", protein: "High", notes: "Indulgent" },
        { id: 9, name: "Bhurji on Sourdough", source: "You", protein: "High", notes: "Suchali's bread" },
        { id: 10, name: "Focaccia Egg Sandwich", source: "You", protein: "High", notes: "Suchali's bread" },
        { id: 11, name: "Baguette Bruschetta", source: "You", protein: "Low", notes: "Suchali's bread" },
        { id: 12, name: "Eggs Kejriwal", source: "You", protein: "High", notes: "Bombay classic" },
        { id: 13, name: "Brioche Breakfast Burger", source: "You", protein: "High", notes: "Suchali's bread" },
        { id: 14, name: "Healthy Sandwich", source: "You", protein: "Medium", notes: "Multigrain bread" }
    ],
    lunch: [
        { id: 1, name: "Chicken Curry + Roti", source: "Maid", protein: "High", notes: "Homestyle" },
        { id: 2, name: "Dal Tadka + Rice", source: "Maid", protein: "Medium", notes: "Comfort" },
        { id: 3, name: "Rajma Chawal", source: "Maid", protein: "Medium", notes: "1x per 2 weeks" },
        { id: 4, name: "Chole Chawal", source: "Maid", protein: "Medium", notes: "1x per 2 weeks" },
        { id: 5, name: "Palak Paneer + Roti", source: "Maid", protein: "Medium", notes: "" },
        { id: 6, name: "Paneer Butter Masala + Roti", source: "Maid", protein: "Medium", notes: "" },
        { id: 7, name: "Bhindi Masala + Roti", source: "Maid", protein: "Low", notes: "" },
        { id: 8, name: "Aloo Tadasani + Roti", source: "Maid", protein: "Low", notes: "" },
        { id: 9, name: "Surmai Fry + Rice", source: "Maid", protein: "High", notes: "Fish day" },
        { id: 10, name: "Hakka Noodles", source: "Maid", protein: "Low", notes: "Indo-Chinese" },
        { id: 11, name: "Mac & Cheese", source: "Maid", protein: "Medium", notes: "Continental" },
        { id: 12, name: "Khow Suey", source: "Maid", protein: "Medium", notes: "Burmese" },
        { id: 13, name: "Appam + Stew", source: "Order", protein: "Medium", notes: "Kerala" },
        { id: 14, name: "Pasta Salad", source: "You", protein: "Medium", notes: "Cold, refreshing" }
    ],
    snacks: [
        { id: 1, name: "Papdi Chaat", source: "Order", protein: "Low", notes: "Favorite" },
        { id: 2, name: "Sandwich (Grilled/Bombay)", source: "You", protein: "Medium", notes: "Quick" },
        { id: 3, name: "Cheese Sandwich", source: "You", protein: "Medium", notes: "Simple" },
        { id: 4, name: "Garlic Bread + Soup", source: "Order", protein: "Low", notes: "Cozy" },
        { id: 5, name: "Hummus + Pita", source: "Order", protein: "Medium", notes: "Mediterranean" },
        { id: 6, name: "Chicken Momos", source: "Order", protein: "High", notes: "Steamed/Fried" },
        { id: 7, name: "Samosa + Chai", source: "Order", protein: "Low", notes: "Classic" },
        { id: 8, name: "Bhel Puri", source: "Order", protein: "Low", notes: "Light chaat" },
        { id: 9, name: "Vada Pav", source: "Order", protein: "Low", notes: "Mumbai" },
        { id: 10, name: "Spring Rolls", source: "Order", protein: "Low", notes: "Indo-Chinese" },
        { id: 11, name: "Fruit + Cheese Plate", source: "You", protein: "Low", notes: "Healthy" },
        { id: 12, name: "Bruschetta", source: "You", protein: "Low", notes: "Suchali's bread" },
        { id: 13, name: "Chicken Tikka", source: "Order", protein: "High", notes: "Protein snack" },
        { id: 14, name: "Pani Puri", source: "Order", protein: "Low", notes: "Fun" }
    ],
    dinner: [
        { id: 1, name: "Butter Chicken + Naan", source: "Order", protein: "High", notes: "Favorite" },
        { id: 2, name: "Chicken Shawarma", source: "Order", protein: "High", notes: "Middle Eastern" },
        { id: 3, name: "Pepper Chicken", source: "Order", protein: "High", notes: "South Indian" },
        { id: 4, name: "Chicken Chettinad", source: "Order", protein: "High", notes: "Spicy" },
        { id: 5, name: "Chicken Steak", source: "Order", protein: "High", notes: "Continental" },
        { id: 6, name: "Chicken Burger", source: "Order", protein: "High", notes: "American" },
        { id: 7, name: "Thai Curry + Rice", source: "Order", protein: "Medium", notes: "Thai" },
        { id: 8, name: "Chopsuey", source: "Order", protein: "Low", notes: "Indo-Chinese" },
        { id: 9, name: "Banh Mi", source: "Order", protein: "High", notes: "Vietnamese" },
        { id: 10, name: "Roast Chicken + Mash", source: "Order", protein: "High", notes: "Continental" },
        { id: 11, name: "Hyderabadi Biryani", source: "Order", protein: "High", notes: "Indulgent" },
        { id: 12, name: "Peri Peri Chicken + Rice", source: "Order", protein: "High", notes: "Portuguese" },
        { id: 13, name: "Fish & Chips", source: "Order", protein: "High", notes: "British" },
        { id: 14, name: "Kolhapuri Chicken", source: "Order", protein: "High", notes: "Maharashtrian spicy" }
    ],
    babyBreakfast: [
        { id: 1, name: "Ragi + Banana Puree", source: "You", protein: "Medium", notes: "Classic, iron-rich" },
        { id: 2, name: "Oats + Apple Puree", source: "You", protein: "Medium", notes: "Fiber-rich" },
        { id: 3, name: "Sooji + Mango Puree", source: "You", protein: "Low", notes: "Sweet, seasonal" },
        { id: 4, name: "Makhana + Banana", source: "You", protein: "Medium", notes: "Light, nutritious" },
        { id: 5, name: "Ragi + Chiku Puree", source: "You", protein: "Medium", notes: "Natural sweetness" },
        { id: 6, name: "Oats + Pear Puree", source: "You", protein: "Medium", notes: "Gentle on tummy" },
        { id: 7, name: "Sooji + Papaya Puree", source: "You", protein: "Low", notes: "Digestive-friendly" },
        { id: 8, name: "Ragi + Blueberry Puree", source: "You", protein: "Medium", notes: "Antioxidant-rich" },
        { id: 9, name: "Oats + Strawberry Puree", source: "You", protein: "Medium", notes: "Berry goodness" },
        { id: 10, name: "Makhana + Apple", source: "You", protein: "Medium", notes: "Light + crunchy base" },
        { id: 11, name: "Sooji + Avocado", source: "You", protein: "Medium", notes: "Healthy fats" },
        { id: 12, name: "Ragi + Raspberry Puree", source: "You", protein: "Medium", notes: "Unique" },
        { id: 13, name: "Oats + Peach Puree", source: "You", protein: "Medium", notes: "Sweet, summery" },
        { id: 14, name: "Ragi + Mixed Berry Puree", source: "You", protein: "Medium", notes: "Berry medley" }
    ],
    babyLunch: [
        { id: 1, name: "Khichdi + Carrot", source: "Maid", protein: "Medium", notes: "Classic combo" },
        { id: 2, name: "Khichdi + Lauki", source: "Maid", protein: "Medium", notes: "Light, hydrating" },
        { id: 3, name: "Khichdi + Pumpkin", source: "Maid", protein: "Medium", notes: "Sweet, creamy" },
        { id: 4, name: "Khichdi + Spinach", source: "Maid", protein: "Medium", notes: "Iron boost" },
        { id: 5, name: "Khichdi + Peas", source: "Maid", protein: "Medium", notes: "Protein + fiber" },
        { id: 6, name: "Khichdi + Potato", source: "Maid", protein: "Medium", notes: "Filling" },
        { id: 7, name: "Khichdi + Beetroot", source: "Maid", protein: "Medium", notes: "Colorful, nutritious" },
        { id: 8, name: "Khichdi + Zucchini", source: "Maid", protein: "Medium", notes: "Mild flavor" },
        { id: 9, name: "Khichdi + Beans", source: "Maid", protein: "Medium", notes: "Green goodness" },
        { id: 10, name: "Sweet Potato Mash", source: "You", protein: "Low", notes: "Individual meal" },
        { id: 11, name: "Mashed Peas", source: "You", protein: "Medium", notes: "Individual meal" },
        { id: 12, name: "Masoor Khichdi + Carrot", source: "Maid", protein: "Medium", notes: "Different dal" },
        { id: 13, name: "Khichdi + Mixed Veggies", source: "Maid", protein: "Medium", notes: "Variety" },
        { id: 14, name: "Rice + Dal + Ghee", source: "Maid", protein: "Medium", notes: "Simple comfort" }
    ],
    babySnacks: [
        { id: 1, name: "Banana slices", source: "You", protein: "Low", notes: "Soft, easy finger food" },
        { id: 2, name: "Steamed apple pieces", source: "You", protein: "Low", notes: "Soft finger food" },
        { id: 3, name: "Mango cubes", source: "You", protein: "Low", notes: "Seasonal, sweet" },
        { id: 4, name: "Chiku mashed", source: "You", protein: "Low", notes: "Creamy, sweet" },
        { id: 5, name: "Papaya cubes", source: "You", protein: "Low", notes: "Soft, digestive" },
        { id: 6, name: "Muskmelon pieces", source: "You", protein: "Low", notes: "Hydrating" },
        { id: 7, name: "Watermelon (seedless)", source: "You", protein: "Low", notes: "Hydrating" },
        { id: 8, name: "Strawberry halves", source: "You", protein: "Low", notes: "Loves berries" },
        { id: 9, name: "Blueberries (halved)", source: "You", protein: "Low", notes: "Antioxidants" },
        { id: 10, name: "Raspberries (mashed)", source: "You", protein: "Low", notes: "Unique" },
        { id: 11, name: "Avocado slices", source: "You", protein: "Medium", notes: "Healthy fats" },
        { id: 12, name: "Sweet potato sticks", source: "You", protein: "Low", notes: "Finger food" },
        { id: 13, name: "Steamed carrot sticks", source: "You", protein: "Low", notes: "Finger food" },
        { id: 14, name: "Pear slices", source: "You", protein: "Low", notes: "Soft, sweet" }
    ],
    babyDinner: [
        { id: 1, name: "Ragi + Carrot Puree", source: "You", protein: "Medium", notes: "Veggie dinner" },
        { id: 2, name: "Oats + Pumpkin Puree", source: "You", protein: "Medium", notes: "Creamy, filling" },
        { id: 3, name: "Sooji + Lauki Puree", source: "You", protein: "Low", notes: "Light on tummy" },
        { id: 4, name: "Makhana + Banana", source: "You", protein: "Medium", notes: "Easy to digest" },
        { id: 5, name: "Khichdi + Carrot", source: "Maid", protein: "Medium", notes: "Protein-rich" },
        { id: 6, name: "Ragi + Sweet Potato Puree", source: "You", protein: "Medium", notes: "Filling" },
        { id: 7, name: "Oats + Spinach Puree", source: "You", protein: "Medium", notes: "Iron for night" },
        { id: 8, name: "Sooji + Beetroot Puree", source: "You", protein: "Low", notes: "Colorful" },
        { id: 9, name: "Ragi + Apple Puree", source: "You", protein: "Medium", notes: "Light, fruity" },
        { id: 10, name: "Rice + Dal", source: "Maid", protein: "Medium", notes: "Simple" },
        { id: 11, name: "Mashed Sweet Potato", source: "You", protein: "Low", notes: "Individual" },
        { id: 12, name: "Oats + Zucchini Puree", source: "You", protein: "Medium", notes: "Mild, easy" },
        { id: 13, name: "Ragi + Pear Puree", source: "You", protein: "Medium", notes: "Gentle" },
        { id: 14, name: "Sooji + Mixed Veggie Puree", source: "You", protein: "Low", notes: "Variety" }
    ]
};

// Grocery master list
const groceryMaster = {
    // Fresh
    veggies: [
        "Onion", "Tomato", "Potato", "Sweet Potato", "Garlic", "Ginger", "Green chilli", "Lemon",
        "Capsicum", "Carrot", "Cucumber", "Lettuce", "Spinach", "Coriander", "Mint", "Spring onions",
        "Cauliflower", "Cabbage", "Broccoli", "Mushrooms", "Zucchini", "Pumpkin", "Beetroot", "Beans",
        "Peas", "Corn", "Brinjal", "Okra", "Bottle gourd", "Ridge gourd", "Bitter gourd", "Raw banana",
        "Sweet corn", "Tomato puree", "Coconut", "Coconut (desiccated)"
    ],
    fruits: [
        "Banana", "Apple", "Mango", "Papaya", "Chiku", "Pear", "Avocado", "Watermelon", "Muskmelon",
        "Orange", "Mosambi", "Pomegranate", "Grapes", "Pineapple", "Kiwi", "Strawberries", "Blueberries",
        "Raspberries", "Peach", "Plum"
    ],

    // Dairy / eggs
    dairy: [
        "Eggs", "Milk", "Curd", "Butter", "Ghee", "Cream", "Buttermilk",
        "Cheese", "Cheddar", "Mozzarella", "Feta", "Paneer", "Greek yoghurt", "Milk powder"
    ],

    // Protein
    protein: [
        "Chicken (curry cut)", "Chicken (boneless)", "Chicken (mince)", "Eggs",
        "Fish", "Prawns", "Mutton", "Tofu", "Soya chunks"
    ],

    // Bakery
    bread: [
        "Bread", "Multigrain bread", "Sourdough", "Focaccia", "Baguette", "Brioche",
        "Pita", "Tortilla", "Burger buns", "Pizza base"
    ],

    // Pantry
    pantry: [
        "Rice", "Basmati rice", "Poha", "Rava", "Sooji", "Oats", "Ragi flour", "Atta", "Maida",
        "Pasta", "Noodles", "Vermicelli", "Makhana",
        "Moong dal", "Toor dal", "Masoor dal", "Urad dal", "Chana dal",
        "Rajma", "Chole", "Black chana", "White chana",
        "Olive oil", "Cooking oil", "Mustard oil", "Coconut oil",
        "Peanut butter", "Honey", "Jaggery", "Sugar",
        "Salt", "Pepper", "Turmeric", "Red chilli powder", "Coriander powder", "Cumin", "Garam masala",
        "Mustard seeds", "Curry leaves", "Hing",
        "Baking powder", "Baking soda", "Yeast",
        "Tomato ketchup", "Soy sauce", "Vinegar", "Mayonnaise", "Hot sauce"
    ],

    // Freezer / ready
    freezer: [
        "Frozen peas", "Frozen corn", "Frozen paratha", "Frozen momos", "Frozen fries"
    ],

    // Baby extras
    baby: [
        "Almond powder", "Dates powder", "Ghee", "Ragi flour", "Oats", "Sooji", "Makhana"
    ]
};

// Expanded synonym database used for dedupe / canonicalization.
// Keep keys lower-case.
const GROCERY_SYNONYMS_DB = {
    // dairy
    "yogurt": "curd",
    "yoghurt": "curd",
    "dahi": "curd",
    "greek yogurt": "greek yoghurt",
    // herbs
    "cilantro": "coriander",
    "coriander leaves": "coriander",
    "dhania": "coriander",
    // veg
    "bell pepper": "capsicum",
    "bellpepper": "capsicum",
    "capsicums": "capsicum",
    "okra": "bhindi",
    "lady finger": "bhindi",
    "bottle gourd": "lauki",
    "gourd": "lauki",
    "green chilli": "green chili",
    // onion family
    "spring onion": "spring onions",
    "scallions": "spring onions",
    // grains
    "semolina": "sooji",
    "rava": "sooji",
    // oils
    "extra virgin olive oil": "olive oil"
};

// Units hints (not hard rules). Useful later for quantity/units parsing.
const GROCERY_UNIT_HINTS = {
    "milk": "L",
    "curd": "g",
    "rice": "kg",
    "atta": "kg",
    "eggs": "pcs",
    "onion": "kg",
    "tomato": "kg",
    "chicken": "g"
};

// Optional recipes database (lightweight + expandable).
// NOTE: Kept generic to avoid importing copyrighted corpora.
const RECIPE_DB = {
    "omelette": {
        title: "Omelette",
        tags: ["breakfast", "high-protein"],
        ingredients: ["eggs", "onion", "tomato", "salt", "pepper", "butter"],
        steps: ["Beat eggs", "Saute onion/tomato", "Cook omelette"],
        timeMins: 10
    },
    "dal-tadka": {
        title: "Dal Tadka",
        tags: ["lunch", "dinner"],
        ingredients: ["toor dal", "onion", "tomato", "turmeric", "cumin", "ghee"],
        steps: ["Boil dal", "Make tadka", "Combine"],
        timeMins: 35
    },
    "baby-khichdi": {
        title: "Baby khichdi (basic)",
        tags: ["baby", "lunch", "dinner"],
        ingredients: ["rice", "moong dal", "ghee", "carrot"],
        steps: ["Cook rice+dal soft", "Mash", "Add ghee"],
        timeMins: 25
    }
};

// Make available to app.js (vanilla static site)
window.MEALS = MEALS;
window.groceryMaster = groceryMaster;
window.GROCERY_SYNONYMS_DB = GROCERY_SYNONYMS_DB;
window.GROCERY_UNIT_HINTS = GROCERY_UNIT_HINTS;
window.RECIPE_DB = RECIPE_DB;
