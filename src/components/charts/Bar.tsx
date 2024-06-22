import * as React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { ChartData } from '../../types';

export interface BarChartProps {
  data: ChartData[];
  categories: string[];
  categoryName: string;
}

export default function Bar({ data, categories, categoryName }: BarChartProps) {
  const options: Highcharts.Options = {
    title: {
      text: 'Products in selected Category',
      align: 'left',
    },
    chart: {
      type: 'column',
      width: 1200,
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
