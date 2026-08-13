import React, { useState } from 'react';
import SoftValidationInput from './SoftValidationInput';

export default function SoftValidationDemo() {
    const mockQuestions = [
        {
            _id: "q1",
            shortHeading: "daily_active_users",
            questionText: "Daily Active Users (DAU)",
            isCumulativeTracked: false,
            minExpectedValue: 100,
            maxExpectedValue: 5000
        },
        {
            _id: "q2",
            shortHeading: "online_conversions",
            questionText: "Online Completed Conversions",
            isCumulativeTracked: true,
            minExpectedValue: 5,
            maxExpectedValue: 100
        }
    ];

    const [formState, setFormState] = useState({
        q1: { todayValue: '50', userEnteredCumulative: '', isAcknowledged: false, isValid: false }, // Breached (<100)
        q2: { todayValue: '45', userEnteredCumulative: '450', isAcknowledged: false, isValid: true } // Normal
    });

    const handleInputChange = (qId, data) => {
        setFormState(prev => ({
            ...prev,
            [qId]: data
        }));
    };

    const isFormValid = Object.values(formState).every(item => item.isValid);

    return (
        <div style={{ maxWidth: '750px', margin: '30px auto', padding: '24px', background: '#090d16', borderRadius: '16px', border: '1px solid #1e293b' }}>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>
                 Soft Validation Form Input Demo
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
                Values breaching min/max thresholds trigger a yellow warning banner and require acknowledgment before form submission.
            </p>

            {mockQuestions.map(q => (
                <SoftValidationInput
                    key={q._id}
                    question={q}
                    todayValue={formState[q._id]?.todayValue}
                    userEnteredCumulative={formState[q._id]?.userEnteredCumulative}
                    onChange={(data) => handleInputChange(q._id, data)}
                />
            ))}

            <div style={{ marginTop: '24px', padding: '16px', background: '#020617', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ fontSize: '13px', color: isFormValid ? '#34d399' : '#fbbf24', fontWeight: '600' }}>
                        Form Submission Status: {isFormValid ? ' Ready to Submit' : ' Action Required (Pending Acknowledgment)'}
                    </span>
                </div>
                <button
                    disabled={!isFormValid}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: isFormValid ? '#4f46e5' : '#334155',
                        color: isFormValid ? '#ffffff' : '#94a3b8',
                        fontWeight: '600',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        border: 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    Submit Daily Entry
                </button>
            </div>
        </div>
    );
}
