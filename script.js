document.addEventListener('DOMContentLoaded', () => {
    const weatherContainer = document.getElementById('weather-container');
    const searchInput = document.getElementById('search-input');
    const paginationControls = document.getElementById('pagination-controls');
    const itemsPerPage = 9;
    const maxPageButtons = 5; // Maximum number of page buttons to display at a time
    let currentPage = 1;
    let groupedForecasts = [];
    let filteredForecasts = [];

    // Mapping of location names to image URLs
    const locationImages = {
        'Location1': 'url_to_image1.jpg',
        'Location2': 'url_to_image2.jpg',
        'Location3': 'url_to_image3.jpg',
        // Add more mappings as needed
    };

    fetch('https://api.data.gov.my/weather/forecast')
    .then(response => response.json())
    .then(data => {
        groupedForecasts = groupForecastsByLocation(data);
        filteredForecasts = groupedForecasts;
        renderCards();
    })
    .catch(error => console.error('Error fetching weather data:', error));

    const groupForecastsByLocation = (forecasts) => {
        const grouped = {};
        forecasts.forEach(forecast => {
            const locationId = forecast.location.location_id;
            if (!grouped[locationId]) {
                grouped[locationId] = [];
            }
            grouped[locationId].push(forecast);
        });
        return Object.values(grouped).sort((a, b) => 
            a[0].location.location_name.localeCompare(b[0].location.location_name)
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const renderCards = () => {
        weatherContainer.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const visibleForecasts = filteredForecasts.slice(start, end);

        visibleForecasts.forEach(group => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');

            const locationName = group[0].location.location_name;
            const forecastsHtml = group.map(forecast => `
                <details>
                    <summary>${formatDate(forecast.date)}</summary>
                    <p>Morning: ${forecast.morning_forecast}</p>
                    <p>Afternoon: ${forecast.afternoon_forecast}</p>
                    <p>Night: ${forecast.night_forecast}</p>
                    <p>Summary: ${forecast.summary_forecast} (${forecast.summary_when})</p>
                    <p>Min Temp: ${forecast.min_temp}°C</p>
                    <p>Max Temp: ${forecast.max_temp}°C</p>
                </details>
            `).join('');

            gridItem.innerHTML = `
                <h3>${locationName}</h3>
                ${forecastsHtml}
            `;

            // Set the background image based on the location name
            if (locationImages[locationName]) {
                gridItem.style.backgroundImage = `url(${locationImages[locationName]})`;
                gridItem.style.backgroundSize = 'cover';
                gridItem.style.backgroundPosition = 'center';
                gridItem.style.color = 'white'; // Adjust text color for better readability
            }

            weatherContainer.appendChild(gridItem);
        });

        renderPaginationControls();
    };

    const renderPaginationControls = () => {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(filteredForecasts.length / itemsPerPage);

        const createButton = (text, disabled, onClick) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.disabled = disabled;
            button.addEventListener('click', onClick);
            return button;
        };

        const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (currentPage > 1) {
            paginationControls.appendChild(createButton('Previous', false, () => {
                currentPage--;
                renderCards();
            }));
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationControls.appendChild(createButton(i, i === currentPage, () => {
                currentPage = i;
                renderCards();
            }));
        }

        if (currentPage < totalPages) {
            paginationControls.appendChild(createButton('Next', false, () => {
                currentPage++;
                renderCards();
            }));
        }
    };

    const filterForecasts = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredForecasts = groupedForecasts.filter(group =>
            group[0].location.location_name.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderCards();
    };

    searchInput.addEventListener('input', filterForecasts);

   
});