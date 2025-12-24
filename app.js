// ============================================
// MEAL PLANNER APP - Simple 2-Step Flow
// Step 1: Pick meals → Step 2: Get grocery list
// ============================================

// =============================
// Multi-day planning state
// =============================
const MEAL_CATEGORIES = [
    'breakfast', 'lunch', 'snacks', 'dinner',
    'babyBreakfast', 'babyLunch', 'babySnacks', 'babyDinner'
];

function createEmptyDayPlan() {
    return {
        breakfast: null,
        lunch: null,
        snacks: null,
        dinner: null,
        babyBreakfast: null,
        babyLunch: null,
        babySnacks: null,
        babyDinner: null,
        locks: {
            breakfast: false,
            lunch: false,
            snacks: false,
            dinner: false,
            babyBreakfast: false,
            babyLunch: false,
            babySnacks: false,
            babyDinner: false,
        }
    };
}

function ensureLocks(dayPlan) {
    if (!dayPlan.locks) dayPlan.locks = {};
    MEAL_CATEGORIES.forEach(cat => {
        if (typeof dayPlan.locks[cat] !== 'boolean') dayPlan.locks[cat] = false;
    });
}

function isLocked(category, dayIndex = activeDayIndex) {
    const day = plans?.[dayIndex];
    return !!day?.locks?.[category];
}

function setLockButtonState(category) {
    const btn = document.getElementById(`lock-${category}`);
    if (!btn) return;
    const locked = isLocked(category);
    btn.classList.toggle('is-locked', locked);
    btn.setAttribute('aria-pressed', locked ? 'true' : 'false');
}

function renderLocksForActiveDay() {
    const day = plans[activeDayIndex];
    if (!day) return;
    ensureLocks(day);
    MEAL_CATEGORIES.forEach(setLockButtonState);
}

function toggleLock(category) {
    const day = plans[activeDayIndex];
    if (!day) return;
    ensureLocks(day);
    day.locks[category] = !day.locks[category];
    setLockButtonState(category);
    savePlan();
}

let planDays = 1; // 1, 3, 5
let activeDayIndex = 0; // 0..planDays-1

// plans[dayIndex] = dayPlan
let plans = [createEmptyDayPlan()];

// Preferences
let prefs = JSON.parse(localStorage.getItem('mealPlannerPrefs')) || {
    avoidRepeatsWithinPlan: true,
    includeBabyInGrocery: true
};

// Track last eaten to avoid repeats
let history = JSON.parse(localStorage.getItem('mealHistory')) || {};

// Custom meals added by user
let customMeals = JSON.parse(localStorage.getItem('customMeals')) || {
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
};

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('App loaded!');
    console.log('MEALS data:', typeof MEALS, Object.keys(MEALS || {}));
    setTodayDate();
    loadSavedPlan();
    updateDayUI();
    renderActiveDay();
    renderAllMealsList();

    // Load offline food DB into a datalist for lightweight autocomplete.
    // Note: datalist can get sluggish if too large, so we cap this list.
    try {
        hydrateFoodDatalist();
    } catch (_) {
        // ignore
    }

    // Preferences UI
    const avoidCb = document.getElementById('pref-avoid-within-plan');
    const babyCb = document.getElementById('pref-include-baby');
    if (avoidCb) {
        avoidCb.checked = !!prefs.avoidRepeatsWithinPlan;
        avoidCb.addEventListener('change', () => {
            prefs.avoidRepeatsWithinPlan = avoidCb.checked;
            savePrefs();
        });
    }
    if (babyCb) {
        babyCb.checked = !!prefs.includeBabyInGrocery;
        babyCb.addEventListener('change', () => {
            prefs.includeBabyInGrocery = babyCb.checked;
            savePrefs();
        });
    }
    
    // Enter key on add meal name input
    document.getElementById('add-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextToSource();
        }
    });

    // Grocery UI toggle
    const hideBoughtCb = document.getElementById('toggle-hide-bought');
    if (hideBoughtCb) {
        hideBoughtCb.checked = !!groceryUiPrefs.hideBought;
        hideBoughtCb.addEventListener('change', () => {
            groceryUiPrefs.hideBought = hideBoughtCb.checked;
            saveGroceryUiPrefs();
            if (groceryView === 'shop') {
                renderShoppingList(buildShoppingItemsForPlan());
            }
        });
    }

    // Shopping controls
    const shopSearch = document.getElementById('shop-search');
    if (shopSearch) {
        shopSearch.value = groceryUiPrefs.search || '';
        
        // Use both input and keyup for better responsiveness
        const handleSearch = () => {
            groceryUiPrefs.search = shopSearch.value || '';
            saveGroceryUiPrefs();
            renderShoppingList(buildShoppingItemsForPlan());
        };
        
        shopSearch.addEventListener('input', handleSearch);
        shopSearch.addEventListener('keyup', handleSearch);
    }

    const clearSearchBtn = document.getElementById('btn-clear-search');
    if (clearSearchBtn && shopSearch) {
        clearSearchBtn.addEventListener('click', () => {
            shopSearch.value = '';
            groceryUiPrefs.search = '';
            saveGroceryUiPrefs();
            renderShoppingList(buildShoppingItemsForPlan());
            shopSearch.focus();
        });
    }

    const btnExpandAll = document.getElementById('btn-expand-all');
    if (btnExpandAll) {
        btnExpandAll.addEventListener('click', () => {
            collapseAllGroups(false);
            if (groceryView === 'shop') renderShoppingList(buildShoppingItemsForPlan());
        });
    }

    const btnCollapseAll = document.getElementById('btn-collapse-all');
    if (btnCollapseAll) {
        btnCollapseAll.addEventListener('click', () => {
            collapseAllGroups(true);
            if (groceryView === 'shop') renderShoppingList(buildShoppingItemsForPlan());
        });
    }

    const btnEditPantry = document.getElementById('btn-edit-pantry');
    if (btnEditPantry) {
        btnEditPantry.addEventListener('click', openPantryModal);
    }

    // Pantry modal wiring
    const pantryModal = document.getElementById('pantry-modal');
    const pantryText = document.getElementById('pantry-text');
    const pantrySave = document.getElementById('btn-pantry-save');
    const pantryCancel = document.getElementById('btn-pantry-cancel');
    const hidePantryCb = document.getElementById('toggle-hide-pantry');

    if (hidePantryCb) {
        hidePantryCb.checked = groceryUiPrefs.hidePantry !== false;
        hidePantryCb.addEventListener('change', () => {
            groceryUiPrefs.hidePantry = hidePantryCb.checked;
            saveGroceryUiPrefs();
            if (groceryView === 'shop') renderShoppingList(buildShoppingItemsForPlan());
        });
    }

    if (pantrySave) {
        pantrySave.addEventListener('click', () => {
            if (pantryText) {
                pantryItems = parsePantryText(pantryText.value);
                savePantryItems();
            }
            closePantryModal();
            if (groceryView === 'shop') renderShoppingList(buildShoppingItemsForPlan());
        });
    }

    if (pantryCancel) {
        pantryCancel.addEventListener('click', closePantryModal);
    }

    if (pantryModal) {
        pantryModal.addEventListener('click', (e) => {
            if (e.target === pantryModal) closePantryModal();
        });
    }
});

