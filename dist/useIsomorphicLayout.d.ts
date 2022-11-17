import { useLayoutEffect } from "react";
/**
 * Abstraction for useLayoutEffect.
 *
 * It will use useLayoutEffect() on the client, but while rendering on the server it will use
 * useEffect() to avoid ssr servers warnings like "useLayoutEffect does nothing on the server".
 */
declare const useIsomorphicLayoutEffect: typeof useLayoutEffect;
export default useIsomorphicLayoutEffect;
