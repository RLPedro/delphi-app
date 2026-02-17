import Link from "next/link";

export default function BackNav() {
    return (
        <div className="back-nav">
            <Link href="/" className="back-link">
                <span className="back-arrow">←</span>
                Back to Dashboard
            </Link>
        </div>
    );
}
