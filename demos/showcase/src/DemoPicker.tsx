import { Link } from "react-router-dom"

const NavigationLinks = () => {
    return (
        <div>
            <h1 className="text-xl mb-8">Choose a demo to view</h1>
            <nav>
                <ul className="flex flex-col gap-4 *:flex-shrink">
                    <li>
                        <Link to="/fullFeatures">Full Features</Link>
                    </li>
                    <li>
                        <Link to="/crossFader">Cross Fader</Link>
                    </li>
                    <li>
                        <Link to="/streaming">Streaming</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default NavigationLinks
