import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
    html: `<div style="background-color: ${getCategoryColor(
      category
    )};">02</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

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
            <input
              type="text"
              className="search-input"
              placeholder="Chercher une startup"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <h3>Secteur d'activité</h3>
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
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Zone géographique</h3>
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
                  {type}
                </label>
              ))}
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

        <MapContainer
          center={[0, 20]} // Center on Africa
          zoom={4}
          style={{ height: "100vh", width: "100%" }}
          minZoom={3}
          maxZoom={8}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
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
