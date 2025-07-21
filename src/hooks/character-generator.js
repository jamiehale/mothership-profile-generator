import { useCallback, useMemo } from "react";
import { initializeTablescript } from "tablescript.js";
import { script } from "../tablescript/mothership-character-generator";
import useLocalStorage from "./local-storage";

export const useCharacterGenerator = () => {
  const [character, setCharacter] = useLocalStorage("character", null);

  const tablescript = useMemo(
    () =>
      initializeTablescript({
        fs: {},
        path: {},
        evaluateCallableResult: false,
        validateTables: true,
      }),
    []
  );

  const regenerate = useCallback(() => {
    const result = tablescript.runScript(script);
    setCharacter(result.asNativeObject());
  }, [setCharacter, tablescript]);

  return [character, regenerate];
};
