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
            generateCharacterDetailPage(data[category][character]);
        } else {
            generateMainPage();
        }
    });

// Function to generate the main page (Sin or Virtue?)
function generateMainPage() {
    // Main page is already in HTML, but you can modify it dynamically if needed
}

// Function to generate the character select page
function generateCharacterSelectPage(data, category) {
    if (!data || typeof data !== 'object') {
        console.error('Invalid data received:', data); // Log invalid data
        return;
    }

    const listContainer = document.getElementById('character-list');
    listContainer.innerHTML = ''; // Clear previous content

    // Filter characters by alignment
    const filteredCharacters = Object.entries(data).filter(
        ([key, character]) => character.alignment?.toLowerCase() === category
    );

    if (filteredCharacters.length === 0) {
        listContainer.innerHTML = `<li>No Concordants found for ${category}</li>`;
        return;
    }

    // Generate list items
    filteredCharacters.forEach(([key, character]) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="/character.html?character=${key}">${character.name} (${character.aspect})</a>`;
        listContainer.appendChild(listItem);
    });
}

const characterData = data[character];
if (!characterData) {
    console.error('Character not found:', character);
    document.body.innerHTML = '<h1>Character not found</h1>';
    return;
}

// Function to generate the character detail page
function generateCharacterDetailPage(characterData) {
    const nameElement = document.getElementById('character-name');
    const infoElement = document.getElementById('character-info');
    const detailsContainer = document.getElementById('character-details');
    
    nameElement.innerHTML = character.name;
    infoElement.innerHTML = `Aspect: ${character.aspect}<br>Weapon: ${character.weapon}<br>Power: ${character.power}`;
    
    // Display additional details in a list
    const details = [
        { label: 'Animal', value: character.animal },
        { label: 'Colour', value: character.colour },
        { label: 'Species', value: character.species },
        { label: 'Sex', value: character.sex },
        { label: 'Rank', value: character.rank },
        { label: 'Alignment', value: character.alignment },
        { label: 'Inverse', value: character.inverse },
        { label: 'Epithet', value: character.epithet || 'None' }
    ];
    
    details.forEach(detail => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
        detailsContainer.appendChild(listItem);
    });
}

generateCharacterDetailPage(characterData);