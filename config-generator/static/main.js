// Add icon link
function addIconLink() {
    const container = document.getElementById('iconLinksContainer');
    const template = document.getElementById('iconLinkTemplate');
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
}

// Add custom link
function addCustomLink() {
    const container = document.getElementById('customLinksContainer');
    const template = document.getElementById('customLinkTemplate');
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
}

// Handle form submission
document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    try {
        // Disable submit button
        submitButton.disabled = true;
        submitButton.innerHTML = 'Generating...';
        
        // Send form data to server
        const response = await fetch('/generate', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate configuration');
        }
        
        // Create download link for the zip file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'site-config.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        alert('Error: ' + error.message);
        console.error('Error:', error);
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = 'Generate Configuration';
    }
});

// Add initial link fields when page loads
document.addEventListener('DOMContentLoaded', () => {
    addIconLink();
    addCustomLink();
});
