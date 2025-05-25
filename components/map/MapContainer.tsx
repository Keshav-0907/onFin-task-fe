'use client'
import React, { useState } from 'react'
import { useEffect, useRef, memo } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import { useAreaStore } from '@/store/useAreaStore'
import type { FeatureCollection, Polygon } from 'geojson'
import RateLimitModal from './RateLimitModal'
import { baseURL } from '@/config/config';

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is not defined')
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface MapProps {
    center?: [number, number]
    zoom?: number
    className?: string
}

interface AxiosError {
    response: {
        status: number
        data: {
            message: string
        }
    }
}

interface RawAreaData {
    name: string
    pinCode: string
    isServed: boolean
    activeFrom: string
    geometry: {
        type: 'Polygon'
        coordinates: number[][][]
    }
}

const MapContainer = ({ center = [77.5946, 12.9716], zoom = 10 }: MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const setActivePinCode = useAreaStore(state => state.setActivePinCode)
    const [rateLimitHit, setRateLimitHit] = useState<boolean>(false)

    const onAreaSelect = (pinCode: number) => {
        setActivePinCode(pinCode)
    }

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return

        const initMap = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/areas/allAreas`)
                const raw = res.data.data

                const geojson: FeatureCollection<Polygon> = {
                    type: 'FeatureCollection',
                    features: raw.map((area: RawAreaData) => ({
                        id: area.pinCode,
                        type: 'Feature',
                        properties: {
                            name: area.name,
                            pinCode: area.pinCode,
                            isServed: area.isServed,
                            activeFrom: area.activeFrom,
                        },
                        geometry: area.geometry,
                    })),
                }

                const map = new mapboxgl.Map({
                    container: mapContainerRef.current!,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center,
                    zoom,
                    maxZoom: 17,
                })

                mapRef.current = map

                const servedPinCodes = raw
                    .filter((area: RawAreaData) => area.isServed)
                    .map((area: RawAreaData) => area.pinCode)

                const lockedPinCodes = raw
                    .filter((area: RawAreaData) => !area.isServed)
                    .map((area: RawAreaData) => area.pinCode)

                map.on('load', () => {

                    // main layer 
                    map.addSource('pincode-boundaries', {
                        type: 'geojson',
                        data: geojson,
                    })

                    // boundary layer
                    map.addSource('all-pincode-points', {
                        type: 'geojson',
                        data: '/boundary.geojson',
                    })

                    map.addLayer({
                        id: 'pincode-points',
                        type: 'line',
                        source: 'all-pincode-points',
                        paint: {
                            'line-width': 1,
                            'line-opacity': 0.4,
                        },
                    })

                    map.addLayer({
                        id: 'pincode-outline',
                        type: 'line',
                        source: 'pincode-boundaries',
                        paint: {
                            'line-color': [
                                'case',
                                ['in', ['get', 'pinCode'], ['literal', servedPinCodes]],
                                '#38b2ac',
                                '#e53e3e',
                            ],
                            'line-width': 1.5,
                            'line-dasharray': [
                                'case',
                                ['in', ['get', 'pinCode'], ['literal', lockedPinCodes]],
                                ['literal', [2, 2]],
                                ['literal', [1, 0]],
                            ],
                        },
                    })

                    map.addLayer({
                        id: 'pincode-fill',
                        type: 'fill',
                        source: 'pincode-boundaries',
                        paint: {
                            'fill-color': [
                                'case',
                                ['in', ['get', 'pinCode'], ['literal', servedPinCodes]],
                                '#38b2ac',
                                '#e53e3e',
                            ],
                            'fill-opacity': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                0.6,
                                ['in', ['get', 'pinCode'], ['literal', lockedPinCodes]],
                                0.3,
                                0.4,
                            ],
                        },
                    })

                    let hoveredStateId: string | number | null = null

                    map.on('mousemove', 'pincode-fill', (e) => {
                        if (e.features?.length) {
                            const featureId = e.features[0].id
                            if (hoveredStateId !== null && hoveredStateId !== featureId) {
                                map.setFeatureState(
                                    { source: 'pincode-boundaries', id: hoveredStateId },
                                    { hover: false }
                                )
                            }

                            if (featureId !== undefined) {
                                hoveredStateId = featureId
                                map.setFeatureState(
                                    { source: 'pincode-boundaries', id: hoveredStateId },
                                    { hover: true }
                                )
                            }
                            map.getCanvas().style.cursor = 'pointer'
                        }
                    })

                    map.on('mouseleave', 'pincode-fill', () => {
                        if (hoveredStateId !== null) {
                            map.setFeatureState(
                                { source: 'pincode-boundaries', id: hoveredStateId },
                                { hover: false }
                            )
                        }
                        hoveredStateId = null
                        map.getCanvas().style.cursor = ''
                    })

                    map.on('click', 'pincode-fill', (e) => {
                        const pinCode = e.features?.[0]?.properties?.pinCode
                        if (pinCode) {
                            onAreaSelect(pinCode)
                        }
                    })
                })
            } catch (err) {
                const error = err as AxiosError

                if (error.response.status === 429) {
                    setRateLimitHit(true)
                    console.error('Rate limit hit. Please try again later.')
                }
            }
        }

        initMap()

        return () => {
            mapRef.current?.remove()
            mapRef.current = null
        }
    }, [center, zoom, setActivePinCode])

    return <div role="application" aria-label="Bengaluru service map" className='w-full h-full relative'>
        <div ref={mapContainerRef} className="w-full h-full" />
        {rateLimitHit && (
            <RateLimitModal />
        )}
    </div>
}

export default memo(MapContainer)
