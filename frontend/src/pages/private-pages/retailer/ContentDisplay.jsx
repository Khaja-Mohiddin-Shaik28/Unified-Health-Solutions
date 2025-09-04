import React from 'react'
import DashboardOverview from './DashboardOverview';

// Sidebar

// Transactions
import RetailSalesBill from './sidebar-pages/transactions/RetailSalesBill';
import PurchasesBill from './sidebar-pages/transactions/PurchasesBill';

// Inventory
import StockInward from './sidebar-pages/inventory/StockInward';
import StockOutward from './sidebar-pages/inventory/StockOutward';

// Orders
import Received from './sidebar-pages/orders/Received';
import Completed from './sidebar-pages/orders/Completed';
import OrdersByDate from './sidebar-pages/orders/OrdersByDate';
import OrdersByCompany from './sidebar-pages/orders/OrdersByCompany';

// Company/Party
import AddNew from './sidebar-pages/company/AddNew';
import Search from './sidebar-pages/company/Search';

// Security
import PasswordChange from './sidebar-pages/security/PasswordChange';

// Backup
import RegularBackup from './sidebar-pages/backup/RegularBackup';

// Help
import TollFreeNo from './sidebar-pages/help/TollFreeNo';



function ContentDisplay({ content }) {
    const contentComponents = {
  'Dashboard Overview': DashboardOverview,

  // Transactions
  'Retail Sales Bill' : RetailSalesBill,
  'Purchases Bill' : PurchasesBill,
  
  // Inventory
  'Stock Inward' : StockInward,
  'Stock Outward' : StockOutward,
  
  // Orders
  'Received' : Received,
  'Completed' : Completed,
  'Orders by Date': OrdersByDate,
    'Orders by Company': OrdersByCompany,
  
  // Company/Party
  'Add new' : AddNew,
  'Search' : Search,

  // Security
  'Password Change' : PasswordChange,
  
  // Backup
  'Regular Backup' : RegularBackup,
  
  // Help
  'Toll Free no' : TollFreeNo,

 
  

  
  
};
  const ComponentToRender = contentComponents[content.component];
  return (
    <div>
      {ComponentToRender ? (
        <ComponentToRender />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800">{content.title}</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{content.body}</p>
        </>
      )}
    </div>
  );
}

export default ContentDisplay