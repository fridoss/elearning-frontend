import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav className="navbar">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 
            rounded-lg flex items-center 
            justify-center">
            <span className="text-white 
              font-bold text-sm">E</span>
          </div>
          <h1 className="text-white text-xl 
            font-bold tracking-tight">
            eLearning
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/login"
            className="text-blue-100 
              hover:text-white px-4 py-2 
              rounded-lg transition text-sm 
              font-medium">
            Connexion
          </Link>
          <Link href="/register"
            className="bg-blue-500 text-white 
              px-4 py-2 rounded-lg hover:bg-blue-400 
              transition text-sm font-semibold">
            S'inscrire gratuitement
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br 
        from-slate-900 via-blue-950 to-slate-900 
         pt-20 pb-24 px-8 w-full">
        <div className="max-w-4xl mx-auto 
          text-center fade-in">
          <h2 className="text-5xl font-bold 
            text-white mb-4 leading-tight tracking-tight">
            Développez vos compétences
            <span className="text-blue-400">
              {' '}à votre rythme
            </span>
          </h2>
          <p className="text-slate-300 text-xl 
            mb-10 max-w-2xl mx-auto leading-relaxed">
            Accédez à des cours de qualité, 
            obtenez des certificats reconnus et 
            évoluez dans votre carrière.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register"
              className="bg-blue-500 text-white 
                px-8 py-4 rounded-xl text-lg 
                font-semibold hover:bg-blue-400 
                transition shadow-lg 
                shadow-blue-500/25">
              Commencer gratuitement →
            </Link>
            <Link href="/login"
              className="border border-slate-600 
                text-slate-300 px-8 py-4 rounded-xl 
                text-lg font-semibold 
                hover:border-slate-400 
                hover:text-white transition">
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b 
        border-slate-100 py-12">
        <div className="max-w-4xl mx-auto 
          grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold 
              text-slate-800">100+</p>
            <p className="text-slate-500 text-sm 
              mt-1">Cours disponibles</p>
          </div>
          <div>
            <p className="text-3xl font-bold 
              text-slate-800">500+</p>
            <p className="text-slate-500 text-sm 
              mt-1">Apprenants actifs</p>
          </div>
          <div>
            <p className="text-3xl font-bold 
              text-slate-800">95%</p>
            <p className="text-slate-500 text-sm 
              mt-1">Taux de satisfaction</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-24 px-8 w-full">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold 
            text-slate-800 text-center mb-4">
            Pourquoi choisir eLearning ?
          </h3>
          <p className="text-slate-500 text-center 
            mb-12 max-w-2xl mx-auto">
            Une plateforme complète pour apprendre,
            pratiquer et obtenir des certifications
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-8">
              <div className="w-12 h-12 bg-blue-50 
                rounded-xl flex items-center 
                justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h4 className="font-bold text-slate-800 
                text-lg mb-2">Cours de qualité</h4>
              <p className="text-slate-500 text-sm 
                leading-relaxed">
                Des cours créés par des experts 
                et mis à jour régulièrement
              </p>
            </div>
            <div className="card p-8">
              <div className="w-12 h-12 bg-green-50 
                rounded-xl flex items-center 
                justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-bold text-slate-800 
                text-lg mb-2">Apprenez partout</h4>
              <p className="text-slate-500 text-sm 
                leading-relaxed">
                Accédez à vos cours depuis 
                n'importe quel appareil, à tout moment
              </p>
            </div>
            <div className="card p-8">
              <div className="w-12 h-12 bg-purple-50 
                rounded-xl flex items-center 
                justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-bold text-slate-800 
                text-lg mb-2">Certificats officiels</h4>
              <p className="text-slate-500 text-sm 
                leading-relaxed">
                Obtenez des certificats 
                téléchargeables à la fin de chaque cours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r 
        from-blue-600 to-blue-700 py-20 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold 
            text-white mb-4">
            Prêt à commencer votre apprentissage ?
          </h3>
          <p className="text-blue-100 mb-8">
            Rejoignez des milliers d'apprenants 
            et développez vos compétences dès aujourd'hui
          </p>
          <Link href="/register"
            className="bg-white text-blue-600 
              px-8 py-4 rounded-xl font-bold 
              hover:bg-blue-50 transition shadow-lg">
            Créer un compte gratuit
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="bg-slate-900 text-slate-400 py-8 px-8 text-center"
        style={{ marginTop: 'auto' }}>
        <p className="text-sm">
          © 2026 eLearning Platform. Tous droits réservés.
        </p>
      </footer>

    </div>
  );
}