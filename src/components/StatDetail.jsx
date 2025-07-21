export const StatDetail = ({ name, value }) => (
  <div className="flex flex-col items-center mx-3 w-14">
    <div className="flex justify-center items-center bg-white rounded-full w-12 h-12 border-3">
      <p className="text-black font-bold">{value}</p>
    </div>
    <p className="text-black text-sm font-extrabold uppercase">{name}</p>
  </div>
);
