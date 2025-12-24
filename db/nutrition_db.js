// ============================================
// NUTRITION DATABASE
// Sources: USDA FoodData Central (Public Domain), 
//          Indian Food Composition Tables (IFCT - Govt of India),
//          Open Food Facts (Open Database License)
// ============================================

const NUTRITION_DB = {
    // ========== PROTEINS (High protein foods ≥15g per 100g) ==========
    highProtein: [
        { name: "Chicken breast", protein: 31, category: "poultry", aliases: ["chicken"] },
        { name: "Chicken thigh", protein: 26, category: "poultry", aliases: [] },
        { name: "Eggs", protein: 13, category: "eggs", aliases: ["egg", "anda"] },
        { name: "Paneer", protein: 18, category: "dairy", aliases: ["cottage cheese", "indian cheese"] },
        { name: "Fish (Surmai)", protein: 22, category: "seafood", aliases: ["kingfish", "seer fish"] },
        { name: "Fish (Pomfret)", protein: 20, category: "seafood", aliases: ["paplet"] },
        { name: "Fish (Rawas)", protein: 20, category: "seafood", aliases: ["salmon", "indian salmon"] },
        { name: "Prawns", protein: 24, category: "seafood", aliases: ["shrimp", "jhinga", "kolambi"] },
        { name: "Mutton", protein: 25, category: "meat", aliases: ["lamb", "goat"] },
        { name: "Chicken keema", protein: 27, category: "poultry", aliases: ["minced chicken"] },
        { name: "Mutton keema", protein: 24, category: "meat", aliases: ["minced mutton"] },
        { name: "Soya chunks", protein: 52, category: "plant", aliases: ["meal maker", "nutrela", "soya bean"] },
        { name: "Tofu", protein: 17, category: "plant", aliases: ["bean curd"] },
        { name: "Greek yogurt", protein: 10, category: "dairy", aliases: ["greek curd"] },
        { name: "Cheddar cheese", protein: 25, category: "dairy", aliases: ["cheese"] },
        { name: "Chickpea flour", protein: 22, category: "legumes", aliases: ["besan", "gram flour"] },
    ],

    // ========== DALS & LEGUMES (Medium-High protein) ==========
    dals: [
        { name: "Moong dal", protein: 24, category: "dal", aliases: ["green gram", "mung"] },
        { name: "Toor dal", protein: 22, category: "dal", aliases: ["arhar", "pigeon pea"] },
        { name: "Masoor dal", protein: 25, category: "dal", aliases: ["red lentil"] },
        { name: "Chana dal", protein: 21, category: "dal", aliases: ["bengal gram", "split chickpea"] },
        { name: "Urad dal", protein: 24, category: "dal", aliases: ["black gram"] },
        { name: "Rajma", protein: 23, category: "legumes", aliases: ["kidney beans"] },
        { name: "Chole", protein: 19, category: "legumes", aliases: ["chickpeas", "kabuli chana", "chana"] },
        { name: "Lobia", protein: 24, category: "legumes", aliases: ["black eyed peas", "cowpea"] },
        { name: "Sprouts (moong)", protein: 7, category: "legumes", aliases: ["bean sprouts"] },
    ],

    // ========== DAIRY ==========
    dairy: [
        { name: "Milk (full fat)", protein: 3.2, category: "dairy", aliases: ["doodh"] },
        { name: "Milk (toned)", protein: 3.0, category: "dairy", aliases: [] },
        { name: "Curd", protein: 3.5, category: "dairy", aliases: ["dahi", "yogurt"] },
        { name: "Buttermilk", protein: 2.8, category: "dairy", aliases: ["chaas", "mattha"] },
        { name: "Lassi", protein: 3.0, category: "dairy", aliases: [] },
        { name: "Ghee", protein: 0, category: "dairy", aliases: ["clarified butter"] },
        { name: "Butter", protein: 0.5, category: "dairy", aliases: ["makhan"] },
        { name: "Cream", protein: 2.0, category: "dairy", aliases: ["malai"] },
        { name: "Khoya", protein: 15, category: "dairy", aliases: ["mawa", "khoa"] },
    ],

    // ========== GRAINS & CEREALS ==========
    grains: [
        { name: "Rice (white)", protein: 2.7, category: "grain", aliases: ["chawal"] },
        { name: "Rice (brown)", protein: 2.6, category: "grain", aliases: [] },
        { name: "Wheat flour", protein: 12, category: "grain", aliases: ["atta", "gehu"] },
        { name: "Roti/Chapati", protein: 8, category: "grain", aliases: ["phulka"] },
        { name: "Naan", protein: 9, category: "grain", aliases: [] },
        { name: "Paratha", protein: 7, category: "grain", aliases: [] },
        { name: "Poori", protein: 7, category: "grain", aliases: ["puri"] },
        { name: "Dosa", protein: 4, category: "grain", aliases: [] },
        { name: "Idli", protein: 4, category: "grain", aliases: [] },
        { name: "Oats", protein: 13, category: "grain", aliases: ["oatmeal"] },
        { name: "Poha", protein: 6, category: "grain", aliases: ["flattened rice"] },
        { name: "Upma", protein: 5, category: "grain", aliases: ["sooji", "rava"] },
        { name: "Ragi", protein: 7, category: "grain", aliases: ["finger millet", "nachni"] },
        { name: "Bajra", protein: 11, category: "grain", aliases: ["pearl millet"] },
        { name: "Jowar", protein: 10, category: "grain", aliases: ["sorghum"] },
        { name: "Sabudana", protein: 0.2, category: "grain", aliases: ["sago", "tapioca"] },
        { name: "Bread (white)", protein: 8, category: "grain", aliases: ["pav"] },
        { name: "Bread (multigrain)", protein: 10, category: "grain", aliases: [] },
    ],

    // ========== VEGETABLES ==========
    vegetables: [
        { name: "Spinach", protein: 2.9, category: "leafy", aliases: ["palak"] },
        { name: "Methi leaves", protein: 4.4, category: "leafy", aliases: ["fenugreek"] },
        { name: "Coriander", protein: 3.3, category: "leafy", aliases: ["dhania"] },
        { name: "Potato", protein: 2.0, category: "vegetable", aliases: ["aloo"] },
        { name: "Onion", protein: 1.1, category: "vegetable", aliases: ["pyaaz", "kanda"] },
        { name: "Tomato", protein: 0.9, category: "vegetable", aliases: ["tamatar"] },
        { name: "Cauliflower", protein: 2.0, category: "vegetable", aliases: ["gobi", "phool gobi"] },
        { name: "Cabbage", protein: 1.3, category: "vegetable", aliases: ["patta gobi"] },
        { name: "Bhindi", protein: 2.0, category: "vegetable", aliases: ["okra", "lady finger"] },
        { name: "Baingan", protein: 1.0, category: "vegetable", aliases: ["eggplant", "brinjal"] },
        { name: "Lauki", protein: 0.6, category: "vegetable", aliases: ["bottle gourd", "dudhi", "ghiya"] },
        { name: "Tinda", protein: 1.4, category: "vegetable", aliases: ["apple gourd"] },
        { name: "Karela", protein: 1.6, category: "vegetable", aliases: ["bitter gourd"] },
        { name: "Turai", protein: 1.2, category: "vegetable", aliases: ["ridge gourd"] },
        { name: "Pumpkin", protein: 1.0, category: "vegetable", aliases: ["kaddu", "bhopla"] },
        { name: "Carrot", protein: 0.9, category: "vegetable", aliases: ["gajar"] },
        { name: "Beetroot", protein: 1.6, category: "vegetable", aliases: ["chukandar"] },
        { name: "Green peas", protein: 5.4, category: "vegetable", aliases: ["matar"] },
        { name: "French beans", protein: 1.8, category: "vegetable", aliases: ["green beans"] },
        { name: "Capsicum", protein: 1.0, category: "vegetable", aliases: ["shimla mirch", "bell pepper"] },
        { name: "Mushroom", protein: 3.1, category: "vegetable", aliases: ["khumbi"] },
        { name: "Corn", protein: 3.3, category: "vegetable", aliases: ["makka", "maize", "bhutta"] },
        { name: "Sweet potato", protein: 1.6, category: "vegetable", aliases: ["shakarkandi"] },
        { name: "Zucchini", protein: 1.2, category: "vegetable", aliases: ["courgette"] },
        { name: "Broccoli", protein: 2.8, category: "vegetable", aliases: [] },
        { name: "Cucumber", protein: 0.7, category: "vegetable", aliases: ["kheera", "kakdi"] },
    ],

    // ========== FRUITS ==========
    fruits: [
        { name: "Banana", protein: 1.1, category: "fruit", aliases: ["kela"] },
        { name: "Apple", protein: 0.3, category: "fruit", aliases: ["seb"] },
        { name: "Mango", protein: 0.8, category: "fruit", aliases: ["aam"] },
        { name: "Papaya", protein: 0.5, category: "fruit", aliases: ["papita"] },
        { name: "Orange", protein: 0.9, category: "fruit", aliases: ["santra", "narangi"] },
        { name: "Guava", protein: 2.6, category: "fruit", aliases: ["amrud"] },
        { name: "Pomegranate", protein: 1.7, category: "fruit", aliases: ["anaar"] },
        { name: "Grapes", protein: 0.7, category: "fruit", aliases: ["angoor"] },
        { name: "Watermelon", protein: 0.6, category: "fruit", aliases: ["tarbooz"] },
        { name: "Muskmelon", protein: 0.8, category: "fruit", aliases: ["kharbooja"] },
        { name: "Chiku", protein: 0.7, category: "fruit", aliases: ["sapota", "chickoo"] },
        { name: "Pear", protein: 0.4, category: "fruit", aliases: ["nashpati"] },
        { name: "Strawberry", protein: 0.7, category: "fruit", aliases: [] },
        { name: "Blueberry", protein: 0.7, category: "fruit", aliases: [] },
        { name: "Avocado", protein: 2.0, category: "fruit", aliases: [] },
        { name: "Coconut", protein: 3.3, category: "fruit", aliases: ["nariyal"] },
        { name: "Pineapple", protein: 0.5, category: "fruit", aliases: ["ananas"] },
        { name: "Lychee", protein: 0.8, category: "fruit", aliases: ["litchi"] },
        { name: "Peach", protein: 0.9, category: "fruit", aliases: ["aadu"] },
    ],

    // ========== NUTS & SEEDS ==========
    nutsSeeds: [
        { name: "Almonds", protein: 21, category: "nuts", aliases: ["badam"] },
        { name: "Cashews", protein: 18, category: "nuts", aliases: ["kaju"] },
        { name: "Walnuts", protein: 15, category: "nuts", aliases: ["akhrot"] },
        { name: "Peanuts", protein: 26, category: "nuts", aliases: ["moongfali", "groundnut"] },
        { name: "Pistachios", protein: 20, category: "nuts", aliases: ["pista"] },
        { name: "Makhana", protein: 10, category: "seeds", aliases: ["fox nuts", "lotus seeds"] },
        { name: "Flax seeds", protein: 18, category: "seeds", aliases: ["alsi"] },
        { name: "Chia seeds", protein: 17, category: "seeds", aliases: [] },
        { name: "Pumpkin seeds", protein: 19, category: "seeds", aliases: [] },
        { name: "Sunflower seeds", protein: 21, category: "seeds", aliases: [] },
        { name: "Sesame seeds", protein: 18, category: "seeds", aliases: ["til"] },
    ],

    // ========== INDIAN DISHES (with protein & calorie estimates per serving) ==========
    dishes: {
        breakfast: [
            { name: "Poha", proteinLevel: "Low", protein: 4, cal: 250 },
            { name: "Upma", proteinLevel: "Low", protein: 5, cal: 220 },
            { name: "Idli (2 pcs)", proteinLevel: "Low", protein: 4, cal: 160 },
            { name: "Dosa", proteinLevel: "Low", protein: 5, cal: 180 },
            { name: "Paratha (aloo)", proteinLevel: "Low", protein: 6, cal: 320 },
            { name: "Paratha (paneer)", proteinLevel: "High", protein: 15, cal: 350 },
            { name: "Omelette (2 eggs)", proteinLevel: "High", protein: 14, cal: 180 },
            { name: "Besan chilla", proteinLevel: "High", protein: 12, cal: 200 },
            { name: "Moong dal chilla", proteinLevel: "High", protein: 14, cal: 180 },
            { name: "Sabudana khichdi", proteinLevel: "Low", protein: 3, cal: 350 },
            { name: "Thalipeeth", proteinLevel: "Medium", protein: 8, cal: 250 },
            { name: "Misal pav", proteinLevel: "Medium", protein: 10, cal: 400 },
        ],
        lunch: [
            { name: "Dal tadka + rice", proteinLevel: "Medium", protein: 12, cal: 450 },
            { name: "Rajma chawal", proteinLevel: "Medium", protein: 14, cal: 480 },
            { name: "Chole chawal", proteinLevel: "Medium", protein: 13, cal: 500 },
            { name: "Kadhi chawal", proteinLevel: "Medium", protein: 8, cal: 400 },
            { name: "Chicken curry + roti", proteinLevel: "High", protein: 28, cal: 450 },
            { name: "Fish curry + rice", proteinLevel: "High", protein: 25, cal: 420 },
            { name: "Egg curry + rice", proteinLevel: "High", protein: 16, cal: 400 },
            { name: "Palak paneer + roti", proteinLevel: "High", protein: 18, cal: 400 },
            { name: "Paneer butter masala", proteinLevel: "High", protein: 16, cal: 450 },
            { name: "Aloo gobi + roti", proteinLevel: "Low", protein: 6, cal: 350 },
            { name: "Bhindi masala + roti", proteinLevel: "Low", protein: 5, cal: 300 },
            { name: "Soya chunks curry", proteinLevel: "High", protein: 22, cal: 380 },
            { name: "Mutton curry + roti", proteinLevel: "High", protein: 30, cal: 550 },
            { name: "Prawn curry + rice", proteinLevel: "High", protein: 26, cal: 420 },
            { name: "Biryani (chicken)", proteinLevel: "High", protein: 25, cal: 550 },
            { name: "Biryani (veg)", proteinLevel: "Low", protein: 8, cal: 450 },
            { name: "Khichdi", proteinLevel: "Medium", protein: 10, cal: 300 },
        ],
        dinner: [
            { name: "Butter chicken", proteinLevel: "High", protein: 28, cal: 490 },
            { name: "Tandoori chicken", proteinLevel: "High", protein: 35, cal: 320 },
            { name: "Chicken tikka", proteinLevel: "High", protein: 30, cal: 280 },
            { name: "Fish fry", proteinLevel: "High", protein: 22, cal: 280 },
            { name: "Prawn masala", proteinLevel: "High", protein: 24, cal: 350 },
            { name: "Mutton biryani", proteinLevel: "High", protein: 28, cal: 600 },
            { name: "Paneer tikka", proteinLevel: "High", protein: 18, cal: 320 },
            { name: "Dal makhani", proteinLevel: "Medium", protein: 12, cal: 380 },
            { name: "Naan + any curry", proteinLevel: "Varies", protein: 0, cal: 300 },
        ],
        snacks: [
            { name: "Samosa (2 pcs)", proteinLevel: "Low", protein: 4, cal: 260 },
            { name: "Vada pav", proteinLevel: "Low", protein: 5, cal: 290 },
            { name: "Pani puri (6 pcs)", proteinLevel: "Low", protein: 3, cal: 180 },
            { name: "Bhel puri", proteinLevel: "Low", protein: 4, cal: 200 },
            { name: "Chicken momos (6 pcs)", proteinLevel: "High", protein: 15, cal: 280 },
            { name: "Paneer tikka (6 pcs)", proteinLevel: "High", protein: 16, cal: 320 },
            { name: "Egg sandwich", proteinLevel: "High", protein: 12, cal: 250 },
            { name: "Cheese sandwich", proteinLevel: "Medium", protein: 8, cal: 280 },
            { name: "Sprout chaat", proteinLevel: "Medium", protein: 8, cal: 180 },
            { name: "Peanut chikki", proteinLevel: "Medium", protein: 10, cal: 350 },
        ]
    }
};

// Helper: Get protein level for any food item
function getProteinLevel(proteinG) {
    if (proteinG >= 15) return "High";
    if (proteinG >= 5) return "Medium";
    return "Low";
}

// Helper: Search food by name
function searchFood(query) {
    query = query.toLowerCase();
    const results = [];
    
    const allCategories = [
        ...NUTRITION_DB.highProtein,
        ...NUTRITION_DB.dals,
        ...NUTRITION_DB.dairy,
        ...NUTRITION_DB.grains,
        ...NUTRITION_DB.vegetables,
        ...NUTRITION_DB.fruits,
        ...NUTRITION_DB.nutsSeeds
    ];
    
    for (const item of allCategories) {
        const nameMatch = item.name.toLowerCase().includes(query);
        const aliasMatch = item.aliases?.some(a => a.toLowerCase().includes(query));
        if (nameMatch || aliasMatch) {
            results.push({
                ...item,
                proteinLevel: getProteinLevel(item.protein)
            });
        }
    }
    
    return results;
}

// Export
window.NUTRITION_DB = NUTRITION_DB;
window.searchFood = searchFood;
window.getProteinLevel = getProteinLevel;
