import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";

function StatusCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold mb-5">
        AI Status
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Llama 3.2</span>

          <span className="text-green-600 flex items-center gap-2">
            <FaCircle size={10}/>
            Online
          </span>
        </div>

        <div className="flex justify-between">
          <span>YOLO Detector</span>

          <span className="text-green-600">
            Loaded
          </span>
        </div>

        <div className="flex justify-between">
          <span>MediaPipe</span>

          <span className="text-green-600">
            Active
          </span>
        </div>

        <div className="flex justify-between">
          <span>Backend</span>

          <span className="text-green-600">
            Connected
          </span>
        </div>

      </div>
    </motion.div>
  );
}

export default StatusCard;