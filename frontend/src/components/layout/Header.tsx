
interface HeaderProps {
  titulo: string;
  descricao: string;
}

export default function Header({
  titulo,
  descricao,
}: HeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {titulo}
      </h1>

      <p className="mt-2 text-gray-600">
        {descricao}
      </p>
    </header>
  );
}
