export const menuLinks = [
    {
        route: "/",
        label: "Home"
    },
    {
        route: "/about",
        label: "About"
    },
    {
        route: "/blog",
        label: "Blog"
    },
    {
        route: "/contact",
        label: "Contact"
    }
]

export const FooterApiLinks = [
    {
        route: "/",
        label: "Live matches"
    },
    {
        route: "/",
        label: "Today matches"
    },
    {
        route: "/",
        label: "Tomorrow matches"
    }
]

export const RateDetails = [
    {
        profile: '/first-rater.svg',
        name: 'Arthur Michael',
        message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, culpa ullam, voluptatem odit, sunt veritatis facere accusamus maiores odio assumenda sequi est vero amet impedit hic! Sapiente veritatis totam at?',
        rates: 4
    },
    {
        profile: '/fourth-rater.svg',
        name: 'Arthur Michael',
        message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, culpa ullam, voluptatem odit, sunt veritatis facere accusamus maiores odio assumenda sequi est vero amet impedit hic! Sapiente veritatis totam at?',
        rates: 5
    },
    {
        profile: '/third-rater.svg',
        name: 'Arthur Michael',
        message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, culpa ullam, voluptatem odit, sunt veritatis facere accusamus maiores odio assumenda sequi est vero amet impedit hic! Sapiente veritatis totam at?',
        rates: 4
    },
]

export const MobileHomeMenuLinks = [
    {
        route: '/',
        name: 'Home',
        icon: '/home-icon.svg'
    },
    {
        route: '/',
        name: 'Leagues',
        icon: '/trophy-icon.svg'
    },
    {
        route: '/',
        name: 'Bets',
        icon: '0'
    },
    {
        route: '/',
        name: 'Betslips',
        icon: '/betslip-icon.svg'
    },
]

export const EventMenuLinks = [
    {
       link: '/',
       name: 'All' 
    },
    {
       link: '/',
       name: 'Live' 
    },
    {
       link: '/',
       name: 'Today' 
    },
    {
       link: '/',
       name: 'Tomorrow' 
    },
]

export const ProfileMenuLinks = [
    {
        route: '/profile',
        icon: '/personal-profile-icon.svg',
        name: 'Personal profile'
    },
    {
        route: '/deposit',
        icon: '/deposit-icon.svg',
        name: 'Make a deposit'
    },
    {
        route: '/withdrawal',
        icon: '/withdraw-icon.svg',
        name: 'Withdraw funds'
    },
    {
        route: '/transactions',
        icon: '/transaction-icon.svg',
        name: 'Transactions history'
    },
    {
        route: '/bet_history',
        icon: '/betslip-icon.svg',
        name: 'Bet history'
    },
]

export const AdminMainMenuLinks = [
    {
        route: '/dashboard',
        icon: '/home-icon.svg',
        name: 'Dashboard'
    },
    {
        route: '/activation-pin',
        icon: '/subscription-icon.svg',
        name: 'Subscription'
    }
]

export const AdminSubMenuLinks = [
    {
        title: 'Identity verification',
        routes: [
            {
                route: '/KYC-verification',
                icon: '/kyc-verification-icon.svg',
                name: 'KYC verification'
            },
            {
                route: '/KYC-logs',
                icon: '/kyc-log-icon.svg',
                name: 'KYC Logs'
            },
        ]
    },
    {
        title: 'Transactions',
        routes: [
            {
                route: '/payment-methods',
                icon: '/payment-method-icon.svg',
                name: 'Payment methods'
            },
            {
                route: 'deposit-requests',
                icon: '/deposit-icon.svg',
                name: 'Deposit requests'
            },
            {
                route: 'withdrawal-requests',
                icon: '/withdraw-icon.svg',
                name: 'Withdrawal requests'
            },
        ]
    },
    {
        title: 'Manage Bets',
        routes: [
            {
                route: '/stake-bets',
                icon: '/stake-bet-icon.svg',
                name: 'Stake user bets'
            },
            {
                route: '/user-bet-history',
                icon: '/betSlip-icon.svg',
                name: 'Bet history'
            }
        ]
    }
]

export const PaymentMethods = [
    {
        id: '1',
        description: 'Binance ID'
    },
    {
        id: '2',
        description: 'Crypto Wallets'
    },
    {
        id: '3',
        description: 'Bank Accounts'
    },
    {
        id: '4',
        description: "Int'l Payment Platforms"
    }
]