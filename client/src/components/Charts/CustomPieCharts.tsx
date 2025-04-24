
import { Pie, PieChart, ResponsiveContainer } from 'recharts'
import { ChartData01, ChartData02 } from '../../Constants/Index'

function CustomPieCharts() {
  return (
    <div className='h-96 rounded-xl bg-white p-2 dark:bg-slate-600 dark:text-slate-300 sm:h-[450px] xl:w-[450px]'>
        <h1>Sales by Category</h1>
        <ResponsiveContainer>
            <PieChart>
                <Pie 
                data={ChartData01}
                dataKey='value'
                cx='50%'
                cy='50%'
                outerRadius={60}
                fill='#8884d8'
                nameKey='name'
                label
                />
                <Pie 
                data={ChartData02}
                dataKey='value'
                cx='50%'
                cy='50%'
                innerRadius={70}
                outerRadius={90}
                fill='#82ca9d'
                nameKey='name'
                label
                />
            </PieChart>
        </ResponsiveContainer>
    </div>
  )
}

export default CustomPieCharts