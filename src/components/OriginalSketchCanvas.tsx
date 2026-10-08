import React, { useState, useRef } from 'react';
import { Upload, Sliders, RefreshCw, Eye, Image as ImageIcon, Trash2 } from 'lucide-react';
import { TopicId, HotspotCoordinates, DatabaseState, Language } from '../types';
import { TOPIC_DEFINITIONS } from '../db/defaultData';
import { SketchVectorFallback } from './SketchVectorFallback';
import { saveCustomImage, removeCustomImage } from '../db/indexedDb';
import { getTranslation, getDualText } from '../i18n/translations';

interface OriginalSketchCanvasProps {
  databaseState: DatabaseState;
  language: Language;
  onSelectTopic: (topicId: TopicId) => void;
  onOpenCalibration: () => void;
  onImageChanged: (dataUrl?: string) => void;
}

export const OriginalSketchCanvas: React.FC<OriginalSketchCanvasProps> = ({
  databaseState,
  language,
  onSelectTopic,
  onOpenCalibration,
  onImageChanged
}) => {
  const [hoveredTopic, setHoveredTopic] = useState<TopicId | null>(null);
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

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-3.5rem)] bg-slate-100/70 p-4 sm:p-6 lg:p-8">
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

      {/* Quick Access Badges below the sketch */}
      <div className="w-full max-w-5xl mt-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          {getTranslation('directAccess', language)}:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {(Object.keys(TOPIC_DEFINITIONS) as TopicId[]).map((topicId, idx) => {
            const meta = TOPIC_DEFINITIONS[topicId];
            const isGreen = meta.colorType === 'green';
            const questionsCount = databaseState.questions.filter(q => q.topicId === topicId).length;
            const resolvedCount = databaseState.questions.filter(q => q.topicId === topicId && q.isResolved).length;

            return (
              <button
                key={topicId}
                onClick={() => onSelectTopic(topicId)}
                onMouseEnter={() => setHoveredTopic(topicId)}
                onMouseLeave={() => setHoveredTopic(null)}
                className={`p-3 rounded-lg border text-left transition-all bg-white hover:shadow-xs group ${
                  isGreen
                    ? 'border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-50/30'
                    : 'border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/20'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                  <span>0{idx + 1}</span>
                  <span className={`w-2 h-2 rounded-full ${isGreen ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-slate-900 tracking-tight truncate">
                  {meta.sketchTitle}
                </div>
                <div className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                  {language === 'ru'
                    ? meta.russianTitle
                    : language === 'bilingual'
                      ? meta.russianTitle
                      : meta.germanTitle}
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  {resolvedCount}/{questionsCount} {getTranslation('solvedQuestions', language)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
