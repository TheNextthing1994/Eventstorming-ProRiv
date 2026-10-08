import React, { useState } from 'react';
import { X, RotateCcw, Check, Sliders } from 'lucide-react';
import { TopicId, HotspotCoordinates } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { saveHotspots, resetHotspotsToDefault } from '../db/indexedDb';

interface CalibrationModalProps {
  initialHotspots: Record<TopicId, HotspotCoordinates>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotspots: Record<TopicId, HotspotCoordinates>) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  initialHotspots,
  isOpen,
  onClose,
  onSave
}) => {
  const [hotspots, setHotspots] = useState<Record<TopicId, HotspotCoordinates>>(initialHotspots);
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('mobile-app');

  if (!isOpen) return null;

  const currentCoord = hotspots[selectedTopic] || TOPIC_DEFINITIONS[selectedTopic].defaultHotspot;

  const handleUpdate = (field: keyof HotspotCoordinates, value: number) => {
    setHotspots(prev => ({
      ...prev,
      [selectedTopic]: {
        ...prev[selectedTopic],
        [field]: Number(value.toFixed(1))
      }
    }));
  };

  const handleReset = async () => {
    if (confirm('Möchtest du alle Hotspots auf die Standardkoordinaten zurücksetzen?')) {
      const defaults = await resetHotspotsToDefault();
      setHotspots(defaults);
      onSave(defaults);
    }
  };

  const handleSaveAndClose = async () => {
    await saveHotspots(hotspots);
    onSave(hotspots);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-900">
              Hotspot-Klickflächen kalibrieren
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            Passe die X- und Y-Position sowie den Radius jedes Kreises prozentual an, damit die Klickzonen
            präzise über der Originalskizze liegen. Alle Werte bleiben dauerhaft im Browser gespeichert.
          </p>

          {/* Topic selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(TOPIC_DEFINITIONS) as TopicId[]).map((topicId) => {
              const meta = TOPIC_DEFINITIONS[topicId];
              const isSelected = selectedTopic === topicId;
              const isGreen = meta.colorType === 'green';

              return (
                <button
                  key={topicId}
                  onClick={() => setSelectedTopic(topicId)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 text-slate-900 font-semibold ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${isGreen ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                    <span className="font-bold truncate">{meta.sketchTitle}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{meta.germanTitle}</div>
                </button>
              );
            })}
          </div>

          {/* Sliders for the selected topic */}
          <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Bearbeite: {TOPIC_DEFINITIONS[selectedTopic].sketchTitle}
              </span>
              <span className="text-xs font-mono text-slate-500">
                X: {currentCoord.x}% | Y: {currentCoord.y}% | R: {currentCoord.radius}%
              </span>
            </div>

            {/* X Position */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Horizontale Position (X)</span>
                <span className="font-mono font-medium">{currentCoord.x}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.2"
                value={currentCoord.x}
                onChange={(e) => handleUpdate('x', parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Y Position */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Vertikale Position (Y)</span>
                <span className="font-mono font-medium">{currentCoord.y}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.2"
                value={currentCoord.y}
                onChange={(e) => handleUpdate('y', parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Radius */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Radius der Klickfläche</span>
                <span className="font-mono font-medium">{currentCoord.radius}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="0.2"
                value={currentCoord.radius}
                onChange={(e) => handleUpdate('radius', parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Auf Standard zurücksetzen</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSaveAndClose}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Kalibrierung anwenden</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
