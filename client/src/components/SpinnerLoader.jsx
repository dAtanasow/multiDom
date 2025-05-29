export default function SpinnerLoader() {
    return (
        <div className="flex items-center justify-center h-40">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin shadow-lg" />
                <div className="absolute inset-1.5 rounded-full bg-white"></div>
            </div>
        </div>
    );
}
