'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// الأنماط
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
    color: '#1a1a2e',
  },
  subtitle: {
    color: '#666',
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  cardDescription: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #eee',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  primaryButton: {
    backgroundColor: '#1976d2',
    color: '#fff',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  statLabel: {
    color: '#666',
    fontSize: '14px',
  },
  statChange: {
    fontSize: '12px',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  filterSection: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  filterRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap' as const,
    alignItems: 'flex-end',
  },
  filterGroup: {
    flex: '1',
    minWidth: '200px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  th: {
    padding: '16px',
    textAlign: 'right' as const,
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    fontSize: '14px',
    color: '#333',
    borderBottom: '2px solid #e0e0e0',
  },
  td: {
    padding: '16px',
    textAlign: 'right' as const,
    borderBottom: '1px solid #eee',
    fontSize: '14px',
  },
  chartPlaceholder: {
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #e0e0e0',
    marginBottom: '24px',
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.3s',
  },
  activeTab: {
    color: '#1976d2',
    borderBottomColor: '#1976d2',
  },
};

// أيقونات SVG
const Icons = {
  Properties: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  Money: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
    </svg>
  ),
  Chart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
    </svg>
  ),
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
    </svg>
  ),
  ArrowUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 14l5-5 5 5z"/>
    </svg>
  ),
  ArrowDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 10l5 5 5-5z"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  ),
};

// بيانات التقارير
const reportTypes = [
  {
    id: 'properties',
    title: 'تقرير العقارات',
    description: 'تحليل شامل للعقارات المسجلة، الحالات، الأنواع، والتوزيع الجغرافي',
    icon: Icons.Properties,
    color: '#1976d2',
    bgColor: '#e3f2fd',
    lastGenerated: '2024-01-20',
    status: 'جاهز',
  },
  {
    id: 'users',
    title: 'تقرير المستخدمين',
    description: 'إحصائيات المستخدمين، التسجيلات الجديدة، ونشاط الحسابات',
    icon: Icons.Users,
    color: '#4caf50',
    bgColor: '#e8f5e9',
    lastGenerated: '2024-01-19',
    status: 'جاهز',
  },
  {
    id: 'financial',
    title: 'التقرير المالي',
    description: 'تحليل المبيعات، الإيرادات، والمعاملات المالية',
    icon: Icons.Money,
    color: '#ff9800',
    bgColor: '#fff3e0',
    lastGenerated: '2024-01-18',
    status: 'قيد التحديث',
  },
  {
    id: 'performance',
    title: 'تقرير الأداء',
    description: 'مؤشرات الأداء الرئيسية، معدلات التحويل، وتحليل النمو',
    icon: Icons.Chart,
    color: '#9c27b0',
    bgColor: '#f3e5f5',
    lastGenerated: '2024-01-20',
    status: 'جاهز',
  },
];

const stats = [
  { label: 'إجمالي العقارات', value: '1,234', change: '+12%', positive: true },
  { label: 'المستخدمين النشطين', value: '856', change: '+8%', positive: true },
  { label: 'المعاملات الشهرية', value: '₹45M', change: '+15%', positive: true },
  { label: 'معدل التحويل', value: '3.2%', change: '-0.5%', positive: false },
];

