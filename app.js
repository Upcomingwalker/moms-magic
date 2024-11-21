const API_KEY = "AIzaSyC9ax5uqkdmbPn-Ii3KrZ4pxXfhy4tiXRA";
const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&key=${API_KEY}`;

const moviesContainer = document.getElementById("movies");
const metadataPage = document.getElementById("metadataPage");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const reloadButton = document.getElementById("reloadButton");

// Create intro overlay
function createIntroOverlay() {
    const introOverlay = document.createElement('div');
    introOverlay.id = 'intro-overlay';
    introOverlay.innerHTML = `
        <div id="intro-text">Mom's Magic</div>
    `;
    document.body.insertBefore(introOverlay, document.body.firstChild);
}

// Fetch and display movies
async function fetchMovies(query = "tollywood hindi dubbed full movie") {
  try {
    const response = await fetch(`${API_URL}&q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.items) {
      displayMovies(data.items);
      showHomePage();
    } else {
      console.error("No movies found:", data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Display movies as cards
function displayMovies(movies) {
  moviesContainer.innerHTML = movies
    .map(
      (movie) => `
      <div class="col-md-3">
        <div class="card bg-dark text-light">
          <img src="${movie.snippet.thumbnails.high.url}" class="card-img-top" alt="${movie.snippet.title}">
          <div class="card-body">
            <h5 class="card-title">${movie.snippet.title}</h5>
            <p class="card-text">${movie.snippet.channelTitle}</p>
            <button class="btn btn-primary" onclick="showMetadataPage('${movie.id.videoId}')">Meta Data</button>
            <a href="https://www.youtube.com/watch?v=${movie.id.videoId}" class="btn btn-success" target="_blank">Watch Now</a>
          </div>
        </div>
      </div>`
    )
    .join("");
}

// Fetch metadata and display in a separate page
async function showMetadataPage(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items[0]) {
      const meta = data.items[0];
      metadataPage.innerHTML = `
        <div class="card bg-dark text-light p-4">
          <h2>${meta.snippet.title}</h2>
          <img src="${meta.snippet.thumbnails.high.url}" class="img-fluid mb-3" alt="${meta.snippet.title}">
          <p><strong>Channel:</strong> ${meta.snippet.channelTitle}</p>
          <p><strong>Description:</strong> ${meta.snippet.description}</p>
          <p><strong>Views:</strong> ${meta.statistics.viewCount}</p>
          <p><strong>Likes:</strong> ${meta.statistics.likeCount || "N/A"}</p>
          <button class="btn btn-secondary" onclick="showHomePage()">Back to Home</button>
        </div>
      `;
      showMetadataSection();
    } else {
      alert("Meta data not found.");
    }
  } catch (error) {
    console.error("Error fetching meta data:", error);
    alert("An error occurred while fetching meta data.");
  }
}

// Show metadata page
function showMetadataSection() {
  moviesContainer.classList.add("d-none");
  metadataPage.classList.remove("d-none");
}

// Show home page
function showHomePage() {
  metadataPage.classList.add("d-none");
  moviesContainer.classList.remove("d-none");
}

// Reload the homepage with fresh movies
reloadButton.addEventListener("click", () => {
  fetchMovies();
});

// Search functionality
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  } else {
    alert("Please enter a search term.");
  }
});

// Initialize with default movies
document.addEventListener('DOMContentLoaded', () => {
    createIntroOverlay();
    fetchMovies();
});
