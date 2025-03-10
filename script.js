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
        // Create rows for 6 entries at a time (3 pairs of columns)
for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');

    // First pair (columns 1 and 2: rankings 1-6)
    const firstPairIndex = i;
    const firstNameCell = document.createElement('td');
    const firstPointsCell = document.createElement('td');
    if (data[firstPairIndex]) {
        firstNameCell.textContent = data[firstPairIndex].dog?.name || '-';
        firstPointsCell.textContent = (
            (data[firstPairIndex].first_place_count || 0) * 3 +
            (data[firstPairIndex].second_place_count || 0) * 2 +
            (data[firstPairIndex].third_place_count || 0) * 1
        ).toString();
        firstPointsCell.classList.add('points');
        // Apply medal colors to top 3
        if (firstPairIndex === 0) firstNameCell.classList.add('gold');
        else if (firstPairIndex === 1) firstNameCell.classList.add('silver');
        else if (firstPairIndex === 2) firstNameCell.classList.add('bronze');
    } else {
        firstNameCell.textContent = '-';
        firstPointsCell.textContent = '-';
        firstPointsCell.classList.add('points');
    }

    // Second pair (columns 3 and 4: rankings 7-12)
    const secondPairIndex = i + 6;
    const secondNameCell = document.createElement('td');
    const secondPointsCell = document.createElement('td');
    if (data[secondPairIndex]) {
        secondNameCell.textContent = data[secondPairIndex].dog?.name || '-';
        secondPointsCell.textContent = (
            (data[secondPairIndex].first_place_count || 0) * 3 +
            (data[secondPairIndex].second_place_count || 0) * 2 +
            (data[secondPairIndex].third_place_count || 0) * 1
        ).toString();
        secondPointsCell.classList.add('points');
    } else {
        secondNameCell.textContent = '-';
        secondPointsCell.textContent = '-';
        secondPointsCell.classList.add('points');
    }

    // Third pair (columns 5 and 6: rankings 13-18)
    const thirdPairIndex = i + 12;
    const thirdNameCell = document.createElement('td');
    const thirdPointsCell = document.createElement('td');
    if (data[thirdPairIndex]) {
        thirdNameCell.textContent = data[thirdPairIndex].dog?.name || '-';
        thirdPointsCell.textContent = (
            (data[thirdPairIndex].first_place_count || 0) * 3 +
            (data[thirdPairIndex].second_place_count || 0) * 2 +
            (data[thirdPairIndex].third_place_count || 0) * 1
        ).toString();
        thirdPointsCell.classList.add('points');
    } else {
        thirdNameCell.textContent = '-';
        thirdPointsCell.textContent = '-';
        thirdPointsCell.classList.add('points');
    }

    // Append all cells to the row
    row.appendChild(firstNameCell);
    row.appendChild(firstPointsCell);
    row.appendChild(secondNameCell);
    row.appendChild(secondPointsCell);
    row.appendChild(thirdNameCell);
    row.appendChild(thirdPointsCell);
    tbody.appendChild(row);
}
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
