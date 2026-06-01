import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingSubmissionForm from '@/components/ListingSubmissionForm';

export const dynamic = 'force-dynamic';

export default function AnunciarImovelPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="container-custom py-10 sm:py-14">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
              Anuncie com a Erica
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Envie seu imóvel para avaliação
            </h1>
            <p className="mt-3 text-ink-muted">
              Preencha os dados do imóvel e seu contato. O anúncio entra como pendente e só aparece no site depois da aprovação do admin.
            </p>
          </div>
          <ListingSubmissionForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
