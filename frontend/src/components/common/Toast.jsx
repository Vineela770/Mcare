import { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

/**
 * In-page Toast notification – no browser alert() dialogs.
 *
 * Usage:
 *   const [toast, setToast] = useState(null);
 *   setToast({ message: 'Saved!', type: 'success' });
 *   <Toast toast={toast} onClose={() => setToast(null)} />
 *
 * type: 'success' | 'error' | 'info'
 */
const Toast = ({ toast, onClose, duration = 3500 }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timerRef.current);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const map = {
    success: { wrap: 'bg-green-50 border-green-200', txt: 'text-green-800', icon: <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> },
    error:   { wrap: 'bg-red-50 border-red-200',     txt: 'text-red-800',   icon: <XCircle    className="w-5 h-5 text-red-600 shrink-0"   /> },
    info:    { wrap: 'bg-cyan-50 border-cyan-200',   txt: 'text-cyan-800',  icon: <AlertCircle className="w-5 h-5 text-cyan-600 shrink-0"  /> },
  };
  const style = map[toast.type] || map.info;

  return (
    <div
      role="alert"
      className={`fixed top-6 right-6 z-50 max-w-sm w-full flex items-start gap-3 p-4 rounded-xl border shadow-lg ${style.wrap}`}
    >
      {style.icon}
      <p className={`flex-1 text-sm font-medium ${style.txt}`}>{toast.message}</p>
      <button onClick={() => onClose?.()} className="ml-auto text-gray-400 hover:text-gray-600" aria-label="Close">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
