import type { ReactNode } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiXCircle } from 'react-icons/fi';

interface MessageProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const Message = ({ children, variant = 'info', onClose }: MessageProps) => {
  const variantStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <FiCheckCircle className="text-green-500" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <FiXCircle className="text-red-500" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <FiAlertCircle className="text-yellow-500" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <FiInfo className="text-blue-500" />,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.bg} ${styles.border} ${styles.text} border rounded-lg p-4 flex items-start gap-3`}
    >
      <div className="flex-shrink-0 text-xl">{styles.icon}</div>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <FiXCircle />
        </button>
      )}
    </div>
  );
};

export default Message;
