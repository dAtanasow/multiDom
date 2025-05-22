import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.error("ErrorBoundary caught:", error);
        return { hasError: true };
    }

    handleReset = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center text-red-600">
                    <h2>⚠️ Възникна грешка при зареждане на страницата.</h2>
                    <p>Моля, опитайте отново по-късно.</p>
                    <button
                        onClick={this.handleReset}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Опитай отново
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
