document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('filters')
        
        const petCards = document.querySelectorAll('.pet-card');
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const breedFilter = document.getElementById('breedFilter');
        const ageFilter = document.getElementById('ageFilter');
        const sizeFilter = document.getElementById('sizeFilter');
        const genderFilter = document.getElementById('genderFilter');
        const locationFilter = document.getElementById('locationFilter');

        console.log('petCards', petCards);

        let filters = {
            type: '',
            breed: '',
            age: '',
            size: '',
            gender: '',
            location: ''
        };

        function applyFilters() {
            petCards.forEach(card => {
                const matchesType = !filters.type || card.getAttribute('data-type') === filters.type;
                const matchesBreed = !filters.breed || card.getAttribute('data-breed').toLowerCase() === filters.breed;
                const matchesAge = !filters.age || card.getAttribute('data-age') === filters.age;
                const matchesSize = !filters.size || card.getAttribute('data-size') === filters.size;
                const matchesGender = !filters.gender || card.getAttribute('data-gender') === filters.gender;
                const matchesLocation = !filters.location || card.getAttribute('data-location').toLowerCase().includes(filters.location.toLowerCase());
                const matchesSearch = card.querySelector('h3').textContent.toLowerCase().includes(searchInput.value.toLowerCase());

                if (matchesType && matchesBreed && matchesAge && matchesSize && matchesGender && matchesLocation && matchesSearch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Event listeners for dropdowns
        typeFilter.addEventListener('change', () => {
            filters.type = typeFilter.value;
            applyFilters();
        });

        breedFilter.addEventListener('change', () => {
            filters.breed = breedFilter.value;
            applyFilters();
        });

        ageFilter.addEventListener('change', () => {
            filters.age = ageFilter.value;
            applyFilters();
        });

        sizeFilter.addEventListener('change', () => {
            filters.size = sizeFilter.value;
            applyFilters();
        });

        genderFilter.addEventListener('change', () => {
            filters.gender = genderFilter.value;
            applyFilters();
        });

        locationFilter.addEventListener('input', () => {
            filters.location = locationFilter.value;
            applyFilters();
        });

        // Event listener for search input
        searchInput.addEventListener('input', applyFilters);
        // Event listener for pet cards to navigate to individual profile pages
        // petCards.forEach(card => {
        //     card.addEventListener('click', (event) => {
        //         event.preventDefault(); // Prevent default <a> behavior
        //         const petName = card.querySelector('h3').textContent.trim().toLowerCase().replace(/\s+/g, '-');
        //         const profileUrl = `profiles/profile-${petName}.html`; // Assuming profiles are in 'profiles/' folder
        //         window.location.href = profileUrl;
        //     });
        // });

    }, 2000)
});

$(document).ready(function () {
    verifyAuthentication();
    initForms();
    initEventListeners();
    handleAdminDashboard();
    renderPetsList();
    renderSinglePet();
});

const API_URL = 'http://localhost:5000/api';

const publicPages = [
    { name: 'login', url: 'Log-In.html' },
    { name: 'register', url: 'register.html' },
    { name: 'contact', url: 'Contact-us.html' },
    { name: 'volunteer', url: 'Volunteer.html' },
    { name: 'volunteerForm', url: 'Volunteer-Form.html' },
    { name: 'about', url: 'About-us.html' },
    { name: 'donate', url: 'Donate.html' }
]

const authPages = [
    { name: 'homeAdmin', url: 'HomePageAdmin.html' },
    { name: 'home', url: 'Home.html' },
    { name: 'volunteer', url: 'Volunteer.html' },
    { name: 'postPet', url: 'postPet.html' },
    { name: 'logout', url: 'logout.html' },
    { name: 'donateDone', url: 'donateDone.html' },
    { name: 'emailConfirmation', url: 'Email-confirmation.html' },
    { name: 'pets', url: 'Browse-pets.html' }
    
]

