import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        console.error("ErrorBoundary caught:", error);
        return { hasError: true, error };
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center bg-red-50 text-red-700 px-4 py-8 rounded-xl shadow-inner">
                    <AlertTriangle size={48} className="mb-4" />
                    <h2 className="text-xl font-semibold mb-2">
                        Упс! Нещо се обърка.
                    </h2>
                    <p className="max-w-md text-sm text-center mb-4">
                        Възникна неочаквана грешка при зареждане на компонент. Може да опитате да презаредите секцията.
                    </p>

                    <button
                        onClick={this.handleReset}
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                    >
                        Опитай отново
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
