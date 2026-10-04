/**
 * Initial functional props and default application state for the Insights Google Forms clone platform.
 * Provides fallback values, Google OAuth configuration, question hierarchy blueprints, and initial date ranges.
 */
export const initialAuthProps = {
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "1082736458923-demo-google-oauth-client-id.apps.googleusercontent.com",
    defaultRole: "employee",
    roleOptions: [
        { id: "authority", label: "Executive / Authority", defaultRoute: "/authority" },
        { id: "employee", label: "Operator / Employee", defaultRoute: "/employee" },
        { id: "customer", label: "Customer / External", defaultRoute: "/customer" }
    ],
    mockAccounts: [
        { email: "admin@company.com", role: "authority", name: "Director John" },
        { email: "factory@company.com", role: "employee", name: "Operator Alex" },
        { email: "client@company.com", role: "customer", name: "Client Acme Corp" }
    ]
};

export const initialFormProps = {
    formId: "form_daily_operations_v1",
    title: "Daily Corporate Operations Tracker",
    description: "Tracks site performance metrics, sales conversions, and operational fulfillment.",
    initialQuestions: [
        {
            _id: "q_sales_parent",
            shortHeading: "sales_metrics",
            questionText: "Sales & Revenue Performance",
            dataType: "matrix_row",
            parentId: null,
            sortOrder: 1
        },
        {
            _id: "q_sales_online",
            shortHeading: "online_conversions",
            questionText: "Online Channel Conversions",
            dataType: "number",
            isCumulativeTracked: true,
            minExpectedValue: 10,
            maxExpectedValue: 500,
            parentId: "q_sales_parent",
            sortOrder: 1
        },
        {
            _id: "q_sales_retail",
            shortHeading: "retail_conversions",
            questionText: "Retail Physical Store Conversions",
            dataType: "number",
            isCumulativeTracked: true,
            minExpectedValue: 5,
            maxExpectedValue: 300,
            parentId: "q_sales_parent",
            sortOrder: 2
        },
        {
            _id: "q_ops_parent",
            shortHeading: "ops_fulfillment",
            questionText: "Operational Fulfillment",
            dataType: "matrix_row",
            parentId: null,
            sortOrder: 2
        },
        {
            _id: "q_fulfillment_speed",
            shortHeading: "fulfillment_avg_hr",
            questionText: "Average Order Fulfillment (Hours)",
            dataType: "number",
            isCumulativeTracked: false,
            minExpectedValue: 1,
            maxExpectedValue: 48,
            parentId: "q_ops_parent",
            sortOrder: 1
        }
    ]
};

export const initialReportProps = {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // 1st of current month
    endDate: new Date().toISOString().split('T')[0], // Today
    sampleMetrics: [
        {
            questionId: "q_sales_online",
            shortHeading: "online_conversions",
            questionText: "Online Channel Conversions",
            parentId: "q_sales_parent",
            vectors: { baseline: 1250, periodProgress: 320, total: 1570 }
        },
        {
            questionId: "q_sales_retail",
            shortHeading: "retail_conversions",
            questionText: "Retail Physical Store Conversions",
            parentId: "q_sales_parent",
            vectors: { baseline: 890, periodProgress: 210, total: 1100 }
        },
        {
            questionId: "q_fulfillment_speed",
            shortHeading: "fulfillment_avg_hr",
            questionText: "Average Order Fulfillment (Hours)",
            parentId: "q_ops_parent",
            vectors: { baseline: 22, periodProgress: -4, total: 18 }
        }
    ]
};

export const defaultAppProps = {
    auth: initialAuthProps,
    form: initialFormProps,
    report: initialReportProps
};
