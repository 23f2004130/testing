import {
    FaHandPaper,
    FaBrain,
    FaChartLine,
    FaHistory,
    FaFilePdf,
    FaMagic
} from "react-icons/fa";

export const stats = [

    {
        title: "Palm Readings",
        value: "12",
        color: "#7C3AED",
        icon: <FaHandPaper />
    },

    {
        title: "Accuracy",
        value: "98%",
        color: "#10B981",
        icon: <FaBrain />
    },

    {
        title: "Palm Type",
        value: "Fire",
        color: "#F97316",
        icon: <FaMagic />
    },

    {
        title: "Reports",
        value: "8",
        color: "#2563EB",
        icon: <FaChartLine />
    }

];

export const quickActions = [

    {
        title: "Palm Analysis",
        description: "Analyze your palm using AI.",
        color: "#7C3AED",
        icon: <FaHandPaper />,
        path: "/palm"
    },

    {
        title: "Reading History",
        description: "View previous readings.",
        color: "#2563EB",
        icon: <FaHistory />,
        path: "/history"
    },

    {
        title: "Generate Report",
        description: "Download AI report.",
        color: "#10B981",
        icon: <FaFilePdf />,
        path: "/reports"
    }

];