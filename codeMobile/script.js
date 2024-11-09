document.addEventListener('DOMContentLoaded', () => {
    const petCards = document.querySelectorAll('.pet-card');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const breedFilter = document.getElementById('breedFilter');
    const ageFilter = document.getElementById('ageFilter');
    const sizeFilter = document.getElementById('sizeFilter');
    const genderFilter = document.getElementById('genderFilter');
    const locationFilter = document.getElementById('locationFilter');

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
            const matchesBreed = !filters.breed || card.getAttribute('data-breed') === filters.breed;
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
    petCards.forEach(card => {
        card.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default <a> behavior
            const petName = card.querySelector('h3').textContent.trim().toLowerCase().replace(/\s+/g, '-');
            const profileUrl = `profiles/profile-${petName}.html`; // Assuming profiles are in 'profiles/' folder
            window.location.href = profileUrl;
        });
    });
});
