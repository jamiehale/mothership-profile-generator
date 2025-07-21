import useLocalStorage from "../hooks/local-storage";

export const ResetStorage = () => {
  const [character, setCharacter] = useLocalStorage("character", null);

  const handleClick = () => {
    setCharacter(null);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      <p>
        Something went wrong. Here's the script result that couldn't be
        rendered:
      </p>
      <pre className="border-1 bg-gray-100 font-mono text-xs p-3">
        {JSON.stringify(character, null, 2)}
      </pre>
      <div className="flex justify-center">
        <button
          className="bg-gray-300 rounded-lg px-4 py-1"
          onClick={handleClick}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
