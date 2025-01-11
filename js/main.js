// Load character data from the JSON file
fetch('/assets/data.json')
    .then(response => response.json())
    .then(data => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const character = urlParams.get('character');
        
        if (category && !character) {
            generateCharacterSelectPage(data, category);
        } else if (category && character) {
            const characterData = Object.values(data).find((charGroup) =>
                Object.keys(charGroup).includes(character)
            )?.[character];
            if (characterData) {
                generateCharacterDetailPage(characterData);
            } else {
                console.error('Character not found:', character);
                document.body.innerHTML = '<h1>Character not found</h1>';
            }
        } else {
            generateMainPage();
        }
    })
    .catch((error) => {
        console.error('Error loading data:', error);
        document.body.innerHTML = '<h1>Error loading the page</h1>';
    });

// Function to generate the main page (Sin or Virtue?)
function generateMainPage() {
    // Main page is already in HTML, but you can modify it dynamically if needed
}

// Function to generate the character select page
function generateCharacterSelectPage(data, category) {
    const listContainer = document.getElementById('character-list');
    if (!data || typeof data !== 'object') {
        console.error('Invalid data provided to generateCharacterSelectPage:', data);
        listContainer.innerHTML = '<li>Error loading characters</li>';
        return;
    }

    listContainer.innerHTML = ''; // Clear the list container

    // Filter characters by category
    const filteredCharacters = Object.entries(data).filter(([key, char]) => char.alignment?.toLowerCase() === category);

    if (filteredCharacters.length === 0) {
        listContainer.innerHTML = `<li>No Concordants found for ${category}</li>`;
        return;
    }

    // Render characters
    filteredCharacters.forEach(([key, char]) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="/character.html?character=${key}">${char.name} (${char.aspect})</a>`;
        listContainer.appendChild(listItem);
    });
}

// Function to generate the character detail page
function generateCharacterDetailPage(characterData) {
    const nameElement = document.getElementById('character-name');
    const infoElement = document.getElementById('character-info');
    const detailsContainer = document.getElementById('character-details');
    
    nameElement.innerHTML = characterData.name;
    infoElement.innerHTML = `Aspect: ${characterData.aspect}<br>Weapon: ${characterData.weapon}<br>Power: ${characterData.power}`;
    
    // Display additional details in a list
    const details = [
        { label: 'Animal', value: characterData.animal },
        { label: 'Colour', value: characterData.colour },
        { label: 'Species', value: characterData.species },
        { label: 'Sex', value: characterData.sex },
        { label: 'Rank', value: characterData.rank },
        { label: 'Alignment', value: characterData.alignment },
        { label: 'Inverse', value: characterData.inverse },
        { label: 'Epithet', value: characterData.epithet || 'None' }
    ];
    
    detailsContainer.innerHTML = ''; // Clear any existing content

    details.forEach(detail => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
        detailsContainer.appendChild(listItem);
    });
}
