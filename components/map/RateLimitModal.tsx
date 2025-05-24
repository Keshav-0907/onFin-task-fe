import { RotateCw } from 'lucide-react'
import React from 'react'

const RateLimitModal = () => {
    return (
        <div
            className="fixed inset-0 bg-black/89 backdrop-blur-sm z-50 flex items-center justify-center"
            role="alertdialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center space-y-4">
                <h2 className="text-lg font-semibold text-red-600">Rate Limit Reached</h2>
                <p className="text-sm text-gray-600">
                    You&apos;re making requests too quickly. Please wait a few seconds and try again.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2  flex items-center justify-center gap-2 w-full"
                >
                    <div className='flex w-fit items-center gap-2 px-4 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition'>
                        <RotateCw size={14} />
                        Retry
                    </div>
                </button>
            </div>
        </div>
    )
}

export default RateLimitModal