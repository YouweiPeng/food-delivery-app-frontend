import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import polyline from '@mapbox/polyline';

const RouteModal = ({ orders, optimizedRoute, onClose }) => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    useEffect(() => {
        if (!optimizedRoute.geometry) return;

        // Decode the polyline to get ordered route coordinates
        const routeCoordinates = polyline.decode(optimizedRoute.geometry).map(([lat, lon]) => [lon, lat]);

        // Initialize the map
        const map = new mapboxgl.Map({
            container: "route-map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: routeCoordinates[0],  // center on the starting point
            zoom: 10,
        });

        map.on('load', () => {
            map.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoordinates
                    }
                }
            });

            map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3b82f6',
                    'line-width': 5,
                }
            });

            // Add a red marker for the origin
            new mapboxgl.Marker({ color: 'red' })
                .setLngLat(optimizedRoute.waypoints[0].location)
                .setPopup(new mapboxgl.Popup().setText("Origin"))
                .addTo(map);

            // Add markers for each waypoint (excluding origin)
            optimizedRoute.waypoints.slice(1).forEach((waypoint, index) => {
                new mapboxgl.Marker()
                    .setLngLat(waypoint.location)
                    .setPopup(new mapboxgl.Popup().setText(`\n 第${index + 1}站`)) // +2 to account for origin
                    .addTo(map)
                    .togglePopup();
            });

            // Fit map bounds to include the entire route
            const bounds = routeCoordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds());
            map.fitBounds(bounds, { padding: 60 });
        });

        return () => map.remove();
    }, [optimizedRoute]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-2xl font-bold">优化的送货路线</h5>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
                </div>
                <div id="route-map" style={{ width: "100%", height: "400px" }}></div>
                <div className="mt-4 overflow-y-auto max-h-40">
                    <p className="text-lg font-bold">配送顺序：</p>
                    {optimizedRoute.waypoints && orders.map((order, index) => (
                        <p key={index} className="text-lg">
                            {index + 1}. {order.address}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RouteModal;
