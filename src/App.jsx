import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Search, ChevronDown } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./App.css";

const categories = ["telecom", "finance", "agriculture"];
const types = [
  "Afrique de l'Ouest",
  "Afrique de l'Est",
  "Afrique Centrale",
  "Afrique du Nord",
  "Afrique Australe",
];

const markers = [
  {
    position: [9.082, 8.6753],
    title: "Nigeria",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [15.4542, 18.7322],
    title: "Chad",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-30.5595, 22.9375],
    title: "South Africa",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-19.0154, 29.1549],
    title: "Zimbabwe",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-22.9576, 18.4904],
    title: "Namibia",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-11.2027, 17.8739],
    title: "Angola",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-18.6657, 35.5296],
    title: "Mozambique",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-6.369, 34.8888],
    title: "Tanzania",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-4.0383, 21.7587],
    title: "Democratic Republic of the Congo",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [-0.8037, 11.6094],
    title: "Gabon",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [9.145, 40.4897],
    title: "Ethiopia",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [12.8628, 30.2176],
    title: "Sudan",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [26.3351, 17.2283],
    title: "Libya",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [28.0339, 1.6596],
    title: "Algeria",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [21.0079, -10.9408],
    title: "Mauritania",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
  {
    position: [7.9465, -1.0232],
    title: "Ghana",
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
  },
];

const getCategoryColor = (category) => {
  const colors = {
    telecom: "#ff1493", // Pink
    finance: "#ffd700", // Yellow
    agriculture: "#ff1493", // Pink
  };
  return colors[category] || "#ffd700";
};

const customIcon = (category) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${getCategoryColor(category)};color:${
      getCategoryColor(category) === "#ffd700" ? "#2D3463" : "white"
    };">02</div>`,
    iconSize: [32, 32],
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

  React.useEffect(() => {
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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sectorOpen, setSectorOpen] = useState(true);
  const [zoneOpen, setZoneOpen] = useState(true);

  const filteredMarkers = markers.filter(
    (marker) =>
      marker.title.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(marker.category)) &&
      (selectedTypes.length === 0 || selectedTypes.includes(marker.type))
  );

  return (
    <div className="app-container">
      <div className="map-wrapper">
        <div className="sidebar">
          <div className="search-section">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Chercher une startup"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="dropdown-section">
            <div className="dropdown">
              <input
                hidden
                className="sr-only"
                name="category-dropdown"
                id="category-dropdown"
                type="checkbox"
                checked={sectorOpen}
                onChange={() => setSectorOpen(!sectorOpen)}
              />
              <label
                aria-label="dropdown scrollbar"
                htmlFor="category-dropdown"
                className="trigger"
              >
                <span className="dropdown-title">Secteur d'activité</span>
                <ChevronDown
                  className={`chevron ${sectorOpen ? "open" : ""}`}
                />
              </label>
              <div className="filter-section list webkit-scrollbar">
                <div className="checkbox-group">
                  {categories.map((category) => (
                    <label key={category} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([
                              ...selectedCategories,
                              category,
                            ]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== category)
                            );
                          }
                        }}
                      />
                      <span>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="dropdown">
              <input
                hidden
                className="sr-only"
                name="type-dropdown"
                id="type-dropdown"
                type="checkbox"
                checked={zoneOpen}
                onChange={() => setZoneOpen(!zoneOpen)}
              />
              <label
                aria-label="dropdown scrollbar"
                htmlFor="type-dropdown"
                className="trigger"
              >
                <span className="dropdown-title">Zone géographique</span>
                <ChevronDown className={`chevron ${zoneOpen ? "open" : ""}`} />
              </label>
              <div className="filter-section list webkit-scrollbar">
                <div className="checkbox-group">
                  {types.map((type) => (
                    <label key={type} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([...selectedTypes, type]);
                          } else {
                            setSelectedTypes(
                              selectedTypes.filter((t) => t !== type)
                            );
                          }
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="button-group">
              <button
                className="cancel-btn"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedTypes([]);
                  setSearchText("");
                }}
              >
                Annuler
              </button>
              <button className="apply-btn">Appliquer</button>
            </div>
          </div>
        </div>

        <MapContainer
          center={[0, 20]}
          zoom={4}
          style={{ height: "90vh", width: "100%" }}
          minZoom={3}
          maxZoom={8}
          className="map"
          scrollWheelZoom={false}
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
                <div className="custom-popup">
                  <h4>{marker.title}</h4>
                  <p>Category: {marker.category}</p>
                  <p>Region: {marker.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
