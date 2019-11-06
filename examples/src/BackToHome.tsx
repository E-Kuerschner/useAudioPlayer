import React, { FunctionComponent } from "react"
import { Link } from "react-router-dom"

export const BackToHome: FunctionComponent<{}> = () => {
    return <Link to="/">{"< -"} Example Select</Link>
}
