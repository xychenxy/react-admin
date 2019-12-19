const menuList = [
    {
        title: 'Home',
        key: '/home',
        icon: 'home',
        isPublic: true,
    },
    {
        title: 'Products',
        key: '/products',
        icon: 'appstore',
        children: [ // 子菜单列表
            {
                title: 'Category',
                key: '/category',
                icon: 'bars'
            },
            {
                title: 'Management',
                key: '/product',
                icon: 'tool'
            },
        ]
    },

    {
        title: 'Users Management',
        key: '/user',
        icon: 'user'
    },
    {
        title: 'Roles Management',
        key: '/role',
        icon: 'safety',
    },

    {
        title: 'Graph',
        key: '/charts',
        icon: 'area-chart',
        children: [
            {
                title: 'Bar Chart',
                key: '/charts/bar',
                icon: 'bar-chart'
            },
            {
                title: 'Line Chart',
                key: '/charts/line',
                icon: 'line-chart'
            },
            {
                title: 'Pie Chart',
                key: '/charts/pie',
                icon: 'pie-chart'
            },
        ]
    },

    {
        title: 'Order Management',
        key: '/order',
        icon: 'windows',
    },
]

export default menuList