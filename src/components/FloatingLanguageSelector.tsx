import { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Check, ChevronDown, Search, ArrowRight, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode, LanguageOption } from '../types/language';

export function FloatingLanguageSelector() {
  const { language, setLanguage, currentLanguageOption, availableLanguages, t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return availableLanguages;
    const q = searchQuery.toLowerCase().trim();
    return availableLanguages.filter(
      (opt) =>
        opt.name.toLowerCase().includes(q) ||
        opt.nativeName.toLowerCase().includes(q) ||
        opt.region.toLowerCase().includes(q) ||
        opt.code.toLowerCase().includes(q)
    );
  }, [availableLanguages, searchQuery]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      ref={dropdownRef}
      id="voya-floating-language-widget"
      className="fixed top-3.5 right-4 sm:top-4 sm:right-6 rtl:left-4 rtl:right-auto sm:rtl:left-6 sm:rtl:right-auto z-40 select-none"
    >
      {/* Floating Trigger Button */}
      <button
        type="button"
        id="floating-lang-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Language selection: current ${currentLanguageOption.nativeName}`}
        className={`group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl backdrop-blur-md transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg ${
          isOpen
            ? 'bg-white border-[#C2410C] text-[#C2410C] ring-2 ring-[#C2410C]/20'
            : 'bg-[#FAF8F3]/95 hover:bg-white border border-[#DDD6C8] hover:border-[#C2410C] text-[#1E2022]'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#C2410C] group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-base leading-none">{currentLanguageOption.flag}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-tight">
          <span className="text-[#1E2022] group-hover:text-[#C2410C] transition-colors">
            {currentLanguageOption.nativeName}
          </span>
          {isRTL && (
            <span className="text-[10px] font-bold bg-[#C2410C]/15 text-[#C2410C] px-1.5 py-0.2 rounded border border-[#C2410C]/30">
              RTL
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#737A84] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#C2410C]' : 'group-hover:text-[#1E2022]'
          }`}
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div
          id="floating-lang-dropdown-panel"
          dir={isRTL ? 'rtl' : 'ltr'}
          className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FAF8F3] border border-[#DDD6C8] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-2 py-1.5 border-b border-[#E8E2D5] pb-2.5 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C2410C] text-white flex items-center justify-center shadow-xs">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#1E2022] flex items-center gap-1.5">
                  <span>{t.languageSelect}</span>
                  <span className="text-[10px] text-[#737A84] font-normal">/ Global Matrix</span>
                </div>
                <div className="text-[10px] text-[#737A84]">
                  Updates dashboard, alerts, & VYRA telemetry
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold bg-[#EFEBE1] text-[#C2410C] px-2 py-0.5 rounded border border-[#DDD6C8]">
              11 Languages
            </span>
          </div>

          {/* Quick Search Input */}
          <div className="relative mb-2 px-1">
            <Search className="w-3.5 h-3.5 text-[#8C929A] absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              id="lang-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language or region..."
              className="w-full bg-white border border-[#DDD6C8] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] rounded-xl pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-1.5 text-xs font-mono text-[#1E2022] outline-none transition-all placeholder:text-[#8C929A]"
            />
          </div>

          {/* Language Options List */}
          <div className="overflow-y-auto space-y-1 pr-1 rtl:pr-0 rtl:pl-1 max-h-[52vh]">
            {filteredLanguages.map((opt) => {
              const isSelected = opt.code === language;
              const isArabic = opt.code === 'ar';
              const isTamil = opt.code === 'ta';

              return (
                <button
                  key={opt.code}
                  id={`floating-lang-opt-${opt.code}`}
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left rtl:text-right transition-all duration-150 group ${
                    isSelected
                      ? 'bg-white border border-[#C2410C] text-[#C2410C] font-bold shadow-xs'
                      : 'hover:bg-white hover:border-[#DDD6C8] border border-transparent text-[#1E2022]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Index or Star */}
                    <span className="w-4 text-[11px] font-mono font-bold text-[#8C929A] shrink-0 text-center">
                      {opt.number ?? '★'}
                    </span>

                    {/* Flag */}
                    <span className="text-xl leading-none shrink-0">{opt.flag}</span>

                    {/* Labels */}
                    <div className="min-w-0 truncate">
                      <div className="text-xs font-semibold flex items-center gap-1.5 truncate">
                        <span
                          className={
                            isSelected
                              ? 'text-[#C2410C]'
                              : 'text-[#1E2022] group-hover:text-[#C2410C]'
                          }
                        >
                          {opt.nativeName}
                        </span>
                        <span className="text-[10px] text-[#737A84] font-normal truncate">
                          ({opt.name})
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#8C929A] truncate">
                        {opt.region}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* RTL Badge for Arabic */}
                    {isArabic && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        RTL
                      </span>
                    )}
                    {/* Special Badge for Tamil */}
                    {isTamil && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        Indic
                      </span>
                    )}

                    {/* Active Checkmark */}
                    {isSelected && <Check className="w-4 h-4 text-[#C2410C]" />}
                  </div>
                </button>
              );
            })}

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-xs font-mono text-[#737A84]">
                No languages match "{searchQuery}"
              </div>
            )}
          </div>

          {/* Footer RTL & Telemetry Info */}
          <div className="mt-2.5 pt-2 border-t border-[#E8E2D5] px-2 flex items-center justify-between text-[10px] font-mono text-[#737A84]">
            <div className="flex items-center gap-1 text-[#C2410C]">
              <span>Active:</span>
              <strong className="font-bold">{currentLanguageOption.nativeName}</strong>
            </div>
            <span>{isRTL ? 'RTL Direction: Enabled' : 'LTR Direction: Default'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
