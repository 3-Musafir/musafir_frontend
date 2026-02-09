'use client';

import { useState, useRef, type DragEvent, type ChangeEvent, useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  UnderlineIcon,
  Eye,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code2,
  Eraser,
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
import { FlagshipService } from '@/services/flagshipService';
import { getEditIdFromSearch, withEditId } from '@/lib/flagship-edit';
import { ensureSilentUpdate, getContentVersionToken } from '@/lib/flagshipWizard';
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
  const [errors, setErrors] = useState({ travelPlan: false, files: false });
  const [previewOpen, setPreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailedPlanInputRef = useRef<HTMLInputElement>(null);

  const baseExtensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Underline,
    TextStyle,
    Color.configure({ types: ['textStyle', 'heading'] }),
  ];

  const travelPlanEditor = useEditor({
    extensions: [
      ...baseExtensions,
      Placeholder.configure({
        placeholder: 'Describe the travel plan…',
      }),
    ],
    content: flagshipData?.travelPlan,
  });

  const tocsEditor = useEditor({
    extensions: [
      ...baseExtensions,
      Placeholder.configure({
        placeholder: 'Add TOCs, FAQs, inclusions…',
      }),
    ],
    content: flagshipData?.tocs,
  });

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
    if (travelPlanEditor && flagshipData?.travelPlan !== undefined) {
      const current = travelPlanEditor.getHTML();
      const next = flagshipData.travelPlan || '';
      if (next && current !== next) {
        travelPlanEditor.commands.setContent(next);
      }
    }
  }, [flagshipData?.travelPlan, travelPlanEditor]);

  useEffect(() => {
    if (tocsEditor && flagshipData?.tocs !== undefined) {
      const current = tocsEditor.getHTML();
      const next = flagshipData.tocs || '';
      if (next && current !== next) {
        tocsEditor.commands.setContent(next);
      }
    }
  }, [flagshipData?.tocs, tocsEditor]);

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
    if (!travelPlanEditor) {
      return false;
    }

    const travelPlanEmpty = !travelPlanEditor.getHTML() || travelPlanEditor.getHTML() === '<p></p>';
    const filesEmpty = files.length === 0 && existingImages.length === 0;
    setErrors({ travelPlan: travelPlanEmpty, files: filesEmpty });
    return !travelPlanEmpty && !filesEmpty;
  };

  const submitData = async () => {
    if (!validateFields()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    try {
      const flagshipId = flagshipData?._id;
      if (!flagshipId) {
        showAlert('Create a Flagship first', 'error');
        return;
      }
      const formData = new FormData();
      formData.append('travelPlan', travelPlanEditor?.getHTML() || '');
      formData.append('tocs', tocsEditor?.getHTML() || '');
      const contentVersionToken = getContentVersionToken(flagshipData);
      if (contentVersionToken) {
        formData.append('contentVersion', contentVersionToken);
      }
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

      const res: any = await action.update(flagshipId, formData);
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
    }
  };

  const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
      return null;
    }

    return (
      <div className='flex items-center p-2 border-b'>
        <div className='flex items-center space-x-1'>
          <select
            className='px-2 py-1 border rounded bg-white'
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().setHeading({ level: Number(value) as 1 | 2 | 3 }).run();
              }
            }}
            value={
              editor.isActive('heading', { level: 1 })
                ? '1'
                : editor.isActive('heading', { level: 2 })
                  ? '2'
                  : editor.isActive('heading', { level: 3 })
                    ? '3'
                    : 'paragraph'
            }
          >
            <option value='paragraph'>Paragraph</option>
            <option value='1'>Heading 1</option>
            <option value='2'>Heading 2</option>
            <option value='3'>Heading 3</option>
          </select>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 hover:bg-gray-100 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''
              }`}
          >
            <Bold className='w-4 h-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 hover:bg-gray-100 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''
              }`}
          >
            <Italic className='w-4 h-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 hover:bg-gray-100 rounded ${editor.isActive('underline') ? 'bg-gray-200' : ''
              }`}
          >
            <UnderlineIcon className='w-4 h-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 hover:bg-gray-100 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''
              }`}
          >
            <List className='w-4 h-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 hover:bg-gray-100 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''
              }`}
          >
            <ListOrdered className='w-4 h-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 hover:bg-gray-100 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : ''
              }`}
          >
            <Quote className='w-4 h-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 hover:bg-gray-100 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''
              }`}
          >
            <Code2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className='p-1.5 hover:bg-gray-100 rounded'
            title='Clear formatting'
          >
            <Eraser className='w-4 h-4' />
          </button>
          <div className='ml-2 flex space-x-1'>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              className='p-1.5 hover:bg-gray-100 rounded'
              disabled={!editor.can().undo()}
            >
              <Undo className='w-4 h-4' />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              className='p-1.5 hover:bg-gray-100 rounded'
              disabled={!editor.can().redo()}
            >
              <Redo className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    );
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
                disabled={!travelPlanEditor}
                title='Preview itinerary'
              >
                <Eye className='w-4 h-4' />
                <span className='text-sm font-medium'>Preview</span>
              </button>
            </div>

            {/* Tiptap Editor for Travel Plan */}
            <div className='border rounded-lg overflow-hidden mb-4'>
              <MenuBar editor={travelPlanEditor} />
              <EditorContent
                editor={travelPlanEditor}
                className='min-h-[200px] p-4 focus:outline-none prose max-w-none richtext'
              />
            </div>
            {errors.travelPlan && <p className='text-brand-error text-sm'>Travel Plan is required.</p>}

            {/* TOCs Section */}
            <h3 className='text-2xl font-bold mb-4 mt-8'>TOCs & Inclusions</h3>
            <div className='border rounded-lg overflow-hidden mb-4'>
              <MenuBar editor={tocsEditor} />
              <EditorContent
                editor={tocsEditor}
                className='min-h-[160px] p-4 focus:outline-none prose max-w-none richtext'
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
          className='w-full bg-brand-primary text-black py-4 rounded-xl font-bold text-lg'
        >
          Next
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
                    __html: travelPlanEditor?.getHTML() || '<p>No content yet.</p>',
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
