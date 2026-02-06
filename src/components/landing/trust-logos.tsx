export function TrustLogos() {
  const logos = [
    "Erasmus MC",
    "UMCG",
    "Radboudumc",
    "Zorggroep Meander",
    "Tergooi",
    "Isala",
    "Amphia",
    "Catharina",
  ];

  return (
    <section className="py-12 border-b">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-gray-500 mb-8">
          Vertrouwd door toonaangevende zorgorganisaties in Nederland
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
          {logos.map((name) => (
            <div
              key={name}
              className="text-lg font-semibold text-gray-300 hover:text-gray-500 transition-colors cursor-default"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
