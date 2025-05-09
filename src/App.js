// app.js

const getLocation = () => {
    const status = document.getElementById('status');
    const businessList = document.getElementById('businesses');
    businessList.innerHTML = '';
    
    if (navigator.geolocation) {
        status.textContent = 'Locating...';
        navigator.geolocation.getCurrentPosition(fetchBusinesses, showError);
    } else {
        status.textContent = 'Geolocation is not supported by your browser.';
    }
};

const fetchBusinesses = async (position) => {
    const { latitude, longitude } = position.coords;
    const status = document.getElementById('status');

    try {
        const response = await fetch(`/api/businesses/nearby?lat=${latitude}&lng=${longitude}&radius=5`);
        const data = await response.json();

        if (data.length > 0) {
            status.textContent = `Found ${data.length} businesses nearby.`;
            displayBusinesses(data);
        } else {
            status.textContent = 'No nearby businesses found.';
        }
    } catch (error) {
        status.textContent = 'Error fetching businesses.';
        console.error(error);
    }
};

const displayBusinesses = (businesses) => {
    const businessList = document.getElementById('businesses');
    businesses.forEach(business => {
        const listItem = document.createElement('li');
        listItem.textContent = `${business.name} - ${business.address} (Phone: ${business.phone})`;
        businessList.appendChild(listItem);
    });
};

const showError = (error) => {
    const status = document.getElementById('status');
    switch (error.code) {
        case error.PERMISSION_DENIED:
            status.textContent = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            status.textContent = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            status.textContent = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            status.textContent = 'An unknown error occurred.';
            break;
    }
};