function initForms() {

    // Login
    $('#loginForm').on('submit', function(e) {
      e.preventDefault();
      const username = $('#loginUsername').val();
      const password = $('#loginPassword').val();
    
      $.ajax({
        url: `${API_URL}/auth/login`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: (response) => {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('role', response.role || 'user');
            const role = response.role || 'user';
            role === 'admin' ? navigateToPage('homeAdmin') : navigateToPage('home');
        },
        error: (xhr) => alert(xhr.responseJSON.error),
      });
    });

    // Register
    $('#registerForm').on('submit', function(e) {
      e.preventDefault();
      const username = $('#registerUsername').val();
      const password = $('#registerPassword').val();
      const role = localStorage.getItem('register') || 'user';
    
      $.ajax({
        url: `${API_URL}/auth/register`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password, role }),
        success: (response) => {
            alert(`${response.message}`)},
        error: (xhr) => alert(xhr.responseJSON.message),
      });
      $('#registerForm').trigger('reset');
    });

    // Volunteer form
    $('#volunteerForm').on('submit', function(e) {
        e.preventDefault();
        const name = $('#volunteerName').val() || 'Anonymous';
        const phone = $('#volunteerPhone').val() || 'N/A';
        const email = $('#volunteerEmail').val() || 'N/A';
        const skills = $('#volunteerSkills').val() || 'N/A';
        const availability1 = $('#volunteerAvailability1').val() || 'N/A';
        const availability2 = $('#volunteerAvailability2').val() || 'N/A';
        const availability3 = $('#volunteerAvailability3').val() || 'N/A';
        const type = localStorage.getItem('volunteerType') || 'carer';
        
        $.ajax({
            url: `${API_URL}/form/volunteer`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name, phone, email, skills, availability1, availability2, availability3, type }),
            success: (response) => alert(`${response.message}, ID: ${response._id}`),
            error: (xhr) => alert(xhr.responseJSON.message),
        });
        $('#volunteerForm').trigger('reset');
    });

    // Donation form
    $('#donationForm').on('submit', function(e) {
        e.preventDefault();
        const donationAmount = $('#donationAmount').val() || 0;
        const cardName = $('#name-card').val() || 'N/A';
        const cardNumber = $('#card-number').val() || 'N/A';
        const cardExpirationMonth = $('#card-expiration-month').val() || 'N/A';
        const cardExpirationYear = $('#card-expiration-year').val() || 'N/A';
        const cvc = $('#card-cvc').val() || 'N/A';
        
        $.ajax({
            url: `${API_URL}/form/donate`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ donationAmount, cardName, cardNumber, cardExpirationMonth, cardExpirationYear, cvc }),
            success: (response) => {
                window.location.href = authPages.find(page => page.name === 'donateDone').url;
            },
            error: (xhr) => alert(xhr.responseJSON.message),
        });
        $('#donationForm').trigger('reset');
    });

    //Contact form
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        const contactName = $('#contactName').val() || 'Anonymous';
        const contactEmail = $('#contactEmail').val() || 'N/A';
        const contactMessage = $('#contactMessage').val() || 'N/A';
        
        $.ajax({
            url: `${API_URL}/form/contact`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ contactName, contactEmail, contactMessage }),
            success: (response) => {
                window.location.href = authPages.find(page => page.name === 'emailConfirmation').url;
            },
            error: (xhr) => alert(xhr.responseJSON.message),
        });
        $('#contactForm').trigger('reset');
    });

    //Adoption form
    $('#adoptionForm').on('submit', function(e) {
        e.preventDefault();
        const fullName = $('#full-name').val() || 'Anonymous';
        const email = $('#email').val() || 'N/A';
        const phone = $('#phone').val() || 'N/A';
        const address = $('#address').val() || 'N/A';
        const houseSize = $('#house-size').val() || 'N/A';
        const haveYard = $('#haveYard').prop('checked') || false;
        const haveOtherPet = $('#haveOtherPet').prop('checked') || false;
        const environmentDescription = $('#environment-description').val() || 'N/A';
        const adoptionReason = $('#adoption-reason').val() || 'N/A';
        const agreePolicies = $('#agreePolicies').prop('checked') || false;
        const confirmAccurate = $('#confirmAccurate').prop('checked') || false;

        if (!agreePolicies || !confirmAccurate) {
            alert('Please agree to the policies and confirm the accuracy of your information');
            return;
        }
        
        $.ajax({
            url: `${API_URL}/form/adopt`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ fullName, email, phone, address, houseSize, haveYard, haveOtherPet, environmentDescription, adoptionReason }),
            success: (response) => {
        
                //window.location.href = authPages.find(page => page.name === 'pets').url;
                window.location.href = 'Email-confirmation.html';
 
               
            },
            error: (xhr) => alert(xhr.responseJSON.message),
        });
        $('#adoptionForm').trigger('reset');
    });

    // Post pet form
    $('#postPetForm').on('submit', function (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', $('#name').val() || 'Anonymous');
        formData.append('type', $('#type').val() || 'Animal');
        formData.append('othertype', $('#other-type-input').val() || 'N/A');
        formData.append('breed', $('#breed').val() || 'Breed');
        formData.append('age', $('#age').val() || 'Young');
        formData.append('size', $('#size').val() || 'Medium');
        formData.append('gender', $('#gender').val() || 'Female');
        formData.append('location', $('#location').val() || 'Texas');
        formData.append('price', $('#price').val() || '350');
        formData.append('description', $('#description').val() || 'Lorem ipsum dollar');
    
        const fileInput = $('#picture')[0];
        if (fileInput.files.length > 0) {
            formData.append('picture', fileInput.files[0]);
        }
    
        $.ajax({
            url: `${API_URL}/pet`,
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            processData: false,
            contentType: false,
            data: formData,
            success: (response) => alert(`Pet added successfully, ID: ${response.id}`),
            error: (xhr) => alert(xhr.responseJSON.message),
        });
    
        $('#postPetForm').trigger('reset');
    });
}

