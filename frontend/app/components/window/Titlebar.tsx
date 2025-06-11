import { useEffect, useState } from 'react'
import { useWindowContext } from './WindowContext'
import { useTitlebarContext } from './TitlebarContext'
import { TitlebarMenu } from './TitlebarMenu'
import { Badge } from '../ui/badge'

export const Titlebar = () => {
  const { title, icon, titleCentered, menuItems } = useWindowContext().titlebar
  const { menusVisible, setMenusVisible, closeActiveMenu } = useTitlebarContext()
  const wcontext = useWindowContext().window

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && menuItems?.length) {
        // Ignore repeated keydown events
        if (e.repeat) return
        // Close active menu if it's open
        if (menusVisible) closeActiveMenu()
        setMenusVisible(!menusVisible)
      }
    }

    // Add event listener for Alt key
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menusVisible, closeActiveMenu, setMenusVisible, menuItems])

  return (
    <div className={`window-titlebar z-[999] ${wcontext?.platform ? `platform-${wcontext.platform}` : ''}`}>
      {wcontext?.platform === 'win32' && (
        <div className="window-titlebar-icon">
          <img src={icon} />
        </div>
      )}

      <div
        className="window-titlebar-title"
        {...(titleCentered && { 'data-centered': true })}
        style={{ visibility: menusVisible ? 'hidden' : 'visible' }}
      >
        {title}
      </div>
      {menusVisible && <TitlebarMenu />}
      {wcontext?.platform === 'win32' && <TitlebarControls />}

    </div>
  )
}

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="flex justify-center items-center gap-2 text-sm cursor-pointer pt-2 pe-2">
      <Badge variant="secondary" onClick={toggleDarkMode} className='px-4 py-1'>
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </Badge>
    </div>
  )
}


const TitlebarControls = () => {
  const closePath =
    'M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z'
  const maximizePath = 'M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z'
  const restorePath = 'M2 1 H9 V8 H7 V3 H2 Z M1 2 V9 H6 V4 H1 Z';
  const minimizePath = 'M 0,5 10,5 10,6 0,6 Z'
  const [isMaximized, setIsMaximized] = useState(false)
  const wcontext = useWindowContext().window

  useEffect(() => {
    window.api.on('window-maximized', () => {
      setIsMaximized(true)
    })
    window.api.on('window-unmaximized', () => {
      setIsMaximized(false)
    })

    window.api.invoke('is-window-maximized').then((result) => {
      setIsMaximized(result)
    })

    return () => {
      window.api.removeAllListeners('window-maximized')
      window.api.removeAllListeners('window-unmaximized')
    }
  }, [])

  return (
    <div className="window-titlebar-controls">
      <DarkModeToggle />
      {wcontext?.minimizable && <TitlebarControlButton label="minimize" svgPath={minimizePath} />}
      {wcontext?.maximizable && (
        <TitlebarControlButton
          label={isMaximized ? "restore" : "maximize"}
          svgPath={isMaximized ? restorePath : maximizePath}
        />
      )}
      <TitlebarControlButton label="close" svgPath={closePath} />
    </div>
  )
}

const TitlebarControlButton = ({ svgPath, label }: { svgPath: string; label: string }) => {
  const handleAction = () => {
    switch (label) {
      case 'minimize':
        window.api.invoke('window-minimize')
        break
      case 'maximize':
        window.api.invoke('window-maximize-toggle')
        break
      case 'restore':
        window.api.invoke('window-maximize-toggle')
        break
      case 'close':
        window.api.invoke('window-close')
        break
      default:
        console.warn(`Unhandled action for label: ${label}`)
    }
  }

  return (
    <div aria-label={label} className="titlebar-controlButton" onClick={handleAction} title={label.charAt(0).toUpperCase() + label.slice(1)}>
      <svg width="10" height="10">
        <path fill="currentColor" d={svgPath} />
      </svg>
    </div>
  )
}

export interface TitlebarProps {
  title: string
  titleCentered?: boolean
  icon?: string
  menuItems?: TitlebarMenu[]
}
