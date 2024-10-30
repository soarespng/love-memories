"use client";

export default function SyncPage() {
  const code = '66704';
  const codeArray = code.split('');

  return (
    <div className="min-h-screen w-full">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen bg-white">
        <div className="flex-1 p-6 flex flex-col">
          <div className="mb-8 p-8 bg-blue-300 rounded-2xl">
            <img
              src="https://nrvzuwrimkiqhphdsusa.supabase.co/storage/v1/object/public/home-images/slider-images/Woman%20and%20man%20giving%20each%20other%20high%20five.png"
              alt="High five illustration"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">
              Seu código:
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Mande este código de verificação para seu parceiro
            </p>
          </div>

          {/* Code boxes */}
          <div className="flex gap-2 mb-6">
            {codeArray.map((digit, index) => (
              <div
                key={index}
                className="flex-1 h-16 bg-white rounded-lg flex items-center justify-center text-2xl border border-gray-200 shadow-sm"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>
          </div>

          {/* Input form */}
          <form className="space-y-4 w-full">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Insira o código:
              </label>
              <input
                type="number"
                className="w-full p-3 rounded-lg border border-gray-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800"
            >
              Sincronizar
            </button>
            <button
                  type="submit"
                  className="w-full bg-red-700 text-white p-3 rounded-lg"
                  onClick={() => {localStorage.removeItem("token")}}
                >
                  Voltar
                </button>
          </form>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full justify-center items-center">
        <div className="flex h-screen w-full">
          <div className="w-1/2 flex items-center justify-center">
            <div className="w-8/12">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Seu código:
                </h2>
                <label className="block text-sm text-gray-700 mb-6">
                  Mande este código de verificação para seu parceiro
                </label>
                <div className="flex justify-between gap-4">
                  {codeArray.map((digit, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-3xl border border-gray-200 shadow-sm"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou</span>
                  </div>
                </div>
              </div>

              <form className="space-y-4 w-full">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Insira o código:
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-lg border border-gray-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800"
                >
                  Sincronizar
                </button>
                <button
                  type="submit"
                  className="w-full bg-red-700 text-white p-3 rounded-lg"
                  onClick={() => {localStorage.removeItem("token")}}
                >
                  Voltar
                </button>
              </form>
            </div>
          </div>

          <div className="w-1/2 flex items-center p-16 justify-center">
            <div className="h-full bg-blue-300 rounded-2xl w-full overflow-hidden flex flex-col">
              <div className="flex-grow flex items-center justify-center px-8">
                <img
                  src="https://nrvzuwrimkiqhphdsusa.supabase.co/storage/v1/object/public/home-images/slider-images/Woman%20and%20man%20giving%20each%20other%20high%20five.png"
                  alt="High five illustration"
                  className="w-fit h-auto"
                />
              </div>
              <div className="p-4 text-center text-sm">
                <a href="#" className="hover:underline">Contatos</a>
                <span className="mx-2">|</span>
                <a href="#" className="hover:underline">Redes sociais</a>
                <span className="mx-2">|</span>
                <a href="#" className="hover:underline">FAQ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}