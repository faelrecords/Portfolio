export function Brand({ brand, compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand--compact' : ''}`} href="/home/" aria-label="Fael Records — página inicial">
      <img src={brand.logo || '/assets/logo.svg'} alt="" width={compact ? 34 : 42} height={compact ? 34 : 42} />
      <span className="brand__text">
        <strong>{brand.name}</strong>
        {!compact && <small>{brand.tagline}</small>}
      </span>
    </a>
  );
}
