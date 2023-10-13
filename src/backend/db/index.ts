import { createClient, SupabaseClient } from '@supabase/supabase-js'

class DB {
    supabase: SupabaseClient;
    supabaseKey = process.env.SUPABASE_KEY
    constructor() {
        this.supabase = createClient('https://vbjvqbzjarritowmmwqm.supabase.co', this.supabaseKey);
    }

    init() {
        console.log("Connected to Supabase")
    }
}

export default DB;
