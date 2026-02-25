const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
    try {
        console.log('Checking bucket: manukato');
        const { data, error } = await supabase.storage.getBucket('manukato');

        if (error) {
            console.error('❌ Error getting bucket info:');
            console.error(JSON.stringify(error, null, 2));

            console.log('\n--- Listing all buckets ---');
            const { data: buckets, error: listError } = await supabase.storage.listBuckets();
            if (listError) {
                console.error('❌ Error listing buckets:', listError.message);
            } else {
                console.log('Available buckets:', buckets.map(b => b.name).join(', '));
            }
        } else {
            console.log('✅ Bucket exists:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('❌ Script failed:', err.message);
    }
}

checkBucket();
