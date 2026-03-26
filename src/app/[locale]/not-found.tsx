import { Link } from '@/lib/i18n/navigation';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="text-8xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            404
          </div>
          <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold-primary to-transparent" />
        </div>

        <h1
          className="text-2xl sm:text-3xl font-semibold text-text-primary mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Page Not Found
        </h1>

        <p className="text-text-secondary mb-8 leading-relaxed">
          The celestial path you seek does not exist. Perhaps the stars have a different alignment in mind.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg hover:from-gold-primary hover:to-gold-light transition-all duration-300"
          >
            Return Home
          </Link>
          <Link
            href="/panchang"
            className="px-6 py-3 border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
          >
            View Panchang
          </Link>
        </div>
      </div>
    </div>
  );
}
