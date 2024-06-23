import './Dashboard.css';
import SingleSelect from '../components/SingleSelect';
import PieChart from '../components/charts/PieChart';
import MultiSelect from '../components/MultiSelect';
import { Button, CircularProgress } from '@mui/material';
import { Suspense, useEffect, useRef, useState } from 'react';
import BarChart from '../components/charts/BarChart';
import { CONSTANTS } from '../utils/constants';
import { ChartData, Product, ProductRootObject, SelectMenuProps } from '../types';

interface Categories {
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
  const selectedProductsRef = useRef<string[]>([]);

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

  useEffect(() => {
    //Run Report button disable/enable
    const selectedProductsLen = selectedProducts.length;
    selectedProductsRef.current.length === selectedProductsLen || selectedProductsLen === 0
      ? setRunReportBtnDisabled(true)
      : setRunReportBtnDisabled(false);
  }, [selectedProducts]);

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
    selectedProductsRef.current = selectedProducts;
    setTimeout(() => {
      setChartData(generatedReport);
      setBarChartVisible(true);
      setRunReportBtnDisabled(true);
    }, 3000);
  };

  const clearInputs = (): void => {
    setCategoryNames([]);
    setProductNames([]);
    selectedProductsRef.current = [];
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
              <PieChart data={chartData} />
            ) : (
              <BarChart
                data={chartData}
                categories={selectedProducts}
                categoryName={selectedCategory}
              />
            )}
          </Suspense>
        </section>
      </div>
    </Suspense>
  );
}
