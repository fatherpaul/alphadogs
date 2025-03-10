// API endpoint
const API_URL = 'https://izrr3wibyl.execute-api.ap-southeast-2.amazonaws.com/prod/dogs/leaderboard?limit=18';

// Function to fetch and populate the leaderboard
async function fetchLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    try {
        // Show loading state
        tbody.innerHTML = '<tr><td colspan="2">Loading...</td></tr>';

        // Fetch data from API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Clear loading state
        tbody.innerHTML = '';

        // Check if data is an array
        if (!Array.isArray(data)) {
            throw new Error('Unexpected response format: Expected an array');
        }

        // Sort data by total points in descending order
        data.sort((a, b) => {
            const pointsA = (a.first_place_count || 0) * 3 + (a.second_place_count || 0) * 2 + (a.third_place_count || 0) * 1;
            const pointsB = (b.first_place_count || 0) * 3 + (b.second_place_count || 0) * 2 + (b.third_place_count || 0) * 1;
            return pointsB - pointsA; // Descending order
        });

        // Populate table with sorted API data
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const pointsCell = document.createElement('td');

            // Set name and calculate points
            nameCell.textContent = item.dog?.name || '-'; // Use dog.name with fallback
            pointsCell.textContent = (
                (item.first_place_count || 0) * 3 +
                (item.second_place_count || 0) * 2 +
                (item.third_place_count || 0) * 1
            ).toString(); // Calculate points
            pointsCell.classList.add('points');

            // Apply medal colors to top 3 based on sorted order
            if (index === 0) nameCell.classList.add('gold');
            else if (index === 1) nameCell.classList.add('silver');
            else if (index === 2) nameCell.classList.add('bronze');

            row.appendChild(nameCell);
            row.appendChild(pointsCell);
            tbody.appendChild(row);
        });

        // If fewer than 18 entries are returned, fill the rest with placeholders
        while (tbody.children.length < 18) {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const pointsCell = document.createElement('td');
            nameCell.textContent = '-';
            pointsCell.textContent = '-';
            pointsCell.classList.add('points');
            row.appendChild(nameCell);
            row.appendChild(pointsCell);
            tbody.appendChild(row);
        }
    } catch (error) {
        // Handle errors
        tbody.innerHTML = `<tr><td colspan="2">Error loading leaderboard: ${error.message}</td></tr>`;
        console.error('Fetch error:', error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchLeaderboard);
