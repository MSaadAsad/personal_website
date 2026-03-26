export function ToLetCard() {
  return (
    <div
      className="overflow-hidden flex flex-col h-full"
      style={{
        border: '1px solid rgba(74, 74, 72, 0.55)',
        boxShadow:
          '0 6px 12px rgba(46, 46, 44, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -4px 10px rgba(46, 46, 44, 0.12)',
      }}
    >
      {/* Hole: punch erases the isolated parent's concrete, mesh sits over the gap */}
      <div className="aspect-[4/3] border-b border-concrete-700/50 relative">
        <div className="to-let-mesh" />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow:
              'inset 5px 5px 18px rgba(0, 0, 0, 0.42), inset -2px -2px 10px rgba(0, 0, 0, 0.22)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Info strip — solid concrete, grows to fill full cell height */}
      <div
        className="flex items-center px-4 py-3 flex-grow"
        style={{ backgroundColor: 'var(--color-concrete-block)' }}
      >
        <span className="font-mono text-[0.75rem] font-semibold text-concrete-600 tracking-wider">
          [INSERT NEW CARD HERE]
        </span>
      </div>
    </div>
  );
}
