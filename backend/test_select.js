const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSelect() {
    try {
        console.log('Testing SELECT (list files) from bucket: manukato');
        const { data, error } = await supabase.storage.from('manukato').list();

        if (error) {
            console.error('❌ SELECT failed:', error.message);
            console.error('Full error:', JSON.stringify(error, null, 2));
        } else {
            console.log('✅ SELECT success! Found files:', data.length);
            console.log('File names:', data.map(f => f.name).join(', '));
        }
    } catch (err) {
        console.error('❌ Script crashed:', err.message);
    }
}

testSelect();
