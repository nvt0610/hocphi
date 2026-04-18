import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'info' | 'success';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'danger',
  isLoading = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger': return 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20';
      case 'success': return 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20';
      case 'info': return 'bg-zinc-900 border-zinc-900 shadow-zinc-900/20';
      default: return 'bg-zinc-900 shadow-zinc-900/20';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 h-[56px] rounded-2xl"
          >
            {cancelLabel}
          </Button>
          <Button 
            onClick={onConfirm}
            isLoading={isLoading}
            className={`flex-1 h-[56px] rounded-2xl text-white shadow-lg font-black text-[12px] tracking-widest ${getVariantClasses()}`}
          >
            {confirmLabel.toUpperCase()}
          </Button>
        </>
      }
    >
      <div className="py-2">
        <p className="font-bold text-zinc-500 leading-relaxed">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
