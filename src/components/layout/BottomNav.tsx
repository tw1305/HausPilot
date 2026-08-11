import { NavLink } from 'react-router-dom'
import { IconHome, IconCar, IconDocument, IconShoppingCart, IconWrench, IconReceipt, IconLeaf } from './NavIcons'
import { categories, navOrder, type CategoryKey } from '../../theme/categories'

const icons: Record<CategoryKey, typeof IconHome> = {
  dashboard: IconHome,
  fahrzeuge: IconCar,
  garten: IconLeaf,
  vertraege: IconDocument,
  dokumente: IconReceipt,
  einkaufsliste: IconShoppingCart,
  haustechnik: IconWrench,
}

const tabs = navOrder.map((key) => ({
  cat: categories[key],
  Icon: icons[key],
  end: key === 'dashboard',
}))

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-[#c9b896] bg-[#ddd0b3]/95 backdrop-blur safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-7">
        {tabs.map(({ cat, Icon, end }) => (
          <NavLink
            key={cat.path}
            to={cat.path}
            end={end}
            className="flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] transition-colors"
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? cat.text : 'text-slate-400'}`} />
                <span className={isActive ? cat.text : 'text-slate-400'}>{cat.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
