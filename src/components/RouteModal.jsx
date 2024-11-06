import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import polyline from '@mapbox/polyline';

const RouteModal = ({ origin, routeData, orders, onClose }) => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    useEffect(() => {
        const routeCoordinates = polyline.decode(routeData.geometry).map(([lat, lon]) => [lon, lat]);

        const map = new mapboxgl.Map({
            container: "route-map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [origin.lon, origin.lat],
            zoom: 10,
        });

        map.on('load', () => {
            // Draw the route line
            map.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoordinates,
                    },
                },
            });

            map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#3b82f6', 'line-width': 5 },
            });

            // Add red marker for the origin (delivery person's current location)
            new mapboxgl.Marker({ color: 'red' })
                .setLngLat([origin.lon, origin.lat])
                .setPopup(new mapboxgl.Popup({ closeOnClick: false }).setText("当前位置"))
                .addTo(map)
                .togglePopup();

            // Add markers for each order location, including the closest one
            orders.forEach((order, index) => {
                new mapboxgl.Marker()
                    .setLngLat([order.lon, order.lat])
                    .setPopup(new mapboxgl.Popup({ closeOnClick: false }).setText(order.address))
                    .addTo(map)
                    .togglePopup();
            });

            // Fit map bounds to include the entire route and all markers
            const bounds = routeCoordinates.reduce(
                (bounds, coord) => bounds.extend(coord),
                new mapboxgl.LngLatBounds()
            );
            orders.forEach(order => bounds.extend([order.lon, order.lat]));
            map.fitBounds(bounds, { padding: 60 });
        });

        return () => map.remove();
    }, [origin, routeData, orders]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-2xl font-bold">完整送货路线</h5>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
                </div>
                <div id="route-map" style={{ width: "100%", height: "400px" }}></div>
            </div>
        </div>
    );
};

export default RouteModal;
