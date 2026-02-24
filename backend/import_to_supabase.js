const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Force IPv4 to avoid connectivity issues on Windows
dns.setDefaultResultOrder('ipv4first');

// Supabase connection
const pool = new Pool({
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.qsljrajbpktbfkrfzlxf',
    password: 'Mun34626983#',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
});

const EXPORT_DIR = path.join(__dirname, 'mysql_data_export');
const SCHEMA_FILE = path.join(__dirname, '..', 'supabase_schema.sql');

// Tables in insertion order (parents before children)
const TABLES = [
    'Users',
    'Categories',
    'Products',
    'ProductImages',
    'Carts',
    'CartItems',
    'Orders',
    'OrderItems',
    'JournalEntries',
    'JournalResponses',
    'ManukatoItems'
];

function loadJSON(table) {
    const filePath = path.join(EXPORT_DIR, `${table}.json`);
    if (!fs.existsSync(filePath)) return [];
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data;
}

async function run() {
    const client = await pool.connect();

    try {
        console.log('Connected to Supabase PostgreSQL!\n');

        // ── Phase 3: Create Schema ──
        console.log('═══ PHASE 3: Creating Schema ═══');
        const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
        await client.query(schema);
        console.log('✅ Schema created successfully!\n');

        // ── Phase 4: Import Data ──
        console.log('═══ PHASE 4: Importing Data ═══');
        await client.query('BEGIN');

        for (const table of TABLES) {
            const rows = loadJSON(table);
            if (rows.length === 0) {
                console.log(`⏭️  ${table}: 0 rows (skipped)`);
                continue;
            }

            // Get column names from first row
            const columns = Object.keys(rows[0]);
            const colNames = columns.map(c => `"${c}"`).join(', ');

            let inserted = 0;
            for (const row of rows) {
                const values = columns.map((_, i) => `$${i + 1}`).join(', ');
                const params = columns.map(c => {
                    const val = row[c];
                    // Convert JS objects to JSON string for JSONB columns
                    if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
                        return JSON.stringify(val);
                    }
                    return val;
                });

                await client.query(
                    `INSERT INTO "${table}" (${colNames}) VALUES (${values})`,
                    params
                );
                inserted++;
            }

            // Reset the identity sequence to max(id) + 1
            await client.query(`
                SELECT setval(
                    pg_get_serial_sequence('"${table}"', 'id'),
                    COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1,
                    false
                )
            `);

            console.log(`✅ ${table}: ${inserted} rows imported`);
        }

        await client.query('COMMIT');
        console.log('\n🎉 Migration complete! All data imported to Supabase.');

        // ── Verify ──
        console.log('\n═══ VERIFICATION ═══');
        for (const table of TABLES) {
            const res = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
            console.log(`   ${table}: ${res.rows[0].count} rows in Supabase`);
        }

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n❌ Error:', error.message);
        console.error('Transaction rolled back — no data was written.');
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
        process.exit(0);
    }
}

run();
