"use client";

export default function DashboardPage() {
    return (
        <div className="space-y-8 mt-16">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Gestión centralizada de secretos y credenciales
                </p>
            </div>

            {/* Welcome Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🔐 Bienvenido al Secret Manager
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Sistema centralizado de gestión de secretos cifrados con AES-256.
                </p>

                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">🔑</span>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Secretos</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Gestiona API keys, passwords y tokens cifrados
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">📁</span>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Proyectos</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Organiza tus secretos por proyectos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">🔐</span>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">API Keys</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Genera keys para tus aplicaciones
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">📊</span>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Auditoría</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Monitorea todos los accesos y cambios
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Start */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    🚀 Inicio Rápido
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
                    <li>Navega a <strong>Proyectos</strong> y crea tu primer proyecto</li>
                    <li>Ve a <strong>Secretos</strong> y agrega tus credenciales</li>
                    <li>Genera una <strong>API Key</strong> para tus aplicaciones</li>
                    <li>Usa el cliente Python para acceder a tus secretos</li>
                </ol>
            </div>
        </div>
    );
}
