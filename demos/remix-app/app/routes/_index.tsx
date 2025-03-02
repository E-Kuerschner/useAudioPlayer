import type { MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" }
    ]
}

export default function Index() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-16">
                <header className="flex flex-col items-center gap-9">
                    <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Welcome to <span className="sr-only">Remix</span>
                    </h1>
                    <div className="h-[144px] w-[434px]">
                        <img
                            src="/logo-light.png"
                            alt="Remix"
                            className="block w-full dark:hidden"
                        />
                        <img
                            src="/logo-dark.png"
                            alt="Remix"
                            className="hidden w-full dark:block"
                        />
                    </div>
                </header>
                <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
                    <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
                        This example of react-use-audio-player uses the Remix
                        framework to demonstrate how to use the library in a
                        server-side rendered application. <br />
                        Click the link below to start the demo!
                    </p>
                    <Link
                        className="border-2 border-blue-700 p-4 rounded-lg hover:bg-blue-200"
                        to="demo"
                    >
                        Go to demo
                    </Link>
                </nav>
            </div>
        </div>
    )
}
