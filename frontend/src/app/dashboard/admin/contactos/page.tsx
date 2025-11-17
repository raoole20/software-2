import Link from "next/link"

const contactData = [
  {
    label: "Soporte general",
    value: "soporte@fundacionjb.org",
    type: "email",
  },
  {
    label: "Administración",
    value: "admin@fundacionjb.org",
    type: "email",
  },
]

const externalLinks = [
  {
    label: "LinkedIn Cristóbal",
    href: "https://www.linkedin.com/in/crist%C3%B3bal-charles-1700b036a",
  },
  {
    label: "LinkedIn Juan Manuel",
    href: "https://www.linkedin.com/in/juan-manuel-andrade-6a6748398",
  },
]

export default function ContactosPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Contactos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Canales oficiales para soporte y comunicación con el equipo.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Correos</h2>
        <ul className="divide-y rounded-lg border bg-card">
          {contactData.map((c) => (
            <li key={c.label} className="p-4 text-sm flex flex-col">
              <span className="font-medium">{c.label}</span>
              {c.type === "email" ? (
                <Link
                  href={`mailto:${c.value}`}
                  className="text-primary hover:underline break-all"
                >
                  {c.value}
                </Link>
              ) : (
                <span>{c.value}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Redes del equipo</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {externalLinks.map((l) => (
            <li key={l.href} className="rounded border p-3 text-sm">
              <Link
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-4 border-t text-xs text-muted-foreground">
        ¿Falta algún contacto o enlace? Envíalo para añadirlo.
      </div>
    </div>
  )
}
