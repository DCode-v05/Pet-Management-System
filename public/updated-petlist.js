document.addEventListener('DOMContentLoaded', function() {
    const petGrid = document.getElementById('pet-grid');
    const searchParams = new URLSearchParams(window.location.search);
    const petId = searchParams.get('id');
    
    function fetchPets() {
        const endpoint = petId ? `/api/pets/${petId}` : '/api/pets';
        
        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                petGrid.innerHTML = '';
                
                const pets = Array.isArray(data) ? data : [data];
                
                if (pets.length === 0) {
                    displayNoPetsMessage();
                    return;
                }
                
                pets.forEach(pet => {
                    const petCard = createPetCard(pet);
                    petGrid.appendChild(petCard);
                });
                
                if (petId) {
                    updateHeaderForSinglePet();
                }
            })
            .catch(error => {
                console.error('Error fetching pets:', error);
                displayErrorMessage(petId ? 'Pet not found' : 'Error loading pets');
            });
    }
    
    function displayNoPetsMessage() {
        petGrid.innerHTML = `
            <div class="pr-no-pets">
                <i class="fas fa-paw fa-3x" style="color: #ccc; margin-bottom: 15px;"></i>
                <h3>No pets registered yet</h3>
                <p>Be the first to add your pet to our registry!</p>
                <a href="entry.html" class="pr-return-btn">
                    <i class="fas fa-plus-circle"></i> Register a Pet
                </a>
            </div>
        `;
    }
    
    function displayErrorMessage(message) {
        petGrid.innerHTML = `
            <div class="pr-no-pets">
                <i class="fas fa-exclamation-triangle fa-3x" style="color: #e74c3c; margin-bottom: 15px;"></i>
                <h3>${message}</h3>
                <p>${petId ? `We couldn't find a pet with ID: ${petId}` : 'There was a problem loading the pet registry. Please try again later.'}</p>
                <a href="petlist.html" class="pr-return-btn">
                    <i class="fas fa-list"></i> View All Pets
                </a>
            </div>
        `;
    }
    
    function updateHeaderForSinglePet() {
        const sectionHeader = document.querySelector('.pr-section-header');
        if (sectionHeader) {
            sectionHeader.querySelector('h2').textContent = '🐾 Pet Details';
            sectionHeader.querySelector('p').textContent = 'Viewing details for the selected pet';
        }
    }
    
    function createPetCard(pet) {
        const card = document.createElement('div');
        card.className = 'pr-pet-card';
        
        const photoSrc = pet.photo || 'https://via.placeholder.com/300x200?text=No+Photo';
        
        const description = pet.description || 'No description available';
        
        if (petId) {
            card.className = 'pr-pet-card pr-pet-single';
            card.innerHTML = `
                <img src="${photoSrc}" alt="${pet.species} - ${pet.breed}" class="pr-pet-image">
                <div class="pr-pet-details">
                    <h3 class="pr-pet-name">${pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}</h3>
                    <p class="pr-pet-breed">${pet.breed || 'Unknown breed'}</p>
                    
                    <div class="pr-pet-info-grid">
                        <div class="pr-pet-info-item">
                            <i class="fas fa-id-card"></i>
                            <span>ID: ${pet.id || '02'}</span>
                        </div>
                        
                        <div class="pr-pet-info-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Age: ${pet.age || '10'}</span>
                        </div>
                        
                        ${pet.color ? `
                            <div class="pr-pet-info-item">
                                <i class="fas fa-palette"></i>
                                <span>Color: ${pet.color}</span>
                            </div>
                        ` : ''}
                        
                        ${pet.weight ? `
                            <div class="pr-pet-info-item">
                                <i class="fas fa-weight"></i>
                                <span>Weight: ${pet.weight}</span>
                            </div>
                        ` : ''}
                        
                        ${pet.owner ? `
                            <div class="pr-pet-info-item">
                                <i class="fas fa-user"></i>
                                <span>Owner: ${pet.owner}</span>
                            </div>
                        ` : ''}
                        
                        ${pet.contact ? `
                            <div class="pr-pet-info-item">
                                <i class="fas fa-phone"></i>
                                <span>Contact: ${pet.contact}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <h4 class="pr-pet-desc-title">Description</h4>
                    <p class="pr-pet-description">${description}</p>
                    
                    ${pet.location ? `
                        <div class="pr-pet-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${pet.location}</span>
                        </div>
                    ` : ''}
                    
                    <div class="pr-pet-actions">
                        <a href="petlist.html" class="pr-back-btn">
                            <i class="fas fa-arrow-left"></i> Back to All Pets
                        </a>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <img src="${photoSrc}" alt="${pet.species} - ${pet.breed}" class="pr-pet-image">
                <div class="pr-pet-details">
                    <h3 class="pr-pet-name">${pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}</h3>
                    <p class="pr-pet-breed">${pet.breed || 'Unknown breed'}</p>
                    <p class="pr-pet-description">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
                    ${pet.location ? `
                        <div class="pr-pet-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${pet.location}</span>
                        </div>
                    ` : ''}
                    <a href="petlist.html?id=${pet.id}" class="pr-pet-view-btn">
                        <i class="fas fa-eye"></i> View Details
                    </a>
                </div>
            `;
        }
        
        return card;
    }
    
    function addSearchForm() {
        const sectionHeader = document.querySelector('.pr-section-header');
        if (sectionHeader && !petId) {
            const searchForm = document.createElement('div');
            searchForm.className = 'pr-search-form';
            searchForm.innerHTML = `
                <form id="pet-search-form">
                    <div class="pr-input-group">
                        <input type="text" id="pet-id-input" placeholder="Enter Pet ID" class="pr-search-input">
                        <button type="submit" class="pr-search-btn">
                            <i class="fas fa-search"></i> Find Pet
                        </button>
                    </div>
                </form>
            `;
            sectionHeader.appendChild(searchForm);
            
            document.getElementById('pet-search-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const searchId = document.getElementById('pet-id-input').value.trim();
                if (searchId) {
                    window.location.href = `petlist.html?id=${searchId}`;
                }
            });
        }
    }
    
    addSearchForm();
    fetchPets();
});