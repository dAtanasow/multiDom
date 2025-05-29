export default function DotsLoader() {
    return (
        <div className="flex items-center justify-center h-32 space-x-3">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className={`w-4 h-4 bg-blue-500 rounded-full animate-bounce`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                ></span>
            ))}
        </div>
    );
}
