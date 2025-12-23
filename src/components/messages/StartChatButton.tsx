'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaComments, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface StartChatButtonProps {
  recipientId: string;
  propertyId?: string;
  recipientName?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function StartChatButton({
  recipientId,
  propertyId,
  recipientName,
  className = '',
  variant = 'primary',
  size = 'md',
  showIcon = true,
}: StartChatButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (status !== 'authenticated') {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (recipientId === session?.user?.id) {
      toast.error('لا يمكنك مراسلة نفسك');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          propertyId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/messages?id=${data.data._id}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        flex items-center justify-center gap-2 rounded-xl font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading ? (
        <FaSpinner className="w-4 h-4 animate-spin" />
      ) : showIcon ? (
        <FaComments className="w-4 h-4" />
      ) : null}
      <span>مراسلة{recipientName ? ` ${recipientName}` : ''}</span>
    </button>
  );
}