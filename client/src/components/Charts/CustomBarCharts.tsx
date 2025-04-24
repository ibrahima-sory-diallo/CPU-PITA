import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

interface ChartData {
  name: string;
  recettes: number;
  depenses: number;
}

interface CustomBarChartsProps {
  data: ChartData[];
}

function CustomBarCharts({ data }: CustomBarChartsProps) {
  // Calcul des valeurs min et max avec marge
  const allValues = data.flatMap(item => [item.recettes, item.depenses]);
  const minValue = Math.floor(Math.min(...allValues) * 0.9);
  const maxValue = Math.ceil(Math.max(...allValues) * 1.1);

  return (
    <div className='h-[450px] w-full rounded-xl bg-white p-2 pb-50 dark:bg-slate-600 dark:text-slate-300 xl:flex'>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey='name' />
          <YAxis domain={[minValue, maxValue]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="recettes" fill='#14b8a6' name="Recettes" />
          <Bar dataKey="depenses" fill='#dc2626' name="Dépenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarCharts;
