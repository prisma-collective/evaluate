import { motion } from 'framer-motion'
import Link from 'next/link';

interface SimpleButtonProps {
  redirectTo: string;
  buttonText: string;
  className?: string; 
}

const SimpleButton: React.FC<SimpleButtonProps> = ({ redirectTo, buttonText, className }) => {
  return (
    <Link href={redirectTo}>
        <motion.button
        style={{
            padding: '5px 14px',
            background: 'transparent',
            color: '#fff',
            border: '1.5px solid white',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'background 0.3s, transform 0.3s, box-shadow 0.3s',
        }}
        whileHover={{ background: '#fff', color: '#000' }} // Darker shadow on hover
        whileTap={{ scale: 0.95 }} // Slightly smaller on tap
        className={className}
        >
        {buttonText}
        </motion.button>
    </Link>
  )
}

export default SimpleButton
