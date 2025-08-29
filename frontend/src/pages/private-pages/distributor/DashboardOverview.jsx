import React from 'react'

function DashboardOverview() {
  return (
     <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
    <p className="text-gray-600">This component shows a summary of your key metrics. You can add charts, recent activity, and other widgets here.</p>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-blue-800">2,500</h3>
        <p className="text-blue-600">Total Transactions</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-green-800">$12,000</h3>
        <p className="text-green-600">Total Revenue</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-yellow-800">95%</h3>
        <p className="text-yellow-600">Satisfaction Rate</p>
      </div>
    </div>
  </div>
  )
}

export default DashboardOverview