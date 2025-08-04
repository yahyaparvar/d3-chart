import data from "./services/data.json";
import { Chart, type ChartPoint } from "./components/chart";
function App() {
  return (
    <div
      style={{
        padding: "2rem",
        color: "white",
      }}
    >
      {data.map((chart, idx) => (
        <Chart
          key={idx}
          title={chart.title}
          data={chart.data as ChartPoint[]}
        />
      ))}
    </div>
  );
}

export default App;
