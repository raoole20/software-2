import Link from "next/link"

interface Creator {
  name: string
  role: string
  linkedin?: string
}

const creators: Creator[] = [
  {
    name: "Raul Espina",
    role: "Backend / Coordinación",
    linkedin: undefined, // Agregar enlace si se proporciona
  },
  {
    name: "Cristóbal Ramires",
    role: "Arquitectura / Diseño",
    linkedin: "https://www.linkedin.com/in/crist%C3%B3bal-charles-1700b036a",
  },
  {
    name: "Juan Manuel Andrade",
    role: "Frontend / UX",
    linkedin: "https://www.linkedin.com/in/juan-manuel-andrade-6a6748398",
  },
]

export default function NosotrosPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Nosotros</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Equipo responsable del desarrollo y mantenimiento de la plataforma.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((c) => (
          <li
            key={c.name}
            className="rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <h2 className="font-semibold leading-tight">{c.name}</h2>
            <p className="text-xs text-muted-foreground mb-3">{c.role}</p>
            {c.linkedin ? (
              <Link
                href={c.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                LinkedIn
              </Link>
            ) : (
              <span className="text-xs italic text-muted-foreground">
                LinkedIn pendiente
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="text-xs text-muted-foreground pt-4 border-t">
        Si falta información o algún enlace, por favor proporciónalo para
        actualizarlo.
      </div>
    </div>
  )
}
