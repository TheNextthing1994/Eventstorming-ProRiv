/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DatabaseState, TopicId, Language } from './types';
import {
  initializeDatabase,
  loadEntireDatabase
} from './db/indexedDb';
import { Header } from './components/Header';
import { SeniorWorkshop } from './components/SeniorWorkshop';
import { OriginalSketchCanvas } from './components/OriginalSketchCanvas';
import { TopicDetailView } from './components/TopicDetailView';
import { GlobalOverview } from './components/GlobalOverview';
import { CompetitorHub } from './components/CompetitorHub';
import { EventStormingHub } from './components/EventStormingHub';
import { SeniorDecisionsHub } from './components/SeniorDecisionsHub';
import { PresentationMode } from './components/PresentationMode';
import { CalibrationModal } from './components/CalibrationModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ImportExportModal } from './components/ImportExportModal';
import { TOPIC_DEFINITIONS } from './db/defaultData';

export default function App() {
  const [databaseState, setDatabaseState] = useState<DatabaseState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Language state (Russian / German / Bilingual) - defaults to 'ru' since the Senior speaks Russian
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('isa_language');
    if (saved === 'ru' || saved === 'de' || saved === 'bilingual') {
      return saved as Language;
    }
    return 'ru';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('isa_language', newLang);
  };

  // Navigation states synced with URL Hash
  const [currentView, setCurrentView] = useState<
    'home' | 'workshop' | 'topic' | 'overview' | 'competitors' | 'event-storming' | 'senior-decisions' | 'presentation'
  >('home');
  const [currentTopicId, setCurrentTopicId] = useState<TopicId>('mobile-app');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);

  // Refresh entire DB state from IndexedDB
  const refreshData = useCallback(async () => {
    const data = await loadEntireDatabase();
    setDatabaseState(data);
  }, []);

  // Initialize DB on boot
  useEffect(() => {
    let isMounted = true;
    initializeDatabase()
      .then((state) => {
        if (isMounted) {
          setDatabaseState(state);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to initialize database', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync URL hash with app view state for browser back/forward and bookmarking
  const syncHashToState = useCallback(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash || hash === 'home') {
      setCurrentView('home');
    } else if (hash.startsWith('topic/')) {
      const topic = hash.replace('topic/', '') as TopicId;
      if (TOPIC_DEFINITIONS[topic]) {
        setCurrentTopicId(topic);
        setCurrentView('topic');
      } else {
        setCurrentView('home');
      }
    } else if (hash === 'workshop') {
      setCurrentView('workshop');
    } else if (hash === 'overview') {
      setCurrentView('overview');
    } else if (hash === 'competitors') {
      setCurrentView('competitors');
    } else if (hash === 'event-storming') {
      setCurrentView('event-storming');
    } else if (hash === 'senior-decisions') {
      setCurrentView('senior-decisions');
    } else if (hash.startsWith('presentation')) {
      const parts = hash.split('/');
      if (parts[1] && TOPIC_DEFINITIONS[parts[1] as TopicId]) {
        setCurrentTopicId(parts[1] as TopicId);
      }
      setCurrentView('presentation');
    }
  }, []);

  useEffect(() => {
    syncHashToState();
    window.addEventListener('hashchange', syncHashToState);
    return () => window.removeEventListener('hashchange', syncHashToState);
  }, [syncHashToState]);

  // Navigate function that pushes hash
  const navigateTo = (view: string, topicId?: TopicId) => {
    if (view === 'home') {
      window.location.hash = '#/';
      setCurrentView('home');
    } else if (view === 'topic') {
      const targetTopic = topicId || currentTopicId;
      window.location.hash = `#/topic/${targetTopic}`;
      setCurrentTopicId(targetTopic);
      setCurrentView('topic');
    } else if (view === 'workshop') {
      window.location.hash = '#/workshop';
      setCurrentView('workshop');
    } else if (view === 'overview') {
      window.location.hash = '#/overview';
      setCurrentView('overview');
    } else if (view === 'competitors') {
      window.location.hash = '#/competitors';
      setCurrentView('competitors');
    } else if (view === 'event-storming') {
      window.location.hash = '#/event-storming';
      setCurrentView('event-storming');
    } else if (view === 'senior-decisions') {
      window.location.hash = '#/senior-decisions';
      setCurrentView('senior-decisions');
    } else if (view === 'presentation') {
      window.location.hash = `#/presentation/${topicId || currentTopicId}`;
      if (topicId) setCurrentTopicId(topicId);
      setCurrentView('presentation');
    }
  };

  // Keyboard shortcuts (Cmd+K / Ctrl+K for search, P for presentation, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (!isInput && e.key === 'p' && currentView !== 'presentation') {
        navigateTo('presentation');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, currentTopicId]);

  if (isLoading || !databaseState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-600 font-sans">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <div className="text-xs font-medium tracking-tight">
          {language === 'ru'
            ? 'Инициализация платформы знаний ISA...'
            : 'Initialisiere ISA Wissensplattform...'}
        </div>
      </div>
    );
  }

  // Presentation mode view
  if (currentView === 'presentation') {
    return (
      <PresentationMode
        initialTopicId={currentTopicId}
        databaseState={databaseState}
        language={language}
        onLanguageChange={handleLanguageChange}
        onExit={() => navigateTo('topic', currentTopicId)}
        onNavigateHome={() => navigateTo('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        currentTopicId={currentTopicId}
        language={language}
        onLanguageChange={handleLanguageChange}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onTogglePresentation={() => navigateTo('presentation', currentTopicId)}
        isPresentationActive={false}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <OriginalSketchCanvas
            databaseState={databaseState}
            language={language}
            onSelectTopic={(topicId) => navigateTo('topic', topicId)}
            onStartWorkshop={() => navigateTo('workshop')}
            onNavigateSection={(section) => navigateTo(section)}
            onOpenCalibration={() => setIsCalibrationOpen(true)}
            onImageChanged={(dataUrl) => {
              setDatabaseState(prev => prev ? { ...prev, customImage: dataUrl } : null);
            }}
          />
        )}

        {currentView === 'workshop' && (
          <SeniorWorkshop
            databaseState={databaseState}
            language={language}
            onNavigateHome={() => navigateTo('home')}
            onSelectTopic={(topicId) => navigateTo('topic', topicId)}
            onNavigateSection={(section) => navigateTo(section)}
          />
        )}

        {currentView === 'topic' && (
          <TopicDetailView
            topicId={currentTopicId}
            databaseState={databaseState}
            language={language}
            onNavigateHome={() => navigateTo('home')}
            onSelectTopic={(topicId) => navigateTo('topic', topicId)}
            onRefreshData={refreshData}
          />
        )}

        {currentView === 'overview' && (
          <GlobalOverview
            databaseState={databaseState}
            language={language}
            onSelectTopic={(topicId) => navigateTo('topic', topicId)}
            onNavigateHome={() => navigateTo('home')}
            onNavigateSection={(section) => navigateTo(section)}
          />
        )}

        {currentView === 'competitors' && (
          <CompetitorHub
            databaseState={databaseState}
            language={language}
            onSelectTopic={(topicId) => navigateTo('topic', topicId)}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentView === 'event-storming' && (
          <EventStormingHub
            language={language}
            onNavigateHome={() => navigateTo('home')}
            onSelectTopic={(topicId) => navigateTo('topic', topicId)}
          />
        )}

        {currentView === 'senior-decisions' && (
          <SeniorDecisionsHub
            language={language}
            databaseState={databaseState}
            onNavigateHome={() => navigateTo('home')}
            onSelectTopic={(topicId) => navigateTo('topic', topicId)}
            onRefreshData={refreshData}
          />
        )}
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        databaseState={databaseState}
        language={language}
        onSelectResult={(topicId) => navigateTo('topic', topicId)}
      />

      {/* Import & Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        databaseState={databaseState}
        language={language}
        onDataImported={refreshData}
      />

      {/* Hotspots Calibration Modal */}
      <CalibrationModal
        isOpen={isCalibrationOpen}
        initialHotspots={databaseState.hotspotSettings}
        onClose={() => setIsCalibrationOpen(false)}
        onSave={(newHotspots) => {
          setDatabaseState(prev => prev ? { ...prev, hotspotSettings: newHotspots } : null);
        }}
      />
    </div>
  );
}
