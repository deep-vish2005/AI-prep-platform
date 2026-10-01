function PagePlaceholder({ title, description }) {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {title}
        </h1>

        <p className="mt-2 text-sm text-muted md:text-base">{description}</p>
      </div>

      <div className="rounded-xl border border-dashed border-line-strong bg-white p-12 text-center">
        <p className="text-sm font-medium text-slate-500">
          The Stitch design will be implemented here.
        </p>
      </div>
    </section>
  );
}

export default PagePlaceholder;
