import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Mock data structure - This would typically come from your backend API
const MOCK_DATA = {
  daily: {
    completionRate: [
      { name: 'Mon', completed: 8, total: 10 },
      { name: 'Tue', completed: 7, total: 10 },
      { name: 'Wed', completed: 9, total: 10 },
      { name: 'Thu', completed: 6, total: 10 },
      { name: 'Fri', completed: 8, total: 10 },
      { name: 'Sat', completed: 5, total: 10 },
      { name: 'Sun', completed: 7, total: 10 },
    ],
    categoryDistribution: [
      { name: 'Health', value: 30 },
      { name: 'Learning', value: 25 },
      { name: 'Mindfulness', value: 20 },
      { name: 'Personal', value: 15 },
      { name: 'Work', value: 10 },
    ],
    productivityTrend: [
      { name: 'Morning', value: 85 },
      { name: 'Afternoon', value: 65 },
      { name: 'Evening', value: 45 },
      { name: 'Night', value: 30 },
    ],
    streakData: [
      { name: 'Current', value: 7 },
      { name: 'Best', value: 15 },
      { name: 'Average', value: 5 },
    ],
  },
  weekly: {
    completionRate: [
      { name: 'Week 1', completed: 45, total: 50 },
      { name: 'Week 2', completed: 48, total: 50 },
      { name: 'Week 3', completed: 42, total: 50 },
      { name: 'Week 4', completed: 47, total: 50 },
    ],
    categoryDistribution: [
      { name: 'Health', value: 35 },
      { name: 'Learning', value: 30 },
      { name: 'Mindfulness', value: 15 },
      { name: 'Personal', value: 10 },
      { name: 'Work', value: 10 },
    ],
    productivityTrend: [
      { name: 'Week 1', value: 75 },
      { name: 'Week 2', value: 82 },
      { name: 'Week 3', value: 68 },
      { name: 'Week 4', value: 79 },
    ],
    streakData: [
      { name: 'Current', value: 5 },
      { name: 'Best', value: 12 },
      { name: 'Average', value: 4 },
    ],
  },
  monthly: {
    completionRate: [
      { name: 'Jan', completed: 180, total: 200 },
      { name: 'Feb', completed: 175, total: 200 },
      { name: 'Mar', completed: 190, total: 200 },
      { name: 'Apr', completed: 185, total: 200 },
    ],
    categoryDistribution: [
      { name: 'Health', value: 40 },
      { name: 'Learning', value: 25 },
      { name: 'Mindfulness', value: 15 },
      { name: 'Personal', value: 10 },
      { name: 'Work', value: 10 },
    ],
    productivityTrend: [
      { name: 'Jan', value: 70 },
      { name: 'Feb', value: 75 },
      { name: 'Mar', value: 80 },
      { name: 'Apr', value: 85 },
    ],
    streakData: [
      { name: 'Current', value: 30 },
      { name: 'Best', value: 45 },
      { name: 'Average', value: 25 },
    ],
  },
}

// Chart color palette
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Chart Components
const CompletionRateChart = ({ data }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Completion Rate</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill="#3B82F6" name="Completed" />
          <Bar dataKey="total" fill="#E5E7EB" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const CategoryDistributionChart = ({ data }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const ProductivityTrendChart = ({ data }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Productivity Trend</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const StreakAnalysisChart = ({ data }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Streak Analysis</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)

// Summary Cards Component
const SummaryCards = ({ data }) => {
  const totalTasks = data.completionRate.reduce((acc, curr) => acc + curr.total, 0)
  const completedTasks = data.completionRate.reduce((acc, curr) => acc + curr.completed, 0)
  const completionRate = Math.round((completedTasks / totalTasks) * 100)
  const currentStreak = data.streakData[0].value
  const bestStreak = data.streakData[1].value

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm text-blue-600">Total Tasks</h3>
        <p className="text-2xl font-bold text-blue-800">{totalTasks}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm text-green-600">Completion Rate</h3>
        <p className="text-2xl font-bold text-green-800">{completionRate}%</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm text-purple-600">Current Streak</h3>
        <p className="text-2xl font-bold text-purple-800">{currentStreak} days</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-sm text-yellow-600">Best Streak</h3>
        <p className="text-2xl font-bold text-yellow-800">{bestStreak} days</p>
      </div>
    </div>
  )
}

// Main Analytics Component
const Analytics = () => {
  const [activeTab, setActiveTab] = useState('daily')

  // PDF Export Handler
  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('analytics-content')
      
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '0'
      tempContainer.style.top = '0'
      tempContainer.style.width = '100%'
      tempContainer.style.backgroundColor = 'white'
      document.body.appendChild(tempContainer)
      
      // Clone content to avoid affecting original
      const clone = element.cloneNode(true)
      tempContainer.appendChild(clone)
      
      // Wait for images to load
      const images = clone.getElementsByTagName('img')
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
      })
      
      await Promise.all(imagePromises)
      
      // Generate canvas from content
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        foreignObjectRendering: true
      })
      
      // Clean up temporary container
      document.body.removeChild(tempContainer)
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('analytics-report.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <div className="min-h-[92vh] bg-zinc-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Export PDF</span>
            </button>
          </div>

          {/* Analytics Content */}
          <div id="analytics-content">
            {/* Time Period Tabs */}
            <div className="flex space-x-4 mb-6">
              {['daily', 'weekly', 'monthly'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CompletionRateChart data={MOCK_DATA[activeTab].completionRate} />
              <CategoryDistributionChart data={MOCK_DATA[activeTab].categoryDistribution} />
              <ProductivityTrendChart data={MOCK_DATA[activeTab].productivityTrend} />
              <StreakAnalysisChart data={MOCK_DATA[activeTab].streakData} />
            </div>

            {/* Summary Cards */}
            <SummaryCards data={MOCK_DATA[activeTab]} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics 