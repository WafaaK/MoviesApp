import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './CinemaModal.css';
import 'leaflet/dist/leaflet.css';

const NearbyCinemasModal = ({ onClose, nearbyCinemas }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Nearby Cinemas</h2>
                {nearbyCinemas && (
                    <div className="map-container">
                        <MapContainer
                            center={[nearbyCinemas.lat, nearbyCinemas.lon]}
                            zoom={13}
                            style={{ width: '400px', height: '400px' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[nearbyCinemas.lat, nearbyCinemas.lon]}>
                                <Popup>{nearbyCinemas.displayName}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NearbyCinemasModal;