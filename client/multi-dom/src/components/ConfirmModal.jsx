export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <p className="text-sm text-gray-700 mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        Отказ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                        Потвърди
                    </button>
                </div>
            </div>
        </div>
    );
}
