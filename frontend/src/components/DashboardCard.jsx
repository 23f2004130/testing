function DashboardCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}

export default DashboardCard;