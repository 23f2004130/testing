import { motion } from "framer-motion";

function QuickActionCard({
    title,
    description,
    icon,
    color,
    onClick
}) {
    return (

        <motion.div
            whileHover={{
                scale: 1.05,
                y: -5
            }}
            whileTap={{
                scale: 0.98
            }}
            onClick={onClick}
            className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 transition-all"
        >

            <div
                className="text-5xl mb-4"
                style={{
                    color
                }}
            >
                {icon}
            </div>

            <h2 className="text-xl font-bold">

                {title}

            </h2>

            <p className="text-gray-500 mt-2">

                {description}

            </p>

        </motion.div>

    );
}

export default QuickActionCard;