const recentReports = [
  { id: 1, name: 'تقرير العقارات - يناير 2024', type: 'عقارات', date: '2024-01-20', size: '2.5 MB' },
  { id: 2, name: 'تقرير المستخدمين - يناير 2024', type: 'مستخدمين', date: '2024-01-19', size: '1.8 MB' },
  { id: 3, name: 'التقرير المالي - Q4 2023', type: 'مالي', date: '2024-01-15', size: '4.2 MB' },
  { id: 4, name: 'تقرير الأداء السنوي 2023', type: 'أداء', date: '2024-01-10', size: '5.1 MB' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedType, setSelectedType] = useState('all');

  const handleGenerateReport = (reportId: string) => {
    console.log('Generating report:', reportId);
    alert(`جاري إنشاء التقرير: ${reportId}`);
  };

  const handleDownload = (reportId: number) => {
    console.log('Downloading report:', reportId);
    alert(`جاري تحميل التقرير: ${reportId}`);
  };

  const handleExport = (format: string) => {
    console.log('Exporting as:', format);
    alert(`جاري التصدير بصيغة: ${format}`);
  };

  return (
    <div style={styles.container}>
      {/* العنوان */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>التقارير والإحصائيات</h1>
          <p style={styles.subtitle}>عرض وتحليل بيانات المنصة</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleExport('pdf')}
            style={{ ...styles.button, backgroundColor: '#f5f5f5', color: '#333' }}
          >
            <Icons.Download />
            تصدير PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            style={{ ...styles.button, ...styles.primaryButton }}
          >
            <Icons.Download />
            تصدير Excel
          </button>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={{ ...styles.statValue, color: stat.positive ? '#1976d2' : '#333' }}>
              {stat.value}
            </div>
            <div style={styles.statLabel}>{stat.label}</div>
            <div style={{
              ...styles.statChange,
              color: stat.positive ? '#4caf50' : '#f44336',
            }}>
              {stat.positive ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
              {stat.change} عن الشهر الماضي
            </div>
          </div>
        ))}
      </div>

      {/* التبويبات */}
      <div style={styles.tabs}>
        {['أنواع التقارير', 'التقارير المحفوظة', 'الرسوم البيانية'].map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              ...styles.tab,
              ...(activeTab === index ? styles.activeTab : {}),
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* أنواع التقارير */}
      {activeTab === 0 && (
        <div style={styles.grid}>
          {reportTypes.map((report) => (
            <div
              key={report.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.cardHeader}>
                <div style={{
                  ...styles.cardIcon,
                  backgroundColor: report.bgColor,
                  color: report.color,
                }}>
                  <report.icon />
                </div>
                <h3 style={styles.cardTitle}>{report.title}</h3>
              </div>
              <p style={styles.cardDescription}>{report.description}</p>
              <div style={styles.cardFooter}>
                <div>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: report.status === 'جاهز' ? '#e8f5e9' : '#fff3e0',
                    color: report.status === 'جاهز' ? '#4caf50' : '#ff9800',
                  }}>
                    {report.status}
                  </span>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    آخر تحديث: {report.lastGenerated}
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  style={{ ...styles.button, ...styles.primaryButton }}
                >
                  إنشاء التقرير
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* التقارير المحفوظة */}
      {activeTab === 1 && (
        <>
          {/* فلاتر */}
          <div style={styles.filterSection}>
            <div style={styles.filterRow}>
              <div style={styles.filterGroup}>
                <label style={styles.label}>نوع التقرير</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="properties">عقارات</option>
                  <option value="users">مستخدمين</option>
                  <option value="financial">مالي</option>
                  <option value="performance">أداء</option>
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.label}>من تاريخ</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.label}>إلى تاريخ</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  style={styles.input}
                />
              </div>
              <button style={{ ...styles.button, ...styles.primaryButton, marginTop: '24px' }}>
                <Icons.Refresh />
                تحديث
              </button>
            </div>
          </div>

          {/* جدول التقارير */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>اسم التقرير</th>
                <th style={styles.th}>النوع</th>
                <th style={styles.th}>التاريخ</th>
                <th style={styles.th}>الحجم</th>
                <th style={styles.th}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td style={styles.td}>
                    <strong>{report.name}</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                    }}>
                      {report.type}
                    </span>
                  </td>
                  <td style={styles.td}>{report.date}</td>
                  <td style={styles.td}>{report.size}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDownload(report.id)}
                      style={{
                        ...styles.button,
                        padding: '6px 12px',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                      }}
                    >
                      <Icons.Download />
                      تحميل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* الرسوم البيانية */}
      {activeTab === 2 && (
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>مخطط العقارات حسب النوع</h3>
            <div style={styles.chartPlaceholder}>
              <div style={{ textAlign: 'center' }}>
                <Icons.Chart />
                <p>الرسم البياني سيظهر هنا</p>
                <small>يمكن إضافة مكتبة Chart.js أو Recharts</small>
              </div>
            </div>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>مخطط المستخدمين الجدد</h3>
            <div style={styles.chartPlaceholder}>
              <div style={{ textAlign: 'center' }}>
                <Icons.Users />
                <p>الرسم البياني سيظهر هنا</p>
              </div>
            </div>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>مخطط الإيرادات الشهرية</h3>
            <div style={styles.chartPlaceholder}>
              <div style={{ textAlign: 'center' }}>
                <Icons.Money />
                <p>الرسم البياني سيظهر هنا</p>
              </div>
            </div>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>مخطط الأداء السنوي</h3>
            <div style={styles.chartPlaceholder}>
              <div style={{ textAlign: 'center' }}>
                <Icons.Chart />
                <p>الرسم البياني سيظهر هنا</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input:focus, select:focus {
          outline: none;
          border-color: #1976d2;
        }
        button:hover:not(:disabled) {
          opacity: 0.9;
        }
        tr:hover {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}