export const StatusDetail = ({
  name,
  currentValue,
  limitValue,
  limitTitle = "Maximum",
}) => (
  <div className="flex flex-col items-center mx-3">
    <p className="text-black text-xs font-bold uppercase">{name}</p>
    <div className="flex bg-white rounded-2xl p-2 border-3 w-24 justify-center">
      <p className="text-black font-bold px-2">{currentValue}</p>
      <p className="text-black font-bold px-1">/</p>
      <p className="text-black font-bold px-2">{limitValue}</p>
    </div>
    <div className="flex gap-x-2">
      <p className="text-black text-xs">Current</p>
      <p className="text-black text-xs">{limitTitle}</p>
    </div>
  </div>
);
