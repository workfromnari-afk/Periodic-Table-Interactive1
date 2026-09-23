import React, { useState, useMemo, useCallback } from 'react';
import { ChemicalElement, ElementCategory, ElementState } from './types/element';
import { ELEMENTS, searchElements } from './data/elements';
import { Header } from './components/Header';
import { SearchAndFilters } from './components/SearchAndFilters';
import { PeriodicTableGrid } from './components/PeriodicTableGrid';
import { CategoryGroupedView } from './components/CategoryGroupedView';
import { ElementListView } from './components/ElementListView';
import { ElementDetailModal } from './components/ElementDetailModal';
import { QuizModal } from './components/QuizModal';
import { ElementCompareModal } from './components/ElementCompareModal';
import { MemorizeToolbar } from './components/MemorizeToolbar';
import { LegendModal } from './components/LegendModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'table' | 'quiz' | 'memorize' | 'compare'>('table');

  // View Mode: 'grid' (18-group IUPAC) | 'grouped' (Cards by Category) | 'list' (Table)
  const [viewMode, setViewMode] = useState<'grid' | 'grouped' | 'list'>('grid');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');
  const [selectedState, setSelectedState] = useState<ElementState | 'all'>('all');
  const [language, setLanguage] = useState<'th' | 'en'>('th');

  // Element selection & modal
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<ChemicalElement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Compare modal state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareElementA, setCompareElementA] = useState<ChemicalElement | null>(null);
  const [compareElementB, setCompareElementB] = useState<ChemicalElement | null>(null);

  // Quiz modal state
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Legend modal state
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Memorization options
  const [memorizeConfig, setMemorizeConfig] = useState({
    hideSymbol: false,
    hideName: true,
    hideNumber: false,
  });

  // Filter elements logic
  const filteredElements = useMemo(() => {
    let result = searchElements(searchQuery, ELEMENTS);

    if (selectedCategory !== 'all') {
      result = result.filter((el) => el.category === selectedCategory);
    }

    if (selectedState !== 'all') {
      result = result.filter((el) => el.state === selectedState);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedState]);

  const matchedElementIds = useMemo(() => {
    return new Set(filteredElements.map((el) => el.atomicNumber));
  }, [filteredElements]);

  const hasActiveFilter = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      selectedCategory !== 'all' ||
      selectedState !== 'all'
    );
  }, [searchQuery, selectedCategory, selectedState]);

  // Handle clicking on an element
  const handleSelectElement = useCallback((element: ChemicalElement) => {
    setSelectedElement(element);
    setIsDetailOpen(true);
  }, []);

  // Handle previous/next element navigation
  const handleSelectPrevious = useCallback(() => {
    if (!selectedElement) return;
    const prevNumber = selectedElement.atomicNumber <= 1 ? 118 : selectedElement.atomicNumber - 1;
    const prevEl = ELEMENTS.find((e) => e.atomicNumber === prevNumber);
    if (prevEl) setSelectedElement(prevEl);
  }, [selectedElement]);

  const handleSelectNext = useCallback(() => {
    if (!selectedElement) return;
    const nextNumber = selectedElement.atomicNumber >= 118 ? 1 : selectedElement.atomicNumber + 1;
    const nextEl = ELEMENTS.find((e) => e.atomicNumber === nextNumber);
    if (nextEl) setSelectedElement(nextEl);
  }, [selectedElement]);

  // Random element picker
  const handleRandomElement = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * ELEMENTS.length);
    setSelectedElement(ELEMENTS[randomIdx]);
    setIsDetailOpen(true);
  }, []);

  // Add element to comparison
  const handleAddToCompare = useCallback((element: ChemicalElement) => {
    setCompareElementA(element);
    setIsDetailOpen(false);
    setIsCompareOpen(true);
  }, []);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedState('all');
  }, []);

  // Navigation tab switcher handler
  const handleTabChange = useCallback((tab: 'table' | 'quiz' | 'memorize' | 'compare') => {
    setActiveTab(tab);
    if (tab === 'quiz') {
      setIsQuizOpen(true);
    } else if (tab === 'compare') {
      setIsCompareOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onRandomElement={handleRandomElement}
        onOpenLegend={() => setIsLegendOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {/* Hero Section */}
        <section className="text-center py-3 sm:py-5 mb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>ตารางธาตุแบบ Interactive</span>
            <span className="text-xs sm:text-sm font-semibold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
              IUPAC 118 ธาตุ
            </span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            สีสันชัดเจน จำแนกหมวดหมู่ง่าย ปรับขนาดใหญ่สบายตา พร้อมข้อมูลเคมีครบถ้วนและการใช้งานจริง
          </p>
        </section>

        {/* Memorize Toolbar when memorize tab is active */}
        {activeTab === 'memorize' && (
          <MemorizeToolbar
            hideSymbol={memorizeConfig.hideSymbol}
            setHideSymbol={(val) =>
              setMemorizeConfig((c) => ({ ...c, hideSymbol: val }))
            }
            hideName={memorizeConfig.hideName}
            setHideName={(val) =>
              setMemorizeConfig((c) => ({ ...c, hideName: val }))
            }
            hideNumber={memorizeConfig.hideNumber}
            setHideNumber={(val) =>
              setMemorizeConfig((c) => ({ ...c, hideNumber: val }))
            }
            onReset={() =>
              setMemorizeConfig({
                hideSymbol: false,
                hideName: false,
                hideNumber: false,
              })
            }
          />
        )}

        {/* Search & Filter Section */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          language={language}
          onLanguageToggle={() =>
            setLanguage((l) => (l === 'th' ? 'en' : 'th'))
          }
          matchCount={filteredElements.length}
          totalCount={ELEMENTS.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
        />

        {/* Dynamic View Section based on viewMode */}
        {viewMode === 'grid' && (
          <PeriodicTableGrid
            elements={ELEMENTS}
            selectedElement={selectedElement}
            hoveredElement={hoveredElement}
            matchedElementIds={matchedElementIds}
            hasActiveFilter={hasActiveFilter}
            language={language}
            memorizeConfig={activeTab === 'memorize' ? memorizeConfig : undefined}
            onSelectElement={handleSelectElement}
            onHoverElement={setHoveredElement}
            onFilterCategory={(cat) => setSelectedCategory(cat)}
          />
        )}

        {viewMode === 'grouped' && (
          <CategoryGroupedView
            elements={filteredElements}
            selectedElement={selectedElement}
            language={language}
            onSelectElement={handleSelectElement}
          />
        )}

        {viewMode === 'list' && (
          <ElementListView
            elements={filteredElements}
            language={language}
            onSelectElement={handleSelectElement}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Element Detail Modal */}
      {isDetailOpen && (
        <ElementDetailModal
          element={selectedElement}
          onClose={() => setIsDetailOpen(false)}
          onSelectPrevious={handleSelectPrevious}
          onSelectNext={handleSelectNext}
          onAddToCompare={handleAddToCompare}
        />
      )}

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => {
          setIsQuizOpen(false);
          setActiveTab('table');
        }}
        onSelectElement={(el) => {
          setSelectedElement(el);
          setIsDetailOpen(true);
        }}
      />

      {/* Element Compare Modal */}
      <ElementCompareModal
        isOpen={isCompareOpen}
        onClose={() => {
          setIsCompareOpen(false);
          setActiveTab('table');
        }}
        initialElementA={compareElementA}
        initialElementB={compareElementB}
      />

      {/* Legend & Guide Modal */}
      <LegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />
    </div>
  );
}
