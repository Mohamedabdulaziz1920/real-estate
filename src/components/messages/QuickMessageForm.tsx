'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface QuickMessageFormProps {
  recipientId: string;
  propertyId?: string;
  propertyTitle?: string;
}

export default function QuickMessageForm({
  recipientId,
  propertyId,
  propertyTitle,
}: QuickMessageFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const quickMessages = [
    'مرحباً، أنا مهتم بهذا العقار',
    'هل العقار لا يزال متاحاً؟',
    'هل يمكنني ترتيب موعد للمعاينة؟',
    'ما هو أقل سعر ممكن؟',
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== 'authenticated') {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!message.trim()) {
      toast.error('الرسالة مطلوبة');
      return;
    }

    if (recipientId === session?.user?.id) {
      toast.error('لا يمكنك مراسلة نفسك');
      return;
    }

    setSending(true);

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          propertyId,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('تم إرسال الرسالة');
        setMessage('');
        router.push(`/messages?id=${data.data._id}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Messages */}
      <div className="flex flex-wrap gap-2">
        {quickMessages.map((qm, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setMessage(qm)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
          >
            {qm}
          </button>
        ))}
      </div>

      {/* Message Form */}
      <form onSubmit={handleSend} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`أرسل رسالة حول ${propertyTitle || 'هذا العقار'}...`}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <FaSpinner className="w-4 h-4 animate-spin" />
              <span>جاري الإرسال...</span>
            </>
          ) : (
            <>
              <FaPaperPlane className="w-4 h-4" />
              <span>إرسال رسالة</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}