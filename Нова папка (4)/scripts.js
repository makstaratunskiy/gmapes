let map;
let sharedMarker;

function initMap() {
    const defaultCoordinates = [50.4501, 30.5234]; // Київ

    map = L.map("map").setView(defaultCoordinates, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    sharedMarker = L.marker(defaultCoordinates).addTo(map).bindPopup("Обрана локація");

    map.on("click", (event) => {
        const clickedLocation = event.latlng;
        sharedMarker.setLatLng(clickedLocation).openPopup();
        map.panTo(clickedLocation);
        document.getElementById("search-input").value = "";
    });

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            alert("Введіть адресу для пошуку.");
            return;
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

        fetch(url, {
            headers: {
                "Accept": "application/json",
            },
        })
            .then((response) => response.json())
            .then((results) => {
                if (!results || results.length === 0) {
                    alert("Місце не знайдено.");
                    return;
                }

                const place = results[0];
                const lat = parseFloat(place.lat);
                const lon = parseFloat(place.lon);
                const location = [lat, lon];

                sharedMarker.setLatLng(location);
                sharedMarker.bindPopup(place.display_name).openPopup();
                map.setView(location, 15);
            })
            .catch((error) => {
                console.error("Search error:", error);
                alert("Помилка пошуку. Спробуйте пізніше.");
            });
    }

    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            performSearch();
        }
    });
}

window.addEventListener("DOMContentLoaded", initMap);
