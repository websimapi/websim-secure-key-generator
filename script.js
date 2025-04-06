import JSEncrypt from 'jsencrypt';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const generateBtn = document.getElementById('generate-btn');
    const keySizeSelect = document.getElementById('key-size');
    const keysSection = document.getElementById('keys-section');
    const publicKeyTextarea = document.getElementById('public-key');
    const privateKeyTextarea = document.getElementById('private-key');
    const downloadPublicBtn = document.getElementById('download-public');
    const downloadPrivateBtn = document.getElementById('download-private');
    const copyPublicBtn = document.getElementById('copy-public');
    const copyPrivateBtn = document.getElementById('copy-private');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Generate key pair when button is clicked
    generateBtn.addEventListener('click', async () => {
        const keySize = parseInt(keySizeSelect.value);
        
        // Show loading spinner
        loadingSpinner.style.display = 'block';
        generateBtn.disabled = true;
        
        // Use setTimeout to allow the UI to update before starting the CPU-intensive key generation
        setTimeout(() => {
            generateKeyPair(keySize)
                .then(keyPair => {
                    publicKeyTextarea.value = keyPair.publicKey;
                    privateKeyTextarea.value = keyPair.privateKey;
                    keysSection.classList.remove('hidden');
                    loadingSpinner.style.display = 'none';
                    generateBtn.disabled = false;
                })
                .catch(error => {
                    console.error('Error generating keys:', error);
                    alert('Error generating keys. Please try again.');
                    loadingSpinner.style.display = 'none';
                    generateBtn.disabled = false;
                });
        }, 100);
    });

    // Download buttons
    downloadPublicBtn.addEventListener('click', () => {
        downloadKey(publicKeyTextarea.value, 'public_key.pem');
    });

    downloadPrivateBtn.addEventListener('click', () => {
        downloadKey(privateKeyTextarea.value, 'private_key.pem');
    });

    // Copy buttons
    copyPublicBtn.addEventListener('click', () => {
        copyToClipboard(publicKeyTextarea);
        showCopyNotification(copyPublicBtn);
    });

    copyPrivateBtn.addEventListener('click', () => {
        copyToClipboard(privateKeyTextarea);
        showCopyNotification(copyPrivateBtn);
    });
});

/**
 * Generate RSA key pair using JSEncrypt
 * @param {number} keySize - Key size in bits (1024, 2048, 4096)
 * @returns {Promise<Object>} - Object containing public and private keys
 */
function generateKeyPair(keySize) {
    return new Promise((resolve, reject) => {
        try {
            const crypt = new JSEncrypt({default_key_size: keySize.toString()});
            crypt.getKey();
            
            resolve({
                publicKey: crypt.getPublicKey(),
                privateKey: crypt.getPrivateKey()
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Download key as a text file
 * @param {string} key - The key content
 * @param {string} filename - Name of the file to download
 */
function downloadKey(key, filename) {
    const blob = new Blob([key], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

/**
 * Copy textarea content to clipboard
 * @param {HTMLTextAreaElement} textarea - The textarea element to copy from
 */
function copyToClipboard(textarea) {
    textarea.select();
    document.execCommand('copy');
    // Deselect the text
    window.getSelection().removeAllRanges();
}

/**
 * Show a temporary notification when text is copied
 * @param {HTMLButtonElement} button - The button that was clicked
 */
function showCopyNotification(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.backgroundColor = '#34a853';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 1500);
}

