import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const RouteModal = ({ orders, origin, onClose }) => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: "route-map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [origin.lon, origin.lat],
            zoom: 10,
        });

        // Mark origin with a red marker
        new mapboxgl.Marker({ color: 'red' })
            .setLngLat([origin.lon, origin.lat])
            .setPopup(new mapboxgl.Popup({ closeOnClick: false }).setText("Origin"))
            .addTo(map)
            .togglePopup();

        // Mark each order location with a popup containing the address
        orders.forEach((order, index) => {
            new mapboxgl.Marker()
                .setLngLat([order.lon, order.lat])
                .setPopup(new mapboxgl.Popup({ closeOnClick: false }).setText(`${order.address}`))
                .addTo(map)
                .togglePopup();
        });

        return () => map.remove();
    }, [orders, origin]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-2xl font-bold">配送路线图</h5>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
                </div>
                <div id="route-map" style={{ width: "100%", height: "400px" }}></div>
            </div>
        </div>
    );
};

export default RouteModal;
