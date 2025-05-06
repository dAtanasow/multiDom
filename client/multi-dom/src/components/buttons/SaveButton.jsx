export default function SaveButton({ pending, onCancel }) {
    return (
        <div className="flex justify-center gap-4 mt-6">
            <button
                type="submit"
                disabled={pending}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
                {pending ? "Запазване..." : "Запази"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
            >
                Отказ
            </button>
        </div>
    );
}
