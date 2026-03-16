'use client';

import { useState, useRef, type DragEvent, type ChangeEvent, useEffect } from 'react';
import {
  Eye,
  File,
  X,
} from 'lucide-react';
import { showAlert } from '@/pages/alert';
import { useRouter } from 'next/navigation';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { HttpStatusCode } from 'axios';
import { ROLES, ROUTES_CONSTANTS, steps } from '@/config/constants';
import { mapErrorToUserMessage } from '@/utils/errorMessages';
import withAuth from '@/hoc/withAuth';
import ProgressBar from '@/components/progressBar';
import RichTextEditor from '@/components/RichTextEditor';
import { isHtmlBodyEmpty } from '@/utils/htmlToPlainText';
import { FlagshipService } from '@/services/flagshipService';
import { getEditIdFromSearch, withEditId } from '@/lib/flagship-edit';
import { ensureSilentUpdate } from '@/lib/flagshipWizard';
import { Flagship } from '@/interfaces/flagship';
import { loadDraft, saveDraft } from '@/lib/flagship-draft';

function ContentPage() {
  const activeStep = 1;
  const router = useRouter();
  const action = useFlagshipHook();
  const [flagshipData, setFlagshipData] = useState<Flagship>({} as Flagship);
  const [editId, setEditId] = useState<string | null | undefined>(undefined);
  const isEditMode = Boolean(editId);
  const [files, setFiles] = useState<File[]>([]);
  const [detailedPlan, setDetailedPlan] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [removeExistingDetailedPlan, setRemoveExistingDetailedPlan] = useState(false);
  const [travelPlanHtml, setTravelPlanHtml] = useState('');
  const [tocsHtml, setTocsHtml] = useState('');
  const [errors, setErrors] = useState({ travelPlan: false, files: false });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailedPlanInputRef = useRef<HTMLInputElement>(null);

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
    if (!flagshipData._id || !flagshipData.tripName) {
      showAlert('Create a Flagship', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
  }, [flagshipData?._id, flagshipData?.tripName, isEditMode, router]);

  useEffect(() => {
    if (flagshipData?.images && Array.isArray(flagshipData.images)) {
      setExistingImages(flagshipData.images);
    }
  }, [flagshipData?.images]);

  useEffect(() => {
    if (flagshipData?.travelPlan) {
      setTravelPlanHtml(flagshipData.travelPlan);
    }
  }, [flagshipData?.travelPlan]);

  useEffect(() => {
    if (flagshipData?.tocs) {
      setTocsHtml(flagshipData.tocs);
    }
  }, [flagshipData?.tocs]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleDetailedPlanDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setDetailedPlan(droppedFiles[0]);
  };

  const handleDetailedPlanSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setDetailedPlan(selectedFiles[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const extractImageKey = (value: string) => {
    try {
      const parsed = new URL(value);
      return decodeURIComponent(parsed.pathname).replace(/^\/+/, '');
    } catch {
      return value;
    }
  };

  const formatImageLabel = (value: string) => {
    if (!value) return 'Image';
    try {
      const parsed = new URL(value);
      const segments = parsed.pathname.split('/');
      return decodeURIComponent(segments[segments.length - 1] || value);
    } catch {
      const segments = value.split('/');
      return segments[segments.length - 1] || value;
    }
  };

  const removeExistingImage = (image: string) => {
    setExistingImages((prev) => prev.filter((item) => item !== image));
    const key = extractImageKey(image);
    setRemovedImages((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const removeDetailedPlan = () => {
    setDetailedPlan(null);
  };

  const preventDefault = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFields = () => {
    const travelPlanEmpty = isHtmlBodyEmpty(travelPlanHtml);
    const filesEmpty = files.length === 0 && existingImages.length === 0;
    setErrors({ travelPlan: travelPlanEmpty, files: filesEmpty });
    return !travelPlanEmpty && !filesEmpty;
  };

  const submitData = async () => {
    if (!validateFields()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const flagshipId = flagshipData?._id;
      if (!flagshipId) {
        showAlert('Create a Flagship first', 'error');
        return;
      }
      const formData = new FormData();
      formData.append('travelPlan', travelPlanHtml || '');
      formData.append('tocs', tocsHtml || '');
      ensureSilentUpdate(formData);
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      if (removedImages.length > 0) {
        formData.append('removeImages', JSON.stringify(removedImages));
      }
      if (detailedPlan) {
        formData.append('detailedPlanDoc', detailedPlan);
      }
      if (removeExistingDetailedPlan) {
        formData.append('removeDetailedPlan', 'true');
      }

      const res: any = await action.updateWithLatestVersion(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert('Content Added!', 'success');
        if (res?.data) {
          setFlagshipData(res.data);
          saveDraft(editId ? 'edit' : 'create', editId ?? null, res.data);
        }
        router.push(withEditId(ROUTES_CONSTANTS.FLAGSHIP.PRICING, editId));
      }
    } catch (error: any) {
      console.error('Error:', error);
      showAlert(mapErrorToUserMessage(error), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full'>
        {/* Title */}
        <div className='text-center py-4'>
          <h1 className='text-2xl font-bold'>
            {isEditMode ? 'Edit a Flagship' : 'Create a Flagship'}
          </h1>
        </div>

        {/* Progress bar */}
        <ProgressBar steps={steps} activeStep={activeStep} />

        {/* Main Content */}
        <div className='px-4 pb-20'>
          <h2 className='text-3xl font-bold mb-6'>2: Content</h2>

          {/* Travel Plan Section */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-2xl font-bold'>Travel Plan</h3>
              <button
                type='button'
                onClick={() => setPreviewOpen(true)}
                className='flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50'
                title='Preview itinerary'
              >
                <Eye className='w-4 h-4' />
                <span className='text-sm font-medium'>Preview</span>
              </button>
            </div>

            {/* Quill Editor for Travel Plan */}
            <div className='mb-4'>
              <RichTextEditor
                value={travelPlanHtml}
                onChange={setTravelPlanHtml}
                placeholder='Describe the travel plan…'
              />
            </div>
            {errors.travelPlan && <p className='text-brand-error text-sm'>Travel Plan is required.</p>}

            {/* TOCs Section */}
            <h3 className='text-2xl font-bold mb-4 mt-8'>TOCs & Inclusions</h3>
            <div className='mb-4'>
              <RichTextEditor
                value={tocsHtml}
                onChange={setTocsHtml}
                placeholder='Add TOCs, FAQs, inclusions…'
              />
            </div>

            {/* File Upload Area */}
            <h3 className='text-2xl font-bold mb-4'>Upload Images</h3>
            <div
              className='mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8'
              onDrop={handleDrop}
              onDragOver={preventDefault}
              onDragEnter={preventDefault}
            >
              <div className='text-center'>
                <p className='text-gray-600 mb-4'>Drop files here to upload...</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='bg-gray-100 px-4 py-2 rounded-lg font-medium'
                >
                  Browse files
                </button>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className='hidden'
                  multiple
                />
              </div>
            {errors.files && (
              <p className='text-brand-error text-sm'>Please upload at least one file.</p>
            )}
          </div>

            {existingImages.length > 0 && (
              <div className='mt-4 space-y-2'>
                {existingImages.map((image) => (
                  <div
                    key={image}
                    className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-white rounded-lg'>
                        <File className='w-6 h-6' />
                      </div>
                      <div>
                        <p className='font-medium'>{formatImageLabel(image)}</p>
                        <p className='text-sm text-gray-500'>Existing image</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeExistingImage(image)}
                      className='p-1 hover:bg-gray-200 rounded-full'
                      type='button'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* File List */}
            <div className='mt-4 space-y-2'>
              {files.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-white rounded-lg'>
                      <File className='w-6 h-6' />
                    </div>
                    <div>
                      <p className='font-medium'>{file.name}</p>
                      <p className='text-sm text-gray-500'>{file.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.name)}
                    className='p-1 hover:bg-gray-200 rounded-full'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Travel Plan */}
          <h3 className='text-2xl font-bold mb-4'>Detailed Travel Plan</h3>
          <div
            className='mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8'
            onDrop={handleDetailedPlanDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
          >
            <div className='text-center'>
              <p className='text-gray-600 mb-4'>Drop file here to upload...</p>
              <button
                onClick={() => detailedPlanInputRef.current?.click()}
                className='bg-gray-100 px-4 py-2 rounded-lg font-medium'
              >
                Browse files
              </button>
              <input
                type='file'
                ref={detailedPlanInputRef}
                onChange={handleDetailedPlanSelect}
                className='hidden'
                multiple
              />
            </div>
            {/* Detailed plan is now optional */}
          </div>

          {/* File List */}
          <div className='mt-4 space-y-2'>
            {flagshipData?.detailedPlan && !detailedPlan && !removeExistingDetailedPlan && (
              <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-white rounded-lg'>
                    <File className='w-6 h-6' />
                  </div>
                  <div>
                    <p className='font-medium'>Existing detailed plan</p>
                    <p className='text-sm text-gray-500'>Attached</p>
                  </div>
                </div>
                <button
                  onClick={() => setRemoveExistingDetailedPlan(true)}
                  className='p-1 hover:bg-gray-200 rounded-full'
                  type='button'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            )}
            {detailedPlan && (
              <div
                className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
              >
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-white rounded-lg'>
                    <File className='w-6 h-6' />
                  </div>
                  <div>
                    <p className='font-medium'>{detailedPlan.name}</p>
                    <p className='text-sm text-gray-500'>{detailedPlan.size}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeDetailedPlan()}
                  className='p-1 hover:bg-gray-200 rounded-full'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={submitData}
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          className={`w-full bg-brand-primary text-black py-4 rounded-xl font-bold text-lg transition-colors ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2' />
              Uploading...
            </span>
          ) : 'Next'}
        </button>

        {/* Preview Modal */}
        {previewOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-lg'>
              <div className='flex items-center justify-between p-4 border-b'>
                <h3 className='text-lg font-semibold'>Travel Plan Preview</h3>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className='p-2 hover:bg-gray-100 rounded-full'
                  aria-label='Close preview'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
              <div className='p-4 overflow-auto max-h-[70vh] prose max-w-none richtext'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: travelPlanHtml || '<p>No content yet.</p>',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default withAuth(ContentPage, { allowedRoles: [ROLES.ADMIN] });
