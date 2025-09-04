import GoodsReceiptView from '@/views/GoodsReceiptView.vue';
import GoodsReturnView from '@/views/GoodsReturnView.vue';
import HomeView from '@/views/HomeView.vue';
import ProductBatchView from '@/views/ProductBatchView.vue';
import ProductInformationView from '@/views/ProductInformationView.vue';
import StaffView from '@/views/StaffView.vue';
import SupplierView from '@/views/SupplierView.vue';
import {
    Box,
    House,
    OfficeBuilding,
    Postcard,
    SoldOut,
    TakeawayBox,
    User,
} from '@element-plus/icons-vue';

const pages = [
    {
        path: '/',
        name: 'Home',
        icon: House,
        component: HomeView,
    },
    {
        path: '/staff',
        name: 'Staff',
        icon: User,
        component: StaffView,
    },
    {
        path: '/product',
        redirect: '/product/product-information',
        name: 'Product',
        icon: Box,
        children: [
            {
                path: '/product/product-information',
                name: 'Product information',
                icon: Postcard,
                component: ProductInformationView,
            },
            {
                path: '/product/product-batch',
                name: 'Product batch',
                icon: TakeawayBox,
                component: ProductBatchView,
            },
        ],
    },
    {
        path: '/supplier',
        name: 'Supplier',
        icon: OfficeBuilding,
        component: SupplierView,
    },
    {
        path: '/goods-receipt',
        name: 'Goods receipt',
        icon: SoldOut,
        component: GoodsReceiptView,
    },
    {
        path: '/goods-return',
        name: 'Goods return',
        icon: SoldOut,
        component: GoodsReturnView,
    },
];

export default pages;
