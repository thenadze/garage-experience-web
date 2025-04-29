
import { useState } from "react";

export function useDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const updateDebugInfo = (info: any) => {
    setDebugInfo(info);
  };

  const clearDebugInfo = () => {
    setDebugInfo(null);
  };

  return {
    debugInfo,
    showDebugInfo,
    toggleDebugInfo,
    updateDebugInfo,
    clearDebugInfo
  };
}
