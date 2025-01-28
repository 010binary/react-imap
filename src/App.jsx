import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { Search, ChevronDown } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import "./css/popup.css";
import "./css/responsive.css";

const sectors = ["Télécommunications", "Finance", "Agriculture"];

const types = [
  "Afrique de l'Ouest",
  "Afrique de l'Est",
  "Afrique Centrale",
  "Afrique du Nord",
  "Afrique Australe",
];

const regions = {
  "Afrique de l'Ouest": ["Pays 1", "Pays 2", "Pays 3"],
  "Afrique de l'Est": ["Pays 1", "Pays 2", "Pays 3"],
  "Afrique Centrale": ["Pays 1", "Pays 2", "Pays 3"],
  "Afrique du Nord": [],
  "Afrique Australe": [],
};

const markers = [
  {
    position: [9.082, 8.6753],
    title: "Nigeria",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [15.4542, 18.7322],
    title: "Chad",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-30.5595, 22.9375],
    title: "South Africa",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-19.0154, 29.1549],
    title: "Zimbabwe",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-22.9576, 18.4904],
    title: "Namibia",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-11.2027, 17.8739],
    title: "Angola",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-18.6657, 35.5296],
    title: "Mozambique",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-6.369, 34.8888],
    title: "Tanzania",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-4.0383, 21.7587],
    title: "Democratic Republic of the Congo",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-0.8037, 11.6094],
    title: "Gabon",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [9.145, 40.4897],
    title: "Ethiopia",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [12.8628, 30.2176],
    title: "Sudan",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [26.3351, 17.2283],
    title: "Libya",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [28.0339, 1.6596],
    title: "Algeria",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [21.0079, -10.9408],
    title: "Mauritania",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [7.9465, -1.0232],
    title: "Ghana",
    category: sectors[Math.floor(Math.random() * sectors.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
];

const getCategoryColor = (category) => {
  const colors = {
    Télécommunications: "#ff1493", // Pink
    Finance: "#ffd700", // Yellow
    Agriculture: "#ff1493", // Pink
  };
  return colors[category] || "#ffd700";
};

const customIcon = (category) => {
  // eslint-disable-next-line no-undef
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${getCategoryColor(category)};color:${
      getCategoryColor(category) === "#ffd700" ? "#2D3463" : "white"
    };">02</div>`,
    iconSize: [50, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Function to modify tile colors
const manipulateTileColors = (tile, url, onLoad) => {
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Avoid CORS issues
  img.src = url;

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Target colors for land and water
    const landRGB = { r: 19, g: 22, b: 42 }; // #13162A
    const waterRGB = { r: 25, g: 29, b: 54 }; // #191D36

    // Loop through each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]; // Red
      const g = data[i + 1]; // Green
      const b = data[i + 2]; // Blue

      // Determine if the pixel is closer to land or water based on brightness
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b; // Perceived brightness
      const targetRGB = brightness > 50 ? waterRGB : landRGB; // Higher brightness -> water

      // Blend original colors towards the target
      data[i] = targetRGB.r + (r - targetRGB.r) * 0.5; // Adjust red channel
      data[i + 1] = targetRGB.g + (g - targetRGB.g) * 0.5; // Adjust green channel
      data[i + 2] = targetRGB.b + (b - targetRGB.b) * 0.5; // Adjust blue channel
    }

    ctx.putImageData(imageData, 0, 0);
    tile.src = canvas.toDataURL();
    onLoad();
  };

  img.onerror = function () {
    tile.src = url; // Fallback to original tile
    onLoad();
  };
};

const CustomTileLayer = () => {
  const map = useMap();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const layer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      {
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    layer.createTile = function (coords, done) {
      const tile = document.createElement("img");
      const url = this.getTileUrl(coords);

      manipulateTileColors(tile, url, () => done(null, tile));

      return tile;
    };

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return null;
};

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sectorOpen, setSectorOpen] = useState(true);
  const [zoneOpen, setZoneOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);

  // Detect if the screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900 ? true : false);
    };

    // Set the initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredMarkers =
    hasSearched || isAnyCheckboxSelected
      ? markers.filter(
          (marker) =>
            (searchText === "" ||
              marker.title.toLowerCase().includes(searchText.toLowerCase())) &&
            (selectedSectors.length === 0 ||
              selectedSectors.includes(marker.category)) &&
            (selectedTypes.length === 0 || selectedTypes.includes(marker.type))
        )
      : [];

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    // Set hasSearched to true when the user types something
    setHasSearched(text.trim() !== "");
  };

  const handleReset = () => {
    setSelectedSectors([]);
    setSelectedTypes([]);
    setSearchText("");
    setHasSearched(false);
    setIsAnyCheckboxSelected(false);
  };

  const handleCheckboxChange = (type, value, isChecked) => {
    const updateSelected = (prev) =>
      isChecked ? [...prev, value] : prev.filter((item) => item !== value);

    if (type === "sector") {
      setSelectedSectors(updateSelected);
    } else if (type === "type") {
      setSelectedTypes(updateSelected);
    }

    setTimeout(() => {
      const anySelected =
        selectedSectors.length > 0 || selectedTypes.length > 0;
      setIsAnyCheckboxSelected(anySelected);
    }, 0);
  };
  return (
    <div className="app-container">
      <div className="map-wrapper">
        <>
          <div>
            <div className="filter-sidebar">
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Chercher une startup"
                  value={searchText}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>

              <div className="filter-section">
                <div className="filter-group">
                  <button
                    className="filter-header"
                    onClick={() => setSectorOpen(!sectorOpen)}
                  >
                    <span>Secteur d&apos;activité</span>
                    <ChevronDown
                      className={`chevron ${sectorOpen ? "open" : ""}`}
                    />
                  </button>

                  {sectorOpen && (
                    <div className="checkbox-list">
                      {sectors.map((sector) => (
                        <label key={sector} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={selectedSectors.includes(sector)}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "sector",
                                sector,
                                e.target.checked
                              )
                            }
                          />
                          <span>{sector}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="filter-group">
                  <button
                    className="filter-header"
                    onClick={() => setZoneOpen(!zoneOpen)}
                  >
                    <span>Zone géographique</span>
                    <ChevronDown
                      className={`chevron ${zoneOpen ? "open" : ""}`}
                    />
                  </button>

                  {zoneOpen && (
                    <div className="checkbox-list">
                      {Object.entries(regions).map(([region, countries]) => (
                        <div key={region} className="region-group">
                          <label className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(region)}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  "type",
                                  region,
                                  e.target.checked
                                )
                              }
                            />
                            <span>{region}</span>
                          </label>

                          {countries.length > 0 && (
                            <div className="country-list">
                              {countries.map((country) => (
                                <label key={country} className="checkbox-item">
                                  <input
                                    type="radio"
                                    name={region}
                                    value={country}
                                  />
                                  <span>{country}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="button-group">
                <button className="cancel-button" onClick={handleReset}>
                  Annuler
                </button>
                <button className="apply-button" onClick={() => {}}>
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </>

        <MapContainer
          center={[0, 20]}
          zoom={isMobile ? 3 : 4}
          style={{ height: isMobile ? "90vh" : "95vh", width: "100%" }}
          minZoom={2}
          maxZoom={6}
          className="map"
          zoomControl={false}
        >
          <CustomTileLayer />
          <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control-zoom leaflet-bar leaflet-control">
              <a className="leaflet-control-zoom-in" href="#" title="Zoom in">
                +
              </a>
              <a className="leaflet-control-zoom-out" href="#" title="Zoom out">
                -
              </a>
            </div>
          </div>
          {filteredMarkers.map((marker, idx) => (
            <Marker
              key={idx}
              position={marker.position}
              icon={customIcon(marker.category)}
            >
              <Popup>
                <div className="custom-popup-container">
                  <h3>{marker.title}</h3>
                  <p>Category: {marker.category}</p>
                  <p>Region: {marker.type}</p>
                  <img
                    src="/fuze_logo.svg"
                    alt="Company logo"
                    className="popup-logo"
                  />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
