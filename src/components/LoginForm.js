// components/LoginForm.js
const LoginForm = ({ email, setEmail, password, setPassword, handleSubmit, error }) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Exemplo@email.com"
            className="w-full p-3 rounded-lg border border-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full p-3 rounded-lg border border-gray-200"
          />
        </div>
        <div className="text-right">
          <a href="#" className="text-blue-600 text-sm">
            Esqueceu a senha?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800"
        >
          Entrar
        </button>
      </form>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-gray-600">
        Não tem uma conta?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Cadastre-se
        </a>
      </p>
    </>
  );
};

export default LoginForm;
