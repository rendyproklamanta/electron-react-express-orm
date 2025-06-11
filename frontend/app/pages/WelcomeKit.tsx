import { useState } from 'react'
import EraShape from '../components/welcome/EraShape'
import EraContent from '../components/welcome/contents/EraContent'
import ElectronContent from '../components/welcome/contents/ElectronContent'
import ReactContent from '../components/welcome/contents/ReactContent'
import ViteContent from '../components/welcome/contents/ViteContent'
import ShadContent from '../components/welcome/contents/ShadContent'
import TailwindContent from '../components/welcome/contents/TailwindContent'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/styles.css'
import Burger from '../components/Burger'

export default function WelcomeKit() {
  const [activePath, setActivePath] = useState<number>(5)

  const handlePathHover = (index: number) => {
    setActivePath(index)
  }

  const handlePathReset = () => {
    setActivePath(5)
  }

  const content = () => {
    switch (activePath) {
      case 0:
        return <ElectronContent />
      case 1:
        return <ReactContent />
      case 2:
        return <ViteContent />
      case 3:
        return <ShadContent />
      case 4:
        return <TailwindContent />
      case 5:
        return <EraContent />
      default:
        return <EraContent />
    }
  }

  return (
    <>
      <Burger breadcrumbs="Onboarding" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex gap-5 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={'content-' + activePath}
              style={{ zIndex: 2, flex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
            >
              {content()}
            </motion.div>
          </AnimatePresence>
          <EraShape onPathHover={handlePathHover} onPathReset={handlePathReset} />
        </div>
      </div>
    </>
  )
}