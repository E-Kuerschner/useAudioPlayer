import React from "react";
import { AudioPlayerContext } from "./types";
export interface AudioPlayerProviderProps {
    children: React.ReactNode;
    value?: AudioPlayerContext;
}
export declare function AudioPlayerProvider({ children, value }: AudioPlayerProviderProps): JSX.Element;
