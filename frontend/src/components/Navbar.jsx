import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/funcionarios", label: "Funcionários" },
  { to: "/cargos", label: "Cargos" },
  { to: "/departamentos", label: "Departamentos" },
  { to: "/folhas", label: "Folhas de Pagamento" },
  { to: "/lancamentos", label: "Lançamentos" },
];

export default function Navbar() {
  const { tema, alternarTema } = useTheme();

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between">
      <span className="font-semibold text-lg">Folha de Pagamentos</span>

      <NavigationMenu>
        <NavigationMenuList>
          {links.map(({ to, label }) => (
            <NavigationMenuItem key={to}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive ? "font-semibold text-primay" : ""
                  }
                >
                  {label}
                </NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Button variant="ghost" size="sm" onClick={alternarTema}>
        {tema === "dark" ? "☀️ Claro" : "🌙 Escuro"}
      </Button>
    </header>
  );
}
