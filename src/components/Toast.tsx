import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div 
      id="voya-toast-container" 
      className="fixed top-16 right-5 rtl:left-5 rtl:right-auto z-50 space-y-2 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-xs flex items-start gap-3 transition-all animate-in fade-in slide-in-from-top-3 duration-200 ${
              isSuccess 
                ? 'bg-white border-emerald-300 text-emerald-950' 
                : isWarning 
                  ? 'bg-white border-red-300 text-red-950'
                  : 'bg-white border-[#DDD7CD] text-[#1E2022]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-red-600" />}
              {!isSuccess && !isWarning && <Info className="w-4 h-4 text-[#C2410C]" />}
            </div>

            <div className="flex-1">
              <div className="font-display font-bold text-xs">{toast.title}</div>
              <div className="text-[11px] text-[#5A606A] mt-0.5 leading-relaxed">{toast.description}</div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#8C929A] hover:text-[#1E2022] p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
