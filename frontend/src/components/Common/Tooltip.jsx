const TooltipIcon = ({ children, text }) => (
  <div className="group relative flex flex-col items-center">
    {children}
    <div className="absolute bottom-full mb-2 hidden group-hover:flex">
      <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
        {text}
      </span>
    </div>
  </div>
);
export default TooltipIcon;