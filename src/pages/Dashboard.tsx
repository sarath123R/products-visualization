import './Dashboard.css';
import SingleSelect from '../components/SingleSelect';
import Pie from '../components/charts/Pie';
import MultiSelect from '../components/MultiSelect';
import { Button, CircularProgress } from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import Bar from '../components/charts/Bar';
import { CONSTANTS } from '../utils/constants';
import { ChartData, Product, ProductRootObject, SelectMenuProps } from '../types';

export interface Categories {
  name: string;
  url: string;
  slug?: string;
}

export default function Dashboard() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [categoryNames, setCategoryNames] = useState<SelectMenuProps[]>([]);
  const [productNames, setProductNames] = useState<SelectMenuProps[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isBarChartVisible, setBarChartVisible] = useState<boolean>(false);
  const [multiSelectDisabled, setMultiSelectDisabled] = useState<boolean>(true);
  const [runReportBtnDisabled, setRunReportBtnDisabled] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    //get product categories
    const getCategories = async () => {
      await fetch(CONSTANTS.API_ENDPOINTS.PRODUCT_CATEGORY)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
          }
        })
        .then((data) => categoriesData(data));
    };
    categoryNames.length === 0 && getCategories();
  }, [categoryNames]);

  const categoriesData = (data: Categories[]): void => {
    const pie: ChartData[] = [];
    const categoryName: SelectMenuProps[] = [];

    data.forEach((element) => {
      var r = Math.floor(Math.random() * 100) + 1;
      pie.push({ name: element.name, y: r });
      categoryName.push({ label: element.name, value: element.url });
    });
    setChartData(pie);
    setCategoryNames(categoryName);
  };

  const onSelectChange = (url: string): void => {
    const categoryName = url.split('/');
    setSelectedCategory(categoryName[categoryName.length - 1]);

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response.statusText;
        }
      })
      .then((data: ProductRootObject) => productsData(data.products));
  };

  const onMultiSelectChange = (selectedProducts: string[]): void => {
    //Run report button disabling
    selectedProducts.length > 0 ? setRunReportBtnDisabled(false) : setRunReportBtnDisabled(true);
    setSelectedProducts(selectedProducts);
  };

  const productsData = (products: Product[]) => {
    const productName: SelectMenuProps[] = [];
    products.forEach((element) => {
      productName.push({ label: element.title, value: element.price });
    });
    setProductNames(productName);
    setMultiSelectDisabled(false);
  };

  const generateReport = () => {
    const generatedReport: ChartData[] = [];
    setChartData([]);
    productNames
      .filter((e) => selectedProducts.includes(e.label))
      .forEach((e) => {
        generatedReport.push({ name: e.label, y: Number(e.value) });
      });
    setTimeout(() => {
      setChartData(generatedReport);
      setBarChartVisible(true);
      setRunReportBtnDisabled(true);
    }, 3000);
  };

  const clearInputs = (): void => {
    setCategoryNames([]);
    setProductNames([]);
    setMultiSelectDisabled(true);
    setRunReportBtnDisabled(true);
    setBarChartVisible(false);
  };

  return (
    <Suspense fallback={<div>Loading..</div>}>
      <div className={'section-width'}>
        <aside className={'form-width'}>
          <div className='title'>
            <h4>Filters</h4>
            <Button className='clear-btn' disableRipple onClick={() => clearInputs()}>
              clear
            </Button>
          </div>
          <form>
            <SingleSelect data={categoryNames} handleChange={(e: string) => onSelectChange(e)} />
            <MultiSelect
              data={productNames}
              handleChange={(e: string[]) => onMultiSelectChange(e)}
              disabled={multiSelectDisabled}
            />
          </form>
          <Button
            variant='contained'
            className='run-report-btn'
            disableRipple
            onClick={() => generateReport()}
            disabled={runReportBtnDisabled}
          >
            Run report
          </Button>
        </aside>
        <section className={'chart-area'}>
          <Suspense fallback={<CircularProgress className='loader' />}>
            {chartData.length === 0 ? (
              <CircularProgress className='loader' />
            ) : !isBarChartVisible ? (
              <Pie data={chartData} />
            ) : (
              <Bar data={chartData} categories={selectedProducts} categoryName={selectedCategory} />
            )}
          </Suspense>
        </section>
      </div>
    </Suspense>
  );
}
