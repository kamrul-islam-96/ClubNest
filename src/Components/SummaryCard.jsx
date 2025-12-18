export const SummaryCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col text-center">
      <span className="text-gray-500 text-sm">{title}</span>
      <span className="text-3xl font-bold mt-2">{value}</span>
    </div>
  );
};
