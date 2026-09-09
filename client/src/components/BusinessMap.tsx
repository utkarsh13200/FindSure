import { useCallback, useEffect, useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  MapContainer,
  TileLayer,
  Marker as LeafletMarker,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Business } from "../types";
import { INDIA_BOUNDS, INDIA_CENTER } from "../utils/indiaCities";

const mapContainerStyle = { width: "100%", height: "100%" };

type Props = {
  businesses: Business[];
  center: { lat: number; lng: number };
  selectedId?: string | null;
  userLocation?: { lat: number; lng: number } | null;
  onSelect: (id: string) => void;
  /** When true, frame the whole country (India demo overview). */
  indiaWide?: boolean;
};

function trustPinIcon(business: Business, selected: boolean) {
  const fill = selected
    ? "#1d4ed8"
    : business.trust.concernState !== "NO_CONCERN"
      ? "#d97706"
      : "#059669";
  const scale = selected ? 1.15 : 1;
  const size = 28 * scale;
  const height = 40 * scale;

  return L.divIcon({
    className: "findsure-pin",
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height + 4],
    html: `<svg width="${size}" height="${height}" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${fill}" stroke="#fff" stroke-width="2"/>
      <circle cx="14" cy="14" r="5.5" fill="#fff"/>
    </svg>`,
  });
}

function FitBusinessBounds({
  businesses,
  userLocation,
  indiaWide,
}: {
  businesses: Business[];
  userLocation?: { lat: number; lng: number } | null;
  indiaWide?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (indiaWide && businesses.length === 0) {
      map.fitBounds(INDIA_BOUNDS, { padding: [24, 24] });
      return;
    }

    if (!businesses.length) {
      map.setView([INDIA_CENTER.lat, INDIA_CENTER.lng], 5);
      return;
    }

    // Spread across multiple metros → frame India (or the span of markers)
    const bounds = L.latLngBounds(
      businesses.map((b) => [b.latitude, b.longitude] as [number, number])
    );
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    const spanLat = bounds.getNorth() - bounds.getSouth();
    const spanLng = bounds.getEast() - bounds.getWest();
    const wide = indiaWide || spanLat > 4 || spanLng > 4;

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: wide ? 6 : 14,
    });
  }, [businesses, userLocation, indiaWide, map]);

  return null;
}

function FocusSelected({ business }: { business: Business | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (!business) return;
    map.flyTo([business.latitude, business.longitude], Math.max(map.getZoom(), 13), {
      animate: true,
      duration: 0.6,
    });
  }, [business, map]);

  return null;
}

/**
 * Demo map: real OpenStreetMap street tiles (no API key).
 * Use Google Maps when VITE_GOOGLE_MAPS_API_KEY is configured.
 */
function DemoMap({
  businesses,
  center,
  selectedId,
  userLocation,
  onSelect,
  indiaWide,
}: Props) {
  const selected = useMemo(
    () => businesses.find((b) => b.id === selectedId),
    [businesses, selectedId]
  );

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div className="absolute left-3 top-3 z-[1000] rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow">
        Demo map · India · English labels
      </div>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={indiaWide ? 5 : 12}
        className="h-full w-full"
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        worldCopyJump={false}
        maxBounds={[
          [5, 65],
          [38, 100],
        ]}
        maxBoundsViscosity={0.6}
      >
        {/* Esri street map uses English place names worldwide (no API key).
            Standard OSM tiles bake in local scripts (Arabic, Chinese, etc.). */}
        <TileLayer
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, OpenStreetMap'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <FitBusinessBounds
          businesses={businesses}
          userLocation={userLocation}
          indiaWide={indiaWide}
        />
        <FocusSelected business={selected} />
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={9}
            pathOptions={{
              color: "#fff",
              weight: 3,
              fillColor: "#2563eb",
              fillOpacity: 1,
            }}
          >
            <Popup>Your location</Popup>
          </CircleMarker>
        )}
        {businesses.map((b) => (
          <LeafletMarker
            key={b.id}
            position={[b.latitude, b.longitude]}
            icon={trustPinIcon(b, b.id === selectedId)}
            eventHandlers={{
              click: () => onSelect(b.id),
            }}
            zIndexOffset={b.id === selectedId ? 1000 : 0}
            title={b.name}
          >
            <Popup>
              <strong>{b.name}</strong>
              <br />
              Trust {b.trust.score}/100
            </Popup>
          </LeafletMarker>
        ))}
      </MapContainer>
    </div>
  );
}

function LiveGoogleMap(props: Props & { apiKey: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "findsure-google-maps",
    googleMapsApiKey: props.apiKey,
  });

  const selected = useMemo(
    () => props.businesses.find((b) => b.id === props.selectedId),
    [props.businesses, props.selectedId]
  );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      if (props.indiaWide && !props.businesses.length) {
        map.fitBounds(
          new google.maps.LatLngBounds(
            { lat: INDIA_BOUNDS[0][0], lng: INDIA_BOUNDS[0][1] },
            { lat: INDIA_BOUNDS[1][0], lng: INDIA_BOUNDS[1][1] }
          )
        );
        return;
      }
      if (!props.businesses.length) return;
      const bounds = new google.maps.LatLngBounds();
      props.businesses.forEach((b) =>
        bounds.extend({ lat: b.latitude, lng: b.longitude })
      );
      if (props.userLocation) bounds.extend(props.userLocation);
      map.fitBounds(bounds, 64);
    },
    [props.businesses, props.userLocation, props.indiaWide]
  );

  if (loadError) {
    return <DemoMap {...props} />;
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Loading map…
      </div>
    );
  }

  return (
    <div className="h-full min-h-[320px] overflow-hidden rounded-2xl border border-slate-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={
          selected
            ? { lat: selected.latitude, lng: selected.longitude }
            : props.center
        }
        zoom={props.indiaWide ? 5 : 13}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {props.userLocation && (
          <Marker
            position={props.userLocation}
            title="Your location"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#2563eb",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            }}
          />
        )}
        {props.businesses.map((b) => (
          <Marker
            key={b.id}
            position={{ lat: b.latitude, lng: b.longitude }}
            title={b.name}
            onClick={() => props.onSelect(b.id)}
            opacity={props.selectedId && props.selectedId !== b.id ? 0.65 : 1}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export function BusinessMap(props: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!apiKey) {
    return <DemoMap {...props} />;
  }
  return <LiveGoogleMap {...props} apiKey={apiKey} />;
}
