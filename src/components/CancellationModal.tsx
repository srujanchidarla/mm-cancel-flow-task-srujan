/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: src/components/CancellationModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useCancellationFlow } from "@/hooks/useCancellationFlow";
import { useDownsellVariant } from "@/hooks/useDownsellVariant";
import { User, Subscription } from "@/types/cancellation";
import { sanitizeInput, validateFlowData } from "@/utils/security";

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  subscription: Subscription;
  onComplete: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  user,
  subscription,
  onComplete,
}) => {
  const {
    state,
    handleJobResponse,
    handleJobHelpResponse,
    handleDownsellResponse,
    goToStep,
  } = useCancellationFlow();
  const {
    variant,
    loading: variantLoading,
    getOffer,
  } = useDownsellVariant(user.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (variant && !state.downsellVariant) {
      state.downsellVariant = variant;
    }
  }, [variant, state]);

  const handleSubmitCancellation = async () => {
    if (!validateFlowData(state)) {
      console.error("Invalid flow data");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/cancellation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          subscriptionId: subscription.id,
          downsellVariant: variant,
          reason: sanitizeInput(state.cancellationReason || ""),
          acceptedDownsell: state.acceptedDownsell || false,
        }),
      });

      if (!response.ok) throw new Error("Failed to process cancellation");

      onComplete();
    } catch (error) {
      console.error("Cancellation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const offer = getOffer(subscription.monthly_price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto modal-content">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Subscription Cancellation
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {state.currentStep === "job_question" && (
            <JobQuestionStep
              onResponse={handleJobResponse}
              isLoading={variantLoading}
            />
          )}

          {state.currentStep === "found_job" && (
            <FoundJobStep onContinue={() => goToStep("job_help")} />
          )}

          {state.currentStep === "still_looking" && (
            <StillLookingStep onContinue={() => goToStep("job_help")} />
          )}

          {state.currentStep === "job_help" && (
            <JobHelpStep
              foundJob={state.foundJob!}
              onResponse={handleJobHelpResponse}
            />
          )}

          {state.currentStep === "downsell_offer" && offer && (
            <DownsellOfferStep
              offer={offer}
              onResponse={handleDownsellResponse}
            />
          )}

          {state.currentStep === "confirmation" && offer && (
            <ConfirmationStep
              offer={offer}
              onConfirm={handleSubmitCancellation}
              isLoading={isSubmitting}
            />
          )}

          {state.currentStep === "success" && (
            <SuccessStep
              acceptedDownsell={state.acceptedDownsell || false}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const JobQuestionStep: React.FC<{
  onResponse: (foundJob: boolean) => void;
  isLoading: boolean;
}> = ({ onResponse, isLoading }) => (
  <div className="flow-grid">
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Hey mate,
          <br />
          Quick one before you go.
        </h3>

        <h4 className="text-xl font-semibold text-gray-900 mb-4 italic">
          Have you found a job yet?
        </h4>

        <p className="text-gray-600 text-lg leading-relaxed">
          Whatever your answer, we just want to help you take the next step.
          With visa support, or by hearing how we can do better.
        </p>
      </div>

      <div className="space-y-3 max-w-md">
        <button
          onClick={() => onResponse(true)}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-900 font-medium transition-colors disabled:opacity-50 text-left"
        >
          Yes, I&apos;ve found a job
        </button>

        <button
          onClick={() => onResponse(false)}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium transition-colors disabled:opacity-50 text-left"
        >
          Not yet - I&apos;m still looking
        </button>
      </div>
    </div>

    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-md aspect-[4/3] bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 rounded-lg overflow-hidden shadow-lg">
        <div className="w-full h-full bg-gradient-to-t from-blue-900 via-blue-600 to-blue-300 flex items-end justify-center relative">
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <div className="absolute bottom-0 w-full flex justify-center items-end">
            <div className="w-8 h-24 bg-gray-800 mr-1"></div>
            <div className="w-12 h-32 bg-gray-900 mr-1"></div>
            <div className="w-6 h-20 bg-gray-700 mr-1"></div>
            <div className="w-10 h-28 bg-gray-800 mr-1"></div>
            <div className="w-8 h-24 bg-gray-900"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-36 bg-yellow-400 opacity-80"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FoundJobStep: React.FC<{
  onContinue: () => void;
}> = ({ onContinue }) => (
  <div className="text-center max-w-md mx-auto">
    <div className="text-6xl mb-4">🎉</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      Congratulations on finding a job!
    </h3>
    <p className="text-gray-600 mb-6 text-lg">
      That&apos;s fantastic news! We&apos;re so happy for you.
    </p>
    <button onClick={onContinue} className="btn-primary">
      Continue
    </button>
  </div>
);

const StillLookingStep: React.FC<{
  onContinue: () => void;
}> = ({ onContinue }) => (
  <div className="text-center max-w-md mx-auto">
    <div className="text-6xl mb-4">💪</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      Keep going, you&apos;ve got this!
    </h3>
    <p className="text-gray-600 mb-6 text-lg">
      Job searching can be tough, but you&apos;re on the right track.
    </p>
    <button onClick={onContinue} className="btn-primary">
      Continue
    </button>
  </div>
);

const JobHelpStep: React.FC<{
  foundJob: boolean;
  onResponse: (needsHelp: boolean) => void;
}> = ({ foundJob, onResponse }) => (
  <div className="text-center max-w-lg mx-auto">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      {foundJob
        ? "Do you need help with visa sponsorship?"
        : "Would you like help finding job opportunities?"}
    </h3>
    <p className="text-gray-600 mb-6 text-lg">
      We have resources that might be helpful for your situation.
    </p>
    <div className="space-y-3">
      <button onClick={() => onResponse(true)} className="w-full btn-primary">
        Yes, I&apos;d like help
      </button>
      <button
        onClick={() => onResponse(false)}
        className="w-full btn-secondary"
      >
        No, I&apos;m all set
      </button>
    </div>
  </div>
);

const DownsellOfferStep: React.FC<{
  offer: any;
  onResponse: (accepted: boolean) => void;
}> = ({ offer, onResponse }) => (
  <div className="text-center max-w-lg mx-auto">
    <h3 className="text-3xl font-bold text-gray-900 mb-6">Before you go...</h3>

    {offer.variant === "B" ? (
      <div className="mb-8">
        <p className="text-gray-600 mb-6 text-lg">
          We&apos;d like to offer you a special discount to stay with us:
        </p>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <div className="text-3xl font-bold mb-2">
            <span className="line-through text-gray-500 text-xl">
              ${(offer.originalPrice / 100).toFixed(2)}
            </span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="text-green-600">
              ${(offer.discountedPrice / 100).toFixed(2)}
            </span>
            <span className="text-lg text-gray-600">/month</span>
          </div>
          <p className="text-green-700 font-medium">
            Save ${(offer.discount / 100).toFixed(2)} every month!
          </p>
        </div>
      </div>
    ) : (
      <p className="text-gray-600 mb-8 text-lg">
        We understand you&apos;d like to cancel. Is there anything we can do to
        help you stay?
      </p>
    )}

    <div className="space-y-4">
      {offer.variant === "B" && (
        <button
          onClick={() => onResponse(true)}
          className="w-full btn-success text-lg py-4"
        >
          🎉 Accept This Offer
        </button>
      )}
      <button
        onClick={() => onResponse(false)}
        className="w-full btn-secondary text-lg py-4"
      >
        {offer.variant === "B"
          ? "No thanks, cancel anyway"
          : "Proceed with cancellation"}
      </button>
    </div>
  </div>
);

const ConfirmationStep: React.FC<{
  offer: any;
  onConfirm: () => void;
  isLoading: boolean;
}> = ({ offer, onConfirm, isLoading }) => (
  <div className="text-center max-w-lg mx-auto">
    <div className="text-6xl mb-4">🎉</div>
    <h3 className="text-3xl font-bold text-gray-900 mb-6">
      Perfect! Here&apos;s what happens next:
    </h3>
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-8">
      <p className="text-green-800 font-bold text-xl mb-2">
        Your subscription will continue at $
        {(offer.discountedPrice / 100).toFixed(2)}/month
      </p>
      <p className="text-green-600 font-medium">
        You&apos;re saving ${(offer.discount / 100).toFixed(2)} every month!
      </p>
    </div>
    <button
      onClick={onConfirm}
      disabled={isLoading}
      className="btn-success text-lg py-4 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Processing..." : "Confirm & Continue"}
    </button>
  </div>
);

const SuccessStep: React.FC<{
  acceptedDownsell: boolean;
  onClose: () => void;
}> = ({ acceptedDownsell, onClose }) => (
  <div className="text-center max-w-lg mx-auto">
    <div className="text-6xl mb-4">{acceptedDownsell ? "🎉" : "👋"}</div>
    <h3 className="text-3xl font-bold text-gray-900 mb-6">
      {acceptedDownsell ? "All set!" : "We're sorry to see you go"}
    </h3>
    <p className="text-gray-600 mb-8 text-lg">
      {acceptedDownsell
        ? "Your subscription has been updated with the new pricing. Thank you for staying with us!"
        : "Your cancellation has been processed. Thank you for being with us, and best of luck!"}
    </p>
    <button onClick={onClose} className="btn-primary text-lg py-4 px-8">
      Close
    </button>
  </div>
);

export default CancellationModal;
