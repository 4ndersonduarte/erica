import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="container-custom py-10 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
              Politica de privacidade
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Como usamos seus dados
            </h1>
            <div className="mt-8 space-y-6 rounded-lg border border-cream-border bg-white p-6 leading-relaxed text-ink-muted shadow-card">
              <p>
                Coletamos nome, e-mail, telefone e informacoes enviadas nos formularios para responder contatos, encaminhar propostas e avaliar anuncios de imoveis.
              </p>
              <p>
                Os dados de contato do anunciante sao usados apenas para atendimento e validacao do anuncio. Eles nao aparecem publicamente no site sem revisao administrativa.
              </p>
              <p>
                Ao enviar uma proposta pelo WhatsApp, a mensagem e aberta no aplicativo com os dados preenchidos por voce. O envio final acontece dentro do WhatsApp.
              </p>
              <p>
                Voce pode solicitar correcao ou remocao dos seus dados entrando em contato pelos canais oficiais da Erica Imoveis.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
