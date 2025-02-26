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
        <a href="details.html?id=${v.id}">
          <blockquote class="twitter-tweet" data-media-max-width="560"><a href="${v.url}"></a></blockquote>
          <h2 class="text-2xl mt-2">${v.title}</h2>
        </a>
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
            <a href="details.html?id=${v.id}" class="min-w-[300px]">
              <blockquote class="twitter-tweet" data-media-max-width="560"><a href="${v.url}"></a></blockquote>
              <p>${v.title}</p>
            </a>
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

// Admin page
if (document.getElementById("add-video")) {
  const form = document.getElementById("add-video");
  const list = document.getElementById("video-list");

  fetchData().then((data) => {
    renderVideos(data);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const newVideo = {
        id: String(Date.now()), // Simple ID generation
        url: document.getElementById("url").value,
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        section: document.getElementById("section").value,
      };
      if (!data.categories.includes(newVideo.category)) {
        data.categories.push(newVideo.category);
      }
      data.videos.push(newVideo);
      saveData(data);
      renderVideos(data);
      form.reset();
    });
  });

  function renderVideos(data) {
    list.innerHTML = data.videos
      .map(
        (v) => `
      <div class="flex items-center mb-2">
        <span class="flex-1">${v.title} (${v.category})</span>
        <button onclick="editVideo('${v.id}')" class="p-1 bg-yellow-600 rounded mr-2">Edit</button>
        <button onclick="deleteVideo('${v.id}')" class="p-1 bg-red-600 rounded">Delete</button>
      </div>
    `,
      )
      .join("");
  }

  function saveData(data) {
    // For now, log to console; in deployment, manually update data.json
    console.log("Update data.json with:", JSON.stringify(data, null, 2));
    alert(
      "Please manually update data.json in the repo with the new data (check console).",
    );
  }

  window.deleteVideo = (id) => {
    fetchData()
      .then((data) => {
        data.videos = data.videos.filter((v) => v.id !== id);
        saveData(data);
        renderVideos(data);
      })
      .catch((error) => console.error("Delete failed:", error));
  };

  window.editVideo = (id) => {
    fetchData()
      .then((data) => {
        const video = data.videos.find((v) => v.id === id);
        if (video) {
          document.getElementById("url").value = video.url;
          document.getElementById("title").value = video.title;
          document.getElementById("category").value = video.category;
          document.getElementById("section").value = video.section;
          data.videos = data.videos.filter((v) => v.id !== id);
          saveData(data);
          renderVideos(data);
        }
      })
      .catch((error) => console.error("Edit failed:", error));
  };
}
