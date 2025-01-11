fetch('/assets/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const character = urlParams.get('character');
        
        if (category && character) {
            // If both category and character are in the URL, generate the character detail page
            const characterData = data[character];  // Access character data by key
            if (characterData) {
                generateCharacterDetailPage(characterData);
            } else {
                console.error('Character not found:', character);
                document.body.innerHTML = '<h1>Character not found</h1>';
            }
        } else if (category && !character) {
            // If only category is in the URL, generate the character selection page
            generateCharacterSelectPage(data, category);
        } else {
            // If no category or character is in the URL, generate the main page
            generateMainPage();
        }
    })
    .catch((error) => {
        console.error('Error loading data:', error);  // More specific logging
        document.body.innerHTML = `<h1>Error loading the page: ${error.message}</h1>`;  // Display the error message
    });

function generateMainPage() {
    const mainContainer = document.getElementById('main-page');
    
    if (!mainContainer) {
        console.error("Main container not found!");
        return;
    }

    mainContainer.innerHTML = ''; // Clear the container
    
    const sinLink = document.createElement('a');
    sinLink.href = '/character.html?category=sin';
    sinLink.innerHTML = 'View the Sins';
    
    const virtueLink = document.createElement('a');
    virtueLink.href = '/character.html?category=virtue';
    virtueLink.innerHTML = 'View the Virtues';
    
    mainContainer.appendChild(sinLink);
    mainContainer.appendChild(document.createElement('br'));
    mainContainer.appendChild(virtueLink);
}

function generateCharacterSelectPage(data, category) {
    const listContainer = document.getElementById('character-list');
    
    if (!listContainer) {
        console.error("Character list container not found!");
        return;
    }

    if (!data || typeof data !== 'object') {
        console.error('Invalid data provided to generateCharacterSelectPage:', data);
        listContainer.innerHTML = '<li>Error loading characters</li>';
        return;
    }

    listContainer.innerHTML = ''; // Clear the list container

    // Filter characters by category (Sin or Virtue)
    const filteredCharacters = Object.entries(data).filter(([key, char]) => char.alignment?.toLowerCase() === category);

    if (filteredCharacters.length === 0) {
        listContainer.innerHTML = `<li>No Concordants found for ${category}</li>`;
        return;
    }

    // Render the filtered characters
    filteredCharacters.forEach(([key, char]) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="/character.html?category=${category}&character=${key}">${char.name} (${char.aspect})</a>`;
        listContainer.appendChild(listItem);
    });
}

function generateCharacterDetailPage(characterData) {
    const nameElement = document.getElementById('character-name');
    const infoElement = document.getElementById('character-info');
    const detailsContainer = document.getElementById('character-details');
    console.log(characterData);
    var inverseAspect = characterData.inverse;
    console.log(inverseAspect);
    
    if (!nameElement || !infoElement || !detailsContainer) {
        console.error("One or more required elements for character detail page not found!");
        return;
    }

    nameElement.innerHTML = `${characterData.name} ${characterData.rank}`;
    infoElement.innerHTML = `Aspect: ${characterData.aspect}<br>Weapon: ${characterData.weapon}<br>Power: ${characterData.power}`;
    
    // Display additional details in a list
    const details = [
        { label: 'Animal', value: characterData.animal },
        { label: 'Colour', value: characterData.colour },
        { label: 'Species', value: characterData.species },
        { label: 'Inverse', value: characterData.inverse },
        { label: 'Inverse', value: inverseAspect.name },
        { label: 'Epithet', value: characterData.epithet || 'None' }
    ];
    
    detailsContainer.innerHTML = ''; // Clear any existing content

    details.forEach(detail => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
        detailsContainer.appendChild(listItem);
    });
}
