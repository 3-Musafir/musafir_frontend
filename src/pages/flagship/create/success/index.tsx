'use client';

import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { FLAGSHIP_STATUS, ROLES, ROUTES_CONSTANTS } from '@/config/constants';
import { showAlert } from '@/pages/alert';
import { useRouter } from 'next/router';
import { Flagship } from '@/interfaces/flagship';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { HttpStatusCode } from 'axios';
import withAuth from '@/hoc/withAuth';
import { mapErrorToUserMessage } from '@/utils/errorMessages';
import { FlagshipService } from '@/services/flagshipService';
import { getEditIdFromSearch } from '@/lib/flagship-edit';
import { clearDraft, loadDraft, saveDraft } from '@/lib/flagship-draft';

function SuccessPage() {
  const [flagshipData, setFlagshipData] = useState<Flagship>({} as Flagship);
  const router = useRouter();
  const action = useFlagshipHook();
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toggleError, setToggleError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [editId, setEditId] = useState<string | null | undefined>(undefined);
  const isEditMode = Boolean(editId);

  // Progress steps
  // const steps = ["Success", "Step 2", "Step 3", "Step 4", "Step 5"]

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setEditId(getEditIdFromSearch(window.location.search));
  }, []);

  useEffect(() => {
    if (editId === undefined) return;
    if (!editId) {
      const draft = loadDraft<Flagship>('create');
      if (draft) {
        setFlagshipData(draft);
      }
      return;
    }
    const loadFlagship = async () => {
      try {
        const data = await FlagshipService.getFlagshipByID(editId);
        setFlagshipData(data);
        saveDraft('edit', editId, data);
      } catch (error) {
        console.error('Failed to load flagship for edit:', error);
        showAlert(mapErrorToUserMessage(error), 'error');
        router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
      }
    };
    loadFlagship();
  }, [editId, router]);

  useEffect(() => {
    if (editId === undefined) return;
    if (isEditMode) return;
    if (!flagshipData._id || !flagshipData.startDate) {
      showAlert('Create a Flagship', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagshipData?._id, flagshipData?.startDate, isEditMode]);

  useEffect(() => {
    if (!flagshipData?._id) {
      setShareLink('');
      return;
    }
    const base =
      (process.env.NEXT_PUBLIC_AUTH_URL &&
        process.env.NEXT_PUBLIC_AUTH_URL.trim().length > 0 &&
        process.env.NEXT_PUBLIC_AUTH_URL) ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    const path = `/flagship/flagship-requirement?id=${encodeURIComponent(
      flagshipData._id,
    )}`;
    setShareLink(base ? `${base}${path}` : path);
  }, [flagshipData?._id]);

  // API call to update public status
  const updatePublicStatus = async (fStatus: boolean) => {
    try {
      const flagshipId = flagshipData._id || '';
      const formData = {
        status: FLAGSHIP_STATUS.PUBLISHED,
        publish: fStatus,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.updateWithLatestVersion(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert('Flagship is Live', 'success');
        if (res?.data) {
          setFlagshipData(res.data);
          saveDraft(editId ? 'edit' : 'create', editId ?? null, res.data);
        }
      }
      setToggleError('');
    } catch (error) {
      console.error('API Error:', error);
      setToggleError(mapErrorToUserMessage(error));
    }
  };

  // Handle toggle click: update state, call API, and adjust copy button availability
  const handleToggle = async () => {
    const newStatus = !isPublic;
    setIsPublic(newStatus);
    await updatePublicStatus(newStatus);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!shareLink) {
      showAlert('Share link is not ready yet.', 'error');
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareLink);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareLink;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showAlert('Unable to copy link', 'error');
    }
  };

  const handleHome = async () => {
    setFlagshipData({} as Flagship);
    clearDraft(editId ? 'edit' : 'create', editId ?? null);
    router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
  };

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white w-full max-w-md mx-auto rounded-lg h-screen p-3'>
        {/* Title */}
        <div className='text-center py-4'>
          <h1 className='text-2xl font-bold'>
            {isEditMode ? 'Flagship Updated' : 'Flagship Created'}
          </h1>
        </div>

        {/* Main Content */}
        <div className='px-4 pb-20'>
          <h2 className='text-3xl font-bold mb-4'>Success</h2>

          <p className='text-gray-600 text-lg mb-8'>
            Your form is now ready to be shared with the world! Copy this link to share your form on
            social media etc.
          </p>

          {/* Share Link */}
          <div className='mb-8'>
            <div className='flex items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl'>
              <div className='flex-1 font-medium truncate'>{shareLink}</div>
              <button
                onClick={copyToClipboard}
                className={`font-bold flex items-center gap-2 ${!shareLink ? 'text-gray-500' : 'text-brand-primary'
                  }`}
                disabled={!shareLink}
              >
                <Copy className='w-4 h-4' />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Public Toggle */}
          <div className='flex flex-col gap-2 mb-8'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold'>Publish trip (open to registrations)</h3>
              <button
                onClick={handleToggle}
                className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 ${isPublic ? 'bg-black' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ${isPublic ? 'translate-x-7' : ''
                    }`}
                />
              </button>
            </div>
            <p className='text-xs text-muted-foreground'>
              Publishing sets the trip status live; visibility on the marketplace is still controlled from the admin trip panel.
            </p>
          </div>
          {toggleError && <p className='text-brand-error text-sm mb-4'>{toggleError}</p>}
        </div>

        {/* Back to Home Button */}
        <div className='fixed bottom-0 left-0 right-0 px-4 py-4 bg-white'>
          <div className='max-w-md mx-auto'>
            <button
              onClick={handleHome}
              className='w-full bg-white text-black hover:bg-brand-primary py-4 rounded-xl font-bold text-lg border-2 border-gray-200 relative'
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SuccessPage, { allowedRoles: [ROLES.ADMIN] });
