// AddressConfirmModal.js
import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { setModalAddressConfirm, setExtraFee } from "../store/interfaceSlice";
import { useDispatch, useSelector } from "react-redux";

const AddressConfirmModal = ({ onConfirm }) => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const dispatch = useDispatch();
    const origin = { lat: 53.525665, lon: -113.520787 };
    const coordinates = useSelector((state) => state.interfaceSlice.coordinates[0]);
    const full_address = useSelector((state) => state.interfaceSlice.coordinates[1]);
    const destination = { lat: coordinates[1], lon: coordinates[0] };
    const distance = useSelector((state) => state.interfaceSlice.distance);
    const routes = useSelector((state) => state.interfaceSlice.route);

    let extraFeeText = "地址在免运费范围内";
    let extraFee = 0;
    if (distance > 10 && distance < 15) {
        extraFeeText = "地址超过10公里，将收取12元运费";
        extraFee = 12;
    } else if (distance >= 15 && distance < 20) {
        extraFeeText = "地址超过15公里，将收取20元运费";
        extraFee = 20;
    }
    else if (distance > 20) {
        extraFeeText = "地址超过20公里，将收取25元运费";
        extraFee = 25;
    }
    useEffect(() => {
        dispatch(setExtraFee(extraFee));
    }, [extraFee, dispatch]);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [(origin.lon + destination.lon) / 2, (origin.lat + destination.lat) / 2],
            zoom: 12,
        });

        new mapboxgl.Marker({ color: "red" })
            .setLngLat([origin.lon, origin.lat])
            .addTo(map);
        new mapboxgl.Marker({ color: "blue" })
            .setLngLat([destination.lon, destination.lat])
            .addTo(map);

        map.on('load', () => {
            map.addSource('route', {
                'type': 'geojson',
                'data': routes
            });

            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#4285F4',
                    'line-width': 7,
                }
            });
        });

        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([origin.lon, origin.lat]);
        bounds.extend([destination.lon, destination.lat]);
        map.fitBounds(bounds, { padding: 60 });
        new mapboxgl.Popup({ closeOnClick: true, anchor: 'top-left' })
            .setLngLat(coordinates)
            .setHTML(`<h3>您的地址:${full_address}</h3>`)
            .addTo(map);

        return () => map.remove();
    }, [origin, destination, routes]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="address-confirm-modal">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-2xl font-bold">确认配送地址</h5>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => dispatch(setModalAddressConfirm())}
                    >
                        ✕
                    </button>
                </div>
                <div id="map" style={{ width: "100%", height: "300px" }}></div>
                <div className="mt-4">
                    <p className="text-lg">
                        配送距离: <span className="font-bold">{distance} km</span>
                    </p>
                    <h2 className="font-bold">{extraFeeText}</h2>
                    <p className="font-light">注：以学校hub为起点，10公里以内免配送费，10公里-15公里收取12元运费，超过15公里收取20元运费</p>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={() => {
                            onConfirm(); // Call onConfirm to submit the form
                        }}
                    >
                        确认
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressConfirmModal;