function initEventListeners() {
    $("#registerUserCTA").on("click", function() {
        localStorage.setItem("register", "user");
    });

    $("#registerAdminCTA").on("click", function() {
        localStorage.setItem("register", "admin");
    });

    $("#volunteerTransporterCTA").on("click", function() {
        localStorage.setItem("volunteerType", "transporter");
    });

    $("#volunteerCarerCTA").on("click", function() {
        localStorage.setItem("volunteerType", "carer");
    });
}

function verifyAuthentication() {
    const token = localStorage.getItem('authToken');

    if (window.location.href.includes(publicPages.find(page => page.name === 'login').url)) {
        if (!token) return;
        const role = localStorage.getItem('role');
        role === 'admin' ? navigateToPage('homeAdmin') : navigateToPage('home');
    }

    if (publicPages.some(page => window.location.href.includes(page.url))) return;

    if (!token) {
        window.location.href = publicPages.find(page => page.name === 'login').url;
        return;
    }

    // Verify token with the backend
    $.ajax({
        url: `${API_URL}/auth/verify-token`,
        type: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        success: function (response) {
            if (window.location.href.includes('HomePageAdmin.html') && response.role !== 'admin') {
                window.location.href = publicPages.find(page => page.name === 'login').url;
                alert('You are not authorized to view that page');
            }
        },
        error: function () {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('authToken');
            window.location.href = publicPages.find(page => page.name === 'login').url;
        },
    });
}

function navigateToPage(name) {
    const page = [...publicPages, ...authPages].find(page => page.name === name);
    if (page) window.location.href = page.url;
}

function handleAdminDashboard() {
    const role = localStorage.getItem('role');
    if (role === 'admin' && window.location.href.includes('Home.html')) window.location.href = 'HomePageAdmin.html';
    if (!window.location.href.includes('HomePageAdmin.html')) return
    renderAdoptionRequests()
    renderDonationSubmissions()
    renderAdminPets();
}

