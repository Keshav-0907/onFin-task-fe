'use client'
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import useServedAreas from '@/hooks/useServedAreas'
import { useAreaStore } from '@/store/useAreaStore'

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is not defined')
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface MapProps {
    center?: [number, number]
    zoom?: number
    className?: string
}

const MapContainer = ({
    center = [77.5946, 12.9716],
    zoom = 10,
}: MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const { areas } = useServedAreas()
    const setActivePinCode = useAreaStore(state => state.setActivePinCode)

    const servedPinCodes = areas.map(area => area.pinCode)

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center,
            zoom,
            maxZoom: 17
        })

        mapRef.current.on('load', () => {
            mapRef.current?.addSource('pincode-boundaries', {
                type: 'geojson',
                data: '/boundary.geojson',
            })

            // boundary
            mapRef.current?.addLayer({
                id: 'pincode-outline',
                type: 'line',
                source: 'pincode-boundaries',
                paint: {
                    'line-color': [
                        'case',
                        ['in', ['get', 'pin_code'], ['literal', servedPinCodes]],
                        '#38b2ac',
                        '#e53e3e'
                    ],
                    'line-width': 1,
                    'line-dasharray': [
                        'case',
                        ['in', ['get', 'pin_code'], ['literal', servedPinCodes]],
                        ['literal', [1, 0]],
                        ['literal', [2, 2]]
                    ]
                }
            })


            // fill
            mapRef.current?.addLayer({
                id: 'pincode-fill',
                type: 'fill',
                source: 'pincode-boundaries',
                paint: {
                    'fill-color': [
                        'case',
                        ['in', ['get', 'pin_code'], ['literal', servedPinCodes]],
                        '#38b2ac',
                        '#e53e3e'
                    ],
                    'fill-opacity': [
                        'case',
                        ['in', ['get', 'pin_code'], ['literal', servedPinCodes]],
                        0.3,
                        0.4
                    ]
                }
            })

             mapRef.current?.on('click', 'pincode-fill', (e) => {
                if (mapRef.current) {
                    mapRef.current.getCanvas().style.cursor = 'pointer'
                }

                const properties = e.features?.[0]?.properties;
                const pinCode = properties?.pin_code;

                setActivePinCode(pinCode)
            })           

            
        })

        return () => {
            mapRef.current?.remove()
            mapRef.current = null
        }
    }, [center, zoom])

    return (
        <div ref={mapContainerRef} className="w-full h-full" />
    )
}

export default MapContainer