function hydrateFoodDatalist() {
    const dl = document.getElementById('food-items');
    if (!dl) return;
    if (dl.children.length) return; // only once

    const maxOptions = 600; // keep UI snappy
    const items = (window.FOOD_DB?.items || []).slice(0, maxOptions);
    items.forEach(it => {
        const opt = document.createElement('option');
        opt.value = it.name;
        dl.appendChild(opt);
    });
}

function savePrefs() {
    localStorage.setItem('mealPlannerPrefs', JSON.stringify(prefs));
}

function setTodayDate() {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const today = new Date().toLocaleDateString('en-IN', options);
    document.getElementById('today-date').textContent = today;
}

// ============================================
// NAVIGATION
// ============================================
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    document.getElementById(section + '-section').classList.add('active');
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');
    
    // If going to grocery, generate the list
    if (section === 'grocery') {
        generateGroceryList();
    }
    
    // If going to meals, render list
    if (section === 'meals') {
        renderAllMealsList();
    }
}

// ============================================
// Grocery shopping mode
// ============================================
let groceryView = localStorage.getItem('mealPlannerGroceryView') || 'plan'; // plan | shop
let shoppingChecks = JSON.parse(localStorage.getItem('mealPlannerShoppingChecks')) || {};
let groceryUiPrefs = JSON.parse(localStorage.getItem('mealPlannerGroceryUiPrefs')) || {
    hideBought: false,
    search: '',
    collapsedGroups: {},
    hidePantry: true
};

// Pantry / staples ("always have")
let pantryItems = JSON.parse(localStorage.getItem('mealPlannerPantryItems')) || [];

function savePantryItems() {
    localStorage.setItem('mealPlannerPantryItems', JSON.stringify(pantryItems || []));
}

function parsePantryText(text) {
    return String(text || '')
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(canonicalizeItem);
}

function pantrySet() {
    const set = new Set();
    (pantryItems || []).forEach(it => set.add(canonicalizeItem(it)));
    return set;
}

