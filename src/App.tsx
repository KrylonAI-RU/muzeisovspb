import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutMuseum } from './components/AboutMuseum';
import { ExhibitsGrid } from './components/ExhibitsGrid';
import { SimulatorsSection } from './components/SimulatorsSection';
import { MuseumHallPlan } from './components/MuseumHallPlan';
import { MapSection } from './components/MapSection';
import { VisitInfo } from './components/VisitInfo';
import { Footer } from './components/Footer';
import { CoinMatchboxModal } from './components/CoinMatchboxModal';
import { ExhibitModal } from './components/ExhibitModal';
import { Exhibit } from './data/exhibits';

export default function App() {
  const [coins, setCoins] = useState<number>(15);
  const [isMatchboxOpen, setIsMatchboxOpen] = useState<boolean>(false);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [selectedSimulator, setSelectedSimulator] = useState<'morskoi-boi' | 'basketball' | 'magistral'>('morskoi-boi');

  // Decrement coin when played
  const handleUseCoin = () => {
    setCoins((prev) => Math.max(0, prev - 1));
  };

  // Drop coin directly
  const handleDropCoin = () => {
    if (coins > 0) {
      setCoins((prev) => prev - 1);
    }
  };

  // Add 15 more coins from the museum box office
  const handleAddCoins = () => {
    setCoins((prev) => prev + 15);
  };

  // Play simulator from catalog or modal
  const handlePlaySimulator = (simType: 'morskoi-boi' | 'basketball' | 'magistral') => {
    setSelectedSimulator(simType);
    const simSection = document.getElementById('simulators');
    if (simSection) {
      simSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Bar Header */}
      <Header
        coins={coins}
        onOpenMatchbox={() => setIsMatchboxOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          coins={coins}
          onDropCoin={handleDropCoin}
          onOpenMatchbox={() => setIsMatchboxOpen(true)}
        />

        {/* Detailed History & About Museum Section */}
        <AboutMuseum />

        {/* Featured Exhibits Catalog */}
        <ExhibitsGrid
          onSelectExhibit={(exhibit) => setSelectedExhibit(exhibit)}
          onPlaySimulator={handlePlaySimulator}
        />

        {/* Interactive Playable Simulators */}
        <SimulatorsSection
          coins={coins}
          onUseCoin={handleUseCoin}
          initialSimulator={selectedSimulator}
        />

        {/* Museum Floor Blueprint Plan */}
        <MuseumHallPlan
          onSelectExhibit={(exhibit) => setSelectedExhibit(exhibit)}
        />

        {/* Yandex 3D Panorama & Location Maps */}
        <MapSection />

        {/* Practical Visit Info & Soviet Buffet */}
        <VisitInfo />
      </main>

      {/* Footer with Project Credits */}
      <Footer />

      {/* Interactive Matchbox Modal */}
      <CoinMatchboxModal
        isOpen={isMatchboxOpen}
        onClose={() => setIsMatchboxOpen(false)}
        coins={coins}
        onAddCoins={handleAddCoins}
        onDropCoin={handleDropCoin}
      />

      {/* Exhibit Passport Modal */}
      <ExhibitModal
        exhibit={selectedExhibit}
        onClose={() => setSelectedExhibit(null)}
        onPlaySimulator={handlePlaySimulator}
      />
    </div>
  );
}
