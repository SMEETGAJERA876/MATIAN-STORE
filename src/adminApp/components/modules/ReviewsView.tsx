import React, { useState } from 'react';
import { Star, Check, X, Flag, Sparkles, AlertCircle, Filter, ThumbsUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Review } from '../../types';

export const ReviewsView: React.FC = () => {
  const { reviews, updateReviewStatus, addToast } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Reviews', count: reviews.length },
    { id: 'pending', label: 'Pending Approval', count: reviews.filter((r) => r.status === 'Pending').length },
    { id: 'flagged', label: 'Flagged', count: reviews.filter((r) => r.status === 'Flagged').length },
  ];

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return r.status === 'Pending';
    if (activeTab === 'flagged') return r.status === 'Flagged';
    return true;
  });

  const columns: Column<Review>[] = [
    {
      header: 'RATING',
      accessorKey: 'rating',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < row.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      header: 'CUSTOMER',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.customerAvatar}
            alt={row.customerName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-bold text-xs text-matrin-text dark:text-white">
            {row.customerName}
          </span>
        </div>
      ),
    },
    {
      header: 'PRODUCT',
      accessorKey: 'productName',
      sortable: true,
      cell: (row) => (
        <span className="font-bold text-xs text-matrin-primary dark:text-blue-400">
          {row.productName}
        </span>
      ),
    },
    {
      header: 'REVIEW',
      accessorKey: 'reviewText',
      cell: (row) => (
        <p className="text-xs text-matrin-text dark:text-slate-300 line-clamp-2 max-w-sm">
          "{row.reviewText}"
        </p>
      ),
    },
    {
      header: 'DATE',
      accessorKey: 'date',
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-matrin-gray dark:text-slate-400 font-medium">
          {row.date}
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        const variants: Record<string, any> = {
          Published: 'success',
          Pending: 'warning',
          Flagged: 'danger',
          Rejected: 'neutral',
        };
        return <Badge variant={variants[row.status] || 'neutral'}>{row.status}</Badge>;
      },
    },
    {
      header: 'ACTIONS',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Pending' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                className="bg-matrin-primary text-white"
                onClick={() => updateReviewStatus(row.id, 'Published')}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 hover:bg-rose-50 border-rose-200"
                onClick={() => updateReviewStatus(row.id, 'Rejected')}
              >
                Reject
              </Button>
            </>
          ) : (
            <button
              onClick={() => updateReviewStatus(row.id, 'Flagged')}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors"
              title="Flag Review"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Reviews
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Moderate customer product feedback, monitor sentiment scores, and respond to inquiries.
        </p>
      </div>

      {/* 3 Analytics Cards (Matching Reference Image 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">
              SENTIMENT ANALYSIS
            </div>
            <div className="text-4xl font-extrabold text-matrin-primary dark:text-white mt-2 flex items-baseline gap-2">
              85% <span className="text-lg font-bold text-matrin-secondary">Positive</span>
            </div>
            <p className="text-xs text-matrin-gray dark:text-slate-400 mt-2 leading-relaxed">
              Based on 1,248 reviews this month. Sentiment is up 4% compared to last period.
            </p>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-matrin-primary rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Rating Distribution Breakdown */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl p-6 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray mb-3">
            RATING DISTRIBUTION
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-12 font-bold text-matrin-text dark:text-white">5 Stars</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-matrin-secondary rounded-full" style={{ width: '72%' }} />
              </div>
              <span className="w-8 text-right text-matrin-gray font-bold">72%</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-12 font-bold text-matrin-text dark:text-white">4 Stars</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-matrin-secondary rounded-full" style={{ width: '18%' }} />
              </div>
              <span className="w-8 text-right text-matrin-gray font-bold">18%</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-12 font-bold text-matrin-text dark:text-white">3 Stars</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-matrin-secondary rounded-full" style={{ width: '5%' }} />
              </div>
              <span className="w-8 text-right text-matrin-gray font-bold">5%</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-12 font-bold text-matrin-text dark:text-white">2 Stars</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-matrin-secondary rounded-full" style={{ width: '3%' }} />
              </div>
              <span className="w-8 text-right text-matrin-gray font-bold">3%</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-12 font-bold text-matrin-text dark:text-white">1 Star</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '2%' }} />
              </div>
              <span className="w-8 text-right text-matrin-gray font-bold">2%</span>
            </div>
          </div>
        </div>

        {/* Pending Reviews CTA */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl p-6 shadow-card flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-matrin-primary dark:text-blue-400 flex items-center justify-center mb-3">
            <ThumbsUp className="w-7 h-7" />
          </div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white">
            24
          </div>
          <div className="text-xs text-matrin-gray mt-1 font-semibold">
            Pending Reviews
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full text-matrin-primary dark:text-blue-400 font-bold"
            onClick={() => setActiveTab('pending')}
          >
            Review Now
          </Button>
        </div>
      </div>

      {/* Main Reviews Moderation DataTable */}
      <DataTable
        title="Reviews Moderation"
        data={filteredReviews}
        columns={columns}
        searchKey="reviewText"
        searchPlaceholder="Search reviews by content, product or customer..."
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
        exportFilename="matrin_reviews"
      />

      {/* Bottom Banners Grid (Matching Reference Image 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blue AI Insight Banner */}
        <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-3xl p-6 flex gap-4">
          <div className="w-10 h-10 rounded-2xl bg-matrin-primary text-white flex items-center justify-center shrink-0 shadow-soft">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-matrin-primary dark:text-blue-400">
              AI Insight
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              Reviews for the <strong className="text-matrin-primary dark:text-white">MATRIN Pro Robot</strong> frequently mention "quiet operation" and "precise mapping" as key delights. Consider highlighting these features in the next marketing cycle.
            </p>
          </div>
        </div>

        {/* Red Growth Opportunity Banner */}
        <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-3xl p-6 flex gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-soft">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-rose-600 dark:text-rose-400">
              Growth Opportunity
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              3 reviews this week flagged shipping delays for the <strong className="text-rose-600 dark:text-white">UV-C Sterilizer</strong>. Logistics team has been notified to investigate local warehouse capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
