import React from 'react';
import { motion } from 'motion/react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center p-2">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        className="w-1.5 h-1.5 bg-primary rounded-full"
      />
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        className="w-1.5 h-1.5 bg-primary rounded-full"
      />
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        className="w-1.5 h-1.5 bg-primary rounded-full"
      />
    </div>
  );
}