function renderAdoptionRequests() {
    $.ajax({
        url: `${API_URL}/form/adopt`,
        type: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        success: function (response) {
            const requestsContainer = $('#js-adoption-requests');
            requestsContainer.empty();
            requestsContainer.append('<h3>Adoption Requests</h3>');

            if (response.results.length === 0) {
                requestsContainer.append('<p>No adoption requests found.</p>');
                return;
            }

            response.results.forEach((request) => {
                const requestHtml = `
                    <div class="adoption-request">
                        <p>Name: ${request.fullName}</p>
                        <p>Contact: ${request.phone}</p>
                        <br />
                    </div>
                `;
                requestsContainer.append(requestHtml);
            });
        },
        error: (xhr) => alert(xhr.responseJSON.message),
    });
}

function renderDonationSubmissions() {
    $.ajax({
        url: `${API_URL}/form/donate`,
        type: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        success: function (response) {
            const donationsContainer = $('#js-donation-submissions');
            donationsContainer.empty();
            donationsContainer.append('<h3>Donations</h3>');

            if (response.results.length === 0) {
                donationsContainer.append('<p>No donation found.</p>');
                return;
            }

            response.results.forEach((donation) => {
                const donationHtml = `
                    <div class="donation-submission">
                        <p>Name: ${donation.cardName}</p>
                        <p>Amount: ${donation.donationAmount} SAR</p>
                        <br />
                    </div>
                `;
                donationsContainer.append(donationHtml);
            });
        },
        error: (xhr) => alert(xhr.responseJSON.message),
    });
}

function renderAdminPets() {
    $.ajax({
        url: `${API_URL}/pet`,
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        success: function (response) {
            const petSection = $('#js-posted-pets');
            petSection.empty(); // Clear existing content
            petSection.append('<h3>Pets Posted</h3>');

            if (response.length === 0) {
                petSection.append('<p>No pets available.</p>');
                return;
            }

            response.forEach(pet => {
                const petHtml = `
                    <div class="pet-item">
                        <img src="${pet.pictureUrl || '../assets/placeholder.png'}" alt="${pet.type}" />
                        <p>Species: ${pet.type === 'other' ? pet.othertype : pet.type}</p>
                        <p>Price: ${pet.price} SAR</p>
                        <p>Age: ${pet.age}</p>
                    </div>
                    <br />
                `;
                petSection.append(petHtml);
            });
        },
        error: function (xhr) {
            alert(`Failed to load pets: ${xhr.responseJSON.message}`);
        },
    });
}

