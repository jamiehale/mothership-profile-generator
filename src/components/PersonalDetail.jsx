export const PersonalDetail = ({ className, name, value = <>&nbsp;</> }) => (
  <>
    <p className="text-white text-sm font-extrabold">{name}</p>
    <div className={`${className} bg-white rounded-md p-2 print:border-1`}>
      <p>{value}</p>
    </div>
  </>
);
