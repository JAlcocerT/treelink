// DOM Elements
const form = document.getElementById('configForm');
const profilePictureInput = document.getElementById('profile_picture');
const previewImage = document.getElementById('preview');
const reviewAvatar = document.getElementById('review-avatar');
const reviewName = document.getElementById('review-name');
const reviewBio = document.getElementById('review-bio');
const reviewUrl = document.getElementById('review-url');
const reviewSocialLinks = document.getElementById('review-social-links');
const reviewCustomLinks = document.getElementById('review-custom-links');
const addSocialLinkBtn = document.getElementById('addSocialLink');
const addCustomLinkBtn = document.getElementById('addCustomLink');

// Social media icons mapping
const socialIcons = {
    'github': 'fab fa-github',
    'twitter': 'fab fa-twitter',
    'linkedin': 'fab fa-linkedin',
    'instagram': 'fab fa-instagram',
    'facebook': 'fab fa-facebook',
    'youtube': 'fab fa-youtube',
    'tiktok': 'fab fa-tiktok',
    'twitch': 'fab fa-twitch',
    'discord': 'fab fa-discord',
    'reddit': 'fab fa-reddit',
    'spotify': 'fab fa-spotify',
    'apple': 'fab fa-apple',
    'link': 'fas fa-link'
};

// Current step tracking
let currentStep = 1;
const totalSteps = 4;

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
    // Add first social link by default
    addSocialLink();
    
    // Add first custom link by default
    addCustomLink();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize form validation
    initializeValidation();
});

// Set up event listeners
function setupEventListeners() {
    // Profile picture preview
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', handleImageUpload);
    }
    
    // Add social link button
    if (addSocialLinkBtn) {
        addSocialLinkBtn.addEventListener('click', addSocialLink);
    }
    
    // Add custom link button
    if (addCustomLinkBtn) {
        addCustomLinkBtn.addEventListener('click', addCustomLink);
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Real-time form updates for review
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', updateReview);
    });
    
    // Handle remove social link buttons (delegated event)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-social-link')) {
            e.preventDefault();
            const linkContainer = e.target.closest('.social-link');
            if (linkContainer) {
                linkContainer.remove();
                updateReview();
            }
        }
        
        // Handle remove custom link buttons
        if (e.target.closest('.remove-custom-link')) {
            e.preventDefault();
            const linkContainer = e.target.closest('.custom-link');
            if (linkContainer) {
                linkContainer.remove();
                updateReview();
            }
        }
    });
}

// Handle image upload and preview
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        previewImage.src = event.target.result;
        if (reviewAvatar) {
            reviewAvatar.src = event.target.result;
        }
    };
    reader.readAsDataURL(file);
}

// Add a new social link field
function addSocialLink() {
    const container = document.getElementById('socialLinksContainer');
    const template = document.getElementById('socialLinkTemplate');
    
    if (!container || !template) return;
    
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
    
    // Add event listeners to the new fields
    const newInputs = container.lastElementChild.querySelectorAll('input, select');
    newInputs.forEach(input => {
        input.addEventListener('input', updateReview);
    });
    
    updateReview();
}

// Add a new custom link field
function addCustomLink() {
    const container = document.getElementById('customLinksContainer');
    const template = document.getElementById('customLinkTemplate');
    
    if (!container || !template) return;
    
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
    
    // Add event listeners to the new fields
    const newInputs = container.lastElementChild.querySelectorAll('input');
    newInputs.forEach(input => {
        input.addEventListener('input', updateReview);
    });
    
    updateReview();
}

// Update the review section with current form data
function updateReview() {
    // Update profile info
    if (reviewName) reviewName.textContent = document.getElementById('name')?.value || 'Not provided';
    if (reviewBio) reviewBio.textContent = document.getElementById('bio')?.value || 'Not provided';
    if (reviewUrl) {
        const url = document.getElementById('url')?.value;
        reviewUrl.textContent = url || 'Not provided';
        if (url) {
            reviewUrl.href = url;
            reviewUrl.target = '_blank';
        }
    }
    
    // Update social links
    if (reviewSocialLinks) {
        const socialLinks = Array.from(document.querySelectorAll('.social-link'));
        
        if (socialLinks.length === 0) {
            reviewSocialLinks.innerHTML = '<p class="text-gray-500 italic">No social links added</p>';
        } else {
            reviewSocialLinks.innerHTML = '';
            
            socialLinks.forEach(link => {
                const platform = link.querySelector('select')?.value || 'link';
                const url = link.querySelector('input[type="url"]')?.value || '';
                
                if (url) {
                    const linkElement = document.createElement('a');
                    linkElement.href = url;
                    linkElement.target = '_blank';
                    linkElement.className = 'flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors';
                    
                    const iconClass = socialIcons[platform] || 'fas fa-link';
                    
                    linkElement.innerHTML = `
                        <i class="${iconClass} w-5 text-center text-gray-700"></i>
                        <span class="text-gray-700">${url}</span>
                    `;
                    
                    reviewSocialLinks.appendChild(linkElement);
                }
            });
            
            if (reviewSocialLinks.children.length === 0) {
                reviewSocialLinks.innerHTML = '<p class="text-gray-500 italic">No valid social links added</p>';
            }
        }
    }
    
    // Update custom links
    if (reviewCustomLinks) {
        const customLinks = Array.from(document.querySelectorAll('.custom-link'));
        
        if (customLinks.length === 0) {
            reviewCustomLinks.innerHTML = '<p class="text-gray-500 italic">No custom links added</p>';
        } else {
            reviewCustomLinks.innerHTML = '';
            
            customLinks.forEach(link => {
                const title = link.querySelector('input[type="text"]')?.value || 'Untitled';
                const url = link.querySelector('input[type="url"]')?.value || '';
                
                if (url) {
                    const linkElement = document.createElement('a');
                    linkElement.href = url;
                    linkElement.target = '_blank';
                    linkElement.className = 'block p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors';
                    
                    linkElement.innerHTML = `
                        <div class="font-medium text-gray-900">${title}</div>
                        <div class="text-sm text-gray-500 truncate">${url}</div>
                    `;
                    
                    reviewCustomLinks.appendChild(linkElement);
                }
            });
            
            if (reviewCustomLinks.children.length === 0) {
                reviewCustomLinks.innerHTML = '<p class="text-gray-500 italic">No valid custom links added</p>';
            }
        }
    }
}

