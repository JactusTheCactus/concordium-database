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
                generateCharacterDetailPage(characterData, data);  // Pass `data` to the function
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

function generateCharacterDetailPage(characterData, data) {
    const nameElement = document.getElementById('character-name');
    const infoElement = document.getElementById('character-info');
    console.log(characterData);
    
    // Get the inverse character data using the 'inverse' key
    const inverseCharacterData = data[characterData.inverse.toLowerCase()];  // Use .toLowerCase() to match the keys
    console.log('Inverse Character Data:', inverseCharacterData);
    
    if (!nameElement || !infoElement) {
        console.error("One or more required elements for character detail page not found!");
        return;
    }
    function epithet(characterData) {
        if (characterData.epithet != ``) {
            return `"${characterData.epithet}"`
        }
        else {
            return ``
        }
    }

    nameElement.innerHTML = `
                                ${characterData.name} ${characterData.rank}<br>
                                ${characterData.animal} ${characterData.alignment} of ${characterData.aspect}<br>
                                ${epithet(characterData)}`;
    infoElement.innerHTML = `
                                Species: <u>${characterData.species}</u><br>
                                Power: <u>${characterData.power}</u><br>
                                Gear Colour: <u>${characterData.colour}</u><br>
                                Weapon: <u>${characterData.weapon}</u><br>
                                <br>Inverse ${inverseCharacterData.alignment}: <u>${inverseCharacterData.name} ${inverseCharacterData.rank}</u><br>
                                <br><a href="/index.html">Back</a>
    `
}
