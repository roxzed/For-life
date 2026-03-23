import { NavLink } from 'react-router-dom'
import { Dumbbell, Calendar, Heart, Pill, BarChart3 } from 'lucide-react'

const navItems = [
  { to: '/', icon: Dumbbell, label: 'Hoje' },
  { to: '/semana', icon: Calendar, label: 'Semana' },
  { to: '/cardio', icon: Heart, label: 'Cardio' },
  { to: '/suplementos', icon: Pill, label: 'Suplem.' },
  { to: '/painel', icon: BarChart3, label: 'Painel' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-dark-border bg-dark-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-all duration-200 ${
                isActive
                  ? 'text-neon-cyan [text-shadow:0_0_10px_rgba(0,240,255,0.5)]'
                  : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  className={isActive ? 'drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]' : ''}
                />
                <span className="font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
