// Shared data fetch with error handling
async function fetchData() {
  try {
    const res = await fetch("data.json");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to load data.json:", error);
    alert(
      "Could not load video data. Please ensure data.json exists and the server is running.",
    );
    return { videos: [], categories: [] }; // Fallback empty data
  }
}

// Home page
if (document.getElementById("carousel")) {
  fetchData().then((data) => {
    const carousel = document.getElementById("carousel");
    const categories = document.getElementById("categories");

    // Carousel (featured videos)
    const featured = data.videos.filter((v) => v.section === "featured");
    carousel.innerHTML = featured
      .map(
        (v, i) => `
      <div class="absolute w-full h-full ${i === 0 ? "" : "hidden"}" data-id="${v.id}">
        <div class="video-container relative">
          <div class="video-content">
            <blockquote class="twitter-tweet" data-media-max-width="560"><a href="${v.url}"></a></blockquote>
            <p class="text-2xl mt-2">${v.title}</p>
          </div>
          <div class="video-overlay" onclick="window.location.href='details.html?id=${v.id}'"></div>
        </div>
      </div>
    `,
      )
      .join("");

    // Auto-rotate carousel
    let current = 0;
    setInterval(() => {
      carousel.children[current].classList.add("hidden");
      current = (current + 1) % featured.length;
      carousel.children[current].classList.remove("hidden");
    }, 5000);

    // Category rows
    data.categories.forEach((cat) => {
      const videos = data.videos.filter((v) => v.category === cat);
      categories.innerHTML += `
        <h2 class="text-xl mb-2">${cat}</h2>
        <div class="category-row pb-4">
          ${videos
            .map(
              (v) => `
            <div class="video-container relative">
              <div class="video-content">
                <blockquote class="twitter-tweet" data-media-max-width="560"><a href="${v.url}"></a></blockquote>
                <p>${v.title}</p>
              </div>
              <div class="video-overlay" onclick="window.location.href='details.html?id=${v.id}'"></div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    });
  });
}

// Details page
if (document.getElementById("video")) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  fetchData().then((data) => {
    const video = data.videos.find((v) => v.id === id);
    if (video) {
      document.getElementById("video").innerHTML = `
        <h1 class="text-2xl mb-4">${video.title}</h1>
        <blockquote class="twitter-tweet" data-media-max-width="560"><a href="${video.url}"></a></blockquote>
      `;
    } else {
      document.getElementById("video").innerHTML = "<p>Video not found.</p>";
    }
  });
}
