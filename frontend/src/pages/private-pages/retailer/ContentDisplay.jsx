import React from 'react'
import DashboardOverview from './DashboardOverview';

// Sidebar
// Masters
import Batches from "./sidebar-pages/masters/Batches"
import AccGroups from "./sidebar-pages/masters/AccGroups"
import Accounts from "./sidebar-pages/masters/Accounts"
import AccSubGroups from "./sidebar-pages/masters/AccSubGroups"

// Reports
import Companies from "./sidebar-pages/masters/Companies"
import Composition from "./sidebar-pages/masters/Composition"
import CustomersSupplier from "./sidebar-pages/masters/CustomersSupplier"
import Products from "./sidebar-pages/masters/Products"
import RackNo from "./sidebar-pages/masters/RackNo"
import StockValue from "./sidebar-pages/masters/StockValue"
import Sales from './sidebar-pages/reports/Sales';
import Purchases from './sidebar-pages/reports/Purchases';
import Receipts from './sidebar-pages/reports/Receipts';
import Payments from './sidebar-pages/reports/Payments';
import Vouchers from './sidebar-pages/reports/Vouchers';
import CreditPurchases from './sidebar-pages/reports/CreditPurchases';
import CreditSales from './sidebar-pages/reports/CreditSales';
import EInvoice_EWayBill from './sidebar-pages/reports/EInvoice_EWayBill';
import OrderForSupplier from './sidebar-pages/reports/OrderForSupplier';

// Security
import PasswordChange from './sidebar-pages/security/PasswordChange';
import WhoAmI from './sidebar-pages/security/WhoAmI';
import ControlSettings from './sidebar-pages/security/ControlSettings';
import AddNewUser from './sidebar-pages/security/AddNewUser';

// Automation
import GlobalItemsSearch from './sidebar-pages/automation/GlobalItemsSearch';
import SuppliersStock from './sidebar-pages/automation/SuppliersStock';
import InvoiceExports from './sidebar-pages/automation/InvoiceExports';
import ProfitOrders from './sidebar-pages/automation/ProfitOrders';
import MyBusinessGraph from './sidebar-pages/automation/MyBusinessGraph';
import PostCard from './sidebar-pages/automation/PostCard';
import Restart_CloseWeblink from './sidebar-pages/automation/Restart_CloseWeblink';
import ChromeDriverDownload from './sidebar-pages/automation/ChromeDriverDownload';

// Help
import Text_Chat from './sidebar-pages/help/Text_Chat';
import CustomerCare from './sidebar-pages/help/CustomerCare';

// NavBar
// New Order
import ByProduct from './nav-pages/new-order/ByProduct';
import ByDistributor from './nav-pages/new-order/ByDistributor';
import BulkOrder from './nav-pages/new-order/BulkOrder';
import DraftOrders from './nav-pages/new-order/DraftOrders';
import Mapping from './nav-pages/new-order/Mapping';

// Previous Orders
import ByDate from './nav-pages/previous-orders/ByDate';
import ByDistributorPrevious from './nav-pages/previous-orders/ByDistributorPrevious';
import ByProductPrevious from './nav-pages/previous-orders/ByProductPrevious';
import SchemeItems from './nav-pages/previous-orders/SchemeItems';
import ShortSupply from './nav-pages/previous-orders/ShortSupply';

// Distributors
import ConnectedDistributors from './nav-pages/distributors/ConnectedDistributors';
import AllDistributors from './nav-pages/distributors/AllDistributors';
import ReferDistributors from './nav-pages/distributors/ReferDistributors';

// Shortage Book
import ShortageBook from './nav-pages/shortage-book/ShortageBook';
import MySBProducts from './nav-pages/shortage-book/MySBProducts';

function ContentDisplay({ content }) {
    const contentComponents = {
  'Dashboard Overview': DashboardOverview,

  // Masters
  'Batches': Batches,
  'Acc Groups' : AccGroups,
  'Accounts' : Accounts,
  'Acc sub groups' : AccSubGroups,
  'Companies' : Companies,
  'Composition' : Composition,
  'Customers/Supplier' : CustomersSupplier,
  'Products' : Products,
  'Rack No.' : RackNo,
  'Stock Value' : StockValue,

  // Reports
  'Sales' : Sales,
  'Purchases' : Purchases,
  'Receipts' : Receipts,
  'Payments' : Payments,
  'Vouchers' : Vouchers,
  'Credit Purchases' : CreditPurchases,
  'Credit Sales' : CreditSales,
  'EInvoice/E Way Bill' : EInvoice_EWayBill,
  'Order for Supplier' : OrderForSupplier,
  
  // Security
  'Password Change' : PasswordChange,
  'Who Am I' : WhoAmI,
  'Control Settings' : ControlSettings,
  'Add New User' : AddNewUser,
  
  // Automation
  'Global items Search' : GlobalItemsSearch,
  'Suppliers Stock' : SuppliersStock,
  'Invoice Exports' : InvoiceExports,
  'Profit Orders' : ProfitOrders,
  'My Business graph' : MyBusinessGraph,
  'Post Card' : PostCard,
  'Restart/Close Weblink' : Restart_CloseWeblink,
  'Chrome Driver Download' : ChromeDriverDownload,
  
  // Help
  'Text/Chat' : Text_Chat,
  'Customer care' : CustomerCare,
  
  // NavBar
  // New Order
  'By Product' : ByProduct,
  'By Distributor' : ByDistributor,
  'Bulk Order' : BulkOrder,
  'Draft Orders' : DraftOrders,
  'Mapping' : Mapping,
  
  // Previous Orders
  'By Date' : ByDate,
  'By Distributor' : ByDistributorPrevious,
  'By product' : ByProductPrevious,
  'Scheme items' : SchemeItems,
  'Short Supply' : ShortSupply,
  
  // Distributors
  'Connected Distributors' : ConnectedDistributors,
  'All Distributors' : AllDistributors,
  'Refer Distributors' : ReferDistributors,
  
  // Shortage Books
  'Shortage Book' : ShortageBook,
  'My SB Products' : MySBProducts,
  

  
  
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