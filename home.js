// Salted SHA-256 of "username:password"; the password itself is never stored here
const HOME_SALT = "expedition-journal-v1";
const HOME_HASH = "1579ddb8172ed7fb7e1c27d04c4ad3c3cccd5f7683b2eaf21f78db46164d5fb9";
let homeGlobe = null;
let homeHovered = null;

// Hashes the typed credentials so they can be compared without storing them
async function homeHash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(HOME_SALT + text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Removes the lock screen and starts the globe
function unlockHome() {
  document.body.classList.remove("locked");
  initGlobe();
  refreshHome();
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = document.getElementById("loginUser").value.trim().toLowerCase();
  const pass = document.getElementById("loginPass").value;
  if ((await homeHash(user + ":" + pass)) === HOME_HASH) {
    sessionStorage.setItem("ejAuth", "1");
    unlockHome();
  } else {
    document.getElementById("loginError").hidden = false;
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("ejAuth");
  location.reload();
});

// Colour of each country on the globe: visited, hovered or not yet explored
function homeCapColor(f) {
  if (!f.properties.country) return "#b9a477";
  if (f === homeHovered) return "#b8862b";
  const visited = data.countries.some((c) => c.name.toLowerCase() === f.properties.name.toLowerCase());
  return visited ? "#8b2e22" : "#d9c79a";
}

// Draws the rotating globe with clickable countries
function initGlobe() {
  if (homeGlobe) return;
  const box = document.getElementById("globeBox");
  fetch("data/countries.json").then((r) => r.json()).then((features) => {
    homeGlobe = Globe()(box)
      .width(box.clientWidth)
      .height(box.clientHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .atmosphereColor("#b8862b")
      .atmosphereAltitude(0.16)
      .polygonsData(features)
      .polygonCapColor(homeCapColor)
      .polygonSideColor(() => "#6b5330")
      .polygonStrokeColor(() => "#6b5330")
      .polygonAltitude((f) => (f === homeHovered && f.properties.country ? 0.03 : 0.008))
      .polygonLabel((f) => "<b>" + f.properties.name + "</b>")
      .onPolygonHover((f) => {
        homeHovered = f;
        homeGlobe.polygonCapColor(homeCapColor).polygonAltitude(homeGlobe.polygonAltitude());
        homeGlobe.controls().autoRotate = !(f && f.properties.country);
        box.style.cursor = f && f.properties.country ? "pointer" : "grab";
      })
      .onPolygonClick((f) => {
        if (f.properties.country) openHomeCountry(f.properties.name);
      });
    homeGlobe.globeMaterial().color.set("#d9c79a");
    homeGlobe.controls().autoRotate = true;
    homeGlobe.controls().autoRotateSpeed = 0.5;
    homeGlobe.pointOfView({ lat: 35, lng: 15, altitude: 2.2 });
  });
}

// Opens a country page in the diary, asking before marking a new country as visited
function openHomeCountry(name) {
  let node = data.countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (!node) {
    if (!confirm("Segnare " + name + " come visitato?")) return;
    node = makeNode(name, 0);
    data.countries.push(node);
    saveData();
  }
  currentPath = [node.id];
  render();
  document.getElementById("diary").scrollIntoView({ behavior: "smooth" });
}

// Updates the exploration bar (visited countries / all countries) and the globe colours
function refreshHome() {
  const total = GEO_DATA.countries.length;
  const names = new Set(GEO_DATA.countries.map((c) => c.name.toLowerCase()));
  const visited = data.countries.filter((c) => names.has(c.name.toLowerCase())).length;
  const pct = Math.round((visited / total) * 1000) / 10;
  document.getElementById("exploreValue").textContent = pct + "%";
  document.getElementById("exploreFill").style.width = pct + "%";
  document.getElementById("exploreText").textContent = visited + " / " + total + " paesi esplorati";
  if (homeGlobe) homeGlobe.polygonCapColor(homeCapColor);
}

window.addEventListener("resize", () => {
  const box = document.getElementById("globeBox");
  if (homeGlobe) homeGlobe.width(box.clientWidth).height(box.clientHeight);
});

if (sessionStorage.getItem("ejAuth") === "1") unlockHome();
