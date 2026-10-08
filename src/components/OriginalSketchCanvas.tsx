import React, { useState, useRef } from 'react';
import { Upload, Sliders, RefreshCw, Eye, Image as ImageIcon, Trash2 } from 'lucide-react';
import { TopicId, HotspotCoordinates, DatabaseState, Language } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { SketchVectorFallback } from './SketchVectorFallback';
import { saveCustomImage, removeCustomImage } from '../db/indexedDb';
import { getTranslation, getDualText } from '../i18n/translations';
import { WorkshopFlowView } from './WorkshopFlowView';

interface OriginalSketchCanvasProps {
  databaseState: DatabaseState;
  language: Language;
  onSelectTopic: (topicId: TopicId) => void;
  onStartWorkshop: () => void;
  onNavigateSection: (section: string) => void;
  onOpenCalibration: () => void;
  onImageChanged: (dataUrl?: string) => void;
}

export const OriginalSketchCanvas: React.FC<OriginalSketchCanvasProps> = ({
  databaseState,
  language,
  onSelectTopic,
  onStartWorkshop,
  onNavigateSection,
  onOpenCalibration,
  onImageChanged
}) => {
  const [hoveredTopic, setHoveredTopic] = useState<TopicId | null>(null);
  const [homeMode, setHomeMode] = useState<'sketch' | 'flow'>('sketch');
  const [useVectorOnly, setUseVectorOnly] = useState<boolean>(!databaseState.customImage);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customImage = databaseState.customImage;
  const hotspots = databaseState.hotspotSettings;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(language === 'ru' ? 'Пожалуйста, выберите файл изображения (PNG, JPG, WebP).' : 'Bitte eine Bilddatei auswählen (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      await saveCustomImage(dataUrl);
      setUseVectorOnly(false);
      onImageChanged(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleRemoveCustomImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmMsg = language === 'ru'
      ? 'Удалить загруженное изображение и вернуться к векторному эскизу?'
      : 'Gespeichertes hochgeladenes Bild entfernen und zur Original-Vektorskizze zurückkehren?';
    if (confirm(confirmMsg)) {
      await removeCustomImage();
      setUseVectorOnly(true);
      onImageChanged(undefined);
    }
  };

  const viewSwitcher = (
    <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 mb-4 shadow-sm">
      <span className="text-xs font-medium text-slate-600">
        {language === 'ru' ? 'Главный вид проекта:' : 'Projekt-Hauptansicht:'}
      </span>
      <div className="inline-flex gap-1 bg-slate-100 rounded-lg p-1" role="group" aria-label={language === 'ru' ? 'Переключение вида' : 'Ansicht umschalten'}>
        <button type="button" aria-pressed={homeMode === 'sketch'} onClick={() => setHomeMode('sketch')}
          className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${homeMode === 'sketch' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
          {language === 'ru' ? '① Круги / эскиз' : '① Kreis-Ansicht'}
        </button>
        <button type="button" aria-pressed={homeMode === 'flow'} onClick={() => setHomeMode('flow')}
          className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${homeMode === 'flow' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
          {language === 'ru' ? '② Этапы / Workshop Flow' : '② Phasen-Ansicht / Workshop-Flow'}
        </button>
      </div>
    </div>
  );

  if (homeMode === 'flow') {
    return (
      <div className="flex flex-col items-center w-full min-h-[calc(100vh-3.5rem)] bg-slate-100/70 p-4 sm:p-6 lg:p-8">
        {viewSwitcher}
        <WorkshopFlowView
          databaseState={databaseState}
          language={language}
          onStartWorkshop={onStartWorkshop}
          onSelectTopic={onSelectTopic}
          onNavigateSection={onNavigateSection}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-3.5rem)] bg-slate-100/70 p-4 sm:p-6 lg:p-8">
      {viewSwitcher}
      <div className="w-full max-w-5xl mb-4 bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
            {language === 'ru' ? 'Встреча с сеньором' : 'Vorbereitung Senior-Meeting'}
          </div>
          <h2 className="text-lg font-bold mt-1">
            {language === 'ru' ? 'Понять процесс, обсудить решения' : 'Kundenprozess verstehen und Entscheidungen klären'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {language === 'ru' ? 'Одна интерактивная карта: потребности, исследования, OSS и открытые вопросы.' : 'Eine interaktive Karte: Kundenbedarf, Recherche, OSS-Optionen und offene Fragen.'}
          </p>
        </div>
        <button onClick={onStartWorkshop} className="shrink-0 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-lg px-5 py-2.5 text-sm font-bold">
          {language === 'ru' ? 'Открыть мастерскую →' : 'Senior-Workshop starten →'}
        </button>
      </div>
      {/* Control bar above the sketch */}
      <div className="w-full max-w-5xl mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-white border border-slate-200/90 rounded-lg px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 tracking-tight">
            {getTranslation('interactiveSketch', language)}:
          </span>
          <span className="text-slate-500 hidden sm:inline">
            {getTranslation('clickCircleHint', language)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {customImage && (
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2">
              <button
                onClick={() => setUseVectorOnly(!useVectorOnly)}
                className="px-2 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-1"
                title={language === 'ru' ? 'Переключить между загруженным PNG и векторным эскизом' : 'Zwischen hochgeladenem PNG und Vektorgrafik umschalten'}
              >
                <Eye className="w-3 h-3" />
                <span>
                  {useVectorOnly
                    ? (language === 'ru' ? 'К PNG-файлу' : 'Zu PNG-Bild')
                    : (language === 'ru' ? 'К вектору' : 'Zu Vektor')}
                </span>
              </button>
              <button
                onClick={handleRemoveCustomImage}
                className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                title={language === 'ru' ? 'Удалить файл' : 'Hochgeladenes Bild löschen'}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-1.5 font-medium"
            title={language === 'ru' ? 'Загрузить оригинал и сохранить в браузере' : 'Eigenes Bild hochladen & in IndexedDB speichern'}
          >
            <Upload className="w-3 h-3 text-slate-500" />
            <span>{customImage ? getTranslation('replaceImage', language) : getTranslation('uploadCustomImage', language)}</span>
          </button>

          <button
            onClick={onOpenCalibration}
            className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-1.5 font-medium"
            title={language === 'ru' ? 'Калибровка координат клик-зон' : 'Hotspot-Klickflächen kalibrieren und verschieben'}
          >
            <Sliders className="w-3 h-3 text-slate-500" />
            <span>{getTranslation('calibrateHotspots', language)}</span>
          </button>
        </div>
      </div>

      {/* Main Sketch Container with responsive aspect ratio */}
      <div
        className={`relative w-full max-w-5xl aspect-[1200/1100] bg-white rounded-xl shadow-md border border-slate-200/90 overflow-hidden select-none transition-all ${
          isDragOver ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Layer 1: Background Sketch Image (Custom uploaded image or crisp vector fallback) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {customImage && !useVectorOnly ? (
            <img
              src={customImage}
              alt="Original-Projektskizze mit 5 roten und 1 grünen Kreis"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          ) : (
            <SketchVectorFallback />
          )}
        </div>

        {/* Layer 2: Transparent SVG Hotspot Overlay (Scales perfectly across all screen sizes) */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full z-10"
        >
          {(Object.keys(TOPIC_DEFINITIONS) as TopicId[]).map((topicId) => {
            const meta = TOPIC_DEFINITIONS[topicId];
            const coord: HotspotCoordinates = hotspots[topicId] || meta.defaultHotspot;
            const isHovered = hoveredTopic === topicId;
            const isGreen = meta.colorType === 'green';

            return (
              <g
                key={topicId}
                tabIndex={0}
                role="button"
                aria-label={`${meta.sketchTitle} - ${language === 'ru' ? meta.russianTitle : meta.germanTitle}`}
                className="cursor-pointer outline-none group"
                onClick={() => onSelectTopic(topicId)}
                onMouseEnter={() => setHoveredTopic(topicId)}
                onMouseLeave={() => setHoveredTopic(null)}
                onFocus={() => setHoveredTopic(topicId)}
                onBlur={() => setHoveredTopic(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTopic(topicId);
                  }
                }}
              >
                {/* Visual hover ring and pulse effect */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={coord.radius}
                  fill={isGreen ? 'rgba(46, 125, 50, 0.04)' : 'rgba(184, 84, 80, 0.04)'}
                  stroke={
                    isHovered
                      ? (isGreen ? '#2e7d32' : '#b85450')
                      : 'transparent'
                  }
                  strokeWidth={isHovered ? 0.6 : 0}
                  strokeDasharray={isHovered ? '2,1' : 'none'}
                  className="transition-all duration-150"
                />

                {/* Invisible large hit target to ensure 100% clickable area */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={coord.radius}
                  fill="transparent"
                  className="cursor-pointer"
                />
              </g>
            );
          })}
        </svg>

        {/* Layer 3: Dynamic Floating Info Card on Hover */}
        {hoveredTopic && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${hotspots[hoveredTopic]?.x || TOPIC_DEFINITIONS[hoveredTopic].defaultHotspot.x}%`,
              top: `${Math.max(10, (hotspots[hoveredTopic]?.y || TOPIC_DEFINITIONS[hoveredTopic].defaultHotspot.y) - (hotspots[hoveredTopic]?.radius || 13.5))}%`
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs py-2 px-3.5 rounded-lg shadow-xl border border-slate-700/80 max-w-xs text-center select-none animate-in fade-in zoom-in-95 duration-100">
              <div className="font-bold text-sm tracking-tight text-emerald-400">
                {TOPIC_DEFINITIONS[hoveredTopic].sketchTitle}
              </div>
              <div className="text-slate-200 font-semibold text-xs mt-0.5">
                {language === 'ru'
                  ? TOPIC_DEFINITIONS[hoveredTopic].russianTitle
                  : language === 'bilingual'
                    ? `${TOPIC_DEFINITIONS[hoveredTopic].russianTitle} · ${TOPIC_DEFINITIONS[hoveredTopic].germanTitle}`
                    : TOPIC_DEFINITIONS[hoveredTopic].germanTitle}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
                {getTranslation('clickToOpen', language)}
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};