function openPantryModal() {
    const modal = document.getElementById('pantry-modal');
    const ta = document.getElementById('pantry-text');
    const hideCb = document.getElementById('toggle-hide-pantry');
    if (ta) ta.value = (pantryItems || []).join('\n');
    if (hideCb) hideCb.checked = groceryUiPrefs.hidePantry !== false;
    if (modal) {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closePantryModal() {
    const modal = document.getElementById('pantry-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
}

function collapseAllGroups(collapsed) {
    if (!groceryUiPrefs.collapsedGroups) groceryUiPrefs.collapsedGroups = {};
    const groups = ['veggies', 'fruits', 'dairy', 'protein', 'bread', 'pantry', 'custom'];
    groups.forEach(g => {
        groceryUiPrefs.collapsedGroups[normalizeGroupKey(g)] = !!collapsed;
    });
    saveGroceryUiPrefs();
}

function saveGroceryUiPrefs() {
    localStorage.setItem('mealPlannerGroceryUiPrefs', JSON.stringify(groceryUiPrefs));
}

function saveShoppingChecks() {
    localStorage.setItem('mealPlannerShoppingChecks', JSON.stringify(shoppingChecks));
}

function setGroceryView(view) {
    groceryView = view === 'shop' ? 'shop' : 'plan';
    localStorage.setItem('mealPlannerGroceryView', groceryView);

    const planBtn = document.getElementById('grocery-view-plan');
    const shopBtn = document.getElementById('grocery-view-shop');
    if (planBtn) planBtn.classList.toggle('active', groceryView === 'plan');
    if (shopBtn) shopBtn.classList.toggle('active', groceryView === 'shop');

    const planRoot = document.getElementById('grocery-list');
    const shopRoot = document.getElementById('grocery-shop');
    const summaryActions = document.getElementById('grocery-summary-actions');
    const bottomBar = document.getElementById('grocery-bottom-bar');
    if (planRoot) planRoot.style.display = groceryView === 'plan' ? 'block' : 'none';
    if (shopRoot) shopRoot.style.display = groceryView === 'shop' ? 'block' : 'none';
    if (summaryActions) summaryActions.style.display = groceryView === 'shop' ? 'block' : 'none';
    if (bottomBar) bottomBar.style.display = groceryView === 'shop' ? 'grid' : 'none';

    // Ensure shopping view is rendered when the user switches
    const items = buildShoppingItemsForPlan();
    if (groceryView === 'shop') {
        renderShoppingList(items);
    }
    updateGrocerySummary(items);
}

function updateGrocerySummary(items) {
    const title = document.getElementById('grocery-summary-title');
    const sub = document.getElementById('grocery-summary-sub');
    const hideCb = document.getElementById('toggle-hide-bought');

    const total = items?.length || 0;
    const checked = items ? items.filter(it => !!shoppingChecks[it.key]).length : 0;
    const remaining = Math.max(0, total - checked);

    if (title) {
        title.textContent = groceryView === 'shop'
            ? `${remaining} left · ${total} total`
            : `${total} items`;
    }
    if (sub) {
        sub.textContent = `For ${planDays} day${planDays === 1 ? '' : 's'}`;
    }
    if (hideCb) {
        hideCb.checked = !!groceryUiPrefs.hideBought;
    }
}

function normalizeItemName(name) {
    return String(name || '').trim().toLowerCase();
}

// Simple grocery synonyms → canonical key used for dedupe.
// Keep it small and practical; users can still type exact items in custom ingredients.
const GROCERY_SYNONYMS = {
    yoghurt: 'curd',
    yogurt: 'curd',
    dahi: 'curd',
    bellpepper: 'capsicum',
    'bell pepper': 'capsicum',
    capsicums: 'capsicum',
    cilantro: 'coriander',
    'coriander leaves': 'coriander',
    'spring onion': 'spring onions',
    scallions: 'spring onions'
};

// Merge in the larger synonym DB from data.js when present.
// (data.js also exposes window.GROCERY_SYNONYMS_DB)
try {
    if (typeof GROCERY_SYNONYMS_DB !== 'undefined' && GROCERY_SYNONYMS_DB) {
        Object.entries(GROCERY_SYNONYMS_DB).forEach(([k, v]) => {
            const key = String(k || '').trim().toLowerCase();
            if (key) GROCERY_SYNONYMS[key] = v;
        });
    }
} catch (_) {
    // ignore
}

function canonicalizeItem(item) {
    const norm = normalizeItemName(item);
    const direct = GROCERY_SYNONYMS[norm];
    if (direct) return direct;
    // Also check a "no spaces" version for things like bellpepper
    const squashed = norm.replace(/\s+/g, '');
    const squashedMap = GROCERY_SYNONYMS[squashed];
    return squashedMap || norm;
}

function normalizeGroupKey(group) {
    return String(group || 'custom').trim().toLowerCase();
}

function isGroupCollapsed(group) {
    const key = normalizeGroupKey(group);
    return !!groceryUiPrefs?.collapsedGroups?.[key];
}

function setGroupCollapsed(group, collapsed) {
    const key = normalizeGroupKey(group);
    if (!groceryUiPrefs.collapsedGroups) groceryUiPrefs.collapsedGroups = {};
    groceryUiPrefs.collapsedGroups[key] = !!collapsed;
    saveGroceryUiPrefs();
}

function getGroceryMasterIndex() {
    const idx = [];
    if (typeof groceryMaster === 'undefined' || !groceryMaster) return idx;
    Object.entries(groceryMaster).forEach(([group, items]) => {
        (items || []).forEach(item => {
            idx.push({ group, item, key: normalizeItemName(item) });
        });
    });
    // Prefer longest matches first (e.g., "sweet potato" before "potato")
    idx.sort((a, b) => b.key.length - a.key.length);
    return idx;
}

const GROCERY_MASTER_INDEX = getGroceryMasterIndex();

function inferItemsFromMealText(meal) {
    const text = `${meal?.name || ''} ${meal?.notes || ''}`.toLowerCase();
    if (!text.trim()) return [];

    const matches = [];
    GROCERY_MASTER_INDEX.forEach(({ group, item, key }) => {
        if (!key) return;
        // word-boundary-ish matching
        const re = new RegExp(`(^|[^a-z])${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z]|$)`, 'i');
        if (re.test(text)) matches.push({ group, item });
    });
    return matches;
}

function addShoppingItem(map, group, item, hint) {
    const parsed = parseIngredientLine(item);
    const canonical = canonicalizeItem(parsed.name);

    // Determine best group:
    // - keep provided group unless it's custom and FOOD_DB can classify it
    // - else attempt a FOOD_DB lookup
    let resolvedGroup = group || 'custom';
    if (resolvedGroup === 'custom') {
        const g2 = inferGroupFromFoodDb(canonical);
        if (g2) resolvedGroup = g2;
    }

    // unit is part of the key so we don't incorrectly add "2kg" and "2pcs"
    const unitKey = parsed.unit || '';
    const key = `${resolvedGroup}:${canonical}:${unitKey}`;

    if (!map.has(key)) {
        map.set(key, {
            key,
            group: resolvedGroup,
            item: parsed.displayName,
            canonical,
            count: 0,
            qty: 0,
            unit: parsed.unit || '',
            hints: new Set()
        });
    }

    const entry = map.get(key);
    entry.count += 1;
    if (typeof parsed.qty === 'number' && isFinite(parsed.qty) && parsed.qty > 0) {
        entry.qty += parsed.qty;
    }
    if (hint) entry.hints.add(hint);
}

function normalizeUnit(u) {
    const unit = String(u || '').trim().toLowerCase();
    if (!unit) return '';
    const map = {
        g: 'g', gram: 'g', grams: 'g',
        kg: 'kg', kgs: 'kg', kilogram: 'kg', kilograms: 'kg',
        ml: 'ml',
        l: 'L', lt: 'L', litre: 'L', liters: 'L', litre: 'L', litres: 'L',
        pcs: 'pcs', pc: 'pcs', piece: 'pcs', pieces: 'pcs',
        tbsp: 'tbsp', tbsps: 'tbsp',
        tsp: 'tsp', tsps: 'tsp'
    };
    return map[unit] || unit;
}

function inferGroupFromFoodDb(canonicalName) {
    try {
        const items = window.FOOD_DB?.items || [];
        const hit = items.find(it => it.name === canonicalName);
        if (!hit) return null;

        // Map FOOD_DB groups into the app's group buckets
        const g = hit.group;
        if (g === 'bakery') return 'bread';
        if (['grains', 'pulses', 'spices', 'condiments'].includes(g)) return 'pantry';
        if (g === 'freezer') return 'pantry';
        if (g === 'baby') return 'pantry';
        if (['veggies', 'fruits', 'dairy', 'protein', 'bread', 'pantry'].includes(g)) return g;
        return 'custom';
    } catch (_) {
        return null;
    }
}

function suggestUnitForItem(canonicalName) {
    try {
        // Prefer FOOD_DB, then GROCERY_UNIT_HINTS, else none
        const u1 = window.FOOD_DB?.unitHints?.[canonicalName];
        if (u1) return normalizeUnit(u1);
    } catch (_) {}
    try {
        if (typeof GROCERY_UNIT_HINTS !== 'undefined' && GROCERY_UNIT_HINTS) {
            const u2 = GROCERY_UNIT_HINTS[canonicalName];
            if (u2) return normalizeUnit(u2);
        }
    } catch (_) {}
    return '';
}

// Parses "milk 2L" / "2 L milk" / "eggs x12" / "onion 1 kg" into a structured ingredient.
function parseIngredientLine(raw) {
    const input = String(raw || '').trim();
    if (!input) return { name: '', displayName: '', qty: 0, unit: '' };

    // normalize separators
    const s = input.replace(/\s+/g, ' ').trim();

    // Patterns (simple + practical)
    // 1) leading quantity: "2kg chicken" | "2 kg chicken" | "12 eggs"
    let m = s.match(/^([0-9]+(?:\.[0-9]+)?)\s*(x)?\s*([a-zA-Z]+)?\s+(.*)$/);
    if (m) {
        const qty = parseFloat(m[1]);
        const unit = normalizeUnit(m[3] || '');
        const name = (m[4] || '').trim();
        const canonicalName = canonicalizeItem(name);
        return {
            name: canonicalName,
            displayName: name,
            qty: isFinite(qty) ? qty : 0,
            unit: unit || suggestUnitForItem(canonicalName)
        };
    }

    // 2) trailing quantity: "milk 2L" | "onion 1 kg"
    m = s.match(/^(.*)\s+([0-9]+(?:\.[0-9]+)?)\s*(x)?\s*([a-zA-Z]+)?$/);
    if (m) {
        const name = (m[1] || '').trim();
        const qty = parseFloat(m[2]);
        const unit = normalizeUnit(m[4] || '');
        const canonicalName = canonicalizeItem(name);
        return {
            name: canonicalName,
            displayName: name,
            qty: isFinite(qty) ? qty : 0,
            unit: unit || suggestUnitForItem(canonicalName)
        };
    }

    // 3) no quantity
    const canonicalName = canonicalizeItem(s);
    return {
        name: canonicalName,
        displayName: s,
        qty: 0,
        unit: suggestUnitForItem(canonicalName)
    };
}

function formatQty(entry) {
    if (!entry) return '';
    const qty = entry.qty;
    const unit = entry.unit ? String(entry.unit) : '';
    if (typeof qty === 'number' && isFinite(qty) && qty > 0) {
        const q = Number.isInteger(qty) ? String(qty) : qty.toFixed(1).replace(/\.0$/, '');
        return `${q}${unit ? ' ' + unit : ''}`.trim();
    }
    // fallback when only count is known
    if ((entry.count || 0) > 1) return `×${entry.count}`;
    return '';
}

function buildShoppingItemsForPlan() {
    const map = new Map();
    const timeLabels = {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        snacks: 'Snacks',
        dinner: 'Dinner'
    };
    const dayPrefix = (d) => (planDays === 1 ? '' : `Day ${d + 1} · `);

    for (let d = 0; d < planDays; d++) {
        const dayPlan = plans[d] || createEmptyDayPlan();

        // Adult
        ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(cat => {
            const meal = dayPlan[cat];
            if (!meal) return;
            const hint = `${dayPrefix(d)}${timeLabels[cat]}: ${meal.name}`;

            // 1) explicit ingredients win
            (meal.ingredients || []).forEach(ing => {
                addShoppingItem(map, 'custom', ing, hint);
            });

            // 2) heuristic from name/notes
            inferItemsFromMealText(meal).forEach(({ group, item }) => {
                addShoppingItem(map, group, item, hint);
            });
        });

        if (prefs.includeBabyInGrocery) {
            ['babyBreakfast', 'babyLunch', 'babySnacks', 'babyDinner'].forEach(cat => {
                const meal = dayPlan[cat];
                if (!meal) return;
                const baseCat = cat.replace('baby', '').toLowerCase();
                const hint = `${dayPrefix(d)}${timeLabels[baseCat]} (baby): ${meal.name}`;

                (meal.ingredients || []).forEach(ing => {
                    addShoppingItem(map, 'custom', ing, hint);
                });
                inferItemsFromMealText(meal).forEach(({ group, item }) => {
                    addShoppingItem(map, group, item, hint);
                });
            });
        }
    }

    return Array.from(map.values()).map(x => ({
        ...x,
        hintText: Array.from(x.hints).slice(0, 2).join(' · ') // keep it readable
    }));
}

function setAllInGroup(group, checked, items) {
    (items || []).forEach(it => {
        if ((it.group || 'custom') !== group) return;
        shoppingChecks[it.key] = !!checked;
    });
    saveShoppingChecks();
}

function renderShoppingList(items) {
    const root = document.getElementById('shopping-list');
    if (!root) return;

    root.innerHTML = '';
    if (!items?.length) {
        const empty = document.createElement('div');
        empty.className = 'shop-group';
        empty.innerHTML = `<h2>Nothing selected</h2><div class="empty" style="display:block">Pick meals first, then come back.</div>`;
        root.appendChild(empty);
        return;
    }

    const groupOrder = ['veggies', 'fruits', 'dairy', 'protein', 'bread', 'pantry', 'custom'];
    const labelMap = {
        veggies: 'Veggies',
        fruits: 'Fruits',
        dairy: 'Dairy',
        protein: 'Protein',
        bread: 'Bread',
        pantry: 'Pantry',
        custom: 'Other'
    };

    const searchQ = (groceryUiPrefs.search || '').trim().toLowerCase();
    const searching = !!searchQ;
    const pantry = pantrySet();

    const filtered = (items || [])
        .filter(it => (groceryUiPrefs.hideBought ? !shoppingChecks[it.key] : true))
        .filter(it => {
            if (!groceryUiPrefs.hidePantry) return true;
            // When searching, show pantry items too so search always finds them.
            if (searching) return true;
            const canon = it.canonical || canonicalizeItem(it.item);
            return !pantry.has(canon);
        })
        .filter(it => {
            if (!searchQ) return true;
            return String(it.item || '').toLowerCase().includes(searchQ);
        });

    const byGroup = {};
    filtered.forEach(it => {
        const g = it.group || 'custom';
        if (!byGroup[g]) byGroup[g] = [];
        byGroup[g].push(it);
    });

    groupOrder.forEach(g => {
        const list = byGroup[g] || [];
        if (!list.length) return;

        list.sort((a, b) => a.item.localeCompare(b.item));

        const groupEl = document.createElement('div');
        groupEl.className = 'shop-group';

        const allInThisGroup = (items || []).filter(it => (it.group || 'custom') === g);
        const checkedInGroup = allInThisGroup.filter(it => !!shoppingChecks[it.key]).length;
        const totalInGroup = allInThisGroup.length;
        const remainingInGroup = Math.max(0, totalInGroup - checkedInGroup);

        const header = document.createElement('div');
        header.className = 'shop-group-header';
        header.innerHTML = `
            <button class="shop-group-toggle" aria-label="Toggle ${labelMap[g] || g}">
                <span class="title">${labelMap[g] || g}</span>
                <span class="count">${remainingInGroup} left</span>
            </button>
            <div class="shop-group-actions">
                <button class="mini-btn" aria-label="Check all in ${labelMap[g] || g}">All</button>
                <button class="mini-btn" aria-label="Uncheck all in ${labelMap[g] || g}">None</button>
            </div>
        `;
        groupEl.appendChild(header);

        const body = document.createElement('div');
        body.className = 'shop-group-body';
    const collapsed = searching ? false : isGroupCollapsed(g);
        body.style.display = collapsed ? 'none' : 'block';

        const toggleBtn = header.querySelector('.shop-group-toggle');
        toggleBtn.addEventListener('click', () => {
            const nowCollapsed = body.style.display !== 'none';
            body.style.display = nowCollapsed ? 'none' : 'block';
            setGroupCollapsed(g, nowCollapsed);
        });

        const [allBtn, noneBtn] = header.querySelectorAll('.mini-btn');
        allBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setAllInGroup(g, true, items);
            renderShoppingList(items);
        });
        noneBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setAllInGroup(g, false, items);
            renderShoppingList(items);
        });

        list.forEach(it => {
            const row = document.createElement('label');
            row.className = 'shop-item';

            const checked = !!shoppingChecks[it.key];
            if (checked) row.classList.add('is-done');

            const qtyText = formatQty(it);
            row.innerHTML = `
                <input type="checkbox" ${checked ? 'checked' : ''} aria-label="Mark ${it.item} as bought" />
                <span class="label">${it.item} ${qtyText ? `<span class=\"qty\">${qtyText}</span>` : ''}</span>
                <span class="hint">${it.hintText || ''}</span>
            `;

            const cb = row.querySelector('input');
            cb.addEventListener('change', () => {
                shoppingChecks[it.key] = cb.checked;
                row.classList.toggle('is-done', cb.checked);
                saveShoppingChecks();
                updateGrocerySummary(items);
            });

            body.appendChild(row);
        });

        groupEl.appendChild(body);

        root.appendChild(groupEl);
    });

    updateGrocerySummary(items);
}

function resetShoppingChecks() {
    shoppingChecks = {};
    saveShoppingChecks();
    renderShoppingList(buildShoppingItemsForPlan());
    showToast('Checks reset');
}

// ============================================
// SIMPLIFIED COPY FUNCTIONS
// ============================================

// Copy for Blinkit/BigBasket/Zepto - simple list, remaining items only
function copyForShopping() {
    const items = buildShoppingItemsForPlan();
    if (!items.length) {
        showToast('Pick meals first');
        return;
    }

    // Only remaining (unchecked) items
    const remaining = items.filter(it => !shoppingChecks[it.key]);
    
    if (!remaining.length) {
        showToast('All items checked off! ✅');
        return;
    }

    const list = remaining
        .sort((a, b) => a.item.localeCompare(b.item))
        .map(it => {
            const q = formatQty(it);
            return q ? `${it.item} ${q}` : it.item;
        });

    copyToClipboard(list.join('\n'));
    showToast(`Copied ${list.length} items 📋`);
}

// Copy for Maid - grouped by what she needs to prep, only maid-sourced meals
function copyForMaid() {
    const maidMeals = [];
    
    for (let i = 0; i < planDays; i++) {
        const dayPlan = plans[i] || {};
        MEAL_CATEGORIES.forEach(cat => {
            const meal = dayPlan[cat];
            if (meal && meal.source === 'Maid') {
                maidMeals.push({
                    day: i + 1,
                    category: cat.replace('baby', 'Baby '),
                    name: meal.name
                });
            }
        });
    }

    if (!maidMeals.length) {
        showToast('No maid meals planned');
        return;
    }

    // Group by day
    const lines = [];
    lines.push(`🍳 MAID INSTRUCTIONS (${planDays} day${planDays === 1 ? '' : 's'})`);
    lines.push('');

    for (let d = 1; d <= planDays; d++) {
        const dayMeals = maidMeals.filter(m => m.day === d);
        if (dayMeals.length) {
            lines.push(d === 1 ? '📅 TODAY:' : `📅 DAY ${d}:`);
            dayMeals.forEach(m => {
                const catLabel = m.category.replace('Breakfast', '🌅').replace('Lunch', '☀️').replace('Snacks', '🍿').replace('Dinner', '🌙');
                lines.push(`  ${catLabel} ${m.name}`);
            });
            lines.push('');
        }
    }

    // Add grocery items for maid
    const items = buildShoppingItemsForPlan();
    const remaining = items.filter(it => !shoppingChecks[it.key]);
    
    if (remaining.length) {
        lines.push('🛒 NEED TO BUY:');
        remaining.slice(0, 15).forEach(it => {
            const q = formatQty(it);
            lines.push(`  • ${it.item}${q ? ` (${q})` : ''}`);
        });
        if (remaining.length > 15) {
            lines.push(`  ... and ${remaining.length - 15} more`);
        }
    }

    copyToClipboard(lines.join('\n'));
    showToast(`Copied maid list 👩‍🍳`);
}

// Legacy functions (keep for backward compatibility)
function copyShoppingList() { copyForShopping(); }
function copyBlinkitList() { copyForShopping(); }

function goToGrocery() {
    showSection('grocery');
}

function goBack() {
    showSection('plan');
}

// ============================================
// MEAL SELECTION
// ============================================
function getAllMeals(category) {
    if (typeof MEALS === 'undefined') {
        console.error('MEALS is not defined!');
        return [];
    }
    const base = MEALS[category] || [];
    const custom = customMeals[category] || [];
    return [...base, ...custom];
}

function getRandomMeal(category) {
    const meals = getAllMeals(category);
    if (!meals.length) return null;
    
    // Filter out recently eaten (last 14 days)
    const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
    const available = meals.filter(meal => {
        const lastEaten = history[meal.name];
        return !lastEaten || lastEaten < twoWeeksAgo;
    });
    
    // If all meals eaten recently, just pick any
    const pool = available.length > 0 ? available : meals;
    return pool[Math.floor(Math.random() * pool.length)];
}

function getRandomMealAvoiding(category, usedNamesSet) {
    const meals = getAllMeals(category);
    if (!meals.length) return null;

    // Reuse the existing 14-day filtering
    const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
    const available = meals.filter(meal => {
        const lastEaten = history[meal.name];
        const notRecent = !lastEaten || lastEaten < twoWeeksAgo;
        const notUsed = !usedNamesSet || !usedNamesSet.has(meal.name);
        return notRecent && notUsed;
    });

    const pool = available.length ? available : meals.filter(m => !usedNamesSet || !usedNamesSet.has(m.name));
    const finalPool = pool.length ? pool : meals;

    return finalPool[Math.floor(Math.random() * finalPool.length)];
}

function shuffleMeal(category) {
    if (isLocked(category)) return;
    const meal = getRandomMeal(category);
    if (meal) {
        plans[activeDayIndex][category] = meal;
        updateMealDisplay(category, meal);
        renderDaySummary();
        savePlan();
    }
}

function shuffleAll() {
    // Fill ALL days (so 3-day / 5-day plans are one-tap)
    // Optionally avoid repeats within the generated plan.
    const usedByCategory = {};
    MEAL_CATEGORIES.forEach(cat => (usedByCategory[cat] = new Set()));

    for (let d = 0; d < planDays; d++) {
        ensureLocks(plans[d]);
        MEAL_CATEGORIES.forEach(cat => {
            if (plans[d].locks?.[cat]) return;
            const used = prefs.avoidRepeatsWithinPlan ? usedByCategory[cat] : null;
            const meal = used ? getRandomMealAvoiding(cat, used) : getRandomMeal(cat);
            if (meal) {
                plans[d][cat] = meal;
                if (used) used.add(meal.name);
            }
        });
    }
    renderActiveDay();
    savePlan();
    showToast(`Shuffled ${planDays} day${planDays === 1 ? '' : 's'}`);
}

function cycleMeal(category) {
    if (isLocked(category)) return;
    const meals = getAllMeals(category);
    if (!meals.length) return;
    
    const current = plans[activeDayIndex][category];
    let nextIndex = 0;
    
    if (current) {
        const currentIndex = meals.findIndex(m => m.name === current.name);
        nextIndex = (currentIndex + 1) % meals.length;
    }
    
    plans[activeDayIndex][category] = meals[nextIndex];
    updateMealDisplay(category, meals[nextIndex]);
    renderDaySummary();
    savePlan();
}

function updateMealDisplay(category, meal) {
    // Map category to element ID
    const elementMap = {
        'breakfast': 'pick-breakfast',
        'lunch': 'pick-lunch',
        'snacks': 'pick-snacks',
        'dinner': 'pick-dinner',
        'babyBreakfast': 'pick-baby-breakfast',
        'babyLunch': 'pick-baby-lunch',
        'babySnacks': 'pick-baby-snacks',
        'babyDinner': 'pick-baby-dinner'
    };
    
    const elementId = elementMap[category];
    const el = document.getElementById(elementId);
    
    if (el && meal) {
        const nameEl = el.querySelector('.meal-name');
        const infoEl = el.querySelector('.meal-info');
        if (nameEl) nameEl.textContent = meal.name;
        
        // Get nutrition info from nutrition DB if available
        let proteinInfo = meal.protein || '';
        let nutritionStr = '';
        if (window.NUTRITION_DB && meal.name) {
            const dishInfo = lookupDishProtein(meal.name, category);
            if (dishInfo) {
                const parts = [];
                if (dishInfo.protein) parts.push(`${dishInfo.protein}g`);
                if (dishInfo.cal) parts.push(`${dishInfo.cal}kcal`);
                nutritionStr = parts.join(' · ');
            }
        }
        
        if (infoEl) {
            const parts = [meal.source || ''];
            if (nutritionStr) parts.push(nutritionStr);
            else if (proteinInfo) parts.push(proteinInfo);
            infoEl.textContent = parts.filter(Boolean).join(' · ');
        }
    }
}

// Lookup protein from nutrition database
function lookupDishProtein(dishName, category) {
    if (!window.NUTRITION_DB) return null;
    
    const name = dishName.toLowerCase();
    const catKey = category.replace('baby', '').toLowerCase() || 'lunch';
    
    // First check dishes database
    const dishes = NUTRITION_DB.dishes;
    const catDishes = dishes[catKey] || dishes.lunch || [];
    
    for (const dish of catDishes) {
        if (name.includes(dish.name.toLowerCase()) || dish.name.toLowerCase().includes(name.split('+')[0].trim())) {
            return dish;
        }
    }
    
    // Fuzzy match on common keywords (with cal estimates)
    const proteinKeywords = {
        'chicken': { protein: 25, proteinLevel: 'High', cal: 420 },
        'mutton': { protein: 28, proteinLevel: 'High', cal: 500 },
        'fish': { protein: 22, proteinLevel: 'High', cal: 350 },
        'surmai': { protein: 22, proteinLevel: 'High', cal: 350 },
        'pomfret': { protein: 20, proteinLevel: 'High', cal: 320 },
        'prawn': { protein: 24, proteinLevel: 'High', cal: 380 },
        'egg': { protein: 13, proteinLevel: 'High', cal: 200 },
        'paneer': { protein: 16, proteinLevel: 'High', cal: 380 },
        'soya': { protein: 22, proteinLevel: 'High', cal: 350 },
        'dal': { protein: 10, proteinLevel: 'Medium', cal: 350 },
        'rajma': { protein: 12, proteinLevel: 'Medium', cal: 400 },
        'chole': { protein: 11, proteinLevel: 'Medium', cal: 420 },
        'chana': { protein: 11, proteinLevel: 'Medium', cal: 400 },
        'khichdi': { protein: 8, proteinLevel: 'Medium', cal: 300 },
        'omelette': { protein: 14, proteinLevel: 'High', cal: 180 },
        'bhurji': { protein: 14, proteinLevel: 'High', cal: 200 },
        'momos': { protein: 12, proteinLevel: 'Medium', cal: 280 },
        'biryani': { protein: 20, proteinLevel: 'High', cal: 550 },
    };
    
    for (const [keyword, info] of Object.entries(proteinKeywords)) {
        if (name.includes(keyword)) {
            return info;
        }
    }
    
    return null;
}

// ============================================
// SAVE/LOAD
// ============================================
function savePlan() {
    const today = new Date().toDateString();
    localStorage.setItem('mealPlannerPlanV2', JSON.stringify({
        date: today,
        planDays,
        plans
    }));
}

function loadSavedPlan() {
    const today = new Date().toDateString();

    // New format
    const savedV2 = JSON.parse(localStorage.getItem('mealPlannerPlanV2'));
    if (savedV2 && savedV2.date === today && Array.isArray(savedV2.plans)) {
        planDays = [1, 3, 5].includes(savedV2.planDays) ? savedV2.planDays : savedV2.plans.length;
        plans = savedV2.plans;
        // Normalize length
        if (plans.length < planDays) {
            while (plans.length < planDays) plans.push(createEmptyDayPlan());
        }
        plans = plans.slice(0, planDays);
        activeDayIndex = 0;
        updateDayUI();
        renderActiveDay();
        return;
    }

    // Old format migration (single-day)
    const saved = JSON.parse(localStorage.getItem('todaysPlan'));
    
    if (saved && saved.date === today && saved.plan) {
        planDays = 1;
        activeDayIndex = 0;
        plans = [createEmptyDayPlan()];
        MEAL_CATEGORIES.forEach(cat => {
            plans[0][cat] = saved.plan[cat] || null;
        });
        updateDayUI();
        renderActiveDay();
        savePlan();
    }
        // Back-compat: older saved plans won't have locks
        plans.forEach(p => ensureLocks(p));
}

function markAsEaten(mealName) {
    history[mealName] = Date.now();
    localStorage.setItem('mealHistory', JSON.stringify(history));
}

// ============================================
// GROCERY LIST
// ============================================
function generateGroceryList() {
    const orderItems = [];
    const maidItems = [];
    const youItems = [];
    const babyItems = [];
    
    const timeLabels = {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        snacks: 'Snacks',
        dinner: 'Dinner'
    };
    
    const dayPrefix = (d) => (planDays === 1 ? '' : `Day ${d + 1} · `);

    for (let d = 0; d < planDays; d++) {
        const dayPlan = plans[d];

        // Process adult meals
        ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(cat => {
            const meal = dayPlan[cat];
            if (!meal) return;

            const item = {
                time: `${dayPrefix(d)}${timeLabels[cat]}`,
                name: meal.name,
                ingredients: meal.ingredients || []
            };

            if (meal.source === 'Order') {
                orderItems.push(item);
            } else if (meal.source === 'Maid') {
                maidItems.push(item);
            } else {
                youItems.push(item);
            }

            // Mark as eaten
            markAsEaten(meal.name);
        });

        if (prefs.includeBabyInGrocery) {
            // Process baby meals
            ['babyBreakfast', 'babyLunch', 'babySnacks', 'babyDinner'].forEach(cat => {
                const meal = dayPlan[cat];
                if (!meal) return;

                const baseCat = cat.replace('baby', '').toLowerCase();
                babyItems.push({
                    time: `${dayPrefix(d)}${timeLabels[baseCat]}`,
                    name: meal.name,
                    ingredients: meal.ingredients || []
                });
            });
        }
    }
    
    // Render into the single grocery container used by the current HTML
    renderGroceryList({ orderItems, maidItems, youItems, babyItems });

    // Update shopping mode too
    setGroceryView(groceryView);
}

// ============================================
// Preferences / reset
// ============================================
function openSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('active');
}

function closeSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.remove('active');
}

function resetToday() {
    plans = Array.from({ length: planDays }, () => createEmptyDayPlan());
    activeDayIndex = 0;
    updateDayUI();
    renderActiveDay();
    savePlan();
    showToast('Plan reset');
}

// ============================================
// Multi-day UI helpers
// ============================================
function renderActiveDay() {
    const dayPlan = plans[activeDayIndex] || createEmptyDayPlan();
    ensureLocks(dayPlan);
    MEAL_CATEGORIES.forEach(cat => {
        if (dayPlan[cat]) updateMealDisplay(cat, dayPlan[cat]);
        else {
            // Reset UI to defaults
            const elementMap = {
                'breakfast': 'pick-breakfast',
                'lunch': 'pick-lunch',
                'snacks': 'pick-snacks',
                'dinner': 'pick-dinner',
                'babyBreakfast': 'pick-baby-breakfast',
                'babyLunch': 'pick-baby-lunch',
                'babySnacks': 'pick-baby-snacks',
                'babyDinner': 'pick-baby-dinner'
            };
            const el = document.getElementById(elementMap[cat]);
            if (!el) return;
            const nameEl = el.querySelector('.meal-name');
            const infoEl = el.querySelector('.meal-info');
            if (nameEl) nameEl.textContent = cat.startsWith('baby') ? 'Baby' : 'Tap to pick';
            if (infoEl) infoEl.textContent = '';
        }
    });

    renderLocksForActiveDay();

    renderDaySummary();
}

function renderDaySummary() {
    const dayPlan = plans[activeDayIndex] || createEmptyDayPlan();
    const meals = ['breakfast', 'lunch', 'snacks', 'dinner']
        .map(k => ({ meal: dayPlan[k], category: k }))
        .filter(x => x.meal);

    const counts = {
        You: 0,
        Maid: 0,
        Order: 0,
        proteinHigh: 0,
        proteinMed: 0,
        proteinLow: 0
    };

    // Calculate estimated protein & calories from nutrition DB
    let totalProteinGrams = 0;
    let totalCalories = 0;
    
    meals.forEach(({ meal: m, category }) => {
        if (m.source === 'Maid') counts.Maid++;
        else if (m.source === 'Order') counts.Order++;
        else counts.You++;

        if (m.protein === 'High') counts.proteinHigh++;
        else if (m.protein === 'Medium') counts.proteinMed++;
        else counts.proteinLow++;
        
        // Lookup nutrition from DB
        const dishInfo = lookupDishProtein(m.name, category);
        if (dishInfo) {
            if (dishInfo.protein) totalProteinGrams += dishInfo.protein;
            if (dishInfo.cal) totalCalories += dishInfo.cal;
        } else {
            // Estimate based on protein level
            if (m.protein === 'High') { totalProteinGrams += 20; totalCalories += 400; }
            else if (m.protein === 'Medium') { totalProteinGrams += 10; totalCalories += 350; }
            else { totalProteinGrams += 5; totalCalories += 300; }
        }
    });

    // Protein score: High=3, Medium=2, Low=1. Target: at least 8 points (e.g., 2 High + 1 Med = 8)
    const proteinScore = (counts.proteinHigh * 3) + (counts.proteinMed * 2) + (counts.proteinLow * 1);
    const mealsPlanned = meals.length;
    
    // Determine protein status - now with grams target (50g+ is good for adults)
    let proteinStatus = '';
    let proteinEmoji = '';
    if (mealsPlanned === 0) {
        proteinStatus = 'No meals yet';
        proteinEmoji = '⚪';
    } else if (totalProteinGrams >= 50 || (proteinScore >= 8)) {
        proteinStatus = `~${totalProteinGrams}g · ${totalCalories}kcal`;
        proteinEmoji = '💪';
    } else if (totalProteinGrams >= 35 || proteinScore >= 6) {
        proteinStatus = `~${totalProteinGrams}g · ${totalCalories}kcal`;
        proteinEmoji = '👍';
    } else {
        proteinStatus = `~${totalProteinGrams}g · ${totalCalories}kcal`;
        proteinEmoji = '⚠️';
    }

    const chipSource = document.getElementById('chip-source');
    const chipProtein = document.getElementById('chip-protein');
    const warn = document.getElementById('summary-warn');

    if (chipSource) chipSource.textContent = `You ${counts.You} · Maid ${counts.Maid} · Order ${counts.Order}`;
    if (chipProtein) {
        chipProtein.textContent = `${proteinEmoji} ${proteinStatus}`;
        chipProtein.className = 'summary-chip';
        if (totalProteinGrams < 35 && mealsPlanned >= 2) chipProtein.classList.add('chip-warn');
        else if (totalProteinGrams >= 50) chipProtein.classList.add('chip-good');
    }

    const warnings = [];
    if (counts.Order >= 3) warnings.push('🍕 High order-in day');
    if (mealsPlanned >= 3 && counts.proteinHigh === 0) warnings.push('💡 Add a high-protein meal');
    if (mealsPlanned >= 3 && totalProteinGrams < 40) warnings.push('🥩 Try: eggs, chicken, fish, paneer, dal');

    if (warn) {
        if (warnings.length) {
            warn.style.display = 'block';
            warn.textContent = warnings.join(' · ');
        } else {
            warn.style.display = 'none';
            warn.textContent = '';
        }
    }
}

function updateDayUI() {
    // Segmented buttons
    document.querySelectorAll('.seg-btn').forEach(btn => {
        btn.classList.toggle('active', Number(btn.dataset.days) === planDays);
    });

    const title = document.getElementById('day-title');
    const sub = document.getElementById('day-subtitle');
    const prev = document.getElementById('day-prev');
    const next = document.getElementById('day-next');

    if (title) title.textContent = `Day ${activeDayIndex + 1}`;
    if (sub) sub.textContent = activeDayIndex === 0 ? 'Today' : `In ${activeDayIndex} day${activeDayIndex === 1 ? '' : 's'}`;
    if (prev) prev.disabled = activeDayIndex === 0;
    if (next) next.disabled = activeDayIndex >= planDays - 1;
}

function setPlanDays(days) {
    if (![1, 3, 5].includes(days)) return;
    planDays = days;
    activeDayIndex = 0;

    // Resize plans
    if (!Array.isArray(plans)) plans = [createEmptyDayPlan()];
    while (plans.length < planDays) plans.push(createEmptyDayPlan());
    plans = plans.slice(0, planDays);

    updateDayUI();
    renderActiveDay();
    savePlan();
}

function nextDay() {
    if (activeDayIndex < planDays - 1) {
        activeDayIndex++;
        updateDayUI();
        renderActiveDay();
    }
}

function prevDay() {
    if (activeDayIndex > 0) {
        activeDayIndex--;
        updateDayUI();
        renderActiveDay();
    }
}

function renderGroceryList(groups) {
    const root = document.getElementById('grocery-list');
    if (!root) return;

    const sectionSpec = [
        { key: 'orderItems', title: 'Order in', className: 'order' },
        { key: 'maidItems', title: 'Maid cooks', className: 'maid' },
        { key: 'youItems', title: 'You cook', className: 'you' },
        { key: 'babyItems', title: 'Baby', className: 'baby' }
    ];

    root.innerHTML = '';

    const totalCount = Object.values(groups).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    const fullBtn = document.getElementById('full-list-btn');
    if (fullBtn) fullBtn.style.display = totalCount ? 'flex' : 'none';

    sectionSpec.forEach(({ key, title, className }) => {
        const items = groups[key] || [];
        if (!items.length) return;

        const group = document.createElement('div');
        group.className = `grocery-group ${className}`;
        group.innerHTML = `<h2>${title}</h2>`;

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'grocery-item';
            div.innerHTML = `
                <span class="time">${item.time}</span>
                <span class="name">${item.name}</span>
            `;
            group.appendChild(div);
        });

        root.appendChild(group);
    });

    if (!root.childElementCount) {
        const empty = document.createElement('div');
        empty.className = 'grocery-group stock';
        empty.innerHTML = `<h2>Nothing selected</h2><div class="empty" style="display:block">Go back and pick meals first.</div>`;
        root.appendChild(empty);
    }
}

function copyMaidList() {
    const maidMeals = [];
    const dayPrefix = (d) => (planDays === 1 ? '' : `Day ${d + 1}: `);

    for (let d = 0; d < planDays; d++) {
        const dayPlan = plans[d] || createEmptyDayPlan();
        ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(cat => {
            const meal = dayPlan[cat];
            if (meal && meal.source === 'Maid') {
                maidMeals.push(`- ${dayPrefix(d)}${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${meal.name}`);
            }
        });
    }
    
    if (maidMeals.length === 0) {
        showToast('No maid meals selected');
        return;
    }
    
    const text = `Cooking plan (${planDays} day${planDays === 1 ? '' : 's'}):\n\n${maidMeals.join('\n')}`;
    copyToClipboard(text);
    showToast('Copied for WhatsApp');
}

function copyFullList() {
    let lines = ['GROCERY LIST\n'];

    const dayLabel = (d) => (planDays === 1 ? 'TODAY' : `DAY ${d + 1}`);

    for (let d = 0; d < planDays; d++) {
        const dayPlan = plans[d] || createEmptyDayPlan();

        lines.push(`${dayLabel(d)} MEALS:`);
        ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(cat => {
            const meal = dayPlan[cat];
            if (meal) lines.push(`- ${cat}: ${meal.name} (${meal.source})`);
        });

        lines.push('BABY:');
        ['babyBreakfast', 'babyLunch', 'babySnacks', 'babyDinner'].forEach(cat => {
            const meal = dayPlan[cat];
            if (meal) lines.push(`- ${cat.replace('baby', '').toLowerCase()}: ${meal.name}`);
        });

        lines.push('');
    }
    
    copyToClipboard(lines.join('\n'));
    showToast('Full list copied');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    });
}

// ============================================
// ALL MEALS LIST
// ============================================
let currentFilter = 'all';

function filterMeals(filter) {
    currentFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('.tab').forEach(btn => {
        const label = (btn.textContent || '').trim().toLowerCase();
        const normalized = label === 'all' ? 'all' : label;
        btn.classList.toggle('active', normalized === filter);
    });
    
    renderAllMealsList();
}

function renderAllMealsList() {
    const container = document.getElementById('all-meals');
    if (!container) return;
    container.innerHTML = '';
    
    const categories = currentFilter === 'all'
        ? ['breakfast', 'lunch', 'snacks', 'dinner']
        : (currentFilter === 'baby' ? ['babyBreakfast', 'babyLunch', 'babySnacks', 'babyDinner'] : [currentFilter]);
    
    categories.forEach(cat => {
        const meals = getAllMeals(cat);
        meals.forEach(meal => {
            const isCustom = (customMeals[cat] || []).some(m => m.name === meal.name);
            
            // Get protein grams from nutrition DB
            const dishInfo = lookupDishProtein(meal.name, cat);
            const proteinGrams = dishInfo ? `~${dishInfo.protein}g` : '';
            const metaParts = [meal.source, meal.protein];
            if (proteinGrams) metaParts.push(proteinGrams);
            
            const div = document.createElement('div');
            div.className = 'meal-list-item';
            div.innerHTML = `
                <div class="info">
                    <div class="name">${meal.name}</div>
                    <div class="meta">${metaParts.filter(Boolean).join(' · ')}</div>
                </div>
                ${isCustom ? `
                    <div class="row-actions">
                        <button class="mini-btn" onclick="openIngredientsModal('${cat}', '${meal.name.replace(/'/g, "\\'")}')" aria-label="Edit ingredients">Edit</button>
                        <button class="delete-btn" onclick="deleteMeal('${cat}', '${meal.name.replace(/'/g, "\\'")}')" aria-label="Delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                            </svg>
                        </button>
                    </div>
                ` : `
                    <button class="delete-btn" onclick="deleteMeal('${cat}', '${meal.name.replace(/'/g, "\\'")}')" aria-label="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                        </svg>
                    </button>
                `}
            `;
            container.appendChild(div);
        });
    });
}

// ============================================
// Edit ingredients for custom meals
// ============================================
let ingredientEditTarget = { category: null, name: null };

function openIngredientsModal(category, name) {
    ingredientEditTarget = { category, name };
    const meal = (customMeals[category] || []).find(m => m.name === name);
    const modal = document.getElementById('ingredients-modal');
    const ta = document.getElementById('edit-ingredients');
    if (ta) ta.value = (meal?.ingredients || []).join(', ');
    if (modal) modal.classList.add('active');
}

function closeIngredientsModal() {
    const modal = document.getElementById('ingredients-modal');
    if (modal) modal.classList.remove('active');
    ingredientEditTarget = { category: null, name: null };
}

function saveIngredientsEdit() {
    const { category, name } = ingredientEditTarget;
    if (!category || !name) return;
    const meal = (customMeals[category] || []).find(m => m.name === name);
    if (!meal) return;

    const ta = document.getElementById('edit-ingredients');
    const raw = (ta?.value || '').trim();
    meal.ingredients = raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];

    localStorage.setItem('customMeals', JSON.stringify(customMeals));
    closeIngredientsModal();
    renderAllMealsList();

    // If user is on grocery shopping mode, refresh the list
    if (groceryView === 'shop') {
        renderShoppingList(buildShoppingItemsForPlan());
    }

    showToast('Ingredients saved');
}

// ============================================
// ADD/DELETE MEALS - Step-by-step flow
// ============================================
let newMealData = {
    category: null,
    name: null,
    source: null,
    protein: null,
    ingredients: []
};

function openAddModal() {
    newMealData = { category: null, name: null, source: null, protein: null, ingredients: [] };
    showAddStep(1);
    document.getElementById('add-modal').classList.add('active');
}

function closeAddModal() {
    document.getElementById('add-modal').classList.remove('active');
    document.getElementById('add-name').value = '';
    const ing = document.getElementById('add-ingredients');
    if (ing) ing.value = '';
}

function showAddStep(step) {
    // Hide all steps
    document.querySelectorAll('.add-step').forEach(s => s.classList.remove('active'));
    
    // Show target step
    document.getElementById(`add-step-${step}`).classList.add('active');
    
    // Update title
    const titles = {
        1: 'What type of meal?',
        2: 'What\'s it called?',
        3: 'Who makes it?',
        4: 'Protein level?'
    };
    document.getElementById('add-step-title').textContent = titles[step];
    
    // Auto-focus input on step 2
    if (step === 2) {
        setTimeout(() => document.getElementById('add-name').focus(), 100);
    }
}

function selectCategory(category) {
    newMealData.category = category;
    showAddStep(2);
}

function nextToSource() {
    const name = document.getElementById('add-name').value.trim();
    if (!name) {
        showToast('Enter a meal name');
        return;
    }
    newMealData.name = name;
    showAddStep(3);
}

function selectSource(source) {
    newMealData.source = source;
    showAddStep(4);
}

function selectProtein(protein) {
    newMealData.protein = protein;

    const ingEl = document.getElementById('add-ingredients');
    const ingRaw = (ingEl?.value || '').trim();
    newMealData.ingredients = ingRaw
        ? ingRaw.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    
    // Create and save the meal
    const newMeal = {
        id: Date.now(),
        name: newMealData.name,
        source: newMealData.source,
        protein: newMealData.protein,
        ingredients: newMealData.ingredients
    };
    
    if (!customMeals[newMealData.category]) {
        customMeals[newMealData.category] = [];
    }
    
    customMeals[newMealData.category].push(newMeal);
    localStorage.setItem('customMeals', JSON.stringify(customMeals));
    
    closeAddModal();
    renderAllMealsList();
    showToast(`Added: ${newMealData.name}`);
}

function deleteMeal(category, name) {
    // Check if it's a custom meal
    const customIndex = (customMeals[category] || []).findIndex(m => m.name === name);
    
    if (customIndex >= 0) {
        customMeals[category].splice(customIndex, 1);
        localStorage.setItem('customMeals', JSON.stringify(customMeals));
        renderAllMealsList();
        showToast(`Deleted: ${name}`);
    } else {
        showToast('Can\'t delete built-in meals');
    }
}

// ============================================
// TOAST
// ============================================
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}
