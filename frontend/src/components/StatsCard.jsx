import { motion } from "framer-motion";

function StatsCard({
    title,
    value,
    icon,
    color
}) {

    return (

        <motion.div

            whileHover={{
                scale: 1.04
            }}

            className="bg-white rounded-2xl shadow-lg p-6"

        >

            <div className="flex justify-between items-center">

                <div>

                    <h3 className="text-gray-500">

                        {title}

                    </h3>

                    <h1 className="text-4xl font-bold mt-2">

                        {value}

                    </h1>

                </div>

                <div
                    className="text-5xl"
                    style={{
                        color
                    }}
                >
                    {icon}
                </div>

            </div>

        </motion.div>

    );
}

export default StatsCard;