// -----------------------------
// Track last drawn submissions
// -----------------------------
let lastDataLength = 0;
const canvas = document.getElementById("canvas");

// Track used positions to avoid overlap
const existingPositions = [];
const minDistance = 120; // minimum distance between dishes

// -----------------------------
// Define correct combinations for each taste
// -----------------------------
const correctCombinations = {
  sweet:  { sound: "sweet",  texture: "sweet" },
  sour:   { sound: "sour",   texture: "sour" },
  bitter: { sound: "bitter", texture: "bitter" },
  salty:  { sound: "salty",  texture: "salty" }
};

// -----------------------------
// Fetch and render new submissions
// -----------------------------
async function fetchAndRender() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();

    const newSubmissions = data.slice(lastDataLength);
    newSubmissions.forEach(sub => drawSubmission(sub));

    lastDataLength = data.length;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// -----------------------------
// Automatically fetch every 10 seconds
// -----------------------------
setInterval(fetchAndRender, 10000);

// Initial render
fetchAndRender();

// -----------------------------
// Draw ONE stacked dish
// -----------------------------
function drawSubmission(submission) {
  const centerX = canvas.clientWidth / 2;
  const centerY = canvas.clientHeight / 2;

  // -----------------------------
  // 1. Determine correctness
  // -----------------------------
  const correct = correctCombinations[submission.taste] || { sound: "", texture: "" };
  const soundCorrect = submission.sound === correct.sound;
  const textureCorrect = submission.texture === correct.texture;

  const correctness = (soundCorrect ? 1 : 0) + (textureCorrect ? 1 : 0);

  // -----------------------------
  // 2. Determine radius by correctness
  // -----------------------------
  const maxRadius = Math.min(canvas.clientWidth, canvas.clientHeight) / 2 - 50; // leave margin
  let radius;
  if (correctness === 2) radius = maxRadius * 0.2;       // center
  else if (correctness === 1) radius = maxRadius * 0.5;  // middle
  else radius = maxRadius * 0.8;                         // edge

  // Add slight jitter
  radius += (Math.random() - 0.5) * 30;

  // -----------------------------
  // 3. Find non-overlapping position
  // -----------------------------
  const pos = getNonOverlappingPosition(radius, centerX, centerY);
  const baseX = pos.x;
  const baseY = pos.y;

  // -----------------------------
  // 4. Image paths
  // -----------------------------
  const tasteImg = `/images/taste/${submission.taste}.png`;        // plate
  const soundImg = `/images/sound/${submission.sound}.png`;        // food
  const textureImg = `/images/texture/${submission.texture}.png`;  // seasoning

  // -----------------------------
  // 5. Create stacked elements
  // -----------------------------
  const plate = document.createElement("img");
  plate.src = tasteImg;
  plate.classList.add("shape");
  plate.style.width = "90px";
  plate.style.height = "90px";
  plate.style.left = baseX + "px";
  plate.style.top = baseY + "px";
  plate.style.zIndex = 1;

  const food = document.createElement("img");
  food.src = soundImg;
  food.classList.add("shape");
  food.style.width = "65px";
  food.style.height = "65px";
  food.style.left = (baseX + 12) + "px";
  food.style.top = (baseY + 12) + "px";
  food.style.zIndex = 2;

  const seasoning = document.createElement("img");
  seasoning.src = textureImg;
  seasoning.classList.add("shape");
  seasoning.style.width = "45px";
  seasoning.style.height = "45px";
  seasoning.style.left = (baseX + 22) + "px";
  seasoning.style.top = (baseY + 22) + "px";
  seasoning.style.zIndex = 3;

  // -----------------------------
  // 6. Append to canvas
  // -----------------------------
  canvas.appendChild(plate);
  canvas.appendChild(food);
  canvas.appendChild(seasoning);
}

// -----------------------------
// Helper: Find non-overlapping position
// -----------------------------
function getNonOverlappingPosition(radius, centerX, centerY) {
  let x, y;
  let tries = 0;

  do {
    const angle = Math.random() * Math.PI * 2;
    x = centerX + radius * Math.cos(angle);
    y = centerY + radius * Math.sin(angle);

    const tooClose = existingPositions.some(pos => {
      const dx = pos.x - x;
      const dy = pos.y - y;
      return Math.sqrt(dx*dx + dy*dy) < minDistance;
    });

    if (!tooClose) break;
    tries++;
  } while (tries < 50);

  existingPositions.push({ x, y });
  return { x: x - 40, y: y - 40 }; // adjust for element size
}
