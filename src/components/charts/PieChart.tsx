import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { ChartData } from '../../types';
import { CONSTANTS } from '../../utils/constants';

export interface PieChartProps {
  data: ChartData[];
}
export default function PieChart({ data }: PieChartProps) {
  const options: Highcharts.Options = {
    title: {
      text: CONSTANTS.ALL_CATEGORIES,
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