function renderPetsList() {
    if (!window.location.href.includes('Browse-pets.html') && !window.location.href.includes('Home.html')) return;

    $.ajax({
        url: `${API_URL}/pet`,
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        success: function (response) {
            const petSection = $('#js-pets-list');
            petSection.empty(); // Clear existing content

            if (response.length === 0) {
                petSection.append('<p>No pets available.</p>');
                return;
            }

            if (window.location.href.includes('Home.html')) {
                // Limit to the first two pets and use specific HTML structure
                const petsToDisplay = response.slice(0, 2);
                petsToDisplay.forEach(pet => {
                    const petHtml = `
                        <div class="pet-card" 
                             data-id="${pet._id}" 
                             data-url="profile-${pet._id}.html"
                             data-name="${pet.name}"
                             data-type="${pet.type === 'other' ? pet.othertype : pet.type}" 
                             data-breed="${pet.breed}" 
                             data-age="${pet.age}" 
                             data-size="${pet.size}" 
                             data-gender="${pet.gender}" 
                             data-location="${pet.location}">
                            <img src="${pet.pictureUrl || '../assets/placeholder.png'}" alt="${pet.type === 'other' ? pet.othertype : pet.type}">
                            <p>Species: ${pet.type === 'other' ? pet.othertype : pet.type}</p>
                            <p>Price: ${pet.price} SAR</p>
                            <p>Age: ${pet.age} years</p>
                        </div>
                    `;
                    petSection.append(petHtml);
                });
            } else {
                // For Browse-pets.html, show all pets with the standard HTML structure
                response.forEach(pet => {
                    const petHtml = `
                        <div class="pet-card" 
                             data-id="${pet._id}" 
                             data-url="profile-${pet._id}.html"
                             data-name="${pet.name}"
                             data-type="${pet.type === 'other' ? pet.othertype : pet.type}" 
                             data-breed="${pet.breed}" 
                             data-age="${pet.age}" 
                             data-size="${pet.size}" 
                             data-gender="${pet.gender}" 
                             data-location="${pet.location}">
                            <img src="${pet.pictureUrl || '../assets/placeholder.png'}" alt="${pet.type === 'other' ? pet.othertype : pet.type}" />
                            <h3>${pet.name}</h3>
                            <p>Price: ${pet.price} SAR</p>
                            <p>Age: ${pet.age}</p>
                            <span class="gender ${pet.gender}">${pet.gender === 'male' ? '♂' : '♀'}</span>
                        </div>
                    `;
                    petSection.append(petHtml);
                });
            }

            // Event listener for pet-card clicks
            $('.pet-card').on('click', function (e) {
                localStorage.setItem('petId', e.currentTarget.getAttribute('data-id'));
                window.location.href = "profiles/pet-profile.html";
            });
        },
        error: function (xhr) {
            alert(`Failed to load pets: ${xhr.responseJSON.message}`);
        },
    });
}



function renderSinglePet() {
    if (!window.location.href.includes('profiles/pet-profile.html')) return;

    $.ajax({
        url: `${API_URL}/pet/${localStorage.getItem('petId')}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        success: function (response) {
            const petSection = $('#js-single-pet');
            petSection.empty(); // Clear existing content

            if (!response) {
                petSection.append('<p>No details available.</p>');
                return;
            }

            // Constructing the pet HTML dynamically
            const petHtml = `
                <section class="profile-banner">
                    <h1>Meet ${response.name}</h1>
                </section>
            
                <section class="pet-profile">
                    <div class="profile-image">
                        <img src="${response.pictureUrl || '../../assets/placeholder.png'}" alt="${response.type === 'other' ? response.othertype : response.type}" />
                    </div>
            
                    <div class="profile-info">
                        <h2>${response.name}</h2>
                        <p><strong>Type:</strong> ${response.type === 'other' ? response.othertype : response.type}</p>
                        <p><strong>Breed:</strong> ${response.breed}</p>
                        <p><strong>Age:</strong> ${response.age}</p>
                        <p><strong>Size:</strong> ${response.size}</p>
                        <p><strong>Gender:</strong> ${response.gender}</p>
                        <p><strong>Location:</strong> ${response.location}</p>
                        <p><strong>Distance:</strong> 6 km</p>
                        <p><strong>About Bella:</strong></p>
                        <p>${response.description}</p>
                        <a href="../Adoption-form.html"><button class="adopt-button">Adopt ${response.name}</button></a>
                    </div>
                </section>
            `;

            // Append the dynamically created pet card
            petSection.append(petHtml);

            response.forEach(pet => {
            });
        },
        error: function (xhr) {
            alert(`Failed to load pets: ${xhr.responseJSON.message}`);
        },
    });

}

function logout() {
    // Clear specific keys from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('volunteerType');

    // Optionally redirect the user to the login page or homepage
    window.location.href = 'Log-In.html';
}

function checkLoginStatus() {
    // Check if the user is logged in (example: by checking authToken)
    const authToken = localStorage.getItem('authToken');

    // Get the Logout link
    const logoutLink = document.getElementById('logoutLink');

    // Show or hide the Logout link based on login status
    if (authToken) {
        logoutLink.style.display = 'inline'; // Show the link
    } else {
        logoutLink.style.display = 'none'; // Hide the link
    }
}

// Call checkLoginStatus when the page loads
window.onload = checkLoginStatus;