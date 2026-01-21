'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Navigation } from '../navigation';
import Header from '../../components/header';
import withAuth from '@/hoc/withAuth';
import { PaymentService } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

function Wallet() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    balance: number;
    currency: string;
    topupPackages?: number[];
    whatsappTopupNumber?: string;
  } | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [creatingTopup, setCreatingTopup] = useState<number | null>(null);
  const [showPolicies, setShowPolicies] = useState(false);

  const topupPackages = useMemo(() => {
    const packages = summary?.topupPackages;
    return Array.isArray(packages) && packages.length > 0
      ? packages
      : [20000, 35000, 60000];
  }, [summary?.topupPackages]);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const [summaryRes, txRes] = await Promise.all([
        PaymentService.getWalletSummary(),
        PaymentService.getWalletTransactions({ limit: 20 }),
      ]);
      setSummary(summaryRes);
      setTransactions(txRes?.transactions || []);
      setNextCursor(txRes?.nextCursor || null);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextCursor) return;
    const res = await PaymentService.getWalletTransactions({
      limit: 20,
      cursor: nextCursor,
    });
    setTransactions((prev) => [...prev, ...(res?.transactions || [])]);
    setNextCursor(res?.nextCursor || null);
  };

  const requestTopup = async (amount: number) => {
    setCreatingTopup(amount);
    try {
      const res = await PaymentService.createWalletTopupRequest(amount);
      const url = res?.whatsapp?.url;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      await fetchWallet();
    } finally {
      setCreatingTopup(null);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className='min-h-screen w-full bg-background text-foreground flex flex-col'>
      <Header setSidebarOpen={() => { }} showMenuButton={false} />

      <main className='flex-1 overflow-y-auto px-4 pb-24 pt-16 md:pt-6 space-y-6'>
        
        <div className='flex items-start justify-between gap-3'>
          <h1 className='text-2xl font-semibold text-heading'>Wallet</h1>

          {/* Desktop: inline links */}
          <div className='hidden md:flex items-center gap-3 whitespace-nowrap'>
            <Link
              href='/refundpolicyby3musafir'
              className='text-sm text-brand-primary hover:underline'
            >
              Refund policy
            </Link>
            <span className='text-border'>|</span>
            <Link
              href='/musafircommunityequityframework'
              className='text-sm text-brand-primary hover:underline'
            >
              Community equity framework
            </Link>
            <span className='text-border'>|</span>
            <Link
              href='/terms&conditonsby3musafir'
              className='text-sm text-brand-primary hover:underline'
            >
              Terms &amp; Conditions
            </Link>
          </div>

          {/* Mobile: collapsible menu */}
          <button
            type='button'
            className='md:hidden inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-brand-primary'
            onClick={() => setShowPolicies((v) => !v)}
            aria-expanded={showPolicies}
            aria-controls='wallet-policy-links'
          >
            Policies
            {showPolicies ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
          </button>
        </div>

        {showPolicies && (
          <div
            id='wallet-policy-links'
            className='md:hidden -mt-3 rounded-xl border border-border bg-card p-3'
          >
            <div className='flex flex-col gap-2'>
              <Link
                href='/refundpolicyby3musafir'
                className='text-sm text-brand-primary hover:underline'
                onClick={() => setShowPolicies(false)}
              >
                Refund policy
              </Link>
              <Link
                href='/musafircommunityequityframework'
                className='text-sm text-brand-primary hover:underline'
                onClick={() => setShowPolicies(false)}
              >
                Community equity framework
              </Link>
              <Link
                href='/terms&conditonsby3musafir'
                className='text-sm text-brand-primary hover:underline'
                onClick={() => setShowPolicies(false)}
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        )}

        <section className='rounded-xl border border-border bg-card p-4'>
          <div className='text-sm text-text'>Balance</div>
          <div className='mt-1 text-3xl font-bold text-heading'>
            {loading ? '—' : `Rs.${Number(summary?.balance || 0).toLocaleString()}`}
          </div>
          <div className='mt-1 text-xs text-text-light'>1 credit = 1 PKR</div>
        </section>

        <section className='rounded-xl border border-border bg-card p-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-heading'>Top up</h2>
            {summary?.whatsappTopupNumber && (
              <div className='text-xs text-text-light'>
                WhatsApp: {summary.whatsappTopupNumber}
              </div>
            )}
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {topupPackages.map((amount) => (
              <Button
                key={amount}
                className='bg-brand-primary hover:bg-brand-primary-hover text-btn-secondary-text'
                disabled={creatingTopup === amount}
                onClick={() => requestTopup(amount)}
              >
                Rs.{amount.toLocaleString()}
              </Button>
            ))}
          </div>
          <p className='text-sm text-text'>
            Top-ups are processed by admin after confirmation. You’ll be redirected to WhatsApp with a prefilled message.
          </p>
        </section>

        <section className='rounded-xl border border-border bg-card p-4 space-y-3'>
          <h2 className='text-lg font-semibold text-heading'>History</h2>
          {loading ? (
            <div className='text-sm text-text-light'>Loading…</div>
          ) : transactions.length === 0 ? (
            <div className='text-sm text-text-light'>No transactions yet.</div>
          ) : (
            <div className='divide-y divide-border'>
              {transactions.map((tx: any) => (
                <div key={tx._id} className='py-3 flex items-start justify-between gap-4'>
                  <div className='min-w-0'>
                    <div className='text-sm font-medium text-heading truncate'>
                      {tx.type?.replace(/_/g, ' ') || 'Transaction'}
                    </div>
                    <div className='text-xs text-text-light'>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ''}
                      {tx.status === 'void' ? ' • void' : ''}
                    </div>
                  </div>
                  <div className='text-sm font-semibold'>
                    <span className={tx.direction === 'credit' ? 'text-brand-primary' : 'text-brand-error'}>
                      {tx.direction === 'credit' ? '+' : '-'}Rs.{Number(tx.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {nextCursor && (
            <Button variant='outline' className='w-full' onClick={loadMore}>
              Load more
            </Button>
          )}
        </section>
      </main>

      <Navigation />
    </div>
  );
}

export default withAuth(Wallet);
