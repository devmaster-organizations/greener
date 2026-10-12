export default function Sidebar() {
    return(
        <aside className="w-64 min-h-screen bg-green-950 text-white p-6">
            <h1 className="text-2x1 font-bold mb-10">
                GreenER
            </h1>

            <nav>
                <ul className="space-y-2">
                    <li className="rounded-lg bg-green-800 px-4 py-2 font-medium">
                        Dashboard
                    </li>
                    <li>Serviços</li>
                    <li>Histórico</li>
                    <li>Comparações</li>
                    <li>Configurações</li>
                </ul>
            </nav>
        </aside>

    )
 
}