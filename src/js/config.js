// ===========================================
// CONFIGURATION
// ===========================================

// ===== SUPABASE =====
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tsrrewlcoyjjvlwczplt.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_FS1tlXXumCwmuldS43kSAQ_h9gyinyn";

export const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===========================================
// APPLICATION STATE
// ===========================================

export const state = {
    people: [],
    meals: [],
    additionalDebts: [],
    editMealIndex: null,
    defaultNames: [
        "Allysa",
        "AC",
        "Renz",
        "Ariel",
        "Harish"
    ]
};

window.state = state;
window.supabaseClient = supabaseClient;
