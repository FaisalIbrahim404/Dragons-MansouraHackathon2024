import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import Router from './Router';
import './styles/index.css';



const customTheme = {
  token: {
    colorPrimary: '#F9CD6A',
    colorPrimaryHover: '#EAB95C',
    colorPrimaryActive: '#D8A84F',

    colorSecondary: '#4840A3',
    colorSecondaryHover: '#3C3492',
    colorSecondaryActive: '#302981',

    colorInfo: '#9CBBFC',
    colorInfoHover: '#87ABF0',
    colorInfoActive: '#759AE5',

    colorSuccess: '#D8EFF7',
    colorSuccessHover: '#C3E4F0',
    colorSuccessActive: '#A8D6E8',

    colorTextBase: '#4840A3',
    colorTextSecondary: '#9CBBFC',

    colorBgBase: '#FFFFFF',
    colorBgContainer: '#D8EFF7',
    colorBgHover: '#F1F6F9',
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={customTheme}>
      <Router />
    </ConfigProvider>
  </StrictMode>,
);
