export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 md:p-20 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-slate-900">Condiciones de Servicio</h1>
        <p className="mb-4 text-sm text-slate-500">Última actualización: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar la aplicación Display Information, aceptas estar sujeto a estas Condiciones de Servicio. 
              Si no estás de acuerdo con alguna parte de los términos, no debes usar la aplicación.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">2. Descripción del Servicio</h2>
            <p>
              Display Information es un panel (Dashboard) de visualización que se conecta a tu Google Calendar para
              mostrar tus próximos eventos utilizando una interfaz inmersiva basada en sistemas FIDS de transporte.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">3. Cuenta y Seguridad</h2>
            <p>
              Para usar la aplicación, debes autenticarte utilizando tu cuenta de Google. Eres responsable de mantener 
              la confidencialidad de tu propia cuenta de Google. Display Information no almacena ni tiene acceso a tu contraseña.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">4. Limitación de Responsabilidad</h2>
            <p>
              Esta aplicación se proporciona "tal cual", sin garantías de ningún tipo. No seremos responsables de 
              pérdidas de información, reuniones perdidas o cualquier inconveniente derivado de interrupciones del 
              servicio o errores en la sincronización con la API de Google.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">5. Modificaciones del Servicio</h2>
            <p>
              Nos reservamos el derecho de modificar o discontinuar, temporal o permanentemente, el servicio con o sin previo aviso.
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
