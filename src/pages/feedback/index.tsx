import React, { useState, useEffect } from 'react';
import { Navigation } from '../navigation';
import withAuth from '@/hoc/withAuth';
import { useRouter } from 'next/router';
import useFeedbackHook from '@/hooks/useFeedbackHandler';
import { showAlert } from '../alert';

function Feedback() {
  const router = useRouter();
  const { registrationId, title, price } = router.query;
  const { createFeedback } = useFeedbackHook();

  const [travellerType, setTravellerType] = useState<string>('solo-female');
  const [tripReason, setTripReason] = useState<string>('change-of-plans');
  const [likeAboutTrip, setLikeAboutTrip] = useState<string>('');
  const [improvement, setImprovement] = useState<string>('');
  const [rateExperience, setRateExperience] = useState<boolean>(true);
  const [noRateExperience, setNoRateExperience] = useState<boolean>(false);
  const [teamResponseRating, setTeamResponseRating] = useState<number>(5);
  const [tripRating, setTripRating] = useState<number>(10);
  const [talkTo, setTalkTo] = useState<string>('');
  const [enjoyableActivity, setEnjoyableActivity] = useState<string>('');
  const [leastEnjoyableActivity, setLeastEnjoyableActivity] = useState<string>('');
  const [whistleblowing, setWhistleblowing] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');

  const handleSubmit = async () => {
    if (!registrationId) {
      showAlert("Missing registration ID", "error");
      return;
    }

    const feedback = {
      travellerType,
      experience: tripReason,
      rating: tripRating,
      likeAboutTrip,
      improvements: improvement,
      teamResponseRating,
      talkedTo: talkTo,
      enjoyableActivities: enjoyableActivity,
      leastEnjoyableActivities: leastEnjoyableActivity,
      whistleblowing,
      contactInfo,
      registrationId: registrationId as string,
    };

    const response = await createFeedback(feedback, registrationId as string);

    if (response.statusCode === 200) {
      showAlert("Feedback submitted successfully", "success");
      router.push("/passport");
    } else {
      showAlert(response.message || "Failed to submit feedback", "error");
    }
  };


  const handleRadioChange = (value: 'yes' | 'no') => {
    if (value === 'yes') {
      setRateExperience(true);
      setNoRateExperience(false);
    } else {
      setRateExperience(false);
      setNoRateExperience(true);
    }
  };

  useEffect(() => {
    handleRadioChange('no');
  }, []);

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white w-full max-w-md mx-auto rounded-lg pb-20'>
        {/* Header */}
        <header className='flex items-center p-4'>
          <button onClick={() => router.back()} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className='text-xl font-semibold'>Feedback</h1>
        </header>

        {/* Main Content */}
        <main className='px-4 space-y-6'>
          <div>
            <h2 className='text-3xl font-bold text-heading'>Quickest Feedback Ever</h2>
            <p className='text-[#757575] text-md'>Fill out this small community onboarding form</p>
          </div>

          <div className='space-y-6'>
            {/* Flagship Selection */}
            <div className='space-y-3'>
              <label className='block text-md font-medium text-gray-900'>
                Flagship you have registered in
              </label>
              <div className='rounded-lg bg-white text-gray-900 flex justify-between items-center px-4'>
                <div className='font-semibold'>{title || 'Spooktober3.0'}</div>
                <div className='text-md text-[#757575]'>Rs.{price ? Number(price).toLocaleString() : '43,000'}</div>
              </div>
            </div>

            {/* Traveler Type */}
            <div className='space-y-3'>
              <label className='block text-md font-medium text-gray-900'>
                Are you a solo female traveller?
              </label>
              <div className='flex overflow-x-auto space-x-3 pb-2' style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <button
                  onClick={() => setTravellerType('solo-female')}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-md font-medium whitespace-nowrap ${travellerType === 'solo-female'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  Solo Female
                </button>
                <button
                  onClick={() => setTravellerType('no-male')}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-md font-medium whitespace-nowrap ${travellerType === 'no-male'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  No, Male
                </button>
                <button
                  onClick={() => setTravellerType('female-with-family')}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-md font-medium whitespace-nowrap ${travellerType === 'female-with-family'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  Female But Came with other musafirs
                </button>
              </div>
            </div>

            {/* Trip Reason */}
            <div className='space-y-3'>
              <label className='block text-md font-medium text-gray-900'>
                How satisfied were you with your trip experience?
              </label>
              <div className='grid grid-cols-2 gap-y-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      checked={tripReason === 'change-of-plans'}
                      onChange={() => setTripReason('change-of-plans')}
                      className='opacity-0 absolute h-5 w-5'
                      name="trip-reason"
                    />
                    <div className={`h-5 w-5 rounded-full border ${tripReason === 'change-of-plans' ? 'border-black' : 'border-gray-300'} flex items-center justify-center`}>
                      {tripReason === 'change-of-plans' && <div className='h-2.5 w-2.5 rounded-full bg-black'></div>}
                    </div>
                  </div>
                  <span className={`text-md ${tripReason === 'change-of-plans' ? 'font-semibold' : 'text-[#5E5E5E]'}`}>Change of plans</span>
                </label>

                <label className='flex items-center gap-3 cursor-pointer'>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      checked={tripReason === 'family-errands'}
                      onChange={() => setTripReason('family-errands')}
                      className='opacity-0 absolute h-5 w-5'
                      name="trip-reason"
                    />
                    <div className={`h-5 w-5 rounded-full border ${tripReason === 'family-errands' ? 'border-black' : 'border-gray-300'} flex items-center justify-center`}>
                      {tripReason === 'family-errands' && <div className='h-2.5 w-2.5 rounded-full bg-black'></div>}
                    </div>
                  </div>
                  <span className={`text-md ${tripReason === 'family-errands' ? 'font-semibold' : 'text-[#5E5E5E]'}`}>Family errands</span>
                </label>

                <label className='flex items-center gap-3 cursor-pointer'>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      checked={tripReason === 'health-reasons'}
                      onChange={() => setTripReason('health-reasons')}
                      className='opacity-0 absolute h-5 w-5'
                      name="trip-reason"
                    />
                    <div className={`h-5 w-5 rounded-full border ${tripReason === 'health-reasons' ? 'border-black' : 'border-gray-300'} flex items-center justify-center`}>
                      {tripReason === 'health-reasons' && <div className='h-2.5 w-2.5 rounded-full bg-black'></div>}
                    </div>
                  </div>
                  <span className={`text-md ${tripReason === 'health-reasons' ? 'font-semibold' : 'text-[#5E5E5E]'}`}>Health reasons</span>
                </label>

                <label className='flex items-center gap-3 cursor-pointer'>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      checked={tripReason === 'financial-constraints'}
                      onChange={() => setTripReason('financial-constraints')}
                      className='opacity-0 absolute h-5 w-5'
                      name="trip-reason"
                    />
                    <div className={`h-5 w-5 rounded-full border ${tripReason === 'financial-constraints' ? 'border-black' : 'border-gray-300'} flex items-center justify-center`}>
                      {tripReason === 'financial-constraints' && <div className='h-2.5 w-2.5 rounded-full bg-black'></div>}
                    </div>
                  </div>
                  <span className={`text-md ${tripReason === 'financial-constraints' ? 'font-semibold' : 'text-[#5E5E5E]'}`}>Financial constraints</span>
                </label>
              </div>
            </div>

            <div className='space-y-3'>
              <label className='block text-md font-medium text-gray-900'>
                Please rate your experience with the trip?
              </label>
              <div className='space-y-3'>
                <div className='flex items-center justify-between text-sm text-[#757575] px-5'>
                  <span>1 (Unsatisfactory)</span>
                  <span>10 (Extremely enjoyable)</span>
                </div>

                <div className='relative py-2'>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={tripRating}
                    onChange={(e) => setTripRating(parseInt(e.target.value))}
                    className='w-full appearance-none bg-gray-200 h-1 rounded-full'
                    style={{
                      background: `linear-gradient(to right, black 0%, black ${(tripRating - 1) * 11.11}%, #e5e7eb ${(tripRating - 1) * 11.11}%, #e5e7eb 100%)`
                    }}
                  />
                  <style jsx>{`
                        input[type=range]::-webkit-slider-thumb {
                          appearance: none;
                          width: 25px;
                          height: 25px;
                          border-radius: 50%;
                          background: white;
                          border: 1px solid #d1d5db;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                          cursor: pointer;
                        }
                        input[type=range]::-moz-range-thumb {
                          width: 25px;
                          height: 25px;
                          border-radius: 50%;
                          background: white;
                          border: 1px solid #d1d5db;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                          cursor: pointer;
                        }
                      `}</style>
                </div>

                <div className='flex items-center justify-between px-5'>
                  <button
                    onClick={() => setTripRating(Math.max(1, tripRating - 1))}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <span className='w-20 text-center text-xl font-medium'>{tripRating}</span>
                  <button
                    onClick={() => setTripRating(Math.min(10, tripRating + 1))}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Like About Trip */}
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <label className='block text-md font-medium text-gray-900'>
                  What did you like most about your trip? (optional)
                </label>
                <span className='text-md text-[#757575]'>{likeAboutTrip.length}/100</span>
              </div>
              <textarea
                value={likeAboutTrip}
                onChange={(e) => setLikeAboutTrip(e.target.value)}
                className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary focus:ring-brand-primary'
                rows={3}
                maxLength={100}
              />
            </div>

            {/* Improvement Suggestions */}
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <label className='block text-md font-medium text-gray-900'>
                  What could we improve for future trips? (optional)
                </label>
                <span className='text-md text-[#757575]'>{improvement.length}/100</span>
              </div>
              <textarea
                value={improvement}
                onChange={(e) => setImprovement(e.target.value)}
                className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary focus:ring-brand-primary'
                rows={3}
                maxLength={100}
              />
            </div>

            {/* Rate Experience */}
            <div className='space-y-3'>
              <label className='block text-md font-medium text-gray-900'>
                If you have 1 more minute, can you please rate certain experiences and the management team?
              </label>
              <div className='flex flex-col gap-3'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      checked={rateExperience}
                      onChange={() => handleRadioChange('yes')}
                      className='opacity-0 absolute h-5 w-5'
                      name="rate-experience"
                    />
                    <div className={`h-5 w-5 rounded-full border ${rateExperience ? 'border-black' : 'border-gray-300'} flex items-center justify-center`}>
                      {rateExperience && <div className='h-2.5 w-2.5 rounded-full bg-black'></div>}
                    </div>
                  </div>
                  <span className={`text-md ${rateExperience ? 'font-semibold' : 'text-[#5E5E5E]'}`}>Yes, I'll help design better trips</span>
                </label>

                <label className='flex items-center gap-3 cursor-pointer'>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      checked={noRateExperience}
                      onChange={() => handleRadioChange('no')}
                      className='opacity-0 absolute h-5 w-5'
                      name="rate-experience"
                    />
                    <div className={`h-5 w-5 rounded-full border ${noRateExperience ? 'border-black' : 'border-gray-300'} flex items-center justify-center`}>
                      {noRateExperience && <div className='h-2.5 w-2.5 rounded-full bg-black'></div>}
                    </div>
                  </div>
                  <span className={`text-md ${noRateExperience ? 'font-semibold' : 'text-[#5E5E5E]'}`}>Nah, got no time</span>
                </label>
              </div>
            </div>

            {/* Conditional rendering for the rest of the form */}
            {rateExperience && (
              <>
                {/* Team Response Rating */}
                <div className='space-y-3'>
                  <label className='block text-md font-medium text-gray-900'>
                    How responsive was the team to your queries?
                  </label>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between text-dm text-[#757575] px-5'>
                      <span>1 (Not responsive)</span>
                      <span>10 (Extremely responsive)</span>
                    </div>

                    <div className='relative py-2'>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={teamResponseRating}
                        onChange={(e) => setTeamResponseRating(parseInt(e.target.value))}
                        className='w-full appearance-none bg-gray-200 h-1 rounded-full'
                        style={{
                          background: `linear-gradient(to right, black 0%, black ${(teamResponseRating - 1) * 11.11}%, #e5e7eb ${(teamResponseRating - 1) * 11.11}%, #e5e7eb 100%)`
                        }}
                      />
                      <style jsx>{`
                        input[type=range]::-webkit-slider-thumb {
                          appearance: none;
                          width: 25px;
                          height: 25px;
                          border-radius: 50%;
                          background: white;
                          border: 1px solid #d1d5db;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                          cursor: pointer;
                        }
                        input[type=range]::-moz-range-thumb {
                          width: 25px;
                          height: 25px;
                          border-radius: 50%;
                          background: white;
                          border: 1px solid #d1d5db;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                          cursor: pointer;
                        }
                      `}</style>
                    </div>

                    <div className='flex items-center justify-between px-5'>
                      <button
                        onClick={() => setTeamResponseRating(Math.max(1, teamResponseRating - 1))}
                        className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                      </button>
                      <span className='w-20 text-center text-xl font-medium'>{teamResponseRating}</span>
                      <button
                        onClick={() => setTeamResponseRating(Math.min(10, teamResponseRating + 1))}
                        className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Who did you talk to */}
                <div className='space-y-3'>
                  <input
                    type="text"
                    value={talkTo}
                    onChange={(e) => setTalkTo(e.target.value)}
                    className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary focus:ring-brand-primary'
                    placeholder="Who did you talk to?"
                  />
                </div>

                {/* Most Enjoyable Activity */}
                <div className='space-y-3'>
                  <label className='block text-md font-medium text-gray-900'>
                    Most enjoyable activity in the itinerary was
                  </label>
                  <input
                    type="text"
                    value={enjoyableActivity}
                    onChange={(e) => setEnjoyableActivity(e.target.value)}
                    className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary focus:ring-brand-primary'
                    placeholder="e.g scav hunt"
                  />
                </div>

                {/* Least Enjoyable Activity */}
                <div className='space-y-3'>
                  <label className='block text-md font-medium text-gray-900'>
                    And now the least enjoyable activity
                  </label>
                  <input
                    type="text"
                    value={leastEnjoyableActivity}
                    onChange={(e) => setLeastEnjoyableActivity(e.target.value)}
                    className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary focus:ring-brand-primary'
                    placeholder="e.g mehndi night"
                  />
                </div>

                {/* Whistleblowing Section */}
                <div className='space-y-3'>
                  <label className='block text-md font-medium text-gray-900'>
                    Whistleblowing Section ⚠️⚠️⚠️
                  </label>
                  <p className='text-md text-[#757575]'>
                    If you observed any unethical behavior, safety violations, or other serious concerns during the trip, please describe them here. This form is kept anonymous just so we could add this section.
                  </p>
                  <textarea
                    value={whistleblowing}
                    onChange={(e) => setWhistleblowing(e.target.value)}
                    className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary focus:ring-brand-primary'
                    rows={2}
                    placeholder="X was doing this..."
                  />
                </div>

                {/* Contact Information */}
                <div className='space-y-3'>
                  <label className='block text-md font-medium text-gray-900'>
                    If you want us to reach back, please drop your number or email
                  </label>
                  <p className='text-md text-[#757575]'>
                    Certain cases require us to hear more, pls share with us a way to contact you. (Because this form is truly anonymous we don't even collect emails)
                  </p>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className='block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-primary focus:ring-brand-primary'
                    placeholder="Name, number & email to contact you..."
                  />
                </div>
              </>
            )}

            {/* Submit Button - always visible */}
            <button
              onClick={handleSubmit}
              className='w-full rounded-lg bg-brand-primary px-4 py-3 text-heading font-medium hover:bg-brand-primary/90 transition-colors'
            >
              Submit Feedback
            </button>
          </div>
        </main>

        {/* Navigation */}
      </div>
      <Navigation />
    </div>
  );
}

export default withAuth(Feedback);
