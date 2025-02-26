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
    alert("Could not load video data. Please ensure data.json exists.");
    return { videos: [] }; // Simplified fallback
  }
}

// Home page
if (document.getElementById("carousel")) {
  fetchData().then((data) => {
    const carousel = document.getElementById("carousel");
    const categories = document.getElementById("categories");

    // Carousel (featured videos, no text)
    const featured = data.videos.filter((v) => v.category === "featured");
    carousel.innerHTML = featured
      .map(
        (v, i) => `
      <div class="absolute w-full h-full ${i === 0 ? "" : "hidden"}" data-url="${v.url}">
        <div class="video-container relative">
          <div class="video-content">
            <blockquote class="twitter-tweet" data-media-max-width="800"><a href="${v.url}"></a></blockquote>
          </div>
          <div class="video-overlay" onclick="window.location.href='details.html?url=${encodeURIComponent(v.url)}'"></div>
        </div>
      </div>
    `,
      )
      .join("");

    // Auto-rotate carousel (no animation)
    let current = 0;
    setInterval(() => {
      carousel.children[current].classList.add("hidden");
      current = (current + 1) % featured.length;
      carousel.children[current].classList.remove("hidden");
    }, 5000);

    // Category rows (with truncated preview text)
    const uniqueCategories = [
      ...new Set(
        data.videos.map((v) => v.category).filter((c) => c !== "featured"),
      ),
    ];
    uniqueCategories.forEach((cat) => {
      const videos = data.videos.filter((v) => v.category === cat);
      categories.innerHTML += `
        <h2 class="text-xl mb-2">${cat}</h2>
        <div class="category-row pb-4">
          ${videos
            .map((v) => {
              const truncatedText = v.text
                ? v.text.slice(0, 50) + (v.text.length > 50 ? "..." : "")
                : "";
              return `
              <div class="video-container relative">
                <div class="video-content">
                  <blockquote class="twitter-tweet" data-media-max-width="560"><p>${truncatedText}</p><a href="${v.url}"></a></blockquote>
                  <p>${truncatedText}</p>
                </div>
                <div class="video-overlay" onclick="window.location.href='details.html?url=${encodeURIComponent(v.url)}'"></div>
              </div>
            `;
            })
            .join("")}
        </div>
      `;
    });
  });
}

// Details page
if (document.getElementById("video")) {
  const urlParams = new URLSearchParams(window.location.search);
  const url = decodeURIComponent(urlParams.get("url"));
  fetchData().then((data) => {
    const video = data.videos.find((v) => v.url === url);
    if (video) {
      document.getElementById("video").innerHTML = `
        <blockquote class="twitter-tweet" data-media-max-width="800"><a href="${video.url}"></a></blockquote>
      `;
    } else {
      document.getElementById("video").innerHTML = "<p>Video not found.</p>";
    }
  });
}
