// DOM elements
const searchbox = document.getElementById("searchbox");
const displayNameText = document.getElementById("display-name-text");
const shortnameText = document.getElementById("shortname-text");
const emailText = document.getElementById("email-text");
const contactInfo = document.getElementById("contact-info");
const nationalName = document.getElementById("national-name");
const position = document.getElementById("position");
const phone = document.getElementById("phone");
const fax = document.getElementById("fax");
const cityCountry = document.getElementById("city-country");
const globalid = document.getElementById("globalid");
const costcenter = document.getElementById("costcenter");
const company = document.getElementById("company");

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // Load last user from localStorage
  const lastUser = localStorage.getItem("lastuser");
  if (lastUser) {
    setUserData(JSON.parse(lastUser));
  }
  
  // Initialize copy functionality
  initializeCopyButtons();
});

// Search functionality
searchbox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const input = searchbox.value.trim();
    if (input.length > 0) {
      performSearch(input);
      searchbox.value = "";
    }
  }
});

searchbox.addEventListener("change", () => {
  const input = searchbox.value.trim();
  if (input.length > 0) {
    performSearch(input);
    searchbox.value = "";
  }
});

// Search logic
function performSearch(input) {
  // Show loading state
  setSearchLoading(true);
  
  let url = '';
  
  if (!isNaN(input)) {
    // Global ID search
    url = `https://employeesearchservice.voith.net/api/v1/employees/by/globalId/${input.substring(0, 6)}`;
  } else if (isEmail(input)) {
    // Email search
    url = `https://employeesearchservice.voith.net/api/v1/employees/by/email/${input}`;
  } else if (input.includes('.')) {
    // Firstname.lastname format
    const [firstname, lastname] = input.split('.');
    const email = `${firstname.trim()}.${lastname.trim()}@voith.com`;
    url = `https://employeesearchservice.voith.net/api/v1/employees/by/email/${email}`;
  } else if (input.includes(',')) {
    // Lastname, firstname format
    const [lastname, firstname] = input.split(',');
    const email = `${firstname.trim()}.${lastname.trim()}@voith.com`;
    url = `https://employeesearchservice.voith.net/api/v1/employees/by/email/${email}`;
  } else {
    // Short name search
    url = `https://employeesearchservice.voith.net/api/v1/employees/by/shortname/${input}`;
  }
  
  fetch(url)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('User not found');
      }
    })
    .then(data => {
      setUserData(data);
    })
    .catch(error => {
      console.log('API error, using fake data:', error);
      // Use fake data on error
      const fakeUser = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        firstnameNational: "白",
        lastnameNational: "李",
        position: "OTO Consultant",
        shortname: faker.name.suffix(),
        logonname: faker.internet.email(),
        communications: [
          { type: 'Phone', value: faker.phone.phoneNumber() },
          { type: 'Mobile', value: faker.phone.phoneNumber() }
        ],
        city: faker.address.city(),
        country: faker.address.country(),
        globalIdNumber: faker.datatype.number(),
        costCentre: faker.datatype.number(),
        companyShortCut: faker.company.companySuffix()
      };
      setUserData(fakeUser);
    })
    .finally(() => {
      // Hide loading state
      setSearchLoading(false);
    });
}

// Set user data
function setUserData(user) {
  // Update display name and shortname
  displayNameText.textContent = `${user.firstname}, ${user.lastname}`;
  shortnameText.textContent = user.shortname;
  emailText.textContent = user.logonname;
  
  // Update contact information with individual fields
  // National name
  if (user.firstnameNational && user.lastnameNational) {
    nationalName.textContent = `${user.lastnameNational}, ${user.firstnameNational}`;
  } else {
    nationalName.textContent = `${user.firstname} ${user.lastname}`;
  }
  
  // Position
  if (user.position) {
    position.textContent = user.position;
  } else {
    position.textContent = "Not specified";
  }
  
  // Phone (landline) and Fax (show mobile instead)
  let phoneNumber = null;
  let mobileNumber = null;

  if (Array.isArray(user.communications)) {
    user.communications.forEach(comm => {
      const type = String(comm.type || '').toLowerCase();
      if (type === 'phone' && !phoneNumber) {
        phoneNumber = comm.value;
      }
      if (type === 'mobile' && !mobileNumber) {
        mobileNumber = comm.value;
      }
      // Intentionally ignore real 'fax' per requirement
    });
  }

  // Prefer landline for Phone; fall back to mobile
  phone.textContent = phoneNumber || mobileNumber || "Not specified";
  // Show Mobile number in Fax field; fall back to phone
  fax.textContent = mobileNumber || phoneNumber || "Not specified";
  
  // City and Country
  if (user.city && user.country) {
    cityCountry.textContent = `${user.city}, ${user.country}`;
  } else {
    cityCountry.textContent = "Not specified";
  }
  
  // Update stats
  globalid.textContent = user.globalIdNumber;
  costcenter.textContent = user.costCentre;
  company.textContent = user.companyShortCut;
  
  // Save to localStorage
  localStorage.setItem("lastuser", JSON.stringify(user));
}

// Email validation
function isEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Copy functionality with native JS
function initializeCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const targetId = button.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const textToCopy = targetElement.textContent.trim();
        
        // Use modern clipboard API if available, fallback to older method
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyFeedback(button);
          }).catch(err => {
            console.error('Failed to copy with clipboard API:', err);
            fallbackCopy(textToCopy, button);
          });
        } else {
          fallbackCopy(textToCopy, button);
        }
      }
    });
  });
}

// Fallback copy method for older browsers
function fallbackCopy(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopyFeedback(button);
  } catch (err) {
    console.error('Failed to copy:', err);
  } finally {
    textArea.remove();
  }
}

// Show copy success feedback
function showCopyFeedback(button) {
  // Remove any existing success indicator
  const existingIndicator = button.querySelector('.copy-success-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Create success indicator
  const successIndicator = document.createElement('div');
  successIndicator.className = 'copy-success-indicator';
  successIndicator.textContent = '✓';
  
  // Add to button
  button.appendChild(successIndicator);
  
  // Show the indicator
  setTimeout(() => {
    successIndicator.style.opacity = '1';
  }, 10);
  
  // Hide and remove after 2 seconds
  setTimeout(() => {
    successIndicator.style.opacity = '0';
    setTimeout(() => {
      if (successIndicator.parentNode) {
        successIndicator.remove();
      }
    }, 300);
  }, 2000);
}

// Control search loading state
function setSearchLoading(isLoading) {
  const searchBox = document.getElementById('searchbox');
  
  if (isLoading) {
    searchBox.classList.add('search-loading');
    searchBox.disabled = true;
    searchBox.placeholder = 'Searching...';
  } else {
    searchBox.classList.remove('search-loading');
    searchBox.disabled = false;
    searchBox.placeholder = 'Enter global ID, email, or short name';
  }
}