import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { ChartData } from '../../types';
import { CONSTANTS } from '../../utils/constants';

interface BarChartProps {
  data: ChartData[];
  categories: string[];
  categoryName: string;
}

export default function BarChart({ data, categories, categoryName }: BarChartProps) {
  const options: Highcharts.Options = {
    title: {
      text: CONSTANTS.PRODUCTS_SELECTED_CATEGORY,
      align: 'left',
    },
    chart: {
      type: 'column',
    },
    yAxis: {
      title: {
        text: categoryName,
        align: 'middle',
      },
      labels: {
        overflow: 'justify',
      },
      gridLineWidth: 0,
    },
    xAxis: {
      categories,
      title: {
        text: 'Products',
      },
    },
    plotOptions: {
      bar: {
        borderRadius: '50%',
        groupPadding: 0.1,
      },
    },
    series: [
      {
        type: 'column',
        showInLegend: false,
        data,
        dataLabels: {
          enabled: true,
          format: '{y}$',
        },
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
