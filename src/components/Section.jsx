export const Section = ({
  children,
  title,
  bgColor = "bg-black",
  textColor = "text-white",
  border = "",
  grow = false,
}) => (
  <div
    className={`${bgColor} rounded-2xl ${border} p-3 flex flex-col ${
      grow ? "grow" : ""
    } gap-y-2 print:bg-white print:border-2`}
  >
    <div className="flex justify-center">
      <p
        className={`${textColor} text-lg print:text-sm font-extrabold uppercase`}
      >
        {title}
      </p>
    </div>
    {children}
  </div>
);
