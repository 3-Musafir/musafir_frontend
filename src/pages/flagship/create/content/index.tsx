'use client';

import { useState, useRef, type DragEvent, type ChangeEvent, useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import { Bold, Italic, UnderlineIcon, Type, MoreHorizontal, File, X } from 'lucide-react';
import { showAlert } from '@/pages/alert';
import { useRouter } from 'next/navigation';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { HttpStatusCode } from 'axios';
import { ROLES, ROUTES_CONSTANTS, steps } from '@/config/constants';
import { currentFlagship } from '@/store';
import { useRecoilValue } from 'recoil';
import withAuth from '@/hoc/withAuth';
import ProgressBar from '@/components/progressBar';

function ContentPage() {
  const activeStep = 1;
  const router = useRouter();
  const action = useFlagshipHook();
  const flagshipData = useRecoilValue(currentFlagship);
  const [files, setFiles] = useState<File[]>([]);
  const [detailedPlan, setDetailedPlan] = useState<File | null>(null);
  const [errors, setErrors] = useState({ travelPlan: false, files: false, detailedPlan: false });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailedPlanInputRef = useRef<HTMLInputElement>(null);

  const travelPlanEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: flagshipData?.travelPlan,
  });

  const tocsEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: flagshipData?.tocs,
  });

  useEffect(() => {
    if (!flagshipData._id || !flagshipData.tripName) {
      showAlert('Create a Flagship', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
  }, []);

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
    const filesEmpty = files.length === 0;
    const detailedPlanEmpty = !detailedPlan;
    setErrors({ travelPlan: travelPlanEmpty, files: filesEmpty, detailedPlan: detailedPlanEmpty });
    return !travelPlanEmpty && !filesEmpty && !detailedPlanEmpty;
  };

  const submitData = async () => {
    if (!validateFields()) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    try {
      const flagshipId = flagshipData?._id;
      const formData = new FormData();
      formData.append('travelPlan', travelPlanEditor?.getHTML() || '');
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      if (detailedPlan) {
        formData.append('detailedPlanDoc', detailedPlan);
      }

      const res: any = await action.update(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert('Content Added!', 'success');
        router.push(ROUTES_CONSTANTS.FLAGSHIP.PRICING);
      }
    } catch (error: any) {
      console.error('Error:', error);
      // Extract the actual error message from the API response
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || 'Something went wrong while updating the flagship.';
      showAlert(errorMessage, 'error');
    }
  };

  const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
      return null;
    }

    return (
      <div className='flex items-center p-2 border-b'>
        <div className='flex items-center space-x-1'>
          <div className='relative mr-2'>
            <select
              className='px-2 py-1 border rounded appearance-none pr-8 bg-white'
              onChange={(e) => {
                if (e.target.value === 'paragraph') {
                  editor.chain().focus().setParagraph().run();
                } else if (e.target.value === 'heading1') {
                  editor.chain().focus().setHeading({ level: 1 }).run();
                } else if (e.target.value === 'heading2') {
                  editor.chain().focus().setHeading({ level: 2 }).run();
                }
              }}
            >
              <option value='paragraph'>Paragraph</option>
              <option value='heading1'>Heading 1</option>
              <option value='heading2'>Heading 2</option>
            </select>
            <div className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
              <svg width='12' height='12' viewBox='0 0 12 12'>
                <path d='M2 4 L6 8 L10 4' fill='none' stroke='currentColor' strokeWidth='1.5' />
              </svg>
            </div>
          </div>
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
          <button className='p-1.5 hover:bg-gray-100 rounded'>
            <Type className='w-4 h-4' />
          </button>
          <button className='p-1.5 hover:bg-gray-100 rounded'>
            <MoreHorizontal className='w-4 h-4' />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full'>
        {/* Title */}
        <div className='text-center py-4'>
          <h1 className='text-2xl font-bold'>Create a Flagship</h1>
        </div>

        {/* Progress bar */}
        <ProgressBar steps={steps} activeStep={activeStep} />

        {/* Main Content */}
        <div className='px-4 pb-20'>
          <h2 className='text-3xl font-bold mb-6'>2: Content</h2>

          {/* Travel Plan Section */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold mb-4'>Travel Plan</h3>

            {/* Tiptap Editor for Travel Plan */}
            <div className='border rounded-lg overflow-hidden mb-4'>
              <MenuBar editor={travelPlanEditor} />
              <EditorContent
                editor={travelPlanEditor}
                className='min-h-[200px] p-4 focus:outline-none prose max-w-none'
              />
            </div>
            {errors.travelPlan && <p className='text-red-500 text-sm'>Travel Plan is required.</p>}

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
                <p className='text-red-500 text-sm'>Please upload at least one file.</p>
              )}
            </div>

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
            {errors.detailedPlan && (
              <p className='text-red-500 text-sm'>Please upload at least one file.</p>
            )}
          </div>

          {/* File List */}
          <div className='mt-4 space-y-2'>
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
          className='w-full bg-orange-500 text-black py-4 rounded-xl font-bold text-lg'
        >
          Next
        </button>
      </div>
    </div >
  );
}

export default withAuth(ContentPage, { allowedRoles: [ROLES.ADMIN] });
