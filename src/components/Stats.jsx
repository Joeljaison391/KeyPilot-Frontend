import { motion } from 'framer-motion'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'
import { TrendingUp, Database, Zap, Users, Shield, Clock } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

const Stats = () => {
  // Performance Chart Data
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: [0.8, 0.7, 0.9, 0.6, 0.5, 0.4],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Throughput (req/s)',
        data: [12000, 15000, 18000, 22000, 25000, 28000],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  }

  // Usage Distribution
  const usageData = {
    labels: ['GPT Models', 'Image APIs', 'Database', 'Analytics', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Security Events
  const securityData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Blocked Attempts',
        data: [12, 8, 15, 6],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Valid Requests',
        data: [1250, 1420, 1380, 1560],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#d1d5db',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: { color: '#9ca3af' },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#d1d5db',
          padding: 20,
        },
      },
    },
  }

  const stats = [
    {
      icon: TrendingUp,
      title: "API Requests",
      value: "2.4M+",
      change: "+23%",
      color: "text-blue-400",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Avg Response",
      value: "0.4ms",
      change: "-15%",
      color: "text-yellow-400",
      bgColor: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Users,
      title: "Active Keys",
      value: "1,234",
      change: "+12%",
      color: "text-green-400",
      bgColor: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "Security Score",
      value: "99.9%",
      change: "+0.1%",
      color: "text-purple-400",
      bgColor: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden bg-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
      
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Real-Time Analytics
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor your API performance with comprehensive analytics powered by Redis.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.bgColor}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-sm font-semibold ${stat.color}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Performance Metrics</h3>
            </div>
            <div className="h-64">
              <Line data={performanceData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Usage Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center mb-6">
              <Database className="h-6 w-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">API Usage Distribution</h3>
            </div>
            <div className="h-64">
              <Doughnut data={usageData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Security Events */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Security Events</h3>
            </div>
            <div className="h-64">
              <Bar data={securityData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Real-time Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-8"
        >
          <div className="flex items-center text-green-400">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm">System Healthy</span>
          </div>
          <div className="flex items-center text-blue-400">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">Last updated: Just now</span>
          </div>
          <div className="flex items-center text-purple-400">
            <Database className="h-4 w-4 mr-2" />
            <span className="text-sm">Redis Connection: Active</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Stats