// Form validation
function initializeValidation() {
    if (!form) return;
    
    // Add validation to required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('invalid', (e) => {
            e.preventDefault();
            showError(field, 'This field is required');
        });
        
        field.addEventListener('input', () => {
            if (field.validity.valid) {
                clearError(field);
            }
        });
    });
    
    // Custom URL validation
    const urlFields = form.querySelectorAll('input[type="url"]');
    urlFields.forEach(field => {
        field.addEventListener('blur', () => {
            if (field.value && !isValidUrl(field.value)) {
                showError(field, 'Please enter a valid URL (include http:// or https://)');
            }
        });
    });
}

// Show error message for a field
function showError(field, message) {
    clearError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mt-1 text-sm text-red-600';
    errorDiv.textContent = message;
    
    field.classList.add('border-red-500');
    field.classList.remove('border-gray-300');
    
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

// Clear error message for a field
function clearError(field) {
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.className.includes('text-red-600')) {
        errorDiv.remove();
    }
    
    field.classList.remove('border-red-500');
    field.classList.add('border-gray-300');
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    if (!isValid) {
        // Scroll to the first error
        const firstError = form.querySelector('.border-red-500');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating...';
    
    try {
        const formData = new FormData(form);
        
        // Send form data to server
        const response = await fetch('/generate', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Get the zip file as a blob
        const blob = await response.blob();
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'site-config.zip';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        showToast('Configuration generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred while generating the configuration.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Validate the entire form
function validateForm() {
    if (!form) return false;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'url' && !isValidUrl(field.value)) {
            showError(field, 'Please enter a valid URL (include http:// or https://)');
            isValid = false;
        }
    });
    
    return isValid;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}

// Navigation between steps
function nextStep(step) {
    // Validate current step before proceeding
    if (step > currentStep) {
        const currentStepElement = document.querySelector(`.step-content[data-step="${currentStep}"]`);
        if (!currentStepElement) return;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isCurrentStepValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isCurrentStepValid = false;
            } else if (field.type === 'url' && field.value && !isValidUrl(field.value)) {
                showError(field, 'Please enter a valid URL (include http:// or https://)');
                isCurrentStepValid = false;
            }
        });
        
        if (!isCurrentStepValid) {
            // Scroll to the first error
            const firstError = currentStepElement.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
    }
    
    // Hide current step
    const currentStepElement = document.querySelector(`.step-content[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('hidden');
    }
    
    // Show next step
    const nextStepElement = document.querySelector(`.step-content[data-step="${step}"]`);
    if (nextStepElement) {
        nextStepElement.classList.remove('hidden');
    }
    
    // Update step indicators
    updateStepIndicators(step);
    
    // Update current step
    currentStep = step;
    
    // Update review section when reaching the review step
    if (step === 4) {
        updateReview();
    }
    
    // Scroll to top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    // Hide current step
    const currentStepElement = document.querySelector(`.step-content[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('hidden');
    }
    
    // Show previous step
    const prevStepElement = document.querySelector(`.step-content[data-step="${step}"]`);
    if (prevStepElement) {
        prevStepElement.classList.remove('hidden');
    }
    
    // Update step indicators
    updateStepIndicators(step);
    
    // Update current step
    currentStep = step;
    
    // Scroll to top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update step indicators
function updateStepIndicators(activeStep) {
    // Reset all steps
    document.querySelectorAll('.step-item').forEach((item, index) => {
        const stepNumber = parseInt(item.getAttribute('data-step'));
        
        // Reset all steps after the active step
        if (stepNumber > activeStep) {
            item.classList.remove('active', 'completed');
        } 
        // Mark current step as active
        else if (stepNumber === activeStep) {
            item.classList.add('active');
            item.classList.remove('completed');
        } 
        // Mark previous steps as completed
        else {
            item.classList.remove('active');
            item.classList.add('completed');
        }
    });
}

// Expose functions to global scope for inline event handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
