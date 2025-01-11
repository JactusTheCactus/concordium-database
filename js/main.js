document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category'); // 'sin' or 'virtue'

    fetch('/assets/data.json')
        .then(response => response.json())
        .then(data => {
            if (category) {
                generateCharacterSelectPage(data, category);
            } else {
                console.error('Category parameter is missing in URL');
            }
        })
        .catch(error => console.error('Error loading data:', error));
});

function generateCharacterSelectPage(data, category) {
    const listContainer = document.getElementById('character-list');
    if (!data || typeof data !== 'object') {
        console.error('Invalid data provided to generateCharacterSelectPage:', data);
        listContainer.innerHTML = '<li>Error loading characters</li>';
        return;
    }

    listContainer.innerHTML = ''; // Clear the list container

    const filteredCharacters = Object.entries(data).filter(([key, char]) => char.alignment?.toLowerCase() === category);

    if (filteredCharacters.length === 0) {
        listContainer.innerHTML = `<li>No Concordants found for ${category}</li>`;
        return;
    }

    filteredCharacters.forEach(([key, char]) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="/character.html?character=${key}">${char.name} (${char.aspect})</a>`;
        listContainer.appendChild(listItem);
    });
}
