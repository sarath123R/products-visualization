import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { ChartData } from '../../types';

export interface PieChartProps {
  data: ChartData[];
}
export default function Pie({ data }: PieChartProps) {
  const options: Highcharts.Options = {
    title: {
      text: 'All Categories',
      align: 'left',
    },
    chart: {
      type: 'pie',
      width: '1000',
    },
    series: [
      {
        type: 'pie',
        showInLegend: false,
        data,
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
