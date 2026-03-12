"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import api from "@/lib/api";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const CurrentIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapMarker {
  id: string;
  title: string;
  slug: string;
  specificLocation: string;
  fullLocation: string;
  coords: [number, number];
  isCurrent: boolean;
  portfolioId: string;
}

function MapFitBounds({ targetMarkers }: { targetMarkers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (!targetMarkers || targetMarkers.length === 0) return;
    if (targetMarkers.length === 1) {
      map.flyTo(targetMarkers[0].coords, 9, { animate: true, duration: 1.5 });
    } else {
      const bounds = L.latLngBounds(targetMarkers.map((m) => m.coords));
      map.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
        duration: 1.5,
      });
    }
  }, [map, targetMarkers]);
  return null;
}

export default function PortfolioMap({
  currentPortfolioId,
}: {
  currentPortfolioId?: string;
}) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await api.get("/api/v1/portfolios");
        const allPortfolios = res.data.data || [];
        const mapMarkers: MapMarker[] = [];

        allPortfolios.forEach((p: any) => {
          // 🌟 PERUBAHAN UTAMA:
          // Jika peta ini dipanggil dari halaman spesifik (memiliki currentPortfolioId),
          // maka HENTIKAN/ABAIKAN data dari portofolio sektor lain!
          if (currentPortfolioId && p.id !== currentPortfolioId) {
            return;
          }

          if (p.locations && Array.isArray(p.locations)) {
            // Gabungkan semua nama wilayah dari array object JSON
            const fullLocString = p.locations
              .map((l: any) => l.name)
              .join(", ");

            p.locations.forEach((loc: any, index: number) => {
              if (
                loc.lat !== undefined &&
                loc.lng !== undefined &&
                loc.lat !== 0 &&
                loc.lng !== 0
              ) {
                mapMarkers.push({
                  id: `${p.id}-pin-${index}`,
                  portfolioId: p.id,
                  title: p.title,
                  slug: p.slug,
                  specificLocation: loc.name,
                  fullLocation: fullLocString,
                  coords: [loc.lat, loc.lng],
                  // Jika disaring, otomatis titik ini adalah current
                  isCurrent: p.id === currentPortfolioId,
                });
              }
            });
          }
        });

        setMarkers(mapMarkers);
      } catch (error) {
        console.error("Gagal memuat data peta:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMapData();
  }, [currentPortfolioId]);

  if (isLoading) {
    return (
      <div className="w-full aspect-[4/3] md:aspect-video rounded-[2.5rem] bg-secondary/30 border border-border flex items-center justify-center">
        <p className="text-primary font-medium animate-pulse">
          Memetakan Titik...
        </p>
      </div>
    );
  }

  const defaultCenter: [number, number] = [-0.789, 113.921];

  // Karena kita sudah memfilter di atas, seluruh markers yang ada di array saat ini adalah target bounds
  const targetBoundsMarkers = markers.length > 0 ? markers : [];

  return (
    <div className="w-full aspect-[4/3] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-border shadow-sm z-10 relative">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFitBounds targetMarkers={targetBoundsMarkers} />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.coords}
            icon={marker.isCurrent ? CurrentIcon : DefaultIcon}
            zIndexOffset={marker.isCurrent ? 1000 : 0}
          >
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-1">
                <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                  Titik: {marker.specificLocation}
                </span>
                <strong className="text-sm font-extrabold text-primary block mb-1 line-clamp-2">
                  {marker.title}
                </strong>
                <p className="text-[10px] text-muted-foreground mb-3">
                  Cakupan: {marker.fullLocation}
                </p>

                {/* Tombol ini hanya akan muncul jika peta dipanggil secara umum (tanpa currentPortfolioId) */}
                {!marker.isCurrent && (
                  <Link
                    href={`/jejak-karya/${marker.slug}`}
                    className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full inline-block"
                  >
                    Lihat Sektor Ini
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
