import { BrowserRouter, Route, Routes } from "react-router-dom"
import { FullFeaturesDemo } from "./FullFeaturesDemo.tsx"
import { CrossFaderDemo } from "./CrossFaderDemo.tsx"
import { StreamingDemo } from "./StreamingDemo.tsx"
import { DeclarativeDemo } from "./DeclarativeDemo.tsx"
import { DebuggingRoute } from "./DebuggingRoute.tsx"
import DemoPicker from "./DemoPicker.tsx"

function App() {
    return (
        <div className="p-8 size-full bg-gradient-to-br start-blue-500 from-gray-100 to-blue-100">
            <BrowserRouter>
                <Routes>
                    <Route index path="/" element={<DemoPicker />} />
                    <Route path="crossFader" element={<CrossFaderDemo />} />
                    <Route path="streaming" element={<StreamingDemo />} />
                    <Route path="fullFeatures" element={<FullFeaturesDemo />} />
                    <Route path="declarative" element={<DeclarativeDemo />} />
                    <Route path="debugging" element={<DebuggingRoute />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
