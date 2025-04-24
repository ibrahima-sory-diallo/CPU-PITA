import CustomBarCharts from '../components/Charts/CustomBarCharts'
import CustomPieCharts from '../components/Charts/CustomPieCharts'
// import Activity from '../components/Activity/Activity'
import ChapitresParSection from '../components/Operations/GroupeSection'
import { useInputationsParMoisParSection } from '../components/Operations/OperationGraphique';

function Dashboard() {
  const { operations, loading } = useInputationsParMoisParSection();

  if (loading) return <div>Chargement des données...</div>;

  return (
    <div>
      <ChapitresParSection />
      <div className="translate-all flex flex-col gap-4 p-4 duration-300 sm:py-1 xl:flex-row">
        {/* Passer les données formatées au graphique */}
        <CustomBarCharts  data={operations.map(op => ({ name: op.mois, recettes: op.recettes, depenses: op.depenses }))}  />
        <CustomPieCharts />
      </div>
      <div className="translate-all flex flex-col gap-4 p-4 duration-300 sm:py-1 xl:flex-row">
      </div>
    </div>
  );
}

export default Dashboard;
