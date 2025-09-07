import React from "react";
import { motion } from "framer-motion";
import { AnimatedGradient } from "@/components/ui/animated-gradient-with-svg";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  colors: string[];
  delay: number;
  className?: string;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  colors,
  delay,
  className = "",
  children,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay + 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={`relative overflow-hidden h-full bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <AnimatedGradient colors={colors} speed={0.05} blur="medium" />
      <motion.div
        className="relative z-10 p-6 text-foreground"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h3 
          className="text-sm font-medium text-muted-foreground mb-2" 
          variants={item}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-3xl font-bold mb-1 text-foreground"
          variants={item}
        >
          {value}
        </motion.p>
        {subtitle && (
          <motion.p 
            className="text-xs text-muted-foreground" 
            variants={item}
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div variants={item} className="mt-4">
            {children}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export { DashboardCard };