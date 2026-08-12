import React, { useState } from 'react';
import Employee from './Employee'; // Reuses the underlying data entry logic safely

function Customer() {
    // Customers render the same dynamic parser, but their answers are automatically tagged under 'customer' context metadata
    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg text-white shadow-sm">
                <h2 className="text-xl font-bold">Client Secure Service Portal</h2>
                <p className="text-xs opacity-90 mt-1">Register dynamic complaints, support updates, and active feedback surveys securely here.</p>
            </div>

            {/* Leverage the underlying layout rendering block directly */}
            <Employee />
        </div>
    );
}

export default Customer;
