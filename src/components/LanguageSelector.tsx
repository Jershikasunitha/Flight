import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types/language';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'pill';
  className?: string;
}

export function LanguageSelector({ variant = 'compact', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, currentLanguageOption, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left z-30 ${className}`}>
      {/* Trigger Button */}
      {variant === 'pill' ? (
        <button
          type="button"
          id="voya-lang-selector-pill"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8F3] border border-[#DDD6C8] hover:border-[#C2410C] text-xs font-mono font-medium text-[#1E2022] shadow-2xs transition-all active:scale-95"
          title={t.languageSelect}
        >
          <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
          <span className="font-bold text-[#1E2022]">{currentLanguageOption.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-[#737A84] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : variant === 'full' ? (
        <button
          type="button"
          id="voya-lang-selector-full"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-[#FAF8F3] border border-[#DDD6C8] hover:border-[#C2410C] text-xs font-mono text-[#1E2022] shadow-2xs transition-all active:scale-98"
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">{currentLanguageOption.flag}</span>
            <div className="text-left">
              <div className="font-bold text-[#1E2022]">{currentLanguageOption.nativeName}</div>
              <div className="text-[10px] text-[#737A84]">{currentLanguageOption.name} ({currentLanguageOption.region})</div>
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-[#737A84] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        /* Compact Button (default in headers) */
        <button
          type="button"
          id="voya-lang-selector-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F3] border border-[#DDD6C8] hover:border-[#C2410C] text-xs font-mono text-[#1E2022] shadow-2xs transition-all active:scale-95 group"
          title={`Switch Language (Current: ${currentLanguageOption.nativeName})`}
        >
          <Globe className="w-3.5 h-3.5 text-[#C2410C] group-hover:rotate-12 transition-transform" />
          <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
          <span className="font-bold hidden md:inline text-[11px]">{currentLanguageOption.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-[#737A84] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          id="voya-lang-dropdown-panel"
          className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-[#DDD6C8] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-[#EFEBE1] mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E2022]">
              <Globe className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{t.languageSelect} / Display in VOYA</span>
            </div>
            <span className="text-[10px] font-mono font-semibold bg-[#FAF8F3] text-[#737A84] px-1.5 py-0.5 rounded border border-[#E0D9CB]">
              11 Languages
            </span>
          </div>

          {/* Language Options List */}
          <div className="space-y-0.5">
            {availableLanguages.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  id={`lang-option-${opt.code}`}
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-[#F7F4EC] border border-[#C2410C]/40 text-[#C2410C] font-bold shadow-2xs'
                      : 'hover:bg-[#FAF8F3] text-[#1E2022]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Index or Number indicator */}
                    <span className="w-5 text-[11px] font-mono font-bold text-[#8C929A] text-right">
                      {opt.number ? opt.number : '★'}
                    </span>
                    {/* Flag */}
                    <span className="text-lg leading-none">{opt.flag}</span>
                    {/* Labels */}
                    <div>
                      <div className="text-xs font-medium font-sans flex items-center gap-1.5">
                        <span className={isSelected ? 'text-[#C2410C] font-bold' : 'text-[#1E2022]'}>
                          {opt.name}
                        </span>
                        <span className="text-[10px] text-[#737A84] font-normal">
                          • {opt.nativeName}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#8C929A]">
                        {opt.region} {opt.direction === 'rtl' ? '(RTL)' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Active Checkmark */}
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#C2410C] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-2 pt-2 border-t border-[#EFEBE1] px-3 py-1 text-[10px] font-mono text-[#737A84] text-center">
            Enabled for all users • Instant live update
          </div>
        </div>
      )}
    </div>
  );
}
