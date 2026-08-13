import React, { useState, useMemo } from 'react';

/**
 * SoftValidationInput
 * Enforces Option B soft validation threshold rules.
 * If value < minExpectedValue or value > maxExpectedValue, displays a yellow warning box
 * with a cross-check acknowledgment checkbox instead of a hard blocking error.
 */
export default function SoftValidationInput({
    question,
    todayValue = '',
    userEnteredCumulative = '',
    onChange,
    disabled = false
}) {
    const [acknowledged, setAcknowledged] = useState(false);

    const {
        shortHeading,
        questionText,
        minExpectedValue,
        maxExpectedValue,
        isCumulativeTracked
    } = question || {};

    const numValue = Number(todayValue);
    const hasInput = todayValue !== '' && !isNaN(numValue);

    // Evaluate soft validation thresholds
    const isBelowMin = hasInput && minExpectedValue !== null && minExpectedValue !== undefined && numValue < minExpectedValue;
    const isAboveMax = hasInput && maxExpectedValue !== null && maxExpectedValue !== undefined && numValue > maxExpectedValue;
    const isBreached = isBelowMin || isAboveMax;

    // Check if input is valid (not breached OR breached but acknowledged)
    const isValid = !isBreached || acknowledged;

    const handleTodayChange = (e) => {
        const val = e.target.value;
        setAcknowledged(false); // Reset acknowledgment when value changes
        if (onChange) {
            onChange({
                todayValue: val,
                userEnteredCumulative,
                isAcknowledged: false,
                isBreached,
                isValid: !isBreached
            });
        }
    };

    const handleCumulativeChange = (e) => {
        const val = e.target.value;
        if (onChange) {
            onChange({
                todayValue,
                userEnteredCumulative: val,
                isAcknowledged: acknowledged,
                isBreached,
                isValid
            });
        }
    };

    const handleAckToggle = (e) => {
        const checked = e.target.checked;
        setAcknowledged(checked);
        if (onChange) {
            onChange({
                todayValue,
                userEnteredCumulative,
                isAcknowledged: checked,
                isBreached,
                isValid: !isBreached || checked
            });
        }
    };

    return (
        <div style={styles.cardContainer} className="soft-val-card border border-slate-700 bg-slate-900 text-slate-100 p-5 rounded-xl mb-4 shadow-lg">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-lg font-semibold text-white">{questionText || "Question Metric"}</h4>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                        {shortHeading || "metric"}
                    </span>
                </div>
                {(minExpectedValue !== null || maxExpectedValue !== null) && (
                    <div className="text-xs text-slate-400 text-right font-mono bg-slate-800/60 px-2 py-1 rounded">
                        Range: [{minExpectedValue ?? '∞'}, {maxExpectedValue ?? '∞'}]
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                        Today's Input Value <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        value={todayValue}
                        onChange={handleTodayChange}
                        disabled={disabled}
                        placeholder="Enter daily value"
                        className={`w-full px-3 py-2 bg-slate-950 border rounded-lg text-white font-mono text-sm focus:outline-none transition-colors ${
                            isBreached && !acknowledged
                                ? 'border-amber-400 focus:ring-2 focus:ring-amber-400/50'
                                : 'border-slate-700 focus:border-indigo-500'
                        }`}
                        style={isBreached && !acknowledged ? styles.inputWarning : styles.inputNormal}
                    />
                </div>

                {isCumulativeTracked && (
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                            Cumulative Total Cross-Check <span className="text-indigo-400">(Tracked)</span>
                        </label>
                        <input
                            type="number"
                            value={userEnteredCumulative}
                            onChange={handleCumulativeChange}
                            disabled={disabled}
                            placeholder="Enter expected total to date"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                            style={styles.inputNormal}
                        />
                    </div>
                )}
            </div>

            {/* Soft Validation Yellow Warning Alert */}
            {isBreached && (
                <div
                    style={styles.warningBanner}
                    className="mt-4 p-3 bg-amber-500/10 border border-amber-500/40 rounded-lg text-amber-300 text-sm flex flex-col gap-2"
                >
                    <div className="flex items-center gap-2 font-medium">
                        <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Soft Validation Warning: Value outside expected threshold</span>
                    </div>
                    <p className="text-xs text-amber-200/90 pl-7">
                        Input value <strong className="font-mono text-amber-100">{numValue}</strong> is {isBelowMin ? `below the minimum threshold (${minExpectedValue})` : `above the maximum threshold (${maxExpectedValue})`}.
                    </p>
                    <div className="pl-7 mt-1 flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-amber-200 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={acknowledged}
                                onChange={handleAckToggle}
                                className="rounded border-amber-400 text-amber-500 focus:ring-amber-400 bg-slate-900"
                            />
                            I acknowledge and confirm this out-of-bounds metric value
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    cardContainer: {
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        color: '#f8fafc'
    },
    inputNormal: {
        background: '#020617',
        border: '1px solid #334155',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '8px 12px'
    },
    inputWarning: {
        background: '#1e1b4b',
        border: '1.5px solid #f59e0b',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '8px 12px'
    },
    warningBanner: {
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '12px',
        color: '#fcd34d'
    }
};
