"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

function markerIcon(L: typeof import("leaflet")) {
  return L.icon({
    iconUrl: "/leaflet/marker-icon.png",
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    shadowUrl: "/leaflet/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

export default function LocationPicker({
  latName = "latitude",
  lonName = "longitude",
  defaultLat,
  defaultLon,
}: {
  latName?: string;
  lonName?: string;
  defaultLat?: number | null;
  defaultLon?: number | null;
}) {
  const t = useTranslations("LocationPicker");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(
    defaultLat != null && defaultLon != null ? { lat: defaultLat, lon: defaultLon } : null
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const startLat = position?.lat ?? 32.0853;
      const startLon = position?.lon ?? 34.7818;

      const map = L.map(mapContainerRef.current).setView([startLat, startLon], position ? 14 : 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = markerIcon(L);

      if (position) {
        markerRef.current = L.marker([position.lat, position.lon], { icon, draggable: true }).addTo(map);
      }

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lon: lng });
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
          markerRef.current.on("dragend", () => {
            const p = markerRef.current!.getLatLng();
            setPosition({ lat: p.lat, lon: p.lng });
          });
        }
      });

      markerRef.current?.on("dragend", () => {
        const p = markerRef.current!.getLatLng();
        setPosition({ lat: p.lat, lon: p.lng });
      });

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  async function selectResult(result: NominatimResult) {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setPosition({ lat, lon });
    setResults([]);
    setQuery(result.display_name);

    const L = await import("leaflet");
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 15);
      const icon = markerIcon(L);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
      } else {
        markerRef.current = L.marker([lat, lon], { icon, draggable: true }).addTo(mapRef.current);
        markerRef.current.on("dragend", () => {
          const p = markerRef.current!.getLatLng();
          setPosition({ lat: p.lat, lon: p.lng });
        });
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(e);
          }}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {searching ? t("searching") : t("search")}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="max-h-32 overflow-y-auto rounded-md border border-slate-200 bg-white text-xs">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => selectResult(r)}
                className="block w-full px-2 py-1.5 text-left hover:bg-slate-50"
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div ref={mapContainerRef} className="h-48 w-full rounded-md border border-slate-300" />

      <p className="text-[11px] text-slate-400">{t("hint")}</p>

      <input type="hidden" name={latName} value={position?.lat ?? ""} />
      <input type="hidden" name={lonName} value={position?.lon ?? ""} />
    </div>
  );
}
