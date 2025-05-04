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

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center text-red-600">
                    <h2>⚠️ Възникна грешка при зареждане на страницата.</h2>
                    <p>Моля, опитайте отново по-късно.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
