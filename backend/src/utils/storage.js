const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
require('dotenv').config();

// Force IPv4 resolution for Windows compatibility with some networks
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('[Storage] Supabase URL or Anon Key is missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a file to Supabase Storage
 * @param {string} localFilePath - Path to the local file
 * @param {string} bucketName - Name of the Supabase bucket
 * @param {string} destinationPath - Path within the bucket
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
const uploadFile = async (localFilePath, bucketName, destinationPath) => {
    try {
        const fileContent = fs.readFileSync(localFilePath);
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(destinationPath, fileContent, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(destinationPath);

        return publicUrl;
    } catch (error) {
        console.error(`[Storage] Upload error for ${localFilePath}:`, error.message);
        throw error;
    }
};

/**
 * Upload a buffer to Supabase Storage
 * @param {Buffer} buffer - File buffer
 * @param {string} bucketName - Name of the Supabase bucket
 * @param {string} destinationPath - Path within the bucket
 * @param {string} contentType - Mime type
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
const uploadBuffer = async (buffer, bucketName, destinationPath, contentType) => {
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(destinationPath, buffer, {
                cacheControl: '3600',
                upsert: true,
                contentType
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(destinationPath);

        return publicUrl;
    } catch (error) {
        console.error(`[Storage] Buffer upload error:`, error.message);
        throw error;
    }
};

module.exports = { uploadFile, uploadBuffer };
