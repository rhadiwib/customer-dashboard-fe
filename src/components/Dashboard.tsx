import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import api, { Manager, ManagerDetails, CustomerStats, RegionHierarchy } from '../services/api';
import { ChartSkeleton, SelectSkeleton } from './shared/ChartSkeleton';
import { withErrorBoundary } from './shared/ErrorBoundary';
import { useDataCache } from '../hooks/useDataCache';

const SafeChart = withErrorBoundary(Chart);

function Dashboard() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<number | null>(null);
  const [managerDetails, setManagerDetails] = useState<ManagerDetails | null>(null);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regionHierarchy, setRegionHierarchy] = useState<RegionHierarchy | null>(null);

  const { getCachedData, setCachedData } = useDataCache<any>({
    expirationTime: 5 * 60 * 1000
  });

  useEffect(() => {
    fetchManagers();
  }, []);

  useEffect(() => {
    if (selectedManager) {
      fetchManagerData(selectedManager);
    } else { // Handle unselected manager
      setManagerDetails(null);
      setCustomerStats(null);
      setRegionHierarchy(null);
    }
  }, [selectedManager]);

  const fetchManagers = async () => {
    try {
      const cachedManagers = getCachedData('managers');
      if (cachedManagers) {
        setManagers(cachedManagers);
        return;
      }

      setLoading(true);
      const response = await api.getAllManagers();
      setManagers(response.data);
      setCachedData('managers', response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch managers');
      console.error('Error fetching managers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagerData = async (managerId: number) => {
    try {
      const cacheKey = `manager-${managerId}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setManagerDetails(cachedData.details);
        setCustomerStats(cachedData.stats);
        setRegionHierarchy(cachedData.hierarchy);
        return;
      }

      setLoading(true);
      const [detailsResponse, statsResponse, hierarchyResponse] = await Promise.all([
        api.getManagerDetails(managerId),
        api.getManagerStats(managerId),
        api.getManagerHierarchy(managerId)
      ]);

      setManagerDetails(detailsResponse.data);
      setCustomerStats(statsResponse.data);
      setRegionHierarchy(hierarchyResponse.data);
      
      setCachedData(cacheKey, {
        details: detailsResponse.data,
        stats: statsResponse.data,
        hierarchy: hierarchyResponse.data,
      });

      setError(null);
    } catch (err) {
      setError('Failed to fetch manager data');
      console.error('Error fetching manager data:', err);
    } finally {
      setLoading(false);
    }
  };

  // chart data preparation
  const getRegionOverviewData = () => {
    if (!managerDetails) {
      return [
        ['Metric', 'Value'],
        ['Total Customers', 0],
        ['Cities Covered', 0]
      ];
    }

    return [
      ['Metric', 'Value'],
      ['Total Customers', managerDetails.numberOfCustomers || 0],
      ['Cities Covered', managerDetails.numberOfCities || 0]
    ];
  };

  const getCustomerDistributionData = () => {
    if (!customerStats || !customerStats.byRegionLevel) {
      return [
        ['Region Level', 'Customers'],
        ['City', 0],
        ['Province', 0],
        ['Country', 0]
      ];
    }

    const { byRegionLevel } = customerStats;
    return [
      ['Region Level', 'Customers'],
      ['City', byRegionLevel.CITY || 0],
      ['Province', byRegionLevel.PROVINCE || 0],
      ['Country', byRegionLevel.COUNTRY || 0]
    ];
  };

  const getTreeMapData = () => {
    if (!regionHierarchy) {
      return [
        ["Location", "Parent", "Count"],
        ["Indonesia", null, 0],
        ["East Java", "Indonesia", 0],
        ["Surabaya", "East Java", 0]
      ];
    }

    const { hierarchy } = regionHierarchy;
    return [
      ["Location", "Parent", "Count"],
      [hierarchy.country, null, 0], // Use hierarchy data
      [hierarchy.province, hierarchy.country, 0], // Use hierarchy data
      [hierarchy.city, hierarchy.province, managerDetails?.numberOfCities || 0], // Use hierarchy and numberOfCities
    ];
  };

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mb-8">
        {loading && !managers.length ? (
          <SelectSkeleton />
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Manager
            </label>
            <select
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setSelectedManager(Number(e.target.value))}
              value={selectedManager || ''}
              disabled={loading}
            >
              <option value="">Select a manager...</option>
              {managers.map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} - {manager.regionName} ({manager.regionType}) {/* Safe access */}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {loading || !selectedManager ? ( // Show skeletons while loading or no manager selected
        <>
          <ChartSkeleton />
          <ChartSkeleton />
        </>
      ) : (
        <>
            {/* Region Overview Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Region Overview</h2>
              <SafeChart
                chartType="BarChart"
                width="100%"
                height="300px"
                data={getRegionOverviewData()}
                options={{
                  title: `Overview for ${managerDetails?.regionName || 'Selected Region'}`, // Safe access here
                  bars: 'horizontal',
                  colors: ['#4f46e5'],
                  legend: { position: 'none' }
                }}
              />
            </div>

            {/* Customer Distribution Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Distribution</h2>
              <SafeChart
                chartType="PieChart"
                width="100%"
                height="300px"
                data={getCustomerDistributionData()}
                options={{
                  title: 'Customers by Region Level',
                  colors: ['#4f46e5', '#818cf8', '#c7d2fe'],
                  pieHole: 0.4,
                  animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out',
                  },
                  legend: { position: 'right' },
                  pieSliceText: 'percentage',
                  tooltip: { showColorCode: true },
                  chartArea: {
                    width: '80%',
                    height: '80%'
                  }
                }}
              />
            </div>

            {/* TreeMap Chart
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Region Hierarchy</h2>
              <SafeChart
                chartType="TreeMap"
                width="100%"
                height="300px"
                data={getTreeMapData()}
                options={{
                  title: "Region Hierarchy",
                }}
              />
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}

const DashboardWithErrorBoundary = withErrorBoundary(Dashboard);
export default DashboardWithErrorBoundary;