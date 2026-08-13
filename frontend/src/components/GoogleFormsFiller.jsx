import React, { useState, useMemo } from 'react';
import SoftValidationInput from './SoftValidationInput';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, CornerDownRight } from 'lucide-react';

/**
 * GoogleFormsFiller Component
 * Presents form questions one by one (Google Forms step mode) with progress indicator,
 * soft validation threshold checks, and sequential nested sub-question disclosure.
 */
export default function GoogleFormsFiller({ form, onSubmit, onCancel }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({}); // Stores: { [questionId]: { todayValue, userEnteredCumulative, isAcknowledged, isValid } }
    const [submitted, setSubmitted] = useState(false);

    const questions = form?.questions || [];

    // Group questions into logical steps (Parent Questions + their nested child sub-questions grouped together)
    const stepGroups = useMemo(() => {
        if (questions.length === 0) return [];

        const groups = [];
        let currentGroup = null;

        questions.forEach((q, idx) => {
            const isParent = q.dataType === 'matrix_row' || !q.parentQuestionId;
            if (isParent) {
                if (currentGroup) groups.push(currentGroup);
                currentGroup = {
                    parent: q,
                    children: [],
                    stepIndex: groups.length
                };
            } else {
                if (currentGroup) {
                    currentGroup.children.push(q);
                } else {
                    // Standalone root question
                    groups.push({
                        parent: q,
                        children: [],
                        stepIndex: groups.length
                    });
                }
            }
        });

        if (currentGroup && !groups.includes(currentGroup)) {
            groups.push(currentGroup);
        }

        return groups.length > 0 ? groups : questions.map((q, idx) => ({ parent: q, children: [], stepIndex: idx }));
    }, [questions]);

    const activeGroup = stepGroups[currentStep] || stepGroups[0];
    const totalSteps = stepGroups.length;
    const progressPercent = Math.round(((currentStep + 1) / Math.max(totalSteps, 1)) * 100);

    const handleAnswerChange = (qId, data) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: data
        }));
    };

    // Check if current step inputs are valid to proceed
    const isStepValid = useMemo(() => {
        if (!activeGroup) return true;

        const checkQuestionValid = (q) => {
            const entry = answers[q._id || q.id || q.shortHeading];
            if (!entry) {
                return !q.isMandatory;
            }
            return entry.isValid !== false;
        };

        const parentValid = checkQuestionValid(activeGroup.parent);
        const childrenValid = activeGroup.children.every(checkQuestionValid);
        return parentValid && childrenValid;
    }, [activeGroup, answers]);

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const formattedPayload = {
            formId: form._id || form.formId,
            targetDate: new Date().toISOString().split('T')[0],
            answers: Object.entries(answers).map(([qId, val]) => ({
                questionId: qId,
                todayValue: Number(val.todayValue || 0),
                userEnteredCumulative: val.userEnteredCumulative !== '' && val.userEnteredCumulative !== undefined ? Number(val.userEnteredCumulative) : null
            }))
        };

        if (onSubmit) {
            onSubmit(formattedPayload);
        }
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-200 text-center space-y-4 shadow-xl">
                <CheckCircle2 size={54} className="mx-auto text-emerald-500" />
                <h3 className="text-2xl font-bold text-gray-800">Response Recorded</h3>
                <p className="text-sm text-gray-500">Your daily operational entries have been logged cleanly into the Option B dynamic database engine.</p>
                <button
                    onClick={() => { setSubmitted(false); setCurrentStep(0); if (onCancel) onCancel(); }}
                    className="mt-4 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                    Submit Another Response
                </button>
            </div>
        );
    }

    if (totalSteps === 0) {
        return <div className="p-8 text-center text-gray-500">No questions configured for this form.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Top Google Forms Step Header & Progress Bar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm border-t-8 border-t-indigo-600 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{form?.title || "Daily Operational Form"}</h2>
                        <p className="text-xs text-gray-500 mt-1">{form?.description || "Answer questions one by one"}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full font-mono">
                        Step {currentStep + 1} of {totalSteps}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Current Step Focused Question Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-6">
                <div className="border-b border-gray-100 pb-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-indigo-600">
                        {activeGroup.parent.dataType === 'matrix_row' ? 'Section Category' : `Question ${currentStep + 1}`}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">
                        {activeGroup.parent.questionText || activeGroup.parent.shortHeading}
                    </h3>
                </div>

                {/* Render Parent Question Input if standalone */}
                {activeGroup.parent.dataType !== 'matrix_row' && (
                    <SoftValidationInput
                        question={activeGroup.parent}
                        todayValue={answers[activeGroup.parent._id || activeGroup.parent.id]?.todayValue || ''}
                        userEnteredCumulative={answers[activeGroup.parent._id || activeGroup.parent.id]?.userEnteredCumulative || ''}
                        onChange={(data) => handleAnswerChange(activeGroup.parent._id || activeGroup.parent.id, data)}
                    />
                )}

                {/* Render Nested Sub-Questions One By One Under Parent Category */}
                {activeGroup.children.length > 0 && (
                    <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <CornerDownRight size={14} className="text-indigo-500" /> Nested Sub-Questions ({activeGroup.children.length})
                        </h4>
                        {activeGroup.children.map((childQ, idx) => (
                            <div key={childQ._id || childQ.id || idx} className="pl-3 border-l-2 border-l-indigo-400">
                                <SoftValidationInput
                                    question={childQ}
                                    todayValue={answers[childQ._id || childQ.id]?.todayValue || ''}
                                    userEnteredCumulative={answers[childQ._id || childQ.id]?.userEnteredCumulative || ''}
                                    onChange={(data) => handleAnswerChange(childQ._id || childQ.id, data)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Step Control Navigation */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Previous
                    </button>

                    {currentStep < totalSteps - 1 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!isStepValid}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Next Question <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!isStepValid}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Submit Form Entry <CheckCircle2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
