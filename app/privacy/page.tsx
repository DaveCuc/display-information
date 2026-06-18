export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 md:p-20 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-slate-900">Política de Privacidad</h1>
        <p className="mb-4 text-sm text-slate-500">Última actualización: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-3">1. Información que recopilamos</h2>
            <p>
              Display Information solicita acceso a tu cuenta de Google Calendar de forma de solo lectura ("readonly").
              Solo recopilamos y accedemos a los detalles de los eventos (títulos, descripciones, y horarios) estrictamente
              necesarios para mostrarlos en tu panel (Dashboard) personal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">2. Uso de la Información</h2>
            <p>
              La información obtenida desde Google Calendar NO se almacena permanentemente en ninguna base de datos propia.
              Los datos se obtienen al vuelo (on-the-fly) y se mantienen únicamente durante tu sesión activa para
              renderizar la interfaz gráfica del panel. No vendemos, alquilamos ni compartimos esta información con terceros.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">3. Uso Limitado de Google (Google Limited Use Requirements)</h2>
            <p>
              El uso que hace Display Information de la información recibida de las APIs de Google se adhiere a la 
              <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline mx-1" target="_blank" rel="noreferrer">
                Política de Datos del Usuario de Servicios API de Google
              </a>,
              incluyendo los requisitos de Uso Limitado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">4. Seguridad</h2>
            <p>
              Tu seguridad es nuestra prioridad. Utilizamos NextAuth.js para asegurar el inicio de sesión OAuth 2.0 y
              encriptamos todas las cookies de sesión. Ninguna contraseña o credencial de Google se expone a nuestra aplicación.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">5. Contacto</h2>
            <p>
              Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos enviando un comentario a través de la sección de Feedback dentro de la aplicación.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
}
